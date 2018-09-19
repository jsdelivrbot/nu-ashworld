module Server.Fight exposing (generator)

import Random exposing (Generator)
import Shared.Fight
    exposing
        ( AttackResult(..)
        , Entity(..)
        , Event(..)
        , Fight
        , FightResult(..)
        )
import Shared.Player exposing (ServerPlayer)
import Shared.Special exposing (Special)


type alias FightEntity =
    { ap : Int
    , apPerTurn : Int
    , special : Special
    , hp : Int
    }


type alias IntermediateFight =
    { you : FightEntity
    , them : FightEntity
    , turn : Entity
    , log : List Event
    }


generator : ServerPlayer -> ServerPlayer -> Generator Fight
generator you them =
    { you =
        { ap = Shared.Special.ap you.special
        , special = you.special
        , hp = you.hp
        , apPerTurn = Shared.Special.ap you.special
        }
    , them =
        { ap = 0
        , special = them.special
        , hp = them.hp
        , apPerTurn = Shared.Special.ap them.special
        }
    , turn = You
    , log = [ TurnStarted You ]
    }
        |> restOfFightGenerator


restOfFightGenerator : IntermediateFight -> Generator Fight
restOfFightGenerator f =
    if f.you.hp <= 0 then
        Random.constant
            { log = f.log ++ [ Die You ]
            , result = YouLost
            }
    else if f.them.hp <= 0 then
        Random.constant
            { log = f.log ++ [ Die Them ]
            , result = YouWon
            }
    else
        eventGenerator f
            |> Random.andThen
                (\event ->
                    f
                        |> update event
                        |> restOfFightGenerator
                )


update : Event -> IntermediateFight -> IntermediateFight
update event ({ you, them } as f) =
    (case event of
        TurnStarted entity ->
            case entity of
                -- TODO refactor all these to be entity-agnostic
                -- `turnStarted f.you f.them` or something
                You ->
                    { f
                        | them = { them | ap = 0 }
                        , you = { you | ap = you.apPerTurn }
                        , turn = You
                    }

                Them ->
                    { f
                        | you = { you | ap = 0 }
                        , them = { them | ap = them.apPerTurn }
                        , turn = Them
                    }

        Attack { attacker, result } ->
            case ( attacker, result ) of
                ( You, Miss ) ->
                    { f | you = { you | ap = you.ap - basicAttackApCost } }

                ( Them, Miss ) ->
                    { f | them = { them | ap = them.ap - basicAttackApCost } }

                ( You, Hit dmg ) ->
                    { f
                        | you = { you | ap = you.ap - basicAttackApCost }
                        , them = { them | hp = them.hp - dmg }
                    }

                ( Them, Hit dmg ) ->
                    { f
                        | them = { them | ap = them.ap - basicAttackApCost }
                        , you = { you | hp = you.hp - dmg }
                    }

        Die entity ->
            -- happens elsewhere
            f
    )
        |> logEvent event


logEvent : Event -> IntermediateFight -> IntermediateFight
logEvent event f =
    { f | log = f.log ++ [ event ] }


{-| TODO make more sophisticated?
-}
basicAttackApCost : Int
basicAttackApCost =
    5


eventGenerator : IntermediateFight -> Generator Event
eventGenerator f =
    case f.turn of
        You ->
            if f.you.ap < basicAttackApCost then
                -- cannot attack, not enough AP
                Random.constant (TurnStarted Them)
            else
                -- can attack
                hitConnectGenerator
                    |> Random.andThen
                        (\connects ->
                            if connects then
                                punchDamageGenerator
                                    |> Random.map Hit
                            else
                                Random.constant Miss
                        )
                    |> Random.map
                        (\attackResult ->
                            Attack
                                { attacker = You
                                , result = attackResult
                                }
                        )

        Them ->
            if f.them.ap < basicAttackApCost then
                -- cannot attack, not enough AP
                Random.constant (TurnStarted You)
            else
                -- can attack
                hitConnectGenerator
                    |> Random.andThen
                        (\connects ->
                            if connects then
                                punchDamageGenerator
                                    |> Random.map Hit
                            else
                                Random.constant Miss
                        )
                    |> Random.map
                        (\attackResult ->
                            Attack
                                { attacker = Them
                                , result = attackResult
                                }
                        )


{-| <http://fallout.wikia.com/wiki/Fallout_combat#Basic_combat_rules>
TODO put more of this stuff into the game and base it
on player's skills and the other player's AC etc.
-}
chanceToHit : Float
chanceToHit =
    0.8


hitConnectGenerator : Generator Bool
hitConnectGenerator =
    Random.weighted ( chanceToHit, True )
        [ ( 1 - chanceToHit, False ) ]


{-| <http://fallout.wikia.com/wiki/Unarmed#Unarmed_skill_attacks>
TODO put more of this stuff into the game
-}
punchDamageGenerator : Generator Int
punchDamageGenerator =
    Random.int 1 3



-- TODO sequence: http://fallout.wikia.com/wiki/Sequence
