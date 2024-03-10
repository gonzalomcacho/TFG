import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './JobDescriptionUpload.css';

function JobDescriptionUpload({ onFileSelect }) {
  const [selectedJobDescription, setselectedJobDescription] = useState(null);
  const navigate = useNavigate();

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setselectedJobDescription(file);
  };

  return (
    <div className="JobDescriptionUpload-container">
      <div className="JobDescriptionUpload-instructions">
        <h2>Job Description Upload</h2>
        <p>Please upload the job description in PDF format. Click the button below and select the file to upload.</p>
      </div>
      <div className="JobDescriptionUpload-input">
        <label htmlFor="jd-upload" className="JobDescriptionUpload-label">
          {selectedJobDescription ? "Change file" : "Select file"}
        </label>
        <input id="jd-upload" type="file" onChange={handleFileChange} accept=".pdf" style={{ display: 'none' }} />
        {selectedJobDescription && <p className="JobDescriptionUpload-feedback">File selected: {selectedJobDescription.name}</p>}
      </div>
      {selectedJobDescription && (<button className="JobDescriptionUpload-keepgoing-button" onClick={() => {navigate("/CvUpload");}}>Keep going</button>)}
    </div>
  );
}

export default JobDescriptionUpload;
