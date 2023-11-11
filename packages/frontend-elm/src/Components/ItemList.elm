module Components.ItemList exposing (viewItemList)

import Components.Card exposing (viewCard)
import Components.Checkbox exposing (viewCheckbox)
import Components.Icons.RightArrow exposing (viewRightArrow)
import Domain.ItemPink exposing (ItemPink)
import Html exposing (Html)
import Html.Attributes as Attr exposing (class)
import Priority
import Route.Path exposing (Path)
import Set


viewItemList : String -> List ItemPink -> (String -> msg) -> Html msg
viewItemList listId items itemToggleMsg =
    let
        itemsDone =
            List.filter (\item -> Domain.ItemPink.isCompleted item) items

        itemsUndone =
            List.filter (\item -> not (Domain.ItemPink.isCompleted item)) items

        priorityClasses =
            List.map .priority itemsUndone |> Set.fromList |> Set.toList |> List.sort |> List.reverse

        priorityClassesCount =
            List.length priorityClasses
    in
    Html.div [ class "bg-pink-50  rounded-lg shadow flex flex-col items-center px-2" ]
        [ Html.div [ class "divide-y divide-pink-200 w-full max-w-2xl" ] (List.map (\prioClass -> viewPrioClassBlock prioClass itemToggleMsg listId itemsUndone) priorityClasses)
        , Html.ul
            [ Attr.attribute "role" "list"
            , class "w-full max-w-2xl divide-y divide-pink-200"
            ]
            [ viewDetailWrapper
                "Completed"
                ((itemsUndone |> List.length) == 0 && (itemsDone |> List.length) > 0)
                (Html.div []
                    (List.map
                        (\item -> viewItem itemToggleMsg listId item)
                        itemsDone
                    )
                )
            ]
        ]


viewDetailWrapper : String -> Bool -> Html msg -> Html msg
viewDetailWrapper summary isOpen details =
    let
        openAttr =
            if isOpen then
                [ Attr.attribute "open" "", class "z-40" ]

            else
                [ class "z-40" ]
    in
    Html.details openAttr
        ([ Html.summary [ class "bg-pink-100 text-center sticky top-0 rounded-full" ]
            [ Html.div [ class " flex-auto truncate text-sm font-semibold leading-6 text-gray-900" ] [ Html.text summary ] ]
         ]
            ++ [ details ]
        )


viewPrioClassBlock : Int -> (String -> msg) -> String -> List ItemPink -> Html msg
viewPrioClassBlock prioClass itemToggleMsg listId items =
    let
        prioClassItems =
            List.filter (\item -> item.priority == prioClass) items
    in
    Html.div
        []
        [ --priorityClassHeading (Priority.priorityToString prioClass)
          Html.ul
            [ Attr.attribute "role" "list"
            , class "divide-y divide-pink-200"
            ]
            [ viewDetailWrapper (Priority.priorityToString prioClass)
                (prioClass >= 0)
                (Html.div []
                    (List.map
                        (\item -> viewItem itemToggleMsg listId item)
                        prioClassItems
                    )
                )
            ]
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

        lineThrough =
            if isCompleted then
                " line-through"

            else
                ""
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
                [ class ("flex-auto truncate text-sm font-semibold leading-6 text-gray-900" ++ lineThrough)
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
        , Html.div [ class "text-sm font-light mt-2 flex flex-row justify-between" ]
            [ Html.div [] [ Html.text "" ] -- TODO: Add created date
            , Html.div []
                [ Html.text
                    (case item.completed of
                        Nothing ->
                            ""

                        Just completed ->
                            "Completed: " ++ String.left 10 completed
                    )
                ]
            ]
        ]
