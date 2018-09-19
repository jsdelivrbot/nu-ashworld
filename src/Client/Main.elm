module Client.Main exposing (main)

import Browser
import Browser.Navigation
import Client.User as User exposing (Form, LoggedInUser, User(..))
import Extra.Http as EH
import Html as H exposing (Attribute, Html)
import Html.Attributes as HA
import Html.Events as HE
import Http
import Json.Decode as JD exposing (Decoder)
import Json.Encode as JE
import RemoteData exposing (RemoteData(..), WebData)
import Server.Route as Route
    exposing
        ( AttackResponse
        , AuthError(..)
        , IncSpecialAttrResponse
        , LoginResponse
        , LogoutResponse
        , RefreshAnonymousResponse
        , RefreshResponse
        , Route(..)
        , SignupError
        , SignupResponse
        , toString
        )
import Shared.Fight exposing (Fight)
import Shared.Level
import Shared.MessageQueue
import Shared.Password exposing (Auth, Hashed, Password, Plaintext)
import Shared.Player exposing (ClientOtherPlayer, ClientPlayer)
import Shared.World exposing (AnonymousClientWorld, ClientWorld)
import Url exposing (Url)


type alias Flags =
    { serverEndpoint : String
    }


type alias Model =
    { navigationKey : Browser.Navigation.Key
    , serverEndpoint : String
    , user : User
    }


type Msg
    = NoOp
    | UrlRequested Browser.UrlRequest
    | UrlChanged Url
    | Request Route
    | GetSignupResponse (WebData (Result SignupError SignupResponse))
    | GetLoginResponse (WebData (Result AuthError LoginResponse))
    | GetRefreshResponse (WebData (Result AuthError RefreshResponse))
    | GetAttackResponse (WebData (Result AuthError AttackResponse))
    | GetLogoutResponse (WebData LogoutResponse)
    | GetRefreshAnonymousResponse (WebData RefreshAnonymousResponse)
    | GetIncSpecialAttrResponse (WebData (Result AuthError IncSpecialAttrResponse))
    | SetName String
    | SetPassword String


main : Program Flags Model Msg
main =
    Browser.application
        { init = init
        , update = update
        , subscriptions = subscriptions
        , view = view
        , onUrlRequest = UrlRequested
        , onUrlChange = UrlChanged
        }


init : Flags -> Url -> Browser.Navigation.Key -> ( Model, Cmd Msg )
init { serverEndpoint } url key =
    ( { navigationKey = key
      , serverEndpoint = serverEndpoint
      , user = User.init
      }
    , sendRequest serverEndpoint RefreshAnonymous Nothing
    )


update : Msg -> Model -> ( Model, Cmd Msg )
update msg ({ serverEndpoint } as model) =
    case msg of
        NoOp ->
            ( model, Cmd.none )

        UrlRequested _ ->
            ( model
                |> addMessage "UrlRequested TODO"
            , Cmd.none
            )

        UrlChanged _ ->
            ( model
                |> addMessage "UrlChanged TODO"
            , Cmd.none
            )

        SetName name ->
            ( model
                |> setName name
            , Cmd.none
            )

        SetPassword password ->
            ( model
                |> setPassword (Shared.Password.password password)
            , Cmd.none
            )

        Request route ->
            case route of
                -- TODO DRY this into the Route.handlers? ie. type GetAuthFrom = Form | User | Nowhere
                NotFound ->
                    ( model
                    , Cmd.none
                    )

                Signup ->
                    ( model
                        |> setWorldAsLoading
                    , sendRequest serverEndpoint route (getAuthFromForm model)
                    )

                Login ->
                    ( model
                        |> setWorldAsLoading
                    , sendRequest serverEndpoint route (getAuthFromForm model)
                    )

                Logout ->
                    ( -- TODO maybe logout on the client side optimistically?
                      model
                        |> updateUser (User.mapLoggedOffWorld (\_ -> Loading))
                    , sendRequest serverEndpoint route Nothing
                    )

                Attack _ ->
                    ( model
                        |> setWorldAsLoading
                    , sendRequest serverEndpoint route (getAuthFromUser model)
                    )

                Refresh ->
                    ( model
                        |> setWorldAsLoading
                    , sendRequest serverEndpoint route (getAuthFromUser model)
                    )

                RefreshAnonymous ->
                    ( model
                        |> updateUser (User.mapLoggedOffWorld (\_ -> Loading))
                    , sendRequest serverEndpoint route Nothing
                    )

                IncSpecialAttr attr ->
                    ( model
                    , sendRequest serverEndpoint route (getAuthFromUser model)
                    )

        GetSignupResponse response ->
            ( case response of
                Success response_ ->
                    case response_ of
                        Ok { world, messageQueue } ->
                            model
                                |> updateUser
                                    (User.transitionFromLoggedOff
                                        (\_ { name, password } ->
                                            User.loggedIn name password world messageQueue
                                        )
                                    )

                        Err signupError ->
                            model
                                |> updateUser (User.transitionFromLoggedOff (User.signingUpError signupError))

                Failure error ->
                    model
                        |> updateUser (User.transitionFromLoggedOff (User.unknownError (EH.errorToString error)))

                NotAsked ->
                    model
                        |> updateUser (User.transitionFromLoggedOff (User.unknownError "Internal error: Signup got into NotAsked state"))

                Loading ->
                    model
                        |> updateUser (User.transitionFromLoggedOff (User.unknownError "Internal error: Signup got into Loading state"))
            , Cmd.none
            )

        GetLoginResponse response ->
            ( case response of
                Success response_ ->
                    case response_ of
                        Ok { world, messageQueue } ->
                            model
                                |> updateUser
                                    (User.transitionFromLoggedOff
                                        (\_ { name, password } ->
                                            User.loggedIn name password world messageQueue
                                        )
                                    )

                        Err authError ->
                            model
                                |> updateUser (User.transitionFromLoggedOff (User.loggingInError authError))

                Failure error ->
                    model
                        |> updateUser (User.transitionFromLoggedOff (User.unknownError (EH.errorToString error)))

                NotAsked ->
                    model
                        |> updateUser (User.transitionFromLoggedOff (User.unknownError "Internal error: Login got into NotAsked state"))

                Loading ->
                    model
                        |> updateUser (User.transitionFromLoggedOff (User.unknownError "Internal error: Login got into Loading state"))
            , Cmd.none
            )

        GetRefreshResponse response ->
            ( response
                |> handleResponse
                    { ok =
                        \response_ ->
                            model
                                |> updateWorld response_
                                |> updateMessages response_
                    , err = \_ -> model
                    , default = model
                    }
            , Cmd.none
            )

        GetAttackResponse response ->
            ( response
                |> handleResponse
                    { ok =
                        \response_ ->
                            model
                                |> updateWorld response_
                                |> updateMessages response_
                    , err = \_ -> model
                    , default = model
                    }
            , Cmd.none
            )

        GetLogoutResponse response ->
            ( case response of
                Success response_ ->
                    model
                        |> updateUser User.logout
                        |> updateAnonymousWorld response_

                Failure err ->
                    -- TODO think about it
                    model

                NotAsked ->
                    model

                Loading ->
                    model
            , Cmd.none
            )

        GetRefreshAnonymousResponse response ->
            ( model
                |> updateUser (User.mapLoggedOffWorld (\_ -> RemoteData.map .world response))
            , Cmd.none
            )

        GetIncSpecialAttrResponse response ->
            ( response
                |> handleResponse
                    { ok =
                        \response_ ->
                            model
                                |> updateWorld response_
                                |> updateMessages response_
                    , err = \_ -> model
                    , default = model
                    }
            , Cmd.none
            )


handleResponse :
    { ok : ok -> Model
    , err : err -> Model
    , default : Model
    }
    -> WebData (Result err ok)
    -> Model
handleResponse { ok, err, default } response =
    response
        |> RemoteData.map
            (\response_ ->
                case response_ of
                    Ok data ->
                        ok data

                    Err error ->
                        err error
            )
        |> RemoteData.withDefault default


type alias WithFight a =
    { a | fight : Maybe Fight }


type alias WithWorld a =
    { a | world : ClientWorld }


type alias WithAnonymousWorld a =
    { a | world : AnonymousClientWorld }


type alias WithMessageQueue a =
    { a | messageQueue : List String }


updateUser : (User -> User) -> Model -> Model
updateUser fn model =
    { model | user = fn model.user }


getAuthFromForm : Model -> Maybe (Auth Hashed)
getAuthFromForm model =
    model.user
        |> User.getAuthFromForm


getAuthFromUser : Model -> Maybe (Auth Hashed)
getAuthFromUser model =
    model.user
        |> User.getAuthFromUser


setName : String -> Model -> Model
setName name model =
    model
        |> updateUser (User.mapForm (\form -> { form | name = name }))


setPassword : Password Plaintext -> Model -> Model
setPassword password model =
    model
        |> updateUser (User.mapForm (\form -> { form | password = password }))


updateWorld : WithWorld a -> Model -> Model
updateWorld { world } model =
    model
        |> updateUser (User.mapLoggedInUser (\user -> { user | world = Success world }))


updateAnonymousWorld : WithAnonymousWorld a -> Model -> Model
updateAnonymousWorld { world } model =
    model
        |> updateUser (User.mapLoggedOffWorld (\_ -> Success world))


emptyMessages : Model -> Model
emptyMessages model =
    model
        |> updateUser (User.mapLoggedInUser (\user -> { user | messages = [] }))


updateMessages : WithMessageQueue a -> Model -> Model
updateMessages { messageQueue } model =
    model
        |> updateUser (User.mapLoggedInUser (\user -> { user | messages = user.messages ++ messageQueue }))


setWorldAsLoading : Model -> Model
setWorldAsLoading model =
    model
        |> updateUser (User.mapLoggedInUser (\user -> { user | world = Loading }))


addMessage : String -> Model -> Model
addMessage message model =
    addMessages [ message ] model


addMessages : List String -> Model -> Model
addMessages messages model =
    model
        |> updateUser (User.mapLoggedInUser (\user -> { user | messages = user.messages ++ messages }))


sendRequest : String -> Route -> Maybe (Auth Hashed) -> Cmd Msg
sendRequest serverEndpoint route maybeAuth =
    let
        authHeaders : List Http.Header
        authHeaders =
            maybeAuth
                |> Maybe.map
                    (\{ name, password } ->
                        [ Http.header "x-username" name
                        , Http.header "x-hashed-password" (Shared.Password.unwrapHashed password)
                        ]
                    )
                |> Maybe.withDefault []

        send : (WebData a -> Msg) -> Decoder a -> Cmd Msg
        send tagger decoder =
            Http.request
                { method = "GET"
                , headers = authHeaders
                , url = serverEndpoint ++ Route.toString route
                , body = Http.emptyBody
                , expect = Http.expectJson decoder
                , timeout = Nothing
                , withCredentials = False
                }
                |> RemoteData.sendRequest
                |> Cmd.map tagger
    in
    case route of
        NotFound ->
            send
                (\_ -> NoOp)
                (JD.fail "Server route not found")

        Signup ->
            send
                GetSignupResponse
                (successOrErrorDecoder
                    Route.handlers.signup.decoder
                    Route.handlers.signup.errorDecoder
                )

        Login ->
            send
                GetLoginResponse
                (successOrErrorDecoder
                    Route.handlers.login.decoder
                    Route.handlers.login.errorDecoder
                )

        Refresh ->
            send
                GetRefreshResponse
                (successOrErrorDecoder
                    Route.handlers.refresh.decoder
                    Route.handlers.refresh.errorDecoder
                )

        Attack _ ->
            send
                GetAttackResponse
                (successOrErrorDecoder
                    Route.handlers.attack.decoder
                    Route.handlers.attack.errorDecoder
                )

        Logout ->
            send
                GetLogoutResponse
                Route.handlers.logout.decoder

        RefreshAnonymous ->
            send
                GetRefreshAnonymousResponse
                Route.handlers.refreshAnonymous.decoder

        IncSpecialAttr _ ->
            send
                GetIncSpecialAttrResponse
                (successOrErrorDecoder
                    Route.handlers.incSpecialAttr.decoder
                    Route.handlers.incSpecialAttr.errorDecoder
                )


subscriptions : Model -> Sub Msg
subscriptions model =
    Sub.none


userConfig : User.Config Msg
userConfig =
    { setName = SetName
    , setPassword = SetPassword
    , request = Request
    }


view : Model -> Browser.Document Msg
view model =
    { title = "NuAshworld"
    , body =
        case model.user of
            Anonymous world form ->
                User.viewLoggedOff
                    userConfig
                    world
                    form
                    Nothing

            SigningUp world form ->
                User.viewLoggedOff
                    userConfig
                    world
                    form
                    (Just "Signing up")

            SigningUpError error world form ->
                User.viewLoggedOff
                    userConfig
                    world
                    form
                    (Just (Route.handlers.signup.errorToString error))

            UnknownError error world form ->
                User.viewLoggedOff
                    userConfig
                    world
                    form
                    (Just error)

            LoggingIn world form ->
                User.viewLoggedOff
                    userConfig
                    world
                    form
                    (Just "Logging in")

            LoggingInError error world form ->
                User.viewLoggedOff
                    userConfig
                    world
                    form
                    (Just (Route.handlers.login.errorToString error))

            LoggedIn loggedInUser ->
                User.viewLoggedIn
                    userConfig
                    loggedInUser
    }


successOrErrorDecoder : Decoder a -> Decoder b -> Decoder (Result b a)
successOrErrorDecoder successDecoder errorDecoder =
    JD.value
        |> JD.andThen
            (\value ->
                case JD.decodeValue successDecoder value of
                    Ok response ->
                        JD.succeed (Ok response)

                    Err _ ->
                        case JD.decodeValue errorDecoder value of
                            Ok error ->
                                JD.succeed (Err error)

                            Err _ ->
                                JD.fail "Unknown response"
            )
