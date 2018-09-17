module Server.Fight exposing (generator)

import Random exposing (Generator)
import Shared.Fight exposing (Fight(..))
import Shared.Special exposing (Special)


generator : Maybe Special -> Maybe Special -> Generator Fight
generator you them =
    let
        gen_ : Special -> Special -> Generator Fight
        gen_ you_ them_ =
            -- TODO this is currently very stupid
            Random.weighted
                ( toFloat (Shared.Special.sum you_), YouWon )
                [ ( toFloat (Shared.Special.sum them_), YouLost ) ]

        fallback : Generator Fight
        fallback =
            Random.uniform
                YouWon
                [ YouLost ]
    in
    Maybe.map2 gen_ you them
        |> Maybe.withDefault fallback
