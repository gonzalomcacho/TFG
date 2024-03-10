import './App.css';

import { useState } from "react";
import { Route, Routes } from "react-router-dom";

import NoMatch from "./components/NoMatch.js";
import HomePageScreen from "./components/HomePageScreen";
import JobDescription from "./components/JobDescription";
import JobDescriptionUpload from "./components/JobDescriptionUpload";
import CvUpload from "./components/CvUpload";

function App() {

  return (
    <div className="App">
          <Routes>
            <Route path="/" element={<HomePageScreen/>} />
            <Route path="/JobDescription" element={<JobDescription/>} />
            <Route path="/JobDescriptionUpload" element={<JobDescriptionUpload/>} />
            <Route path="/CvUpload" element={<CvUpload/>} />
            <Route path="*" element={<NoMatch />} />
          </Routes>
    </div>
  );
}

export default App;
