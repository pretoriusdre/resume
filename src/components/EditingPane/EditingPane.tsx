import React, { useEffect, useState } from 'react';
import { useResumeContent } from '../ResumeContentContext/ResumeContentContext';
import { useResumeUI } from '../ResumeUIContext/ResumeUIContext';
import { NodeData, NodeType } from '../../types/resume';
import './EditingPane.css';

import { v4 as uuidv4 } from 'uuid';

interface FormData {
  id: string;
  value: string;
  type: NodeType;
  secondary_value: string;
  start_collapsed: boolean;
  hidden: boolean;
  prevent_toggle: boolean;
  always_print: boolean;
}

const EditingPane: React.FC = () => {
  const { resumeDocument, dispatch, setWasChanged } = useResumeContent();
  const { activeNode, setActiveNode } = useResumeUI();

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    id: '',
    value: '',
    type: 'line',
    secondary_value: '',
    start_collapsed: false,
    hidden: false,
    prevent_toggle: false,
    always_print: false,
  });


  useEffect(() => {
    if (activeNode) {
      setShowDeleteConfirm(false);
      setFormData({
        id: activeNode.id || '',
        value: activeNode.value || '',
        type: activeNode.type || 'line',
        secondary_value: activeNode.secondary_value || '',
        start_collapsed: activeNode.start_collapsed || false,
        hidden: activeNode.hidden || false,
        prevent_toggle: activeNode.prevent_toggle || false,
        always_print: activeNode.always_print || false,
      });
    }
  }, [activeNode]);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const isCheckbox = (e.target as HTMLInputElement).type === 'checkbox';
    const checked = (e.target as HTMLInputElement).checked;
    setFormData(prev => ({
      ...prev,
      [name]: isCheckbox ? checked : value,
    }));
    setHasUnsavedChanges(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch({
      type: 'UPDATE_NODE',
      id: formData.id,
      updates: {
        value: formData.value,
        type: formData.type,
        secondary_value: formData.secondary_value,
        hidden: formData.hidden,
        start_collapsed: formData.start_collapsed,
        prevent_toggle: formData.prevent_toggle,
        always_print: formData.always_print,
      },
    });
    setActiveNode({ ...(activeNode as NodeData), ...formData });
    setWasChanged(true);
    setHasUnsavedChanges(false);
  };

  const confirmDelete = () => {
    dispatch({ type: 'DELETE_NODE', id: formData.id });
    setActiveNode(null);
    setWasChanged(true);
    setShowDeleteConfirm(false);
  };

  const handleAddChild = () => {
    if (!activeNode) return;
    const newNode: NodeData = {
      id: uuidv4(),
      value: 'Placeholder',
      type: 'line',
      secondary_value: '',
      hidden: false,
      start_collapsed: false,
      prevent_toggle: false,
      always_print: false,
    };
    dispatch({ type: 'ADD_CHILD', parentId: activeNode.id, newNode });
    setActiveNode(newNode);
    setWasChanged(true);
  };


  if (!activeNode) {
    return <div>Select a node to edit</div>;
  }

  return (
    <div>
      <h2>Page settings</h2>
      <div>
        <label htmlFor="doc-title">Title:</label>
        <input
          id="doc-title"
          type="text"
          value={resumeDocument.title}
          onChange={e => { dispatch({ type: 'SET_TITLE', title: e.target.value }); setWasChanged(true); }}
          className="custominput"
        />
      </div>
      <div>
        <label htmlFor="page-size">Page size:</label>
        <select
          id="page-size"
          value={resumeDocument.page_size}
          onChange={e => { dispatch({ type: 'SET_PAGE_SIZE', page_size: e.target.value }); setWasChanged(true); }}
          className="custominput"
        >
          <option value="A4">A4</option>
          <option value="letter">Letter</option>
        </select>
      </div>

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
            <option value="role">role</option>
            <option value="promptinjection">promptinjection</option>
          </select>
        </div>

        {(['image', 'link', 'iframe', 'role'] as NodeType[]).includes(formData.type) && (
          <div>
            <label htmlFor="node-secondary-value">{formData.type === 'role' ? 'Date range:' : 'Reference url:'}</label>
            <input
              id="node-secondary-value"
              type="text"
              name="secondary_value"
              value={formData.secondary_value}
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

        <div>
          <label>
            <input
              type="checkbox"
              name="always_print"
              checked={formData.always_print}
              onChange={handleChange}
            />
            {' '}Always print?
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
