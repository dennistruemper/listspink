module Components.LoadingSpinner exposing (viewLoadingSpinner)

import Html as Html exposing (Html)
import Html.Attributes as Attr exposing (class)
import Svg as Svg exposing (path, svg)
import Svg.Attributes as SvgAttr


viewLoadingSpinner : Html msg
viewLoadingSpinner =
    svg
        [ SvgAttr.class "animate-spin -ml-1 mr-3 h-10 w-10 text-pink-600"
        , SvgAttr.fill "none"
        , SvgAttr.viewBox "0 0 24 24"
        ]
        [ Svg.circle
            [ SvgAttr.class "opacity-25"
            , SvgAttr.cx "12"
            , SvgAttr.cy "12"
            , SvgAttr.r "10"
            , SvgAttr.stroke "currentColor"
            , SvgAttr.strokeWidth "4"
            ]
            []
        , path
            [ SvgAttr.class "opacity-75"
            , SvgAttr.fill "currentColor"
            , SvgAttr.d "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ]
            []
        ]
