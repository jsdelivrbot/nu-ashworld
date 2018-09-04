module Client.Main exposing (main)

import Browser
import Browser.Navigation
import Client.Player exposing (Player)
import Html as H exposing (Html)
import Html.Events as HE
import Http
import Json.Decode as JD exposing (Decoder)
import Server.Route exposing (toString)
import Shared.Player
import Url exposing (Url)


serverEndpoint : String
serverEndpoint =
    "http://localhost:3333"


type alias Flags =
    ()


type alias Model =
    { navigationKey : Browser.Navigation.Key
    , messages : List String
    , player : Maybe Player
    }


type Msg
    = NoOp
    | UrlRequested Browser.UrlRequest
    | UrlChanged Url
    | Request Server.Route.Route
    | GetSignupResponse (Result Http.Error Player)


main : Program Flags Model Msg
main =
    Browser.application
        { init = init
        , update = update
        , subscriptions = subscriptions
        , view = view
        , onUrlRequest = UrlRequested
        , onUrlChange = UrlChanged
        }


init : Flags -> Url -> Browser.Navigation.Key -> ( Model, Cmd Msg )
init flags url key =
    ( { navigationKey = key
      , messages = [ "Init successful!" ]
      , player = Nothing
      }
    , Cmd.none
    )


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        NoOp ->
            ( model, Cmd.none )

        UrlRequested _ ->
            ( model
                |> addMessage "UrlRequested TODO"
            , Cmd.none
            )

        UrlChanged _ ->
            ( model
                |> addMessage "UrlChanged TODO"
            , Cmd.none
            )

        Request route ->
            ( model
            , sendRequest route
            )

        GetSignupResponse response ->
            ( case response of
                Err _ ->
                    model
                        |> addMessage "Got bad Signup response! :("

                Ok player ->
                    model
                        |> addMessage ("Got Signup response! Player ID " ++ String.fromInt player.id)
                        |> setPlayer player
            , Cmd.none
            )


setPlayer : Player -> Model -> Model
setPlayer player model =
    { model | player = Just player }


addMessage : String -> Model -> Model
addMessage message model =
    { model | messages = message :: model.messages }


sendRequest : Server.Route.Route -> Cmd Msg
sendRequest route =
    let
        send : (Result Http.Error a -> Msg) -> Decoder a -> Cmd Msg
        send tagger decoder =
            Http.get (serverEndpoint ++ Server.Route.toString route) decoder
                |> Http.send tagger
    in
    case route of
        Server.Route.NotFound ->
            send
                (always NoOp)
                (JD.succeed ())

        Server.Route.Signup ->
            send
                GetSignupResponse
                (JD.field "player" Shared.Player.decoder)


subscriptions : Model -> Sub Msg
subscriptions model =
    Sub.none


view : Model -> Browser.Document Msg
view model =
    { title = "Ashworld"
    , body =
        [ viewButtons
        , viewMessages model.messages
        , model.player
            |> Maybe.map viewPlayer
            |> Maybe.withDefault viewNoPlayer
        ]
    }


viewMessages : List String -> Html Msg
viewMessages messages =
    H.div []
        [ H.strong [] [ H.text "Messages:" ]
        , H.ul [] (List.map viewMessage messages)
        ]


viewMessage : String -> Html Msg
viewMessage message =
    H.li [] [ H.text message ]


viewButtons : Html Msg
viewButtons =
    H.div []
        [ H.button
            [ HE.onClick (Request Server.Route.Signup) ]
            [ H.text "Signup" ]
        ]


viewPlayer : Player -> Html Msg
viewPlayer player =
    H.table []
        [ H.tr []
            [ H.th [] []
            , H.th [] [ H.text "PLAYER STATS" ]
            ]
        , H.tr []
            [ H.th [] [ H.text "ID" ]
            , H.td [] [ H.text (String.fromInt player.id) ]
            ]
        , H.tr []
            [ H.th [] [ H.text "HP" ]
            , H.td [] [ H.text (String.fromInt player.hp ++ "/" ++ String.fromInt player.maxHp) ]
            ]
        , H.tr []
            [ H.th [] [ H.text "XP" ]
            , H.td [] [ H.text (String.fromInt player.xp) ]
            ]
        ]


viewNoPlayer : Html Msg
viewNoPlayer =
    H.div [] [ H.text "No player :(" ]
