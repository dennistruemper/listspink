module Layouts.Scaffold exposing (Model, Msg, Props, layout)

import Dict
import Effect exposing (Effect)
import Html exposing (Html)
import Html.Attributes as Attr exposing (class, href)
import Html.Events exposing (onClick)
import Layout exposing (Layout)
import Route exposing (Route)
import Route.Path
import Shared
import Shared.Msg
import Svg exposing (path, svg)
import Svg.Attributes as SvgAttr
import User
import View exposing (View)


type alias Props =
    {}


layout : Props -> Shared.Model -> Route () -> Layout () Model Msg contentMsg
layout props shared route =
    Layout.new
        { init = init shared
        , update = update
        , view = view
        , subscriptions = subscriptions
        }



-- MODEL


type alias Model =
    { isMobileSidebarOpen : Bool
    , isUserMenuOpen : Bool
    , user : Maybe User.User
    }


init : Shared.Model -> () -> ( Model, Effect Msg )
init shared _ =
    ( { isMobileSidebarOpen = False
      , isUserMenuOpen = False
      , user = shared.user
      }
    , Effect.none
    )



-- UPDATE


type Msg
    = SidebarCloseClicked
    | SidebarOpenClicked
    | SignOutClicked
    | SignInClicked
    | UserMenuToggleClicked
    | GoToProfileClicked
    | NavigateTo Route.Path.Path


update : Msg -> Model -> ( Model, Effect Msg )
update msg model =
    case msg of
        SidebarCloseClicked ->
            ( { model | isMobileSidebarOpen = False }
            , Effect.none
            )

        SidebarOpenClicked ->
            ( { model | isMobileSidebarOpen = True }
            , Effect.none
            )

        UserMenuToggleClicked ->
            ( { model | isUserMenuOpen = not model.isUserMenuOpen }
            , Effect.none
            )

        SignOutClicked ->
            ( { model | user = Nothing, isUserMenuOpen = False }
            , Effect.batch
                [ Effect.signOut
                , Effect.pushRoute { path = Route.Path.Bye, query = Dict.empty, hash = Nothing }
                ]
            )

        GoToProfileClicked ->
            ( { model | isUserMenuOpen = False }, Effect.redirectToProfile )

        SignInClicked ->
            ( { model | isUserMenuOpen = False }, Effect.redirectToSignIn )

        NavigateTo path ->
            ( { model | isMobileSidebarOpen = False }, Effect.pushRoute { path = path, query = Dict.empty, hash = Nothing } )


subscriptions : Model -> Sub Msg
subscriptions model =
    Sub.none



-- VIEW


viewTeamIcon =
    svg
        [ SvgAttr.class "h-6 w-6 shrink-0 text-black group-hover:text-black"
        , SvgAttr.fill "none"
        , SvgAttr.viewBox "0 0 24 24"
        , SvgAttr.strokeWidth "1.5"
        , SvgAttr.stroke "currentColor"
        , Attr.attribute "aria-hidden" "true"
        ]
        [ path
            [ SvgAttr.strokeLinecap "round"
            , SvgAttr.strokeLinejoin "round"
            , SvgAttr.d "M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
            ]
            []
        ]


viewHomeIcon =
    svg
        [ SvgAttr.class "h-6 w-6 shrink-0 text-black"
        , SvgAttr.fill "none"
        , SvgAttr.viewBox "0 0 24 24"
        , SvgAttr.strokeWidth "1.5"
        , SvgAttr.stroke "currentColor"
        , Attr.attribute "aria-hidden" "true"
        ]
        [ path
            [ SvgAttr.strokeLinecap "round"
            , SvgAttr.strokeLinejoin "round"
            , SvgAttr.d "M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
            ]
            []
        ]


viewSettingsIcon =
    svg
        [ SvgAttr.class "h-6 w-6 shrink-0 text-black group-hover:text-black"
        , SvgAttr.fill "none"
        , SvgAttr.viewBox "0 0 24 24"
        , SvgAttr.strokeWidth "1.5"
        , SvgAttr.stroke "currentColor"
        , Attr.attribute "aria-hidden" "true"
        ]
        [ path
            [ SvgAttr.strokeLinecap "round"
            , SvgAttr.strokeLinejoin "round"
            , SvgAttr.d "M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z"
            ]
            []
        , path
            [ SvgAttr.strokeLinecap "round"
            , SvgAttr.strokeLinejoin "round"
            , SvgAttr.d "M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            ]
            []
        ]


viewMenuItem text icon path =
    Html.li []
        [ Html.a
            [ Attr.href path
            , class "text-black hover:text-black hover:bg-pink-400 group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
            ]
            [ icon
            , Html.text text
            ]
        ]


viewActiveMenuItem text icon =
    Html.li []
        [ Html.a
            [ Attr.href "#"
            , class "bg-pink-100 text-black group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
            ]
            [ icon
            , Html.text text
            ]
        ]


viewSeparator : Html.Html msg
viewSeparator =
    Html.div
        [ class "h-6 w-px bg-gray-900/10 lg:hidden"
        , Attr.attribute "aria-hidden" "true"
        ]
        []


viewUserMenuButton : Model -> (Msg -> contentMsg) -> Html.Html contentMsg
viewUserMenuButton model toContentMsg =
    let
        image : String
        image =
            model.user
                |> Maybe.andThen .image
                |> Maybe.withDefault "./logo.png"

        userName : String
        userName =
            model.user
                |> Maybe.map (\user -> User.getUserName user)
                |> Maybe.withDefault "Unknown User"
    in
    Html.button
        [ Attr.type_ "button"
        , class "-m-1.5 flex items-center p-1.5"
        , Attr.id "user-menu-button"
        , Attr.attribute "aria-expanded" "false"
        , Attr.attribute "aria-haspopup" "true"
        , onClick <| toContentMsg UserMenuToggleClicked
        ]
        [ Html.span
            [ class "sr-only"
            ]
            [ Html.text "Open user menu" ]
        , Html.img
            [ class "h-8 w-8 rounded-full bg-gray-50"
            , Attr.src image
            , Attr.alt ""
            ]
            []
        , Html.span
            [ class "hidden lg:flex lg:items-center"
            ]
            [ Html.span
                [ class "ml-4 text-sm font-semibold leading-6 text-gray-900"
                , Attr.attribute "aria-hidden" "true"
                ]
                [ Html.text userName ]
            , svg
                [ SvgAttr.class "ml-2 h-5 w-5 text-gray-400"
                , SvgAttr.viewBox "0 0 20 20"
                , SvgAttr.fill "currentColor"
                , Attr.attribute "aria-hidden" "true"
                ]
                [ path
                    [ SvgAttr.fillRule "evenodd"
                    , SvgAttr.d "M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                    , SvgAttr.clipRule "evenodd"
                    ]
                    []
                ]
            ]
        ]


viewUserMenu : Model -> (Msg -> contentMsg) -> Html.Html contentMsg
viewUserMenu model toContentMsg =
    case model.isUserMenuOpen of
        True ->
            Html.div
                [ class "absolute right-0 z-10 mt-2.5 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none"
                , Attr.attribute "role" "menu"
                , Attr.attribute "aria-orientation" "vertical"
                , Attr.attribute "aria-labelledby" "user-menu-button"
                , Attr.tabindex -1
                ]
                [ {- Active: "bg-gray-50", Not Active: "" -}
                  Html.a
                    [ Attr.href "#"
                    , class "block px-3 py-1 text-sm leading-6 text-gray-900"
                    , Attr.attribute "role" "menuitem"
                    , Attr.tabindex -1
                    , Attr.id "user-menu-item-0"
                    , onClick <| toContentMsg GoToProfileClicked
                    ]
                    [ Html.text "Your profile" ]
                , case model.user of
                    Just _ ->
                        Html.a
                            [ Attr.href "#"
                            , class "block px-3 py-1 text-sm leading-6 text-gray-900"
                            , Attr.attribute "role" "menuitem"
                            , Attr.tabindex -1
                            , Attr.id "user-menu-item-1"
                            , onClick <| toContentMsg SignOutClicked
                            ]
                            [ Html.text "Sign out" ]

                    Nothing ->
                        Html.a
                            [ Attr.href "#"
                            , class "block px-3 py-1 text-sm leading-6 text-gray-900"
                            , Attr.attribute "role" "menuitem"
                            , Attr.tabindex -1
                            , Attr.id "user-menu-item-1"
                            , onClick <| toContentMsg SignInClicked
                            ]
                            [ Html.text "Sign in" ]
                ]

        False ->
            Html.div [] []


viewMenuItems : List (Html.Html msg)
viewMenuItems =
    [ viewActiveMenuItem "Dashboard" viewHomeIcon
    , viewMenuItem "Team" viewTeamIcon "/"
    ]


viewMobileSidebar : Model -> List (Html.Html contentMsg) -> (Msg -> contentMsg) -> Html.Html contentMsg
viewMobileSidebar model menuItems toContentMsg =
    Html.div
        [ class <|
            "relative z-50 lg:hidden "
                ++ (case model.isMobileSidebarOpen of
                        True ->
                            ""

                        False ->
                            "hidden"
                   )
        , Attr.attribute "role" "dialog"
        , Attr.attribute "aria-modal"
            (case model.isMobileSidebarOpen of
                True ->
                    "true"

                False ->
                    "false"
            )
        ]
        [ {-
             Off-canvas menu backdrop, show/hide based on off-canvas menu state.

             Entering: "transition-opacity ease-linear duration-300"
               From: "opacity-0"
               To: "opacity-100"
             Leaving: "transition-opacity ease-linear duration-300"
               From: "opacity-100"
               To: "opacity-0"
          -}
          Html.div
            [ class "fixed inset-0 bg-gray-900/80"
            ]
            []
        , Html.div
            [ class "fixed inset-0 flex"
            ]
            [ Html.div
                [ class "relative mr-16 flex w-full max-w-xs flex-1"
                ]
                [ Html.div
                    [ class "absolute left-full top-0 flex w-16 justify-center pt-5"
                    ]
                    [ Html.button
                        [ Attr.type_ "button"
                        , class "-m-2.5 p-2.5"
                        , onClick <| toContentMsg SidebarCloseClicked
                        ]
                        [ Html.span
                            [ class "sr-only"
                            ]
                            [ Html.text "Close sidebar" ]
                        , svg
                            [ SvgAttr.class "h-6 w-6 text-white"
                            , SvgAttr.fill "none"
                            , SvgAttr.viewBox "0 0 24 24"
                            , SvgAttr.strokeWidth "1.5"
                            , SvgAttr.stroke "currentColor"
                            , Attr.attribute "aria-hidden" "true"
                            ]
                            [ path
                                [ SvgAttr.strokeLinecap "round"
                                , SvgAttr.strokeLinejoin "round"
                                , SvgAttr.d "M6 18L18 6M6 6l12 12"
                                ]
                                []
                            ]
                        ]
                    ]
                , {- Sidebar component, swap this element with another sidebar if you like -}
                  Html.div
                    [ class "flex grow flex-col gap-y-5 overflow-y-auto bg-pink-300 px-6 pb-4 rounded-r-2xl"
                    ]
                    [ Html.div
                        [ class "flex h-16 shrink-0 items-center"
                        ]
                        [ Html.img
                            [ class "h-12 w-auto"
                            , Attr.src "/logo.png"
                            , Attr.alt "Lists Pink Unicorn"
                            ]
                            []
                        ]
                    , Html.nav
                        [ class "flex flex-1 flex-col"
                        ]
                        [ Html.ul
                            [ Attr.attribute "role" "list"
                            , class "flex flex-1 flex-col gap-y-7"
                            ]
                            [ Html.li []
                                [ Html.ul
                                    [ Attr.attribute "role" "list"
                                    , class "-mx-2 space-y-1"
                                    , onClick (toContentMsg (NavigateTo Route.Path.Home_))
                                    ]
                                    menuItems
                                ]
                            , Html.li
                                [ class "mt-auto"
                                ]
                                [ viewMenuItem "Settings" viewSettingsIcon (Route.Path.Settings |> Route.Path.toString)
                                ]
                            ]
                        ]
                    ]
                ]
            ]
        ]


viewDesktopSidebar : Model -> List (Html.Html contentMsg) -> (Msg -> contentMsg) -> Html.Html contentMsg
viewDesktopSidebar mode menuItems toContentMsg =
    Html.div
        [ class "hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col"
        ]
        [ {- Sidebar component, swap this element with another sidebar if you like -}
          Html.div
            [ class "flex grow flex-col gap-y-5 overflow-y-auto bg-pink-300 px-6 pb-4"
            ]
            [ Html.div
                [ class "flex h-16 shrink-0 items-center"
                ]
                [ Html.img
                    [ class "h-12 w-auto"
                    , Attr.src "/logo.png"
                    , Attr.alt "Lists Pink Unicorn"
                    ]
                    []
                ]
            , Html.nav
                [ class "flex flex-1 flex-col"
                ]
                [ Html.ul
                    [ Attr.attribute "role" "list"
                    , class "flex flex-1 flex-col gap-y-7"
                    ]
                    [ Html.li []
                        [ Html.ul
                            [ Attr.attribute "role" "list"
                            , class "-mx-2 space-y-1"
                            ]
                            menuItems
                        ]
                    , Html.li
                        [ class "mt-auto"
                        ]
                        [ viewMenuItem "Settings" viewSettingsIcon (Route.Path.Settings |> Route.Path.toString)
                        ]
                    ]
                ]
            ]
        ]


viewFooter : Bool -> Html.Html msg
viewFooter isVisible =
    if isVisible then
        Html.div
            [ class "visible md:invisible mt-auto  z-40 flex h-16 md:h-0 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-pink-200 px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8"
            ]
            [ Html.text "Footer" ]

    else
        Html.div [] []


view : { toContentMsg : Msg -> contentMsg, content : View contentMsg, model : Model } -> View contentMsg
view { toContentMsg, model, content } =
    { title = content.title
    , body =
        [ Html.div
            [ class "flex overflow-hidden"
            ]
            [ {- Off-canvas menu for mobile, show/hide based on off-canvas menu state. -} viewMobileSidebar model viewMenuItems toContentMsg
            , {- Static sidebar for desktop -} viewDesktopSidebar model viewMenuItems toContentMsg
            , Html.div
                [ class "lg:pl-72 flex flex-col h-screen w-0 flex-1 overflow-hidden"
                ]
                [ Html.div
                    [ class "sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-pink-200 px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8"
                    ]
                    [ Html.button
                        [ Attr.type_ "button"
                        , onClick <| toContentMsg SidebarOpenClicked
                        , class "-m-2.5 p-2.5 text-gray-700 lg:hidden"
                        ]
                        [ Html.span
                            [ class "sr-only"
                            ]
                            [ Html.text "Open sidebar" ]
                        , svg
                            [ SvgAttr.class "h-6 w-6"
                            , SvgAttr.fill "none"
                            , SvgAttr.viewBox "0 0 24 24"
                            , SvgAttr.strokeWidth "1.5"
                            , SvgAttr.stroke "currentColor"
                            , Attr.attribute "aria-hidden" "true"
                            ]
                            [ path
                                [ SvgAttr.strokeLinecap "round"
                                , SvgAttr.strokeLinejoin "round"
                                , SvgAttr.d "M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                                ]
                                []
                            ]
                        ]
                    , {- Separator -} viewSeparator
                    , Html.div
                        [ class "flex flex-1 gap-x-4 self-stretch lg:gap-x-6 justify-end"
                        ]
                        [ Html.div
                            [ class "flex items-center gap-x-4 lg:gap-x-6"
                            ]
                            [ {- Profile dropdown -}
                              Html.div
                                [ class "relative"
                                ]
                                [ viewUserMenuButton model toContentMsg
                                , viewUserMenu model toContentMsg
                                ]
                            ]
                        ]
                    ]
                , Html.main_
                    [ class "py-4 sm:py-6 h-auto flex-grow overflow-y-auto"
                    ]
                    [ Html.div
                        [ class "px-4 sm:px-6 lg:px-8"
                        ]
                        content.body
                    ]
                , viewFooter False
                ]
            ]
        ]
    }
