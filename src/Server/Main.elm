port module Server.Main exposing (main)

import Dict exposing (Dict)
import Json.Encode as JE
import Platform
import Server.Player exposing (Player)
import Server.Route exposing (Route(..))
import Shared.Player


-- GENERAL


port log : String -> Cmd msg



-- HTTP


port httpRequests : (String -> msg) -> Sub msg


port httpResponse : String -> Cmd msg


type alias Flags =
    ()


type alias Model =
    { players : Dict Int Player
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
    ( { players = Dict.empty }
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
                        , JE.object
                            [ ( "success", JE.bool False )
                            , ( "error", JE.string ("Route \"" ++ url ++ "\" not found.") )
                            ]
                            |> JE.encode 0
                            |> httpResponse
                        ]
                    )

                Signup ->
                    let
                        newId : Int
                        newId =
                            Dict.size model.players

                        newPlayer : Player
                        newPlayer =
                            initPlayer
                    in
                    ( model
                        |> addPlayer newId newPlayer
                    , Cmd.batch
                        [ log ("Signup: registered new player " ++ String.fromInt newId)
                        , JE.object
                            [ ( "success", JE.bool True )
                            , ( "player", Shared.Player.encode newId newPlayer )
                            ]
                            |> JE.encode 0
                            |> httpResponse
                        ]
                    )


addPlayer : Int -> Player -> Model -> Model
addPlayer id player model =
    { model
        | players =
            model.players
                |> Dict.insert id player
    }


initPlayer : Player
initPlayer =
    { hp = 10
    , maxHp = 10
    , xp = 0
    , secret = ()
    }


subscriptions : Model -> Sub Msg
subscriptions model =
    httpRequests (Url >> UrlRequested)
