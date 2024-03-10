import React, { useState } from 'react';
import './CvUpload.css';

function CvUpload({ onFileSelect }) {
  const [selectedFile, setSelectedFile] = useState(null);
//Create a way to archive files?
  
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };

  const analyzeCV = () => {
    // Your logic to analyze the CV goes here
    console.log('Analyzing the CV:', selectedFile.name);
    // You might call a backend service with the file
    // or perform some client-side analysis depending on your requirements
  };

  return (
    <div className="CvUpload-container">
      <div className="CvUpload-instructions">
        <h2>CV Upload</h2>
        <p>Please upload your CV in PDF format. Click the button below and select the file to upload.</p>
      </div>
      <div className="CvUpload-input">
        <label htmlFor="file-upload" className="CvUpload-label">
          {selectedFile ? "Change file" : "Select file"}
        </label>
        <input id="file-upload" type="file" onChange={handleFileChange} accept=".pdf" style={{ display: 'none' }} />
        {selectedFile && <p className="CvUpload-feedback">File selected: {selectedFile.name}</p>}
        {selectedFile && (<button className="CvUpload-analyze-button" onClick={analyzeCV}>Analyze CV</button>)}
      </div>
    </div>
  );
}

export default CvUpload;
