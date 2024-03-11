import React, { useState } from 'react';

function JobDescriptionQuestionnaire({ onSubmit }) {
  const [answers, setAnswers] = useState({
    companyName: '',
    role: '',
    responsibilities: '',
    qualifications: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(name, value);
    setAnswers
    (prevAnswers => ({
          ...prevAnswers,
          [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // onSubmit(answers);  This function could send the answers to the AI system
    console.log('Answers submitted to AI:', answers);
  };

  const autoResizeTextarea = (event) => {
    const textarea = event.target;
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
  };

  return (
    <div className="container">
      <h2>AI-Assisted Job Description Creation</h2>
      <p>Please answer the following key questions. Your answers will be used by our AI to generate a tailored job description.</p>
      
      <form onSubmit={handleSubmit} className="JobDescriptionQuestionnaire-form">
  
        <label>
        Company Name: (100 characters max)              
        <textarea
          name="companyName"
          value={answers.companyName}
          onChange={(e) => {
            handleChange(e);
            autoResizeTextarea(e);
          }}
          maxLength="100"
          style={{resize: 'none', maxHeight: '150px'}}
          />
        </label>

        <label>
          Role: (100 characters max)            
        <textarea
          name="role"
          value={answers.role}
          onChange={(e) => {
            handleChange(e);
            autoResizeTextarea(e);
          }}
          maxLength="100"
          style={{resize: 'none', maxHeight: '150px'}}
          />
        </label>

        <label>
          Responsibilities: (1.000 characters max)        
        <textarea
          name="responsibilities"
          value={answers.responsibilities}
          onChange={(e) => {
            handleChange(e);
            autoResizeTextarea(e);
          }}
          maxLength="1000"
          style={{resize: 'none', maxHeight: '150px'}}
          />
        </label>
        
        <label>
          Qualifications: (1.000 characters max)              
        <textarea
          name="qualifications"
          value={answers.qualifications}
          onChange={(e) => {
            handleChange(e);
            autoResizeTextarea(e);
          }}
          maxLength="1000"
          style={{resize: 'none', maxHeight: '150px'}}
          />
        </label>
                
        <button className="App-button-green" type="submit">Submit Answers</button>
      </form>
    </div>
  );
}

export default JobDescriptionQuestionnaire;
