const CandidateResultTester = {
  /**
   * validateCandidateResult
   * Purpose:
   * - Validate that the `candidateResult` object meets the expected format.
   * - Check the structure, data types, and content of the candidate analysis properties.
   * 
   * Input:
   * - `candidateResult`: Object containing the results of a candidate analysis.
   * 
   * Output:
   * - An object with:
   *   - `isValid`: Boolean indicating if the object matches the schema.
   *   - `errors`: List of error messages indicating validation issues.
   */
  validateCandidateResult(candidateResult) {
    const errors = []; // List to store error messages.

    // Validate `jobTitle`
    if (typeof candidateResult.jobTitle !== "string") {
      errors.push("jobTitle must be a string.");
    }

    // Validate `summary`
    if (
      !candidateResult.summary ||
      typeof candidateResult.summary !== "object"
    ) {
      errors.push("summary must be an object.");
    } else {
      if (!Array.isArray(candidateResult.summary.keySkills)) {
        errors.push("summary.keySkills must be an array of strings.");
      } else if (
        !candidateResult.summary.keySkills.every(skill => typeof skill === "string")
      ) {
        errors.push("summary.keySkills must contain only strings.");
      }

      if (typeof candidateResult.summary.relevantExperience !== "string") {
        errors.push("summary.relevantExperience must be a string.");
      }

      if (typeof candidateResult.summary.education !== "string") {
        errors.push("summary.education must be a string.");
      }

      if (!Array.isArray(candidateResult.summary.other)) {
        errors.push("summary.other must be an array of strings.");
      } else if (
        !candidateResult.summary.other.every(item => typeof item === "string")
      ) {
        errors.push("summary.other must contain only strings.");
      }
    }

    // Validate `jobFit`
    if (
      !candidateResult.jobFit ||
      typeof candidateResult.jobFit !== "object"
    ) {
      errors.push("jobFit must be an object.");
    } else {
      const { technicalSkills, interpersonalSkills } = candidateResult.jobFit;

      if (
        !technicalSkills ||
        typeof technicalSkills !== "object" ||
        !Array.isArray(technicalSkills.keySkills) ||
        !technicalSkills.keySkills.every(skill => typeof skill === "string") ||
        typeof technicalSkills.justification !== "string"
      ) {
        errors.push(
          "jobFit.technicalSkills must contain an array of keySkills (strings) and a justification (string)."
        );
      }

      if (
        !interpersonalSkills ||
        typeof interpersonalSkills !== "object" ||
        !Array.isArray(interpersonalSkills.keySkills) ||
        !interpersonalSkills.keySkills.every(skill => typeof skill === "string") ||
        typeof interpersonalSkills.justification !== "string"
      ) {
        errors.push(
          "jobFit.interpersonalSkills must contain an array of keySkills (strings) and a justification (string)."
        );
      }
    }

    // Validate `strengthsAndWeaknesses`
    if (
      !candidateResult.strengthsAndWeaknesses ||
      typeof candidateResult.strengthsAndWeaknesses !== "object"
    ) {
      errors.push("strengthsAndWeaknesses must be an object.");
    } else {
      const { strengths, areasForImprovement } = candidateResult.strengthsAndWeaknesses;

      if (
        !Array.isArray(strengths) ||
        !strengths.every(item => typeof item === "string")
      ) {
        errors.push(
          "strengthsAndWeaknesses.strengths must be an array of strings."
        );
      }

      if (
        !Array.isArray(areasForImprovement) ||
        !areasForImprovement.every(item => typeof item === "string")
      ) {
        errors.push(
          "strengthsAndWeaknesses.areasForImprovement must be an array of strings."
        );
      }
    }

    // Validate `evaluationScores`
    if (
      !candidateResult.evaluationScores ||
      typeof candidateResult.evaluationScores !== "object"
    ) {
      errors.push("evaluationScores must be an object.");
    } else {
      Object.entries(candidateResult.evaluationScores).forEach(
        ([category, { score, justification }]) => {
          if (typeof score !== "number") {
            errors.push(
              `evaluationScores.${category}.score must be a number.`
            );
          }

          if (typeof justification !== "string") {
            errors.push(
              `evaluationScores.${category}.justification must be a string.`
            );
          }
        }
      );
    }

    // Validate `recommendations`
    if (
      !candidateResult.recommendations ||
      typeof candidateResult.recommendations !== "object"
    ) {
      errors.push("recommendations must be an object.");
    } else {
      if (typeof candidateResult.recommendations.candidate !== "string") {
        errors.push("recommendations.candidate must be a string.");
      }

      if (typeof candidateResult.recommendations.recruiter !== "string") {
        errors.push("recommendations.recruiter must be a string.");
      }
    }

    return {
      isValid: errors.length === 0, // The object is valid if there are no errors.
      errors, // List of errors found during validation.
    };
  },
};

export default CandidateResultTester; // Export the module for external use.
