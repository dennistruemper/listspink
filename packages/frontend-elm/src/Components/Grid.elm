module Components.Grid exposing (viewGrid)

import Html
import Html.Attributes as Attr exposing (class)


viewGrid : List (Html.Html msg) -> Html.Html msg
viewGrid items =
    Html.ul
        [ Attr.attribute "role" "list"
        , class "m-4 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3"
        ]
        items
