module Extra.Json exposing (dictFromObject, encodeDict)

import Dict exposing (Dict)
import Json.Decode as JD exposing (Decoder)
import Json.Encode as JE


dictFromObject : Decoder a -> Decoder (Dict String a)
dictFromObject valueDecoder =
    JD.keyValuePairs valueDecoder
        |> JD.map Dict.fromList


encodeDict : (comparable -> String) -> (a -> JE.Value) -> Dict comparable a -> JE.Value
encodeDict keyToString encodeValue dict =
    dict
        |> Dict.toList
        |> List.map (\( key, value ) -> ( keyToString key, encodeValue value ))
        |> JE.object
