import React, { useEffect, useState }  from 'react';
import { DndProvider} from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';


import './Resume.css';


import ResumeContext from "./ResumeContext";
import Navbar from './Navbar';
import EditingPane from './EditingPane';

import Page from './Page';

import resume from './data/resume_content.json';


const Resume = () => {

    useEffect(() => {
        document.title = 'Résumé';
    }, []);


    const [data, setData] = useState(resume);
    const [isEditing, setIsEditing] = useState(false);
    const [activeNode, setActiveNode] = useState(null);


    useEffect(() => {
        if (data && data.length > 0) {
            setActiveNode(data[0]); // Set the first item as activeNode
        }
    }, [data]); // This useEffect depends on the data state


    return(
        <ResumeContext.Provider value={{
            isEditing, setIsEditing,
            activeNode, setActiveNode
        }}>
            <DndProvider backend={HTML5Backend}>
                <Navbar/>

                <div className="container">
                    <div className={isEditing ? 'column column-sidepanel' :'column column-collapsed' }>
                        <EditingPane/>
                    </div>
                    <div className={isEditing ? 'column column-mainwithsidepanel' :'column column-main' }>
                        <Page data={data}/>
                    </div>
                </div>
                
            </DndProvider>
        </ResumeContext.Provider>
    );
}

export default Resume