module Pages.Settings exposing (Model, Msg, page)

import Api exposing (Data(..))
import Api.Version
import Effect exposing (Effect)
import Html
import Http
import Layouts exposing (Layout)
import Page exposing (Page)
import Route exposing (Route)
import Shared
import View exposing (View)


page : Shared.Model -> Route () -> Page Model Msg
page shared route =
    Page.new
        { init = init shared
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
    { backendVersion : Data String
    , baseUrl : String
    }


init : Shared.Model -> () -> ( Model, Effect Msg )
init shared () =
    ( { backendVersion = Api.Loading
      , baseUrl = shared.baseUrl
      }
    , Api.Version.getVersion { onResponse = VersionResponded, baseUrl = shared.baseUrl }
    )



-- UPDATE


type Msg
    = VersionResponded (Result Http.Error String)


update : Msg -> Model -> ( Model, Effect Msg )
update msg model =
    case msg of
        VersionResponded (Ok backendVersion) ->
            ( { model | backendVersion = Api.Success backendVersion }
            , Effect.none
            )

        VersionResponded (Err httpErr) ->
            ( { model | backendVersion = Api.Failure httpErr }
            , Effect.none
            )



-- SUBSCRIPTIONS


subscriptions : Model -> Sub Msg
subscriptions model =
    Sub.none



-- VIEW


view : Model -> View Msg
view model =
    { title = "Pages.Settings"
    , body =
        [ Html.text "Backendversion: "
        , case model.backendVersion of
            Api.NotAsked ->
                Html.text "Not Asked for version yet"

            Api.Loading ->
                Html.text "Loading..."

            Api.Success backendVersion ->
                Html.text backendVersion

            Api.Failure httpErr ->
                Html.text "Error getting Version"
        ]
    }
