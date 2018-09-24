module Client.User
    exposing
        ( Config
        , Form
        , LoggedInUser
        , User(..)
        , dropMessages
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
        , truncateMessages
        , unknownError
        , viewLoggedIn
        , viewLoggedOff
        )

import Html as H exposing (Attribute, Html)
import Html.Attributes as HA
import Html.Events as HE
import RemoteData exposing (RemoteData(..), WebData)
import Server.Route as Route exposing (AuthError, Route(..), SignupError)
import Shared.Level
import Shared.Password exposing (Auth, Hashed, Password, Plaintext)
import Shared.Player exposing (ClientOtherPlayer, ClientPlayer)
import Shared.Special exposing (SpecialAttr(..))
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


type alias Config msg =
    { setName : String -> msg
    , setPassword : String -> msg
    , request : Route -> msg
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
    Anonymous Loading emptyForm


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


viewLoggedOff : Config msg -> WebData AnonymousClientWorld -> Form -> Maybe String -> List (Html msg)
viewLoggedOff config world form maybeMessage =
    [ viewCredentialsForm config form maybeMessage
    , viewAnonymousWorld world
    ]


viewCredentialsForm : Config msg -> Form -> Maybe String -> Html msg
viewCredentialsForm c { name, password } maybeMessage =
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

        button : Route -> String -> Html msg
        button route label =
            H.button
                (if hasUnmetRules then
                    [ HA.disabled True
                    , HA.title (String.join "; " unmetRules)
                    ]
                 else
                    [ onClickRequest c route ]
                )
                [ H.text label ]
    in
    H.div []
        [ H.input
            [ HE.onInput c.setName
            , HA.value name
            , HA.placeholder "Name"
            ]
            []
        , H.input
            [ HE.onInput c.setPassword
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


viewAnonymousWorld : WebData AnonymousClientWorld -> Html msg
viewAnonymousWorld world =
    case world of
        NotAsked ->
            H.text ""

        Loading ->
            H.text "Loading"

        Failure err ->
            H.text "Error :("

        Success world_ ->
            viewPlayers world_


viewLoggedIn : Config msg -> LoggedInUser -> List (Html msg)
viewLoggedIn c user =
    [ viewButtons c user.world
    , viewWorld c user.world
    , viewMessages user.messages
    ]


viewMessages : List String -> Html msg
viewMessages messages =
    H.div []
        [ H.strong [] [ H.text "Messages:" ]
        , H.ul [] (List.map viewMessage messages)
        ]


viewMessage : String -> Html msg
viewMessage message =
    H.li [] [ H.text message ]


viewButtons : Config msg -> WebData ClientWorld -> Html msg
viewButtons c world =
    H.div []
        [ H.button
            [ world
                |> RemoteData.map (\_ -> onClickRequest c Refresh)
                |> RemoteData.withDefault (HA.disabled True)
            ]
            [ H.text "Refresh" ]
        , H.button
            [ onClickRequest c Logout ]
            [ H.text "Logout" ]
        ]


onClickRequest : Config msg -> Route -> Attribute msg
onClickRequest { request } route =
    HE.onClick (request route)


viewWorld : Config msg -> WebData ClientWorld -> Html msg
viewWorld c world =
    case world of
        NotAsked ->
            H.text "You're not logged in!"

        Loading ->
            H.text "Loading"

        Failure err ->
            H.text "Error :("

        Success world_ ->
            H.div []
                [ viewPlayer c world_.player
                , viewOtherPlayers c world_
                ]


viewPlayer : Config msg -> ClientPlayer -> Html msg
viewPlayer c player =
    let
        viewSpecialAttr : SpecialAttr -> Html msg
        viewSpecialAttr attr =
            let
                current : Int
                current =
                    Shared.Special.getter attr player.special
            in
            H.tr []
                [ H.th [] [ H.text (Shared.Special.label attr) ]
                , H.td [] [ H.text (String.fromInt current) ]
                , H.td []
                    (if player.availableSpecial > 0 && current < 10 then
                        [ H.button
                            [ onClickRequest c (IncSpecialAttr attr) ]
                            [ H.text "+" ]
                        ]
                     else
                        []
                    )
                , H.td []
                    [ Shared.Special.hint attr
                        |> Maybe.withDefault ""
                        |> H.text
                    ]
                ]
    in
    H.table []
        [ H.tr []
            [ H.td [] []
            , H.th [] [ H.text "PLAYER STATS" ]
            , H.td [] []
            , H.td [] []
            ]
        , H.tr []
            [ H.th [] [ H.text "Name" ]
            , H.td [] [ H.text player.name ]
            , H.td [] []
            , H.td [] []
            ]
        , H.tr []
            [ H.th [] [ H.text "HP" ]
            , H.td [] [ H.text (String.fromInt player.hp ++ "/" ++ String.fromInt player.maxHp) ]
            , H.td [] []
            , H.td [] []
            ]
        , H.tr []
            [ H.th [] [ H.text "Level" ]
            , H.td [ HA.colspan 2 ]
                [ H.text <|
                    String.fromInt (Shared.Level.levelForXp player.xp)
                        ++ " ("
                        ++ String.fromInt player.xp
                        ++ " XP, "
                        ++ String.fromInt (Shared.Level.xpToNextLevel player.xp)
                        ++ " till the next level)"
                ]
            , H.td [] []
            ]
        , H.tr []
            [ H.th [ HA.colspan 2 ] [ H.text ("SPECIAL (" ++ String.fromInt player.availableSpecial ++ " pts available)") ]
            , H.td [] []
            , H.td [] []
            ]
        , viewSpecialAttr Strength
        , viewSpecialAttr Perception
        , viewSpecialAttr Endurance
        , viewSpecialAttr Charisma
        , viewSpecialAttr Intelligence
        , viewSpecialAttr Agility
        , viewSpecialAttr Luck
        ]


type alias WithPlayers a =
    { a | players : List ClientOtherPlayer }


viewPlayers : WithPlayers a -> Html msg
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
                    :: List.map viewOtherPlayerAnonymous
                        (List.sortWith playerRanking players)
                )
        ]


reverseOrder : Order -> Order
reverseOrder order =
    case order of
        LT ->
            GT

        EQ ->
            EQ

        GT ->
            LT


{-| Sort by XP, descending order
-}
playerRanking : ClientOtherPlayer -> ClientOtherPlayer -> Order
playerRanking a b =
    compare a.xp b.xp
        |> reverseOrder


type alias WithPlayer a =
    { a | player : ClientPlayer }


type alias WithOtherPlayers a =
    { a | otherPlayers : List ClientOtherPlayer }


viewOtherPlayers : Config msg -> WithPlayer (WithOtherPlayers a) -> Html msg
viewOtherPlayers c { player, otherPlayers } =
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
                    :: List.map (viewOtherPlayer c player) otherPlayers
                )
        ]


viewOtherPlayer : Config msg -> ClientPlayer -> ClientOtherPlayer -> Html msg
viewOtherPlayer c player otherPlayer =
    H.tr []
        [ H.td [] [ H.text otherPlayer.name ]
        , H.td [] [ H.text (String.fromInt otherPlayer.hp) ]
        , H.td [] [ H.text (String.fromInt (Shared.Level.levelForXp otherPlayer.xp)) ]
        , H.td []
            [ H.button
                [ if player.hp > 0 && otherPlayer.hp > 0 then
                    onClickRequest c (Attack otherPlayer.name)
                  else
                    HA.disabled True
                ]
                [ H.text "Attack!" ]
            ]
        ]


viewOtherPlayerAnonymous : ClientOtherPlayer -> Html msg
viewOtherPlayerAnonymous { name, hp, xp } =
    H.tr []
        [ H.td [] [ H.text name ]
        , H.td [] [ H.text (String.fromInt hp) ]
        , H.td [] [ H.text (String.fromInt (Shared.Level.levelForXp xp)) ]
        ]


dropMessages : LoggedInUser -> LoggedInUser
dropMessages user =
    { user | messages = [] }


truncateMessages : LoggedInUser -> LoggedInUser
truncateMessages ({ messages } as user) =
    let
        amountToDrop : Int
        amountToDrop =
            (List.length messages - messageLimit)
                |> max 0
    in
    { user | messages = List.drop amountToDrop messages }


messageLimit : Int
messageLimit =
    50
