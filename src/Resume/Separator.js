
import {useDrop } from 'react-dnd';
import DragAndDropItems from './DragAndDropItems'

//import ResumeContext from "./ResumeContext";

import './Separator.css';

const Separator = ({id, position}) => {
    const [{ isOver }, drop] = useDrop(() => ({
        accept: DragAndDropItems.RESUME_NODE,
        drop: (item) => handleDrop(item),
        collect: (monitor) => ({
          isOver: !!monitor.isOver(),
        }),
      }));

    const handleDrop = (item) => {
    //alert(`Dropped item with id: ${item.id} onto item with id: ${id}`);
    alert(JSON.stringify(item))
    };

    return (


        <div 
            ref={(resume_node) => drop(resume_node)}  // Only apply drop, not drag
            className={`separator ${isOver ? 'over' : ''}`}>
        </div>

    );
};


export default Separator;