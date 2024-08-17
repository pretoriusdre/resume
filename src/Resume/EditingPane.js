import React, { useEffect, useState, useContext } from 'react';

import './EditingPane.css';

import ResumeContext from "./ResumeContext";


const EditingPane = () => {

  const { isEditing, setIsEditing } = useContext(ResumeContext);

  const { activeNode, setActiveNode } = useContext(ResumeContext);

  const toggleEditing = () => {
    setIsEditing(!isEditing);
  }



  return (
    <div className={`editing-pane ${isEditing ? 'open' : ''}`}>
        <div className='editing-pane-content'>
        <pre>
        {activeNode}
        </pre>
        </div>
    </div>



  );
};

export default EditingPane;