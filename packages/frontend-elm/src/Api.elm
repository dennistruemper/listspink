module Api exposing (Data(..))

import Http
import Http.Detailed


type Data value
    = NotAsked
    | Loading
    | Success value
    | FailureWithDetails (Http.Detailed.Error String)
