module Components.Checkbox exposing (viewCheckbox)

import Html exposing (Html, input, label, text)
import Html.Attributes as Attr exposing (checked, class, for, id, type_)
import Html.Events exposing (onClick)


viewCheckbox : String -> Bool -> msg -> Html msg
viewCheckbox id checked msg =
    Html.input
        [ Attr.id "id"
        , Attr.name "id"
        , Attr.type_ "checkbox"
        , class "h-4 w-4 rounded border-pink-500 bg-pink-50 text-pink-500 focus:ring-pink-500"
        , onClick msg
        , Attr.checked checked
        ]
        []
