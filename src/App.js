import React, { useState, useReducer } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

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

// Context
import ExampleContext from "./ExampleContext";

// Set the domain (beginning portion) for all axios request
import Axios from "axios"
Axios.defaults.baseURL = 'http://localhost:8080'

function App() {
  // initial value for useReducer state
  const initialState = {
    loggedIn: Boolean(sessionStorage.getItem("token")),
    flashMessages: []
  }

  function ourReducer(state, action) {
    switch (action.type) {
      case "login":
        return { loggedIn: true, flashMessages: state.flashMessages }
      case "logout":
        return { loggedIn: false, flashMessages: state.flashMessages }
      case "flashMessage":
        return { loggedIn: state.login, flashMessages: state.flashMessages.concat(action.value) }
    }
  }
  // useReducer
  const [state, dispatch] = useReducer(ourReducer, initialState)

  // Global State (useState)
  const [loggedIn, setLoggedIn] = useState(Boolean(sessionStorage.getItem("token")))
  const [flashMessages, setFlashMessages] = useState([])

  const addFlashMessage = (msg) => {
    setFlashMessages(prev => prev.concat(msg))
  }

  return (
    <ExampleContext.Provider value={{ addFlashMessage, setLoggedIn }}>
      <BrowserRouter>
        <FlashMessages messages={flashMessages} />
        <Header loggedIn={loggedIn} />

        <Routes>
          <Route path="/" element={<Navigate to="/home" />} /> {/*Redirect to homepage for this route*/}
          <Route path="/home" element={loggedIn ? <Home /> : <HomeGuest />} />
          <Route path="/about-us" element={<About />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/create-post" element={<CreatePost />} />
          <Route path="/post/:id" element={<ViewSinglePost />} />
        </Routes>

        <Footer />
      </BrowserRouter>
    </ExampleContext.Provider>
  );
}

export default App;
