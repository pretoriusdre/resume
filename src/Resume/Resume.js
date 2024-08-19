import React, { useEffect, useState }  from 'react';
import { DndProvider} from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';


import './Resume.css';

import ResumeContext from "./ResumeContext";
import Navbar from './Navbar';
import EditingPane from './EditingPane';
import Page from './Page';

import resume_content from './data/resume_content.json';
import resume_metadata from './data/resume_metadata.json';

const Resume = () => {

    useEffect(() => {
        document.title = resume_metadata.title || 'Résumé';
    }, [resume_metadata]);


    const [data, setData] = useState(resume_content);
    const [isEditing, setIsEditing] = useState(false);
    const [activeNode, setActiveNode] = useState(null);


    useEffect(() => {
        if (data && data.length > 0) {
            setActiveNode(data[0]);
        }
    }, [data]);


    return(
        <ResumeContext.Provider value={{
            isEditing, setIsEditing,
            activeNode, setActiveNode,
            data, setData
        }}>
            <DndProvider backend={HTML5Backend}>
                <Navbar/>
                <div className="container">
                    <div className={isEditing ? 'column column-sidepanel' :'column column-collapsed' }>
                        <EditingPane/>
                    </div>
                    <div className={isEditing ? 'column column-mainwithsidepanel' :'column column-main' }>
                        <Page/>
                    </div>
                </div>
                
            </DndProvider>
        </ResumeContext.Provider>
    );
}

export default Resume