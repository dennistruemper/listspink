module Pages.Home_ exposing (Model, Msg, page)

import Auth
import Effect exposing (Effect)
import Html
import Html.Attributes exposing (class)
import Html.Events exposing (onClick)
import Layouts exposing (Layout)
import Page exposing (Page)
import Route exposing (Route)
import Shared
import Shared.Model
import User exposing (User, getUserName)
import View exposing (View)


page : Auth.User -> Shared.Model -> Route () -> Page Model Msg
page user shared route =
    Page.new
        { init = init shared
        , update = update
        , subscriptions = subscriptions
        , view = view
        }
        |> Page.withLayout toLayout


{-| Use the sidebar layout on this page
-}
toLayout : Model -> Layouts.Layout Msg
toLayout model =
    Layouts.Scaffold
        {}



-- INIT


type alias Model =
    { userName : String, user : Maybe User }


init : Shared.Model -> () -> ( Model, Effect Msg )
init shared () =
    let
        userName =
            case shared.user of
                Just user ->
                    getUserName user

                Nothing ->
                    "please log in"
    in
    ( { userName = userName, user = shared.user }
    , Effect.logging "Pages.Home_.init"
    )



-- UPDATE


type Msg
    = NoOp
    | SignInClicked
    | SignOutClicked


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



-- SUBSCRIPTIONS


subscriptions : Model -> Sub Msg
subscriptions model =
    Sub.none



-- VIEW


view : Model -> View Msg
view model =
    { title = "Pages.Home_"
    , body =
        [ Html.div [ class "bg-pink-100 " ]
            [ Html.text model.userName
            , Html.div [ class "h-96 w-96 bg-black p-8 m-8" ] [ Html.text "test" ]
            , Html.div [ class "h-96 w-96 bg-black p-8 m-8" ] [ Html.text "test" ]
            , Html.div [ class "h-96 w-96 bg-black p-8 m-8" ] [ Html.text "test" ]
            ]
        ]
    }
