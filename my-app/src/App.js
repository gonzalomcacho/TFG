import './App.css';

import { Route, Routes } from "react-router-dom";

import NoMatch from "./components/NoMatch.js";
import HomePageScreen from "./components/HomePageScreen";
import JobDescription from "./components/JobDescription";
import JobDescriptionUpload from "./components/JobDescriptionUpload";
import JobDescriptionQuestionnaire from "./components/JobDescriptionQuestionnaire";
import JobDescriptionResults from "./components/JobDescriptionResults";
import Analysis from "./components/Analysis";
import Interview from "./components/Interview";
import CVMultiUpload from "./components/CVMultiUpload";
import MultiAnalysis from "./components/MultiAnalysis";
import Header from './components/Header';

function App() {

  return (
    <div className="App">
      <Header className ="header"/>
        <Routes>
          <Route path="/" element={<HomePageScreen/>} />
          <Route path="/JobDescription" element={<JobDescription/>} />
          <Route path="/JobDescription/upload" element={<JobDescriptionUpload/>} />
          <Route path="/JobDescription/questionnaire" element={<JobDescriptionQuestionnaire/>} />
          <Route path="/JobDescription/results" element={<JobDescriptionResults/>} />
          <Route path="/Analysis" element={<Analysis/>} />
          <Route path="/Interview" element={<Interview />} />
          <Route path="/CVMultiUpload" element={<CVMultiUpload />} />
          <Route path="/MultiAnalysis" element={<MultiAnalysis />} />
          <Route path="*" element={<NoMatch />} />
        </Routes>
    </div>
  );
}

export default App;
