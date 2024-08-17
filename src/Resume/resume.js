import React, { useEffect, useState }  from 'react';
import { DndProvider} from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';


import './style.css';

import ResumeContext from "./ResumeContext";
import Navbar from './Navbar';
import EditingPane from './EditingPane';
import ResumeNode from './ResumeNode';
import resume from './data/resume_content.json';


function Resume(props) {

    useEffect(() => {
        document.title = 'Résumé';
    }, []);

    const [activeNode, setActiveNode] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [data, setData] = useState(resume);


    return(
        <ResumeContext.Provider value={{
            isEditing, setIsEditing,
            activeNode, setActiveNode
        }}>
            <DndProvider backend={HTML5Backend}>
                <Navbar/>
                <EditingPane/>
                <div className='pagecontainer'>
                <ResumeNode data={data} depth={1}/>
                </div>
            </DndProvider>
        </ResumeContext.Provider>
    );
}

export default Resume