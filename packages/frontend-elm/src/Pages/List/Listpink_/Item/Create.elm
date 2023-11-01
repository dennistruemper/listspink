module Pages.List.Listpink_.Item.Create exposing (Model, Msg, page)

import Api.Item
import Auth exposing (User)
import Browser.Navigation as Navigation
import Components.ActionBarWrapper exposing (viewActionBarWrapper)
import Components.Button exposing (viewButton)
import Components.TextInput exposing (viewTextAreaInput, viewTextInput)
import Domain.ItemPink exposing (ItemPink)
import Effect exposing (Effect)
import Html
import Http
import Layouts
import Page exposing (Page)
import Route exposing (Route)
import Shared
import ValidationResult exposing (ValidationResult(..), viewValidationResult)
import View exposing (View)


page : Auth.User -> Shared.Model -> Route { listpink : String } -> Page Model Msg
page user shared route =
    Page.new
        { init = init user route.params.listpink shared
        , update = update
        , subscriptions = subscriptions
        , view = view
        }
        |> Page.withLayout toLayout


toLayout : Model -> Layouts.Layout Msg
toLayout model =
    Layouts.Scaffold
        { title = "Create Item"
        }



-- INIT


type alias Model =
    { nameInput : String
    , descriptionInput : String
    , validationError : ValidationResult
    , listId : String
    , baseUrl : String
    , user : User
    }


init : User -> String -> Shared.Model -> () -> ( Model, Effect Msg )
init user listId shared () =
    ( { nameInput = ""
      , descriptionInput = ""
      , validationError = VNothing
      , listId = listId
      , baseUrl = shared.baseUrl
      , user = user
      }
    , Effect.none
    )



-- UPDATE


type Msg
    = NoOp
    | NameChanged String
    | DescriptionChanged String
    | CreateClicked
    | CreateItemResponseReceived (Result Http.Error ItemPink)
    | BackClicked


update : Msg -> Model -> ( Model, Effect Msg )
update msg model =
    case msg of
        NoOp ->
            ( model
            , Effect.none
            )

        NameChanged name ->
            ( { model | nameInput = name } |> validateForm
            , Effect.none
            )

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
                ( validatedModel
                , Api.Item.createItem
                    { baseUrl = validatedModel.baseUrl
                    , token = validatedModel.user.authToken
                    , body =
                        { name = validatedModel.nameInput
                        , listId = validatedModel.listId
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

        CreateItemResponseReceived (Ok item) ->
            ( { model | nameInput = "", descriptionInput = "", validationError = VSuccess ("Item " ++ model.nameInput ++ " created successfully") }
            , Effect.none
            )

        CreateItemResponseReceived (Err error) ->
            ( model
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
            { model | validationError = VError "Name has to be set" }

        _ ->
            { model | validationError = VNothing }



-- SUBSCRIPTIONS


subscriptions : Model -> Sub Msg
subscriptions model =
    Sub.none



-- VIEW


view : Model -> View Msg
view model =
    { title = "Pages.List.Listpink_.Item.Create"
    , body =
        [ viewActionBarWrapper
            [ viewButton "Back" BackClicked
            , viewButton "Create" CreateClicked
            ]
            [ viewTextInput { name = "Name", value = Just model.nameInput, placeholder = Just "Buy orange juice", action = NameChanged }
            , viewTextAreaInput { name = "Description", value = Just model.descriptionInput, placeholder = Just "What I have to do to buy orage juice", action = DescriptionChanged }
            , viewValidationResult model.validationError
            ]
        ]
    }
