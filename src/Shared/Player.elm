module Shared.Player
    exposing
        ( ClientOtherPlayer
        , ClientPlayer
        , ServerPlayer
        , decoder
        , encode
        , encodeOtherPlayer
        , encodeServer
        , init
        , otherPlayerDecoder
        , serverDecoder
        , serverToClient
        , serverToClientOther
        , toOther
        )

import Json.Decode as JD exposing (Decoder)
import Json.Encode as JE


type alias ClientPlayer =
    { hp : Int
    , maxHp : Int
    , xp : Int
    , name : String
    }


type alias ClientOtherPlayer =
    { hp : Int
    , xp : Int
    , name : String
    }


type alias ServerPlayer =
    { hp : Int
    , maxHp : Int
    , xp : Int
    , messageQueue : List String
    , name : String
    , hashedPassword : String
    }


toOther : ClientPlayer -> ClientOtherPlayer
toOther player =
    { hp = player.hp
    , xp = player.xp
    , name = player.name
    }


serverToClient : ServerPlayer -> ClientPlayer
serverToClient ({ hp, xp, maxHp, name } as player) =
    { hp = hp
    , xp = xp
    , maxHp = maxHp
    , name = name
    }


serverToClientOther : ServerPlayer -> ClientOtherPlayer
serverToClientOther ({ hp, xp, name } as player) =
    { hp = hp
    , xp = xp
    , name = name
    }


init : String -> String -> ServerPlayer
init name hashedPassword =
    { hp = 10
    , maxHp = 10
    , xp = 0
    , messageQueue = []
    , name = name
    , hashedPassword = hashedPassword
    }


encode : ClientPlayer -> JE.Value
encode player =
    JE.object
        [ ( "hp", JE.int player.hp )
        , ( "maxHp", JE.int player.maxHp )
        , ( "xp", JE.int player.xp )
        , ( "name", JE.string player.name )
        ]


encodeServer : ServerPlayer -> JE.Value
encodeServer player =
    JE.object
        [ ( "hp", JE.int player.hp )
        , ( "maxHp", JE.int player.maxHp )
        , ( "xp", JE.int player.xp )
        , ( "messageQueue", JE.list JE.string player.messageQueue )
        , ( "name", JE.string player.name )
        , ( "hashedPassword", JE.string player.hashedPassword )
        ]


decoder : Decoder ClientPlayer
decoder =
    JD.map4 ClientPlayer
        (JD.field "hp" JD.int)
        (JD.field "maxHp" JD.int)
        (JD.field "xp" JD.int)
        (JD.field "name" JD.string)


serverDecoder : Decoder ServerPlayer
serverDecoder =
    JD.map6 ServerPlayer
        (JD.field "hp" JD.int)
        (JD.field "maxHp" JD.int)
        (JD.field "xp" JD.int)
        (JD.field "messageQueue" (JD.list JD.string))
        (JD.field "name" JD.string)
        (JD.field "hashedPassword" JD.string)


encodeOtherPlayer : ClientOtherPlayer -> JE.Value
encodeOtherPlayer { hp, xp, name } =
    JE.object
        [ ( "hp", JE.int hp )
        , ( "xp", JE.int xp )
        , ( "name", JE.string name )
        ]


otherPlayerDecoder : Decoder ClientOtherPlayer
otherPlayerDecoder =
    JD.map3 ClientOtherPlayer
        (JD.field "hp" JD.int)
        (JD.field "xp" JD.int)
        (JD.field "name" JD.string)
