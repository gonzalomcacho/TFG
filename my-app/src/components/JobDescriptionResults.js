import React, { useState, useEffect } from "react"; // Importa React y hooks para gestionar estados, efectos secundarios y referencias.
import { useNavigate } from "react-router-dom"; // Importa `useNavigate` para navegación.

/**
 * Componente: JobDescriptionResults
 * Propósito: Mostrar la descripción de trabajo generada y permitir su edición.
 * Qué hace:
 * - Presenta una descripción generada automáticamente.
 * - Permite al usuario editar los detalles de la descripción.
 * - Proporciona opciones para confirmar ediciones o subir CVs relacionados.
 * - Muestra un mensaje de error si no se reciben datos válidos.
 */

export default function JobDescriptionResults() {
  const navigate = useNavigate(); // Hook para navegar entre rutas en la aplicación.

  const [description, setDescription] = useState(null); // Estado que almacena la descripción actual.
  const [isEditing, setIsEditing] = useState(false); // Estado que controla si el modo edición está activado.
  const [draftDescription, setDraftDescription] = useState(null); // Estado para cambios temporales en la descripción.
  const [error, setError] = useState(null); // Estado para almacenar errores en caso de datos faltantes.


  useEffect(() => {
    try {
      const storedDescription = localStorage.getItem("jobDescriptionAIResponse");
      if (storedDescription) {
        const parsedDescription = JSON.parse(storedDescription);
        setDescription(parsedDescription);
        setDraftDescription(parsedDescription);
      } else {
        setError("No job description found in localStorage.");
      }
    } catch (err) {
      setError("Failed to load job description from localStorage.");
    }
  }, []);



  if (error) {
    return (
      <div className="container">
        <h2>Error</h2>
        <p>{error}</p>
        <button className="button button-blue" onClick={() => navigate(-1)}>Go Back</button>
      </div>
    );
  }

  /**
   * handleEditToggle
   * Llamada por: Botón "Edit" o "Cancel".
   * Input: Ninguno.
   * Output: Alterna entre los modos de edición y visualización.
   */
  const handleEditToggle = () => {
    if (isEditing) setDraftDescription(description);
    setIsEditing(!isEditing);
  };

  /**
   * handleDescriptionChange
   * Llamada por: Cambios en los campos de entrada en modo edición.
   * Input: Nombre del campo modificado y su nuevo valor.
   * Output: Actualiza `draftDescription` con los cambios realizados.
   */
  const handleDescriptionChange = (field, value) => {
    setDraftDescription((prev) => ({ ...prev, [field]: value }));
  };

  /**
   * handleConfirmChanges
   * Llamada por: Botón "Save Changes".
   * Input: Ninguno.
   * Output: Guarda los cambios en `description` y desactiva el modo edición.
   */
  const handleConfirmChanges = () => {
    setDescription(draftDescription);
    setIsEditing(false);
  };

  /**
   * handleUploadCVs
   * Llamada por: Botón "Upload Multiple CVs".
   * Input: Ninguno.
   * Output: Navega a la página de subida de CVs con la descripción generada.
   */
  const handleUploadCVs = () => {
    const jobDescriptionText = `
      Company Name: ${description.companyName}
      Role: ${description.role}
      Brief Description: ${description.briefDescription}
      Responsibilities: ${description.responsibilities.join("\n")}
      Qualifications: ${description.qualifications.join("\n")}
    `.trim();

    localStorage.setItem("jobDescriptionTextForAI", jobDescriptionText);      // Guardar en localStorage
    console.log("Navigating to /CVMultiUpload with jobDescription stored in localStorage.");
    navigate("/CVMultiUpload");

  };

  return (
    <div className="container">
      {!description ? (
        <div className="loading-text">
          <h2>Loading...</h2>
          <p className="loading-text">Creating job description, please wait...</p>
        </div>
      ) : (
        <>
          <h2>Generated Job Description</h2>
          {isEditing ? (
            <div>
              <h3>Company Name</h3>
              <input type="text" className="input" value={draftDescription.companyName} onChange={(e) => handleDescriptionChange("companyName", e.target.value)} />
              <h3>Role</h3>
              <input type="text" className="input" value={draftDescription.role} onChange={(e) => handleDescriptionChange("role", e.target.value)} />
              <h3>Brief Description</h3>
              <textarea className="textarea" value={draftDescription.briefDescription} onChange={(e) => handleDescriptionChange("briefDescription", e.target.value)} />
              <h3>Responsibilities</h3>
              <textarea className="textarea" value={draftDescription.responsibilities.join("\n")} onChange={(e) => handleDescriptionChange("responsibilities", e.target.value.split("\n"))} />
              <h3>Qualifications</h3>
              <textarea className="textarea" value={draftDescription.qualifications.join("\n")} onChange={(e) => handleDescriptionChange("qualifications", e.target.value.split("\n"))} />
            </div>
          ) : (
            <div>
              <h3>Company Name</h3>
              <p>{description.companyName}</p>
              <h3>Role</h3>
              <p>{description.role}</p>
              <h3>Brief Description</h3>
              <p>{description.briefDescription}</p>
              <h3>Responsibilities</h3>
              <ul>{description.responsibilities.map((item, index) => (<li key={index}>{item}</li>))}</ul>
              <h3>Qualifications</h3>
              <ul>{description.qualifications.map((item, index) => (<li key={index}>{item}</li>))}</ul>
            </div>
          )}
          <div className="button-container">
            {isEditing ? (
              <>
                <button className="button button-red" onClick={handleEditToggle}>Cancel</button>
                <button className="button button-green" onClick={handleConfirmChanges}>Save Changes</button>
              </>
            ) : (
              <>
                <button className="button button-green" onClick={handleEditToggle}>Edit</button>
                <button className="button button-blue" onClick={handleUploadCVs}>Upload Multiple CVs</button>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}
