import React from 'react';
import './ProjectCard.css';

const ProjectCard = ({ title, category, image, client, year }) => {
  return (
    <div className="project-card">
      <div className="project-image-wrapper">
        <img src={image} alt={title} className="project-image" loading="lazy" />
        <div className="project-overlay">
          <div className="project-info">
            <span className="project-category">{category}</span>
            <h3 className="project-title">{title}</h3>
            <div className="project-meta">
              {client && <span className="project-client">Client: {client}</span>}
              {year && <span className="project-year">{year}</span>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
