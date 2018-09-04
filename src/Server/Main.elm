module Server.Main exposing (main)

import Platform


type alias Flags =
    ()


type alias Model =
    ()


type alias Msg =
    ()


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
    ( (), Cmd.none )


subscriptions : Model -> Sub Msg
subscriptions model =
    Sub.none
