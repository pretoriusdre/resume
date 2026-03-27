import { useContext } from 'react';

import { useDrop } from 'react-dnd';

import DragAndDropItems from '../DragAndDropItems/DragAndDropItems';

import ResumeContext from "../ResumeContext/ResumeContext";

import './Separator.css';

import { findAndRemoveNode, findNodeByPath, findParentNode } from '../../utils/nodeProcessing';


const Separator = ({ id, materialised_path, relative_position }) => {

    // relative_position must be 'first_child' or 'next_sibling'
    const { setResumeContent, setWasChanged } = useContext(ResumeContext);

    const [{ isOver }, drop] = useDrop(() => ({
        accept: DragAndDropItems.RESUME_NODE,
        drop: (item) => handleDrop(item),
        collect: (monitor) => ({
            isOver: !!monitor.isOver(),
        }),
    }));

    const handleDrop = (item) => {
        if (materialised_path.includes(item?.id)) {
            // Silently block — dropping a node onto a descendant position is a no-op
            return;
        }

        setResumeContent((prevData) => {
            const newData = structuredClone(prevData);

            const nodeToMove = findAndRemoveNode(newData, item.id);
            if (!nodeToMove) {
                console.error('Drag-and-drop: source node not found.', item.id);
                return prevData;
            }

            if (materialised_path.length === 1 && relative_position === 'next_sibling') {
                const rootIndex = newData.findIndex(n => n.id === id);
                newData.splice(rootIndex + 1, 0, nodeToMove);
            } else if (materialised_path.length === 1 && relative_position === 'first_child') {
                const rootNode = newData.find(n => n.id === id);
                rootNode.children = rootNode.children || [];
                rootNode.children.unshift(nodeToMove);
            } else {
                const targetNode = findNodeByPath(newData, materialised_path);

                if (relative_position === 'first_child') {
                    targetNode.children = targetNode.children || [];
                    targetNode.children.unshift(nodeToMove);
                } else if (relative_position === 'next_sibling') {
                    const parentNode = findParentNode(newData, materialised_path);
                    if (!parentNode) {
                        console.error('Drag-and-drop: parent node not found.');
                        return prevData;
                    }
                    const targetIndex = parentNode.children.findIndex(child => child.id === id);
                    parentNode.children.splice(targetIndex + 1, 0, nodeToMove);
                }
            }

            return newData;
        });
        setWasChanged(true);
    };


    return (
        <div
            ref={(el) => drop(el)}
            className={`separator ${isOver ? 'over' : ''}`}
        />
    );

};


export default Separator;
