module Api exposing (Data(..), httpErrorToHumanReadable)

import Http
import Http.Detailed


type Data value
    = NotAsked
    | Loading
    | Success value
    | Failure Http.Error
    | FailureWithDetails (Http.Detailed.Error String)


httpErrorToHumanReadable : Http.Error -> String
httpErrorToHumanReadable error =
    case error of
        Http.NetworkError ->
            "Network error occurred. Please check your internet connection and try again."

        Http.Timeout ->
            "Request timed out. Please try again later."

        Http.BadStatus statusCode ->
            "Request failed with status code " ++ String.fromInt statusCode ++ "."

        Http.BadBody message ->
            "Request failed with error: " ++ message ++ "."

        Http.BadUrl url ->
            "Request failed with invalid URL: " ++ url ++ "."
