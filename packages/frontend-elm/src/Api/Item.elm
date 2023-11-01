module Api.Item exposing (CreateItemPink, ToggleItemPink, createItem, getItemsForList, toggleItem)

import Domain.ItemPink exposing (ItemPink)
import Effect exposing (Effect)
import Http
import Json.Decode as Decode exposing (Decoder)
import Json.Encode as Encode exposing (Value)


type alias CreateItemPink =
    { name : String
    , description : Maybe String
    , listId : String
    }


getItemsForList : { onResponse : Result Http.Error (List ItemPink) -> msg, baseUrl : String, token : String, listId : String } -> Effect msg
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
            , expect = Http.expectJson options.onResponse (Decode.list itemDecoder)
            , timeout = Nothing
            , tracker = Nothing
            }


itemDecoder : Decoder ItemPink
itemDecoder =
    Decode.map4 ItemPink
        (Decode.field "id" Decode.string)
        (Decode.field "name" Decode.string)
        (Decode.maybe (Decode.field "description" Decode.string))
        (Decode.maybe (Decode.field "completed" Decode.string))


createItem : { onResponse : Result Http.Error ItemPink -> msg, baseUrl : String, token : String, body : CreateItemPink } -> Effect msg
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
                         ]
                            ++ (case options.body.description of
                                    Just description ->
                                        [ ( "description", Encode.string description ) ]

                                    Nothing ->
                                        []
                               )
                        )
                    )
            , expect = Http.expectJson options.onResponse itemDecoder
            , timeout = Nothing
            , tracker = Nothing
            }


type alias ToggleItemPink =
    { itemId : String
    , listId : String
    }


toggleItem : { onResponse : Result Http.Error () -> msg, baseUrl : String, token : String, body : ToggleItemPink } -> Effect msg
toggleItem options =
    Effect.sendCmd <|
        Http.request
            { method = "POST"
            , headers =
                [ Http.header "Authorization" ("Bearer " ++ options.token)
                ]
            , url = options.baseUrl ++ "list/" ++ options.body.listId ++ "/item/" ++ options.body.itemId ++ "/toggle"
            , body = Http.emptyBody
            , expect = Http.expectWhatever options.onResponse
            , timeout = Nothing
            , tracker = Nothing
            }