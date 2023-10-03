module Shared exposing
    ( Flags, decoder
    , Model, Msg
    , init, update, subscriptions
    )

{-|

@docs Flags, decoder
@docs Model, Msg
@docs init, update, subscriptions

-}

import Debug
import Effect exposing (Effect)
import Json.Decode
import Ports exposing (toElm)
import Route exposing (Route)
import Route.Path
import Shared.Model exposing (User)
import Shared.Msg



-- FLAGS


type alias Flags =
    { user : Maybe User }


decoder : Json.Decode.Decoder Flags
decoder =
    Json.Decode.map Flags
        (Json.Decode.maybe (Json.Decode.field "user" userDecoder))


userDecoder =
    Json.Decode.map5 User
        (Json.Decode.field "id" Json.Decode.string)
        (Json.Decode.maybe (Json.Decode.field "firstName" Json.Decode.string))
        (Json.Decode.maybe (Json.Decode.field "lastName" Json.Decode.string))
        (Json.Decode.maybe (Json.Decode.field "userName" Json.Decode.string))
        (Json.Decode.field "email" Json.Decode.string)



-- INIT


type alias Model =
    Shared.Model.Model


init : Result Json.Decode.Error Flags -> Route () -> ( Model, Effect Msg )
init flagsResult route =
    ( { lastMessage = ""
      , user =
            flagsResult
                |> Result.map .user
                |> Result.withDefault Nothing
      }
    , Effect.none
    )



-- UPDATE


type alias Msg =
    Shared.Msg.Msg


update : Route () -> Msg -> Model -> ( Model, Effect Msg )
update route msg model =
    case msg of
        Shared.Msg.NoOp ->
            ( model
            , Effect.none
            )

        Shared.Msg.FromJavascript event ->
            ( model
            , Effect.none
            )

        Shared.Msg.UserUpdate newUser ->
            ( { model | user = newUser }
            , Effect.none
            )



-- SUBSCRIPTIONS


subscriptions : Route () -> Model -> Sub Msg
subscriptions route model =
    toElm Shared.Msg.FromJavascript
