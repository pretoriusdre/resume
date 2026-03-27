import React, { useEffect, useState, useContext } from 'react';
import { findAndUpdateNode, findAndRemoveNode } from "../../utils/nodeProcessing";
import ResumeContext from "../ResumeContext/ResumeContext";
import './EditingPane.css';

import { v4 as uuidv4 } from 'uuid';

const EditingPane = () => {
  const { activeNode, setActiveNode, resumeContent, setResumeContent, setWasChanged } = useContext(ResumeContext);

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const [formData, setFormData] = useState({
    id: '',
    value: '',
    type: 'line',
    ref: '',
    start_collapsed: false,
    hidden: false,
    prevent_toggle: false
  });


  useEffect(() => {
    if (activeNode) {
      setShowDeleteConfirm(false);
      setFormData({
        id: activeNode.id || '',
        value: activeNode.value || '',
        type: activeNode.type || 'line',
        ref: activeNode.ref || '',
        start_collapsed: activeNode.start_collapsed || false,
        hidden: activeNode.hidden || false,
        prevent_toggle: activeNode.prevent_toggle || false
      });
    }
  }, [activeNode]);


  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    setHasUnsavedChanges(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const updatedData = structuredClone(resumeContent);
    const updatedNode = findAndUpdateNode(updatedData, formData.id, {
      value: formData.value,
      type: formData.type,
      ref: formData.ref,
      hidden: formData.hidden,
      start_collapsed: formData.start_collapsed,
      prevent_toggle: formData.prevent_toggle
    });

    if (updatedNode) {
      setResumeContent(updatedData);
      setActiveNode(updatedNode);
      setWasChanged(true);
      setHasUnsavedChanges(false);
    } else {
      console.error('Node not found.');
    }
  };

  const confirmDelete = () => {
    const updatedData = structuredClone(resumeContent);
    const oldNode = findAndRemoveNode(updatedData, formData.id);

    if (oldNode) {
      setResumeContent(updatedData);
      setActiveNode(null);
      setWasChanged(true);
    } else {
      console.error('Node not found.');
    }
    setShowDeleteConfirm(false);
  };

  const handleAddChild = () => {
    const updatedData = structuredClone(resumeContent);

    const newNode = {
      id: uuidv4(),
      value: 'Placeholder',
      type: 'line',
      ref: '',
      hidden: false,
      start_collapsed: false,
      prevent_toggle: false
    };

    const targetNode = findAndUpdateNode(updatedData, activeNode.id, {});
    if (targetNode) {
      targetNode.children = targetNode.children || [];
      targetNode.children.push(newNode);

      setResumeContent(updatedData);
      setActiveNode(newNode);
      setWasChanged(true);
    } else {
      console.error('Node not found.');
    }
  };


  if (!activeNode) {
    return <div>Select a node to edit</div>;
  }

  return (
    <div>
      <h2>Edit node</h2>
      <ul>
        <li>Feel free to test the editing functionality.</li>
        <li>You can make changes locally and export to JSON, but persisting those changes requires edit access to the repository.</li>
        <li>Delete the first (root) node to start from a basic template.</li>
        <li>Drag nodes to move them.</li>
      </ul>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="node-id">ID:</label>
          <input
            id="node-id"
            type="text"
            name="id"
            value={formData.id}
            readOnly
            className="custominput readonly"
          />
        </div>

        <div>
          <label htmlFor="node-value">Value:</label>
          <textarea
            id="node-value"
            name="value"
            value={formData.value}
            onChange={handleChange}
            className="custominput textarea"
          />
        </div>

        <div>
          <label htmlFor="node-type">Element Type:</label>
          <select
            id="node-type"
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="custominput"
          >
            <option value="title">title</option>
            <option value="subtitle">subtitle</option>
            <option value="section">section</option>
            <option value="subsection">subsection</option>
            <option value="line">line</option>
            <option value="paragraph">paragraph</option>
            <option value="image">image</option>
            <option value="link">link</option>
            <option value="iframe">iframe</option>
            <option value="promptinjection">promptinjection</option>
          </select>
        </div>

        {['image', 'link', 'iframe'].includes(formData.type) && (
          <div>
            <label htmlFor="node-ref">Reference url:</label>
            <input
              id="node-ref"
              type="text"
              name="ref"
              value={formData.ref}
              onChange={handleChange}
              className="custominput"
            />
          </div>
        )}

        <div>
          <label>
            <input
              type="checkbox"
              name="hidden"
              checked={formData.hidden}
              onChange={handleChange}
            />
            {' '}Hidden?
          </label>
        </div>

        <div>
          <label>
            <input
              type="checkbox"
              name="start_collapsed"
              checked={formData.start_collapsed}
              onChange={handleChange}
            />
            {' '}Start collapsed?
          </label>
        </div>

        <div>
          <label>
            <input
              type="checkbox"
              name="prevent_toggle"
              checked={formData.prevent_toggle}
              onChange={handleChange}
            />
            {' '}Prevent toggle?
          </label>
        </div>

        <button type="submit" disabled={!hasUnsavedChanges}>Update</button>

        {showDeleteConfirm ? (
          <span className="delete-confirm">
            Delete node and all descendants?{' '}
            <button type="button" onClick={confirmDelete}>Yes, delete</button>
            <button type="button" onClick={() => setShowDeleteConfirm(false)}>Cancel</button>
          </span>
        ) : (
          <button type="button" onClick={() => setShowDeleteConfirm(true)}>Delete</button>
        )}

        <button type="button" onClick={handleAddChild}>Add child</button>

      </form>

      {hasUnsavedChanges && <div className='unsaved'>Unsaved changes!</div>}

    </div>
  );
};

export default EditingPane;
