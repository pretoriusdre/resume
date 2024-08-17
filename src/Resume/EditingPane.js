import React, { useEffect, useState, useContext } from 'react';

import './EditingPane.css';

import ResumeContext from "./ResumeContext";


const EditingPane = () => {

  const { isEditing, setIsEditing } = useContext(ResumeContext);

  const { activeNode, setActiveNode } = useContext(ResumeContext);

  const toggleEditing = () => {
    setIsEditing(!isEditing);
  }


  const handleSubmit = () => {

  };


  const handleChange = () => {

  };


  function removeChildrenAttribute(node) {
    // Destructure the node and exclude the `children` property
    if (node === null || node === undefined) {
      return null;
    }
    const { children, ...nodeWithoutChildren } = node;
    return nodeWithoutChildren;
  };

  const dataWithoutChildren = removeChildrenAttribute(activeNode);

  return (
        <div>
          <h2>Editing feature: Work in progress</h2>
          <form onSubmit={handleSubmit}>
          <span>id: </span><span>{dataWithoutChildren?.id}</span>
          <textarea
            value={JSON.stringify(dataWithoutChildren, null, 4)}
            onChange={handleChange}
            className="textarea-custom"
          />
          <button type="submit">Submit</button>
        </form>
        </div>
  );
};

export default EditingPane;