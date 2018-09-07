module Server.World
    exposing
        ( addPlayerMessage
        , addPlayerXp
        , emptyPlayerMessageQueue
        , isDead
        , setPlayerHp
        )

import Dict.Any as Dict
import Shared.Player exposing (PlayerId, ServerPlayer)
import Shared.World exposing (ServerWorld)


-- COMMANDS


setPlayerHp : Int -> PlayerId -> ServerWorld -> ServerWorld
setPlayerHp newHp playerId world =
    world
        |> update playerId (Maybe.map (\player -> { player | hp = newHp }))


addPlayerXp : Int -> PlayerId -> ServerWorld -> ServerWorld
addPlayerXp addedXp playerId world =
    world
        |> update playerId (Maybe.map (\player -> { player | xp = player.xp + addedXp }))


addPlayerMessage : String -> PlayerId -> ServerWorld -> ServerWorld
addPlayerMessage message playerId world =
    world
        |> update playerId (Maybe.map (\player -> { player | messageQueue = player.messageQueue ++ [ message ] }))


emptyPlayerMessageQueue : PlayerId -> ServerWorld -> ServerWorld
emptyPlayerMessageQueue playerId world =
    world
        |> update playerId (Maybe.map (\player -> { player | messageQueue = [] }))



-- QUERIES


{-|

  - Nothing == couldn't find the player
  - Just False == not dead
  - Just True == dead

-}
isDead : PlayerId -> ServerWorld -> Maybe Bool
isDead playerId world =
    world.players
        |> Dict.get playerId
        |> Maybe.map (\{ hp } -> hp == 0)



-- HELPERS


update : PlayerId -> (Maybe ServerPlayer -> Maybe ServerPlayer) -> ServerWorld -> ServerWorld
update playerId fn world =
    { world | players = world.players |> Dict.update playerId fn }
