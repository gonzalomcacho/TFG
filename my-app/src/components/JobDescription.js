import { useNavigate } from 'react-router-dom';
import './JobDescription.css';

function JobDescription() {
  const navigate = useNavigate();

  return (
    <div className="JobDescription-container">
      <h1>Job Description Setup</h1>
      <p>Do you already have a job description in PDF format, or do you prefer to create a new one through an AI-assisted interview process?</p>
      
      <div className="options-container">
        <button onClick={() => {navigate("/JobDescriptionUpload");}}>Upload Job Description</button>
        <button onClick={() => {navigate("/CvUpload");}}>Create with AI Interview</button>
      </div>

    </div>
  );
}
//Falta por crear el camino del boton Create with AI Interview
export default JobDescription;
