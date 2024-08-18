
import React, {useState , useContext}  from 'react';
import {useDrag } from 'react-dnd';

import ResumeContext from "./ResumeContext";
import DragAndDropItems from './DragAndDropItems'
import Separator from './Separator';

import getImageByKey from './getImageByKey';

//import { v4 as uuidv4 } from 'uuid';

import './ResumeNodeList.css'


const ResumeNodeList = ({ data, depth, materialised_path }) => {

    return (
      <div>
        {(data || []).map((child) => (
          <ResumeNode 
            data={child} depth={depth + 1}
            materialised_path={[...materialised_path, child.id]}
            key={child.id} />
        ))}
        </div>
    );
  };
  

function ResumeNode({ data, depth, materialised_path}) {

    const { isEditing, setIsEditing } = useContext(ResumeContext);
    const { activeNode, setActiveNode } = useContext(ResumeContext);

    const [collapsed, setCollapsed] = useState(data?.meta?.start_collapsed || false);
    const hasChildren = ((data?.children?.length > 0));
    const NodeIcon = (hasChildren ? (collapsed ? '+' : '-') : '>');
    const bulletClass = "bulletspan" + (hasChildren ? "" : " leaf");

    const id = data.id;
    const title = data.value

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
        data?.meta?.always_show ?
        <span>{title}</span> : 
        <span><span className={bulletClass} onClick={hasChildren ? toggleCollapse : null}>{NodeIcon}</span>{title}</span>
    )
    
    const isImageTag = data?.meta?.element === 'img'
    const isIFrame = data?.meta?.element === 'iframe'

    const element_arbitrary = React.createElement(
        data?.meta?.element || 'span',
        data?.meta?.attributes,
        titleElement
    );  

    const modalClass = "imgmodal" + (collapsed ? "-hidden" : "")

    const element_img = (
        <div>
            <img src={getImageByKey(data?.meta?.attributes?.src)} className="imgtiny" onClick={toggleCollapse} title={title} alt={title}/>
            <img src={getImageByKey(data?.meta?.attributes?.src)} className={modalClass} onClick={toggleCollapse} title={title} alt={title}/>
        </div>
    );

    const element_iframe = (
        <div>
            <iframe src={data?.meta?.attributes?.src} width="640px" height="385px" allowFullScreen allow="autoplay"/>
        </div>
    );

    const element = (isImageTag ? element_img : (isIFrame ? element_iframe : element_arbitrary));

    const indentedChildren = (
        <div className={depth > 0 ? 'hangingIndent' : ''}>
            {isEditing ? <Separator id={id} materialised_path={materialised_path} relative_position='first_child'/> : ""}
            <ResumeNodeList data={data.children} materialised_path={materialised_path} depth={depth}/>
        </div>
    )
    
    const hidden = data?.meta?.hidden || false;
    if (hidden & !isEditing) {
        return <React.Fragment/>
    };

    const handleSetActiveNode = () => {
        setActiveNode(data);
    };

    return (
        <div>
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
                
                <div className={collapsed ? 'collapsed' : 'visible'}>
                    {indentedChildren}
                </div>
                {isEditing ? <Separator id={id} materialised_path={materialised_path} relative_position='next_sibling'/> : ""}
            </div>
        </div>
            
    );
}

export default ResumeNodeList