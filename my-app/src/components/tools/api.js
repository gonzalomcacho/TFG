// Helper function for logging and error handling 
const logAndHandleError = async (response, methodName) => {
    /**
     * Propósito:
     * - Registrar y manejar errores en las respuestas HTTP.
     * 
     * Input:
     * - `response`: Respuesta de la API con detalles del error.
     * - `methodName`: Nombre del método donde ocurrió el error.
     * 
     * Output:
     * - Lanza un error con detalles del método y el cuerpo de la respuesta.
     */
    const errorDetails = await response.text();
    console.error(`Error in ${methodName}:`, errorDetails);
    throw new Error(`${methodName} failed: ${errorDetails}`);
};

const logRequestAndResponse = (methodName, requestBody, responseBody) => {
    /**
     * Propósito:
     * - Registrar en consola las peticiones y respuestas de la API.
     * 
     * Input:
     * - `methodName`: Nombre del método que realiza la solicitud.
     * - `requestBody`: Cuerpo de la solicitud enviada.
     * - `responseBody`: Respuesta recibida de la API (opcional).
     * 
     * Output:
     * - Imprime en consola los detalles de la solicitud y respuesta.
     */
    console.log(`Calling ${methodName} with:`, JSON.stringify(requestBody, null, 2));
    if (responseBody) {
        console.log(`Response from ${methodName}:`, JSON.stringify(responseBody, null, 2));
    }
};

export const generateJobDescription = async (answers) => {
    /**
     * Propósito:
     * - Generar una descripción de trabajo basada en las respuestas proporcionadas.
     * 
     * Input:
     * - `answers`: Objeto con datos del trabajo, como empresa, rol, responsabilidades, etc.
     * 
     * Output:
     * - Respuesta de la API con la descripción generada.
     * 
     * Manejo de errores:
     * - Lanza un error si la respuesta de la API no es satisfactoria.
     */
    const methodName = "generateJobDescription";
    try {
        logRequestAndResponse(methodName, answers);
        const response = await fetch("http://127.0.0.1:8000/api/generateJobDescription", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(answers),
        });
        console.log(`${methodName} HTTP Status:`, response.status);
        if (!response.ok) await logAndHandleError(response, methodName);
        const responseData = await response.json();
        logRequestAndResponse(methodName, answers, responseData);
        return responseData;
    } catch (err) {
        console.error(`Error in ${methodName}:`, err.message);
        throw err;
    }
};

export const analyzeJobDescription = async (jobDescription) => {
    /**
     * Propósito:
     * - Analizar una descripción de trabajo proporcionada.
     * 
     * Input:
     * - `jobDescription`: Texto que describe el puesto a analizar.
     * 
     * Output:
     * - Respuesta de la API con el análisis de la descripción.
     * 
     * Manejo de errores:
     * - Lanza un error si la API responde con un estado no satisfactorio.
     */
    const methodName = "analyzeJobDescription";
    try {
        logRequestAndResponse(methodName, { jobDescription });
        const response = await fetch("http://127.0.0.1:8000/api/analyzeJob", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ jobDescription }),
        });
        console.log(`${methodName} HTTP Status:`, response.status);
        if (!response.ok) await logAndHandleError(response, methodName);
        const responseData = await response.json();
        logRequestAndResponse(methodName, { jobDescription }, responseData);
        return responseData;
    } catch (err) {
        console.error(`Error in ${methodName}:`, err.message);
        throw err;
    }
};

export const anonymizeCV = async (cv) => {
    /**
     * Propósito:
     * - Anonimizar el contenido de un CV.
     * 
     * Input:
     * - `cv`: Texto del CV a anonimizar.
     * 
     * Output:
     * - CV anonimizado como respuesta de la API.
     * 
     * Manejo de errores:
     * - Lanza un error si la API no responde satisfactoriamente.
     */
    const methodName = "anonymizeCV";
    try {
        logRequestAndResponse(methodName, { cv });
        const response = await fetch("http://127.0.0.1:8000/api/anonymizeCV", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ cv }),
        });
        console.log(`${methodName} HTTP Status:`, response.status);
        if (!response.ok) await logAndHandleError(response, methodName);
        const responseData = await response.json();
        logRequestAndResponse(methodName, { cv }, responseData);
        return responseData;
    } catch (err) {
        console.error(`Error in ${methodName}:`, err.message);
        throw err;
    }
};

export const analyzeCandidateCV = async (jobAnalysis, candidateCV) => {
    /**
     * Propósito:
     * - Analizar un CV en relación con un análisis previo del trabajo.
     * 
     * Input:
     * - `jobAnalysis`: Análisis del trabajo.
     * - `candidateCV`: Texto del CV del candidato.
     * 
     * Output:
     * - Respuesta de la API con el análisis del candidato.
     * 
     * Manejo de errores:
     * - Lanza un error si la API responde con un estado no satisfactorio.
     */
    const methodName = "analyzeCandidateCV";
    try {
        const requestBody = { jobAnalysis, candidateCV };
        logRequestAndResponse(methodName, requestBody);
        const response = await fetch("http://127.0.0.1:8000/api/analyzeCandidate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ jobAnalysis: JSON.stringify(jobAnalysis), candidateCV }),
        });
        console.log(`${methodName} HTTP Status:`, response.status);
        if (!response.ok) await logAndHandleError(response, methodName);
        const responseData = await response.json();
        logRequestAndResponse(methodName, requestBody, responseData);
        return responseData;
    } catch (err) {
        console.error(`Error in ${methodName}:`, err.message);
        throw err;
    }
};

export const generateInterviewQuestions = async (jobAnalysis, candidateCV, numberOfQuestions) => {
    /**
     * Propósito:
     * - Generar preguntas de entrevista personalizadas basadas en un análisis del trabajo y el CV.
     * 
     * Input:
     * - `jobAnalysis`: Análisis del trabajo.
     * - `candidateCV`: Texto del CV del candidato.
     * - `numberOfQuestions`: Número de preguntas deseadas.
     * 
     * Output:
     * - Lista de preguntas generadas por la API.
     * 
     * Manejo de errores:
     * - Lanza un error si la API no responde satisfactoriamente.
     */
    const methodName = "generateInterviewQuestions";
    try {
        const requestBody = { jobAnalysis, candidateCV, numberOfQuestions };
        logRequestAndResponse(methodName, requestBody);
        const response = await fetch("http://127.0.0.1:8000/api/generateInterviewQuestions", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(requestBody),
        });
        console.log(`${methodName} HTTP Status:`, response.status);
        if (!response.ok) await logAndHandleError(response, methodName);
        const responseData = await response.json();
        logRequestAndResponse(methodName, requestBody, responseData);
        return responseData;
    } catch (err) {
        console.error(`Error in ${methodName}:`, err.message);
        throw err;
    }
};
