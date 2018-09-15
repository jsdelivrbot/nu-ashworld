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
        , LoginResponse
        , LogoutResponse
        , RefreshAnonymousResponse
        , RefreshResponse
        , Route(..)
        , SignupError
        , SignupResponse
        , toString
        )
import Shared.Fight exposing (Fight(..))
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

        Request NotFound ->
            ( model
            , Cmd.none
            )

        Request (Signup as route) ->
            ( model
                |> setWorldAsLoading
            , sendRequest serverEndpoint route (getAuthFromForm model)
            )

        Request (Login as route) ->
            ( model
                |> setWorldAsLoading
            , sendRequest serverEndpoint route (getAuthFromForm model)
            )

        Request (Logout as route) ->
            ( -- TODO maybe logout on the client side optimistically?
              model
                |> updateUser (User.mapLoggedOffWorld (\_ -> Loading))
            , sendRequest serverEndpoint route Nothing
            )

        Request ((Attack _) as route) ->
            ( model
                |> setWorldAsLoading
            , sendRequest serverEndpoint route (getAuthFromUser model)
            )

        Request (Refresh as route) ->
            ( model
                |> setWorldAsLoading
            , sendRequest serverEndpoint route (getAuthFromUser model)
            )

        Request (RefreshAnonymous as route) ->
            ( model
                |> updateUser (User.mapLoggedOffWorld (\_ -> Loading))
            , sendRequest serverEndpoint route Nothing
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


type alias WithPlayer a =
    { a | player : ClientPlayer }


type alias WithPlayers a =
    { a | players : List ClientOtherPlayer }


type alias WithOtherPlayers a =
    { a | otherPlayers : List ClientOtherPlayer }


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
        authHeaders : Maybe (Auth Hashed) -> List Http.Header
        authHeaders maybeAuth_ =
            maybeAuth_
                |> Maybe.map
                    (\{ name, password } ->
                        [ Http.header "x-username" name
                        , Http.header "x-hashed-password" (Shared.Password.unwrapHashed password)
                        ]
                    )
                |> Maybe.withDefault []

        send : (WebData a -> Msg) -> Decoder a -> Maybe (Auth Hashed) -> Cmd Msg
        send tagger decoder maybeAuth_ =
            Http.request
                { method = "GET"
                , headers = authHeaders maybeAuth_
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
            send (\_ -> NoOp) (JD.fail "Server route not found") Nothing

        Signup ->
            send GetSignupResponse
                (successOrErrorDecoder
                    Route.handlers.signup.decoder
                    Route.handlers.signup.errorDecoder
                )
                maybeAuth

        Login ->
            send GetLoginResponse
                (successOrErrorDecoder
                    Route.handlers.login.decoder
                    Route.handlers.login.errorDecoder
                )
                maybeAuth

        Refresh ->
            send GetRefreshResponse
                (successOrErrorDecoder
                    Route.handlers.refresh.decoder
                    Route.handlers.refresh.errorDecoder
                )
                maybeAuth

        Attack _ ->
            send GetAttackResponse
                (successOrErrorDecoder
                    Route.handlers.attack.decoder
                    Route.handlers.attack.errorDecoder
                )
                maybeAuth

        Logout ->
            send GetLogoutResponse
                Route.handlers.logout.decoder
                Nothing

        RefreshAnonymous ->
            send GetRefreshAnonymousResponse
                Route.handlers.refreshAnonymous.decoder
                Nothing


subscriptions : Model -> Sub Msg
subscriptions model =
    Sub.none


view : Model -> Browser.Document Msg
view model =
    { title = "NuAshworld"
    , body =
        case model.user of
            Anonymous world form ->
                viewAnonymous world form Nothing

            SigningUp world form ->
                viewAnonymous
                    world
                    form
                    (Just "Signing up")

            SigningUpError error world form ->
                viewAnonymous
                    world
                    form
                    (Just (Route.handlers.signup.errorToString error))

            UnknownError error world form ->
                viewAnonymous world
                    form
                    (Just error)

            LoggingIn world form ->
                viewAnonymous
                    world
                    form
                    (Just "Logging in")

            LoggingInError error world form ->
                viewAnonymous world
                    form
                    (Just (Route.handlers.login.errorToString error))

            LoggedIn loggedInUser ->
                viewLoggedInUser loggedInUser
    }


viewAnonymous : WebData AnonymousClientWorld -> Form -> Maybe String -> List (Html Msg)
viewAnonymous world form maybeMessage =
    [ viewCredentialsForm form maybeMessage
    , viewAnonymousWorld world
    ]


viewCredentialsForm : Form -> Maybe String -> Html Msg
viewCredentialsForm { name, password } maybeMessage =
    let
        unmetRules : List String
        unmetRules =
            List.filterMap identity
                [ if String.isEmpty name then
                    Just "Name must not be empty"
                  else
                    Nothing
                , if String.length (Shared.Password.unwrapPlaintext password) < 5 then
                    Just "Password must be 5 or more characters long"
                  else
                    Nothing
                ]

        hasUnmetRules : Bool
        hasUnmetRules =
            not (List.isEmpty unmetRules)

        button : Route -> String -> Html Msg
        button route label =
            H.button
                (if hasUnmetRules then
                    [ HA.disabled True
                    , HA.title (String.join "; " unmetRules)
                    ]
                 else
                    [ onClickRequest route ]
                )
                [ H.text label ]
    in
    H.div []
        [ H.input
            [ HE.onInput SetName
            , HA.value name
            , HA.placeholder "Name"
            ]
            []
        , H.input
            [ HE.onInput SetPassword
            , HA.value (Shared.Password.unwrapPlaintext password)
            , HA.type_ "password"
            , HA.placeholder "Password"
            ]
            []
        , button Signup "Signup"
        , button Login "Login"
        , maybeMessage
            |> Maybe.map (\message -> H.div [] [ H.text message ])
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
                |> RemoteData.map (\_ -> onClickRequest Refresh)
                |> RemoteData.withDefault (HA.disabled True)
            ]
            [ H.text "Refresh" ]
        , H.button
            [ onClickRequest Logout ]
            [ H.text "Logout" ]
        ]


onClickRequest : Route -> Attribute Msg
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
            H.div []
                [ viewPlayer world_.player
                , viewOtherPlayers world_
                ]


viewAnonymousWorld : WebData AnonymousClientWorld -> Html Msg
viewAnonymousWorld world =
    case world of
        NotAsked ->
            H.text "Eh, the game should probably ask the server for the world data - oops. Can you ping @janiczek?"

        Loading ->
            H.text "Loading"

        Failure err ->
            H.text "Error :("

        Success world_ ->
            viewPlayers world_


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


viewPlayers : WithPlayers a -> Html Msg
viewPlayers { players } =
    H.div []
        [ H.strong [] [ H.text "Players:" ]
        , if List.isEmpty players then
            H.div [] [ H.text "There are none so far!" ]
          else
            H.table []
                (H.tr []
                    [ H.th [] [ H.text "Player" ]
                    , H.th [] [ H.text "HP" ]
                    , H.th [] [ H.text "Level" ]
                    , H.th [] []
                    ]
                    :: List.map viewOtherPlayerAnonymous players
                )
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
                    onClickRequest (Attack otherPlayer.name)
                  else
                    HA.disabled True
                ]
                [ H.text "Attack!" ]
            ]
        ]


viewOtherPlayerAnonymous : ClientOtherPlayer -> Html Msg
viewOtherPlayerAnonymous { name, hp, xp } =
    H.tr []
        [ H.td [] [ H.text name ]
        , H.td [] [ H.text (String.fromInt hp) ]
        , H.td [] [ H.text (String.fromInt (Shared.Level.levelForXp xp)) ]
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
