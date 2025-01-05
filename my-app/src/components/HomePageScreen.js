import { useNavigate } from 'react-router-dom';

export default function HomePageScreen() {

  const navigate = useNavigate();

  return (
    <div className="HomePage">
      <header className="container">
          <h1>Welcome to CV Analyzer</h1>
          <p>
 QUIERO VER SI ESTO FUNCIONA           </p>
         <button className="App-button-blue" onClick={() => {navigate("/JobDescription");}}>
            Get Started
          </button>
        </header>
    </div>
  );
}
