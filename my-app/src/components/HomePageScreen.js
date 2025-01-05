import React from "react"; // Importa React para usar JSX y componentes funcionales
import { useNavigate } from "react-router-dom"; // Importa `useNavigate` para redirigir a otras rutas de la aplicación

/**
 * Componente: HomePageScreen
 * Propósito: Este componente sirve como página de inicio para la aplicación CV Analyzer.
 * Qué hace: 
 * - Presenta información sobre las características y beneficios de la aplicación.
 * - Proporciona una introducción a los usuarios nuevos.
 * - Permite al usuario comenzar el flujo de uso limpiando el localStorage y redirigiéndolo a la configuración inicial.
 */

export default function HomePageScreen() {
  const navigate = useNavigate(); // Hook para redirigir a rutas específicas en la aplicación.

  /**
   * handleGetStarted
   * Llamada por: Botón "Get Started".
   * Input: Ninguno.
   * Output: Limpia el localStorage y redirige al usuario a la página de configuración.
   * Manejo de errores: No aplica ya que solo realiza dos operaciones simples.
   * Propósito: Inicializa el flujo de la aplicación al limpiar cualquier dato previo y redirigir al usuario.
   */
  const handleGetStarted = () => {
    localStorage.clear(); // Limpia cualquier dato de procesos anteriores del localStorage.
    navigate("/JobDescription"); // Redirige al usuario a la ruta de configuración inicial.
  };

  return (
    <div className="App">
      <div className="container">
        <header>
          <h1>Welcome to CV Analyzer</h1>
          <p>
            Simplify your recruitment process with intelligent tools for job description creation, CV analysis, and tailored interviews.
          </p>
        </header>

        <section>
          <h2>Why Use CV Analyzer?</h2>
          <ul className="description-content">
            <li>Generate detailed and professional job descriptions with ease.</li>
            <li>Analyze and rank candidate CVs based on your requirements.</li>
            <li>Create bias-free, anonymized CVs for fair evaluations.</li>
            <li>Generate personalized interview questions effortlessly.</li>
          </ul>
        </section>

        <section className="section">
          <h2>Understanding the Interface</h2>
          <p>
            The application will include a header that provides quick actions to manage your progress:
          </p>
          <ul className="description-content">
            <li><strong>Reset Progress:</strong> The Reset button <i>(top left)</i> clears all your progress and redirects you to the home page, allowing you to start fresh. Use it with caution, as all stored data will be deleted.</li>
            <li><strong>Copy Progress:</strong> The Copy Progress button <i>(top right)</i> lets you copy your current progress to the clipboard in a readable format.</li>
          </ul>
        </section>


        <section className="section">
          <h2>How It Works</h2>
          <ol className="description-content">
            <li> <strong>Create or Upload a Job Description:</strong> Start by uploading an existing description or let our AI generate one tailored to your needs. </li>
            <li> <strong>Upload Candidate CVs:</strong> Provide one or multiple CVs in PDF format for automated extraction and analysis. </li>
            <li> <strong>Analyze and Compare:</strong> The system evaluates candidates and highlights their strengths, weaknesses, and fit for the job. </li>
            <li> <strong>Prepare for Interviews:</strong> Generate personalized interview questions to find the perfect match for your role. </li>
          </ol>
        </section>

        

        <footer>
          <h3>Ready to start optimizing your recruitment process?</h3>
          <button className="button button-blue" onClick={handleGetStarted}> Get Started </button>
        </footer>
      </div>
    </div>
  );
}
