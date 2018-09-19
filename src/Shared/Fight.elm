module Shared.Fight
    exposing
        ( AttackResult(..)
        , Entity(..)
        , Event(..)
        , Fight
        , FightResult(..)
        , decoder
        , encode
        , encodeMaybe
        , eventToString
        , maybeDecoder
        , switchPerspective
        )

import Json.Decode as JD exposing (Decoder)
import Json.Encode as JE


type alias Fight =
    { log : List Event
    , result : FightResult
    , xpGained : Int
    , finalHp : Hp
    }


type Entity
    = You
    | Them


type alias Hp =
    Int


type AttackResult
    = Miss
    | Hit Hp


type Event
    = TurnStarted Entity
    | Attack
        { attacker : Entity
        , result : AttackResult
        }
    | Die Entity


type FightResult
    = YouWon
    | YouLost


resultDecoder : Decoder FightResult
resultDecoder =
    JD.string
        |> JD.andThen
            (\string ->
                case string of
                    "you-won" ->
                        JD.succeed YouWon

                    "you-lost" ->
                        JD.succeed YouLost

                    _ ->
                        JD.fail "Unknown FightResult value"
            )


decoder : Decoder Fight
decoder =
    JD.map4 Fight
        (JD.field "log" (JD.list eventDecoder))
        (JD.field "result" resultDecoder)
        (JD.field "xp-gained" JD.int)
        (JD.field "final-hp" JD.int)


eventDecoder : Decoder Event
eventDecoder =
    JD.field "event-type" JD.string
        |> JD.andThen
            (\string ->
                case string of
                    "turn-started" ->
                        JD.map TurnStarted
                            (JD.field "entity" entityDecoder)

                    "attack" ->
                        JD.map2 (\attacker result -> Attack { attacker = attacker, result = result })
                            (JD.field "attacker" entityDecoder)
                            (JD.field "result" attackResultDecoder)

                    "die" ->
                        JD.map Die
                            (JD.field "entity" entityDecoder)

                    _ ->
                        JD.fail "Unknown Event"
            )


entityDecoder : Decoder Entity
entityDecoder =
    JD.string
        |> JD.andThen
            (\string ->
                case string of
                    "you" ->
                        JD.succeed You

                    "them" ->
                        JD.succeed Them

                    _ ->
                        JD.fail "Unknown Entity"
            )


attackResultDecoder : Decoder AttackResult
attackResultDecoder =
    JD.nullable JD.int
        |> JD.map (Maybe.map Hit >> Maybe.withDefault Miss)


encodeResult : FightResult -> JE.Value
encodeResult result =
    JE.string
        (case result of
            YouWon ->
                "you-won"

            YouLost ->
                "you-lost"
        )


encode : Fight -> JE.Value
encode { log, result, xpGained, finalHp } =
    JE.object
        [ ( "log", JE.list encodeEvent log )
        , ( "result", encodeResult result )
        , ( "xp-gained", JE.int xpGained )
        , ( "final-hp", JE.int finalHp )
        ]


encodeAttackResult : AttackResult -> JE.Value
encodeAttackResult result =
    case result of
        Hit hp ->
            JE.int hp

        Miss ->
            JE.null


encodeEntity : Entity -> JE.Value
encodeEntity entity =
    JE.string <|
        case entity of
            You ->
                "you"

            Them ->
                "them"


encodeEvent : Event -> JE.Value
encodeEvent event =
    case event of
        TurnStarted entity ->
            JE.object
                [ ( "event-type", JE.string "turn-started" )
                , ( "entity", encodeEntity entity )
                ]

        Attack { attacker, result } ->
            JE.object
                [ ( "event-type", JE.string "attack" )
                , ( "attacker", encodeEntity attacker )
                , ( "result", encodeAttackResult result )
                ]

        Die entity ->
            JE.object
                [ ( "event-type", JE.string "die" )
                , ( "entity", encodeEntity entity )
                ]


encodeMaybe : Maybe Fight -> JE.Value
encodeMaybe maybeFight =
    maybeFight
        |> Maybe.map encode
        |> Maybe.withDefault JE.null


maybeDecoder : Decoder (Maybe Fight)
maybeDecoder =
    JD.nullable decoder


eventToString : { you : String, them : String } -> Event -> String
eventToString { you, them } event =
    case event of
        TurnStarted You ->
            "You started your turn."

        TurnStarted Them ->
            them ++ " started their turn."

        Attack { attacker, result } ->
            case ( attacker, result ) of
                ( You, Miss ) ->
                    "You attack and miss."

                ( Them, Miss ) ->
                    them ++ " attacks and misses."

                ( You, Hit dmg ) ->
                    "You attack and hit " ++ them ++ " for " ++ String.fromInt dmg ++ " damage."

                ( Them, Hit dmg ) ->
                    them ++ " attacks and hits you for " ++ String.fromInt dmg ++ " damage."

        Die You ->
            "You die."

        Die Them ->
            them ++ " dies."


mapEntity : (Entity -> Entity) -> Event -> Event
mapEntity fn event =
    case event of
        TurnStarted entity ->
            TurnStarted (fn entity)

        Attack data ->
            Attack { data | attacker = fn data.attacker }

        Die entity ->
            Die (fn entity)


switchEntity : Entity -> Entity
switchEntity entity =
    case entity of
        You ->
            Them

        Them ->
            You


switchPerspective : Event -> Event
switchPerspective event =
    mapEntity switchEntity event
