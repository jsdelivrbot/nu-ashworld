module Client.Main exposing (main)

import Browser
import Browser.Navigation
import Html as H exposing (Attribute, Html)
import Html.Attributes as HA
import Html.Events as HE
import Http
import Json.Decode as JD exposing (Decoder)
import RemoteData exposing (RemoteData(..), WebData)
import Server.Route
    exposing
        ( AttackResponse
        , LoginResponse
        , SignupResponse
        , toString
        )
import Shared.Fight exposing (Fight, FightResult(..))
import Shared.Player exposing (ClientOtherPlayer, ClientPlayer, PlayerId)
import Shared.World exposing (ClientWorld)
import Url exposing (Url)


serverEndpoint : String
serverEndpoint =
    "http://localhost:3333"


type alias Flags =
    ()


type alias Model =
    { navigationKey : Browser.Navigation.Key
    , messages : List String
    , world : WebData ClientWorld
    }


type Msg
    = NoOp
    | UrlRequested Browser.UrlRequest
    | UrlChanged Url
    | Request Server.Route.Route
    | GetSignupResponse (WebData SignupResponse)
    | GetLoginResponse (WebData LoginResponse)
    | GetAttackResponse (WebData AttackResponse)


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
      , messages = [ "War. War never changes." ]
      , world = NotAsked
      }
    , Cmd.none
    )


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        NoOp ->
            ( model, Cmd.none )

        UrlRequested _ ->
            ( model |> addMessage "UrlRequested TODO"
            , Cmd.none
            )

        UrlChanged _ ->
            ( model |> addMessage "UrlChanged TODO"
            , Cmd.none
            )

        Request Server.Route.NotFound ->
            ( model
            , Cmd.none
            )

        Request (Server.Route.Signup as route) ->
            ( model |> setWorldAsLoading
            , sendRequest route
            )

        Request ((Server.Route.Login playerId) as route) ->
            ( model |> setWorldAsLoading
            , sendRequest route
            )

        Request ((Server.Route.Attack otherPlayerId) as route) ->
            ( model |> setWorldAsLoading
            , sendRequest route
            )

        GetSignupResponse response ->
            ( model
                |> addMessage
                    (response
                        |> RemoteData.map
                            (\{ world } ->
                                "Welcome! We've given you ID #" ++ Shared.Player.idToString world.player.id
                            )
                        |> RemoteData.withDefault "Couldn't sign up :("
                    )
                |> updateWorld response
            , Cmd.none
            )

        GetLoginResponse response ->
            ( model
                |> addMessage
                    (response
                        |> RemoteData.map
                            (\{ world } ->
                                "Welcome back, player #" ++ Shared.Player.idToString world.player.id ++ "!"
                            )
                        |> RemoteData.withDefault "Couldn't log in :("
                    )
                |> updateWorld response
            , Cmd.none
            )

        GetAttackResponse response ->
            ( model
                |> addMessages
                    (response
                        |> RemoteData.map
                            (\{ fight } ->
                                fight.log
                                    ++ [ if fight.result == YouWon then
                                            "You won!"
                                         else
                                            "You lost..."
                                       ]
                            )
                        |> RemoteData.withDefault [ "Something wrong happened when trying to fight :(" ]
                    )
                |> updateWorld response
            , Cmd.none
            )


type alias WithFight a =
    { a | fight : Fight }


type alias WithWorld a =
    { a | world : ClientWorld }


type alias WithWebDataWorld a =
    { a | world : WebData ClientWorld }


type alias WithMessages a =
    { a | messages : List String }


updateWorld : WebData (WithWorld a) -> Model -> Model
updateWorld response model =
    { model | world = response |> RemoteData.map .world }


setWorldAsLoading : Model -> Model
setWorldAsLoading model =
    { model | world = Loading }


addMessage : String -> Model -> Model
addMessage message model =
    addMessages [ message ] model


addMessages : List String -> Model -> Model
addMessages messages model =
    { model | messages = model.messages ++ messages }


sendRequest : Server.Route.Route -> Cmd Msg
sendRequest route =
    let
        send : (WebData a -> Msg) -> Decoder a -> Cmd Msg
        send tagger decoder =
            Http.get (serverEndpoint ++ Server.Route.toString route) decoder
                |> RemoteData.sendRequest
                |> Cmd.map tagger
    in
    case route of
        Server.Route.NotFound ->
            send
                (always NoOp)
                (JD.succeed ())

        Server.Route.Signup ->
            send
                GetSignupResponse
                (JD.map SignupResponse
                    (JD.field "world" Shared.World.decoder)
                )

        Server.Route.Login playerId ->
            send
                GetLoginResponse
                (JD.map LoginResponse
                    (JD.field "world" Shared.World.decoder)
                )

        Server.Route.Attack playerId ->
            send
                GetAttackResponse
                (JD.map2 AttackResponse
                    (JD.field "world" Shared.World.decoder)
                    (JD.field "fight" Shared.Fight.decoder)
                )


subscriptions : Model -> Sub Msg
subscriptions model =
    Sub.none



-- VIEW


view : Model -> Browser.Document Msg
view model =
    { title = "NuAshworld"
    , body = [ viewMain model ]
    }


viewMain : Model -> Html Msg
viewMain model =
    H.div
        []
        [ viewSidebar model
        , viewPage model
        ]


viewSidebar : Model -> Html Msg
viewSidebar model =
    div_ "sidebar"
        [ div_ "sidebar-inner"
            [ viewSidebarHeader
            , viewSidebarMenu model
            ]
        ]


viewSidebarHeader : Html Msg
viewSidebarHeader =
    div_ "sidebar-logo"
        [ div_ "peers ai-c fxw-nw"
            [ H.div
                [ HA.class "peer peer-greed ai-c d-f"
                , HA.style "height" "64px"
                ]
                [ H.a
                    [ HA.class "sidebar-link td-n"
                    , HA.href "/"
                    ]
                    [ div_ "peers ai-c fxw-nw"
                        [ div_ "peer peer-greed"
                            [ H.h5 [ HA.class "lh-1 mB-0 ta-c logo-text fallout-title" ]
                                [ H.text "NuAshworld" ]
                            ]
                        ]
                    ]
                ]
            , div_ "peer"
                [ div_ "mobile-toggle sidebar-toggle"
                    [ H.a [ HA.class "td-n", HA.href "" ]
                        [ H.i [ HA.class "ti-arrow-circle-left" ] [] ]
                    ]
                ]
            ]
        ]


viewSidebarMenu : Model -> Html Msg
viewSidebarMenu model =
    H.ul
        [ HA.class "sidebar-menu scrollable pos-r" ]
        [ H.li [ HA.class "nav-item mT-30 active" ]
            [ H.a [ HA.class "sidebar-link", HA.href "/" ]
                [ H.span [ HA.class "icon-holder" ]
                    [ H.i [ HA.class "c-blue-500 ti-home" ] []
                    ]
                , H.span [ HA.class "title fallout" ] [ H.text "Link 1" ]
                ]
            ]
        , H.li [ HA.class "nav-item" ]
            [ H.a [ HA.class "sidebar-link", HA.href "email.html" ]
                [ H.span [ HA.class "icon-holder" ]
                    [ H.i [ HA.class "c-brown-500 ti-email" ] []
                    ]
                , H.span [ HA.class "title fallout" ] [ H.text "Link 2" ]
                ]
            ]
        ]


viewPage : Model -> Html Msg
viewPage model =
    div_ "page-container"
        [ H.text "TODO page-container"
        ]



{-
   , viewHeader model
   , viewContent model
   , viewBottomBar model
-}
-- MAIN PARTS


viewHeader : WithWebDataWorld a -> Html Msg
viewHeader model =
    H.div
        []
        [ viewTitle
        , viewActionButtons model
        ]


viewContent : WithWebDataWorld a -> Html Msg
viewContent model =
    H.div
        []
        [ viewPlayer model
        , viewOtherPlayers model
        ]


viewBottomBar : WithMessages a -> Html Msg
viewBottomBar model =
    H.div
        []
        [ viewMessages model
        ]



-- COMPONENTS


viewTitle : Html Msg
viewTitle =
    H.span [] [ H.text "NuAshworld" ]


viewActionButtons : WithWebDataWorld a -> Html Msg
viewActionButtons { world } =
    let
        isLoggedIn : Bool
        isLoggedIn =
            world == NotAsked || RemoteData.isFailure world

        signupBtnMsg : Maybe Msg
        signupBtnMsg =
            if isLoggedIn then
                Just (Request Server.Route.Signup)
            else
                Nothing

        button : String -> Maybe Msg -> Html Msg
        button label msg =
            H.button
                (msg
                    |> Maybe.map (HE.onClick >> List.singleton)
                    |> Maybe.withDefault [ HA.disabled True ]
                )
                [ H.text label ]
    in
    H.div
        []
        [ button "Signup" signupBtnMsg
        , button "Login 0" (Just (Request (Server.Route.Login (Shared.Player.id 0))))
        , button "Login 1" (Just (Request (Server.Route.Login (Shared.Player.id 1))))
        ]


viewPlayer : WithWebDataWorld a -> Html Msg
viewPlayer { world } =
    world
        |> RemoteData.map
            (\{ player } ->
                H.div []
                    [ H.text "Your stats:"
                    , H.ul []
                        [ H.li [] [ H.text <| "ID: " ++ Shared.Player.idToString player.id ]
                        , H.li [] [ H.text <| "HP: " ++ String.fromInt player.hp ++ "/" ++ String.fromInt player.maxHp ]
                        , H.li [] [ H.text <| "XP: " ++ String.fromInt player.xp ]
                        ]
                    ]
            )
        |> RemoteData.withDefault (H.text "")


viewOtherPlayers : WithWebDataWorld a -> Html Msg
viewOtherPlayers { world } =
    world
        |> RemoteData.map
            (\{ player, otherPlayers } ->
                H.div []
                    [ H.text "Other players:"
                    , if List.isEmpty otherPlayers then
                        H.span [] [ H.text "There's nobody else besides you!" ]
                      else
                        H.table []
                            (H.tr []
                                [ H.th [] [ H.text "ID" ]
                                , H.th [] [ H.text "HP" ]
                                , H.th [] []
                                ]
                                :: List.map (viewOtherPlayer player.id) otherPlayers
                            )
                    ]
            )
        |> RemoteData.withDefault (H.text "")


viewOtherPlayer : PlayerId -> ClientOtherPlayer -> Html Msg
viewOtherPlayer playerId otherPlayer =
    H.tr []
        [ H.td [] [ H.text (Shared.Player.idToString otherPlayer.id) ]
        , H.td [] [ H.text (String.fromInt otherPlayer.hp ++ "/???") ]
        , H.td []
            [ H.button
                [ HE.onClick (Request (Server.Route.Attack { you = playerId, them = otherPlayer.id })) ]
                [ H.text "Attack!" ]
            ]
        ]


viewMessages : WithMessages a -> Html Msg
viewMessages { messages } =
    H.div
        []
        (List.map viewMessage messages)


viewMessage : String -> Html Msg
viewMessage message =
    H.div [] [ H.text message ]


div_ : String -> List (Html Msg) -> Html Msg
div_ class children =
    H.div [ HA.class class ] children
