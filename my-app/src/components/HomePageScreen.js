import { useNavigate } from 'react-router-dom';

export default function HomePageScreen() {

  const navigate = useNavigate();

  return (
    <div className="HomePage">
      <header className="container">
          <h1>Welcome to CV Analyzer</h1>
          <p>
            Simplify your recruitment process with intelligent CV analysis.
          </p>
         <button className="App-button-blue" onClick={() => {navigate("/JobDescription");}}>
            Get Started
          </button>
        </header>
    </div>
  );
}
