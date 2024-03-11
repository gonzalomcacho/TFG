import { useNavigate } from 'react-router-dom';

function JobDescription() {
  const navigate = useNavigate();

  return (
    <div className="container">
      <h1>Job Description Setup</h1>
      <p>Do you already have a job description in PDF format, or do you prefer to create a new one through an AI-assisted interview process?</p>
      
      <div className="options-container">
        <button className="App-button-green" onClick={() => {navigate("/JobDescription/upload");}}>Upload Job Description</button>
        <button className="App-button-green" onClick={() => {navigate("/JobDescription/questionnaire");}}>Create with AI Interview</button>
      </div>

    </div>
  );
}
//Falta por crear el camino del boton Create with AI Interview
export default JobDescription;
