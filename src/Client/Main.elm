module Client.Main exposing (main)

import Browser
import Browser.Navigation
import Extra.Http as EH
import Html as H exposing (Attribute, Html)
import Html.Attributes as HA
import Html.Events as HE
import Http
import Json.Decode as JD exposing (Decoder)
import Json.Encode as JE
import RemoteData exposing (RemoteData(..), WebData)
import Server.Route
    exposing
        ( AttackResponse
        , AuthError(..)
        , LoginResponse
        , RefreshResponse
        , SignupError
        , SignupResponse
        , toString
        )
import Shared.Fight exposing (Fight(..))
import Shared.Level
import Shared.MessageQueue
import Shared.Password exposing (Authentication)
import Shared.Player exposing (ClientOtherPlayer, ClientPlayer)
import Shared.World exposing (ClientWorld)
import Url exposing (Url)


type alias Flags =
    { serverEndpoint : String
    }


type alias Model =
    { navigationKey : Browser.Navigation.Key
    , serverEndpoint : String
    , user : User
    }


type User
    = Anonymous CredentialsForm
    | SigningUp CredentialsForm
    | SigningUpError SignupError CredentialsForm
    | UnknownError String CredentialsForm
    | LoggingIn CredentialsForm
    | LoggingInError AuthError CredentialsForm
    | LoggedIn LoggedInUser


type alias CredentialsForm =
    { name : String
    , password : String
    }


type alias LoggedInUser =
    { name : String
    , hashedPassword : String
    , world : WebData ClientWorld
    , messages : List String
    }


type Msg
    = NoOp
    | UrlRequested Browser.UrlRequest
    | UrlChanged Url
    | Request Server.Route.Route
    | GetSignupResponse (WebData (Result SignupError SignupResponse))
    | GetLoginResponse (WebData (Result AuthError LoginResponse))
    | GetRefreshResponse (WebData (Result AuthError RefreshResponse))
    | GetAttackResponse (WebData (Result AuthError AttackResponse))
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
init flags url key =
    ( { navigationKey = key
      , serverEndpoint = flags.serverEndpoint
      , user = Anonymous { name = "", password = "" }
      }
    , Cmd.none
    )


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
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
                |> setPassword password
            , Cmd.none
            )

        Request Server.Route.NotFound ->
            ( model
            , Cmd.none
            )

        Request ((Server.Route.Signup auth) as route) ->
            ( model
                |> setWorldAsLoading
            , sendRequest model.serverEndpoint route (Just auth)
            )

        Request ((Server.Route.Login auth) as route) ->
            ( model
                |> setWorldAsLoading
            , sendRequest model.serverEndpoint route (Just auth)
            )

        Request ((Server.Route.Attack _) as route) ->
            ( model
                |> setWorldAsLoading
            , sendRequest model.serverEndpoint route (getAuth model)
            )

        Request (Server.Route.Refresh as route) ->
            ( model
                |> setWorldAsLoading
            , sendRequest model.serverEndpoint route (getAuth model)
            )

        GetSignupResponse response ->
            ( case response of
                Success response_ ->
                    case response_ of
                        Ok { world, messageQueue } ->
                            model
                                |> transitionUser
                                    (\{ name, password } ->
                                        LoggedIn
                                            { name = name
                                            , hashedPassword = Shared.Password.hash password
                                            , world = Success world
                                            , messages = messageQueue
                                            }
                                    )

                        Err signupError ->
                            model
                                |> transitionUser (SigningUpError signupError)

                Failure error ->
                    model
                        |> transitionUser (UnknownError (EH.errorToString error))

                NotAsked ->
                    model
                        |> transitionUser (UnknownError "Internal error: Signup got into NotAsked state")

                Loading ->
                    model
                        |> transitionUser (UnknownError "Internal error: Signup got into Loading state")
            , Cmd.none
            )

        GetLoginResponse response ->
            ( case response of
                Success response_ ->
                    case response_ of
                        Ok { world, messageQueue } ->
                            model
                                |> transitionUser
                                    (\{ name, password } ->
                                        LoggedIn
                                            { name = name
                                            , hashedPassword = Shared.Password.hash password
                                            , world = Success world
                                            , messages = messageQueue
                                            }
                                    )

                        Err authError ->
                            model
                                |> transitionUser (LoggingInError authError)

                Failure error ->
                    model
                        |> transitionUser (UnknownError (EH.errorToString error))

                NotAsked ->
                    model
                        |> transitionUser (UnknownError "Internal error: Login got into NotAsked state")

                Loading ->
                    model
                        |> transitionUser (UnknownError "Internal error: Login got into Loading state")
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


type alias WithPlayer a =
    { a | player : ClientPlayer }


type alias WithOtherPlayers a =
    { a | otherPlayers : List ClientOtherPlayer }


type alias WithMessageQueue a =
    { a | messageQueue : List String }


transitionUser : (CredentialsForm -> User) -> Model -> Model
transitionUser fn model =
    { model
        | user =
            case model.user of
                Anonymous credentialsForm ->
                    fn credentialsForm

                SigningUp credentialsForm ->
                    fn credentialsForm

                SigningUpError _ credentialsForm ->
                    fn credentialsForm

                UnknownError _ credentialsForm ->
                    fn credentialsForm

                LoggingIn credentialsForm ->
                    fn credentialsForm

                LoggingInError _ credentialsForm ->
                    fn credentialsForm

                LoggedIn _ ->
                    model.user
    }


getAuth : Model -> Maybe Authentication
getAuth model =
    case model.user of
        Anonymous _ ->
            Nothing

        SigningUp _ ->
            Nothing

        SigningUpError _ _ ->
            Nothing

        UnknownError _ _ ->
            Nothing

        LoggingIn _ ->
            Nothing

        LoggingInError _ _ ->
            Nothing

        LoggedIn { name, hashedPassword } ->
            Just
                { name = name
                , hashedPassword = hashedPassword
                }


mapCredentialsForm : (CredentialsForm -> CredentialsForm) -> Model -> Model
mapCredentialsForm fn model =
    { model
        | user =
            case model.user of
                Anonymous credentialsForm ->
                    Anonymous (fn credentialsForm)

                SigningUp credentialsForm ->
                    SigningUp (fn credentialsForm)

                SigningUpError error credentialsForm ->
                    SigningUpError error (fn credentialsForm)

                UnknownError error credentialsForm ->
                    UnknownError error (fn credentialsForm)

                LoggingIn credentialsForm ->
                    LoggingIn (fn credentialsForm)

                LoggingInError error credentialsForm ->
                    LoggingInError error (fn credentialsForm)

                LoggedIn _ ->
                    model.user
    }


mapLoggedInUser : (LoggedInUser -> LoggedInUser) -> Model -> Model
mapLoggedInUser fn model =
    { model
        | user =
            case model.user of
                Anonymous _ ->
                    model.user

                SigningUp _ ->
                    model.user

                SigningUpError _ _ ->
                    model.user

                UnknownError _ _ ->
                    model.user

                LoggingIn _ ->
                    model.user

                LoggingInError _ _ ->
                    model.user

                LoggedIn loggedInUser ->
                    LoggedIn (fn loggedInUser)
    }


setName : String -> Model -> Model
setName name model =
    model
        |> mapCredentialsForm (\form -> { form | name = name })


setPassword : String -> Model -> Model
setPassword password model =
    model
        |> mapCredentialsForm (\form -> { form | password = password })


updateWorld : WithWorld a -> Model -> Model
updateWorld { world } model =
    model
        |> mapLoggedInUser (\user -> { user | world = Success world })


emptyMessages : Model -> Model
emptyMessages model =
    model
        |> mapLoggedInUser (\user -> { user | messages = [] })


updateMessages : WithMessageQueue a -> Model -> Model
updateMessages { messageQueue } model =
    model
        |> mapLoggedInUser (\user -> { user | messages = user.messages ++ messageQueue })


setWorldAsLoading : Model -> Model
setWorldAsLoading model =
    model
        |> mapLoggedInUser (\user -> { user | world = Loading })


addMessage : String -> Model -> Model
addMessage message model =
    addMessages [ message ] model


addMessages : List String -> Model -> Model
addMessages messages model =
    model
        |> mapLoggedInUser (\user -> { user | messages = user.messages ++ messages })


sendRequest : String -> Server.Route.Route -> Maybe Authentication -> Cmd Msg
sendRequest serverEndpoint route maybeAuth =
    let
        authHeaders : Maybe Authentication -> List Http.Header
        authHeaders maybeAuth_ =
            maybeAuth_
                |> Maybe.map
                    (\{ name, hashedPassword } ->
                        [ Http.header "x-username" name
                        , Http.header "x-hashed-password" hashedPassword
                        ]
                    )
                |> Maybe.withDefault []

        send : (WebData a -> Msg) -> Decoder a -> Maybe Authentication -> Cmd Msg
        send tagger decoder maybeAuth_ =
            Http.request
                { method = "GET"
                , headers = authHeaders maybeAuth_
                , url = serverEndpoint ++ Server.Route.toString route
                , body = Http.emptyBody
                , expect = Http.expectJson decoder
                , timeout = Nothing
                , withCredentials = False
                }
                |> RemoteData.sendRequest
                |> Cmd.map tagger
    in
    case route of
        Server.Route.NotFound ->
            send (\_ -> NoOp) (JD.fail "Server route not found") Nothing

        Server.Route.Signup _ ->
            send GetSignupResponse
                (successOrErrorDecoder
                    Server.Route.signupDecoder
                    Server.Route.signupErrorDecoder
                )
                Nothing

        Server.Route.Login auth ->
            send GetLoginResponse
                (successOrErrorDecoder
                    Server.Route.loginDecoder
                    Server.Route.authErrorDecoder
                )
                Nothing

        Server.Route.Refresh ->
            send GetRefreshResponse
                (successOrErrorDecoder
                    Server.Route.refreshDecoder
                    Server.Route.authErrorDecoder
                )
                maybeAuth

        Server.Route.Attack _ ->
            send GetAttackResponse
                (successOrErrorDecoder
                    Server.Route.attackDecoder
                    Server.Route.authErrorDecoder
                )
                maybeAuth


subscriptions : Model -> Sub Msg
subscriptions model =
    Sub.none


view : Model -> Browser.Document Msg
view model =
    { title = "NuAshworld"
    , body =
        case model.user of
            Anonymous credentialsForm ->
                viewCredentialsForm credentialsForm Nothing

            SigningUp _ ->
                [ H.text "Signing up" ]

            SigningUpError signupError credentialsForm ->
                viewCredentialsForm credentialsForm (Just (Server.Route.signupErrorToString signupError))

            UnknownError error credentialsForm ->
                viewCredentialsForm credentialsForm (Just error)

            LoggingIn _ ->
                [ H.text "Logging in" ]

            LoggingInError authError credentialsForm ->
                viewCredentialsForm credentialsForm (Just (Server.Route.authErrorToString authError))

            LoggedIn loggedInUser ->
                viewLoggedInUser loggedInUser
    }


viewCredentialsForm : CredentialsForm -> Maybe String -> List (Html Msg)
viewCredentialsForm { name, password } maybeError =
    let
        unmetRules : List String
        unmetRules =
            List.filterMap identity
                [ if String.isEmpty name then
                    Just "Name must not be empty"
                  else
                    Nothing
                , if String.length password < 5 then
                    Just "Password must be 5 or more characters long"
                  else
                    Nothing
                ]

        hasUnmetRules : Bool
        hasUnmetRules =
            not (List.isEmpty unmetRules)

        button : (Authentication -> Server.Route.Route) -> String -> Html Msg
        button tagger label =
            H.button
                (if hasUnmetRules then
                    [ HA.disabled True
                    , HA.title (unmetRules |> String.join "; ")
                    ]
                 else
                    [ onClickRequest
                        (tagger
                            { name = name
                            , hashedPassword = Shared.Password.hash password
                            }
                        )
                    ]
                )
                [ H.text label ]
    in
    [ H.input
        [ HE.onInput SetName
        , HA.value name
        , HA.placeholder "Name"
        ]
        []
    , H.input
        [ HE.onInput SetPassword
        , HA.value password
        , HA.type_ "password"
        , HA.placeholder "Password"
        ]
        []
    , button Server.Route.Signup "Signup"
    , button Server.Route.Login "Login"
    , maybeError
        |> Maybe.map (\error -> H.div [] [ H.text error ])
        |> Maybe.withDefault (H.text "")
    ]


viewLoggedInUser : LoggedInUser -> List (Html Msg)
viewLoggedInUser user =
    [ viewMessages user.messages
    , viewButtons user.world
    , viewWorld user.world
    ]


viewMessages : List String -> Html Msg
viewMessages messages =
    H.div []
        [ H.strong [] [ H.text "Messages:" ]
        , H.ul [] (List.map viewMessage messages)
        ]


viewMessage : String -> Html Msg
viewMessage message =
    H.li [] [ H.text message ]


viewButtons : WebData ClientWorld -> Html Msg
viewButtons world =
    H.div []
        [ H.button
            [ world
                |> RemoteData.map (\_ -> onClickRequest Server.Route.Refresh)
                |> RemoteData.withDefault (HA.disabled True)
            ]
            [ H.text "Refresh" ]
        ]


onClickRequest : Server.Route.Route -> Attribute Msg
onClickRequest route =
    HE.onClick (Request route)


viewWorld : WebData ClientWorld -> Html Msg
viewWorld world =
    case world of
        NotAsked ->
            H.text "You're not logged in!"

        Loading ->
            H.text "Loading"

        Failure err ->
            H.text "Error :("

        Success world_ ->
            viewLoadedWorld world_


viewLoadedWorld : ClientWorld -> Html Msg
viewLoadedWorld world =
    H.div []
        [ viewPlayer world.player
        , viewOtherPlayers world
        ]


viewPlayer : ClientPlayer -> Html Msg
viewPlayer player =
    H.table []
        [ H.tr []
            [ H.th [] []
            , H.th [] [ H.text "PLAYER STATS" ]
            ]
        , H.tr []
            [ H.th [] [ H.text "Name" ]
            , H.td [] [ H.text player.name ]
            ]
        , H.tr []
            [ H.th [] [ H.text "HP" ]
            , H.td [] [ H.text (String.fromInt player.hp ++ "/" ++ String.fromInt player.maxHp) ]
            ]
        , H.tr []
            [ H.th [] [ H.text "Level" ]
            , H.td []
                [ H.text <|
                    String.fromInt (Shared.Level.levelForXp player.xp)
                        ++ " ("
                        ++ String.fromInt player.xp
                        ++ " XP, "
                        ++ String.fromInt (Shared.Level.xpToNextLevel player.xp)
                        ++ " till the next level)"
                ]
            ]
        ]


viewOtherPlayers : WithPlayer (WithOtherPlayers a) -> Html Msg
viewOtherPlayers { player, otherPlayers } =
    H.div []
        [ H.strong [] [ H.text "Other players:" ]
        , if List.isEmpty otherPlayers then
            H.div [] [ H.text "There are none so far!" ]
          else
            H.table []
                (H.tr []
                    [ H.th [] [ H.text "Player" ]
                    , H.th [] [ H.text "HP" ]
                    , H.th [] [ H.text "Level" ]
                    , H.th [] []
                    ]
                    :: List.map (viewOtherPlayer player) otherPlayers
                )
        ]


viewOtherPlayer : ClientPlayer -> ClientOtherPlayer -> Html Msg
viewOtherPlayer player otherPlayer =
    H.tr []
        [ H.td [] [ H.text otherPlayer.name ]
        , H.td [] [ H.text (String.fromInt otherPlayer.hp) ]
        , H.td [] [ H.text (String.fromInt (Shared.Level.levelForXp otherPlayer.xp)) ]
        , H.td []
            [ H.button
                [ if player.hp > 0 && otherPlayer.hp > 0 then
                    onClickRequest
                        (Server.Route.Attack
                            { you = player.name
                            , them = otherPlayer.name
                            }
                        )
                  else
                    HA.disabled True
                ]
                [ H.text "Attack!" ]
            ]
        ]


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
