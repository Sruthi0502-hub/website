import React from 'react';
import './Projects.css';

const Projects = ({ projects, loading, onNavigateDetail }) => {
  return (
    <section id="gallery">
      <div className="section-inner">
        <div className="section-eyebrow">Our Work</div>
        <h2 className="section-title">Built in our yard.</h2>
        <p className="section-sub">A look at some of the fabrication work that leaves our facility.</p>

        <div className="gallery-grid">
          {loading ? (
            // Render 6 skeleton cards while loading
            Array.from({ length: 6 }).map((_, idx) => (
              <div 
                key={idx} 
                className="gallery-item skeleton" 
                style={{ 
                  height: '240px', 
                  backgroundColor: 'var(--gray-100)', 
                  borderRadius: 'var(--radius)',
                  opacity: 0.7
                }} 
              />
            ))
          ) : projects.length === 0 ? (
            <div className="projects-empty" style={{ gridColumn: '1/-1', textAlign: 'center', padding: '48px', color: 'var(--gray-500)' }}>
              No projects showcase available right now. Please check back later.
            </div>
          ) : (
            projects.map((item) => (
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
                    {item.features}
                  </span>
                  {item.title}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default Projects;
