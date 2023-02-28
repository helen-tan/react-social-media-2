import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import './App.css';

// Components
import Header from './components/Header';
import HomeGuest from './components/HomeGuest';
import Footer from './components/Footer';
import About from './components/About';
import Terms from './components/Terms';

function App() {
  return (
    <BrowserRouter>
      <Header />

      <Routes>
        <Route path="/" element={<Navigate to="/home" />} /> {/*Redirect to homepage for this route*/}
        <Route path="/home" element={<HomeGuest />} />
        <Route path="/about-us" element={<About />} />
        <Route path="/terms" element={<Terms />} />
      </Routes>

      <Footer />
    </BrowserRouter>
  );
}

export default App;
