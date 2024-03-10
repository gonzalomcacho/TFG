export default function NoMatch() {

  return (
    <div className="container">
        <h1>Error 404: Página no encontrada</h1>
        <p id="info">Ruta no encontrada</p>
        <button className="App-button-blue" onClick={() =>  window.history.back()}>Go Back</button>
    </div>
  );
}
