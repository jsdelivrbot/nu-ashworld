module Server.Route
    exposing
        ( AttackResponse
        , LoginResponse
        , Route(..)
        , SignupResponse
        , encodeAttackSuccess
        , encodeLoginFailure
        , encodeLoginSuccess
        , encodeNotFound
        , encodeSignupSuccess
        , fromString
        , toString
        )

import Json.Encode as JE
import Shared.Fight exposing (Fight)
import Shared.Player exposing (PlayerId)
import Shared.World exposing (ClientWorld, ServerWorld)
import Url
import Url.Builder
import Url.Parser exposing ((</>), Parser)


type Route
    = NotFound
    | Signup
    | Login PlayerId
    | Attack
        { you : PlayerId
        , them : PlayerId
        }


type alias SignupResponse =
    { world : ClientWorld
    }


type alias LoginResponse =
    { world : ClientWorld
    }


type alias AttackResponse =
    { world : ClientWorld
    , fight : Fight
    }


fromString : String -> Route
fromString string =
    case Url.fromString string of
        Nothing ->
            NotFound

        Just url ->
            Url.Parser.parse parser url
                |> Maybe.withDefault NotFound


toString : Route -> String
toString route =
    case route of
        NotFound ->
            Url.Builder.absolute [ "404" ] []

        Signup ->
            Url.Builder.absolute [ "signup" ] []

        Login id ->
            Url.Builder.absolute
                [ "login"
                , Shared.Player.idToString id
                ]
                []

        Attack { you, them } ->
            Url.Builder.absolute
                [ "attack"
                , Shared.Player.idToString you
                , Shared.Player.idToString them
                ]
                []


parser : Parser (Route -> a) a
parser =
    Url.Parser.oneOf
        [ Url.Parser.map Signup signup
        , Url.Parser.map (\you them -> Attack { you = you, them = them }) attack
        , Url.Parser.map Login login
        ]


signup : Parser a a
signup =
    Url.Parser.s "signup"


login : Parser (PlayerId -> a) a
login =
    Url.Parser.s "login" </> playerId


playerId : Parser (PlayerId -> a) a
playerId =
    Url.Parser.int
        |> Url.Parser.map Shared.Player.id


attack : Parser (PlayerId -> PlayerId -> a) a
attack =
    Url.Parser.s "attack" </> playerId </> playerId


encodeNotFound : String -> JE.Value
encodeNotFound url =
    JE.object
        [ ( "success", JE.bool False )
        , ( "error", JE.string ("Route \"" ++ url ++ "\" not found.") )
        ]


encodeSignupSuccess : PlayerId -> ServerWorld -> JE.Value
encodeSignupSuccess playerId_ world =
    JE.object
        [ ( "success", JE.bool True )
        , ( "world", Shared.World.encodeMaybe (Shared.World.serverToClient playerId_ world) )
        ]


encodeLoginSuccess : PlayerId -> ServerWorld -> JE.Value
encodeLoginSuccess playerId_ world =
    JE.object
        [ ( "success", JE.bool True )
        , ( "world", Shared.World.encodeMaybe (Shared.World.serverToClient playerId_ world) )
        ]


encodeLoginFailure : JE.Value
encodeLoginFailure =
    JE.object
        [ ( "success", JE.bool False )
        , ( "error", JE.string "Couldn't find user" )
        ]


encodeAttackSuccess : PlayerId -> Fight -> ServerWorld -> JE.Value
encodeAttackSuccess playerId_ fight world =
    JE.object
        [ ( "success", JE.bool True )
        , ( "world", Shared.World.encodeMaybe (Shared.World.serverToClient playerId_ world) )
        , ( "fight", Shared.Fight.encode fight )
        ]
