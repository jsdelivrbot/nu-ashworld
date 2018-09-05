module Server.Route
    exposing
        ( Route(..)
        , encodeNotFound
        , encodeSignupSuccess
        , fromString
        , toString
        )

import Json.Encode as JE
import Shared.Player exposing (PlayerId)
import Shared.World exposing (ServerWorld)
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


encodeNotFound : String -> JE.Value
encodeNotFound url =
    JE.object
        [ ( "success", JE.bool False )
        , ( "error", JE.string ("Route \"" ++ url ++ "\" not found.") )
        ]


encodeSignupSuccess : PlayerId -> ServerWorld -> JE.Value
encodeSignupSuccess playerId world =
    JE.object
        [ ( "success", JE.bool True )
        , ( "world", Shared.World.encode playerId world )
        ]
