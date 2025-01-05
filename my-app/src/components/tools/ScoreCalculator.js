// Function to calculate the total score for the candidate
export const calculateScores = (candidateAnalysis) => {
  /**
   * Propósito:
   * - Calcular la puntuación total del candidato basado en su análisis.
   * - Utiliza un sistema de pesos para ponderar diferentes categorías de evaluación.
   * 
   * Input:
   * - `candidateAnalysis`: Objeto que contiene las puntuaciones individuales del candidato en diversas categorías.
   * 
   * Output:
   * - Un número decimal que representa la puntuación total del candidato, redondeado a dos decimales.
   */

  // Extract individual scores and weights
  const { evaluationScores } = candidateAnalysis; // Objeto con las puntuaciones individuales en categorías específicas.
  const weights = {
    technicalSkills: 0.3, // Peso asignado a "Habilidades técnicas".
    workExperience: 0.25, // Peso asignado a "Experiencia laboral".
    culturalFit: 0.1, // Peso asignado a "Encaje cultural".
    education: 0.2, // Peso asignado a "Educación".
    additionalSkills: 0.15, // Peso asignado a "Habilidades adicionales".
  };

  /**
   * Propósito:
   * - Calcular las puntuaciones ponderadas sumando las puntuaciones individuales multiplicadas por sus respectivos pesos.
   */
  const totalScore = (
    evaluationScores.technicalSkills.score * weights.technicalSkills +
    evaluationScores.workExperience.score * weights.workExperience +
    evaluationScores.culturalFit.score * weights.culturalFit +
    evaluationScores.education.score * weights.education +
    evaluationScores.additionalSkills.score * weights.additionalSkills
  );

  // Return the total score rounded to two decimal places
  return parseFloat(totalScore.toFixed(2)); // Devuelve la puntuación total redondeada a dos decimales.
};

export default calculateScores;
