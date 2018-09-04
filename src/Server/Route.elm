module Server.Route exposing (Route(..), fromString, toString)

import Url
import Url.Builder
import Url.Parser exposing ((</>), Parser)


type Route
    = NotFound
    | Signup
    | Login Int


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

        Login userId ->
            Url.Builder.absolute [ "login", String.fromInt userId ] []


parser : Parser (Route -> a) a
parser =
    Url.Parser.oneOf
        [ Url.Parser.map Signup signup
        , Url.Parser.map Login login
        ]


signup : Parser a a
signup =
    Url.Parser.s "signup"


login : Parser (Int -> a) a
login =
    Url.Parser.s "login" </> Url.Parser.int
