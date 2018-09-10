module Server.World
    exposing
        ( addPlayerMessage
        , addPlayerXp
        , emptyPlayerMessageQueue
        , healEverybody
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


healEverybody : ServerWorld -> ServerWorld
healEverybody world =
    world
        |> map (\_ player -> { player | hp = min (player.hp + 1) player.maxHp })



-- QUERIES


type DeadStatus
    = PlayerDoesntExist
    | Dead
    | Alive


isDead : PlayerId -> ServerWorld -> Bool
isDead playerId world =
    deadStatus playerId world == Dead



-- HELPERS


deadStatus : PlayerId -> ServerWorld -> DeadStatus
deadStatus playerId world =
    world.players
        |> Dict.get playerId
        |> Maybe.map
            (\{ hp } ->
                if hp == 0 then
                    Dead
                else
                    Alive
            )
        |> Maybe.withDefault PlayerDoesntExist


update : PlayerId -> (Maybe ServerPlayer -> Maybe ServerPlayer) -> ServerWorld -> ServerWorld
update playerId fn world =
    { world | players = world.players |> Dict.update playerId fn }


map : (PlayerId -> ServerPlayer -> ServerPlayer) -> ServerWorld -> ServerWorld
map fn world =
    { world | players = world.players |> Dict.map fn }
