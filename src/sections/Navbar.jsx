import React, { useState } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';
import './Navbar.css';

const Navbar = ({ onNavigateHome, onNavigateSection, currentView }) => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => setIsOpen(!isOpen);

  const handleLinkClick = (e, sectionId) => {
    setIsOpen(false);
    
    // Intercept navigation if on detailed page
    if (currentView?.page === 'detail') {
      e.preventDefault();
      onNavigateSection(sectionId);
    }
  };

  const handleLogoClick = (e) => {
    if (currentView?.page === 'detail') {
      e.preventDefault();
      onNavigateHome();
    }
  };

  return (
    <nav>
      <a className="nav-logo" href="#" onClick={handleLogoClick}>
        RR<span>ventures</span>
      </a>
      
      <ul className={`nav-links ${isOpen ? 'active' : ''}`}>
        <li>
          <a href="#services" onClick={(e) => handleLinkClick(e, 'services')}>
            Services
          </a>
        </li>
        <li>
          <a href="#about" onClick={(e) => handleLinkClick(e, 'about')}>
            About
          </a>
        </li>
        <li>
          <a href="#gallery" onClick={(e) => handleLinkClick(e, 'gallery')}>
            Gallery
          </a>
        </li>
        <li>
          <a href="#contact" className="nav-cta" onClick={(e) => handleLinkClick(e, 'contact')}>
            Get a Quote
          </a>
        </li>
      </ul>

      <button className="nav-toggle" onClick={toggleMenu} aria-label="Toggle Menu">
        {isOpen ? <FaTimes /> : <FaBars />}
      </button>
    </nav>
  );
};

export default Navbar;
