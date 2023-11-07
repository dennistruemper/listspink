module Api.List exposing (CreateListPink, createList, getLists)

import Domain.ListPink exposing (ListPink)
import Effect exposing (Effect)
import Http
import Http.Detailed
import Json.Decode as Decode exposing (Decoder)
import Json.Encode as Encode exposing (Value)


type alias CreateListPink =
    { name : String
    , description : Maybe String
    }


getLists : { onResponse : Result (Http.Detailed.Error String) ( Http.Metadata, List ListPink ) -> msg, baseUrl : String, token : String } -> Effect msg
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
            , expect = Http.Detailed.expectJson options.onResponse (Decode.list listDecoder)
            , timeout = Nothing
            , tracker = Nothing
            }


listDecoder : Decoder ListPink
listDecoder =
    Decode.map3 ListPink
        (Decode.field "id" Decode.string)
        (Decode.field "name" Decode.string)
        (Decode.maybe (Decode.field "description" Decode.string))


createList : { onResponse : Result (Http.Detailed.Error String) ( Http.Metadata, ListPink ) -> msg, baseUrl : String, token : String, body : CreateListPink } -> Effect msg
createList options =
    Effect.sendCmd <|
        Http.request
            { method = "POST"
            , headers =
                [ Http.header "Authorization" ("Bearer " ++ options.token)
                ]
            , url = options.baseUrl ++ "list"
            , body =
                Http.jsonBody
                    (Encode.object
                        ([ ( "name", Encode.string options.body.name )
                         , ( "itemIds", Encode.list Encode.string [] )
                         ]
                            ++ (case options.body.description of
                                    Just description ->
                                        [ ( "description", Encode.string description ) ]

                                    Nothing ->
                                        []
                               )
                        )
                    )
            , expect = Http.Detailed.expectJson options.onResponse listDecoder
            , timeout = Nothing
            , tracker = Nothing
            }
