import React, { useState, useEffect, useRef } from "react"; // Importa React y hooks: `useState` para gestionar estados, `useEffect` para efectos secundarios, y `useRef` para referencias persistentes.
import { useNavigate } from "react-router-dom"; // Importa `useNavigate` para redirigir a otras rutas.
import calculateScores from "./tools/ScoreCalculator"; // Importa `calculateScores` para calcular puntuaciones totales de candidatos.
import { analyzeJobDescription, analyzeCandidateCV, anonymizeCV } from "./tools/api"; // API para analizar descripciones de trabajo, CVs de candidatos y anonimizar CVs.
import JobResultTester from "./tools/FormatTesters/JobResultTester"; // Valida resultados del análisis de descripciones de trabajo.
import CandidateResultTester from "./tools/FormatTesters/CandidateResultTester"; // Valida resultados del análisis de candidatos.

/**
 * Componente: MultiAnalysis
 * Propósito: Analizar múltiples CVs en relación con una descripción de trabajo, mostrando los mejores candidatos.
 * Qué hace:
 * - Recupera datos de navegación o almacenamiento local.
 * - Analiza la descripción de trabajo y los CVs de candidatos.
 * - Calcula puntuaciones, valida resultados y almacena análisis.
 * - Presenta a los mejores candidatos y los restantes con opciones de análisis detallado.
 */

export default function MultiAnalysis() {
  const navigate = useNavigate();

  // Recupera datos de `localStorage` si están disponibles
  const storedJobDescription = localStorage.getItem("jobDescriptionTextForAI");
  const storedCandidateCVs = JSON.parse(localStorage.getItem("candidatesCVs"));

  const [jobDescription, setJobDescription] = useState(storedJobDescription || "");
  const [candidateCVs, setCandidateCVs] = useState(storedCandidateCVs || []);
  const [jobAnalysis, setJobAnalysis] = useState(null);
  const [analysisResults, setAnalysisResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const hasAnalyzed = useRef(false);


    /**
   * useEffect
   * Llamada al render inicial
   * Verifica si los datos necesarios están disponibles y, si no, muestra un error.
   * Si no se ha realizado un análisis previo, lo inicia.
   */
    useEffect(() => {
      if (!jobDescription || candidateCVs.length === 0) {
        setError("Missing job description or candidate CVs. Please ensure all data is uploaded.");
        return;
      }
    
      // Comprobar si los datos ya están en localStorage
      const storedJobAnalysis = JSON.parse(localStorage.getItem("jobAnalysisDoneByAI"));
      const storedCandidateAnalysis = JSON.parse(localStorage.getItem("candidatesInformation&AnalysisDoneByAI"));
    
      if (storedJobAnalysis && storedCandidateAnalysis) {
        // Utilizar datos de localStorage si existen
        setJobAnalysis(storedJobAnalysis);
        setAnalysisResults(storedCandidateAnalysis);
        hasAnalyzed.current = true;
      } else if (!hasAnalyzed.current) {
        // Si no existen datos en localStorage, realizar análisis
        hasAnalyzed.current = true;
        analyzeData();
      }
    }, [jobDescription, candidateCVs]);

  
  /**
   * analyzeData
   * Llamada por: Efecto inicial si hay datos disponibles.
   * Propósito:
   * - Analiza la descripción de trabajo.
   * - Anonimiza y analiza los CVs de candidatos.
   * - Calcula puntuaciones y valida resultados.
   * Manejo de errores: Muestra mensajes si la validación falla o si ocurre un problema con la API.
   */
  const analyzeData = async () => {
    setLoading(true);
    setError(null);
    try {
      const jobResult = await analyzeJobDescription(jobDescription);
      const jobValidation = JobResultTester.validateJobResult(jobResult);

      if (!jobValidation.isValid) {
        throw new Error(`Error in job result validation: ${jobValidation.errors.join(", ")}`);
      }

      setJobAnalysis(jobResult);
      localStorage.setItem("jobAnalysisDoneByAI", JSON.stringify(jobResult));

      const resultsTemp = [];
      for (const cv of candidateCVs) {
        const anonymized = await anonymizeCV(cv.text);
        const anonymizedText = anonymized.anonymizedCV;

        const candidateResult = await analyzeCandidateCV(jobResult, anonymizedText);
        const candidateValidation = CandidateResultTester.validateCandidateResult(candidateResult);
        if (!candidateValidation.isValid) {
          throw new Error(`Error in candidate result validation: (${cv.fileName}): ${candidateValidation.errors.join(", ")}`);
        }

        const totalScore = calculateScores(candidateResult);
        resultsTemp.push({ fileName: cv.fileName, originalCV: cv.text, anonymizedCV: anonymizedText, candidateAnalysis: candidateResult, totalScore });
      }

      setAnalysisResults(resultsTemp);
      localStorage.setItem("candidatesInformation&AnalysisDoneByAI", JSON.stringify(resultsTemp));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  /**
   * getTopThreeCandidates
   * Llamada por: Asigna `topThreeCandidates` al render.
   * Output: Devuelve una lista con los tres candidatos con mejores puntuaciones.
   */
  const getTopThreeCandidates = () => {
    return [...analysisResults].sort((a, b) => b.totalScore - a.totalScore).slice(0, 3);
  };

  /**
   * getRemainingCandidates
   * Llamada por: Asigna `remainingCandidates` al render.
   * Output: Devuelve una lista de candidatos restantes ordenados por puntuación.
   */
  const getRemainingCandidates = () => {
    return [...analysisResults].sort((a, b) => b.totalScore - a.totalScore).slice(3);
  };

  /**
   * handleNavigate
   * Llamada por: Botones de análisis detallado en cada candidato.
   * Input: Candidato y análisis de trabajo.
   * Output: Redirige a la página de análisis detallado con datos específicos.
   */
  const handleNavigate = (candidate, jobAnalysis) => {
    navigate("/analysis", { state: { candidateAnalysis: candidate.candidateAnalysis, totalScore: candidate.totalScore, fileName: candidate.fileName, jobAnalysis, anonymizedCV: candidate.anonymizedCV, originalCV: candidate.originalCV } });
  };

  /**
 * renderTopThreeCandidates
 * Llamada por: Asignada al render para mostrar los tres mejores candidatos.
 * Input: `topThreeCandidates` - Lista de los tres candidatos con mejores puntuaciones.
 * Output: Devuelve un JSX que muestra los candidatos con formato distintivo, destacando sus posiciones.
 * Propósito:
 * - Renderizar los tres mejores candidatos con estilos personalizados basados en su ranking.
 * - Proporcionar un botón para navegar al análisis detallado de cada candidato.
 * Detalles:
 * - Los colores asignados son específicos del ranking (oro, plata, bronce).
 * - El texto cambia de color según el índice para asegurar contraste.
 * - Incluye el archivo del candidato y su puntuación total.
 * Manejo de eventos: 
 * - El botón "In-Depth Analysis" llama a `handleNavigate` para redirigir al análisis detallado del candidato.
 */
const renderTopThreeCandidates = (topThreeCandidates) => {
  return topThreeCandidates.map((candidate, index) => {
    const colors = ["#e3bf09", "silver", "#cd7f32"]; // Colores para las posiciones: oro, plata y bronce.
    const textColor = index === 1 ? "black" : "white"; // El texto de plata tiene color negro para mejor contraste.

    return (
      <div
        key={index}
        className="top-three-card"
        style={{
          backgroundColor: colors[index], // Fondo según el ranking.
          color: textColor, // Color del texto según contraste.
        }}
      >
        <h4>#{index + 1}</h4>
        <p>
          <strong>Candidate:</strong> {candidate.fileName}
        </p>
        <p>
          <strong>Total Score:</strong> {candidate.totalScore}/10
        </p>
        <button
          className="button button-details"
          style={{
            backgroundColor: textColor, // Fondo del botón igual al color del texto.
            color: colors[index], // Texto del botón igual al color del fondo del ranking.
          }}
          onClick={() => handleNavigate(candidate, jobAnalysis)} // Navega al análisis detallado del candidato.
        >
          In-Depth Analysis
        </button>
      </div>
    );
  });
};

/**
 * renderRemainingCandidates
 * Llamada por: Asignada al render para mostrar los candidatos restantes.
 * Input: `remainingCandidates` - Lista de candidatos que no están en el top tres.
 * Output: Devuelve un JSX que muestra los candidatos restantes con formato y colores según su puntuación.
 * Propósito:
 * - Renderizar los candidatos restantes con diferenciación visual basada en si aprobaron o fallaron.
 * - Proporcionar un botón para acceder al análisis detallado de cada candidato.
 * Detalles:
 * - Los candidatos con puntuaciones menores a 5 tienen estilos específicos para resaltar el fallo.
 * - Muestra el nombre del archivo del candidato y su puntuación total.
 * Manejo de eventos:
 * - El botón "In-Depth Analysis" llama a `handleNavigate` para redirigir al análisis detallado del candidato.
 */
const renderRemainingCandidates = (remainingCandidates) => {
  return remainingCandidates.map((candidate, index) => {
    const isFailing = candidate.totalScore < 5; // Determina si el candidato falló basado en la puntuación.
    const backgroundColor = isFailing ? "#f8d7da" : "#f5f5f5"; // Fondo: rojo claro si falla, gris claro si pasa.
    const textColor = isFailing ? "#721c24" : "black"; // Texto: rojo oscuro si falla, negro si pasa.

    return (
      <div
        key={index}
        className="remaining-card"
        style={{
          backgroundColor: backgroundColor, // Fondo según si el candidato falló o no.
          color: textColor, // Color del texto basado en el resultado.
        }}
      >
        <p>
          <strong>Candidate:</strong> {candidate.fileName}
        </p>
        <p>
          <strong>Total Score:</strong> {candidate.totalScore}/10
        </p>
        <button
          className="button button-details"
          style={{
            backgroundColor: textColor, // Fondo del botón igual al color del texto.
            color: backgroundColor, // Texto del botón igual al color del fondo del candidato.
          }}
          onClick={() => handleNavigate(candidate, jobAnalysis)} // Navega al análisis detallado del candidato.
        >
          In-Depth Analysis
        </button>
      </div>
    );
  });
};


  const topThreeCandidates = getTopThreeCandidates(); // Mejores tres candidatos.
  const remainingCandidates = getRemainingCandidates();  // Candidatos restantes.

  return (
    <div className="multi-analysis-container">
      {loading && (
        <div className="loading-text">
          <h2>Loading...</h2>
          <p>Analyzing data, please wait...</p>
        </div>
      )}
      {!loading && error && (
        <div className="error-text">
          <h2>Error</h2>
          <p>{error}</p>
        </div>
      )}
      {!loading && !error && (
        <>
          <h2>Multi CV Analysis</h2>
          {jobAnalysis && (
            <div className="job-info-card">
              <h3>Job Title: {jobAnalysis.jobTitle}</h3>
              <p><strong>Overview:</strong> {jobAnalysis.overview}</p>
              {topThreeCandidates.length > 0 && (
                <div className="top-three-container">
                  <h4>Top Three Candidates</h4>
                  <div className="top-three-cards">
                    {renderTopThreeCandidates(topThreeCandidates)}
                  </div>
                </div>
              )}
            </div>
          )}

          {remainingCandidates.length > 0 && (
            <div className="remaining-candidates-container">
              <h4>Other Candidates</h4>
              <div className="remaining-cards-grid">
                {renderRemainingCandidates(remainingCandidates)}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
