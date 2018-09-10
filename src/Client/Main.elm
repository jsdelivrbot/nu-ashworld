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
        , RefreshResponse
        , SignupResponse
        , toString
        )
import Shared.Fight exposing (Fight, FightResult(..))
import Shared.Level
import Shared.MessageQueue
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
    | GetRefreshResponse (WebData RefreshResponse)
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
      , messages = []
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
            ( model
                |> addMessage "UrlRequested TODO"
            , Cmd.none
            )

        UrlChanged _ ->
            ( model
                |> addMessage "UrlChanged TODO"
            , Cmd.none
            )

        Request Server.Route.NotFound ->
            ( model
            , Cmd.none
            )

        Request (Server.Route.Signup as route) ->
            ( model
                |> setWorldAsLoading
            , sendRequest route
            )

        Request ((Server.Route.Login playerId) as route) ->
            ( model
                |> setWorldAsLoading
            , sendRequest route
            )

        Request ((Server.Route.Attack otherPlayerId) as route) ->
            ( model
                |> setWorldAsLoading
            , sendRequest route
            )

        Request ((Server.Route.Refresh playerId) as route) ->
            ( model
                |> setWorldAsLoading
            , sendRequest route
            )

        GetSignupResponse response ->
            ( model
                |> updateWorld response
                |> updateMessages response
            , Cmd.none
            )

        GetLoginResponse response ->
            ( model
                |> updateWorld response
                |> emptyMessages
                |> updateMessages response
            , Cmd.none
            )

        GetRefreshResponse response ->
            ( model
                |> updateWorld response
                |> updateMessages response
            , Cmd.none
            )

        GetAttackResponse response ->
            ( model
                |> updateWorld response
                |> updateMessages response
                |> addFightMessages response
            , Cmd.none
            )


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


updateWorld : WebData (WithWorld a) -> Model -> Model
updateWorld response model =
    { model | world = response |> RemoteData.map .world }


emptyMessages : Model -> Model
emptyMessages model =
    { model | messages = [] }


updateMessages : WebData (WithMessageQueue a) -> Model -> Model
updateMessages response model =
    response
        |> RemoteData.map (\{ messageQueue } -> { model | messages = model.messages ++ messageQueue })
        |> RemoteData.withDefault model


addFightMessages : WebData (WithFight a) -> Model -> Model
addFightMessages response model =
    case response of
        Success { fight } ->
            fight
                |> Maybe.map (\{ log } -> { model | messages = model.messages ++ log })
                |> Maybe.withDefault model

        _ ->
            model


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
            send (\_ -> NoOp) (JD.fail "Server route not found")

        Server.Route.Signup ->
            send GetSignupResponse Server.Route.signupDecoder

        Server.Route.Login _ ->
            send GetLoginResponse Server.Route.loginDecoder

        Server.Route.Refresh _ ->
            send GetRefreshResponse Server.Route.refreshDecoder

        Server.Route.Attack _ ->
            send GetAttackResponse Server.Route.attackDecoder


subscriptions : Model -> Sub Msg
subscriptions model =
    Sub.none


view : Model -> Browser.Document Msg
view model =
    { title = "NuAshworld"
    , body =
        [ viewButtons model.world
        , viewMessages model.messages
        , viewWorld model.world
        ]
    }


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
            [ if world == NotAsked || RemoteData.isFailure world then
                onClickRequest Server.Route.Signup
              else
                HA.disabled True
            ]
            [ H.text "Signup" ]
        , H.button
            [ onClickRequest (Server.Route.Login (Shared.Player.id 0)) ]
            [ H.text "Login 0" ]
        , H.button
            [ onClickRequest (Server.Route.Login (Shared.Player.id 1)) ]
            [ H.text "Login 1" ]
        , H.button
            [ world
                |> RemoteData.map (\{ player } -> onClickRequest (Server.Route.Refresh player.id))
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
            [ H.th [] [ H.text "ID" ]
            , H.td [] [ H.text (Shared.Player.idToString player.id) ]
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
        [ H.td [] [ H.text (Shared.Player.idToString otherPlayer.id) ]
        , H.td [] [ H.text (String.fromInt otherPlayer.hp) ]
        , H.td [] [ H.text (String.fromInt (Shared.Level.levelForXp otherPlayer.xp)) ]
        , H.td []
            [ H.button
                [ if player.hp > 0 && otherPlayer.hp > 0 then
                    onClickRequest (Server.Route.Attack { you = player.id, them = otherPlayer.id })
                  else
                    HA.disabled True
                ]
                [ H.text "Attack!" ]
            ]
        ]
