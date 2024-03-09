import './App.css';

import { useState } from "react";
import { Route, Routes } from "react-router-dom";

import NoMatch from "./components/NoMatch.js";
import HomePageScreen from "./components/HomePageScreen";
import FileUpload from "./components/FileUpload";

function App() {

  return (
    <div className="App">
          <Routes>
            <Route path="/" element={<HomePageScreen/>} />
            <Route path="/FileUpload" element={<FileUpload/>} />
            <Route path="*" element={<NoMatch />} />
          </Routes>
    </div>
  );
}

export default App;
