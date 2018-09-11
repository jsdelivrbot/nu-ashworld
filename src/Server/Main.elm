port module Server.Main exposing (main)

import Dict.Any as Dict exposing (AnyDict)
import Json.Decode as JD exposing (Decoder)
import Json.Encode as JE
import Platform
import Server.Route exposing (AttackData, Route(..))
import Server.World
import Shared.Fight exposing (Fight(..))
import Shared.Player exposing (PlayerId, ServerPlayer)
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
                    { world = { players = Dict.empty Shared.Player.idToInt } }
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
        HttpRequest { url, response } ->
            case Server.Route.fromString url of
                NotFound ->
                    handleNotFound url response model

                Signup ->
                    handleSignup response model

                Login playerId ->
                    handleLogin playerId response model

                Refresh playerId ->
                    handleRefresh playerId response model

                Attack attackData ->
                    handleAttack attackData response model

        HttpRequestError error ->
            ( model
            , log "Server error"
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


getMessageQueue : PlayerId -> Model -> ( List String, Model )
getMessageQueue id model =
    let
        queue : List String
        queue =
            Dict.get id model.world.players
                |> Maybe.map .messageQueue
                |> Maybe.withDefault []

        newWorld : ServerWorld
        newWorld =
            model.world
                |> Server.World.emptyPlayerMessageQueue id

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


handleSignup : JE.Value -> Model -> ( Model, Cmd Msg )
handleSignup response model =
    let
        newId : PlayerId
        newId =
            Dict.size model.world.players
                |> Shared.Player.id

        newPlayer : ServerPlayer
        newPlayer =
            Shared.Player.init newId

        newModel : Model
        newModel =
            model
                |> addPlayer newId newPlayer
    in
    ( newModel
    , sendHttpResponse response
        (Server.Route.signupResponse newId newModel.world
            |> Maybe.map Server.Route.encodeSignup
            |> Maybe.withDefault Server.Route.encodeSignupError
        )
    )


handleLogin : PlayerId -> JE.Value -> Model -> ( Model, Cmd Msg )
handleLogin playerId response model =
    let
        ( messageQueue, newModel ) =
            getMessageQueue playerId model
    in
    ( newModel
    , sendHttpResponse response
        (Server.Route.loginResponse messageQueue playerId newModel.world
            |> Maybe.map Server.Route.encodeLogin
            |> Maybe.withDefault Server.Route.encodeLoginError
        )
    )


handleRefresh : PlayerId -> JE.Value -> Model -> ( Model, Cmd Msg )
handleRefresh playerId response model =
    let
        ( messageQueue, newModel ) =
            getMessageQueue playerId model
    in
    ( newModel
    , sendHttpResponse response
        (Server.Route.refreshResponse messageQueue playerId newModel.world
            |> Maybe.map Server.Route.encodeRefresh
            |> Maybe.withDefault Server.Route.encodeRefreshError
        )
    )


handleAttack : AttackData -> JE.Value -> Model -> ( Model, Cmd Msg )
handleAttack ({ you, them } as attackData) response model =
    if Server.World.isDead you model.world then
        handleAttackYouDead attackData response model
    else if Server.World.isDead them model.world then
        handleAttackThemDead attackData response model
    else
        handleAttackNobodyDead attackData response model


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
                            ("Player #" ++ Shared.Player.idToString you ++ " fought you and killed you!")
                        |> Server.World.setPlayerHp them 0
                        |> Server.World.addPlayerXp you 10

                YouLost ->
                    model.world
                        |> Server.World.addPlayerMessages you
                            [ "Even though you tried your best, you couldn't kill the other player."
                            , "You die!"
                            ]
                        |> Server.World.addPlayerMessage them
                            ("Player #" ++ Shared.Player.idToString you ++ " fought you but you managed to kill them!")
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


addPlayer : PlayerId -> ServerPlayer -> Model -> Model
addPlayer id player ({ world } as model) =
    { model
        | world =
            { world | players = world.players |> Dict.insert id player }
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
    JD.map2 HttpRequestData
        (JD.field "url" JD.string)
        (JD.field "response" JD.value)


encodeModel : Model -> JE.Value
encodeModel model =
    JE.object
        [ ( "world", Shared.World.encodeServer model.world )
        ]


modelDecoder : Decoder Model
modelDecoder =
    JD.map Model
        (JD.field "world" Shared.World.serverDecoder)
