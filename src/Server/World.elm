module Server.World exposing (addPlayerXp, setPlayerHp)

import Dict.Any as Dict
import Shared.Player exposing (PlayerId)
import Shared.World exposing (ServerWorld)


setPlayerHp : Int -> PlayerId -> ServerWorld -> ServerWorld
setPlayerHp newHp playerId world =
    { world
        | players =
            world.players
                |> Dict.update playerId (Maybe.map (\player -> { player | hp = newHp }))
    }


addPlayerXp : Int -> PlayerId -> ServerWorld -> ServerWorld
addPlayerXp addedXp playerId world =
    { world
        | players =
            world.players
                |> Dict.update playerId (Maybe.map (\player -> { player | xp = player.xp + addedXp }))
    }
