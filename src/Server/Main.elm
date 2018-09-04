port module Server.Main exposing (main)

import Platform


-- GENERAL


port log : String -> Cmd msg



-- HTTP


port httpRequests : (String -> msg) -> Sub msg


port httpResponse : String -> Cmd msg


type alias Flags =
    ()


type alias Model =
    ()


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
    ( (), Cmd.none )


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        UrlRequested (Url url) ->
            ( model
            , Cmd.batch
                [ log ("UrlRequested " ++ url)
                , httpResponse "{}"
                ]
            )


subscriptions : Model -> Sub Msg
subscriptions model =
    httpRequests (Url >> UrlRequested)
