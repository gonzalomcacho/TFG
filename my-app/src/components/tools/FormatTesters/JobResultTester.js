// JobResultTester.js
// Este módulo verifica si un objeto JSON cumple con el formato requerido para una descripción de trabajo.

const JobResultTester = {
    /**
     * validateJobResult
     * Propósito:
     * - Verificar que un objeto de resultado de trabajo cumpla con un esquema definido.
     * - Validar tipos de datos, propiedades requeridas y longitudes específicas de ciertos campos.
     * 
     * Input:
     * - `jobResult`: Objeto que contiene datos de la descripción del trabajo.
     * 
     * Output:
     * - Un objeto con:
     *   - `isValid`: Booleano que indica si el objeto cumple con el esquema.
     *   - `errors`: Lista de mensajes de error indicando problemas de validación.
     */
    validateJobResult: function (jobResult) {
      // Define el esquema esperado para la descripción del trabajo.
      const schema = {
        jobTitle: { type: 'string' }, // Título del trabajo: debe ser una cadena.
        keyTechnicalSkills: { type: 'array', length: 3 }, // Habilidades técnicas clave: arreglo de exactamente 3 elementos.
        keyInterpersonalSkills: { type: 'array', length: 3 }, // Habilidades interpersonales clave: arreglo de exactamente 3 elementos.
        responsibilities: { type: 'array', length: 3 }, // Responsabilidades: arreglo de exactamente 3 elementos.
        requirements: { type: 'array', length: 3 }, // Requisitos: arreglo de exactamente 3 elementos.
        overview: { type: 'string' } // Resumen general del trabajo: debe ser una cadena.
      };
  
      const errors = []; // Lista para almacenar mensajes de error.
  
      // Recorre las propiedades del esquema para validarlas contra el objeto `jobResult`.
      for (const [key, { type, length }] of Object.entries(schema)) {
        if (!jobResult.hasOwnProperty(key)) {
          errors.push(`Missing property: ${key}`); // Propiedad requerida faltante.
          continue;
        }
  
        const value = jobResult[key];
  
        // Valida el tipo de dato de la propiedad.
        switch (type) {
          case 'string':
            if (typeof value !== 'string') {
              errors.push(`Invalid type for ${key}: expected string, got ${typeof value}`); // Tipo incorrecto.
            }
            break;
          case 'array':
            if (!Array.isArray(value)) {
              errors.push(`Invalid type for ${key}: expected array, got ${typeof value}`); // Tipo incorrecto.
            } else if (length && value.length !== length) {
              errors.push(`Invalid length for ${key}: expected ${length} items, got ${value.length}`); // Longitud incorrecta.
            }
            break;
          default:
            errors.push(`Unknown type for validation: ${type}`); // Tipo no reconocido.
        }
      }
  
      return {
        isValid: errors.length === 0, // El objeto es válido si no hay errores.
        errors // Lista de errores encontrados durante la validación.
      };
    }
  };
  
  module.exports = JobResultTester; // Exporta el módulo para su uso externo.
  
  /**
   * Ejemplo de uso:
   * 
   * const jobResult = {
   *   jobTitle: "Software Engineer",
   *   keyTechnicalSkills: ["JavaScript", "React", "Node.js"],
   *   keyInterpersonalSkills: ["Teamwork", "Communication", "Problem-solving"],
   *   responsibilities: ["Develop applications", "Maintain codebase", "Collaborate with teams"],
   *   requirements: ["Bachelor's degree", "3+ years experience", "Proficiency in JavaScript"],
   *   overview: "This role involves creating and maintaining software applications."
   * };
   * 
   * const result = JobResultTester.validateJobResult(jobResult);
   * console.log(result);
   */
  