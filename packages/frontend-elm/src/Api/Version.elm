module Api.Version exposing (getVersion)

import Effect exposing (Effect)
import Http
import Http.Detailed
import Json.Decode as Decode exposing (Decoder)


getVersion : { onResponse : Result (Http.Detailed.Error String) ( Http.Metadata, String ) -> msg, baseUrl : String } -> Effect msg
getVersion options =
    Effect.sendCmd <|
        Http.get
            { url = options.baseUrl ++ "version"
            , expect = Http.Detailed.expectJson options.onResponse versionDecoder
            }


versionDecoder : Decoder String
versionDecoder =
    Decode.field "version" Decode.string
