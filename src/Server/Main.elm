port module Server.Main exposing (main)

import Dict exposing (Dict)
import Extra.Json as EJ
import Json.Decode as JD exposing (Decoder)
import Json.Decode.Extra as JDE
import Json.Encode as JE
import Platform
import Server.Route exposing (AttackData, Route(..))
import Server.World
import Shared.Fight exposing (Fight(..))
import Shared.Password exposing (Authentication)
import Shared.Player exposing (ServerPlayer)
import Shared.World exposing (ServerWorld)
import Time exposing (Posix)


-- GENERAL


port log : String -> Cmd msg



-- PERSISTENCE


port persist : JE.Value -> Cmd msg



-- HTTP


port httpRequests : (JE.Value -> msg) -> Sub msg


port httpResponse : JE.Value -> Cmd msg


sendHttpResponse : JE.Value -> JE.Value -> Cmd msg
sendHttpResponse response value =
    JE.list identity
        [ response
        , JE.string (JE.encode 0 value)
        ]
        |> httpResponse


persistModel : Model -> Cmd msg
persistModel model =
    model
        |> encodeModel
        |> persist



-- TYPES


type alias Flags =
    JE.Value


type alias Model =
    { world : Shared.World.ServerWorld
    }


type Msg
    = HealTick Posix
    | HttpRequest HttpRequestData
    | HttpRequestError JD.Error


type alias HttpRequestData =
    { url : String
    , response : JE.Value
    , headers : Dict String String
    }


main : Program Flags Model Msg
main =
    Platform.worker
        { init = init
        , update = updateWithPersist
        , subscriptions = subscriptions
        }


init : Flags -> ( Model, Cmd Msg )
init flags =
    case JD.decodeValue modelDecoder flags of
        Ok model ->
            ( model
            , Cmd.none
            )

        Err err ->
            let
                model =
                    { world = { players = Dict.empty }
                    }
            in
            ( model
            , Cmd.batch
                [ persistModel model
                , log (JD.errorToString err)
                ]
            )


updateWithPersist : Msg -> Model -> ( Model, Cmd Msg )
updateWithPersist msg model =
    let
        ( newModel, cmd ) =
            update msg model
    in
    ( newModel
    , Cmd.batch
        [ cmd
        , if model == newModel then
            Cmd.none
          else
            persistModel newModel
        ]
    )


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        HttpRequest { url, response, headers } ->
            case Server.Route.fromString url of
                NotFound ->
                    handleNotFound url response model

                Signup auth ->
                    handleSignup auth response model

                Login auth ->
                    handleLogin auth response model

                Refresh ->
                    handleRefresh (authHeaders headers) response model

                Attack attackData ->
                    handleAttack (authHeaders headers) attackData response model

        HttpRequestError error ->
            ( model
            , log (JD.errorToString error)
            )

        HealTick timeOfTick ->
            let
                newWorld : ServerWorld
                newWorld =
                    model.world
                        |> Server.World.healEverybody

                newModel : Model
                newModel =
                    model
                        |> setWorld newWorld
            in
            ( newModel
            , Cmd.none
            )


authHeaders : Dict String String -> Maybe Authentication
authHeaders headers =
    Maybe.map2 Authentication
        (Dict.get "x-username" headers)
        (Dict.get "x-hashed-password" headers)


getMessageQueue : String -> Model -> ( List String, Model )
getMessageQueue name model =
    let
        queue : List String
        queue =
            Dict.get name model.world.players
                |> Maybe.map .messageQueue
                |> Maybe.withDefault []

        newWorld : ServerWorld
        newWorld =
            model.world
                |> Server.World.emptyPlayerMessageQueue name

        newModel : Model
        newModel =
            model
                |> setWorld newWorld
    in
    ( queue, newModel )


handleNotFound : String -> JE.Value -> Model -> ( Model, Cmd Msg )
handleNotFound url response model =
    ( model
    , Cmd.batch
        [ log ("NotFound: " ++ url)
        , sendHttpResponse response (Server.Route.encodeNotFound url)
        ]
    )


handleSignup : Authentication -> JE.Value -> Model -> ( Model, Cmd Msg )
handleSignup { name, hashedPassword } response model =
    if nameExists name model.world then
        ( model
        , sendHttpResponse response (Server.Route.encodeSignupError Server.Route.NameAlreadyExists)
        )
    else
        let
            newPlayer : ServerPlayer
            newPlayer =
                Shared.Player.init name hashedPassword

            newModel : Model
            newModel =
                model
                    |> addPlayer newPlayer
        in
        ( newModel
        , sendHttpResponse response
            (case Server.Route.signupResponse name newModel.world of
                Ok signupResponse ->
                    Server.Route.encodeSignup signupResponse

                Err signupError ->
                    Server.Route.encodeSignupError signupError
            )
        )


nameExists : String -> ServerWorld -> Bool
nameExists name world =
    world.players
        |> Dict.filter (\_ player -> player.name == name)
        |> Dict.isEmpty
        |> not


handleLogin : Authentication -> JE.Value -> Model -> ( Model, Cmd Msg )
handleLogin auth response model =
    if Shared.Password.checksOut auth model.world then
        let
            ( messageQueue, newModel ) =
                getMessageQueue auth.name model
        in
        ( newModel
        , sendHttpResponse response
            (Server.Route.loginResponse messageQueue auth.name newModel.world
                |> Maybe.map Server.Route.encodeLogin
                |> Maybe.withDefault (Server.Route.encodeAuthError Server.Route.NameAndPasswordDoesntCheckOut)
            )
        )
    else
        ( model
        , sendHttpResponse response (Server.Route.encodeAuthError Server.Route.NameAndPasswordDoesntCheckOut)
        )


handleRefresh : Maybe Authentication -> JE.Value -> Model -> ( Model, Cmd Msg )
handleRefresh maybeAuth response model =
    maybeAuth
        |> Maybe.map
            (\auth ->
                if Shared.Password.checksOut auth model.world then
                    let
                        ( messageQueue, newModel ) =
                            getMessageQueue auth.name model
                    in
                    ( newModel
                    , sendHttpResponse response
                        (Server.Route.refreshResponse messageQueue auth.name newModel.world
                            |> Maybe.map Server.Route.encodeRefresh
                            |> Maybe.withDefault Server.Route.encodeRefreshError
                        )
                    )
                else
                    ( model
                    , sendHttpResponse response (Server.Route.encodeAuthError Server.Route.NameAndPasswordDoesntCheckOut)
                    )
            )
        |> Maybe.withDefault
            ( model
            , sendHttpResponse response (Server.Route.encodeAuthError Server.Route.AuthenticationHeadersMissing)
            )


handleAttack : Maybe Authentication -> AttackData -> JE.Value -> Model -> ( Model, Cmd Msg )
handleAttack maybeAuth ({ you, them } as attackData) response model =
    maybeAuth
        |> Maybe.map
            (\auth ->
                if Shared.Password.checksOut auth model.world then
                    if Server.World.isDead you model.world then
                        handleAttackYouDead attackData response model
                    else if Server.World.isDead them model.world then
                        handleAttackThemDead attackData response model
                    else
                        handleAttackNobodyDead attackData response model
                else
                    ( model
                    , sendHttpResponse response (Server.Route.encodeAuthError Server.Route.NameAndPasswordDoesntCheckOut)
                    )
            )
        |> Maybe.withDefault
            ( model
            , sendHttpResponse response (Server.Route.encodeAuthError Server.Route.AuthenticationHeadersMissing)
            )


handleAttackYouDead : AttackData -> JE.Value -> Model -> ( Model, Cmd Msg )
handleAttackYouDead { you } response model =
    let
        ( messageQueue, modelWithoutMessages ) =
            getMessageQueue you model

        newMessageQueue : List String
        newMessageQueue =
            messageQueue ++ [ "You are dead, you can't fight." ]
    in
    ( modelWithoutMessages
    , sendHttpResponse response
        (Server.Route.attackResponse newMessageQueue you modelWithoutMessages.world Nothing
            |> Maybe.map Server.Route.encodeAttack
            |> Maybe.withDefault Server.Route.encodeAttackError
        )
    )


handleAttackThemDead : AttackData -> JE.Value -> Model -> ( Model, Cmd Msg )
handleAttackThemDead { you, them } response model =
    let
        ( messageQueue, modelWithoutMessages ) =
            getMessageQueue you model

        newMessageQueue : List String
        newMessageQueue =
            messageQueue ++ [ "They are dead already. There's nothing else for you to do." ]
    in
    ( modelWithoutMessages
    , sendHttpResponse response
        (Server.Route.attackResponse newMessageQueue you modelWithoutMessages.world Nothing
            |> Maybe.map Server.Route.encodeAttack
            |> Maybe.withDefault Server.Route.encodeAttackError
        )
    )


handleAttackNobodyDead : AttackData -> JE.Value -> Model -> ( Model, Cmd Msg )
handleAttackNobodyDead { you, them } response model =
    let
        fight : Fight
        fight =
            -- TODO randomize
            YouWon

        newWorld : ServerWorld
        newWorld =
            case fight of
                YouWon ->
                    model.world
                        |> Server.World.addPlayerMessages you
                            [ "With your admin powers, you one-shot the other player. This is boring."
                            , "The other player dies."
                            , "You won!"
                            ]
                        |> Server.World.addPlayerMessage them
                            ("Player " ++ you ++ " fought you and killed you!")
                        |> Server.World.setPlayerHp them 0
                        |> Server.World.addPlayerXp you 10

                YouLost ->
                    model.world
                        |> Server.World.addPlayerMessages you
                            [ "Even though you tried your best, you couldn't kill the other player."
                            , "You die!"
                            ]
                        |> Server.World.addPlayerMessage them
                            ("Player " ++ you ++ " fought you but you managed to kill them!")
                        |> Server.World.setPlayerHp you 0
                        |> Server.World.addPlayerXp them 5

        modelAfterFight : Model
        modelAfterFight =
            model
                |> setWorld newWorld

        ( messageQueue, newModel ) =
            getMessageQueue you modelAfterFight
    in
    ( newModel
    , sendHttpResponse response
        (Server.Route.attackResponse messageQueue you newModel.world (Just fight)
            |> Maybe.map Server.Route.encodeAttack
            |> Maybe.withDefault Server.Route.encodeAttackError
        )
    )


setWorld : ServerWorld -> Model -> Model
setWorld world model =
    { model | world = world }


addPlayer : ServerPlayer -> Model -> Model
addPlayer player ({ world } as model) =
    { model
        | world =
            { world | players = world.players |> Dict.insert player.name player }
    }


healTickTimeout : Float
healTickTimeout =
    2000


subscriptions : Model -> Sub Msg
subscriptions model =
    Sub.batch
        [ httpRequests
            (\value ->
                case JD.decodeValue httpRequestDecoder value of
                    Ok result ->
                        HttpRequest result

                    Err error ->
                        HttpRequestError error
            )
        , Time.every healTickTimeout HealTick
        ]


httpRequestDecoder : Decoder HttpRequestData
httpRequestDecoder =
    JD.map3 HttpRequestData
        (JD.field "url" JD.string)
        (JD.field "response" JD.value)
        (JD.field "headers" (EJ.dictFromObject JD.string))


encodeModel : Model -> JE.Value
encodeModel model =
    JE.object
        [ ( "world", Shared.World.encodeServer model.world )
        ]


modelDecoder : Decoder Model
modelDecoder =
    JD.map Model
        (JD.field "world" Shared.World.serverDecoder)
