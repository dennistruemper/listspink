module Pages.List.Create exposing (Model, Msg, page)

import Api
import Api.List
import Auth
import Components.ActionBarWrapper exposing (viewActionBarWrapper)
import Components.Button
import Components.TextInput exposing (viewTextAreaInput, viewTextInput)
import Domain.ListPink exposing (ListPink)
import Effect exposing (Effect)
import Html
import Html.Attributes as Attr exposing (class)
import Html.Events as Events
import Http
import Http.Detailed
import Layouts
import Page exposing (Page)
import Route exposing (Route)
import Route.Path
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
        |> Page.withLayout (toLayout route.path)


{-| Use the sidebar layout on this page
-}
toLayout : Route.Path.Path -> Model -> Layouts.Layout Msg
toLayout path model =
    Layouts.Scaffold
        { title = getTitle, path = path }


getTitle : String
getTitle =
    "Create list"



-- INIT


type alias Model =
    { nameInput : String
    , descriptionInput : String
    , validationError : ValidationResult
    , createResponse : Api.Data ListPink
    , user : Auth.User
    , baseUrl : String
    }


init : Auth.User -> Shared.Model -> () -> ( Model, Effect Msg )
init user shared () =
    ( { nameInput = ""
      , descriptionInput = ""
      , validationError = VNothing
      , createResponse = Api.NotAsked
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
    | CreateListResponseReceived (Result (Http.Detailed.Error String) ( Http.Metadata, ListPink ))


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
                ( { validatedModel | createResponse = Api.Loading }
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
                Ok ( metadata, list ) ->
                    ( { model | createResponse = Api.Success list, nameInput = "", descriptionInput = "", validationError = VSuccess ("List " ++ model.nameInput ++ " created successfully") }
                    , Effect.none
                    )

                Err error ->
                    ( { model | createResponse = Api.FailureWithDetails error }
                    , Effect.none
                    )


validateForm : Model -> Model
validateForm model =
    case model.nameInput of
        "" ->
            { model | createResponse = Api.NotAsked, validationError = VError "Name has to be set" }

        _ ->
            { model | createResponse = Api.NotAsked, validationError = VNothing }



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
            [ createButton
            ]
            [ viewTextInput { name = "Name", value = Just model.nameInput, placeholder = Just "Shopping List", action = NameChanged }
            , viewTextAreaInput { name = "Description", value = Just model.descriptionInput, placeholder = Just "Buy these items when you are in a supermarket", action = DescriptionChanged }
            , viewValidationResult model.validationError
            ]
        ]
    }
