import React, { useEffect, useState }  from 'react';
import { DndProvider} from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';


import './Resume.css';

import ResumeContext from "./ResumeContext";
import Navbar from './Navbar';
import EditingPane from './EditingPane';
import Page from './Page';



const Resume = () => {

    const [resumeContent, setResumeContent] = useState([]);
    const [resumeMetadata, setResumeMetadata] = useState({});
    const [isDataLoaded, setIsDataLoaded] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [activeNode, setActiveNode] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const resumeContentResponse = await fetch(`${process.env.PUBLIC_URL}/data/resume_content.json`);
                const resumeMetadataResponse = await fetch(`${process.env.PUBLIC_URL}/data/resume_metadata.json`);

                const resumeContentReceived = await resumeContentResponse.json();
                const resumeMetadataReceived = await resumeMetadataResponse.json();

                document.title = resumeMetadataReceived.title || 'Résumé';

                setResumeContent(resumeContentReceived);
                setResumeMetadata(resumeMetadataReceived);
                setIsDataLoaded(true);

            } catch (error) {
                console.error('Error fetching JSON data:', error);
            }
        };
        fetchData();
    }, []);




    useEffect(() => {
        if (resumeContent && resumeContent.length > 0 && !activeNode) {
            setActiveNode(resumeContent[0]);
        }
    }, [resumeContent, activeNode]);


    return(
        <ResumeContext.Provider value={{
            isEditing, setIsEditing,
            activeNode, setActiveNode,
            resumeContent, setResumeContent,
            resumeMetadata, setResumeMetadata,
            isDataLoaded, setIsDataLoaded
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