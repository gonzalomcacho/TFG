import { useLocation, useNavigate } from "react-router-dom"; // Importa `useLocation` para acceder a datos de navegación y `useNavigate` para redirigir a otras rutas.
import React, { useEffect } from "react"; // Importa React y el hook `useEffect` para manejar efectos secundarios.

/**
 * Componente: Analysis
 * Propósito: Este componente muestra un análisis detallado de un candidato en relación con un puesto de trabajo.
 * Qué hace:
 * - Recibe datos del análisis desde el estado de navegación.
 * - Muestra el resumen del CV, ajuste al puesto, fortalezas, debilidades y recomendaciones.
 * - Proporciona opciones para volver al análisis múltiple o crear una entrevista personalizada.
 */

export default function Analysis() {
  const location = useLocation(); // Obtiene datos pasados al componente mediante navegación.
  const navigate = useNavigate(); // Redirige a otras rutas dentro de la aplicación.

  // Variables que almacenan datos pasados desde MultiAnalysis.js o rutas previas.
  const candidateAnalysis = location.state?.candidateAnalysis; // Análisis del candidato.
  const totalScore = location.state?.totalScore; // Puntuación total del candidato.
  const fileName = location.state?.fileName; // Nombre del archivo del CV.
  const jobAnalysis = location.state?.jobAnalysis; // Análisis del puesto de trabajo.
  const anonymizedCV = location.state?.anonymizedCV; // CV anonimizado del candidato.
  const originalCV = location.state?.originalCV; // CV original del candidato.

  /**
   * useEffect
   * Llamada por: Render inicial del componente.
   * Propósito: Asegura que la página comience en la parte superior al renderizar.
   */
  useEffect(() => {
    window.scrollTo(0, 0); // Desplaza la página al inicio.
  }, []);

  /**
   * handleBackToMultiAnalysis
   * Llamada por: Botón "Back to Multi Analysis".
   * Input: Ninguno.
   * Output: Navega de vuelta a la página de análisis múltiple.
   */
  const handleBackToMultiAnalysis = () => {
    navigate("/MultiAnalysis");
  };

  /**
   * handleCreateInterview
   * Llamada por: Botón "Want to create a personalized interview for the candidate?".
   * Input: Ninguno.
   * Output: Navega a la página de creación de entrevista con los datos del análisis actual.
   * Manejo de errores: Muestra una alerta si los datos del análisis no están disponibles.
   */
  const handleCreateInterview = () => {
    if (!candidateAnalysis) {
      alert("Missing data to create the interview. Please try again.");
      return;
    }

    navigate("/Interview", {
      state: {
        jobAnalysis, // Datos del análisis del trabajo.
        anonymizedCV, // CV anonimizado.
        originalCV, // CV original.
        fileName,
        candidateAnalysis,
        totalScore,
      },
    });
  };

  // Verifica si no hay datos de análisis del candidato, mostrando un mensaje de error en ese caso.
  if (!candidateAnalysis) {
    return(        
    <div className="container">
      <h1>Error</h1>
      <p className="error-text" >No candidate analysis data provided.</p>;
    </div>
    );  
  }

  return (
    <div id="analysis-container">
      <h1 className="analysis-title">Candidate Analysis</h1>
      <p><strong>File Name:</strong> {fileName}</p>

      <h2 className="analysis-subtitle">Analysis Results</h2>

      <div className="horizontal-info-cards">
        <div className="info-card">
          <h4>Job Title</h4>
          <p>{candidateAnalysis.jobTitle}</p>
        </div>
        <div className="info-card">
          <h4>Total Score</h4>
          <p>{totalScore}/10</p>
        </div>
      </div>

      <section className="analysis-section">
        <h4>Resume Summary</h4>
        <div className="analysis-card">
          <p><strong>Key Skills:</strong> {candidateAnalysis.summary.keySkills.join(", ")}</p>
          <p><strong>Relevant Experience:</strong> {candidateAnalysis.summary.relevantExperience}</p>
          <p><strong>Education:</strong> {candidateAnalysis.summary.education}</p>
          <p><strong>Other:</strong> {candidateAnalysis.summary.other.join(", ")}</p>
        </div>
      </section>

      <section className="analysis-section">
        <h4>Job Fit</h4>
        <div className="card-group">
          <div className="analysis-card">
            <h5>Technical Competencies</h5>
            <p><strong>Skills:</strong> {candidateAnalysis.jobFit.technicalSkills.keySkills.join(", ")}</p>
            <p><em>{candidateAnalysis.jobFit.technicalSkills.justification}</em></p>
          </div>
          <div className="analysis-card">
            <h5>Interpersonal Competencies</h5>
            <p><strong>Skills:</strong> {candidateAnalysis.jobFit.interpersonalSkills.keySkills.join(", ")}</p>
            <p><em>{candidateAnalysis.jobFit.interpersonalSkills.justification}</em></p>
          </div>
        </div>
      </section>

      <section className="analysis-section">
        <h4>Strengths and Areas for Improvement</h4>
        <div className="analysis-card">
          <p><strong>Strengths:</strong> {candidateAnalysis.strengthsAndWeaknesses.strengths.join(", ")}</p>
          <p><strong>Areas for Improvement:</strong> {candidateAnalysis.strengthsAndWeaknesses.areasForImprovement.join(", ")}</p>
        </div>
      </section>

      <section className="analysis-section">
        <h4>Detailed Scores</h4>
        <div className="card-group">
          {Object.entries(candidateAnalysis.evaluationScores).map(([category, { score, justification }]) => (
            <div key={category} className="analysis-card">
              <h5>{category.replace(/([A-Z])/g, " $1").trim().split(" ").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")}</h5>
              <p><strong>Score:</strong> {score}/10</p>
              <p><em>Justification:</em> {justification}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="analysis-section">
        <h4>Recommendations</h4>
        <div className="analysis-card">
          <p><strong>For the Candidate:</strong> {candidateAnalysis.recommendations.candidate}</p>
          <p><strong>For the Recruiter:</strong> {candidateAnalysis.recommendations.recruiter}</p>
        </div>
      </section>

        <button className="button button-blue" onClick={handleBackToMultiAnalysis}> Back to Multi Analysis </button>
        <button className="button button-blue" onClick={handleCreateInterview}> Want to create a personalized interview for the candidate? </button>
    </div>
  );
};
