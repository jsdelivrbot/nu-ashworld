module Shared.Fight
    exposing
        ( Fight
        , FightResult(..)
        , decoder
        , encode
        )

import Json.Decode as JD exposing (Decoder)
import Json.Encode as JE


type FightResult
    = YouWon
    | YouLost


type alias Fight =
    { log : List String
    , result : FightResult
    }


decoder : Decoder Fight
decoder =
    JD.map2 Fight
        (JD.field "log" (JD.list JD.string))
        (JD.field "result" fightResultDecoder)


encode : Fight -> JE.Value
encode fight =
    JE.object
        [ ( "log", JE.list JE.string fight.log )
        , ( "result", encodeFightResult fight.result )
        ]


encodeFightResult : FightResult -> JE.Value
encodeFightResult fightResult =
    JE.string
        (case fightResult of
            YouWon ->
                "you-won"

            YouLost ->
                "you-lost"
        )


fightResultDecoder : Decoder FightResult
fightResultDecoder =
    JD.string
        |> JD.andThen
            (\string ->
                case string of
                    "you-won" ->
                        JD.succeed YouWon

                    "you-lost" ->
                        JD.succeed YouLost

                    _ ->
                        JD.fail "Unknown FightResult value"
            )
