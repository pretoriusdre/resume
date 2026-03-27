import React, { useEffect, useMemo, useReducer, useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import './Resume.css';

import { contentReducer } from '../../utils/contentReducer';
import { NodeData, ResumeTree } from '../../types/resume';
import ResumeContentContext from '../ResumeContentContext/ResumeContentContext';
import ResumeUIContext from '../ResumeUIContext/ResumeUIContext';
import Navbar from '../Navbar/Navbar';
import EditingPane from '../EditingPane/EditingPane';
import Page from '../Page/Page';


const Resume: React.FC = () => {

    const [resumeContent, dispatch] = useReducer(contentReducer, []);
    const [isDataLoaded, setIsDataLoaded] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [wasChanged, setWasChanged] = useState(false);
    const [activeNode, setActiveNode] = useState<NodeData | null>(null);


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
                            dispatch({ type: 'LOAD', payload: await versionedResponse.json() as ResumeTree });
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
                dispatch({ type: 'LOAD', payload: await baseResponse.json() as ResumeTree });
                setIsDataLoaded(true);
            } catch (error) {
                console.error('Error loading resume:', error);
            }
        };
        init();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- intentional: load data once on mount only
    }, []);

    // Reset to sample data if all nodes are deleted
    useEffect(() => {
        if (isDataLoaded && resumeContent.length === 0) {
            const fetchSample = async () => {
                try {
                    const response = await fetch(`${process.env.PUBLIC_URL}/data/sample/resume_content.json`);
                    dispatch({ type: 'LOAD', payload: await response.json() as ResumeTree });
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


    const contentValue = useMemo(
        () => ({ resumeContent, dispatch, isDataLoaded, wasChanged, setWasChanged }),
        [resumeContent, isDataLoaded, wasChanged] // eslint-disable-line react-hooks/exhaustive-deps -- dispatch and setWasChanged are stable
    );

    const uiValue = useMemo(
        () => ({ isEditing, setIsEditing, activeNode, setActiveNode }),
        [isEditing, activeNode] // eslint-disable-line react-hooks/exhaustive-deps -- setters are stable
    );

    return (
        <ResumeContentContext.Provider value={contentValue}>
            <ResumeUIContext.Provider value={uiValue}>
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
            </ResumeUIContext.Provider>
        </ResumeContentContext.Provider>
    );
};

export default Resume;
