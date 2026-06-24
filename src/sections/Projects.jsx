import React from 'react';
import './Projects.css';

const galleryImages = [
  { id: 1, src: '/gallery-1.webp', alt: 'Gallery 1' },
  { id: 2, src: '/gallery-2.jpg', alt: 'Gallery 2' },
  { id: 3, src: '/gallery-3.jpg', alt: 'Gallery 3' },
  { id: 4, src: '/gallery-4.jpg', alt: 'Gallery 4' },
  { id: 5, src: '/gallery-5.jpg', alt: 'Gallery 5' },
  { id: 6, src: '/gallery-6.jpg', alt: 'Gallery 6' },
];

const Projects = () => {
  return (
    <section id="gallery">
      <div className="section-inner">
        <div className="section-eyebrow">Our Work</div>
        <h2 className="section-title">Built in our yard.</h2>
        <p className="section-sub">A look at some of the fabrication work that leaves our facility.</p>

        <div className="gallery-grid">
          {galleryImages.map((image) => (
            <div key={image.id} className="gallery-item">
              <img src={image.src} alt={image.alt} className="gallery-img" />
              <div className="gallery-item-inner"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
