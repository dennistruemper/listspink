module Pages.Home_ exposing (Model, Msg, page)

import Api exposing (Data)
import Api.List
import Auth
import Components.ActionBarWrapper exposing (viewActionBarWrapper)
import Components.Button exposing (viewButton)
import Components.Card exposing (viewListPinkCard)
import Components.Grid exposing (viewGrid)
import Dict
import Domain.ListPink exposing (ListPink)
import Effect exposing (Effect)
import Html
import Html.Attributes as Attr exposing (class)
import Html.Events exposing (onClick)
import Http
import Http.Detailed
import Layouts exposing (Layout)
import Page exposing (Page)
import Result exposing (Result)
import Route exposing (Route)
import Route.Path
import Shared
import Shared.Model
import Svg exposing (path, svg)
import Svg.Attributes as SvgAttr
import User exposing (User, getUserName)
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
        { title = getTitle
        }


getTitle : String
getTitle =
    "Your Pink Lists"



-- INIT


type alias Model =
    { userName : String
    , user : User
    , baseUrl : String
    , lists : List ListPink
    , listsLoaded : Data (List ListPink)
    }


init : Auth.User -> Shared.Model -> () -> ( Model, Effect Msg )
init user shared () =
    ( { userName = getUserName user
      , user = user
      , baseUrl = shared.baseUrl
      , lists = [ ListPink "list-id" "Pink List" Nothing, ListPink "list-id-2" "Pinker List" Nothing ]
      , listsLoaded = Api.Loading
      }
    , Api.List.getLists { baseUrl = shared.baseUrl, token = user.authToken, onResponse = ListsResponded }
    )



-- UPDATE


type Msg
    = NoOp
    | SignInClicked
    | SignOutClicked
    | ListsResponded (Result (Http.Detailed.Error String) ( Http.Metadata, List ListPink ))
    | CreateClicked
    | NavigateClicked { path : Route.Path.Path, query : Dict.Dict String String }


update : Msg -> Model -> ( Model, Effect Msg )
update msg model =
    case msg of
        NoOp ->
            ( model
            , Effect.none
            )

        SignInClicked ->
            ( model
            , Effect.redirectToSignIn
            )

        SignOutClicked ->
            ( model
            , Effect.signOut
            )

        ListsResponded (Ok ( metadata, lists )) ->
            ( { model | listsLoaded = Api.Success lists }
            , Effect.none
            )

        -- TODO handle error
        ListsResponded (Err error) ->
            ( { model | listsLoaded = Api.FailureWithDetails error }
            , Effect.none
            )

        CreateClicked ->
            ( model
            , Effect.pushRoute { path = Route.Path.List_Create, query = Dict.empty, hash = Nothing }
            )

        NavigateClicked { path, query } ->
            ( model
            , Effect.pushRoute { path = path, query = query, hash = Nothing }
            )



-- SUBSCRIPTIONS


subscriptions : Model -> Sub Msg
subscriptions model =
    Sub.none



-- VIEW


viewList : ListPink -> Html.Html Msg
viewList list =
    Html.div
        [ class "" ]
        [ Html.text list.name ]


viewLists : List ListPink -> List (Html.Html Msg)
viewLists lists =
    if List.length lists == 0 then
        [ Html.text "No lists jet" ]

    else
        --List.map
        --    viewList
        --    lists
        [ viewGrid
            (List.map
                viewListPinkCard
                (lists |> List.map (\list -> { listPink = list, navigateMsg = NavigateClicked }))
            )
        ]


view : Model -> View Msg
view model =
    { title = getTitle
    , body =
        [ viewActionBarWrapper
            [ viewButton "Create" CreateClicked
            ]
            [ Html.div [] <|
                case model.listsLoaded of
                    Api.NotAsked ->
                        [ Html.div [] [] ]

                    Api.Loading ->
                        [ Html.text "Loading..." ]

                    Api.Success lists ->
                        [ Html.div []
                            [ Html.div [] (viewLists lists)
                            ]
                        ]

                    Api.FailureWithDetails error ->
                        [ Html.text "Error loading lists" ]
            ]
        ]
    }
