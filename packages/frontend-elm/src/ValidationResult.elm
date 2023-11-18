module ValidationResult exposing (ValidationResult(..), viewValidationResult)

import Html
import Html.Attributes exposing (class)


type ValidationResult
    = VNothing
    | VSuccess String
    | VError String


viewValidationResult : ValidationResult -> Html.Html msg
viewValidationResult validationResult =
    case validationResult of
        VNothing ->
            Html.text ""

        VSuccess message ->
            Html.div [ class "text-emerald-400" ] [ Html.text message ]

        VError message ->
            Html.div [ class "text-red-500" ] [ Html.text message ]
