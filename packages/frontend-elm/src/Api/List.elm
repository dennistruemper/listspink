module Api.List exposing (ListPink, getLists)

import Effect exposing (Effect)
import Http
import Json.Decode as Decode exposing (Decoder)


type alias ListPink =
    { id : String
    , name : String
    , description : Maybe String
    }


getLists : { onResponse : Result Http.Error (List ListPink) -> msg, baseUrl : String, token : String } -> Effect msg
getLists options =
    Effect.sendCmd <|
        Http.request
            { method = "GET"
            , headers =
                [ Http.header "Content-Type" "application/json"
                , Http.header "Authorization" ("Bearer " ++ options.token)
                ]
            , url = options.baseUrl ++ "list"
            , body = Http.emptyBody
            , expect = Http.expectJson options.onResponse (Decode.list listDecoder)
            , timeout = Nothing
            , tracker = Nothing
            }


listDecoder : Decoder ListPink
listDecoder =
    Decode.map3 ListPink
        (Decode.field "id" Decode.string)
        (Decode.field "name" Decode.string)
        (Decode.maybe (Decode.field "description" Decode.string))
