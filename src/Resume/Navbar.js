import React, { useEffect, useState, useContext } from 'react';

import './Navbar.css';

import ResumeContext from "./ResumeContext";


const Navbar = () => {

  const { isEditing, setIsEditing } = useContext(ResumeContext);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  const toggleEditing = () => {
    setIsEditing(!isEditing);
  }


  const handleScroll = () => {
    const currentScrollPos = window.pageYOffset;

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


  return (
    <header className={`navbar ${!isVisible ? 'hidden' : ''}`} onMouseEnter={() => setIsVisible(true)}>
      <nav>
        <ul>
          <li><a href="#" onClick={toggleEditing}>{isEditing ? "Stop Editing" : "Edit"}</a></li>
          <li><a href="https://github.com/pretoriusdre/resume" target="_blank">Source</a></li>
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;