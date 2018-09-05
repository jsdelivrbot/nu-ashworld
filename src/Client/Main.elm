module Client.Main exposing (main)

import Browser
import Browser.Navigation
import Html as H exposing (Attribute, Html)
import Html.Attributes as HA
import Html.Events as HE
import Http
import Json.Decode as JD exposing (Decoder)
import RemoteData exposing (RemoteData(..), WebData)
import Server.Route exposing (toString)
import Shared.Player exposing (ClientOtherPlayer, ClientPlayer)
import Shared.World
import Url exposing (Url)


serverEndpoint : String
serverEndpoint =
    "http://localhost:3333"


type alias Flags =
    ()


type alias Model =
    { navigationKey : Browser.Navigation.Key
    , messages : List String
    , world : WebData World
    }


type alias World =
    { player : ClientPlayer
    , otherPlayers : List ClientOtherPlayer
    }


type Msg
    = NoOp
    | UrlRequested Browser.UrlRequest
    | UrlChanged Url
    | Request Server.Route.Route
    | GetSignupResponse (WebData World)


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

        Request route ->
            ( model
            , sendRequest route
            )

        GetSignupResponse world ->
            ( model
                |> addMessage "Got Signup response!"
                |> setWorld world
            , Cmd.none
            )


setWorld : WebData World -> Model -> Model
setWorld world model =
    { model | world = world }


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
                (JD.field "world" Shared.World.decoder)


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


viewButtons : WebData World -> Html Msg
viewButtons world =
    H.div []
        [ H.button
            [ if world == NotAsked || RemoteData.isFailure world then
                onClickRequest Server.Route.Signup
              else
                HA.disabled True
            ]
            [ H.text "Signup" ]
        ]


onClickRequest : Server.Route.Route -> Attribute Msg
onClickRequest route =
    HE.onClick (Request route)


viewWorld : WebData World -> Html Msg
viewWorld world =
    case world of
        NotAsked ->
            H.text "You're not logged in!"

        Loading ->
            H.text "Loading"

        Failure err ->
            H.text "Error getting data from server :("

        Success world_ ->
            viewLoadedWorld world_


viewLoadedWorld : World -> Html Msg
viewLoadedWorld world =
    H.div []
        [ viewPlayer world.player
        , viewOtherPlayers world.otherPlayers
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
            , H.td [] [ H.text (String.fromInt (Shared.Player.idToInt player.id)) ]
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


viewOtherPlayers : List ClientOtherPlayer -> Html Msg
viewOtherPlayers players =
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
                    ]
                    :: List.map viewOtherPlayer players
                )
        ]


viewOtherPlayer : ClientOtherPlayer -> Html Msg
viewOtherPlayer player =
    H.tr []
        [ H.td [] [ H.text (String.fromInt (Shared.Player.idToInt player.id)) ]
        , H.td [] [ H.text (String.fromInt player.hp) ]
        , H.td [] [ H.text (String.fromInt player.xp) ]
        ]
