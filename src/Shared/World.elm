module Shared.World
    exposing
        ( ClientWorld
        , ServerWorld
        , decoder
        , encode
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


encode : PlayerId -> ServerWorld -> JE.Value
encode playerId world =
    let
        ( playerInList, otherPlayers ) =
            world.players
                |> Dict.toList
                |> List.partition (\( id, _ ) -> id == playerId)
    in
    playerInList
        |> List.head
        |> Maybe.map
            (\( _, player ) ->
                JE.object
                    [ ( "player", Shared.Player.encode playerId player )
                    , ( "otherPlayers"
                      , JE.list
                            (\( pId, p ) -> Shared.Player.encodeOtherPlayer pId p)
                            otherPlayers
                      )
                    ]
            )
        |> Maybe.withDefault
            (JE.object
                [ ( "error", JE.string "Couldn't get logged in player data" ) ]
            )


decoder : Decoder ClientWorld
decoder =
    JD.map2 ClientWorld
        (JD.field "player" Shared.Player.decoder)
        (JD.field "otherPlayers" (JD.list Shared.Player.otherPlayerDecoder))
