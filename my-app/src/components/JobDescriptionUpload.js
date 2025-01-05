import React, { useState, useEffect } from "react"; // Importa React y hooks para gestionar estados y efectos secundarios.
import { useNavigate } from "react-router-dom"; // Importa `useNavigate` para navegación entre rutas.

/**
 * Componente: JobDescriptionUpload
 * Propósito: Permite al usuario cargar un archivo PDF con la descripción de trabajo, extraer su texto y editarlo si es necesario.
 */

export default function JobDescriptionUpload({ onFileSelect }) {
  const [selectedJobDescription, setSelectedJobDescription] = useState(null); // Almacena el archivo seleccionado.
  const [extractedText, setExtractedText] = useState(""); // Almacena el texto extraído del archivo PDF.
  const [isEditing, setIsEditing] = useState(false); // Indica si el modo edición está activado.
  const [draftExtractedText, setDraftExtractedText] = useState(""); // Almacena cambios temporales en el texto extraído.
  const [workerReady, setWorkerReady] = useState(false); // Indica si el Web Worker está listo para operar.
  const [loadingText, setLoadingText] = useState("Initializing Text Extractor..."); // Mensaje de estado durante la inicialización y procesamiento.
  const [AsposePDFWebWorker, setAsposePDFWebWorker] = useState(null); // Referencia al Web Worker.
  const navigate = useNavigate(); // Hook para redirigir entre rutas.

  /**
   * useEffect
   * Llamada por: Render inicial del componente.
   * Input: Ninguno.
   * Output: Inicializa el Web Worker y maneja errores en caso de fallos.
   */
  useEffect(() => {
    const worker = new Worker("/worker/AsposePDFforJS.js");

    worker.onerror = (evt) => {
      console.error("Error from Web Worker:", evt.message);
      setLoadingText("Error initializing Web Worker. Please reload.");
    };

    worker.onmessage = (evt) => {
      if (evt.data === "ready") {
        setWorkerReady(true);
        setLoadingText("");
      }
    };

    setAsposePDFWebWorker(worker);

    return () => worker.terminate(); // Limpia el Web Worker al desmontar el componente.
  }, []);

  /**
   * handleFileChange
   * Llamada por: Input del archivo (evento `onChange`).
   * Input: Archivo PDF seleccionado.
   * Output: Extrae el texto del PDF y lo almacena en el estado.
   */
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedJobDescription(file);

    if (file && workerReady && AsposePDFWebWorker) {
      const fileReader = new FileReader();
      setLoadingText("Extracting text from job description...");

      fileReader.onload = (e) => {
        AsposePDFWebWorker.postMessage(
          { operation: "AsposePdfExtractText", params: [e.target.result, file.name] },
          [e.target.result]
        );
      };

      fileReader.onerror = () => setLoadingText("Error reading the file. Please try again.");

      AsposePDFWebWorker.onmessage = (evt) => {
        if (evt.data?.json?.errorCode === 0) {
          setExtractedText(evt.data.json.extractText);
          setDraftExtractedText(evt.data.json.extractText);
          setLoadingText("");
        } else {
          setLoadingText("Error extracting text. Please try again.");
        }
      };

      fileReader.readAsArrayBuffer(file);
    }
  };

  /**
   * handleEditToggle
   * Llamada por: Botón "Edit" o "Cancel".
   * Input: Ninguno.
   * Output: Alterna entre modos de edición y visualización.
   */
  const handleEditToggle = () => setIsEditing(!isEditing);

  /**
   * handleConfirmChanges
   * Llamada por: Botón "Save Changes".
   * Input: Ninguno.
   * Output: Guarda los cambios en el texto extraído y desactiva el modo edición.
   */
  const handleConfirmChanges = () => {
    setExtractedText(draftExtractedText);
    setIsEditing(false);
  };

  /**
   * handleUploadCVs
   * Llamada por: Botón "Upload Multiple CVs".
   * Input: Ninguno.
   * Output: Navega a la página de subida de CVs con el texto extraído.
   */
  const handleUploadCVs = () => {
    if (onFileSelect) onFileSelect(extractedText);

        // Guarda el texto extraído en localStorage
    localStorage.setItem("jobDescriptionTextForAI", extractedText);

    console.log("Navigating to /CVMultiUpload with jobDescription stored in localStorage.");
    navigate("/CVMultiUpload"); // Navegar sin pasar datos por estado


//    console.log('Navigating to /CVMultiUpload with this jobDescription in the state:', { jobDescription: extractedText });
//    navigate("/CVMultiUpload", { state: { jobDescription: extractedText } });
  };

  return (
    <div className="container">
      {!workerReady ? (
        <div className="loading-text">
          <h2>Loading...</h2>
          <p>{loadingText}</p>
        </div>
      ) : (
        <div className="section">
          <h2>Job Description Upload</h2>
          <p>Please upload the job description in PDF format. The text will be extracted automatically.</p>
          <label htmlFor="jd-upload" className="label">{selectedJobDescription ? "Change file" : "Select file"}</label>
          <input id="jd-upload" type="file" onChange={handleFileChange} accept=".pdf" hidden />
          {selectedJobDescription && <p>File selected: {selectedJobDescription.name}</p>}
          {loadingText && <p className="loading-text">{loadingText}</p>}
          {extractedText && (
            <div>
              <h3>Extracted Text:</h3>
              {isEditing ? (
                <textarea className="textarea" value={draftExtractedText} onChange={(e) => setDraftExtractedText(e.target.value)} />
              ) : (
                <p className="description-content">{extractedText}</p>
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
            </div>
          )}
        </div>
      )}
    </div>
  );
}
