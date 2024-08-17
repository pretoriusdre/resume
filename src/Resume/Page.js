import React, { useEffect, useState }  from 'react';
import { DndProvider} from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';


import './Page.css';

import ResumeContext from "./ResumeContext";

import ResumeNodeList from './ResumeNodeList';
import resume from './data/resume_content.json';


function Page(props) {


    //const [activeNode, setActiveNode] = useState(null);
    //const [isEditing, setIsEditing] = useState(false);
    //const [data, setData] = useState(resume);


    return(
        <div className='pagecontainer'>
        <ResumeNodeList data={props.data} depth={0}/>
        </div>
    );
}

export default Page