module Components.Dropdown exposing (ExactOneSelection(..), viewDropdown)

import Html exposing (Html)
import Html.Attributes as Attr exposing (class)
import Html.Events as Events


type ExactOneSelection a
    = ExactOneSelection (List a) a (List a)


viewDropdown : { id : String, name : String, variants : ExactOneSelection { value : a, text : String }, valueToString : a -> String, selectedMsg : String -> msg } -> Html msg
viewDropdown options =
    Html.div [ class "relative" ]
        [ Html.label
            [ Attr.for options.id
            , class "absolute -top-2 left-2 inline-block px-1 text-xs font-medium text-pink-900"
            ]
            [ Html.text options.name ]
        , Html.select
            [ Attr.id options.id
            , Attr.name options.name
            , Events.onInput options.selectedMsg
            , class "bg-pink-50 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-pink-200 placeholder:text-gray-500 text-pink-900 focus:ring-2 focus:ring-inset focus:ring-pink-300 sm:text-sm sm:leading-6"
            ]
            (case options.variants of
                ExactOneSelection before selected after ->
                    List.map
                        (\variant ->
                            Html.option [ Attr.value (options.valueToString variant.value) ]
                                [ Html.text variant.text ]
                        )
                        before
                        ++ [ Html.option
                                [ Attr.selected True
                                , Attr.value (options.valueToString selected.value)
                                ]
                                [ Html.text selected.text ]
                           ]
                        ++ List.map
                            (\variant ->
                                Html.option [ Attr.value (options.valueToString variant.value) ]
                                    [ Html.text variant.text ]
                            )
                            after
            )
        ]
