module Shared.Password
    exposing
        ( Authentication
        , checksOut
        , hash
        )

import Bitwise
import Dict
import Hex
import Keccak
import Shared.World exposing (ServerWorld)


type alias Authentication =
    { name : String
    , hashedPassword : String
    }


hash : String -> String
hash password =
    password
        |> stringToList
        |> Keccak.fips202_sha3_512
        |> listToHex


checksOut : Authentication -> ServerWorld -> Bool
checksOut { name, hashedPassword } world =
    world.players
        |> Dict.filter (\_ player -> player.name == name && player.hashedPassword == hashedPassword)
        |> Dict.isEmpty
        |> not



-- HELPERS


stringToList : String -> List Int
stringToList string =
    string
        |> String.toList
        |> List.map Char.toCode
        |> List.concatMap toByteRange


{-| Splits a number to a list of numbers all in the 0-255 range (a byte).

TODO test.

-}
toByteRange : Int -> List Int
toByteRange n =
    let
        helper m list =
            if m < 256 then
                m :: list
            else
                let
                    lsb =
                        m |> Bitwise.and 255

                    rest =
                        m |> Bitwise.shiftRightBy 8
                in
                helper rest (lsb :: list)
    in
    helper n []


listToHex : List Int -> String
listToHex list =
    list
        |> List.map (Hex.toString >> String.padLeft 2 '0')
        |> String.concat
