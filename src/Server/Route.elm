module Server.Route exposing (Route(..), fromString, toString)

import Url
import Url.Builder
import Url.Parser exposing ((</>), Parser)


type Route
    = NotFound
    | Signup


fromString : String -> Route
fromString string =
    case Url.fromString string of
        Nothing ->
            NotFound

        Just url ->
            Url.Parser.parse parser url
                |> Maybe.withDefault NotFound


toString : Route -> String
toString route =
    case route of
        NotFound ->
            Url.Builder.absolute [ "404" ] []

        Signup ->
            Url.Builder.absolute [ "signup" ] []


parser : Parser (Route -> a) a
parser =
    Url.Parser.oneOf
        [ Url.Parser.map Signup signup
        ]


signup : Parser a a
signup =
    Url.Parser.s "signup"
