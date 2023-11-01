module Components.Icons.RightArrow exposing (viewRightArrow)

import Html as Html exposing (Html)
import Html.Attributes as Attr
import Svg as Svg exposing (path, svg)
import Svg.Attributes as SvgAttr


viewRightArrow : Html msg
viewRightArrow =
    svg
        [ SvgAttr.class "h-5 w-5 flex-none"
        , SvgAttr.viewBox "0 0 20 20"
        , SvgAttr.fill "currentColor"
        , Attr.attribute "aria-hidden" "true"
        ]
        [ path
            [ SvgAttr.fillRule "evenodd"
            , SvgAttr.d "M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
            , SvgAttr.clipRule "evenodd"
            ]
            []
        ]
