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
          <h2>Editing feature: This won't work unless you are me</h2>
          Feel free to experiment though.
          <form onSubmit={handleSubmit}>

          <textarea
            value={JSON.stringify(dataWithoutChildren, null, 4)}
            onChange={handleChange}
            className="textarea-custom"
          />
          <button type="submit">Update</button>
        </form>
        </div>
  );
};

export default EditingPane;