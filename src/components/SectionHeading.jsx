import React from 'react';
import './SectionHeading.css';

const SectionHeading = ({ tagline, title, subtitle, light = false, align = 'center' }) => {
  return (
    <div className={`section-heading align-${align} ${light ? 'heading-light' : ''}`}>
      {tagline && <span className="tagline">{tagline}</span>}
      <h2 className="title">
        {title}
        <span className="accent-bar"></span>
      </h2>
      {subtitle && <p className="subtitle">{subtitle}</p>}
    </div>
  );
};

export default SectionHeading;
