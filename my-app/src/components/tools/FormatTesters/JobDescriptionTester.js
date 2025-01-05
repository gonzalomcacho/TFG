// JobDescriptionTester.js
// Este módulo verifica si un objeto JSON cumple con el formato requerido para una descripción de trabajo.

const JobDescriptionTester = {
  /**
   * validateJobDescription
   * Propósito:
   * - Validar que un objeto de descripción de trabajo cumpla con un esquema definido.
   * - Verificar tipos de datos, propiedades requeridas y longitudes mínimas para ciertos campos.
   * 
   * Input:
   * - `jobDescription`: Objeto JSON que representa la descripción de un trabajo.
   * 
   * Output:
   * - Un objeto con:
   *   - `isValid`: Booleano que indica si el objeto cumple con el esquema.
   *   - `errors`: Lista de mensajes de error indicando problemas de validación.
   */
  validateJobDescription: function (jobDescription) {
    // Esquema esperado para una descripción de trabajo.
    const schema = {
      companyName: { type: "string" }, // Nombre de la empresa: debe ser una cadena.
      role: { type: "string" }, // Rol del trabajo: debe ser una cadena.
      briefDescription: { type: "string" }, // Breve descripción: debe ser una cadena.
      responsibilities: { type: "array", minLength: 1 }, // Responsabilidades: arreglo con al menos un elemento.
      qualifications: { type: "array", minLength: 1 }, // Cualificaciones: arreglo con al menos un elemento.
    };

    const errors = []; // Lista para almacenar mensajes de error.

    // Itera sobre las propiedades del esquema y valida contra el objeto `jobDescription`.
    for (const [key, { type, minLength }] of Object.entries(schema)) {
      if (!jobDescription.hasOwnProperty(key)) {
        errors.push(`Missing property: ${key}`); // Propiedad requerida faltante.
        continue;
      }

      const value = jobDescription[key];

      // Valida el tipo de dato y otras restricciones.
      switch (type) {
        case "string":
          if (typeof value !== "string") {
            errors.push(`Invalid type for ${key}: expected string, got ${typeof value}`); // Tipo incorrecto.
          }
          break;
        case "array":
          if (!Array.isArray(value)) {
            errors.push(`Invalid type for ${key}: expected array, got ${typeof value}`); // Tipo incorrecto.
          } else if (minLength && value.length < minLength) {
            errors.push(`Invalid length for ${key}: expected at least ${minLength} items, got ${value.length}`); // Longitud insuficiente.
          }
          break;
        default:
          errors.push(`Unknown type for validation: ${type}`); // Tipo no reconocido.
      }
    }

    return {
      isValid: errors.length === 0, // El objeto es válido si no hay errores.
      errors, // Lista de errores encontrados durante la validación.
    };
  },
};

export default JobDescriptionTester; // Exporta el módulo para su uso externo.

/**
 * Ejemplo de uso:
 * 
 * const jobDescription = {
 *   companyName: "OpenAI",
 *   role: "Software Engineer",
 *   briefDescription: "Develop and maintain AI systems.",
 *   responsibilities: ["Write clean code", "Collaborate with teams", "Debug applications"],
 *   qualifications: ["Bachelor's degree in CS", "Experience with JavaScript", "Knowledge of AI principles"]
 * };
 * 
 * const result = JobDescriptionTester.validateJobDescription(jobDescription);
 * console.log(result);
 */
