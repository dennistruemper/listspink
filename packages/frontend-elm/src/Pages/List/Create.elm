module Pages.List.Create exposing (Model, Msg, page)

import Api.List
import Auth
import Components.ActionBarWrapper exposing (viewActionBarWrapper)
import Components.Button exposing (viewButton)
import Components.TextInput exposing (viewTextAreaInput, viewTextInput)
import Domain.ListPink exposing (ListPink)
import Effect exposing (Effect)
import Html
import Html.Attributes as Attr exposing (class)
import Html.Events as Events
import Http
import Layouts
import Page exposing (Page)
import Route exposing (Route)
import Shared
import ValidationResult exposing (ValidationResult(..), viewValidationResult)
import View exposing (View)


page : Auth.User -> Shared.Model -> Route () -> Page Model Msg
page user shared route =
    Page.new
        { init = init user shared
        , update = update
        , subscriptions = subscriptions
        , view = view
        }
        |> Page.withLayout toLayout


toLayout : Model -> Layouts.Layout Msg
toLayout model =
    Layouts.Scaffold
        { title = "Create list" }



-- INIT


type alias Model =
    { nameInput : String
    , descriptionInput : String
    , validationError : ValidationResult
    , user : Auth.User
    , baseUrl : String
    }


init : Auth.User -> Shared.Model -> () -> ( Model, Effect Msg )
init user shared () =
    ( { nameInput = ""
      , descriptionInput = ""
      , validationError = VNothing
      , user = user
      , baseUrl = shared.baseUrl
      }
    , Effect.none
    )



-- UPDATE


type Msg
    = NameChanged String
    | DescriptionChanged String
    | CreateClicked
    | CreateListResponseReceived (Result Http.Error ListPink)


update : Msg -> Model -> ( Model, Effect Msg )
update msg model =
    case msg of
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
                , Api.List.createList
                    { baseUrl = validatedModel.baseUrl
                    , token = validatedModel.user.authToken
                    , body =
                        { name = validatedModel.nameInput
                        , description =
                            case validatedModel.descriptionInput of
                                "" ->
                                    Nothing

                                _ ->
                                    Just validatedModel.descriptionInput
                        }
                    , onResponse = CreateListResponseReceived
                    }
                )

            else
                ( { validatedModel | validationError = VError "Please fill all required fields and try again" }
                , Effect.none
                )

        CreateListResponseReceived result ->
            case result of
                Ok list ->
                    ( { model | nameInput = "", descriptionInput = "", validationError = VSuccess ("List " ++ model.nameInput ++ " created successfully") }
                    , Effect.none
                    )

                Err error ->
                    ( model
                    , Effect.none
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
    { title = "Create list"
    , body =
        [ viewActionBarWrapper
            [ viewButton "Create" CreateClicked
            ]
            [ viewTextInput { name = "Name", value = Just model.nameInput, placeholder = Just "Buy orange juice", action = NameChanged }
            , viewTextAreaInput { name = "Description", value = Just model.descriptionInput, placeholder = Just "What I have to do to buy orage juice", action = DescriptionChanged }
            , viewValidationResult model.validationError
            ]
        ]
    }
