import React, { useState } from "react"; // Importa React y el hook `useState` para gestionar el estado del componente.
import { useLocation } from "react-router-dom"; // Importa `useLocation` para obtener datos de navegación.
import { generateInterviewQuestions } from "./tools/api"; // Importa `generateInterviewQuestions` para generar preguntas de entrevista basadas en datos.
import { useNavigate } from 'react-router-dom'; // Importa `useNavigate` para redirigir a otras rutas dentro de la aplicación.


/**
 * Componente: Interview
 * Propósito: Permitir al usuario generar una entrevista personalizada basada en la descripción del trabajo y un CV seleccionado.
 * Qué hace:
 * - Permite seleccionar entre un CV censurado y uno sin censurar.
 * - Permite elegir la cantidad de preguntas a generar.
 * - Genera preguntas personalizadas utilizando una API.
 * - Ofrece opciones para copiar preguntas al portapapeles o rehacer la entrevista.
 */

function Interview() {
  const navigate = useNavigate(); // Obtiene datos pasados al componente mediante navegación.
  const location = useLocation(); // Obtiene datos pasados al componente mediante navegación.
  const jobAnalysis = location.state?.jobAnalysis || null; // Análisis del puesto de trabajo recibido.
  const originalCV = location.state?.originalCV || ""; // CV original sin censurar.
  const anonymizedCV = location.state?.anonymizedCV || ""; // CV censurado del candidato.
  const fileName = location.state?.fileName || ""; // Filename del candidato
  const candidateAnalysis = location.state?.candidateAnalysis || ""; // CV censurado del candidato.
  const totalScore = location.state?.totalScore || ""; // Filename del candidato

  const [selectedCV, setSelectedCV] = useState(""); // Almacena la selección del CV (censurado o sin censurar).
  const [numQuestions, setNumQuestions] = useState(10); // Número de preguntas seleccionadas por el usuario (por defecto 10).
  const [questions, setQuestions] = useState([]); // Lista de preguntas generadas por la API.
  const [loading, setLoading] = useState(false); // Indica si las preguntas están siendo generadas.
  const [error, setError] = useState(null); // Almacena errores para mostrar al usuario.

  /**
   * handleCVSelection
   * Llamada por: Radio buttons para seleccionar el CV.
   * Input: Evento de cambio del valor seleccionado.
   * Output: Actualiza el estado `selectedCV` con el CV elegido.
   */
  const handleCVSelection = (event) => {
    setSelectedCV(event.target.value);
  };

  /**
   * handleNumQuestionsChange
   * Llamada por: Select para elegir el número de preguntas.
   * Input: Evento de cambio del número seleccionado.
   * Output: Actualiza el estado `numQuestions` con el valor elegido.
   */
  const handleNumQuestionsChange = (event) => {
    setNumQuestions(Number(event.target.value));
  };

  /**
   * fetchInterviewQuestions
   * Llamada por: Botón "Generate Personalized Interview".
   * Input: Ninguno.
   * Output: Actualiza el estado con las preguntas generadas o muestra un error.
   * Propósito:
   * - Validar los datos necesarios antes de llamar a la API.
   * - Enviar el análisis del trabajo, el CV seleccionado y el número de preguntas a la API.
   * Manejo de errores:
   * - Verifica si los datos están disponibles antes de la llamada.
   * - Muestra mensajes de error si la validación o la API fallan.
   */
  const fetchInterviewQuestions = async () => {
    try {
      setError(null);

      // Validaciones previas
      if (!jobAnalysis) {
        setError("Missing job analysis data.");
        return;
      }
      if (!selectedCV) {
        setError("Please select which CV you want to use (censored/uncensored).");
        return;
      }

      const cvToUse = selectedCV === "uncensored" ? originalCV : anonymizedCV; // Determina el CV a usar.
      if (!cvToUse) {
        setError(`The chosen CV ("${selectedCV}") is empty or not provided.`);
        return;
      }

      setLoading(true);

      // Llamada a la API
      const data = await generateInterviewQuestions(
        JSON.stringify(jobAnalysis), // Convierte el análisis del trabajo a formato JSON.
        cvToUse, // CV seleccionado.
        numQuestions // Número de preguntas.
      );

      const newInterview = {
        candidateFileName: fileName,
        usedCensoredCV: selectedCV === "censored",
        numberOfQuestions: numQuestions,
        questions: data.questions || [],
      };

      // Retrieve existing interviews or initialize an empty array
      const existingInterviews = JSON.parse(localStorage.getItem("generatedInterviews")) || [];

      // Add the new interview to the array
      const updatedInterviews = [...existingInterviews, newInterview];

      // Store the updated array in localStorage
      localStorage.setItem("generatedInterviews", JSON.stringify(updatedInterviews));

      setQuestions(data.questions || []); // Actualiza el estado con las preguntas generadas.
    } catch (err) {
      setError(err.message); // Muestra el error si ocurre.
    } finally {
      setLoading(false); // Detiene el estado de carga.
    }
  };

  /**
   * handleGenerateClick
   * Llamada por: Botón "Generate Personalized Interview".
   * Propósito: Llama a `fetchInterviewQuestions` para generar preguntas.
   */
  const handleGenerateClick = () => {
    fetchInterviewQuestions();
  };

  /**
   * handleCopyAllClick
   * Llamada por: Botón "Copy All Questions".
   * Propósito:
   * - Copia todas las preguntas generadas al portapapeles en un formato numerado.
   */
  const handleCopyAllClick = () => {
    const textToCopy = questions
      .map((question, index) => `${index + 1}. ${question}`) // Formatea preguntas con números.
      .join("\n");

    navigator.clipboard
      .writeText(textToCopy) // Copia al portapapeles.
      .then(() => {
        alert("All questions copied to clipboard!"); // Confirma éxito.
      })
      .catch((err) => {
        console.error("Failed to copy: ", err); // Muestra error en consola.
      });
  };

  /**
   * handleRedoInterview
   * Llamada por: Botón "Redo Interview".
   * Propósito:
   * - Resetea los estados para permitir al usuario generar una nueva entrevista.
   */
  const handleRedoInterview = () => {
    setQuestions([]); // Limpia las preguntas generadas.
    setSelectedCV(""); // Resetea la selección del CV.
    setNumQuestions(10); // Restablece el número de preguntas al valor por defecto.
    setError(null); // Limpia errores.
  };

  const handleGoBack = () => {
    navigate("/Analysis", {
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

  return (
    <div className="container">
      <h2>Personalized Interview</h2>
      <p><strong>Candidate:</strong> {fileName} </p>

      {error && <p className="error-text">{error}</p>}

      {questions.length === 0 && (
        <>
          <div className="section cv-choice">
            <h3>Select which CV version to use:</h3>
            <div className="options-container">
              <label class="radio-label"> <input type="radio" name="cvOption" value="uncensored" checked={selectedCV === "uncensored"} onChange={handleCVSelection} className="radio-custom"/> Uncensored CV </label>
              <label class="radio-label"> <input type="radio" name="cvOption" value="censored" checked={selectedCV === "censored"} onChange={handleCVSelection} className="radio-custom"/> Censored CV</label>
            </div>
          </div>

          <div className="section questions-choice">
            <h3>Select number of questions:</h3>
            <select value={numQuestions} onChange={handleNumQuestionsChange}>
              <option value="3">3</option>
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
            </select>
          </div>

          <div className="section">
            <p>
              Ready to create a personalized interview for the candidate based on
              the job description and the chosen CV?
            </p>
            <button className="button button-blue" onClick={handleGenerateClick}>
              Generate Personalized Interview
            </button>
          </div>
        </>
      )}

      {loading && ( <p className="loading-text"> Generating interview questions, please wait... </p> )}

      {questions.length > 0 && (
        <div className="interview-questions section">
          <h3>Here is your tailor-made interview:</h3>

          <button className="button button-blue" onClick={handleCopyAllClick}> Copy All Questions </button>

          <div className="card-wrapper">
            {questions.map((question, index) => (
              <div key={index} className="analysis-card interview-question-card" >
                <span className="question-number">{index + 1}.</span>
                <p className="question-text">{question}</p>
              </div>
            ))}
          </div>
           <button className="button button-blue" onClick={handleRedoInterview} > Redo Interview </button>
        </div>
      )}
      <button className="button button-blue" onClick={handleGoBack} >Back to Candidate Analysis</button>
    </div>
  );
}

export default Interview;
