port module Server.Main exposing (main)

import Dict.Any as Dict exposing (AnyDict)
import Json.Encode as JE
import Platform
import Server.Route exposing (Route(..))
import Server.World
import Shared.Fight exposing (Fight, FightResult(..))
import Shared.Player exposing (PlayerId, ServerPlayer)
import Shared.World exposing (ServerWorld)


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
                    , Cmd.batch
                        [ log ("Signup: registered new player #" ++ Shared.Player.idToString newId)
                        , sendHttpResponse (Server.Route.encodeSignupSuccess newId newModel.world)
                        ]
                    )

                Attack { you, them } ->
                    let
                        fight : Fight
                        fight =
                            { log =
                                [ "With your admin poweors, you one-shot them. This is boring."
                                , "The other player dies."
                                ]
                            , result = YouWon
                            }

                        newWorld : ServerWorld
                        newWorld =
                            model.world
                                |> Server.World.setPlayerHp 0 them
                                |> Server.World.addPlayerXp 10 you

                        newModel : Model
                        newModel =
                            model
                                |> setWorld newWorld
                    in
                    ( newModel
                    , Cmd.batch
                        [ log
                            ("Attack: Player #"
                                ++ Shared.Player.idToString you
                                ++ " attacks player #"
                                ++ Shared.Player.idToString them
                            )
                        , sendHttpResponse (Server.Route.encodeAttackSuccess you fight newModel.world)
                        ]
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


subscriptions : Model -> Sub Msg
subscriptions model =
    httpRequests (Url >> UrlRequested)
