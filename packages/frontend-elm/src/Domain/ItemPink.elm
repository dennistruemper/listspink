module Domain.ItemPink exposing (ItemPink, isCompleted)


type alias ItemPink =
    { id : String
    , name : String
    , description : Maybe String
    , completed : Maybe String
    , priority : Int
    }


isCompleted : ItemPink -> Bool
isCompleted item =
    case item.completed of
        Just _ ->
            True

        Nothing ->
            False
