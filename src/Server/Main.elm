port module Server.Main exposing (main)

import Dict.Any as Dict exposing (AnyDict)
import Json.Encode as JE
import Platform
import Server.Route exposing (Route(..))
import Server.World
import Shared.Fight exposing (Fight, FightResult(..))
import Shared.Player exposing (PlayerId, ServerPlayer)
import Shared.World exposing (ServerWorld)
import Time exposing (Posix)


-- GENERAL


port log : String -> Cmd msg



-- HTTP


port httpRequests : (String -> msg) -> Sub msg


port httpResponse : String -> Cmd msg


sendHttpResponse : JE.Value -> Cmd msg
sendHttpResponse value =
    value
        |> JE.encode 0
        |> httpResponse


type alias Flags =
    ()


type alias Model =
    { world : Shared.World.ServerWorld
    }


type Url
    = Url String


type Msg
    = UrlRequested Url
    | HealTick Posix


main : Program Flags Model Msg
main =
    Platform.worker
        { init = init
        , update = update
        , subscriptions = subscriptions
        }


init : Flags -> ( Model, Cmd Msg )
init flags =
    ( { world = { players = Dict.empty Shared.Player.idToInt } }
    , Cmd.none
    )


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        UrlRequested (Url url) ->
            case Server.Route.fromString url of
                NotFound ->
                    ( model
                    , Cmd.batch
                        [ log ("NotFound: " ++ url)
                        , sendHttpResponse (Server.Route.encodeNotFound url)
                        ]
                    )

                Signup ->
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
                    , sendHttpResponse
                        (Server.Route.signupResponse newId newModel.world
                            |> Maybe.map Server.Route.encodeSignup
                            |> Maybe.withDefault Server.Route.encodeSignupError
                        )
                    )

                Login playerId ->
                    let
                        ( messageQueue, newModel ) =
                            getMessageQueue playerId model
                    in
                    ( newModel
                    , sendHttpResponse
                        (Server.Route.loginResponse messageQueue playerId newModel.world
                            |> Maybe.map Server.Route.encodeLogin
                            |> Maybe.withDefault Server.Route.encodeLoginError
                        )
                    )

                Refresh playerId ->
                    let
                        ( messageQueue, newModel ) =
                            getMessageQueue playerId model
                    in
                    ( newModel
                    , sendHttpResponse
                        (Server.Route.refreshResponse messageQueue playerId newModel.world
                            |> Maybe.map Server.Route.encodeRefresh
                            |> Maybe.withDefault Server.Route.encodeRefreshError
                        )
                    )

                Attack { you, them } ->
                    let
                        ( messageQueue, modelWithoutMessages ) =
                            getMessageQueue you model
                    in
                    if Server.World.isDead you model.world == Just True then
                        let
                            newMessageQueue : List String
                            newMessageQueue =
                                messageQueue ++ [ "You are dead, you can't fight." ]
                        in
                        ( modelWithoutMessages
                        , sendHttpResponse
                            (Server.Route.attackResponse newMessageQueue you modelWithoutMessages.world Nothing
                                |> Maybe.map Server.Route.encodeAttack
                                |> Maybe.withDefault Server.Route.encodeAttackError
                            )
                        )
                    else if Server.World.isDead them model.world == Just True then
                        let
                            newMessageQueue : List String
                            newMessageQueue =
                                messageQueue ++ [ "They are dead already. There's nothing else for you to do." ]
                        in
                        ( modelWithoutMessages
                        , sendHttpResponse
                            (Server.Route.attackResponse newMessageQueue you modelWithoutMessages.world Nothing
                                |> Maybe.map Server.Route.encodeAttack
                                |> Maybe.withDefault Server.Route.encodeAttackError
                            )
                        )
                    else
                        let
                            fight : Fight
                            fight =
                                -- TODO randomize
                                { log =
                                    [ "With your admin powers, you one-shot the other player. This is boring."
                                    , "The other player dies."
                                    , "You won!"
                                    ]
                                , result = YouWon
                                }

                            newWorld : ServerWorld
                            newWorld =
                                modelWithoutMessages.world
                                    |> Server.World.setPlayerHp 0 them
                                    |> Server.World.addPlayerXp 10 you
                                    |> Server.World.addPlayerMessage ("Player #" ++ Shared.Player.idToString you ++ " fought you and killed you!") them

                            newModel : Model
                            newModel =
                                modelWithoutMessages
                                    |> setWorld newWorld
                        in
                        ( newModel
                        , sendHttpResponse
                            (Server.Route.attackResponse messageQueue you newModel.world (Just fight)
                                |> Maybe.map Server.Route.encodeAttack
                                |> Maybe.withDefault Server.Route.encodeAttackError
                            )
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
        [ httpRequests (Url >> UrlRequested)
        , Time.every healTickTimeout HealTick
        ]
