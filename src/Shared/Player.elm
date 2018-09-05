module Shared.Player
    exposing
        ( ClientOtherPlayer
        , ClientPlayer
        , PlayerId
        , ServerPlayer
        , decoder
        , encode
        , encodeOtherPlayer
        , id
        , idToInt
        , idToString
        , init
        , otherPlayerDecoder
        , serverToClient
        , serverToClientOther
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


idToString : PlayerId -> String
idToString playerId =
    playerId
        |> idToInt
        |> String.fromInt


type alias ClientPlayer =
    { hp : Int
    , maxHp : Int
    , xp : Int
    , id : PlayerId
    }


type alias ClientOtherPlayer =
    { hp : Int
    , xp : Int
    , id : PlayerId
    }


type alias ServerPlayer =
    { hp : Int
    , maxHp : Int
    , xp : Int
    , id : PlayerId
    , secret : ()
    }


serverToClient : ServerPlayer -> ClientPlayer
serverToClient ({ hp, xp, maxHp } as player) =
    { hp = hp
    , xp = xp
    , maxHp = maxHp
    , id = player.id
    }


serverToClientOther : ServerPlayer -> ClientOtherPlayer
serverToClientOther ({ hp, xp } as player) =
    { hp = hp
    , xp = xp
    , id = player.id
    }


init : PlayerId -> ServerPlayer
init playerId =
    { hp = 10
    , maxHp = 10
    , xp = 0
    , secret = ()
    , id = playerId
    }


encode : ClientPlayer -> JE.Value
encode player =
    JE.object
        [ ( "hp", JE.int player.hp )
        , ( "maxHp", JE.int player.maxHp )
        , ( "xp", JE.int player.xp )
        , ( "id", JE.int (idToInt player.id) )
        ]


decoder : Decoder ClientPlayer
decoder =
    JD.map4 ClientPlayer
        (JD.field "hp" JD.int)
        (JD.field "maxHp" JD.int)
        (JD.field "xp" JD.int)
        (JD.field "id" (JD.int |> JD.map PlayerId))


encodeOtherPlayer : ClientOtherPlayer -> JE.Value
encodeOtherPlayer player =
    JE.object
        [ ( "hp", JE.int player.hp )
        , ( "xp", JE.int player.xp )
        , ( "id", JE.int (idToInt player.id) )
        ]


otherPlayerDecoder : Decoder ClientOtherPlayer
otherPlayerDecoder =
    JD.map3 ClientOtherPlayer
        (JD.field "hp" JD.int)
        (JD.field "xp" JD.int)
        (JD.field "id" (JD.int |> JD.map PlayerId))
