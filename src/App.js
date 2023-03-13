import React, { useEffect, useReducer } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { CSSTransition } from "react-transition-group";

import './App.css';

// Components
import Header from './components/Header';
import HomeGuest from './components/HomeGuest';
import Home from "./components/Home";
import Footer from './components/Footer';
import About from './components/About';
import Terms from './components/Terms';
import CreatePost from "./components/CreatePost";
import ViewSinglePost from "./components/ViewSinglePost";
import FlashMessages from "./components/FlashMessages";
import Profile from "./components/Profile";
import EditPost from "./components/EditPost";
import NotFound from "./components/NotFound";
import Search from "./components/Search";
import Chat from "./components/Chat";

// Context
import StateContext from "./StateContext";
import DispatchContext from "./DispatchContext";

// Set the domain (beginning portion) for all axios request
import Axios from "axios"
Axios.defaults.baseURL = 'http://localhost:8080'

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
    isSearchOpen: false
  }

  function ourReducer(state, action) {
    switch (action.type) {
      case "login":
        return {
          loggedIn: true,
          flashMessages: state.flashMessages,
          user: action.data
        }
      case "logout":
        return { loggedIn: false, flashMessages: state.flashMessages }
      case "flashMessage":
        return { loggedIn: state.login, flashMessages: state.flashMessages.concat(action.value) }
      case "openSearch":
        return { ...state, ...state.isSearchOpen = true }
      case "closeSearch":
        return { ...state, ...state.isSearchOpen = false }
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

  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>

        <BrowserRouter>
          <FlashMessages messages={state.flashMessages} />
          <Header />

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

          {/* {state.isSearchOpen ? <Search />: ''} */}
          <CSSTransition timeout={330} in={state.isSearchOpen} classNames="search-overlay" unmountOnExit>
            <Search />
          </CSSTransition>

          <Chat />

          <Footer />
        </BrowserRouter>

      </DispatchContext.Provider>
    </StateContext.Provider>

  );
}

export default App;
