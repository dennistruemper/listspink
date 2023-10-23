module Pages.Home_ exposing (Model, Msg, page)

import Api exposing (Data)
import Api.List exposing (ListPink)
import Auth
import Components.ActionBarWrapper exposing (viewActionBarWrapper)
import Components.Button exposing (viewButton)
import Dict
import Effect exposing (Effect)
import Html
import Html.Attributes exposing (class)
import Html.Events exposing (onClick)
import Http
import Layouts exposing (Layout)
import Page exposing (Page)
import Result exposing (Result)
import Route exposing (Route)
import Route.Path
import Shared
import Shared.Model
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
        {}



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
    | ListsResponded (Result Http.Error (List ListPink))
    | CreateClicked


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

        ListsResponded (Ok lists) ->
            ( { model | listsLoaded = Api.Success lists }
            , Effect.none
            )

        -- TODO handle error
        ListsResponded (Err error) ->
            ( { model | listsLoaded = Api.Failure error }
            , Effect.none
            )

        CreateClicked ->
            ( model
            , Effect.pushRoute { path = Route.Path.List_Create, query = Dict.empty, hash = Nothing }
            )



-- SUBSCRIPTIONS


subscriptions : Model -> Sub Msg
subscriptions model =
    Sub.none



-- VIEW


viewLists : List ListPink -> List (Html.Html Msg)
viewLists lists =
    if List.length lists == 0 then
        [ Html.text "No lists jet" ]

    else
        List.map
            (\list ->
                Html.div
                    [ class "" ]
                    [ Html.text list.name ]
            )
            lists


view : Model -> View Msg
view model =
    { title = "Pages.Home_"
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
                            , Html.div [ class "m-8 w-96 h-96 bg-black text-white text-center" ] [ Html.text "placeholder" ]
                            , Html.div [ class "m-8 w-96 h-96 bg-black text-white text-center" ] [ Html.text "placeholder" ]
                            , Html.div [ class "m-8 w-96 h-96 bg-black text-white text-center" ] [ Html.text "placeholder" ]
                            , Html.div [ class "m-8 w-96 h-96 bg-black text-white text-center" ] [ Html.text "placeholder" ]
                            , Html.text "end"
                            ]
                        ]

                    Api.Failure error ->
                        [ Html.text "Error loading lists" ]
            ]
        ]
    }
