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
import Shared.Model
import Shared.Msg
import User exposing (User)



-- FLAGS


type alias Flags =
    { user : Maybe User, baseUrl : String, stage : String }


decoder : Json.Decode.Decoder Flags
decoder =
    Json.Decode.map3 Flags
        (Json.Decode.maybe (Json.Decode.field "user" userDecoder))
        (Json.Decode.field "baseUrl" Json.Decode.string)
        (Json.Decode.field "stage" Json.Decode.string)


userDecoder =
    Json.Decode.map7 User
        (Json.Decode.field "id" Json.Decode.string)
        (Json.Decode.maybe (Json.Decode.field "firstName" Json.Decode.string))
        (Json.Decode.maybe (Json.Decode.field "lastName" Json.Decode.string))
        (Json.Decode.maybe (Json.Decode.field "userName" Json.Decode.string))
        (Json.Decode.field "email" Json.Decode.string)
        (Json.Decode.maybe (Json.Decode.field "image" Json.Decode.string))
        (Json.Decode.field "authToken" Json.Decode.string)



-- INIT


type alias Model =
    Shared.Model.Model


init : Result Json.Decode.Error Flags -> Route () -> ( Model, Effect Msg )
init flagsResult route =
    let
        user =
            flagsResult
                |> Result.map .user
                |> Result.withDefault Nothing

        baseUrl =
            flagsResult
                |> Result.map .baseUrl
                |> Result.withDefault "/api/"
    in
    ( { lastMessage = ""
      , user = user
      , baseUrl = baseUrl
      , stage =
            flagsResult
                |> Result.map .stage
                |> Result.withDefault "dev"
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

        Shared.Msg.FromJavascript rawEvent ->
            let
                event =
                    decodeEvent rawEvent

                newUser =
                    case event.eventType of
                        "TOKEN_UPDATE" ->
                            case model.user of
                                Just user ->
                                    Just { user | authToken = event.newToken }

                                Nothing ->
                                    Nothing

                        _ ->
                            model.user
            in
            ( { model | user = newUser }
            , Effect.none
            )

        Shared.Msg.UserUpdate newUser ->
            ( { model | user = newUser }
            , Effect.none
            )

        Shared.Msg.UserSignedOut ->
            ( { model | user = Nothing }
            , Effect.none
            )


type alias EventFromJavascript =
    { eventType : String
    , newToken : String
    }


eventDecoder : Json.Decode.Decoder EventFromJavascript
eventDecoder =
    Json.Decode.map2 EventFromJavascript
        (Json.Decode.field "type" Json.Decode.string)
        (Json.Decode.field "newToken" Json.Decode.string)


decodeEvent : String -> EventFromJavascript
decodeEvent event =
    case Json.Decode.decodeString eventDecoder event of
        Ok e ->
            e

        Err error ->
            EventFromJavascript "error" "error"



-- SUBSCRIPTIONS


subscriptions : Route () -> Model -> Sub Msg
subscriptions route model =
    toElm Shared.Msg.FromJavascript
