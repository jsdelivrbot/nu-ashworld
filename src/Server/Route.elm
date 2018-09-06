module Server.Route
    exposing
        ( AttackResponse
        , LoginResponse
        , RefreshResponse
        , Route(..)
        , SignupResponse
        , attackDecoder
        , attackResponse
        , encodeAttack
        , encodeAttackError
        , encodeLogin
        , encodeLoginError
        , encodeNotFound
        , encodeRefresh
        , encodeRefreshError
        , encodeSignup
        , encodeSignupError
        , fromString
        , loginDecoder
        , loginResponse
        , refreshDecoder
        , refreshResponse
        , signupDecoder
        , signupResponse
        , toString
        )

import Json.Decode as JD exposing (Decoder)
import Json.Encode as JE
import Shared.Fight exposing (Fight)
import Shared.MessageQueue
import Shared.Player exposing (PlayerId)
import Shared.World exposing (ClientWorld, ServerWorld)
import Url
import Url.Builder
import Url.Parser exposing ((</>), Parser)


type Route
    = NotFound
    | Signup
    | Login PlayerId
    | Refresh PlayerId
    | Attack
        { you : PlayerId
        , them : PlayerId
        }


type alias SignupResponse =
    { world : ClientWorld
    , messageQueue : List String
    }


type alias LoginResponse =
    { world : ClientWorld
    , messageQueue : List String
    }


type alias RefreshResponse =
    { world : ClientWorld
    , messageQueue : List String
    }


type alias AttackResponse =
    { world : ClientWorld
    , messageQueue : List String
    , fight : Fight
    }



-- URLS


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

        Refresh id ->
            Url.Builder.absolute
                [ "refresh"
                , Shared.Player.idToString id
                ]
                []

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



-- PARSER


parser : Parser (Route -> a) a
parser =
    Url.Parser.oneOf
        [ Url.Parser.map Signup signup
        , Url.Parser.map Login login
        , Url.Parser.map Refresh refresh
        , Url.Parser.map (\you them -> Attack { you = you, them = them }) attack
        ]


signup : Parser a a
signup =
    Url.Parser.s "signup"


login : Parser (PlayerId -> a) a
login =
    Url.Parser.s "login" </> playerId


refresh : Parser (PlayerId -> a) a
refresh =
    Url.Parser.s "refresh" </> playerId


playerId : Parser (PlayerId -> a) a
playerId =
    Url.Parser.int
        |> Url.Parser.map Shared.Player.id


attack : Parser (PlayerId -> PlayerId -> a) a
attack =
    Url.Parser.s "attack" </> playerId </> playerId



-- NOT FOUND


encodeNotFound : String -> JE.Value
encodeNotFound url =
    JE.object
        [ ( "success", JE.bool False )
        , ( "error", JE.string ("Route \"" ++ url ++ "\" not found.") )
        ]



-- SIGNUP


signupResponse : PlayerId -> ServerWorld -> Maybe SignupResponse
signupResponse playerId_ world =
    Shared.World.serverToClient playerId_ world
        |> Maybe.map (\clientWorld -> SignupResponse clientWorld [])


encodeSignup : SignupResponse -> JE.Value
encodeSignup { world, messageQueue } =
    JE.object
        [ ( "world", Shared.World.encode world )
        , ( "messageQueue", Shared.MessageQueue.encode messageQueue )
        ]


encodeSignupError : JE.Value
encodeSignupError =
    JE.object
        [ ( "error", JE.string "Couldn't signup" ) ]


signupDecoder : Decoder SignupResponse
signupDecoder =
    JD.map2 SignupResponse
        (JD.field "world" Shared.World.decoder)
        (JD.field "messageQueue" Shared.MessageQueue.decoder)



-- LOGIN


loginResponse : List String -> PlayerId -> ServerWorld -> Maybe LoginResponse
loginResponse messageQueue playerId_ world =
    Shared.World.serverToClient playerId_ world
        |> Maybe.map (\clientWorld -> LoginResponse clientWorld messageQueue)


encodeLogin : LoginResponse -> JE.Value
encodeLogin { world, messageQueue } =
    JE.object
        [ ( "world", Shared.World.encode world )
        , ( "messageQueue", Shared.MessageQueue.encode messageQueue )
        ]


encodeLoginError : JE.Value
encodeLoginError =
    JE.object
        [ ( "error", JE.string "Couldn't find user" ) ]


loginDecoder : Decoder LoginResponse
loginDecoder =
    JD.map2 LoginResponse
        (JD.field "world" Shared.World.decoder)
        (JD.field "messageQueue" Shared.MessageQueue.decoder)



-- REFRESH


refreshResponse : List String -> PlayerId -> ServerWorld -> Maybe RefreshResponse
refreshResponse messageQueue playerId_ world =
    Shared.World.serverToClient playerId_ world
        |> Maybe.map (\clientWorld -> LoginResponse clientWorld messageQueue)


encodeRefresh : RefreshResponse -> JE.Value
encodeRefresh { world, messageQueue } =
    JE.object
        [ ( "world", Shared.World.encode world )
        , ( "messageQueue", Shared.MessageQueue.encode messageQueue )
        ]


encodeRefreshError : JE.Value
encodeRefreshError =
    JE.object
        [ ( "error", JE.string "Couldn't find user" ) ]


refreshDecoder : Decoder RefreshResponse
refreshDecoder =
    JD.map2 RefreshResponse
        (JD.field "world" Shared.World.decoder)
        (JD.field "messageQueue" Shared.MessageQueue.decoder)



-- ATTACK


attackResponse : List String -> PlayerId -> ServerWorld -> Fight -> Maybe AttackResponse
attackResponse messageQueue playerId_ world fight =
    Shared.World.serverToClient playerId_ world
        |> Maybe.map (\clientWorld -> AttackResponse clientWorld messageQueue fight)


encodeAttack : AttackResponse -> JE.Value
encodeAttack { world, fight, messageQueue } =
    JE.object
        [ ( "world", Shared.World.encode world )
        , ( "messageQueue", Shared.MessageQueue.encode messageQueue )
        , ( "fight", Shared.Fight.encode fight )
        ]


encodeAttackError : JE.Value
encodeAttackError =
    JE.object
        [ ( "error", JE.string "Couldn't find user" ) ]


attackDecoder : Decoder AttackResponse
attackDecoder =
    JD.map3 AttackResponse
        (JD.field "world" Shared.World.decoder)
        (JD.field "messageQueue" Shared.MessageQueue.decoder)
        (JD.field "fight" Shared.Fight.decoder)
