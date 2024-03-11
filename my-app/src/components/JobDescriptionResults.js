import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function JobDescriptionResults() {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [description, setDescription] = useState(
    `Company Name: 
Apple

Role: 
Computer Engineer

Brief description:
 We are looking for a Computer Engineer to join our team and support our organization’s computer networks along with our Information Technology (IT) department. Computer Engineer responsibilities include designing, testing, and inspecting all software used within an organization’s computer system. Ultimately, you will be responsible for upgrading various types of hardware like routers and motherboards as needed.

Responsibilities:
Conduct validation testing for new and renovated motherboards
Ensure existing computer equipment are up-to-date
Stay up-to-date with the latest technologies and incorporate new technology into existing units
Draft new computer equipment blueprints and present them to management
Plan and manage the production of computer hardware equipment

Qualifications:
Proven work experience as a Computer Engineer or similar role
Strong knowledge of design analytics, algorithms, and measuring tools
Excellent verbal and written communication skills
A creative thinker with good analytical abilities
Proficient in problem-solving to resolve issues in a timely manner
Bachelor’s degree in computer engineering or computer science training preferred`
  );


  const sections = description.split('\n\n').map((section, index) => {
    const [title, ...contentLines] = section.split('\n');
    return { title, content: contentLines };
  });
  

  const DescriptionSection = ({ title, content }) => (
    <div className="description-section">
      <h3 className="description-title">{title}</h3>
      <ul className="description-content">
        {content.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
  );
  

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  const handleConfirm = () => {
    console.log(sections);
    setIsEditing(false); 
    console.log('Description confirmed:', description);
    navigate("/CvUpload", { state: { sections } });
  };

  return (
    <div className="container">
      <h2>Generated Job Description</h2>
      {isEditing ? (
        <textarea className="textarea" value={description} onChange={handleDescriptionChange} maxLength="10000" style={{resize: 'none', height: '500px' }}/>
      ) : (
        sections.map((section, index) => (
          <DescriptionSection key={index} title={section.title} content={section.content} />
        ))
      )}
      <button className="App-button-blue" onClick={handleEditToggle}> {isEditing ? 'Stop Editing' : 'Edit'} </button>
      <button className="App-button-green" onClick={handleConfirm}> Confirm </button>
    </div>
  );
}

export default JobDescriptionResults;
