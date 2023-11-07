module Pages.List.Listpink_.Item.ItemId_.Details exposing (Model, Msg, page)

import Api
import Api.Item
import Auth
import Components.ActionBarWrapper exposing (viewActionBarWrapper)
import Components.Button exposing (viewButton)
import Components.LoadingSpinner exposing (viewLoadingSpinner)
import Components.TextInput exposing (viewTextAreaInput, viewTextInput)
import Domain.ItemPink exposing (ItemPink)
import Effect exposing (Effect)
import Html exposing (Html)
import Html.Attributes exposing (class)
import Http
import Http.Detailed
import Layouts
import Page exposing (Page)
import Route exposing (Route)
import Shared
import ValidationResult exposing (ValidationResult(..), viewValidationResult)
import View exposing (View)


page : Auth.User -> Shared.Model -> Route { listpink : String, itemId : String } -> Page Model Msg
page user shared route =
    Page.new
        { init = init shared route user
        , update = update shared user
        , subscriptions = subscriptions
        , view = view
        }
        |> Page.withLayout (toLayout route.params.itemId)


toLayout : String -> Model -> Layouts.Layout Msg
toLayout itemId model =
    let
        itemName =
            case model.loadedItem of
                Api.NotAsked ->
                    itemId

                Api.Loading ->
                    "Loading..."

                Api.Failure _ ->
                    itemId

                Api.FailureWithDetails _ ->
                    itemId

                Api.Success item ->
                    item.name
    in
    Layouts.Scaffold
        { title = "Item Details: " ++ itemName
        }



-- INIT


type alias Model =
    { loadedItem : Api.Data ItemPink
    , nameInput : String
    , descriptionInput : String
    , validationError : ValidationResult
    , listId : String
    , itemId : String
    }


init : Shared.Model -> Route { listpink : String, itemId : String } -> Auth.User -> () -> ( Model, Effect Msg )
init shared route user () =
    ( { loadedItem = Api.Loading
      , nameInput = ""
      , descriptionInput = ""
      , validationError = VNothing
      , listId = route.params.listpink
      , itemId = route.params.itemId
      }
    , Api.Item.getItemById { baseUrl = shared.baseUrl, token = user.authToken, itemId = route.params.itemId, onResponse = GotItem }
    )



-- UPDATE


type Msg
    = BackClicked
    | SaveClicked
    | NameChanged String
    | DescriptionChanged String
    | GotItem (Result Http.Error ItemPink)
    | GotItemUpdated (Result (Http.Detailed.Error String) ( Http.Metadata, ItemPink ))


update : Shared.Model -> Auth.User -> Msg -> Model -> ( Model, Effect Msg )
update shared user msg model =
    case msg of
        BackClicked ->
            ( model
            , Effect.navigateBack
            )

        SaveClicked ->
            ( model
            , Api.Item.updateItem
                { baseUrl = shared.baseUrl
                , token = user.authToken
                , onResponse = GotItemUpdated
                , body =
                    { name =
                        if model.nameInput == "" then
                            Nothing

                        else
                            Just model.nameInput
                    , description =
                        if model.descriptionInput == "" then
                            Nothing

                        else
                            Just model.descriptionInput
                    , listId = model.listId
                    , itemId = model.itemId
                    }
                }
            )

        NameChanged name ->
            ( { model | nameInput = name }, Effect.none )

        DescriptionChanged description ->
            ( { model | descriptionInput = description }, Effect.none )

        GotItem (Ok item) ->
            ( { model | loadedItem = Api.Success item, nameInput = item.name, descriptionInput = Maybe.withDefault "" item.description }, Effect.none )

        GotItem (Err error) ->
            ( { model | loadedItem = Api.Failure error }, Effect.none )

        GotItemUpdated (Ok ( metadata, item )) ->
            ( { model | loadedItem = Api.Success item }, Effect.none )

        GotItemUpdated (Err message) ->
            ( { model | loadedItem = Api.FailureWithDetails message }, Effect.none )



-- SUBSCRIPTIONS


subscriptions : Model -> Sub Msg
subscriptions model =
    Sub.none



-- VIEW


view : Model -> View Msg
view model =
    { title = "Pages.List.Listpink_.Item.ItemId_.Details"
    , body =
        [ viewActionBarWrapper
            [ viewButton "Back" BackClicked
            , viewButton "Save" SaveClicked
            ]
            (case model.loadedItem of
                Api.NotAsked ->
                    []

                Api.Loading ->
                    [ Html.div [ class "flex justify-center mt-16" ] [ viewLoadingSpinner ] ]

                Api.Success item ->
                    viewLoaded model

                Api.Failure error ->
                    [ viewError model (Api.httpErrorToHumanReadable error) ]

                Api.FailureWithDetails message ->
                    [ viewErrorDetails model message ]
            )
        ]
    }


viewLoaded : Model -> List (Html Msg)
viewLoaded model =
    [ viewTextInput { name = "Name", value = Just model.nameInput, placeholder = Just "Buy orange juice", action = NameChanged }
    , viewTextAreaInput { name = "Description", value = Just model.descriptionInput, placeholder = Just "What I have to do to buy orage juice", action = DescriptionChanged }
    , viewValidationResult model.validationError
    ]


viewError : Model -> String -> Html Msg
viewError model error =
    Html.text error


viewErrorDetails : Model -> Http.Detailed.Error String -> Html Msg
viewErrorDetails model error =
    Html.text
        (case error of
            Http.Detailed.BadUrl url ->
                "Bad URL: " ++ url

            Http.Detailed.Timeout ->
                "Timeout"

            Http.Detailed.NetworkError ->
                "Network error"

            Http.Detailed.BadStatus metadata body ->
                "Bad status: " ++ String.fromInt metadata.statusCode ++ " " ++ body

            Http.Detailed.BadBody medadata body other ->
                "Bad body: " ++ body
        )
