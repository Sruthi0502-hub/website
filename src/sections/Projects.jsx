import React from 'react';
import './Projects.css';

const Projects = ({ projects, onNavigateDetail }) => {
  return (
    <section id="gallery">
      <div className="section-inner">
        <div className="section-eyebrow">Our Work</div>
        <h2 className="section-title">Built in our yard.</h2>
        <p className="section-sub">A look at some of the fabrication work that leaves our facility.</p>
        
        <div className="gallery-grid">
          {projects.map((item) => (
            <div 
              key={item.id} 
              className="gallery-item"
              onClick={() => onNavigateDetail(item.id)}
              style={{
                backgroundImage: `url(${item.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            >
              <div className="gallery-item-inner"></div>
              <div className="gallery-item-label">
                <span className="project-card-cat" style={{ color: 'var(--rust-light)', display: 'block', fontSize: '9px', fontWeight: 'bold', letterSpacing: '0.05em', marginBottom: '2px' }}>
                  {item.category}
                </span>
                {item.title}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
