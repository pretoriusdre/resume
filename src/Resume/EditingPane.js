import React, { useEffect, useState, useContext } from 'react';
import { findAndUpdateNode } from "./nodeProcessing";
import ResumeContext from "./ResumeContext";
import './EditingPane.css';

const EditingPane = () => {
  const { activeNode, setActiveNode, data, setData } = useContext(ResumeContext);
  const [formData, setFormData] = useState({
    id: '',
    value: '',
    element: 'span',
    attributes: '',
    collapsed: false,
    hidden: false,
  });

  useEffect(() => {
    if (activeNode) {
      setFormData({
        id: activeNode.id || '',
        value: activeNode.value || '',
        element: activeNode.meta?.element || 'span',
        attributes: JSON.stringify(activeNode.meta?.attributes || {}, null, 2),
        collapsed: activeNode.meta?.collapsed || false,
        hidden: activeNode.meta?.hidden || false,
      });
    }
  }, [activeNode]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Create a shallow copy of data to avoid mutating the state directly
    const updatedData = [...data];

    let parsedAttributes;
    try {
      parsedAttributes = JSON.parse(formData.attributes);
    } catch (error) {
      alert('Invalid JSON in attributes.');
      return;
    }
    
    // Update the node using findAndUpdateNode
    const updatedNode = findAndUpdateNode(updatedData, formData.id, {
      value: formData.value,
      meta: {
        element: formData.element,
        attributes: parsedAttributes,
        collapsed: formData.collapsed,
        hidden: formData.hidden
      }
    });

    if (updatedNode) {
      // Set the updated data back to the context
      setData(updatedData);
      console.log('Node updated:', updatedNode);
    } else {
      console.error('Node not found.');
    }
  };

  const handleDelete = () => {
    console.log('Deleting node:', formData.id);
    // Implement delete logic here
    // setActiveNode(null);  // Example to remove the active node
  };

  if (!activeNode) {
    return <div>Select a node to edit</div>;
  }

  return (
    <div>
      <h2>Editing feature: This won't work unless you are me</h2>
      Feel free to experiment though.
      <form onSubmit={handleSubmit}>
        <div>
          <label>ID:</label>
          <input
            type="text"
            name="id"
            value={formData.id}
            readOnly
            className="readonly-field"
          />
        </div>
        
        <div>
          <label>Value:</label>
          <textarea
            name="value"
            value={formData.value}
            onChange={handleChange}
            className="textarea-custom"
          />
        </div>
        
        <div>
          <label>Element Type:</label>
          <select
            name="element"
            value={formData.element}
            onChange={handleChange}
            className="select-custom"
          >
            <option value="h1">h1</option>
            <option value="h2">h2</option>
            <option value="h3">h3</option>
            <option value="p">p</option>
            <option value="span">span</option>
            <option value="img">img</option>
            <option value="a">a</option>
            <option value="iframe">iframe</option>
          </select>
        </div>
        
        <div>
          <label>Attributes (JSON):</label>
          <textarea
            name="attributes"
            value={formData.attributes}
            onChange={handleChange}
            className="textarea-custom"
          />
        </div>
        
        <div>
          <label>
            <input
              type="checkbox"
              name="collapsed"
              checked={formData.collapsed}
              onChange={handleChange}
            />
            Collapsed
          </label>
        </div>
        
        <div>
          <label>
            <input
              type="checkbox"
              name="hidden"
              checked={formData.hidden}
              onChange={handleChange}
            />
            Hidden
          </label>
        </div>
        
        <button type="submit">Update</button>
        <button type="button" onClick={handleDelete}>Delete</button>
      </form>
    </div>
  );
};

export default EditingPane;
