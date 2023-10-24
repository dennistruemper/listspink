module Pages.List.Listpink_.Show exposing (Model, Msg, page)

import Api exposing (Data(..))
import Api.Item
import Auth
import Components.ActionBarWrapper exposing (viewActionBarWrapper)
import Components.Button exposing (viewButton)
import Dict
import Domain.ItemPink
import Effect exposing (Effect)
import Html
import Http
import Layouts
import Page exposing (Page)
import Route exposing (Route)
import Route.Path
import Shared
import View exposing (View)


page : Auth.User -> Shared.Model -> Route { listpink : String } -> Page Model Msg
page user shared route =
    let
        name =
            route.query
                |> Dict.get "name"
                |> Maybe.withDefault route.params.listpink
    in
    Page.new
        { init = init user shared route.params.listpink
        , update = update
        , subscriptions = subscriptions
        , view = view
        }
        |> Page.withLayout (toLayout name)


toLayout : String -> Model -> Layouts.Layout Msg
toLayout name model =
    Layouts.Scaffold
        { title = "List: " ++ name
        }



-- INIT


type alias Model =
    { listId : String
    , items : Data (List Domain.ItemPink.ItemPink)
    }


init : Auth.User -> Shared.Model -> String -> () -> ( Model, Effect Msg )
init user shared listId () =
    ( { listId = listId
      , items = Loading
      }
    , Api.Item.getItemsForList { listId = listId, baseUrl = shared.baseUrl, token = user.authToken, onResponse = OnGetItemsForList }
    )



-- UPDATE


type Msg
    = NoOp
    | OnGetItemsForList (Result Http.Error (List Domain.ItemPink.ItemPink))
    | CreateItemPinkClicked String


update : Msg -> Model -> ( Model, Effect Msg )
update msg model =
    case msg of
        NoOp ->
            ( model
            , Effect.none
            )

        OnGetItemsForList (Ok items) ->
            ( { model | items = Success items }
            , Effect.none
            )

        OnGetItemsForList (Err error) ->
            ( { model | items = Failure error }
            , Effect.none
            )

        CreateItemPinkClicked listId ->
            ( model
            , Effect.pushRoute { path = Route.Path.List_Listpink__Item_Create { listpink = listId }, query = Dict.empty, hash = Nothing }
            )



-- SUBSCRIPTIONS


subscriptions : Model -> Sub Msg
subscriptions model =
    Sub.none



-- VIEW


view : Model -> View Msg
view model =
    { title = "Pages.List.Listpink_.Show"
    , body =
        [ viewActionBarWrapper [ viewButton "Create" (CreateItemPinkClicked model.listId) ]
            [ case model.items of
                NotAsked ->
                    Html.text "Waiting..."

                Loading ->
                    Html.text "Loading..."

                Failure _ ->
                    Html.text "Error"

                Success items ->
                    case items of
                        [] ->
                            Html.text "No items"

                        _ ->
                            items |> List.map (\item -> Html.text (.name item)) |> Html.ul []
            ]
        ]
    }
