module Shared.World
    exposing
        ( ClientWorld
        , ServerWorld
        , decoder
        , encode
        , encodeMaybe
        , encodeServer
        , serverDecoder
        , serverToClient
        )

import Dict exposing (Dict)
import Extra.Json as EJ
import Json.Decode as JD exposing (Decoder)
import Json.Encode as JE
import Shared.Player exposing (ClientOtherPlayer, ClientPlayer, ServerPlayer)


type alias ServerWorld =
    { players : Dict String ServerPlayer
    }


type alias ClientWorld =
    { player : ClientPlayer
    , otherPlayers : List ClientOtherPlayer
    }


serverToClient : String -> ServerWorld -> Maybe ClientWorld
serverToClient playerName serverWorld =
    let
        ( maybePlayer, otherPlayers ) =
            serverWorld.players
                |> Dict.toList
                |> List.partition (\( name, _ ) -> name == playerName)
                |> Tuple.mapFirst List.head
                |> Tuple.mapSecond (List.map (Tuple.second >> Shared.Player.serverToClientOther))
    in
    maybePlayer
        |> Maybe.map
            (\( _, player ) ->
                { player = Shared.Player.serverToClient player
                , otherPlayers = otherPlayers
                }
            )


encode : ClientWorld -> JE.Value
encode world =
    JE.object
        [ ( "player", Shared.Player.encode world.player )
        , ( "otherPlayers"
          , JE.list
                Shared.Player.encodeOtherPlayer
                world.otherPlayers
          )
        ]


encodeMaybe : Maybe ClientWorld -> JE.Value
encodeMaybe maybeWorld =
    maybeWorld
        |> Maybe.map encode
        |> Maybe.withDefault encodeWorldError


encodeWorldError : JE.Value
encodeWorldError =
    JE.object
        [ ( "error", JE.string "Couldn't get the current player" ) ]


decoder : Decoder ClientWorld
decoder =
    JD.map2 ClientWorld
        (JD.field "player" Shared.Player.decoder)
        (JD.field "otherPlayers" (JD.list Shared.Player.otherPlayerDecoder))


encodeServer : ServerWorld -> JE.Value
encodeServer world =
    JE.object
        [ ( "players"
          , encodeDict
                JE.string
                Shared.Player.encodeServer
                world.players
          )
        ]


encodeDict : (comparable -> JE.Value) -> (a -> JE.Value) -> Dict comparable a -> JE.Value
encodeDict encodeKey encodeValue dict =
    let
        encodeTuple : ( comparable, a ) -> JE.Value
        encodeTuple ( key, value ) =
            JE.list identity
                [ encodeKey key
                , encodeValue value
                ]
    in
    JE.list encodeTuple (Dict.toList dict)


serverDecoder : Decoder ServerWorld
serverDecoder =
    JD.map ServerWorld
        (JD.field "players"
            (EJ.dictFromList
                JD.string
                Shared.Player.serverDecoder
            )
        )
