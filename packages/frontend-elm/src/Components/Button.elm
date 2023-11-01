module Components.Button exposing (viewButton)

import Html exposing (Html, button, text)
import Html.Attributes exposing (class)
import Html.Events exposing (onClick)


viewButton : String -> msg -> Html msg
viewButton label msg =
    button
        [ class "bg-pink-500 rounded-lg px-4 py-2 hover:bg-pink-400"
        , onClick msg
        ]
        [ text label
        ]
