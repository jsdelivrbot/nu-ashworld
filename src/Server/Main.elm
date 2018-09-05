port module Server.Main exposing (main)

import Dict.Any as Dict exposing (AnyDict)
import Json.Encode as JE
import Platform
import Server.Route exposing (Route(..))
import Shared.Player exposing (PlayerId, ServerPlayer)


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
    { players : AnyDict Int PlayerId ServerPlayer
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
    ( { players = Dict.empty Shared.Player.idToInt }
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
                            Dict.size model.players
                                |> Shared.Player.id

                        newPlayer : ServerPlayer
                        newPlayer =
                            Shared.Player.init
                    in
                    ( model
                        |> addPlayer newId newPlayer
                    , Cmd.batch
                        [ log ("Signup: registered new player " ++ String.fromInt (Shared.Player.idToInt newId))
                        , sendHttpResponse (Server.Route.encodeSignupSuccess newId newPlayer)
                        ]
                    )


addPlayer : PlayerId -> ServerPlayer -> Model -> Model
addPlayer id player model =
    { model | players = model.players |> Dict.insert id player }


subscriptions : Model -> Sub Msg
subscriptions model =
    httpRequests (Url >> UrlRequested)
