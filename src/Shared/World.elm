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


encodeServer : ServerWorld -> JE.Value
encodeServer world =
    JE.object
        [ ( "players"
          , encodeAnyDict
                Shared.Player.encodeId
                Shared.Player.encodeServer
                world.players
          )
        ]


encodeAnyDict : (a -> JE.Value) -> (b -> JE.Value) -> AnyDict comparable a b -> JE.Value
encodeAnyDict encodeKey encodeValue dict =
    let
        encodeTuple : ( a, b ) -> JE.Value
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
            (anyDictDecoder
                Shared.Player.idToInt
                Shared.Player.idDecoder
                Shared.Player.serverDecoder
            )
        )


anyDictDecoder : (a -> comparable) -> Decoder a -> Decoder b -> Decoder (AnyDict comparable a b)
anyDictDecoder toComparable keyDecoder valueDecoder =
    let
        tupleDecoder : Decoder ( a, b )
        tupleDecoder =
            JD.map2 Tuple.pair
                (JD.index 0 keyDecoder)
                (JD.index 1 valueDecoder)
    in
    JD.list tupleDecoder
        |> JD.map (Dict.fromList toComparable)
