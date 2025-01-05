import { useNavigate } from 'react-router-dom'; // Importa `useNavigate` para redirigir a otras rutas dentro de la aplicación.

/**
 * Componente: JobDescription
 * Propósito: Este componente permite al usuario iniciar el proceso de configuración de una descripción de trabajo.
 * Qué hace:
 * - Presenta opciones para que el usuario cargue una descripción de trabajo existente o genere una nueva con asistencia de IA.
 * - Redirige al usuario a las páginas correspondientes según su elección.
 */

export default function JobDescription() {
  const navigate = useNavigate(); // Hook para navegar entre rutas en la aplicación.

  /**
   * handleUploadJobDescription
   * Llamada por: Botón "Upload Job Description".
   * Input: Ninguno.
   * Output: Redirige al usuario a la ruta "/JobDescription/upload".
   * Manejo de errores: No aplica, solo realiza una redirección.
   * Propósito: Llevar al usuario a la página para subir una descripción de trabajo en formato PDF.
   */
  const handleUploadJobDescription = () => navigate("/JobDescription/upload");

  /**
   * handleCreateWithAI
   * Llamada por: Botón "Create with AI Interview".
   * Input: Ninguno.
   * Output: Redirige al usuario a la ruta "/JobDescription/questionnaire".
   * Manejo de errores: No aplica, solo realiza una redirección.
   * Propósito: Llevar al usuario a la página para crear una descripción de trabajo usando un cuestionario asistido por IA.
   */
  const handleCreateWithAI = () => navigate("/JobDescription/questionnaire");

  return (
    <div className="container">
      <h1>Job Description Setup</h1>
      <p>Do you already have a job description in PDF format, or do you prefer to create a new one through an AI-assisted interview process?</p>
      <div className="section">
        <button className="button button-blue" onClick={handleUploadJobDescription}>Upload Job Description</button>
        <button className="button button-blue" onClick={handleCreateWithAI}>Create with AI Interview</button>
      </div>
    </div>
  );
}
