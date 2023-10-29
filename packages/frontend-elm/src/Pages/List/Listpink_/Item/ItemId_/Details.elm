module Pages.List.Listpink_.Item.ItemId_.Details exposing (Model, Msg, page)

import Effect exposing (Effect)
import Html
import Layouts
import Page exposing (Page)
import Route exposing (Route)
import Shared
import View exposing (View)


page : Shared.Model -> Route { listpink : String, itemId : String } -> Page Model Msg
page shared route =
    Page.new
        { init = init
        , update = update
        , subscriptions = subscriptions
        , view = view
        }
        |> Page.withLayout (toLayout route.params.itemId)


toLayout : String -> Model -> Layouts.Layout Msg
toLayout itemId model =
    Layouts.Scaffold
        { title = "Item Details: " ++ itemId -- TODO add name instead of ID
        }



-- INIT


type alias Model =
    {}


init : () -> ( Model, Effect Msg )
init () =
    ( {}
    , Effect.none
    )



-- UPDATE


type Msg
    = NoOp


update : Msg -> Model -> ( Model, Effect Msg )
update msg model =
    case msg of
        NoOp ->
            ( model
            , Effect.none
            )



-- SUBSCRIPTIONS


subscriptions : Model -> Sub Msg
subscriptions model =
    Sub.none



-- VIEW


view : Model -> View Msg
view model =
    { title = "Pages.List.Listpink_.Item.ItemId_.Details"
    , body = [ Html.text "/list/:listpink/item/:itemId/details" ]
    }
