module Client.Main exposing (main)

import Browser
import Browser.Navigation
import Client.Player exposing (Player)
import Html as H exposing (Html)
import Html.Events as HE
import Http
import Json.Decode as JD exposing (Decoder)
import Server.Route exposing (toString)
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
    | GetSignupResponse (Result Http.Error String)
    | GetLoginResponse (Result Http.Error String)


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
            , Http.getString (serverEndpoint ++ Server.Route.toString route)
                |> Http.send (tagger route)
            )

        GetSignupResponse response ->
            ( model
                |> addMessage ("Got Signup response: " ++ Result.withDefault "error" response)
            , Cmd.none
            )

        GetLoginResponse response ->
            ( model
                |> addMessage ("Got Login response: " ++ Result.withDefault "error" response)
            , Cmd.none
            )


addMessage : String -> Model -> Model
addMessage message model =
    { model | messages = message :: model.messages }


tagger : Server.Route.Route -> (Result Http.Error String -> Msg)
tagger route =
    case route of
        Server.Route.NotFound ->
            always NoOp

        Server.Route.Signup ->
            GetSignupResponse

        Server.Route.Login userId ->
            GetLoginResponse


subscriptions : Model -> Sub Msg
subscriptions model =
    Sub.none


view : Model -> Browser.Document Msg
view model =
    { title = "Ashworld"
    , body =
        [ viewMessages model.messages
        , viewButtons
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
        , H.button
            [ HE.onClick (Request (Server.Route.Login 1)) ]
            [ H.text "Login 1" ]
        ]


viewPlayer : Player -> Html Msg
viewPlayer player =
    H.table []
        [ H.tr []
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
