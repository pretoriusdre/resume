import React, { useEffect, useState, useContext } from 'react';
import { findAndUpdateNode, findAndRemoveNode, findParentNode} from "./nodeProcessing";
import ResumeContext from "./ResumeContext";
import './EditingPane.css';

import { v4 as uuidv4 } from 'uuid';

const EditingPane = () => {
  const { activeNode, setActiveNode, data, setData} = useContext(ResumeContext);
  const [formData, setFormData] = useState({
    id: '',
    value: '',
    type: 'line',
    start_collapsed: false,
    hidden: false,
    prevent_collapse : false
  });


  useEffect(() => {
    if (data.length === 0) {
      const newNodeTemplate = {
        id: uuidv4(),
        value: 'Your Name Here',
        type: 'title',
        start_collapsed: false,
        hidden: false,
        prevent_collapse: true,
      };
  
      setData([newNodeTemplate]);
    }
  }, [data]);


  useEffect(() => {
    if (activeNode) {
      setFormData({
        id: activeNode.id || '',
        value: activeNode.value || '',
        type: activeNode.type || 'line',
        start_collapsed: activeNode.start_collapsed || false,
        hidden: activeNode.hidden || false,
        prevent_collapse : activeNode.prevent_collapse || false
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
    
    const updatedData = structuredClone(data);

    // Update the node using findAndUpdateNode
    const updatedNode = findAndUpdateNode(updatedData, formData.id, {
      value: formData.value,
      type: formData.type,
      hidden: formData.hidden,
      start_collapsed: formData.start_collapsed,
      prevent_collapse : formData.prevent_collapse
    });

    if (updatedNode) {
      // Set the updated data back to the context
      setData(updatedData);
      setActiveNode(updatedNode);
      console.log('Node updated:', updatedNode);
    } else {
      console.error('Node not found.');
    }
  };

  const handleDelete = (e) => {
    e.preventDefault();

    // Confirm the deletion with the user
    const confirmed = window.confirm("Are you sure you want to delete this node and all descendants?");
    
    if (!confirmed) {
        return; // Exit the function if the user cancels
    }

    console.log('Deleting node:', formData.id);

    const updatedData = structuredClone(data);
    const oldNode = findAndRemoveNode(updatedData, formData.id)

    if (oldNode) {
      // Set the updated data back to the context
      setData(updatedData);
      setActiveNode(null);
      console.log('Node deleted: ', oldNode.id);
    } else {
      console.error('Node not found.');
    }
  };



  const handleAddChild = (e) => {
    e.preventDefault();
    
    const updatedData = structuredClone(data);

    const new_id = uuidv4();
    // Update the node using findAndUpdateNode
    const newNodeTemplate =  {
      id : new_id,
      value: 'Placeholder',
      type: 'line',
      hidden: false,
      start_collapsed: false,
      prevent_collapse : false
      };

    const targetNode = findAndUpdateNode(updatedData, activeNode.id, {});
    if (targetNode) {
      targetNode.children = targetNode.children || [];
      targetNode.children.push(newNodeTemplate);

      setData(updatedData);
      setActiveNode(newNodeTemplate);
      
      console.error('Added child node');
    } else {
      console.error('Node not found.');
    }
    
  };



  if (!activeNode) {
    return <div>Select a node to edit</div>;
  };

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
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="select-custom"
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
          </select>
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
              name="prevent_collapse"
              checked={formData.prevent_collapse}
              onChange={handleChange}
            />
            Prevent collapse?
          </label>
        </div>

        <button type="submit">Update</button>
        <button type="button" onClick={handleDelete}>Delete</button>
        <button type="button" onClick={handleAddChild}>Add child</button>

      </form>

      {JSON.stringify(data.children)}
    </div>
  );
};

export default EditingPane;


//        <button type="button" onClick={handleAddSibling}>Add sibling</button>