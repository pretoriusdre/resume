
import React, {useState , useContext}  from 'react';
import {useDrag } from 'react-dnd';

import ResumeContext from "./ResumeContext";
import DragAndDropItems from './DragAndDropItems'
import Separator from './Separator';


import getImageByKey from './getImageByKey';

//import { v4 as uuidv4 } from 'uuid';

import './ResumeNode.css'

function ResumeNode(props) {

    const { isEditing, setIsEditing } = useContext(ResumeContext);
    const { activeNode, setActiveNode } = useContext(ResumeContext);


    const [collapsed, setCollapsed] = useState(props.data?.meta?.collapsed || false);
    const hasChildren = ((props.data?.children?.length > 0));
    const NodeIcon = (hasChildren ? (collapsed ? '+' : '-') : '>');
    const bulletClass = "bulletspan" + (hasChildren ? "" : " leaf");

    const id = props.data.id;

    const isActive = () => {
        return id === activeNode?.id;
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
    


    const titleElement = (
        props.data?.meta?.always_show ?
        <span>{props?.data?.data?.title}</span> : 
        <span><span className={bulletClass} onClick={hasChildren ? toggleCollapse : null}>{NodeIcon}</span>{props?.data?.data?.title}</span>
    )
    
    const isImageTag = props?.data?.meta?.element === 'img'
    const isIFrame = props?.data?.meta?.element === 'iframe'

    const element_arbitrary = React.createElement(
        props?.data?.meta?.element || 'span',
        props?.data?.meta?.attributes,
        titleElement
    );  

    const modalClass = "imgmodal" + (collapsed ? "-hidden" : "")
    const title = props?.data?.data?.title
        
    const element_img = (
        <div>
            <img src={getImageByKey(props?.data?.meta?.attributes?.src)} className="imgtiny" onClick={toggleCollapse} title={title} alt={title}/>
            <img src={getImageByKey(props?.data?.meta?.attributes?.src)} className={modalClass} onClick={toggleCollapse} title={title} alt={title}/>
        </div>
    );

    const element_iframe = (
        <div>
            <iframe src={props?.data?.meta?.attributes?.src} width="640px" height="385px" allowFullScreen allow="autoplay"/>
        </div>
    );

    const element = (isImageTag ? element_img : (isIFrame ? element_iframe : element_arbitrary));

    const childItems = (props?.data?.children || []).map(
        (child) => {
            return <ResumeNode data={child} depth={props.depth + 1} key={props?.data?.title}/>
        }
    );

    const indentedChildren = (
        props.depth > 2 ?
        <ul>
            {childItems}
        </ul> :
        childItems
    )
    
    const hidden = props.data?.meta?.hidden || false;
    if (hidden) {
        return <React.Fragment/>
    };

    const handleSetActiveNode = () => {
        setActiveNode(props?.data);
    };



    return (
        <div>
            <div className='hangingIndent'>
                <div 
                    ref={isEditing ? handleDrag : null}
                    className={`${isEditing ? 'draggable' : ''} ${isDragging ? 'dragging' : ''}`}  
                >
                    <div 
                        onClick={handleSetActiveNode}
                        className={isEditing & (id === activeNode?.id) ? 'element-active' : 'element'}
                        >
                        {element}
                    </div>
                    {isEditing ? <Separator/> : ""}
                    <div className={collapsed ? 'collapsed' : 'visible'}>
                        {indentedChildren}
                    </div>
                </div>
            </div>
        </div>
    );
}


export default ResumeNode