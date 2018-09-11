module Shared.Player
    exposing
        ( ClientOtherPlayer
        , ClientPlayer
        , PlayerId
        , ServerPlayer
        , decoder
        , encode
        , encodeId
        , encodeOtherPlayer
        , encodeServer
        , id
        , idDecoder
        , idToInt
        , idToString
        , init
        , otherPlayerDecoder
        , serverDecoder
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


idDecoder : Decoder PlayerId
idDecoder =
    JD.map PlayerId JD.int


encodeId : PlayerId -> JE.Value
encodeId (PlayerId id_) =
    JE.int id_


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
    , messageQueue : List String
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
    , messageQueue = []
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


encodeServer : ServerPlayer -> JE.Value
encodeServer player =
    JE.object
        [ ( "hp", JE.int player.hp )
        , ( "maxHp", JE.int player.maxHp )
        , ( "xp", JE.int player.xp )
        , ( "id", JE.int (idToInt player.id) )
        , ( "messageQueue", JE.list JE.string player.messageQueue )
        ]


decoder : Decoder ClientPlayer
decoder =
    JD.map4 ClientPlayer
        (JD.field "hp" JD.int)
        (JD.field "maxHp" JD.int)
        (JD.field "xp" JD.int)
        (JD.field "id" (JD.int |> JD.map PlayerId))


serverDecoder : Decoder ServerPlayer
serverDecoder =
    JD.map5 ServerPlayer
        (JD.field "hp" JD.int)
        (JD.field "maxHp" JD.int)
        (JD.field "xp" JD.int)
        (JD.field "id" (JD.int |> JD.map PlayerId))
        (JD.field "messageQueue" (JD.list JD.string))


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
