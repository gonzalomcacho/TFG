import { useNavigate } from 'react-router-dom';
import './HomePageScreen.css';

export default function HomePageScreen() {

  const navigate = useNavigate();

  return (
    <div className="HomePage">
      <header className="HomePage-header">
          <h1>Welcome to CV Analyzer</h1>
          <p>
            Simplify your recruitment process with intelligent CV analysis.
          </p>
         <button className="App-button" onClick={() => {navigate("/FileUpload");}}>
            Get Started
          </button>
        </header>
    </div>
  );
}
