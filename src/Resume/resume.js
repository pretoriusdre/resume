import React, { useEffect, useState }  from 'react';
import { DndProvider} from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

=
import './Resume.css';


import ResumeContext from "./ResumeContext";
import Navbar from './Navbar';
import EditingPane from './EditingPane';

import Page from './Page';

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

                <div className="container">
                    <div className={isEditing ? 'column column-sidepanel' :'column column-collapsed' }>
                        <EditingPane/>
                    </div>
                    <div className="column column-main">
                        <Page data={data}/>
                    </div>
                </div>
                
            </DndProvider>
        </ResumeContext.Provider>
    );
}

export default Resume