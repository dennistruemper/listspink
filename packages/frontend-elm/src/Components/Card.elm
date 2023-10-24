module Components.Card exposing (viewCard, viewListPinkCard)

import Dict exposing (Dict)
import Domain.ListPink exposing (ListPink)
import Html exposing (Html)
import Html.Attributes as Attr exposing (class)
import Html.Events exposing (onClick)
import Route exposing (Route)
import Route.Path exposing (Path)
import Svg exposing (path, svg)
import Svg.Attributes as SvgAttr


viewCard : List (Html msg) -> Html msg
viewCard content =
    Html.li
        [ class "bg-pink-50 col-span-1 flex flex-col divide-y divide-gray-200 rounded-lg text-center shadow"
        ]
        content


viewListPinkCard : { listPink : ListPink, navigateMsg : { path : Path, query : Dict String String } -> msg } -> Html msg
viewListPinkCard { listPink, navigateMsg } =
    let
        description =
            case
                listPink.description
            of
                Just desc ->
                    desc

                Nothing ->
                    "No description"
    in
    viewCard
        [ Html.div
            [ class "flex flex-1 flex-col p-4 lg:p-8"
            , onClick (navigateMsg { path = Route.Path.List_Listpink__Show { listpink = listPink.id }, query = Dict.fromList [ ( "name", listPink.name ) ] })
            ]
            [ Html.h3
                [ class "lg:mt-6 text-sm font-medium text-lg text-gray-900"
                ]
                [ Html.text listPink.name ]
            , Html.dl
                [ class "mt-1 flex flex-grow flex-col justify-between"
                ]
                [ Html.dt
                    [ class "sr-only"
                    ]
                    [ Html.text "Description" ]
                , Html.dd
                    [ class "text-sm text-gray-700 font-light line-clamp-4"
                    ]
                    [ Html.text description ]
                ]
            ]
        , Html.div []
            [ Html.div
                [ class "-mt-px h-10 lg:h-12 flex divide-x divide-gray-200"
                ]
                [ Html.button
                    [ class "flex flex-1 items-center justify-center w-full hover:bg-pink-100"
                    , onClick (navigateMsg { path = Route.Path.List_Listpink__Details { listpink = listPink.id }, query = Dict.fromList [ ( "name", listPink.name ) ] })
                    ]
                    [ Html.text "Details"
                    ]
                , Html.div
                    [ class "-ml-px flex w-0 flex-1"
                    ]
                    [ Html.button
                        [ class "flex flex-1 items-center justify-center w-full hover:bg-pink-100"
                        , onClick (navigateMsg { path = Route.Path.List_Listpink__Show { listpink = listPink.id }, query = Dict.fromList [ ( "name", listPink.name ) ] })
                        ]
                        [ Html.text "Show"
                        ]
                    ]
                ]
            ]
        ]
