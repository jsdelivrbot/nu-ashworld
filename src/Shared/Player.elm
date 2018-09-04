module Shared.Player exposing (decoder, encode)

import Client.Player
import Json.Decode as JD exposing (Decoder)
import Json.Encode as JE
import Server.Player


encode : Int -> Server.Player.Player -> JE.Value
encode id player =
    JE.object
        [ ( "hp", JE.int player.hp )
        , ( "maxHp", JE.int player.maxHp )
        , ( "xp", JE.int player.xp )
        , ( "id", JE.int id )
        ]


decoder : Decoder Client.Player.Player
decoder =
    JD.map4 Client.Player.Player
        (JD.field "hp" JD.int)
        (JD.field "maxHp" JD.int)
        (JD.field "xp" JD.int)
        (JD.field "id" JD.int)
