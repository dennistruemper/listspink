module Components.ActionBarWrapper exposing (viewActionBarWrapper)

import Html exposing (Html)
import Html.Attributes exposing (class)


viewActionBarWrapper : List (Html.Html msg) -> List (Html.Html msg) -> Html.Html msg
viewActionBarWrapper items content =
    Html.div [ class "" ]
        [ Html.div
            [ class "bg-pink-200 h-16 rounded-t-xl lg:rounded-xl p-2 pb-4 lg:pb-2 lg:mb-4 flex flex-row justify-between justify-items-center fixed lg:relative bottom-0 lg:top-0 left-0  w-full z-50" ]
            (if List.length items > 1 then
                items

             else
                -- if one item, it should be left
                List.map
                    (\item -> Html.div [ class "last:ml-auto" ] [ item ])
                    items
            )
        , Html.div [] content
        , Html.div [ class "h-16 lg:h-0 w-16" ] []
        ]
