
import { useContext } from 'react';

import { useDrop } from 'react-dnd';
import DragAndDropItems from './DragAndDropItems'

import ResumeContext from "./ResumeContext";

import './Separator.css';

import { findAndRemoveNode, findNodeByPath, findParentNode } from './nodeProcessing'



const Separator = ({ id, materialised_path, relative_position }) => {

    // relative_position must be 'first_child' or 'next_sibling'
    const { setResumeContent } = useContext(ResumeContext);

    const [{ isOver }, drop] = useDrop(() => ({
        accept: DragAndDropItems.RESUME_NODE,
        drop: (item) => handleDrop(item),
        collect: (monitor) => ({
            isOver: !!monitor.isOver(),
        }),
    }));

    const handleDrop = (item) => {
        if (materialised_path.includes(item?.id)) {
            alert('Cannot move a node to a descendant position.');
            return;
        }

        setResumeContent((prevData) => {
            const newData = structuredClone(prevData); // Create a deep copy of the current state

            // Find and remove the node being moved
            const nodeToMove = findAndRemoveNode(newData, item.id);
            if (nodeToMove) {
                // Handle moving to the root level
                if (materialised_path.length === 1 && relative_position === 'next_sibling') {
                    // Insert node as the next root node
                    const rootNodeIndex = newData.findIndex(rootNode => rootNode.id === id);
                    newData.splice(rootNodeIndex + 1, 0, nodeToMove);
                } else if (materialised_path.length === 1 && relative_position === 'first_child') {
                    // Insert node as the first child of a root node
                    const rootNode = newData.find(rootNode => rootNode.id === id);
                    rootNode.children = rootNode.children || [];
                    rootNode.children.unshift(nodeToMove);
                } else {
                    // Find the target node where the dragged node will be inserted
                    const targetNode = findNodeByPath(newData, materialised_path);

                    if (relative_position === 'first_child') {
                        // Insert node as the first child of the target node
                        targetNode.children = targetNode.children || [];
                        targetNode.children.unshift(nodeToMove);
                    } else if (relative_position === 'next_sibling') {

                        // Find the parent node of the target node
                        const parentNode = findParentNode(newData, materialised_path);

                        // Handle the case where the parent node is null
                        if (parentNode === null) {
                            alert('Cannot find parent node.');
                            return prevData; // Return the original state if parentNode is null
                        }
                        // Insert node as the next sibling of the target node
                        const targetIndex = parentNode.children.findIndex(child => child.id === id);
                        parentNode.children.splice(targetIndex + 1, 0, nodeToMove);
                    }
                }

                return newData; // Return the updated state
            } else {
                alert('Node not found.');
                return prevData; // Return the original state if node not found
            }
        });
    };


    return (
        <div
            ref={(resume_node) => drop(resume_node)}  // Only apply drop, not drag
            className={`separator ${isOver ? 'over' : ''}`}>
        </div>
    );

};


export default Separator;