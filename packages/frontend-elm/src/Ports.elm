port module Ports exposing (MessageFromElm(..), sendFromElm, toElm)

import Json.Encode as Encode


sendFromElm : { tag : String, data : Encode.Value } -> Cmd msg
sendFromElm message =
    let
        payload =
            { tag = message.tag
            , data = Encode.encode 0 message.data
            }
    in
    fromElm payload


port fromElm : { tag : String, data : String } -> Cmd msg


port toElm : (String -> msg) -> Sub msg


type MessageFromElm
    = MessageFromElm String
    | LogFromElm String


toString : MessageFromElm -> String
toString message =
    case message of
        MessageFromElm _ ->
            "MessageFromElm"

        LogFromElm msg ->
            "LogFromElm"


encode : MessageFromElm -> String
encode message =
    let
        messageType =
            ( "type", Encode.string (toString message) )
    in
    Encode.encode 0 <|
        case message of
            MessageFromElm msg ->
                Encode.object [ messageType ]

            LogFromElm msg ->
                Encode.object [ messageType ]
