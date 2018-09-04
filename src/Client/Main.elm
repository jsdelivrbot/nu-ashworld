module Client.Main exposing (main)

import Browser
import Browser.Navigation
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
    , message : String
    }


type Msg
    = UrlRequested Browser.UrlRequest
    | UrlChanged Url
    | Request Server.Route.Route
    | GetNotFoundResponse (Result Http.Error String)
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
      , message = "Init successful!"
      }
    , Cmd.none
    )


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        UrlRequested _ ->
            ( model, Cmd.none )

        UrlChanged _ ->
            ( model, Cmd.none )

        Request route ->
            ( model
            , Http.getString (serverEndpoint ++ Server.Route.toString route)
                |> Http.send (tagger route)
            )

        GetNotFoundResponse response ->
            ( { model | message = "Got NotFound response: " ++ Result.withDefault "error" response }
            , Cmd.none
            )

        GetSignupResponse response ->
            ( { model | message = "Got Signup response: " ++ Result.withDefault "error" response }
            , Cmd.none
            )

        GetLoginResponse response ->
            ( { model | message = "Got Login response: " ++ Result.withDefault "error" response }
            , Cmd.none
            )


tagger : Server.Route.Route -> (Result Http.Error String -> Msg)
tagger route =
    case route of
        Server.Route.NotFound ->
            GetNotFoundResponse

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
        [ H.text "Last message:"
        , H.strong [] [ H.text model.message ]
        , H.button
            [ HE.onClick (Request Server.Route.NotFound) ]
            [ H.text "NotFound" ]
        , H.button
            [ HE.onClick (Request Server.Route.Signup) ]
            [ H.text "Signup" ]
        , H.button
            [ HE.onClick (Request (Server.Route.Login 1)) ]
            [ H.text "Login 1" ]
        ]
    }
