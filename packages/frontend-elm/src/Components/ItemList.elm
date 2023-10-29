module Components.ItemList exposing (viewItemList)

import Components.Card exposing (viewCard)
import Components.Checkbox exposing (viewCheckbox)
import Components.Icons.RightArrow exposing (viewRightArrow)
import Domain.ItemPink exposing (ItemPink)
import Html exposing (Html)
import Html.Attributes as Attr exposing (class)
import Route.Path exposing (Path)


viewItemList : String -> List ItemPink -> (String -> msg) -> Html msg
viewItemList listId items itemToggleMsg =
    Html.div [ class "bg-pink-50  rounded-lg shadow flex justify-center px-2" ]
        [ Html.ul
            [ Attr.attribute "role" "list"
            , class "w-full max-w-2xl divide-y divide-pink-200"
            ]
            (List.map
                (\item -> viewItem itemToggleMsg listId item)
                items
            )
        ]


viewItem : (String -> msg) -> String -> ItemPink -> Html msg
viewItem toggle listId item =
    let
        itemId =
            item.id

        name =
            item.name

        description =
            item.description

        isCompleted =
            Domain.ItemPink.isCompleted item
    in
    Html.li
        [ class "py-4"
        ]
        [ Html.div
            [ class "flex items-center gap-x-3"
            ]
            [ viewCheckbox itemId
                isCompleted
                (toggle itemId)
            , Html.h3
                [ class "flex-auto truncate text-sm font-semibold leading-6 text-gray-900"
                ]
                [ Html.text name ]
            , Html.a [ class "text-pink-500", Attr.href (Route.Path.toString (Route.Path.List_Listpink__Item_ItemId__Details { listpink = listId, itemId = itemId })) ] [ viewRightArrow ]
            ]
        , Html.p
            [ class "mt-3 line-clamp-3 text-sm text-gray-800 font-light"
            ]
            [ case description of
                Nothing ->
                    Html.div [ class "text-gray-600 font-thin" ] [ Html.text "No description" ]

                Just text ->
                    Html.text text
            ]
        ]
