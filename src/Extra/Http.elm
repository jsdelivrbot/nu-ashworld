module Extra.Http exposing (errorToString)

import Http exposing (Error(..))


errorToString : Error -> String
errorToString error =
    case error of
        BadUrl url ->
            "Bad URL address: " ++ url

        Timeout ->
            "HTTP Request Timeout"

        NetworkError ->
            "Network Error"

        BadStatus _ ->
            "Bad HTTP Status"

        BadPayload jsonError _ ->
            "Bad HTTP Payload: " ++ jsonError
