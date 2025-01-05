import React from "react"; // Importa React para usar JSX y crear componentes funcionales.
import { useLocation, useNavigate } from "react-router-dom"; // Importa hooks para obtener información de rutas y navegar entre páginas.
import { FaRedo, FaPrint } from "react-icons/fa"; // Importa íconos de react-icons para mejorar la interfaz visual.

export default function Header() {
  /**
   * Componente: Header
   * Propósito: Renderiza un encabezado para la aplicación excepto en la página principal ("/").
   * Qué hace:
   * - Proporciona un botón para restablecer el progreso del usuario.
   * - Permite copiar el progreso al portapapeles en un formato legible.
   * - Incluye el título de la aplicación y botones de acción con íconos.
   */

  const location = useLocation(); // Obtiene información sobre la ruta actual.
  const navigate = useNavigate(); // Proporciona la capacidad de redirigir a otras rutas.

  /**
   * handleReset
   * Llamada por: Botón "Reset".
   * Input: Ninguno.
   * Output: Limpia el localStorage y redirige al usuario a la página principal.
   * Manejo de errores: Confirma la acción con el usuario antes de proceder.
   * Propósito: Permitir al usuario comenzar desde cero al borrar todo el progreso almacenado.
   */
  const handleReset = () => {
    if (window.confirm("All your progress will be lost. Are you sure?")) {
      localStorage.clear(); // Borra todos los datos almacenados en localStorage.
      navigate("/"); // Redirige al usuario a la página principal.
    }
  };

  /**
   * handlePrint
   * Llamada por: Botón "Copy Progress".
   * Input: Ninguno.
   * Output: Copia los datos del localStorage al portapapeles en un formato legible.
   * Manejo de errores: Gestiona datos no parseables y muestra mensajes de éxito o fallo.
   * Propósito: Proporcionar al usuario una copia del progreso actual en un formato legible.
   */
  const handlePrint = () => {
    if (window.confirm("Do you want to copy all your progress to the clipboard?")) {
      let readableData = ""; // Almacena los datos procesados en un formato legible.

      try {
        // Itera sobre las claves del localStorage.
        Object.keys(localStorage).forEach((key) => {
          try {
            const parsedValue = JSON.parse(localStorage[key]); // Intenta parsear el valor.
            readableData += `\n=== ${key.toUpperCase()} ===\n`;

            if (typeof parsedValue === "object" && !Array.isArray(parsedValue)) {
              // Formatea objetos clave-valor.
              Object.entries(parsedValue).forEach(([subKey, value]) => {
                readableData += `- ${subKey}: ${JSON.stringify(value, null, 2)}\n`;
              });
            } else if (Array.isArray(parsedValue)) {
              // Formatea arrays.
              readableData += parsedValue
                .map((item, index) => `  ${index + 1}. ${JSON.stringify(item, null, 2)}\n`)
                .join("");
            } else {
              readableData += `${parsedValue}\n`; // Agrega valores simples.
            }
          } catch (error) {
            // Incluye datos no parseables sin formato.
            readableData += `\n=== ${key.toUpperCase()} ===\n${localStorage[key]}\n`;
          }
        });

        // Copia los datos procesados al portapapeles.
        navigator.clipboard.writeText(readableData)
          .then(() => alert("Progress copied to clipboard in readable format."))
          .catch(() => alert("Failed to copy progress to clipboard."));
      } catch (error) {
        alert("An unexpected error occurred while processing the data.");
      }
    }
  };

  // Condición para no renderizar el header en la página principal ("/").
  if (location.pathname === "/") {
    return null;
  }

  return (
    <div className="header">
      <div className="header-left">
        <button className="icon-button" onClick={handleReset} title="Reset">
          <FaRedo />
        </button>
      </div>
      <div className="header-center">
        <h1 className="app-title">CV Analyzer</h1>
      </div>
      <div className="header-right">
        <button className="icon-button" onClick={handlePrint} title="Copy Progress">
          <FaPrint />
        </button>
      </div>
    </div>
  );
}
