module Server.World
    exposing
        ( addPlayerMessage
        , addPlayerMessages
        , addPlayerXp
        , emptyPlayerMessageQueue
        , healEverybody
        , isDead
        , setPlayerHp
        )

import Dict.Any as Dict
import Shared.Level
import Shared.Player exposing (PlayerId, ServerPlayer)
import Shared.World exposing (ServerWorld)


-- COMMANDS


setPlayerHp : PlayerId -> Int -> ServerWorld -> ServerWorld
setPlayerHp playerId newHp world =
    world
        |> update playerId (Maybe.map (\player -> { player | hp = newHp }))


addPlayerXp : PlayerId -> Int -> ServerWorld -> ServerWorld
addPlayerXp playerId gainedXp world =
    world
        |> update playerId
            (Maybe.map
                (\player ->
                    let
                        newXp =
                            player.xp + gainedXp

                        oldLevel =
                            Shared.Level.levelForXp player.xp

                        newLevel =
                            Shared.Level.levelForXp newXp

                        levelUpMessages =
                            List.range (oldLevel + 1) newLevel
                                |> List.map levelUpMessage

                        newMessages =
                            gainedXpMessage gainedXp :: levelUpMessages

                        newMessageQueue =
                            player.messageQueue ++ newMessages
                    in
                    { player
                        | xp = newXp
                        , messageQueue = newMessageQueue
                    }
                )
            )


addPlayerMessage : PlayerId -> String -> ServerWorld -> ServerWorld
addPlayerMessage playerId message world =
    addPlayerMessages playerId [ message ] world


addPlayerMessages : PlayerId -> List String -> ServerWorld -> ServerWorld
addPlayerMessages playerId messages world =
    world
        |> update playerId (Maybe.map (\player -> { player | messageQueue = player.messageQueue ++ messages }))


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


gainedXpMessage : Int -> String
gainedXpMessage gainedXp =
    "You gained "
        ++ String.fromInt gainedXp
        ++ " XP!"


levelUpMessage : Int -> String
levelUpMessage level =
    "You gained a level! You're now level "
        ++ String.fromInt level
        ++ "!"


update : PlayerId -> (Maybe ServerPlayer -> Maybe ServerPlayer) -> ServerWorld -> ServerWorld
update playerId fn world =
    { world | players = world.players |> Dict.update playerId fn }


map : (PlayerId -> ServerPlayer -> ServerPlayer) -> ServerWorld -> ServerWorld
map fn world =
    { world | players = world.players |> Dict.map fn }
