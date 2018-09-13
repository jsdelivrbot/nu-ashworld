module Server.Route
    exposing
        ( AttackData
        , AttackResponse
        , AuthError(..)
        , LoginResponse
        , RefreshResponse
        , Route(..)
        , SignupError(..)
        , SignupResponse
        , attackDecoder
        , attackResponse
        , authErrorDecoder
        , authErrorToString
        , encodeAttack
        , encodeAttackError
        , encodeAuthError
        , encodeLogin
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
        , signupErrorDecoder
        , signupErrorToString
        , signupResponse
        , toString
        )

import Json.Decode as JD exposing (Decoder)
import Json.Encode as JE
import Shared.Fight exposing (Fight)
import Shared.MessageQueue
import Shared.Password exposing (Authentication)
import Shared.Player
import Shared.World exposing (ClientWorld, ServerWorld)
import Url
import Url.Builder
import Url.Parser exposing ((</>), Parser)


type Route
    = NotFound
    | Signup Authentication
    | Login Authentication
    | Refresh
    | Attack AttackData


type alias AttackData =
    { you : String
    , them : String
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
    , fight : Maybe Fight
    }


type SignupError
    = NameAlreadyExists
    | CouldntFindNewlyCreatedUser


type AuthError
    = NameAndPasswordDoesntCheckOut
    | AuthenticationHeadersMissing



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

        Signup { name, hashedPassword } ->
            Url.Builder.absolute
                [ "signup"
                , name
                , hashedPassword
                ]
                []

        Refresh ->
            Url.Builder.absolute
                [ "refresh" ]
                []

        Login { name, hashedPassword } ->
            Url.Builder.absolute
                [ "login"
                , name
                , hashedPassword
                ]
                []

        Attack { you, them } ->
            Url.Builder.absolute
                [ "attack"
                , you
                , them
                ]
                []



-- PARSER


parser : Parser (Route -> a) a
parser =
    Url.Parser.oneOf
        [ Url.Parser.map
            (\name hashedPassword ->
                Signup
                    { name = name
                    , hashedPassword = hashedPassword
                    }
            )
            signup
        , Url.Parser.map
            (\name hashedPassword ->
                Login
                    { name = name
                    , hashedPassword = hashedPassword
                    }
            )
            login
        , Url.Parser.map Refresh refresh
        , Url.Parser.map
            (\you them ->
                Attack
                    { you = you
                    , them = them
                    }
            )
            attack
        ]


signup : Parser (String -> String -> a) a
signup =
    Url.Parser.s "signup" </> Url.Parser.string </> Url.Parser.string


login : Parser (String -> String -> a) a
login =
    Url.Parser.s "login" </> Url.Parser.string </> Url.Parser.string


refresh : Parser a a
refresh =
    Url.Parser.s "refresh"


attack : Parser (String -> String -> a) a
attack =
    Url.Parser.s "attack" </> Url.Parser.string </> Url.Parser.string



-- NOT FOUND


encodeNotFound : String -> JE.Value
encodeNotFound url =
    JE.object
        [ ( "success", JE.bool False )
        , ( "error", JE.string ("Route \"" ++ url ++ "\" not found.") )
        ]



-- SIGNUP


signupResponse : String -> ServerWorld -> Result SignupError SignupResponse
signupResponse name world =
    Shared.World.serverToClient name world
        |> Result.fromMaybe CouldntFindNewlyCreatedUser
        |> Result.map (\clientWorld -> SignupResponse clientWorld [])


encodeSignup : SignupResponse -> JE.Value
encodeSignup { world, messageQueue } =
    JE.object
        [ ( "world", Shared.World.encode world )
        , ( "messageQueue", Shared.MessageQueue.encode messageQueue )
        ]


signupErrorToString : SignupError -> String
signupErrorToString error =
    case error of
        NameAlreadyExists ->
            "Name already exists"

        CouldntFindNewlyCreatedUser ->
            "Couldn't find newly created user"


signupErrorFromString : String -> Maybe SignupError
signupErrorFromString string =
    case string of
        "Name already exists" ->
            Just NameAlreadyExists

        "Couldn't find newly created user" ->
            Just CouldntFindNewlyCreatedUser

        _ ->
            Nothing


encodeSignupError : SignupError -> JE.Value
encodeSignupError error =
    JE.object
        [ ( "error", JE.string (signupErrorToString error) ) ]


signupErrorDecoder : Decoder SignupError
signupErrorDecoder =
    JD.field "error"
        (JD.string
            |> JD.andThen
                (\string ->
                    case signupErrorFromString string of
                        Just error ->
                            JD.succeed error

                        Nothing ->
                            JD.fail "Unknown SignupError"
                )
        )


authErrorToString : AuthError -> String
authErrorToString error =
    case error of
        NameAndPasswordDoesntCheckOut ->
            "Name and password doesn't check out"

        AuthenticationHeadersMissing ->
            "Authentication headers missing"


authErrorFromString : String -> Maybe AuthError
authErrorFromString string =
    case string of
        "Name and password doesn't check out" ->
            Just NameAndPasswordDoesntCheckOut

        "Authentication headers missing" ->
            Just AuthenticationHeadersMissing

        _ ->
            Nothing


encodeAuthError : AuthError -> JE.Value
encodeAuthError error =
    JE.object
        [ ( "error", JE.string (authErrorToString error) ) ]


authErrorDecoder : Decoder AuthError
authErrorDecoder =
    JD.field "error"
        (JD.string
            |> JD.andThen
                (\string ->
                    case authErrorFromString string of
                        Just error ->
                            JD.succeed error

                        Nothing ->
                            JD.fail "Unknown AuthError"
                )
        )


signupDecoder : Decoder SignupResponse
signupDecoder =
    JD.map2 SignupResponse
        (JD.field "world" Shared.World.decoder)
        (JD.field "messageQueue" Shared.MessageQueue.decoder)



-- LOGIN


loginResponse : List String -> String -> ServerWorld -> Maybe LoginResponse
loginResponse messageQueue name world =
    Shared.World.serverToClient name world
        |> Maybe.map (\clientWorld -> LoginResponse clientWorld messageQueue)


encodeLogin : LoginResponse -> JE.Value
encodeLogin { world, messageQueue } =
    JE.object
        [ ( "world", Shared.World.encode world )
        , ( "messageQueue", Shared.MessageQueue.encode messageQueue )
        ]


loginDecoder : Decoder LoginResponse
loginDecoder =
    JD.map2 LoginResponse
        (JD.field "world" Shared.World.decoder)
        (JD.field "messageQueue" Shared.MessageQueue.decoder)



-- REFRESH


refreshResponse : List String -> String -> ServerWorld -> Maybe RefreshResponse
refreshResponse messageQueue name world =
    Shared.World.serverToClient name world
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


attackResponse : List String -> String -> ServerWorld -> Maybe Fight -> Maybe AttackResponse
attackResponse messageQueue name world maybeFight =
    Shared.World.serverToClient name world
        |> Maybe.map (\clientWorld -> AttackResponse clientWorld messageQueue maybeFight)


encodeAttack : AttackResponse -> JE.Value
encodeAttack { world, fight, messageQueue } =
    JE.object
        [ ( "world", Shared.World.encode world )
        , ( "messageQueue", Shared.MessageQueue.encode messageQueue )
        , ( "fight", Shared.Fight.encodeMaybe fight )
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
        (JD.field "fight" Shared.Fight.maybeDecoder)
