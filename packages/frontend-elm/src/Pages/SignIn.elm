module Pages.SignIn exposing (Model, Msg, page)

import Components.Button
import Effect exposing (Effect)
import Html
import Layouts
import Page exposing (Page)
import Route exposing (Route)
import Route.Path
import Shared
import User exposing (User, getUserName)
import View exposing (View)


page : Shared.Model -> Route () -> Page Model Msg
page shared route =
    Page.new
        { init = init
        , update = update
        , subscriptions = subscriptions
        , view = view shared
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
    "Sign in"



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
    | SignInClicked


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



-- SUBSCRIPTIONS


subscriptions : Model -> Sub Msg
subscriptions model =
    Sub.none



-- VIEW


view : Shared.Model -> Model -> View Msg
view shared model =
    let
        helloText =
            case shared.user of
                Just user ->
                    Html.text ("Hello, " ++ getUserName user)

                Nothing ->
                    Components.Button.button { label = "Sign in", onClick = SignInClicked } |> Components.Button.view
    in
    { title = getTitle
    , body = []
    }
