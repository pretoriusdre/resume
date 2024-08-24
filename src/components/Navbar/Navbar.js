import React, { useEffect, useState, useContext } from 'react';

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

  const handleScroll = () => {
    const currentScrollPos = window.scrollY;

    if (currentScrollPos > scrollPosition) {
      // Scrolling down
      setIsVisible(false);
    } else {
      // Scrolling up
      setIsVisible(true);
    }

    setScrollPosition(currentScrollPos);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrollPosition]);


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

    // Confirm the deletion with the user
    const confirmed = window.confirm("Click ok to reset this to a blank template. Please try this if you like. The data stored on the webserver will not be affected.");

    if (!confirmed) {
      return; // Exit the function if the user cancels
    }
    setResumeContent([]);
    setWasChanged(true);
  };

  const handleReset = (e) => {
    e.preventDefault();

    // Confirm the deletion with the user
    const confirmed = window.confirm("Click ok to return back to the stored resume. Local changes will be lost unless exported first.");

    if (!confirmed) {
      return; // Exit the function if the user cancels
    }
    window.location.reload();
  };

  return (
    <header className={`navbar ${!isVisible ? 'hidden' : ''}`} onMouseEnter={() => setIsVisible(true)}>
      <nav>
        <ul>
          {wasChanged ? <li><a href="" onClick={handleReset}>Reset</a></li> : null}
          {isEditing ? <li><a href="" onClick={handleStartNew}>Start New</a></li> : null}
          {isEditing ? <li><a href="" onClick={handleExport}>Export JSON</a></li> : null}
          <li><a href="" onClick={toggleEditing}>{isEditing ? "Stop Editing" : "Edit"}</a></li>
          <li><a href="https://github.com/pretoriusdre/resume" target="_blank">Source</a></li>
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;