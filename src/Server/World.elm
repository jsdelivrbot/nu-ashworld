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

import Dict
import Shared.Level
import Shared.Player exposing (ServerPlayer)
import Shared.World exposing (ServerWorld)


-- COMMANDS


setPlayerHp : String -> Int -> ServerWorld -> ServerWorld
setPlayerHp name newHp world =
    world
        |> update name (Maybe.map (\player -> { player | hp = newHp }))


addPlayerXp : String -> Int -> ServerWorld -> ServerWorld
addPlayerXp name gainedXp world =
    world
        |> update name
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


addPlayerMessage : String -> String -> ServerWorld -> ServerWorld
addPlayerMessage name message world =
    addPlayerMessages name [ message ] world


addPlayerMessages : String -> List String -> ServerWorld -> ServerWorld
addPlayerMessages name messages world =
    world
        |> update name (Maybe.map (\player -> { player | messageQueue = player.messageQueue ++ messages }))


emptyPlayerMessageQueue : String -> ServerWorld -> ServerWorld
emptyPlayerMessageQueue name world =
    world
        |> update name (Maybe.map (\player -> { player | messageQueue = [] }))


healEverybody : ServerWorld -> ServerWorld
healEverybody world =
    world
        |> map (\_ player -> { player | hp = min (player.hp + 1) player.maxHp })



-- QUERIES


type DeadStatus
    = PlayerDoesntExist
    | Dead
    | Alive


isDead : String -> ServerWorld -> Bool
isDead name world =
    deadStatus name world == Dead



-- HELPERS


deadStatus : String -> ServerWorld -> DeadStatus
deadStatus name world =
    world.players
        |> Dict.get name
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


update : String -> (Maybe ServerPlayer -> Maybe ServerPlayer) -> ServerWorld -> ServerWorld
update name fn world =
    { world | players = world.players |> Dict.update name fn }


map : (String -> ServerPlayer -> ServerPlayer) -> ServerWorld -> ServerWorld
map fn world =
    { world | players = world.players |> Dict.map fn }
