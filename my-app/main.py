from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from typing import List

from openai import OpenAI
client = OpenAI()

# Import system prompts
from prompts import (
    JOB_DESCRIPTION_SYSTEM_PROMPT,
    JOB_ANALYSIS_SYSTEM_PROMPT,
    CV_ANONYMIZATION_SYSTEM_PROMPT,
    CANDIDATE_ANALYSIS_SYSTEM_PROMPT,
    INTERVIEW_QUESTIONS_SYSTEM_PROMPT,
)

# Initialize FastAPI app
app = FastAPI()

# Configure CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Restrict origins to localhost:3000
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)

# Input and Output models for Job Description
class JobDescriptionRequest(BaseModel):
    companyName: str
    sector: str
    role: str
    responsibilities: list[str]
    qualifications: list[str]

class JobDescriptionResponse(BaseModel):
    companyName: str
    role: str
    briefDescription: str
    responsibilities: list[str]
    qualifications: list[str]

# User Prompt for Job Description
JOB_DESCRIPTION_USER_PROMPT_TEMPLATE = (
    "Generate a job description for the following role:"
    "Company: {companyName}"
    "Sector: {sector}"
    "Role: {role}"
    "Responsibilities: {responsibilities}"
    "Qualifications: {qualifications}"
    "Always respond in English."
)

@app.post("/api/generateJobDescription", response_model=JobDescriptionResponse)
async def generate_job_description(request: JobDescriptionRequest):
    """
    Generate a detailed job description based on the provided input.
    Input: JobDescriptionRequest (companyName, sector, role, responsibilities, qualifications).
    Output: JobDescriptionResponse (companyName, role, briefDescription, responsibilities, qualifications).
    """
    print("[JobDescription] Method activated.")
    print("[JobDescription] Request received:", request.dict())
    try:
        user_prompt = JOB_DESCRIPTION_USER_PROMPT_TEMPLATE.format(
            companyName=request.companyName,
            sector=request.sector,
            role=request.role,
            responsibilities=", ".join(request.responsibilities),
            qualifications=", ".join(request.qualifications)
        )
        print("[JobDescription] User prompt sent to AI:", user_prompt)

        completion = client.beta.chat.completions.parse(
            model="gpt-4o-2024-08-06",
            messages=[
                {"role": "system", "content": JOB_DESCRIPTION_SYSTEM_PROMPT},
                {"role": "user", "content": user_prompt},
            ],
            response_format=JobDescriptionResponse,
        )

        structured_response = completion.choices[0].message.parsed
        print("[JobDescription] AI response received:", structured_response)
        return structured_response.model_dump()
    except Exception as e:
        print("[JobDescription] Error:", str(e))
        raise HTTPException(status_code=500, detail="Error generating job description")

# Input and Output models for Job Analysis
class AnalyzeJobRequest(BaseModel):
    jobDescription: str

class AnalyzeJobResponse(BaseModel):
    jobTitle: str
    keyTechnicalSkills: List[str]
    keyInterpersonalSkills: List[str]
    responsibilities: List[str]
    requirements: List[str]
    overview: str

# User Prompt for Job Analysis
JOB_ANALYSIS_USER_PROMPT_TEMPLATE = (
    "Analyze the following job description and extract structured information:\n{jobDescription}\n"
    "Always respond in English."
)

@app.post("/api/analyzeJob", response_model=AnalyzeJobResponse)
async def analyze_job_description(request: AnalyzeJobRequest):
    """
    Analyze a job description to extract structured information.
    Input: AnalyzeJobRequest (jobDescription).
    Output: AnalyzeJobResponse (jobTitle, keyTechnicalSkills, keyInterpersonalSkills, responsibilities, requirements, overview).
    """
    print("[JobAnalysis] Method activated.")
    print("[JobAnalysis] Request received:", request.dict())
    try:
        user_prompt = JOB_ANALYSIS_USER_PROMPT_TEMPLATE.format(jobDescription=request.jobDescription)
        print("[JobAnalysis] User prompt sent to AI:", user_prompt)

        completion = client.beta.chat.completions.parse(
            model="gpt-4o-2024-08-06",
            messages=[
                {"role": "system", "content": JOB_ANALYSIS_SYSTEM_PROMPT},
                {"role": "user", "content": user_prompt},
            ],
            response_format=AnalyzeJobResponse,
        )

        structured_response = completion.choices[0].message.parsed
        print("[JobAnalysis] AI response received:", structured_response)
        return structured_response.model_dump()
    except Exception as e:
        print("[JobAnalysis] Error:", str(e))
        raise HTTPException(status_code=500, detail="Error analyzing job description")

# Input and Output models for CV Anonymization
class CVAnonymizationRequest(BaseModel):
    cv: str

class CVAnonymizationResponse(BaseModel):
    anonymizedCV: str

# User Prompt for CV Anonymization
CV_ANONYMIZATION_USER_PROMPT_TEMPLATE = (
    "Here is a CV to anonymize:\n{cv}\n"
    "Always respond in English."
)
@app.post("/api/anonymizeCV", response_model=CVAnonymizationResponse)
async def anonymize_cv(request: CVAnonymizationRequest):
    """
    Anonymize a CV to reduce bias in hiring practices.
    Input: CVAnonymizationRequest (cv).
    Output: CVAnonymizationResponse (anonymizedCV).
    """
    print("[CVAnonymization] Method activated.")
    print("[CVAnonymization] Request received:", request.dict())
    try:
        user_prompt = CV_ANONYMIZATION_USER_PROMPT_TEMPLATE.format(cv=request.cv)
        print("[CVAnonymization] User prompt sent to AI:", user_prompt)

        completion = client.beta.chat.completions.parse(
            model="gpt-4o-2024-08-06",
            messages=[
                {"role": "system", "content": CV_ANONYMIZATION_SYSTEM_PROMPT},
                {"role": "user", "content": user_prompt},
            ],
        )

        anonymized_cv = completion.choices[0].message.content
        print("[CVAnonymization] AI response received:", anonymized_cv)
        return CVAnonymizationResponse(anonymizedCV=anonymized_cv)
    except Exception as e:
        print("[CVAnonymization] Error:", str(e))
        raise HTTPException(status_code=500, detail="Error anonymizing CV")
    
# Input and Output models for Candidate Analysis
class Summary(BaseModel):
    keySkills: List[str]
    relevantExperience: str
    education: str
    other: List[str]

class TechnicalSkills(BaseModel):
    keySkills: List[str]
    justification: str

class InterpersonalSkills(BaseModel):
    keySkills: List[str]
    justification: str

class JobFit(BaseModel):
    technicalSkills: TechnicalSkills
    interpersonalSkills: InterpersonalSkills

class StrengthsAndWeaknesses(BaseModel):
    strengths: List[str]
    areasForImprovement: List[str]

class EvaluationScore(BaseModel):
    score: int
    justification: str

class EvaluationScores(BaseModel):
    technicalSkills: EvaluationScore
    workExperience: EvaluationScore
    culturalFit: EvaluationScore
    education: EvaluationScore
    additionalSkills: EvaluationScore

class Recommendations(BaseModel):
    candidate: str
    recruiter: str

class JobAnalysis(BaseModel):
    jobTitle: str
    summary: Summary
    jobFit: JobFit
    strengthsAndWeaknesses: StrengthsAndWeaknesses
    evaluationScores: EvaluationScores
    recommendations: Recommendations

class AnalyzeCandidateRequest(BaseModel):
    jobAnalysis: str
    candidateCV: str

class CandidateCVResponse(BaseModel):
    jobTitle: str
    summary: Summary
    jobFit: JobFit
    strengthsAndWeaknesses: StrengthsAndWeaknesses
    evaluationScores: EvaluationScores
    recommendations: Recommendations

# Prompts


CANDIDATE_ANALYSIS_USER_PROMPT_TEMPLATE = (
    "Analyze the following job description and candidate CV, then generate a structured evaluation. "
    "Ensure that every point in your analysis is directly supported by the candidate’s CV, and that you align those points "
    "with the job requirements where applicable. Strictly follow the format outlined in the system prompt above."
    "\nJob Analysis: {jobAnalysis}"
    "\nCV: {candidateCV}"
)

@app.post("/api/analyzeCandidate", response_model=CandidateCVResponse)
async def analyze_candidate_cv(request: AnalyzeCandidateRequest):
    """
    Analyze a candidate's CV and provide a structured evaluation.
    Input: AnalyzeCandidateRequest (jobAnalysis, candidateCV).
    Output: CandidateCVResponse (jobTitle, summary, jobFit, strengthsAndWeaknesses, evaluationScores, recommendations).
    """
    print("[CandidateAnalysis] Method activated.")
    print("[CandidateAnalysis] Request received:", request.dict())
    try:
        user_prompt = CANDIDATE_ANALYSIS_USER_PROMPT_TEMPLATE.format(
            jobAnalysis=request.jobAnalysis,
            candidateCV=request.candidateCV
        )
        print("[CandidateAnalysis] User prompt sent to AI:", user_prompt)

        completion = client.beta.chat.completions.parse(
            model="gpt-4o-2024-08-06",
            messages=[
                {"role": "system", "content": CANDIDATE_ANALYSIS_SYSTEM_PROMPT},
                {"role": "user", "content": user_prompt},
            ],
            response_format=CandidateCVResponse,
        )

        structured_response = completion.choices[0].message.parsed
        print("[CandidateAnalysis] AI response received:", structured_response)
        return structured_response.model_dump()
    except Exception as e:
        print("[CandidateAnalysis] Error:", str(e))
        raise HTTPException(status_code=500, detail=f"Validation error: {str(e)}")


# Input and Output models for Interview Questions
class InterviewQuestionsRequest(BaseModel):
    jobAnalysis: str
    candidateCV: str
    numberOfQuestions: int

class InterviewQuestionsResponse(BaseModel):
    questions: List[str]

# User Prompt for Interview Questions
INTERVIEW_QUESTIONS_USER_PROMPT_TEMPLATE = (
    "Generate {numberOfQuestions} interview questions based on the provided job description and candidate CV."
)

@app.post("/api/generateInterviewQuestions", response_model=InterviewQuestionsResponse)
async def generate_interview_questions(request: InterviewQuestionsRequest):
    """
    Generate interview questions based on the job analysis and candidate CV.
    Input: InterviewQuestionsRequest (jobAnalysis, candidateCV, numberOfQuestions).
    Output: InterviewQuestionsResponse (questions).
    """
    print("[InterviewQuestions] Method activated.")
    print("[InterviewQuestions] Request received:", request.dict())
    try:
        user_prompt = INTERVIEW_QUESTIONS_USER_PROMPT_TEMPLATE.format(
            numberOfQuestions=request.numberOfQuestions,
            jobAnalysis=request.jobAnalysis,
            candidateCV=request.candidateCV
        )
        print("[InterviewQuestions] User prompt sent to AI:", user_prompt)

        completion = client.beta.chat.completions.parse(
            model="gpt-4o-2024-08-06",
            messages=[
                {"role": "system", "content": INTERVIEW_QUESTIONS_SYSTEM_PROMPT},
                {"role": "user", "content": user_prompt},
            ],
            response_format=InterviewQuestionsResponse,
        )

        structured_response = completion.choices[0].message.parsed
        print("[InterviewQuestions] AI response received:", structured_response)
        return structured_response.model_dump()
    except Exception as e:
        print("[InterviewQuestions] Error:", str(e))
        raise HTTPException(status_code=500, detail="Error generating interview questions")
