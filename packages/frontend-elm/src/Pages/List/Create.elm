module Pages.List.Create exposing (Model, Msg, page)

import Components.TextInput exposing (viewTextAreaInput, viewTextInput)
import Effect exposing (Effect)
import Html
import Html.Attributes as Attr
import Html.Events as Events
import Layouts
import Page exposing (Page)
import Route exposing (Route)
import Shared
import View exposing (View)


page : Shared.Model -> Route () -> Page Model Msg
page shared route =
    Page.new
        { init = init
        , update = update
        , subscriptions = subscriptions
        , view = view
        }
        |> Page.withLayout toLayout


toLayout : Model -> Layouts.Layout Msg
toLayout model =
    Layouts.Scaffold
        {}



-- INIT


type alias Model =
    { nameInput : String
    , descriptionInput : String
    }


init : () -> ( Model, Effect Msg )
init () =
    ( { nameInput = ""
      , descriptionInput = ""
      }
    , Effect.none
    )



-- UPDATE


type Msg
    = NoOp
    | NameChanged String
    | DescriptionChanged String


update : Msg -> Model -> ( Model, Effect Msg )
update msg model =
    case msg of
        NoOp ->
            ( model
            , Effect.none
            )

        NameChanged name ->
            ( { model | nameInput = name }
            , Effect.none
            )

        DescriptionChanged description ->
            ( { model | descriptionInput = description }
            , Effect.none
            )



-- SUBSCRIPTIONS


subscriptions : Model -> Sub Msg
subscriptions model =
    Sub.none



-- VIEW


view : Model -> View Msg
view model =
    { title = "Pages.List.Create"
    , body =
        [ viewTextInput { name = "Name", value = Just model.nameInput, placeholder = Just "Buy orange juice", action = NameChanged }
        , viewTextAreaInput { name = "Description", value = Just model.descriptionInput, placeholder = Just "What I have to do to buy orage juice", action = DescriptionChanged }
        ]
    }
