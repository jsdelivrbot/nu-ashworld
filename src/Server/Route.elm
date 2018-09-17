module Server.Route
    exposing
        ( AttackResponse
        , AuthError(..)
        , IncSpecialAttrResponse
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
import Shared.Special exposing (SpecialAttr(..))
import Shared.World exposing (AnonymousClientWorld, ClientWorld, ServerWorld)
import Url
import Url.Builder
import Url.Parser exposing ((</>), Parser)


type Route
    = NotFound
    | Signup
    | Login
    | Refresh
    | RefreshAnonymous
    | Attack String
    | Logout
    | IncSpecialAttr SpecialAttr


handlers =
    { notFound = notFound
    , signup = signup
    , login = login
    , refresh = refresh
    , attack = attack
    , logout = logout
    , refreshAnonymous = refreshAnonymous
    , incSpecialAttr = incSpecialAttr
    }


notFound =
    { toUrl = notFoundToUrl
    , urlParser = notFoundUrlParser
    , encode = encodeNotFound
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


incSpecialAttr =
    { toUrl = incSpecialAttrToUrl
    , urlParser = incSpecialAttrUrlParser
    , encode = encodeIncSpecialAttr
    , encodeError = encodeAuthError
    , decoder = incSpecialAttrDecoder
    , errorDecoder = authErrorDecoder
    , response = incSpecialAttrResponse
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


type alias SignupResponse =
    { world : ClientWorld
    , messageQueue : List String
    }


type alias AttackResponse =
    { world : ClientWorld
    , messageQueue : List String
    , fight : Maybe Fight
    }


type alias IncSpecialAttrResponse =
    { world : ClientWorld
    , messageQueue : List String
    }


type SignupError
    = NameAlreadyExists
    | CouldntFindNewlyCreatedUser
    | AuthError AuthError


type AuthError
    = NameAndPasswordDoesntCheckOut
    | AuthenticationHeadersMissing
    | NameNotFound



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

        Signup ->
            handlers.signup.toUrl

        Refresh ->
            handlers.refresh.toUrl

        RefreshAnonymous ->
            handlers.refreshAnonymous.toUrl

        Login ->
            handlers.login.toUrl

        Attack theirName ->
            handlers.attack.toUrl theirName

        Logout ->
            handlers.logout.toUrl

        IncSpecialAttr attr ->
            handlers.incSpecialAttr.toUrl attr


{-| This is done instead of a simple `Url.Parser.oneOf [a,b,c,d,...]` so that
we get alerted by the typesystem to add a case.

<https://discourse.elm-lang.org/t/typesafe-url-parser-oneof-usage/1964/4>

-}
parser : Parser (Route -> a) a
parser =
    let
        nextRoute : Route -> Maybe Route
        nextRoute r =
            case r of
                NotFound ->
                    Just Signup

                Signup ->
                    Just Refresh

                Refresh ->
                    Just RefreshAnonymous

                RefreshAnonymous ->
                    Just Login

                Login ->
                    Just (Attack "")

                Attack _ ->
                    Just Logout

                Logout ->
                    Just (IncSpecialAttr Strength)

                IncSpecialAttr _ ->
                    {- Connect the new route correctly:
                       `a -> Nothing` becomes `a -> Just b; b -> Nothing`
                    -}
                    Nothing

        makeAllRoutes : Maybe Route -> List Route
        makeAllRoutes maybeRoute =
            maybeRoute
                |> Maybe.map (\r -> r :: makeAllRoutes (nextRoute r))
                |> Maybe.withDefault []

        allRoutes : List Route
        allRoutes =
            makeAllRoutes (Just NotFound)

        routeToParser : Route -> Parser (Route -> a) a
        routeToParser r =
            case r of
                NotFound ->
                    handlers.notFound.urlParser

                Signup ->
                    handlers.signup.urlParser

                Refresh ->
                    handlers.refresh.urlParser

                RefreshAnonymous ->
                    handlers.refreshAnonymous.urlParser

                Login ->
                    handlers.login.urlParser

                Attack _ ->
                    handlers.attack.urlParser

                Logout ->
                    handlers.logout.urlParser

                IncSpecialAttr _ ->
                    handlers.incSpecialAttr.urlParser
    in
    allRoutes
        |> List.map routeToParser
        |> Url.Parser.oneOf



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


notFoundUrlParser : Parser (Route -> a) a
notFoundUrlParser =
    Url.Parser.map NotFound
        (Url.Parser.s "404")


encodeNotFound : String -> JE.Value
encodeNotFound url =
    JE.object
        [ ( "error", JE.string ("Route \"" ++ url ++ "\" not found.") )
        ]


notFoundToUrl : String
notFoundToUrl =
    Url.Builder.absolute [ "404" ] []



-- SIGNUP


signupToUrl : String
signupToUrl =
    Url.Builder.absolute [ "signup" ] []


signupUrlParser : Parser (Route -> a) a
signupUrlParser =
    Url.Parser.map Signup
        (Url.Parser.s "signup")


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

        AuthError authError ->
            authErrorToString authError


signupDecoder : Decoder SignupResponse
signupDecoder =
    JD.map2 SignupResponse
        (JD.field "world" Shared.World.decoder)
        (JD.field "messageQueue" Shared.MessageQueue.decoder)


signupResponse : List String -> String -> ServerWorld -> Result SignupError SignupResponse
signupResponse messages name world =
    Shared.World.serverToClient name world
        |> Result.fromMaybe CouldntFindNewlyCreatedUser
        |> Result.map (\clientWorld -> SignupResponse clientWorld messages)


signupErrorFromString : String -> Maybe SignupError
signupErrorFromString string =
    case string of
        "Name already exists" ->
            Just NameAlreadyExists

        "Couldn't find newly created user" ->
            Just CouldntFindNewlyCreatedUser

        _ ->
            authErrorFromString string
                |> Maybe.map AuthError


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


loginToUrl : String
loginToUrl =
    Url.Builder.absolute [ "login" ] []


loginUrlParser : Parser (Route -> a) a
loginUrlParser =
    Url.Parser.map Login
        (Url.Parser.s "login")


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
        |> Maybe.map (\clientWorld -> RefreshResponse clientWorld messageQueue)


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


attackToUrl : String -> String
attackToUrl theirName =
    Url.Builder.absolute
        [ "attack"
        , theirName
        ]
        []


attackUrlParser : Parser (Route -> a) a
attackUrlParser =
    Url.Parser.map Attack
        (Url.Parser.s "attack"
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



-- INC SPECIAL ATTR


incSpecialAttrToUrl : SpecialAttr -> String
incSpecialAttrToUrl attr =
    Url.Builder.absolute
        [ "inc-special-attr"
        , String.toLower (Shared.Special.label attr)
        ]
        []


incSpecialAttrUrlParser : Parser (Route -> a) a
incSpecialAttrUrlParser =
    Url.Parser.map IncSpecialAttr
        (Url.Parser.s "inc-special-attr"
            </> Shared.Special.urlParser
        )


encodeIncSpecialAttr : IncSpecialAttrResponse -> JE.Value
encodeIncSpecialAttr { world, messageQueue } =
    JE.object
        [ ( "world", Shared.World.encode world )
        , ( "messageQueue", Shared.MessageQueue.encode messageQueue )
        ]


incSpecialAttrDecoder : Decoder IncSpecialAttrResponse
incSpecialAttrDecoder =
    JD.map2 IncSpecialAttrResponse
        (JD.field "world" Shared.World.decoder)
        (JD.field "messageQueue" Shared.MessageQueue.decoder)


incSpecialAttrResponse : List String -> String -> ServerWorld -> Maybe IncSpecialAttrResponse
incSpecialAttrResponse messageQueue name world =
    Shared.World.serverToClient name world
        |> Maybe.map (\clientWorld -> IncSpecialAttrResponse clientWorld messageQueue)
