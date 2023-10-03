module Shared.Model exposing (Model, User, getUserName)

{-| -}


{-| Normally, this value would live in "Shared.elm"
but that would lead to a circular dependency import cycle.

For that reason, both `Shared.Model` and `Shared.Msg` are in their
own file, so they can be imported by `Effect.elm`

-}
type alias Model =
    { lastMessage : String
    , user : Maybe User
    }


type alias User =
    { id : String
    , firstName : Maybe String
    , lastName : Maybe String
    , userName : Maybe String
    , email : String
    }


getUserName : User -> String
getUserName user =
    user.userName
        |> Maybe.withDefault user.email
