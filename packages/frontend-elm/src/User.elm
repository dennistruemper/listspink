module User exposing (User, getImageUrlOrDefault, getUserName)


type alias User =
    { id : String
    , firstName : Maybe String
    , lastName : Maybe String
    , userName : Maybe String
    , email : String
    , image : Maybe String
    , authToken : String
    }


getUserName : User -> String
getUserName user =
    user.userName
        |> Maybe.withDefault user.email


getImageUrlOrDefault : User -> String
getImageUrlOrDefault user =
    user.image
        |> Maybe.withDefault "logo.png"
