module Shared.Player
    exposing
        ( ClientPlayer
        , PlayerId
        , ServerPlayer
        , decoder
        , encode
        , id
        , idToInt
        , init
        )

import Json.Decode as JD exposing (Decoder)
import Json.Encode as JE


type PlayerId
    = PlayerId Int


id : Int -> PlayerId
id num =
    PlayerId num


idToInt : PlayerId -> Int
idToInt (PlayerId num) =
    num


type alias ClientPlayer =
    { hp : Int
    , maxHp : Int
    , xp : Int
    , id : PlayerId
    }


type alias ServerPlayer =
    { hp : Int
    , maxHp : Int
    , xp : Int
    , secret : ()
    }


init : ServerPlayer
init =
    { hp = 10
    , maxHp = 10
    , xp = 0
    , secret = ()
    }


encode : PlayerId -> ServerPlayer -> JE.Value
encode (PlayerId playerId) player =
    JE.object
        [ ( "hp", JE.int player.hp )
        , ( "maxHp", JE.int player.maxHp )
        , ( "xp", JE.int player.xp )
        , ( "id", JE.int playerId )
        ]


decoder : Decoder ClientPlayer
decoder =
    JD.map4 ClientPlayer
        (JD.field "hp" JD.int)
        (JD.field "maxHp" JD.int)
        (JD.field "xp" JD.int)
        (JD.field "id" (JD.int |> JD.map PlayerId))
