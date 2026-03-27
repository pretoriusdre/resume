import React, { useEffect, useRef, useState } from 'react';

import './Navbar.css';

import { useResumeContent } from '../ResumeContentContext/ResumeContentContext';
import { useResumeUI } from '../ResumeUIContext/ResumeUIContext';


const Navbar: React.FC = () => {

    const { resumeContent, dispatch, wasChanged, setWasChanged } = useResumeContent();
    const { isEditing, setIsEditing } = useResumeUI();

    const [isVisible, setIsVisible] = useState(true);
    const [pendingAction, setPendingAction] = useState<'reset' | 'startNew' | null>(null);

    const prevScrollPos = useRef(window.scrollY);

    useEffect(() => {
        const handleScroll = () => {
            const current = window.scrollY;
            setIsVisible(current <= prevScrollPos.current);
            prevScrollPos.current = current;
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);


    const toggleEditing = () => setIsEditing(!isEditing);

    const handleExport = () => {
        const blob = new Blob([JSON.stringify(resumeContent, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'resume_content.json';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const confirmAction = () => {
        if (pendingAction === 'reset') {
            window.location.reload();
        } else if (pendingAction === 'startNew') {
            dispatch({ type: 'START_NEW' });
            setWasChanged(true);
        }
        setPendingAction(null);
    };

    const cancelAction = () => setPendingAction(null);

    const confirmMessages = {
        reset: 'Discard local changes and reload?',
        startNew: 'Reset to a blank template?',
    };

    return (
        <header className={`navbar ${!isVisible ? 'hidden' : ''}`} onMouseEnter={() => setIsVisible(true)}>
            <nav>
                <ul>
                    {pendingAction ? (
                        <>
                            <li><span className="confirm-text">{confirmMessages[pendingAction]}</span></li>
                            <li><button onClick={confirmAction}>Yes</button></li>
                            <li><button onClick={cancelAction}>No</button></li>
                        </>
                    ) : (
                        <>
                            {wasChanged && (
                                <li><button onClick={() => setPendingAction('reset')}>Reset</button></li>
                            )}
                            {isEditing && (
                                <li><button onClick={() => setPendingAction('startNew')}>Start New</button></li>
                            )}
                            {isEditing && (
                                <li><button onClick={handleExport}>Export JSON</button></li>
                            )}
                            <li>
                                <button onClick={toggleEditing}>
                                    {isEditing ? 'Stop Editing' : 'Edit'}
                                </button>
                            </li>
                            <li>
                                <button onClick={() => window.open('https://github.com/pretoriusdre/resume-tree', '_blank')}>
                                    View Source
                                </button>
                            </li>
                        </>
                    )}
                </ul>
            </nav>
        </header>
    );

};

export default Navbar;
