-- vendored from github.com/jzxhuang/http-extras


module Http.Detailed exposing
    ( Error(..)
    , Success
    , expectJson
    , expectJsonRecord
    , expectString
    , expectStringRecord
    , responseToJson
    , responseToJsonRecord
    , responseToString
    , responseToStringRecord
    )

import Http
import Http.Constants
import Json.Decode


type Error body
    = BadUrl String
    | Timeout
    | NetworkError
    | BadStatus Http.Metadata body
    | BadBody Http.Metadata body String


expectString : (Result (Error String) ( Http.Metadata, String ) -> msg) -> Http.Expect msg
expectString toMsg =
    Http.expectStringResponse toMsg responseToString


expectJson : (Result (Error String) ( Http.Metadata, a ) -> msg) -> Json.Decode.Decoder a -> Http.Expect msg
expectJson toMsg decoder =
    Http.expectStringResponse toMsg (responseToJson decoder)


type alias Success body =
    { metadata : Http.Metadata
    , body : body
    }


expectStringRecord : (Result (Error String) (Success String) -> msg) -> Http.Expect msg
expectStringRecord toMsg =
    Http.expectStringResponse toMsg responseToStringRecord


expectJsonRecord : (Result (Error String) (Success a) -> msg) -> Json.Decode.Decoder a -> Http.Expect msg
expectJsonRecord toMsg decoder =
    Http.expectStringResponse toMsg (responseToJsonRecord decoder)



-- Transformers


responseToString : Http.Response String -> Result (Error String) ( Http.Metadata, String )
responseToString responseString =
    resolve
        (\( metadata, body ) -> Ok ( metadata, body ))
        responseString


responseToJson : Json.Decode.Decoder a -> Http.Response String -> Result (Error String) ( Http.Metadata, a )
responseToJson decoder responseString =
    resolve
        (\( metadata, body ) ->
            Result.mapError Json.Decode.errorToString
                (Json.Decode.decodeString (Json.Decode.map (\res -> ( metadata, res )) decoder) body)
        )
        responseString


responseToStringRecord : Http.Response String -> Result (Error String) (Success String)
responseToStringRecord responseString =
    resolve
        (\( metadata, body ) -> Ok (Success metadata body))
        responseString


{-| -}
responseToJsonRecord : Json.Decode.Decoder a -> Http.Response String -> Result (Error String) (Success a)
responseToJsonRecord decoder responseString =
    resolve
        (\( metadata, body ) ->
            Result.mapError Json.Decode.errorToString
                (Json.Decode.decodeString (Json.Decode.map (\res -> Success metadata res) decoder) body)
        )
        responseString



-- Helper for the transformers


resolve : (( Http.Metadata, body ) -> Result String a) -> Http.Response body -> Result (Error body) a
resolve toResult response =
    case response of
        Http.BadUrl_ url ->
            Err (BadUrl url)

        Http.Timeout_ ->
            Err Timeout

        Http.NetworkError_ ->
            Err NetworkError

        Http.BadStatus_ metadata body ->
            Err (BadStatus metadata body)

        Http.GoodStatus_ metadata body ->
            Result.mapError (BadBody metadata body) (toResult ( metadata, body ))
