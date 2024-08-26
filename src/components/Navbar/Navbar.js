import React, { useEffect, useState, useContext, useCallback } from 'react';

import './Navbar.css';

import ResumeContext from "../ResumeContext/ResumeContext";


const Navbar = () => {

  const { isEditing, setIsEditing } = useContext(ResumeContext);
  const { wasChanged, setWasChanged } = useContext(ResumeContext);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  const { resumeContent, setResumeContent } = useContext(ResumeContext);

  const toggleEditing = (e) => {
    e.preventDefault();
    setIsEditing(!isEditing);
  }


  const handleScroll = useCallback(() => {
    const currentScrollPos = window.scrollY;

    if (currentScrollPos > scrollPosition) {
      // Scrolling down
      setIsVisible(false);
    } else {
      // Scrolling up
      setIsVisible(true);
    }

    setScrollPosition(currentScrollPos);
  }, [scrollPosition]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);


  const handleExport = (e) => {
    e.preventDefault();
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(resumeContent, null, 2))}`;
    const link = document.createElement('a');
    link.href = jsonString;
    link.download = 'resume_content.json';
    link.click();
  };

  const handleStartNew = (e) => {
    e.preventDefault();
    
    const confirmed = window.confirm("Click ok to reset this to a blank template. Please try this if you like. The data stored on the webserver will not be affected.");

    if (!confirmed) {
      return;
    }
    setResumeContent([]);
    setWasChanged(true);
  };

  const handleReset = (e) => {
    e.preventDefault();

    const confirmed = window.confirm("Click ok to return back to the stored resume. Local changes will be lost unless exported first.");

    if (!confirmed) {
      return;
    }
    window.location.reload();
  };

  return (
    <header className={`navbar ${!isVisible ? 'hidden' : ''}`} onMouseEnter={() => setIsVisible(true)}>
      <nav>
        <ul>
          {wasChanged ? (
            <li>
              <button onClick={handleReset}>Reset</button>
            </li>
          ) : null}
          {isEditing ? (
            <li>
              <button onClick={handleStartNew}>Start New</button>
            </li>
          ) : null}
          {isEditing ? (
            <li>
              <button onClick={handleExport}>Export JSON</button>
            </li>
          ) : null}
          <li>
            <button onClick={toggleEditing}>
              {isEditing ? "Stop Editing" : "Edit"}
            </button>
          </li>
          <li>
          <button onClick={() => window.open('https://github.com/pretoriusdre/resume-tree', '_blank')}>
          View Source
        </button>
            
          </li>
        </ul>
      </nav>
    </header>
  );
  
};

export default Navbar;