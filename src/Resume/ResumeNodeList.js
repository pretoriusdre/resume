
import React, { useState, useContext } from 'react';
import { useDrag } from 'react-dnd';

import ResumeContext from "./ResumeContext";
import DragAndDropItems from './DragAndDropItems'
import Separator from './Separator';




import './ResumeNodeList.css'


const ResumeNodeList = ({ nodeList, depth, materialised_path }) => {

    return (
        <div>
            {(nodeList || []).map((child) => (
                <ResumeNode
                    nodeData={child} depth={depth + 1}
                    materialised_path={[...materialised_path, child.id]}
                    key={child.id} />
            ))}
        </div>
    );
};


function ResumeNode({ nodeData, depth, materialised_path }) {

    // Context
    const { isEditing } = useContext(ResumeContext);
    const { activeNode, setActiveNode } = useContext(ResumeContext);

    // State
    const [collapsed, setCollapsed] = useState(nodeData?.start_collapsed || false);

    // Unpack main parameters from the ndoe
    const id = nodeData.id;
    const type = nodeData.type;
    const value = nodeData.value;
    const ref = nodeData.ref;
    const hidden = nodeData.hidden || false;
    //const start_collapsed = nodeData.start_collapsed || false;
    const prevent_collapse = nodeData.prevent_collapse || false;

    // Derived things for the node
    const hasChildren = ((nodeData?.children?.length > 0));
    const isActive = (id === activeNode?.id);


    const NodeIcon = (hasChildren ? (collapsed ? '+' : '-') : '>');
    const bulletClass = "bulletspan" + (hasChildren ? "" : " leaf");

    const modalClass = "imgmodal" + (collapsed ? "-hidden" : "")
    const element_img = (
        <div>
            <img src={`${process.env.PUBLIC_URL}${ref}`} className="imgtiny" onClick={toggleCollapse} title={value} alt={value} />
            <img src={`${process.env.PUBLIC_URL}${ref}`} className={modalClass} onClick={toggleCollapse} title={value} alt={value} />
        </div>
    );

    const collapsableElement = (
        prevent_collapse ?
            <span>{value}</span> :
            <span><span className={bulletClass} onClick={hasChildren ? toggleCollapse : null}>{NodeIcon}</span>{value}</span>
    );


    const getElement = () => {
        switch (type) {
            case 'title':
                return React.createElement('h1', {}, collapsableElement);
            case 'subtitle':
                return React.createElement('span', { className: 'subtitle' }, collapsableElement);
            case 'section':
                return React.createElement('h2', {}, collapsableElement);
            case 'subsection':
                return React.createElement('h3', {}, collapsableElement);
            case 'paragraph':
                return React.createElement('p', {}, collapsableElement);
            case 'line':
                return React.createElement('span', {}, collapsableElement);
            case 'image':
                return element_img;
            case 'link':
                return React.createElement('a', { 'href': ref, 'target': '_blank' }, value);
            case 'iframe':
                return React.createElement('iframe',
                    {
                        'src': ref,
                        'title': id,
                        'width': '640px',
                        'height': '385px',
                        'allowFullScreen': true,
                        'allow': 'autoplay'
                    }, value
                );
            default:
                return <span>{id}{type}</span>;
        };
    };


    const [{ isDragging }, drag] = useDrag(() => ({
        type: DragAndDropItems.RESUME_NODE,
        item: { id },
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
        }),
    }));

    const handleDrag = (resume_node) => drag(resume_node);

    function toggleCollapse() {
        if (collapsed) {
            setCollapsed(false);
        } else {
            setCollapsed(true);
        }
    }

    const indentedChildren = (
        <div className={depth > 0 ? 'hangingIndent' : ''}>
            {isEditing ? <Separator id={id} materialised_path={materialised_path} relative_position='first_child' /> : ""}
            <ResumeNodeList nodeList={nodeData.children} materialised_path={materialised_path} depth={depth} />
        </div>
    )

    if (hidden & !isEditing) {
        return <React.Fragment />
    };

    const handleSetActiveNode = () => {
        setActiveNode(nodeData);
    };

    return (
        <div>
            <div
                ref={isEditing ? handleDrag : null}
                className={`${isEditing ? 'draggable' : ''} ${isDragging ? 'dragging' : ''} ${isActive ? 'active' : ''}`}
            >
                <div
                    onClick={handleSetActiveNode}
                    className={isEditing & (id === activeNode?.id) ? 'element-active' : 'element'}
                >
                    {getElement()}
                </div>

                <div className={collapsed ? 'collapsed' : 'visible'}>
                    {indentedChildren}
                </div>
                {isEditing ? <Separator id={id} materialised_path={materialised_path} relative_position='next_sibling' /> : ""}
            </div>
        </div>
    );
}

export default ResumeNodeList