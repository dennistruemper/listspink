module Components.Button exposing (State(..), button, view, viewAsStatusButton, withEnabled, withState)

import Api
import Components.LoadingSpinner
import Html exposing (Html, button, text)
import Html.Attributes exposing (class)
import Html.Events


type alias ButtonOptions msg =
    { label : String
    , onClick : msg
    , enabled : Bool
    , state : State
    }


type State
    = Success
    | Error
    | Loading
    | Default


type alias ButtonRequiredOptions msg =
    { label : String
    , onClick : msg
    }


type alias ButtonOptionalOptions =
    { enabled : Bool
    , state : State
    }


defaultButtonOptionalOptions : ButtonOptionalOptions
defaultButtonOptionalOptions =
    { enabled = True
    , state = Default
    }


buttonWithOptions : ButtonOptionalOptions -> ButtonRequiredOptions msg -> ButtonOptions msg
buttonWithOptions optionalOptions requiredOptions =
    { label = requiredOptions.label
    , onClick = requiredOptions.onClick
    , enabled = optionalOptions.enabled
    , state = optionalOptions.state
    }


button : ButtonRequiredOptions msg -> ButtonOptions msg
button requiredOptions =
    buttonWithOptions defaultButtonOptionalOptions requiredOptions


withEnabled : Bool -> ButtonOptions msg -> ButtonOptions msg
withEnabled enabled options =
    { options | enabled = enabled }


withState : State -> ButtonOptions msg -> ButtonOptions msg
withState state options =
    { options | state = state }


withOnClick : msg -> ButtonOptions msg -> ButtonOptions msg
withOnClick msg options =
    { options | onClick = msg }


viewAsStatusButton : { requestStatus : Api.Data a } -> ButtonOptions msg -> Html msg
viewAsStatusButton statusOptions options =
    case statusOptions.requestStatus of
        Api.Loading ->
            options
                |> withState Loading
                |> view

        Api.FailureWithDetails _ ->
            options
                |> withState Error
                |> view

        Api.Success _ ->
            options
                |> withState Success
                |> view

        Api.NotAsked ->
            options
                |> withState Default
                |> view


view : ButtonOptions msg -> Html msg
view options =
    let
        color =
            case options.state of
                Default ->
                    " bg-pink-500 hover:bg-pink-400"

                Loading ->
                    " bg-gray-500"

                Success ->
                    " bg-emerald-400"

                Error ->
                    " bg-red-600"

        content =
            if options.state == Loading then
                [ Components.LoadingSpinner.viewLoadingSpinner, text options.label ]

            else
                [ text options.label ]

        disabled =
            if options.state == Loading then
                True

            else
                not options.enabled

        onClickExtension =
            if options.state == Loading then
                []

            else
                [ Html.Events.onClick options.onClick ]
    in
    Html.button
        ([ class ("rounded-lg px-4 py-2 flex items-center " ++ color)
         , Html.Attributes.disabled disabled
         ]
            ++ onClickExtension
        )
        content
