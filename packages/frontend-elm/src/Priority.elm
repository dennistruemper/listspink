module Priority exposing (priorityFromString, priorityToSelectedList, priorityToString)

import Components.Dropdown exposing (ExactOneSelection(..))


priorityFromString : String -> Int
priorityFromString priority =
    String.toInt priority |> Maybe.withDefault 0


priorities : List Int
priorities =
    [ 3, 2, 1, 0, -1, -2, -3 ]


priorityToString : Int -> String
priorityToString priority =
    if priority == -3 then
        "--- Lowest"

    else if priority == -2 then
        "-- Lower"

    else if priority == -1 then
        "- Low"

    else if priority == 0 then
        "Standard"

    else if priority == 1 then
        "+ High"

    else if priority == 2 then
        "++ Higher"

    else if priority == 3 then
        "+++ Highest"

    else
        String.fromInt priority


priorityToSelectedList : Int -> ExactOneSelection { value : Int, text : String }
priorityToSelectedList priority =
    let
        priorityRecord =
            { text = priorityToString priority, value = priority }

        priorityList =
            List.map (\item -> { text = priorityToString item, value = item }) priorities
    in
    priorityToSelectedListHelper priorityRecord priorityList []


priorityToSelectedListHelper : { value : Int, text : String } -> List { value : Int, text : String } -> List { value : Int, text : String } -> ExactOneSelection { value : Int, text : String }
priorityToSelectedListHelper selectedPriority priorityList acc =
    case priorityList of
        [] ->
            ExactOneSelection acc selectedPriority []

        x :: xs ->
            if x == selectedPriority then
                ExactOneSelection acc x xs

            else
                priorityToSelectedListHelper selectedPriority xs (acc ++ [ x ])
