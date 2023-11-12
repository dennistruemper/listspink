module Pages.Settings exposing (Model, Msg, page)

import Api exposing (Data(..))
import Api.Version
import Effect exposing (Effect)
import Html
import Http
import Http.Detailed
import Layouts exposing (Layout)
import Page exposing (Page)
import Route exposing (Route)
import Shared
import Shared.Model
import View exposing (View)


page : Shared.Model -> Route () -> Page Model Msg
page shared route =
    Page.new
        { init = init shared
        , update = update
        , subscriptions = subscriptions
        , view = view shared
        }
        |> Page.withLayout toLayout


toLayout : Model -> Layouts.Layout Msg
toLayout model =
    Layouts.Scaffold
        { title = getTitle
        }


getTitle : String
getTitle =
    "Settings"



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
    = VersionResponded (Result (Http.Detailed.Error String) ( Http.Metadata, String ))


update : Msg -> Model -> ( Model, Effect Msg )
update msg model =
    case msg of
        VersionResponded (Ok ( metadata, backendVersion )) ->
            ( { model | backendVersion = Api.Success backendVersion }
            , Effect.none
            )

        VersionResponded (Err httpErr) ->
            ( { model | backendVersion = Api.FailureWithDetails httpErr }
            , Effect.none
            )



-- SUBSCRIPTIONS


subscriptions : Model -> Sub Msg
subscriptions model =
    Sub.none



-- VIEW


view : Shared.Model -> Model -> View Msg
view shared model =
    { title = getTitle
    , body =
        [ Html.text "Backendversion: "
        , case model.backendVersion of
            Api.NotAsked ->
                Html.text "Not Asked for version yet"

            Api.Loading ->
                Html.text "Loading..."

            Api.Success backendVersion ->
                Html.text backendVersion

            Api.FailureWithDetails error ->
                Html.text "Error getting Version"
        , Html.div [] [ Html.text ("Frontendversion: " ++ shared.stage) ]
        ]
    }
