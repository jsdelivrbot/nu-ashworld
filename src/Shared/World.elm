module Shared.World
    exposing
        ( AnonymousClientWorld
        , ClientWorld
        , ServerWorld
        , anonymousDecoder
        , clientToAnonymous
        , decoder
        , encode
        , encodeAnonymous
        , encodeMaybe
        , encodeServer
        , serverDecoder
        , serverToAnonymous
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


type alias AnonymousClientWorld =
    { players : List ClientOtherPlayer
    }


clientToAnonymous : ClientWorld -> AnonymousClientWorld
clientToAnonymous { player, otherPlayers } =
    { players = Shared.Player.toOther player :: otherPlayers
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


serverToAnonymous : ServerWorld -> AnonymousClientWorld
serverToAnonymous world =
    { players =
        world.players
            |> Dict.values
            |> List.map Shared.Player.serverToClientOther
    }


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


encodeAnonymous : AnonymousClientWorld -> JE.Value
encodeAnonymous world =
    JE.object
        [ ( "players"
          , JE.list
                Shared.Player.encodeOtherPlayer
                world.players
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


anonymousDecoder : Decoder AnonymousClientWorld
anonymousDecoder =
    JD.map AnonymousClientWorld
        (JD.field "players" (JD.list Shared.Player.otherPlayerDecoder))


encodeServer : ServerWorld -> JE.Value
encodeServer world =
    JE.object
        [ ( "players"
          , EJ.encodeDict
                identity
                Shared.Player.encodeServer
                world.players
          )
        ]


serverDecoder : Decoder ServerWorld
serverDecoder =
    JD.map ServerWorld
        (JD.field "players"
            (EJ.dictFromObject
                Shared.Player.serverDecoder
            )
        )
