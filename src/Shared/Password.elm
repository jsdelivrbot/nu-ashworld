module Shared.Password
    exposing
        ( Auth
        , Hashed
        , Password
        , Plaintext
        , Verified
        , checksOut
        , encodeVerified
        , hash
        , hashedPassword
        , password
        , unwrapHashed
        , unwrapPlaintext
        , verifiedDecoder
        , verify
        )

import Bitwise
import Dict exposing (Dict)
import Hex
import Json.Decode as JD exposing (Decoder)
import Json.Encode as JE
import Keccak


{-| Wee phantom types
-}
type Password a
    = Password String


type Plaintext
    = Plaintext


type Hashed
    = Hashed


{-| All verified passwords are hashed already.
(The transition to Verified can only be done from Hashed, not Plaintext)
-}
type Verified
    = Verified


type alias Auth a =
    { name : String
    , password : Password a
    }


type alias HasVerifiedAuth a =
    { a
        | name : String
        , password : Password Verified
    }


password : String -> Password Plaintext
password p =
    Password p


hashedPassword : String -> Password Hashed
hashedPassword p =
    Password p


hash : Password Plaintext -> Password Hashed
hash (Password p) =
    p
        |> stringToList
        |> Keccak.fips202_sha3_512
        |> listToHex
        |> Password


verify : Auth Hashed -> Auth Verified
verify auth =
    { name = auth.name
    , password = verifyPassword auth.password
    }


{-| Don't expose this. Only use this in `verify` in this module.
-}
verifyPassword : Password Hashed -> Password Verified
verifyPassword (Password p) =
    Password p


checksOut : Auth Hashed -> Dict String (HasVerifiedAuth a) -> Bool
checksOut auth players =
    players
        |> Dict.filter
            (\_ player ->
                (String.toLower player.name == String.toLower auth.name)
                    && passwordChecksOut auth.password player.password
            )
        |> Dict.isEmpty
        |> not


passwordChecksOut : Password Hashed -> Password Verified -> Bool
passwordChecksOut (Password attempt) (Password truth) =
    attempt == truth



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


{-| Be VERY careful where you use this. It should only be used in the persistence
layer, ie. saved password hashes from the database are verified already.
-}
verifiedDecoder : Decoder (Password Verified)
verifiedDecoder =
    JD.map Password JD.string


encodeVerified : Password Verified -> JE.Value
encodeVerified (Password p) =
    JE.string p


unwrapPlaintext : Password Plaintext -> String
unwrapPlaintext (Password p) =
    p


unwrapHashed : Password Hashed -> String
unwrapHashed (Password p) =
    p
