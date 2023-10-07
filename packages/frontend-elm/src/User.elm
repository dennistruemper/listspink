module User exposing (User, getUserName)


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
