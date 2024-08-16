
import React, {useState }  from 'react';
import {useDrag } from 'react-dnd';

import ResumeContext from "./ResumeContext";
import DragAndDropItems from './DragAndDropItems'
import Separator from './Separator';


import resume_images from './data/resume_images.json';

const images = {};
const loadImages = async () => {
    for (const [key, path] of Object.entries(resume_images)) {
      try {
        const module = await import(`${path}`);
        images[key] = module.default;
      } catch (error) {
        console.error(`Failed to load image at ${path}:`, error);
      }
    }
  };
loadImages();


function getImageByKey(key: string) {
    return images[key]
}


function ResumeNode(props) {

    const [collapsed, setCollapsed] = useState(props.data?.meta?.collapsed || false);
    const hasChildren = ((props.data?.children?.length > 0));
    const NodeIcon = (hasChildren ? (collapsed ? '+' : '-') : '>');
    const bulletClass = "bulletspan" + (hasChildren ? "" : " leaf");
    const id = 'test'

    const [{ isDragging }, drag] = useDrag(() => ({
        type: DragAndDropItems.RESUME_NODE,
        item: { id },
        collect: (monitor) => ({
          isDragging: !!monitor.isDragging(),
        }),
      }));
    

    function toggleCollapse() {

        if (collapsed) {
            setCollapsed(false);
        } else {
            setCollapsed(true);
        }
    }
    
    function getImageByKey(key: string) {
        return images[key]
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
    </div>)

    const element_iframe = (
    <div>
        <iframe src={props?.data?.meta?.attributes?.src} width="640px" height="385px" allowFullScreen allow="autoplay"/>
    </div>)

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
    }

    return (
        <div>
            <div className='hangingIndent'>
                <div 
                    ref={(resume_node) => drag(resume_node)}
                    className={`draggable ${isDragging ? 'dragging' : ''}`}  >
                    {element}
                    <Separator/>
                    <div className={collapsed ? 'collapsed' : 'visible'}>
                        {indentedChildren}
                    </div>
                </div>
            </div>
        </div>
    );
}


export default ResumeNode