
import { useContext } from 'react';

import {useDrop} from 'react-dnd';
import DragAndDropItems from './DragAndDropItems'

import ResumeContext from "./ResumeContext";

import './Separator.css';



const findAndRemoveNode = (nodeList, nodeId) => {
  for (let i = 0; i < nodeList.length; i++) {
    const child = nodeList[i];
    if (child.id === nodeId) {
      nodeList.splice(i, 1); 
      return child;
    }
    if (child?.children?.length > 0) {
      const removedNode = findAndRemoveNode(child.children, nodeId);
      if (removedNode) {
        return removedNode;
      }
    }
  }
  return null;
};

const findNodeByPath = (nodeList, path) => {
  const [currentId, ...restPath] = path;
  for (let node of nodeList) {
    if (node.id === currentId) {
      if (restPath.length === 0) {
        return node;
      }
      if (node.children) {
        return findNodeByPath(node.children, restPath);
      }
    }
  }
  return null;
};

// Recursive function to find the parent node of a given node by materialized path
const findParentNode = (nodeList, path) => {
  if (path.length <= 1) {
    return null; // No parent exists if the path has only one or no elements
  }
  const parentPath = path.slice(0, -1); // Remove the last element to get the parent path
  return findNodeByPath(nodeList, parentPath);
};


const Separator = ({id, materialised_path, relative_position}) => {

  // relative_position is 'first_child' or 'next_sibling'
    const { data, setData } = useContext(ResumeContext);

    const [{ isOver }, drop] = useDrop(() => ({
        accept: DragAndDropItems.RESUME_NODE,
        drop: (item) => handleDrop(item),
        collect: (monitor) => ({
          isOver: !!monitor.isOver(),
        }),
      }));

    const handleDrop = (item) => {
      if (materialised_path.includes(item?.id)) {
        alert('Cannot move a node to a descendant position.')
        return
      } 

      const newData = structuredClone(data); // Create a deep copy of the data.

      // Step 1: Find and remove the node from its current position.
      const nodeToMove = findAndRemoveNode(newData, item.id);

      if (nodeToMove) {
        // Step 2: Find the target node where the dragged node will be dropped.
        const targetNode = findNodeByPath(newData, materialised_path);

  
      // Step 3: Insert the node in the appropriate position.
      if (relative_position === 'first_child') {
        targetNode.children = targetNode.children || [];
        targetNode.children.unshift(nodeToMove);
      } else if (relative_position === 'next_sibling') {
        const parentNode = findParentNode(newData, materialised_path);
        const targetIndex = parentNode.children.findIndex(child => child.id === id);
        parentNode.children.splice(targetIndex + 1, 0, nodeToMove);
      }

      setData(newData);
      alert('Node moved successfully');
      } else {
        alert('Node not found.');
      }

    };

    return (


        <div 
            ref={(resume_node) => drop(resume_node)}  // Only apply drop, not drag
            className={`separator ${isOver ? 'over' : ''}`}>
        </div>

    );
};


export default Separator;