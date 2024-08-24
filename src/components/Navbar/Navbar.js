import React, { useEffect, useState, useContext } from 'react';

import './Navbar.css';

import ResumeContext from "../ResumeContext/ResumeContext";


const Navbar = () => {

  const { isEditing, setIsEditing } = useContext(ResumeContext);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  const { resumeContent } = useContext(ResumeContext);

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


  return (
    <header className={`navbar ${!isVisible ? 'hidden' : ''}`} onMouseEnter={() => setIsVisible(true)}>
      <nav>
        <ul>
          {isEditing ? <li><a href="" onClick={handleExport}>Export JSON</a></li> : null}
          <li><a href="" onClick={toggleEditing}>{isEditing ? "Stop Editing" : "Edit"}</a></li>
          <li><a href="https://github.com/pretoriusdre/resume" target="_blank">Source</a></li>
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;