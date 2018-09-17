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
import Shared.Password as Password exposing (Password, Verified)
import Shared.Special exposing (Special)


type alias ClientPlayer =
    { hp : Int
    , maxHp : Int
    , xp : Int
    , name : String
    , special : Special
    , availableSpecial : Int
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
    , password : Password Verified
    , special : Special
    , availableSpecial : Int
    }


toOther : ClientPlayer -> ClientOtherPlayer
toOther { hp, xp, name } =
    { hp = hp
    , xp = xp
    , name = name
    }


serverToClient : ServerPlayer -> ClientPlayer
serverToClient { hp, xp, maxHp, name, special, availableSpecial } =
    { hp = hp
    , xp = xp
    , maxHp = maxHp
    , name = name
    , special = special
    , availableSpecial = availableSpecial
    }


serverToClientOther : ServerPlayer -> ClientOtherPlayer
serverToClientOther { hp, xp, name } =
    { hp = hp
    , xp = xp
    , name = name
    }


init : String -> Password Verified -> ServerPlayer
init name password =
    { hp = 10
    , maxHp = 10
    , xp = 0
    , messageQueue = []
    , name = name
    , password = password
    , special = Shared.Special.init
    , availableSpecial = Shared.Special.initAvailable
    }


encode : ClientPlayer -> JE.Value
encode { hp, maxHp, xp, name, special, availableSpecial } =
    JE.object
        [ ( "hp", JE.int hp )
        , ( "maxHp", JE.int maxHp )
        , ( "xp", JE.int xp )
        , ( "name", JE.string name )
        , ( "special", Shared.Special.encode special )
        , ( "availableSpecial", JE.int availableSpecial )
        ]


encodeServer : ServerPlayer -> JE.Value
encodeServer { hp, maxHp, xp, messageQueue, name, password, special, availableSpecial } =
    JE.object
        [ ( "hp", JE.int hp )
        , ( "maxHp", JE.int maxHp )
        , ( "xp", JE.int xp )
        , ( "messageQueue", JE.list JE.string messageQueue )
        , ( "name", JE.string name )
        , ( "password", Password.encodeVerified password )
        , ( "special", Shared.Special.encode special )
        , ( "availableSpecial", JE.int availableSpecial )
        ]


decoder : Decoder ClientPlayer
decoder =
    JD.map6 ClientPlayer
        (JD.field "hp" JD.int)
        (JD.field "maxHp" JD.int)
        (JD.field "xp" JD.int)
        (JD.field "name" JD.string)
        (JD.field "special" Shared.Special.decoder)
        (JD.field "availableSpecial" JD.int)


serverDecoder : Decoder ServerPlayer
serverDecoder =
    JD.map8 ServerPlayer
        (JD.field "hp" JD.int)
        (JD.field "maxHp" JD.int)
        (JD.field "xp" JD.int)
        (JD.field "messageQueue" (JD.list JD.string))
        (JD.field "name" JD.string)
        (JD.field "password" Password.verifiedDecoder)
        (JD.field "special" Shared.Special.decoder)
        (JD.field "availableSpecial" JD.int)


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
