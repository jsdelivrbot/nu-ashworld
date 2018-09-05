module Shared.World
    exposing
        ( ClientWorld
        , ServerWorld
        , decoder
        , encode
        , encodeMaybe
        , serverToClient
        )

import Dict.Any as Dict exposing (AnyDict)
import Json.Decode as JD exposing (Decoder)
import Json.Encode as JE
import Shared.Player exposing (ClientOtherPlayer, ClientPlayer, PlayerId, ServerPlayer)


type alias ServerWorld =
    { players : AnyDict Int PlayerId ServerPlayer
    }


type alias ClientWorld =
    { player : ClientPlayer
    , otherPlayers : List ClientOtherPlayer
    }


serverToClient : PlayerId -> ServerWorld -> Maybe ClientWorld
serverToClient playerId serverWorld =
    let
        ( maybePlayer, otherPlayers ) =
            serverWorld.players
                |> Dict.toList
                |> List.partition (\( id, _ ) -> id == playerId)
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
