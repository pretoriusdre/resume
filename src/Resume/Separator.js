
import { useContext } from 'react';

import {useDrop} from 'react-dnd';
import DragAndDropItems from './DragAndDropItems'

import ResumeContext from "./ResumeContext";

import './Separator.css';

import {findAndRemoveNode, findNodeByPath, findParentNode} from './nodeProcessing'

const Separator = ({id, materialised_path, relative_position}) => {

  // relative_position must be 'first_child' or 'next_sibling'
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

      const newData = structuredClone(data);


      const nodeToMove = findAndRemoveNode(newData, item.id);

      if (nodeToMove) {

        const targetNode = findNodeByPath(newData, materialised_path);
  
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