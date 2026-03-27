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
    const [isDataLoaded, setIsDataLoaded] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [wasChanged, setWasChanged] = useState(false);
    const [activeNode, setActiveNode] = useState(null);


    // Load metadata then content in one sequential init — avoids a double fetch
    // that occurred when the content effect fired with empty metadata on first render.
    useEffect(() => {
        const init = async () => {
            try {
                const metaResponse = await fetch(`${process.env.PUBLIC_URL}/data/resume_metadata.json`);
                const metadata = await metaResponse.json();
                document.title = metadata.title || 'Résumé';

                const params = new URLSearchParams(window.location.search);
                const version = params.get('version');

                if (version) {
                    const versionedPath = `${process.env.PUBLIC_URL}${metadata.basepath}${version}/${metadata.filename}`;
                    try {
                        const versionedResponse = await fetch(versionedPath);
                        if (versionedResponse.ok) {
                            setResumeContent(await versionedResponse.json());
                            setIsDataLoaded(true);
                            return;
                        }
                    } catch {
                        console.warn(`Versioned resume not found at ${versionedPath}, falling back to base path.`);
                    }
                }

                const basePath = `${process.env.PUBLIC_URL}${metadata.basepath}${metadata.filename}`;
                const baseResponse = await fetch(basePath);
                if (!baseResponse.ok) throw new Error(`Failed to fetch resume: ${basePath}`);
                setResumeContent(await baseResponse.json());
                setIsDataLoaded(true);
            } catch (error) {
                console.error('Error loading resume:', error);
            }
        };
        init();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // Reset to sample data if all nodes are deleted
    useEffect(() => {
        if (isDataLoaded && resumeContent.length === 0) {
            const fetchSample = async () => {
                try {
                    const response = await fetch(`${process.env.PUBLIC_URL}/data/sample/resume_content.json`);
                    setResumeContent(await response.json());
                } catch (error) {
                    console.error('Error fetching sample data:', error);
                }
            };
            fetchSample();
        }
    }, [resumeContent, isDataLoaded]);

    // Default to first node when data loads
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
};

export default Resume;