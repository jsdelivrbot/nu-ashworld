module Server.World
    exposing
        ( addPlayerXp
        , emptyPlayerMessageQueue
        , setPlayerHp
        )

import Dict.Any as Dict
import Shared.Player exposing (PlayerId, ServerPlayer)
import Shared.World exposing (ServerWorld)


setPlayerHp : Int -> PlayerId -> ServerWorld -> ServerWorld
setPlayerHp newHp playerId world =
    world
        |> update playerId (Maybe.map (\player -> { player | hp = newHp }))


addPlayerXp : Int -> PlayerId -> ServerWorld -> ServerWorld
addPlayerXp addedXp playerId world =
    world
        |> update playerId (Maybe.map (\player -> { player | xp = player.xp + addedXp }))


emptyPlayerMessageQueue : PlayerId -> ServerWorld -> ServerWorld
emptyPlayerMessageQueue playerId world =
    world
        |> update playerId (Maybe.map (\player -> { player | messageQueue = [] }))



-- HELPERS


update : PlayerId -> (Maybe ServerPlayer -> Maybe ServerPlayer) -> ServerWorld -> ServerWorld
update playerId fn world =
    { world | players = world.players |> Dict.update playerId fn }
