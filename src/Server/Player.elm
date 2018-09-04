module Server.Player exposing (Player)


type alias Player =
    { hp : Int
    , maxHp : Int
    , xp : Int
    , secret : ()
    }
