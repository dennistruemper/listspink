module Pages.List.Listpink_.Item.Create exposing (Model, Msg, page)

import Api
import Api.Item
import Auth exposing (User)
import Browser.Navigation as Navigation
import Components.ActionBarWrapper exposing (viewActionBarWrapper)
import Components.Button
import Components.Dropdown exposing (viewDropdown)
import Components.TextInput exposing (viewTextAreaInput, viewTextInput)
import Domain.ItemPink exposing (ItemPink)
import Effect exposing (Effect)
import Html
import Http
import Http.Detailed
import Layouts
import Page exposing (Page)
import Priority
import Route exposing (Route)
import Route.Path
import Shared
import ValidationResult exposing (ValidationResult(..), viewValidationResult)
import View exposing (View)


page : Auth.User -> Shared.Model -> Route { listpink : String } -> Page Model Msg
page user shared route =
    Page.new
        { init = init user route.params.listpink shared
        , update = update user
        , subscriptions = subscriptions
        , view = view
        }
        |> Page.withLayout (toLayout route.path)


{-| Use the sidebar layout on this page
-}
toLayout : Route.Path.Path -> Model -> Layouts.Layout Msg
toLayout path model =
    Layouts.Scaffold
        { title = getTitle, path = path }


getTitle : String
getTitle =
    "Create Item"



-- INIT


type alias Model =
    { nameInput : String
    , descriptionInput : String
    , validationError : ValidationResult
    , createResponse : Api.Data ItemPink
    , listId : String
    , baseUrl : String
    , priority : Int
    }


init : User -> String -> Shared.Model -> () -> ( Model, Effect Msg )
init user listId shared () =
    ( { nameInput = ""
      , descriptionInput = ""
      , validationError = VNothing
      , createResponse = Api.NotAsked
      , listId = listId
      , baseUrl = shared.baseUrl
      , priority = 0
      }
    , Effect.none
    )



-- UPDATE


type Msg
    = NameChanged String
    | PriorityChanged String
    | DescriptionChanged String
    | CreateClicked
    | CreateItemResponseReceived (Result (Http.Detailed.Error String) ( Http.Metadata, ItemPink ))
    | BackClicked


update : Auth.User -> Msg -> Model -> ( Model, Effect Msg )
update user msg model =
    case msg of
        NameChanged name ->
            ( { model | nameInput = name } |> validateForm
            , Effect.none
            )

        PriorityChanged priority ->
            ( { model | priority = Priority.priorityFromString priority }, Effect.none )

        DescriptionChanged description ->
            ( { model | descriptionInput = description } |> validateForm
            , Effect.none
            )

        CreateClicked ->
            let
                validatedModel =
                    validateForm model
            in
            if validatedModel.validationError == VNothing then
                ( { validatedModel
                    | createResponse = Api.Loading
                  }
                , Api.Item.createItem
                    { baseUrl = validatedModel.baseUrl
                    , token = user.authToken
                    , body =
                        { name = validatedModel.nameInput
                        , listId = validatedModel.listId
                        , priority = model.priority
                        , description =
                            case validatedModel.descriptionInput of
                                "" ->
                                    Nothing

                                _ ->
                                    Just validatedModel.descriptionInput
                        }
                    , onResponse = CreateItemResponseReceived
                    }
                )

            else
                ( { validatedModel | validationError = VError "Please fill all required fields and try again" }
                , Effect.none
                )

        CreateItemResponseReceived (Ok ( metadata, item )) ->
            ( { model | createResponse = Api.Success item, nameInput = "", descriptionInput = "", priority = 0, validationError = VSuccess ("Item " ++ model.nameInput ++ " created successfully") }
            , Effect.none
            )

        CreateItemResponseReceived (Err error) ->
            ( { model
                | createResponse = Api.FailureWithDetails error
                , validationError = VError ("Item " ++ model.nameInput ++ " not created. Error: " ++ Http.Detailed.toUserString error)
              }
            , Effect.none
            )

        BackClicked ->
            ( model
            , Effect.navigateBack
            )


validateForm : Model -> Model
validateForm model =
    case model.nameInput of
        "" ->
            { model | validationError = VError "Name has to be set", createResponse = Api.NotAsked }

        _ ->
            { model | validationError = VNothing, createResponse = Api.NotAsked }



-- SUBSCRIPTIONS


subscriptions : Model -> Sub Msg
subscriptions model =
    Sub.none



-- VIEW


view : Model -> View Msg
view model =
    let
        createButton =
            Components.Button.button { label = "Create", onClick = CreateClicked }
                |> Components.Button.viewAsStatusButton { requestStatus = model.createResponse }
    in
    { title = getTitle
    , body =
        [ viewActionBarWrapper
            [ Components.Button.button { label = "Back", onClick = BackClicked } |> Components.Button.view
            , createButton
            ]
            [ viewTextInput { name = "Name", value = Just model.nameInput, placeholder = Just "Buy orange juice", action = NameChanged }
            , viewTextAreaInput { name = "Description", value = Just model.descriptionInput, placeholder = Just "What I have to do to buy orage juice", action = DescriptionChanged }
            , viewDropdown
                { id = "priority"
                , name = "Priority"
                , variants = Priority.priorityToSelectedList model.priority
                , valueToString = String.fromInt
                , selectedMsg = PriorityChanged
                }
            , viewValidationResult model.validationError
            ]
        ]
    }
