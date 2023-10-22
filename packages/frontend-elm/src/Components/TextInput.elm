module Components.TextInput exposing (viewTextAreaInput, viewTextInput)

import Html exposing (Html)
import Html.Attributes as Attr exposing (class)
import Html.Events as Envs


viewTextInput : { name : String, value : Maybe String, action : String -> msg, placeholder : Maybe String } -> Html msg
viewTextInput options =
    Html.div
        [ class "my-4 relative"
        ]
        [ Html.label
            [ Attr.for options.name
            , class "absolute -top-2 left-2 inline-block px-1 text-xs font-medium text-pink-900"
            ]
            [ Html.text options.name ]
        , Html.input
            [ Attr.type_ "text"
            , Attr.name options.name
            , Attr.id options.name
            , class "bg-pink-50 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-pink-200 placeholder:text-gray-500 text-pink-900 focus:ring-2 focus:ring-inset focus:ring-pink-300 sm:text-sm sm:leading-6"
            , Attr.placeholder (Maybe.withDefault "" options.placeholder)
            , Attr.value (Maybe.withDefault "" options.value)
            , Envs.onInput options.action
            ]
            []
        ]


viewTextAreaInput : { name : String, value : Maybe String, action : String -> msg, placeholder : Maybe String } -> Html msg
viewTextAreaInput options =
    Html.div [ class "my-4 relative" ]
        [ Html.label
            [ Attr.for options.name
            , class "absolute -top-2 left-2 inline-block px-1 text-xs font-medium text-pink-900"
            ]
            [ Html.text options.name ]
        , Html.div
            [ class "mt-2"
            ]
            [ Html.textarea
                [ Attr.rows 4
                , Attr.name options.name
                , Attr.id options.name
                , class "bg-pink-50 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-pink-200 placeholder:text-gray-500 text-pink-900 focus:ring-2 focus:ring-inset focus:ring-pink-300 sm:text-sm sm:leading-6"
                , Attr.placeholder (Maybe.withDefault "" options.placeholder)
                , Attr.value (Maybe.withDefault "" options.value)
                , Envs.onInput options.action
                ]
                []
            ]
        ]
