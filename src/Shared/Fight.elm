module Shared.Fight
    exposing
        ( Fight(..)
        , decoder
        , encode
        , encodeMaybe
        , maybeDecoder
        )

import Json.Decode as JD exposing (Decoder)
import Json.Encode as JE


type Fight
    = YouWon
    | YouLost


decoder : Decoder Fight
decoder =
    JD.string
        |> JD.andThen
            (\string ->
                case string of
                    "you-won" ->
                        JD.succeed YouWon

                    "you-lost" ->
                        JD.succeed YouLost

                    _ ->
                        JD.fail "Unknown Fight value"
            )


maybeDecoder : Decoder (Maybe Fight)
maybeDecoder =
    JD.maybe decoder


encode : Fight -> JE.Value
encode fight =
    JE.string
        (case fight of
            YouWon ->
                "you-won"

            YouLost ->
                "you-lost"
        )


encodeMaybe : Maybe Fight -> JE.Value
encodeMaybe maybeFight =
    maybeFight
        |> Maybe.map encode
        |> Maybe.withDefault JE.null
