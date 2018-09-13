module Extra.Http exposing (errorToString)

import Http exposing (Error(..))


errorToString : Error -> String
errorToString error =
    case error of
        BadUrl url ->
            "Bad URL: " ++ url

        Timeout ->
            "Request Timeout"

        NetworkError ->
            "Network Error"

        BadStatus _ ->
            "Bad Status"

        BadPayload jsonError _ ->
            "Bad Payload: " ++ jsonError
