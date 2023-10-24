module Domain.ItemPink exposing (ItemPink)


type alias ItemPink =
    { id : String
    , name : String
    , description : Maybe String
    , completed : Bool
    }
