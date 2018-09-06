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
    , lastFight : WebData Fight
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
      , messages = [ "Init successful!" ]
      , world = NotAsked
      , lastFight = NotAsked
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
                |> setLastFightAsLoading
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
            , Cmd.none
            )

        GetLoginResponse response ->
            ( model
                |> updateWorld response
            , Cmd.none
            )

        GetRefreshResponse response ->
            ( model
                |> updateWorld response
            , Cmd.none
            )

        GetAttackResponse response ->
            ( model
                |> updateLastFight response
                |> updateWorld response
            , Cmd.none
            )


type alias WithFight a =
    { a | fight : Fight }


type alias WithWorld a =
    { a | world : ClientWorld }


updateWorld : WebData (WithWorld a) -> Model -> Model
updateWorld response model =
    { model | world = response |> RemoteData.map .world }


updateLastFight : WebData (WithFight a) -> Model -> Model
updateLastFight response model =
    { model | lastFight = response |> RemoteData.map .fight }


setWorldAsLoading : Model -> Model
setWorldAsLoading model =
    { model | world = Loading }


setLastFightAsLoading : Model -> Model
setLastFightAsLoading model =
    { model | lastFight = Loading }


addMessage : String -> Model -> Model
addMessage message model =
    { model | messages = message :: model.messages }


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

        Server.Route.Login _ ->
            send
                GetLoginResponse
                (JD.map LoginResponse
                    (JD.field "world" Shared.World.decoder)
                )

        Server.Route.Refresh _ ->
            send
                GetRefreshResponse
                (JD.map RefreshResponse
                    (JD.field "world" Shared.World.decoder)
                )

        Server.Route.Attack _ ->
            send
                GetAttackResponse
                (JD.map2 AttackResponse
                    (JD.field "world" Shared.World.decoder)
                    (JD.field "fight" Shared.Fight.decoder)
                )


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
        , viewLastFight model.lastFight
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


viewLastFight : WebData Fight -> Html Msg
viewLastFight fight =
    case fight of
        NotAsked ->
            H.text ""

        Loading ->
            H.text "Loading"

        Failure err ->
            H.text "Error :("

        Success fight_ ->
            H.div []
                [ H.strong [] [ H.text "Last fight:" ]
                , viewFightLog fight_.log
                , viewFightResult fight_.result
                ]


viewFightLog : List String -> Html Msg
viewFightLog log =
    H.ul [] (List.map viewFightLogEntry log)


viewFightLogEntry : String -> Html Msg
viewFightLogEntry entry =
    H.li [] [ H.text entry ]


viewFightResult : FightResult -> Html Msg
viewFightResult fightResult =
    H.strong []
        [ H.text
            (case fightResult of
                YouWon ->
                    "You won!"

                YouLost ->
                    "You lost!"
            )
        ]


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
        , viewOtherPlayers world.player.id world.otherPlayers
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
            [ H.th [] [ H.text "XP" ]
            , H.td [] [ H.text (String.fromInt player.xp) ]
            ]
        ]


viewOtherPlayers : PlayerId -> List ClientOtherPlayer -> Html Msg
viewOtherPlayers playerId players =
    H.div []
        [ H.strong [] [ H.text "Other players:" ]
        , if List.isEmpty players then
            H.div [] [ H.text "There are none so far!" ]
          else
            H.table []
                (H.tr []
                    [ H.th [] [ H.text "Player" ]
                    , H.th [] [ H.text "HP" ]
                    , H.th [] [ H.text "XP" ]
                    , H.th [] []
                    ]
                    :: List.map (viewOtherPlayer playerId) players
                )
        ]


viewOtherPlayer : PlayerId -> ClientOtherPlayer -> Html Msg
viewOtherPlayer playerId otherPlayer =
    H.tr []
        [ H.td [] [ H.text (Shared.Player.idToString otherPlayer.id) ]
        , H.td [] [ H.text (String.fromInt otherPlayer.hp) ]
        , H.td [] [ H.text (String.fromInt otherPlayer.xp) ]
        , H.td []
            [ H.button
                [ onClickRequest (Server.Route.Attack { you = playerId, them = otherPlayer.id }) ]
                [ H.text "Attack!" ]
            ]
        ]
