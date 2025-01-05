import React, { useState, useEffect } from "react"; // Importa React y hooks para gestionar estados y efectos secundarios.
import { useNavigate } from "react-router-dom"; // Importa `useNavigate` para redirigir entre rutas.

/**
 * Componente: CVMultiUpload
 * Propósito: Este componente permite a los usuarios cargar múltiples CVs en formato PDF, extraer su texto mediante un Web Worker, y analizar los CVs en relación a una descripción de trabajo previamente proporcionada.
 * Qué hace:
 * - Proporciona una interfaz para seleccionar y cargar archivos PDF.
 * - Extrae texto de los CVs usando un Web Worker.
 * - Permite al usuario editar el texto extraído de cada CV.
 * - Navega a la página de análisis con los CVs y la descripción de trabajo seleccionados.
 */

export default function CVMultiUpload() {
  const navigate = useNavigate(); // Hook para redirigir a otras rutas.

  const [selectedFiles, setSelectedFiles] = useState([]); // Archivos seleccionados por el usuario.
  const [extractedCVs, setExtractedCVs] = useState([]); // Textos extraídos de los CVs.
  const [currentIndex, setCurrentIndex] = useState(0); // Índice del CV actualmente mostrado.
  const [draftText, setDraftText] = useState(""); // Texto temporal para edición.
  const [isEditing, setIsEditing] = useState(false); // Controla si el modo edición está activado.
  const [workerReady, setWorkerReady] = useState(false); // Indica si el Web Worker está listo.
  const [asposeWorker, setAsposeWorker] = useState(null); // Referencia al Web Worker.
  const [loadingText, setLoadingText] = useState("Initializing Text Extractor..."); // Mensaje de estado para el usuario.
  const [buttonClicked, setButtonClicked] = useState(false); // Controla si el botón de extracción fue clicado.

  /**
   * useEffect
   * Llamada por: Render inicial del componente.
   * Propósito: Inicializa el Web Worker para procesar los archivos PDF.
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

    setAsposeWorker(worker);

    return () => worker.terminate(); // Limpia el Web Worker al desmontar el componente.
  }, []);

  /**
   * handleProcessCVs
   * Llamada por: Botón "Extract Text from CV(s)".
   * Input: Ninguno.
   * Output: Extrae texto de los archivos seleccionados y lo almacena en `extractedCVs`.
   * Manejo de errores: Muestra mensajes de error si ocurre un problema en la extracción.
   */
  const handleProcessCVs = async () => {
    if (!workerReady || !asposeWorker) return;
    if (selectedFiles.length === 0) {
      alert("Please select at least one CV.");
      return;
    }

    setButtonClicked(true); // Desactiva el botón tras el clic.
    const newExtractedCVs = [];

    for (const file of selectedFiles) {
      setLoadingText(`Extracting text from ${file.name}...`);
      const fileReader = new FileReader();

      const fileText = await new Promise((resolve, reject) => {
        fileReader.onload = (e) => {
          asposeWorker.onmessage = (evt) => {
            if (evt.data?.json?.errorCode === 0) {
              resolve(evt.data.json.extractText);
            } else {
              reject("Error extracting text. Please try again.");
            }
          };

          asposeWorker.postMessage(
            { operation: "AsposePdfExtractText", params: [e.target.result, file.name] },
            [e.target.result]
          );
        };

        fileReader.onerror = () => reject("Error reading the file. Please try again.");
        fileReader.readAsArrayBuffer(file);
      });

      newExtractedCVs.push({ fileName: file.name, text: fileText });
    }

    setExtractedCVs(newExtractedCVs);
    setCurrentIndex(0);
    setDraftText(newExtractedCVs[0]?.text || "");
    setLoadingText("");
  };

  /**
   * handleFileChange
   * Llamada por: Input de selección de archivo.
   * Input: Evento del cambio de archivo.
   * Output: Actualiza la lista de archivos seleccionados.
   */
  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    setSelectedFiles(files);
    setButtonClicked(false);
  };

  /**
   * handleNextText
   * Llamada por: Botón "Next ➡".
   * Propósito: Navega al texto extraído del siguiente CV.
   */
  const handleNextText = () => {
    const nextIndex = (currentIndex + 1) % extractedCVs.length;
    setCurrentIndex(nextIndex);
    setDraftText(extractedCVs[nextIndex]?.text || "");
    setIsEditing(false);
  };

  /**
   * handlePreviousText
   * Llamada por: Botón "⬅ Previous".
   * Propósito: Navega al texto extraído del CV anterior.
   */
  const handlePreviousText = () => {
    const prevIndex = currentIndex === 0 ? extractedCVs.length - 1 : currentIndex - 1;
    setCurrentIndex(prevIndex);
    setDraftText(extractedCVs[prevIndex]?.text || "");
    setIsEditing(false);
  };

  /**
   * handleEditToggle
   * Llamada por: Botones "Edit" y "Save Changes".
   * Propósito: Alterna entre modos de edición y visualización del texto extraído.
   */
  const handleEditToggle = () => {
    if (isEditing) {
      const updatedCVs = [...extractedCVs];
      updatedCVs[currentIndex].text = draftText;
      setExtractedCVs(updatedCVs);
    }
    setIsEditing(!isEditing);
  };

  /**
   * handleAnalyzeMultipleCVs
   * Llamada por: Botón "Analyze All CVs".
   * Input: Ninguno.
   * Output: Navega a la página de análisis con los CVs y la descripción del trabajo.
   */
  const handleAnalyzeMultipleCVs = () => {
    if (extractedCVs.length === 0) {
      alert("No CVs extracted for analysis.");
      return;
    }

        // Guardar textos extraídos en localStorage
    localStorage.setItem("candidatesCVs", JSON.stringify(extractedCVs));

    console.log("Extracted CVs saved to localStorage:", extractedCVs);
    console.log("Navigating to /MultiAnalysis.");

    // Navegar a la página de análisis
    navigate("/MultiAnalysis");
 //   if (!jobDescription) {
 //     alert("Job description is missing.");
 //     return;
 //   }
//    console.log('Navigating to /MultiAnalysis with this jobDescription and candidateCVs in the state:', { jobDescription, candidateCVs:extractedCVs, });
//    navigate("/MultiAnalysis", { state: { jobDescription, candidateCVs: extractedCVs } });
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
          <h2>CV Upload</h2>
          <p>Please select one or more CVs in PDF format.</p>
          <div className="warning-box" style={{ backgroundColor: "#FFFF99", padding: "10px", borderRadius: "5px", marginBottom: "15px" }}>
          <p>
            <strong>Note:</strong> The more PDFs you upload, the longer the analysis will take.
          </p>
        </div>
          <label htmlFor="cv-multi-upload" className="label">{selectedFiles.length > 0 ? "Change Files" : "Select Files"}</label>
          <input id="cv-multi-upload" type="file" accept=".pdf" className="hidden-input" multiple onChange={handleFileChange} />
          {selectedFiles.length > 0 && (
            <>
              <div className="selected-files-container">
                {selectedFiles.map((file, index) => (<div key={index} className="selected-file">{file.name}</div>))}
              </div>
              {!buttonClicked && (<button className="button button-blue" onClick={handleProcessCVs}>Extract Text from CV(s)</button>)}
            </>
          )}
          {loadingText && <p className="loading-text">{loadingText}</p>}
          {extractedCVs.length > 0 && (
            <>
              <button className="button button-blue" onClick={handlePreviousText}>⬅ Previous</button>
              <span>{currentIndex + 1}/{extractedCVs.length}</span>
              <button className="button button-blue" onClick={handleNextText}>Next ➡</button>
              <div>
                {isEditing ? (
                  <textarea className="textarea" value={draftText} onChange={(e) => setDraftText(e.target.value)} />
                ) : (
                  <p className="cv-content">{draftText}</p>
                )}
                <div className="button-container">
                  {isEditing ? (
                    <>
                      <button className="button button-red" onClick={() => setIsEditing(false)}>Cancel</button>
                      <button className="button button-green" onClick={handleEditToggle}>Save Changes</button>
                    </>
                  ) : (
                    <>
                      <button className="button button-green" onClick={handleEditToggle}>Edit</button>
                      <button className="button button-blue" onClick={handleAnalyzeMultipleCVs}>Analyze All CVs</button>
                    </>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
