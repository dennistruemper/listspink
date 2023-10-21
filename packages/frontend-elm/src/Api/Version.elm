module Api.Version exposing (getVersion)

import Effect exposing (Effect)
import Http
import Json.Decode as Decode exposing (Decoder)


getVersion : { onResponse : Result Http.Error String -> msg, baseUrl : String } -> Effect msg
getVersion options =
    Effect.sendCmd <|
        Http.get
            { url = options.baseUrl ++ "version"
            , expect = Http.expectJson options.onResponse versionDecoder
            }


versionDecoder : Decoder String
versionDecoder =
    Decode.field "version" Decode.string
