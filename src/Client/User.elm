module Client.User
    exposing
        ( Form
        , LoggedInUser
        , User(..)
        , formToAuth
        , getAuthFromForm
        , getAuthFromUser
        , getForm
        , init
        , loggedIn
        , loggingInError
        , logout
        , mapForm
        , mapLoggedInUser
        , mapLoggedOffWorld
        , signingUpError
        , transitionFromLoggedOff
        , unknownError
        )

import RemoteData exposing (RemoteData(..), WebData)
import Server.Route as Route exposing (AuthError, SignupError)
import Shared.Password exposing (Auth, Hashed, Password, Plaintext)
import Shared.World exposing (AnonymousClientWorld, ClientWorld)


-- TYPES


type User
    = Anonymous (WebData AnonymousClientWorld) Form
    | SigningUp (WebData AnonymousClientWorld) Form
    | SigningUpError SignupError (WebData AnonymousClientWorld) Form
    | UnknownError String (WebData AnonymousClientWorld) Form
    | LoggingIn (WebData AnonymousClientWorld) Form
    | LoggingInError AuthError (WebData AnonymousClientWorld) Form
    | LoggedIn LoggedInUser


type alias Form =
    { name : String
    , password : Password Plaintext
    }


type alias LoggedInUser =
    { name : String
    , password : Password Hashed
    , world : WebData ClientWorld
    , messages : List String
    }



-- HELP


emptyForm : Form
emptyForm =
    { name = ""
    , password = Shared.Password.password ""
    }



-- CONSTRUCTORS


init : User
init =
    Anonymous NotAsked emptyForm


loggedIn : String -> Password Plaintext -> ClientWorld -> List String -> User
loggedIn name password world messageQueue =
    LoggedIn
        { name = name
        , password = Shared.Password.hash password
        , world = Success world
        , messages = messageQueue
        }


signingUpError : SignupError -> WebData AnonymousClientWorld -> Form -> User
signingUpError error world form =
    SigningUpError error world form


unknownError : String -> WebData AnonymousClientWorld -> Form -> User
unknownError error world form =
    UnknownError error world form


loggingInError : AuthError -> WebData AnonymousClientWorld -> Form -> User
loggingInError error world form =
    LoggingInError error world form



-- TRANSITIONS


transitionFromLoggedOff : (WebData AnonymousClientWorld -> Form -> User) -> User -> User
transitionFromLoggedOff fn user =
    getFromLoggedOff fn user user


logout : User -> User
logout user =
    getFrom
        (\world form ->
            Anonymous world form
        )
        (\{ world } ->
            Anonymous
                (RemoteData.map Shared.World.clientToAnonymous world)
                emptyForm
        )
        user



-- HELPERS


getFromLoggedOff : (WebData AnonymousClientWorld -> Form -> a) -> a -> User -> a
getFromLoggedOff fn default user =
    getFrom fn (\_ -> default) user


getFromLoggedIn : (LoggedInUser -> a) -> a -> User -> a
getFromLoggedIn fn default user =
    getFrom (\_ _ -> default) fn user


getFrom : (WebData AnonymousClientWorld -> Form -> a) -> (LoggedInUser -> a) -> User -> a
getFrom fnLoggedOff fnLoggedIn user =
    case user of
        Anonymous world form ->
            fnLoggedOff world form

        SigningUp world form ->
            fnLoggedOff world form

        SigningUpError _ world form ->
            fnLoggedOff world form

        UnknownError _ world form ->
            fnLoggedOff world form

        LoggingIn world form ->
            fnLoggedOff world form

        LoggingInError _ world form ->
            fnLoggedOff world form

        LoggedIn loggedInUser ->
            fnLoggedIn loggedInUser


map : (( WebData AnonymousClientWorld, Form ) -> ( WebData AnonymousClientWorld, Form )) -> (LoggedInUser -> LoggedInUser) -> User -> User
map fnLoggedOff fnLoggedIn user =
    let
        uncurry : (a -> b -> c) -> (( a, b ) -> c)
        uncurry f ( a, b ) =
            f a b
    in
    case user of
        Anonymous world form ->
            uncurry Anonymous (fnLoggedOff ( world, form ))

        SigningUp world form ->
            uncurry SigningUp (fnLoggedOff ( world, form ))

        SigningUpError error world form ->
            uncurry (SigningUpError error) (fnLoggedOff ( world, form ))

        UnknownError error world form ->
            uncurry (UnknownError error) (fnLoggedOff ( world, form ))

        LoggingIn world form ->
            uncurry LoggingIn (fnLoggedOff ( world, form ))

        LoggingInError error world form ->
            uncurry (LoggingInError error) (fnLoggedOff ( world, form ))

        LoggedIn loggedInUser ->
            LoggedIn (fnLoggedIn loggedInUser)


mapLoggedOff : (( WebData AnonymousClientWorld, Form ) -> ( WebData AnonymousClientWorld, Form )) -> User -> User
mapLoggedOff fn user =
    map fn identity user


mapForm : (Form -> Form) -> User -> User
mapForm fn user =
    mapLoggedOff
        (\( world, form ) -> ( world, fn form ))
        user


mapLoggedOffWorld : (WebData AnonymousClientWorld -> WebData AnonymousClientWorld) -> User -> User
mapLoggedOffWorld fn user =
    mapLoggedOff
        (\( world, form ) -> ( fn world, form ))
        user


mapLoggedInUser : (LoggedInUser -> LoggedInUser) -> User -> User
mapLoggedInUser fn user =
    map identity fn user



-- GETTERS


getForm : User -> Maybe Form
getForm user =
    getFromLoggedOff
        (\_ form -> Just form)
        Nothing
        user


getLoggedInUser : User -> Maybe LoggedInUser
getLoggedInUser user =
    getFromLoggedIn
        (\loggedInUser -> Just loggedInUser)
        Nothing
        user


getAuthFromForm : User -> Maybe (Auth Hashed)
getAuthFromForm user =
    getForm user
        |> Maybe.map formToAuth


getAuthFromUser : User -> Maybe (Auth Hashed)
getAuthFromUser user =
    getLoggedInUser user
        |> Maybe.map
            (\{ name, password } ->
                { name = name
                , password = password
                }
            )


formToAuth : Form -> Auth Hashed
formToAuth { name, password } =
    { name = name
    , password = Shared.Password.hash password
    }
