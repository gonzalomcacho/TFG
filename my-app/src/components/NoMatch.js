import './NoMatch.css';

export default function NoMatch() {

  return (
    <div className="NoMatch">
        <h1>Error 404: Página no encontrada</h1>
        <p id="info">Ruta no encontrada</p>
        <button className="App-button" onClick={() =>  window.history.back()}>Go Back</button>
    </div>
  );
}
