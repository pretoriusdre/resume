import React, { useEffect, useState, useContext } from 'react';
import { findAndUpdateNode, findAndRemoveNode} from "./nodeProcessing";
import ResumeContext from "./ResumeContext";
import './EditingPane.css';

const EditingPane = () => {
  const { activeNode, setActiveNode, data, setData } = useContext(ResumeContext);
  const [formData, setFormData] = useState({
    id: '',
    value: '',
    element: 'span',
    attributes: '',
    start_collapsed: false,
    hidden: false,
    always_show : false
  });

  useEffect(() => {
    if (activeNode) {
      setFormData({
        id: activeNode.id || '',
        value: activeNode.value || '',
        element: activeNode.meta?.element || 'span',
        attributes: JSON.stringify(activeNode.meta?.attributes || {}, null, 2),
        start_collapsed: activeNode.meta?.start_collapsed || false,
        hidden: activeNode.meta?.hidden || false,
        always_show : activeNode.meta?.always_show || false
      });
    }
  }, [activeNode]);

  const handleChange = (e) => {
    e.preventDefault();
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
        start_collapsed: formData.start_collapsed,
        hidden: formData.hidden,
        always_show : formData.always_show
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

  const handleDelete = (e) => {
    e.preventDefault();
    console.log('Deleting node:', formData.id);

    const updatedData = [...data];
    const oldNode = findAndRemoveNode(updatedData, formData.id)

    if (oldNode) {
      // Set the updated data back to the context
      setData(updatedData);
      console.log('Node deleted: ', oldNode.id);
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
      You can make changes locally and export to JSON, but persisting those changes requires edit access to the repository.
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
              name="start_collapsed"
              checked={formData.start_collapsed}
              onChange={handleChange}
            />
            Start Collapsed?
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
            Hidden?
          </label>
        </div>

        <div>
          <label>
            <input
              type="checkbox"
              name="always_show"
              checked={formData.always_show}
              onChange={handleChange}
            />
            Always show?
          </label>
        </div>

        <button type="submit">Update</button>
        <button type="button" onClick={handleDelete}>Delete</button>
      </form>

      {JSON.stringify(data.children)}
    </div>
  );
};

export default EditingPane;
