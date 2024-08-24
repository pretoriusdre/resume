import React, { useEffect, useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';


import './Resume.css';

import ResumeContext from "../ResumeContext/ResumeContext";
import Navbar from '../Navbar/Navbar';
import EditingPane from '../EditingPane/EditingPane';
import Page from '../Page/Page';


const Resume = () => {

    const [resumeContent, setResumeContent] = useState([]);
    const [resumeMetadata, setResumeMetadata] = useState({});
    const [isDataLoaded, setIsDataLoaded] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [wasChanged, setWasChanged] = useState(false);
    const [activeNode, setActiveNode] = useState(null);

    // Get the metadata
    useEffect(() => {
        const fetchMetadata = async () => {
            try {
                const resumeMetadataResponse = await fetch(`${process.env.PUBLIC_URL}/data/resume_metadata.json`);
                const resumeMetadataReceived = await resumeMetadataResponse.json();
                document.title = resumeMetadataReceived.title || 'Résumé';
                setResumeMetadata(resumeMetadataReceived);
            } catch (error) {
                console.error('Error fetching JSON data:', error);
            }
        };
        fetchMetadata();
    }, []);

    // Get the actual resume data
    useEffect(() => {
        const fetchResumeContent = async () => {
            try {
                const resumeContentResponse = await fetch(`${process.env.PUBLIC_URL}${resumeMetadata.contentpath}`);
                const resumeContentReceived = await resumeContentResponse.json();
                setResumeContent(resumeContentReceived);
                setIsDataLoaded(true);
            } catch (error) {
                console.error('Error fetching JSON data:', error);
            }
        };
        fetchResumeContent();
    }, [resumeMetadata, setResumeContent, setIsDataLoaded]);


    // Reset content to sample data if all nodes are deleted
    useEffect(() => {
        if (isDataLoaded & resumeContent.length === 0) {
            const fetchResumeContent = async () => {
                try {
                    const resumeSampleContentResponse = await fetch(`${process.env.PUBLIC_URL}/data/sample/resume_content.json`);
                    const resumeSampleContentReceived = await resumeSampleContentResponse.json();
                    setResumeContent(resumeSampleContentReceived);
                } catch (error) {
                    console.error('Error fetching JSON data:', error);
                }
            };
            fetchResumeContent();
        }
    }, [resumeContent, setResumeContent, isDataLoaded]);

    // Set the active node to the first node if nothing is selected
    useEffect(() => {
        if (isDataLoaded && resumeContent.length > 0 && !activeNode) {
            setActiveNode(resumeContent[0]);
        }
    }, [isDataLoaded, resumeContent, activeNode]);


    return (
        <ResumeContext.Provider value={{
            isEditing, setIsEditing,
            wasChanged, setWasChanged,
            activeNode, setActiveNode,
            resumeContent, setResumeContent,
            resumeMetadata, setResumeMetadata,
            isDataLoaded, setIsDataLoaded,

        }}>
            <DndProvider backend={HTML5Backend}>
                <Navbar />
                <div className="container">
                    <div className={`column${isEditing ? ' column-sidepanel' : ' collapsed'}`}>
                        <EditingPane />
                    </div>
                    <div className={`column${isEditing ? ' column-mainwithsidepanel' : ' column-main'}`}>
                        <Page />
                    </div>
                </div>

            </DndProvider>
        </ResumeContext.Provider>
    );
}

export default Resume