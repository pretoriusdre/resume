import React, { useEffect, useMemo, useReducer, useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import './Resume.css';

import { contentReducer } from '../../utils/contentReducer';
import { NodeData, ResumeDocument } from '../../types/resume';
import ResumeContentContext from '../ResumeContentContext/ResumeContentContext';
import ResumeUIContext from '../ResumeUIContext/ResumeUIContext';
import Navbar from '../Navbar/Navbar';
import EditingPane from '../EditingPane/EditingPane';
import Page from '../Page/Page';


const publicUrl = import.meta.env.BASE_URL.replace(/\/$/, '');

const emptyDocument: ResumeDocument = { title: '', page_size: 'A4', nodes: [] };

const Resume: React.FC = () => {

    const [resumeDocument, dispatch] = useReducer(contentReducer, emptyDocument);
    const [isDataLoaded, setIsDataLoaded] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [wasChanged, setWasChanged] = useState(false);
    const [activeNode, setActiveNode] = useState<NodeData | null>(null);
    const [allowEdit, setAllowEdit] = useState(true);
    const [allowJsonExport, setAllowJsonExport] = useState(true);
    const [watermarkEditedCopies, setWatermarkEditedCopies] = useState(true);


    // Load config then resume document on mount
    useEffect(() => {
        const init = async () => {
            try {
                const configResponse = await fetch(`${publicUrl}/data/resume_config.json`);
                const config = await configResponse.json();

                setAllowEdit(config.allow_edit ?? true);
                setAllowJsonExport(config.allow_json_export ?? true);
                setWatermarkEditedCopies(config.watermark_edited_copies ?? true);

                const params = new URLSearchParams(window.location.search);
                const version = params.get('version') || config.default_version || 'sample';

                const resumePath = `${publicUrl}/data/${version}/resume.json`;
                try {
                    const response = await fetch(resumePath);
                    if (response.ok) {
                        dispatch({ type: 'LOAD', payload: await response.json() as ResumeDocument });
                        setIsDataLoaded(true);
                        return;
                    }
                } catch {
                    console.warn(`Resume not found at ${resumePath}, falling back to sample.`);
                }

                // Fallback to sample
                const sampleResponse = await fetch(`${publicUrl}/data/sample/resume.json`);
                if (!sampleResponse.ok) throw new Error('Failed to load sample resume');
                dispatch({ type: 'LOAD', payload: await sampleResponse.json() as ResumeDocument });
                setIsDataLoaded(true);
            } catch (error) {
                console.error('Error loading resume:', error);
            }
        };
        init();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- intentional: load data once on mount only
    }, []);

    // Apply document title
    useEffect(() => {
        document.title = resumeDocument.title || 'Résumé';
    }, [resumeDocument.title]);

    // Apply page size to DOM whenever it changes
    useEffect(() => {
        document.documentElement.dataset.pageSize = resumeDocument.page_size.toLowerCase();
        const existing = document.getElementById('page-size-style');
        if (existing) existing.remove();
        const style = document.createElement('style');
        style.id = 'page-size-style';
        style.textContent = `@page { size: ${resumeDocument.page_size}; margin: 12mm; }`;
        document.head.appendChild(style);
    }, [resumeDocument.page_size]);

    // Reset to sample data if all nodes are deleted
    useEffect(() => {
        if (isDataLoaded && resumeDocument.nodes.length === 0) {
            const fetchSample = async () => {
                try {
                    const response = await fetch(`${publicUrl}/data/sample/resume.json`);
                    dispatch({ type: 'LOAD', payload: await response.json() as ResumeDocument });
                } catch (error) {
                    console.error('Error fetching sample data:', error);
                }
            };
            fetchSample();
        }
    }, [resumeDocument.nodes, isDataLoaded]);

    // Default to first node when data loads
    useEffect(() => {
        if (isDataLoaded && resumeDocument.nodes.length > 0 && !activeNode) {
            setActiveNode(resumeDocument.nodes[0]);
        }
    }, [isDataLoaded, resumeDocument.nodes, activeNode]);


    const contentValue = useMemo(
        () => ({ resumeDocument, dispatch, isDataLoaded, wasChanged, setWasChanged }),
        [resumeDocument, isDataLoaded, wasChanged] // eslint-disable-line react-hooks/exhaustive-deps -- dispatch and setWasChanged are stable
    );

    const uiValue = useMemo(
        () => ({ isEditing, setIsEditing, activeNode, setActiveNode, allowEdit, allowJsonExport, watermarkEditedCopies }),
        [isEditing, activeNode, allowEdit, allowJsonExport, watermarkEditedCopies] // eslint-disable-line react-hooks/exhaustive-deps -- setters are stable
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
