module Extra.Json exposing (dictFromList, dictFromObject)

import Dict exposing (Dict)
import Json.Decode as JD exposing (Decoder)


dictFromObject : Decoder a -> Decoder (Dict String a)
dictFromObject valueDecoder =
    JD.keyValuePairs valueDecoder
        |> JD.map Dict.fromList


dictFromList : Decoder comparable -> Decoder a -> Decoder (Dict comparable a)
dictFromList keyDecoder valueDecoder =
    let
        tupleDecoder : Decoder ( comparable, a )
        tupleDecoder =
            JD.map2 Tuple.pair
                (JD.index 0 keyDecoder)
                (JD.index 1 valueDecoder)
    in
    JD.list tupleDecoder
        |> JD.map Dict.fromList
