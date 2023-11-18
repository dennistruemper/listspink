module Pages.List.Listpink_.Show exposing (Model, Msg, page)

import Api exposing (Data(..))
import Api.Item exposing (ToggleItemPink)
import Auth
import Components.ActionBarWrapper exposing (viewActionBarWrapper)
import Components.Button
import Components.ItemList exposing (viewItemList)
import Dict
import Domain.ItemPink
import Effect exposing (Effect)
import Html
import Html.Attributes exposing (class)
import Http
import Http.Detailed
import Layouts
import Page exposing (Page)
import Route exposing (Route)
import Route.Path
import Shared
import Task
import Time
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
        { init = init user shared route.params.listpink name
        , update = update shared user
        , subscriptions = subscriptions
        , view = view
        }
        |> Page.withLayout toLayout


toLayout : Model -> Layouts.Layout Msg
toLayout model =
    Layouts.Scaffold
        { title = getTitle model
        }


getTitle : Model -> String
getTitle model =
    "List: " ++ model.name



-- INIT


type alias Model =
    { listId : String
    , items : Data (List Domain.ItemPink.ItemPink)
    , name : String
    }


init : Auth.User -> Shared.Model -> String -> String -> () -> ( Model, Effect Msg )
init user shared listId name () =
    ( { listId = listId
      , items = Loading
      , name = name
      }
    , Api.Item.getItemsForList { listId = listId, baseUrl = shared.baseUrl, token = user.authToken, onResponse = OnGetItemsForList }
    )



-- UPDATE


type Msg
    = NoOp
    | OnGetItemsForList (Result (Http.Detailed.Error String) ( Http.Metadata, List Domain.ItemPink.ItemPink ))
    | CreateItemPinkClicked String
    | ItemPinkCompletedToggled String
    | OnToggleItemPink (Result (Http.Detailed.Error String) ( Http.Metadata, String ))
    | ItemCompleted String Time.Posix


update : Shared.Model -> Auth.User -> Msg -> Model -> ( Model, Effect Msg )
update shared user msg model =
    case msg of
        NoOp ->
            ( model
            , Effect.none
            )

        OnGetItemsForList (Ok ( metadata, items )) ->
            ( { model | items = Success (orderItems items) }
            , Effect.none
            )

        OnGetItemsForList (Err error) ->
            ( { model | items = FailureWithDetails error }
            , Effect.none
            )

        CreateItemPinkClicked listId ->
            ( model
            , Effect.pushRoute { path = Route.Path.List_Listpink__Item_Create { listpink = listId }, query = Dict.empty, hash = Nothing }
            )

        ItemPinkCompletedToggled itemId ->
            ( model
            , Effect.batch
                [ Api.Item.toggleItem { baseUrl = shared.baseUrl, body = ToggleItemPink itemId model.listId, token = user.authToken, onResponse = OnToggleItemPink }
                , Task.perform (ItemCompleted itemId) Time.now |> Effect.sendCmd
                ]
            )

        OnToggleItemPink (Ok ( metadata, response )) ->
            ( model
            , Effect.none
            )

        OnToggleItemPink (Err error) ->
            ( model
            , Effect.none
            )

        ItemCompleted itemId time ->
            ( toggleItem model itemId time
            , Effect.none
            )


orderItems : List Domain.ItemPink.ItemPink -> List Domain.ItemPink.ItemPink
orderItems items =
    List.sortBy
        (\item ->
            case item.completed of
                Just completed ->
                    completed

                -- show uncompleted items first
                Nothing ->
                    "9999-99-99T99:99:99.999Z"
        )
        items
        |> List.reverse


toggleItem : Model -> String -> Time.Posix -> Model
toggleItem model itemId time =
    { model
        | items =
            case model.items of
                Success items ->
                    Success
                        (List.map
                            (\item ->
                                if item.id == itemId then
                                    { item
                                        | completed =
                                            case item.completed of
                                                Just _ ->
                                                    Nothing

                                                Nothing ->
                                                    Just (toUtcString time)
                                    }

                                else
                                    item
                            )
                            items
                        )

                _ ->
                    model.items
    }


toUtcString : Time.Posix -> String
toUtcString time =
    String.fromInt (Time.toYear Time.utc time)
        ++ "-"
        ++ monthToInt (Time.toMonth Time.utc time)
        ++ "-"
        ++ String.fromInt (Time.toDay Time.utc time)
        ++ "T"
        ++ String.fromInt (Time.toHour Time.utc time)
        ++ ":"
        ++ String.fromInt (Time.toMinute Time.utc time)
        ++ ":"
        ++ String.fromInt (Time.toSecond Time.utc time)
        ++ "."
        ++ String.fromInt (Time.toMillis Time.utc time)
        ++ "Z"


monthToInt : Time.Month -> String
monthToInt month =
    case month of
        Time.Jan ->
            "01"

        Time.Feb ->
            "02"

        Time.Mar ->
            "03"

        Time.Apr ->
            "04"

        Time.May ->
            "05"

        Time.Jun ->
            "06"

        Time.Jul ->
            "07"

        Time.Aug ->
            "08"

        Time.Sep ->
            "09"

        Time.Oct ->
            "10"

        Time.Nov ->
            "11"

        Time.Dec ->
            "12"



-- SUBSCRIPTIONS


subscriptions : Model -> Sub Msg
subscriptions model =
    Sub.none



-- VIEW


view : Model -> View Msg
view model =
    { title = getTitle model
    , body =
        [ viewActionBarWrapper [ Components.Button.button { label = "Create", onClick = CreateItemPinkClicked model.listId } |> Components.Button.view ]
            [ case model.items of
                NotAsked ->
                    Html.text "Waiting..."

                Loading ->
                    Html.text "Loading..."

                FailureWithDetails _ ->
                    Html.text "Error"

                Success items ->
                    case items of
                        [] ->
                            Html.text "No items"

                        _ ->
                            Html.div [ class "" ]
                                [ viewItemList model.listId items ItemPinkCompletedToggled
                                ]
            ]
        ]
    }
