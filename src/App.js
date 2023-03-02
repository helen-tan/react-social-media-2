import React, { useState } from "react";
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

function App() {
  const [loggedIn, setLoggedIn] = useState(Boolean(sessionStorage.getItem("token")))

  return (
    <BrowserRouter>
      <Header loggedIn={loggedIn} setLoggedIn={setLoggedIn}/>

      <Routes>
        <Route path="/" element={<Navigate to="/home" />} /> {/*Redirect to homepage for this route*/}
        <Route path="/home" element={ loggedIn ? <Home /> : <HomeGuest /> } />
        <Route path="/about-us" element={<About />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/create-post" element={<CreatePost />}/>
      </Routes>

      <Footer />
    </BrowserRouter>
  );
}

export default App;
