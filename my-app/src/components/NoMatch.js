export default function NoMatch() {

  return (
    <div className="container">
        <h1>Error 404: Page Not Found</h1>
        <p >Route Not Found</p>
        <button className="button button-blue" onClick={() =>  window.history.back()}>Go Back</button>
    </div>
  );
}
