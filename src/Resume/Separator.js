
import {useDrop } from 'react-dnd';
import DragAndDropItems from './DragAndDropItems'

//import ResumeContext from "./ResumeContext";

import './Separator.css';

const Separator = ({id, materialised_path, relative_position}) => {
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
      } else {
        alert('Move node')
      };
  

    };

    return (


        <div 
            ref={(resume_node) => drop(resume_node)}  // Only apply drop, not drag
            className={`separator ${isOver ? 'over' : ''}`}>
        </div>

    );
};


export default Separator;