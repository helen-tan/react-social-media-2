import React, { useEffect, useReducer, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { CSSTransition } from "react-transition-group";

import './App.css';

// Components
import LoadingDotsIcon from "./components/LoadingDotsIcon";
import Header from './components/Header';
import HomeGuest from './components/HomeGuest';
import Home from "./components/Home";
import Footer from './components/Footer';
import About from './components/About';
import Terms from './components/Terms';
// Lazy Loaded this --> // import CreatePost from "./components/CreatePost";
// Lazy Loaded this --> // import ViewSinglePost from "./components/ViewSinglePost";
import FlashMessages from "./components/FlashMessages";
import Profile from "./components/Profile";
import EditPost from "./components/EditPost";
import NotFound from "./components/NotFound";
// Lazy Loaded this --> // import Search from "./components/Search";
// Lazy Loaded this --> // import Chat from "./components/Chat";

// Context
import StateContext from "./StateContext";
import DispatchContext from "./DispatchContext";

import Axios from "axios"
// Set the domain (beginning portion) for all axios request
Axios.defaults.baseURL = process.env.REACT_APP_BACKEND_URL || ""

// Lazy Loading
const CreatePost = React.lazy(() => import("./components/CreatePost"));
const ViewSinglePost = React.lazy(() => import("./components/ViewSinglePost"))
const Search = React.lazy(() => import("./components/Search"))
const Chat = React.lazy(() => import("./components/Chat"))

function App() {

  // initial value for useReducer state
  const initialState = {
    loggedIn: Boolean(sessionStorage.getItem("token")),
    flashMessages: [],
    user: {
      token: sessionStorage.getItem("token"),
      avatar: sessionStorage.getItem("avatar"),
      username: sessionStorage.getItem("username")
    },
    isSearchOpen: false,
    isChatOpen: false,
    unreadChatCount: 0
  }

  function ourReducer(state, action) {
    switch (action.type) {
      case "login":
        return {
          ...state,
          loggedIn: true,
          flashMessages: state.flashMessages,
          user: action.data
        }
      case "logout":
        return { ...state, ...state.loggedIn = false, ...state.flashMessages = state.flashMessages }
      case "flashMessage":
        return { ...state, loggedIn: state.login, flashMessages: state.flashMessages.concat(action.value) }
      case "openSearch":
        return { ...state, ...state.isSearchOpen = true }
      case "closeSearch":
        return { ...state, ...state.isSearchOpen = false }
      case "toggleChat":
        return { ...state, ...state.isChatOpen = !state.isChatOpen }
      case "closeChat":
        return { ...state, ...state.isChatOpen = false }
      case "incrementUnreadChatCount":
        return { ...state, ...state.unreadChatCount++ }
      case "clearUnreadChatCount":
        return { ...state, ...state.unreadChatCount = 0 }
    }
  }
  // useReducer
  const [state, dispatch] = useReducer(ourReducer, initialState)


  useEffect(() => {
    if (state.loggedIn) {
      sessionStorage.setItem("token", state.user.token)
      sessionStorage.setItem("avatar", state.user.avatar)
      sessionStorage.setItem("username", state.user.username)

    } else {
      sessionStorage.removeItem("token")
      sessionStorage.removeItem("avatar")
      sessionStorage.removeItem("username")
    }
  }, [state.loggedIn])

  // Global State (useState) - handled by Reducer now
  // const [loggedIn, setLoggedIn] = useState(Boolean(sessionStorage.getItem("token")))
  // const [flashMessages, setFlashMessages] = useState([])

  // function handled by Reducer
  // const addFlashMessage = (msg) => {
  //   setFlashMessages(prev => prev.concat(msg))
  // }

  // Check if token has expired or not on first render
  useEffect(() => {
    // so that this won't run when component first renders
    if (state.loggedIn) {
      const ourRequest = Axios.CancelToken.source() // create cancel token to cancel req if component unmounts in the middle of the req

      async function fetchResults() {
        try {
          const response = await Axios.post('/checkToken', { token: state.user.token }, { cancelToken: ourRequest.token })
          // console.log(response.data)
          // If false, means token not valid
          if (!response.data) {
            dispatch({ type: "logout" })
            dispatch({ type: "flashMessage", value: "Your session has expired. Please log in again." })
          }
        } catch (err) {
          console.log("There was a problem or the request was cancelled.")
        }
      }
      fetchResults()

      return () => ourRequest.cancel()
    }
  }, [])

  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>

        <BrowserRouter>
          <FlashMessages messages={state.flashMessages} />
          <Header />
          
          <Suspense fallback={<LoadingDotsIcon />}>  {/* Any component wrapped in Suspense can be lazy loaded */}
            <Routes>
              <Route path="/" element={<Navigate to="/home" />} /> {/*Redirect to homepage for this route*/}
              <Route path="/home" element={state.loggedIn ? <Home /> : <HomeGuest />} />
              <Route path="/about-us" element={<About />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/create-post" element={<CreatePost />} />
              <Route path="/post/:id" element={<ViewSinglePost />} />
              <Route path="/post/:id/edit" element={<EditPost />} />
              <Route path="/profile/:username/*" element={<Profile />} />

              {/* Catch all */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>

          {/* {state.isSearchOpen ? <Search />: ''} */}
          {/* Lazy Loading Search (nested in CSSTransition) */}
          {/* <CSSTransition timeout={330} in={state.isSearchOpen} classNames="search-overlay" unmountOnExit>
            <Search />
          </CSSTransition> */}
          <CSSTransition timeout={330} in={state.isSearchOpen} classNames="search-overlay" unmountOnExit>
            <div className="search-overlay">
              <Suspense fallback="">
                <Search />
              </Suspense>
            </div>
          </CSSTransition>

          <Suspense fallback="">
            {state.loggedIn && <Chat />}
          </Suspense>

          <Footer />
        </BrowserRouter>

      </DispatchContext.Provider>
    </StateContext.Provider>

  );
}

export default App;
