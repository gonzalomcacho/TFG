import React, { useState } from 'react'; // Importa React y `useState` para gestionar el estado local del componente.
import { useNavigate } from 'react-router-dom'; // Importa `useNavigate` para redirigir a otras rutas en la aplicación.
import { generateJobDescription } from './tools/api'; // Importa `generateJobDescription` para generar descripciones de trabajo mediante la API de IA.
import JobDescriptionTester from './tools/FormatTesters/JobDescriptionTester'; // Importa `JobDescriptionTester` para validar las descripciones generadas.

/**
 * Componente: JobDescriptionQuestionnaire
 * Propósito: Este componente permite a los usuarios proporcionar información clave sobre un puesto de trabajo.
 * Qué hace:
 * - Presenta un formulario para recopilar datos como el nombre de la empresa, el rol, sector, responsabilidades y cualificaciones.
 * - Genera automáticamente una descripción de trabajo utilizando IA y valida el resultado.
 * - Redirige a la página de resultados o muestra un mensaje de error en caso de problemas.
 */
export default function JobDescriptionQuestionnaire() {
  const [answers, setAnswers] = useState({ companyName: '', sector: '', role: '', responsibilities: '', qualifications: '' }); // Estado local para almacenar las respuestas del formulario.
  const [error, setError] = useState(null); // Estado local para gestionar errores.
  const navigate = useNavigate(); // Hook para navegar entre rutas.

  /**
   * handleChange
   * Llamada por: Cambios en cualquier campo del formulario (eventos `onChange`).
   * Input: Evento del cambio del textarea (nombre del campo y nuevo valor).
   * Output: Actualiza el estado local `answers` con el nuevo valor del campo correspondiente.
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setAnswers((prevAnswers) => ({ ...prevAnswers, [name]: value }));
  };

  /**
   * handleSubmit
   * Llamada por: Envío del formulario (evento `onSubmit`).
   * Input: Evento de envío del formulario.
   * Output: Redirige a la página de resultados y sube la descripción generada si es válida a localStorage.
   * Manejo de errores: Captura problemas durante la generación o validación, y muestra un mensaje de error.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formattedAnswers = {
        ...answers,
        responsibilities: answers.responsibilities.split('\n').map((item) => item.trim()).filter(Boolean), // Divide responsabilidades por línea y elimina espacios extra.
        qualifications: answers.qualifications.split('\n').map((item) => item.trim()).filter(Boolean), // Divide cualificaciones por línea y elimina espacios extra.
      };

      localStorage.setItem('jobDescriptionInput', JSON.stringify(formattedAnswers)); // Guardar input humano en localStorage

      const aiResponse = await generateJobDescription(formattedAnswers); // Genera la descripción usando la API.
      const validation = JobDescriptionTester.validateJobDescription(aiResponse); // Valida la descripción generada.

      if (!validation.isValid) {
        throw new Error(`Validation Failed: ${validation.errors.join(', ')}`);
      }

      localStorage.setItem('jobDescriptionAIResponse', JSON.stringify(aiResponse));// Guardar respuesta de la IA en localStorage
      console.log('Job description saved in localStorage:', { formattedAnswers, aiResponse });
      navigate('/JobDescription/results');
    } catch (err) {
      setError(err.message || 'Failed to generate job description.'); // Maneja errores y actualiza el estado de error.
    }
  };

  /**
   * autoResizeTextarea
   * Llamada por: Eventos `onChange` de los campos del formulario.
   * Input: Evento del cambio en el textarea.
   * Output: Ajusta dinámicamente la altura del textarea según su contenido.
   */
  const autoResizeTextarea = (event) => {
    const textarea = event.target;
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
  };

  return (
    <div className="container">
      <h2 className="heading">AI-Assisted Job Description Creation</h2>
      <p className="description">
        Please answer the following key questions. Your answers will be used by our AI to generate a tailored job description.
      </p>

      <form onSubmit={handleSubmit} className="section">
        <h3>Company Name:</h3>
        <textarea name="companyName" className="textarea-short" value={answers.companyName} onChange={(e) => { handleChange(e); autoResizeTextarea(e); }} />

        <h3>Sector:</h3>
        <textarea name="sector" className="textarea-short" value={answers.sector} onChange={(e) => { handleChange(e); autoResizeTextarea(e); }} />

        <h3>Role:</h3>
        <textarea name="role" className="textarea-short" value={answers.role} onChange={(e) => { handleChange(e); autoResizeTextarea(e); }} />

        <h3>Responsibilities:</h3>
        <p className="instructions">Detail the main tasks and responsibilities of the position. Clearly define the job duties and expectations. Use strong action verbs such as develop, lead, manage, analyze, create, implement, etc. Here you have some examples: </p>
          <ul className="examples-list">
            <li>Develop and implement new marketing campaigns.</li>
            <li>Manage social media accounts and engage with followers.</li>
            <li>Conduct market research and analyze customer data.</li>
            <li>Collaborate with cross-functional teams to achieve business goals.</li>
          </ul>
        <textarea name="responsibilities" className="textarea" value={answers.responsibilities} onChange={(e) => { handleChange(e); autoResizeTextarea(e); }} />

        <h3>Qualifications:</h3>
        <p className="instructions">Indicate the knowledge, skills, and experience necessary to perform this position. Include keywords such as experience, skills, education, certifications. Here you have some examples:</p>
          <ul className="examples-list">
            <li>Experience: 5+ years in software development, 2+ years with Agile methodologies.</li>
            <li>Skills: Proficiency in Python, Java, and SQL, strong analytical and problem-solving skills, excellent communication and teamwork skills.</li>
            <li>Education: Bachelor's degree in Computer Science or related field.</li>
            <li>Certifications: AWS Certified Solutions Architect, Project Management Professional (PMP).</li>
          </ul>
        <textarea name="qualifications" className="textarea" value={answers.qualifications} onChange={(e) => { handleChange(e); autoResizeTextarea(e); }} />

        <button className="button button-blue" type="submit">Submit Answers</button>
      </form>

      {error && <p className="error-text">{error}</p>}
    </div>
  );
}
