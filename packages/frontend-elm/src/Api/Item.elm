module Api.Item exposing (CreateItemPink, ToggleItemPink, createItem, getItemById, getItemsForList, toggleItem, updateItem)

import Domain.ItemPink exposing (ItemPink)
import Effect exposing (Effect)
import Http
import Http.Detailed
import Json.Decode as Decode exposing (Decoder)
import Json.Encode as Encode exposing (Value)


type alias CreateItemPink =
    { name : String
    , description : Maybe String
    , listId : String
    , priority : Int
    }


getItemsForList : { onResponse : Result (Http.Detailed.Error String) ( Http.Metadata, List ItemPink ) -> msg, baseUrl : String, token : String, listId : String } -> Effect msg
getItemsForList options =
    Effect.sendCmd <|
        Http.request
            { method = "GET"
            , headers =
                [ Http.header "Content-Type" "application/json"
                , Http.header "Authorization" ("Bearer " ++ options.token)
                ]
            , url = options.baseUrl ++ "list/" ++ options.listId ++ "/items"
            , body = Http.emptyBody
            , expect = Http.Detailed.expectJson options.onResponse (Decode.list itemDecoder)
            , timeout = Nothing
            , tracker = Nothing
            }


getItemById : { onResponse : Result (Http.Detailed.Error String) ( Http.Metadata, ItemPink ) -> msg, baseUrl : String, token : String, itemId : String } -> Effect msg
getItemById options =
    Effect.sendCmd <|
        Http.request
            { method = "GET"
            , headers =
                [ Http.header "Content-Type" "application/json"
                , Http.header "Authorization" ("Bearer " ++ options.token)
                ]
            , url = options.baseUrl ++ "item/" ++ options.itemId
            , body = Http.emptyBody
            , expect = Http.Detailed.expectJson options.onResponse itemDecoder
            , timeout = Nothing
            , tracker = Nothing
            }


itemDecoder : Decoder ItemPink
itemDecoder =
    Decode.map5 (\id name description completed priority -> { id = id, name = name, description = description, completed = completed, priority = priority })
        (Decode.field "id" Decode.string)
        (Decode.field "name" Decode.string)
        (Decode.maybe (Decode.field "description" Decode.string))
        (Decode.maybe (Decode.field "completed" Decode.string))
        (Decode.maybe (Decode.field "priority" Decode.int)
            |> Decode.andThen
                (\priority ->
                    case priority of
                        Just value ->
                            Decode.succeed value

                        Nothing ->
                            Decode.succeed 0
                )
        )


createItem : { onResponse : Result (Http.Detailed.Error String) ( Http.Metadata, ItemPink ) -> msg, baseUrl : String, token : String, body : CreateItemPink } -> Effect msg
createItem options =
    Effect.sendCmd <|
        Http.request
            { method = "POST"
            , headers =
                [ Http.header "Authorization" ("Bearer " ++ options.token)
                ]
            , url = options.baseUrl ++ "item"
            , body =
                Http.jsonBody
                    (Encode.object
                        ([ ( "name", Encode.string options.body.name )
                         , ( "listId", Encode.string options.body.listId )
                         , ( "priority", Encode.int options.body.priority )
                         ]
                            ++ (case options.body.description of
                                    Just description ->
                                        [ ( "description", Encode.string description ) ]

                                    Nothing ->
                                        []
                               )
                        )
                    )
            , expect = Http.Detailed.expectJson options.onResponse itemDecoder
            , timeout = Nothing
            , tracker = Nothing
            }


type alias ToggleItemPink =
    { itemId : String
    , listId : String
    }


toggleItem : { onResponse : Result (Http.Detailed.Error String) ( Http.Metadata, String ) -> msg, baseUrl : String, token : String, body : ToggleItemPink } -> Effect msg
toggleItem options =
    Effect.sendCmd <|
        Http.request
            { method = "POST"
            , headers =
                [ Http.header "Authorization" ("Bearer " ++ options.token)
                ]
            , url = options.baseUrl ++ "list/" ++ options.body.listId ++ "/item/" ++ options.body.itemId ++ "/toggle"
            , body = Http.emptyBody
            , expect = Http.Detailed.expectString options.onResponse
            , timeout = Nothing
            , tracker = Nothing
            }


type alias UpdateItemBody =
    { listId : String
    , itemId : String
    , name : Maybe String
    , description : Maybe String
    , priority : Int
    }


updateItem : { onResponse : Result (Http.Detailed.Error String) ( Http.Metadata, ItemPink ) -> msg, baseUrl : String, token : String, body : UpdateItemBody } -> Effect msg
updateItem options =
    Effect.sendCmd <|
        Http.request
            { method = "PUT"
            , headers =
                [ Http.header "Authorization" ("Bearer " ++ options.token)
                ]
            , url = options.baseUrl ++ "list/" ++ options.body.listId ++ "/item/" ++ options.body.itemId
            , body =
                Http.jsonBody
                    (Encode.object
                        ([]
                            ++ (case options.body.name of
                                    Just name ->
                                        [ ( "name", Encode.string name ) ]

                                    Nothing ->
                                        []
                               )
                            ++ (case options.body.description of
                                    Just description ->
                                        [ ( "description", Encode.string description ) ]

                                    Nothing ->
                                        []
                               )
                            ++ [ ( "priority", Encode.int options.body.priority ) ]
                        )
                    )
            , expect = Http.Detailed.expectJson options.onResponse itemDecoder
            , timeout = Nothing
            , tracker = Nothing
            }
