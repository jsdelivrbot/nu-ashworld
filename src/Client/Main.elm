module Client.Main exposing (main)

import Browser
import Browser.Navigation
import Html as H exposing (Html)
import Url exposing (Url)


type alias Flags =
    ()


type alias Model =
    { navigationKey : Browser.Navigation.Key
    }


type Msg
    = UrlRequested Browser.UrlRequest
    | UrlChanged Url


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
    ( { navigationKey = key }
    , Cmd.none
    )


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        UrlRequested _ ->
            ( model, Cmd.none )

        UrlChanged _ ->
            ( model, Cmd.none )


subscriptions : Model -> Sub Msg
subscriptions model =
    Sub.none


view : Model -> Browser.Document Msg
view model =
    { title = "Ashworld"
    , body = [ H.text "TODO client code" ]
    }
