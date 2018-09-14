module Server.Route
    exposing
        ( AttackData
        , AttackResponse
        , AuthError(..)
        , LoginResponse
        , LogoutResponse
        , RefreshAnonymousResponse
        , RefreshResponse
        , Route(..)
        , SignupError(..)
        , SignupResponse
        , fromString
        , handlers
        , toString
        )

import Json.Decode as JD exposing (Decoder)
import Json.Encode as JE
import Shared.Fight exposing (Fight)
import Shared.MessageQueue
import Shared.Password exposing (Auth)
import Shared.Player
import Shared.World
    exposing
        ( AnonymousClientWorld
        , ClientWorld
        , ServerWorld
        )
import Url
import Url.Builder
import Url.Parser exposing ((</>), Parser)


type Route
    = NotFound
    | Signup Auth
    | Login Auth
    | Refresh
    | RefreshAnonymous
    | Attack AttackData
    | Logout


handlers =
    { notFound = notFound
    , signup = signup
    , login = login
    , refresh = refresh
    , attack = attack
    , logout = logout
    , refreshAnonymous = refreshAnonymous
    }


notFound =
    { encode = encodeNotFound
    , toUrl = notFoundToUrl
    }


signup =
    { toUrl = signupToUrl
    , urlParser = signupUrlParser
    , encode = encodeSignup
    , encodeError = encodeSignupError
    , decoder = signupDecoder
    , errorDecoder = signupErrorDecoder
    , response = signupResponse
    , errorToString = signupErrorToString
    }


login =
    { toUrl = loginToUrl
    , urlParser = loginUrlParser
    , encode = encodeLogin
    , encodeError = encodeAuthError
    , decoder = loginDecoder
    , errorDecoder = authErrorDecoder
    , response = loginResponse
    , errorToString = authErrorToString
    }


refresh =
    { toUrl = refreshToUrl
    , urlParser = refreshUrlParser
    , encode = encodeRefresh
    , encodeError = encodeAuthError
    , decoder = refreshDecoder
    , errorDecoder = authErrorDecoder
    , response = refreshResponse
    }


refreshAnonymous =
    { toUrl = refreshAnonymousToUrl
    , urlParser = refreshAnonymousUrlParser
    , encode = encodeRefreshAnonymous
    , decoder = refreshAnonymousDecoder
    , response = refreshAnonymousResponse
    }


attack =
    { toUrl = attackToUrl
    , urlParser = attackUrlParser
    , encode = encodeAttack
    , encodeError = encodeAuthError
    , decoder = attackDecoder
    , errorDecoder = authErrorDecoder
    , response = attackResponse
    }


logout =
    { toUrl = logoutToUrl
    , urlParser = logoutUrlParser
    , encode = encodeLogout
    , decoder = logoutDecoder
    , response = logoutResponse
    }


type alias AttackData =
    { you : String
    , them : String
    }


type alias LoginResponse =
    { world : ClientWorld
    , messageQueue : List String
    }


type alias LogoutResponse =
    { world : AnonymousClientWorld
    }


type alias RefreshResponse =
    { world : ClientWorld
    , messageQueue : List String
    }


type alias RefreshAnonymousResponse =
    { world : AnonymousClientWorld
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
    | NameNotFound


type alias SignupResponse =
    { world : ClientWorld
    , messageQueue : List String
    }



-- URLS


fromString : String -> Route
fromString string =
    string
        |> Url.fromString
        |> Maybe.andThen (Url.Parser.parse parser)
        |> Maybe.withDefault NotFound


toString : Route -> String
toString route =
    case route of
        NotFound ->
            handlers.notFound.toUrl

        Signup auth ->
            handlers.signup.toUrl auth

        Refresh ->
            handlers.refresh.toUrl

        RefreshAnonymous ->
            handlers.refreshAnonymous.toUrl

        Login auth ->
            handlers.login.toUrl auth

        Attack attackData ->
            handlers.attack.toUrl attackData

        Logout ->
            handlers.logout.toUrl


parser : Parser (Route -> a) a
parser =
    Url.Parser.oneOf
        [ handlers.signup.urlParser
        , handlers.login.urlParser
        , handlers.refresh.urlParser
        , handlers.logout.urlParser
        , handlers.refreshAnonymous.urlParser
        , handlers.attack.urlParser
        ]


{-| This is only here to make sure I don't forget to add the new route's parser.
-}
parserFailsafe : Route -> String
parserFailsafe route =
    case route of
        NotFound ->
            "yes I have added the new parser to `parser` above"

        Signup auth ->
            "yes I have added the new parser to `parser` above"

        Refresh ->
            "yes I have added the new parser to `parser` above"

        RefreshAnonymous ->
            "yes I have added the new parser to `parser` above"

        Login auth ->
            "yes I have added the new parser to `parser` above"

        Attack attackData ->
            "yes I have added the new parser to `parser` above"

        Logout ->
            "yes I have added the new parser to `parser` above"



-- HELPERS


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


authErrorToString : AuthError -> String
authErrorToString error =
    case error of
        NameAndPasswordDoesntCheckOut ->
            "Name and password doesn't check out"

        AuthenticationHeadersMissing ->
            "Authentication headers missing"

        NameNotFound ->
            "Name not found"


authErrorFromString : String -> Maybe AuthError
authErrorFromString string =
    case string of
        "Name and password doesn't check out" ->
            Just NameAndPasswordDoesntCheckOut

        "Authentication headers missing" ->
            Just AuthenticationHeadersMissing

        "Name not found" ->
            Just NameNotFound

        _ ->
            Nothing



-- NOT FOUND


encodeNotFound : String -> JE.Value
encodeNotFound url =
    JE.object
        [ ( "error", JE.string ("Route \"" ++ url ++ "\" not found.") )
        ]


notFoundToUrl : String
notFoundToUrl =
    Url.Builder.absolute [ "404" ] []



-- SIGNUP


signupToUrl : Auth -> String
signupToUrl { name, hashedPassword } =
    Url.Builder.absolute
        [ "signup"
        , name
        , hashedPassword
        ]
        []


signupUrlParser : Parser (Route -> a) a
signupUrlParser =
    Url.Parser.map
        (\name hashedPassword ->
            Signup
                { name = name
                , hashedPassword = hashedPassword
                }
        )
        (Url.Parser.s "signup"
            </> Url.Parser.string
            </> Url.Parser.string
        )


encodeSignup : SignupResponse -> JE.Value
encodeSignup { world, messageQueue } =
    JE.object
        [ ( "world", Shared.World.encode world )
        , ( "messageQueue", Shared.MessageQueue.encode messageQueue )
        ]


encodeSignupError : SignupError -> JE.Value
encodeSignupError error =
    JE.object
        [ ( "error", JE.string (signupErrorToString error) ) ]


signupErrorToString : SignupError -> String
signupErrorToString error =
    case error of
        NameAlreadyExists ->
            "Name already exists"

        CouldntFindNewlyCreatedUser ->
            "Couldn't find newly created user"


signupDecoder : Decoder SignupResponse
signupDecoder =
    JD.map2 SignupResponse
        (JD.field "world" Shared.World.decoder)
        (JD.field "messageQueue" Shared.MessageQueue.decoder)


signupResponse : String -> ServerWorld -> Result SignupError SignupResponse
signupResponse name world =
    Shared.World.serverToClient name world
        |> Result.fromMaybe CouldntFindNewlyCreatedUser
        |> Result.map (\clientWorld -> SignupResponse clientWorld [])


signupErrorFromString : String -> Maybe SignupError
signupErrorFromString string =
    case string of
        "Name already exists" ->
            Just NameAlreadyExists

        "Couldn't find newly created user" ->
            Just CouldntFindNewlyCreatedUser

        _ ->
            Nothing


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



-- LOGIN


loginToUrl : Auth -> String
loginToUrl { name, hashedPassword } =
    Url.Builder.absolute
        [ "login"
        , name
        , hashedPassword
        ]
        []


loginUrlParser : Parser (Route -> a) a
loginUrlParser =
    Url.Parser.map
        (\name hashedPassword ->
            Login
                { name = name
                , hashedPassword = hashedPassword
                }
        )
        (Url.Parser.s "login"
            </> Url.Parser.string
            </> Url.Parser.string
        )


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


loginResponse : List String -> String -> ServerWorld -> Maybe LoginResponse
loginResponse messageQueue name world =
    Shared.World.serverToClient name world
        |> Maybe.map (\clientWorld -> LoginResponse clientWorld messageQueue)



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


refreshDecoder : Decoder RefreshResponse
refreshDecoder =
    JD.map2 RefreshResponse
        (JD.field "world" Shared.World.decoder)
        (JD.field "messageQueue" Shared.MessageQueue.decoder)


refreshToUrl : String
refreshToUrl =
    Url.Builder.absolute
        [ "refresh" ]
        []


refreshUrlParser : Parser (Route -> a) a
refreshUrlParser =
    Url.Parser.map Refresh
        (Url.Parser.s "refresh")



-- REFRESH ANONYMOUS


refreshAnonymousToUrl : String
refreshAnonymousToUrl =
    Url.Builder.absolute
        [ "refresh-anonymous" ]
        []


refreshAnonymousUrlParser : Parser (Route -> a) a
refreshAnonymousUrlParser =
    Url.Parser.map RefreshAnonymous
        (Url.Parser.s "refresh-anonymous")


encodeRefreshAnonymous : RefreshAnonymousResponse -> JE.Value
encodeRefreshAnonymous { world } =
    JE.object
        [ ( "world", Shared.World.encodeAnonymous world )
        ]


refreshAnonymousDecoder : Decoder RefreshAnonymousResponse
refreshAnonymousDecoder =
    JD.map RefreshAnonymousResponse
        (JD.field "world" Shared.World.anonymousDecoder)


refreshAnonymousResponse : ServerWorld -> RefreshAnonymousResponse
refreshAnonymousResponse world =
    world
        |> Shared.World.serverToAnonymous
        |> RefreshAnonymousResponse



-- ATTACK


attackToUrl : AttackData -> String
attackToUrl { you, them } =
    Url.Builder.absolute
        [ "attack"
        , you
        , them
        ]
        []


attackUrlParser : Parser (Route -> a) a
attackUrlParser =
    Url.Parser.map
        (\you them ->
            Attack
                { you = you
                , them = them
                }
        )
        (Url.Parser.s "attack"
            </> Url.Parser.string
            </> Url.Parser.string
        )


encodeAttack : AttackResponse -> JE.Value
encodeAttack { world, fight, messageQueue } =
    JE.object
        [ ( "world", Shared.World.encode world )
        , ( "messageQueue", Shared.MessageQueue.encode messageQueue )
        , ( "fight", Shared.Fight.encodeMaybe fight )
        ]


attackDecoder : Decoder AttackResponse
attackDecoder =
    JD.map3 AttackResponse
        (JD.field "world" Shared.World.decoder)
        (JD.field "messageQueue" Shared.MessageQueue.decoder)
        (JD.field "fight" Shared.Fight.maybeDecoder)


attackResponse : List String -> String -> ServerWorld -> Maybe Fight -> Maybe AttackResponse
attackResponse messageQueue name world maybeFight =
    Shared.World.serverToClient name world
        |> Maybe.map (\clientWorld -> AttackResponse clientWorld messageQueue maybeFight)



-- LOGOUT


logoutToUrl : String
logoutToUrl =
    Url.Builder.absolute [ "logout" ] []


logoutUrlParser : Parser (Route -> a) a
logoutUrlParser =
    Url.Parser.map Logout
        (Url.Parser.s "logout")


logoutResponse : ServerWorld -> LogoutResponse
logoutResponse world =
    world
        |> Shared.World.serverToAnonymous
        |> LogoutResponse


encodeLogout : LogoutResponse -> JE.Value
encodeLogout { world } =
    JE.object
        [ ( "world", Shared.World.encodeAnonymous world )
        ]


logoutDecoder : Decoder LogoutResponse
logoutDecoder =
    JD.map LogoutResponse
        (JD.field "world" Shared.World.anonymousDecoder)
