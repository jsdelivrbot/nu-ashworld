module Shared.MessageQueue exposing (decoder, encode)

import Json.Decode as JD exposing (Decoder)
import Json.Encode as JE


decoder : Decoder (List String)
decoder =
    JD.list JD.string


encode : List String -> JE.Value
encode messageQueue =
    JE.list JE.string messageQueue
