port module Server.Main exposing (main)

import Dict exposing (Dict)
import Json.Encode as JE
import Platform
import Server.Route exposing (Route(..))


-- GENERAL


port log : String -> Cmd msg



-- HTTP


port httpRequests : (String -> msg) -> Sub msg


port httpResponse : String -> Cmd msg


type alias Flags =
    ()


type alias Model =
    { players : Dict PlayerId Player
    }


type alias PlayerId =
    Int


type alias Player =
    { hp : Int
    , maxHp : Int
    , xp : Int
    , secret : ()
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
            ( model
            , Cmd.batch
                [ log ("UrlRequested " ++ url)
                , httpResponse <|
                    case Server.Route.fromString url of
                        NotFound ->
                            JE.object [ ( "route", JE.string "NotFound" ) ]
                                |> JE.encode 0

                        Signup ->
                            JE.object [ ( "route", JE.string "Signup" ) ]
                                |> JE.encode 0

                        Login playerId ->
                            JE.object
                                [ ( "route", JE.string "Login" )
                                , ( "playerId", JE.int playerId )
                                ]
                                |> JE.encode 0
                ]
            )


subscriptions : Model -> Sub Msg
subscriptions model =
    httpRequests (Url >> UrlRequested)
