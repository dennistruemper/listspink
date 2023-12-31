module Effect exposing
    ( Effect
    , none, batch
    , sendCmd, sendMsg
    , pushRoute, replaceRoute, loadExternalUrl
    , map, toCmd
    , logging, navigateBack, redirectToProfile, redirectToSignIn, signOut
    )

{-|

@docs Effect
@docs none, batch
@docs sendCmd, sendMsg
@docs pushRoute, replaceRoute, loadExternalUrl

@docs map, toCmd

-}

import Browser.Navigation
import Dict exposing (Dict)
import Json.Encode as Encode
import Ports exposing (MessageFromElm, sendFromElm)
import Route exposing (Route)
import Route.Path
import Shared.Model
import Shared.Msg
import Task
import Url exposing (Url)


type Effect msg
    = -- BASICS
      None
    | Batch (List (Effect msg))
    | SendCmd (Cmd msg)
      -- ROUTING
    | PushUrl String
    | ReplaceUrl String
    | LoadExternalUrl String
      -- SHARED
    | SendSharedMsg Shared.Msg.Msg
      -- PORTS
    | SendMessageToJavaScript
        { tag : String
        , data : Encode.Value
        }
    | NavigateBack



-- BASICS


{-| Don't send any effect.
-}
none : Effect msg
none =
    None


{-| Send multiple effects at once.
-}
batch : List (Effect msg) -> Effect msg
batch =
    Batch


{-| Send a normal `Cmd msg` as an effect, something like `Http.get` or `Random.generate`.
-}
sendCmd : Cmd msg -> Effect msg
sendCmd =
    SendCmd


{-| Send a message as an effect. Useful when emitting events from UI components.
-}
sendMsg : msg -> Effect msg
sendMsg msg =
    Task.succeed msg
        |> Task.perform identity
        |> SendCmd



-- ROUTING


{-| Set the new route, and make the back button go back to the current route.
-}
pushRoute :
    { path : Route.Path.Path
    , query : Dict String String
    , hash : Maybe String
    }
    -> Effect msg
pushRoute route =
    PushUrl (Route.toString route)


{-| Set the new route, but replace the previous one, so clicking the back
button **won't** go back to the previous route.
-}
replaceRoute :
    { path : Route.Path.Path
    , query : Dict String String
    , hash : Maybe String
    }
    -> Effect msg
replaceRoute route =
    ReplaceUrl (Route.toString route)


{-| Redirect users to a new URL, somewhere external your web application.
-}
loadExternalUrl : String -> Effect msg
loadExternalUrl =
    LoadExternalUrl


logging : String -> Effect msg
logging value =
    SendMessageToJavaScript { tag = "logging", data = Encode.string value }


redirectToSignIn : Effect msg
redirectToSignIn =
    SendMessageToJavaScript { tag = "signin-redirect", data = Encode.object [] }


signOut : Effect msg
signOut =
    SendMessageToJavaScript { tag = "signout", data = Encode.object [] }


redirectToProfile : Effect msg
redirectToProfile =
    SendMessageToJavaScript { tag = "profile-redirect", data = Encode.object [] }


navigateBack : Effect msg
navigateBack =
    NavigateBack



-- INTERNALS


{-| Elm Land depends on this function to connect pages and layouts
together into the overall app.
-}
map : (msg1 -> msg2) -> Effect msg1 -> Effect msg2
map fn effect =
    case effect of
        None ->
            None

        Batch list ->
            Batch (List.map (map fn) list)

        SendCmd cmd ->
            SendCmd (Cmd.map fn cmd)

        PushUrl url ->
            PushUrl url

        ReplaceUrl url ->
            ReplaceUrl url

        LoadExternalUrl url ->
            LoadExternalUrl url

        NavigateBack ->
            NavigateBack

        SendSharedMsg sharedMsg ->
            SendSharedMsg sharedMsg

        SendMessageToJavaScript message ->
            if message.tag == "signout" then
                batch [ SendMessageToJavaScript message, SendSharedMsg Shared.Msg.UserSignedOut ]

            else
                SendMessageToJavaScript message


{-| Elm Land depends on this function to perform your effects.
-}
toCmd :
    { key : Browser.Navigation.Key
    , url : Url
    , shared : Shared.Model.Model
    , fromSharedMsg : Shared.Msg.Msg -> msg
    , batch : List msg -> msg
    , toCmd : msg -> Cmd msg
    }
    -> Effect msg
    -> Cmd msg
toCmd options effect =
    case effect of
        None ->
            Cmd.none

        Batch list ->
            Cmd.batch (List.map (toCmd options) list)

        SendCmd cmd ->
            cmd

        PushUrl url ->
            Browser.Navigation.pushUrl options.key url

        ReplaceUrl url ->
            Browser.Navigation.replaceUrl options.key url

        LoadExternalUrl url ->
            Browser.Navigation.load url

        NavigateBack ->
            Browser.Navigation.back options.key 1

        SendSharedMsg sharedMsg ->
            Task.succeed sharedMsg
                |> Task.perform options.fromSharedMsg

        SendMessageToJavaScript message ->
            sendFromElm message
