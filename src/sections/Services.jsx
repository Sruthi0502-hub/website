import React from 'react';
import '../styles/Services.css';

const Services = ({ services, loading, onNavigateDetail }) => {
  const trimDescription = (text, maxLength = 100) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <section id="services">
      <div className="section-inner">
        <div className="services-header">
          <div className="section-eyebrow">Expert Solutions</div>
          <h2 className="section-title">Our Services</h2>
          <p className="section-sub">
            Precision engineering, custom heavy fabrication, and industrial-grade quality delivered on time.
          </p>
        </div>

        <div className="services-grid" id="servicesGrid">
          {loading ? (
            // Render 6 skeleton cards while loading
            Array.from({ length: 6 }).map((_, idx) => (
              <div key={idx} className="skeleton service-skeleton"></div>
            ))
          ) : services.length === 0 ? (
            <div className="services-error" style={{ gridColumn: '1/-1' }}>
              <div className="services-error-icon">⚠️</div>
              <span>No services available right now. Please check back later.</span>
            </div>
          ) : (
            services.map((s) => {
              const serviceId = s._id || s.id;
              const serviceTitle = s.title || s.name || 'Untitled Service';
              const serviceCategory = s.category || 'Fabrication';
              const serviceDesc = s.shortDescription || s.description || s.desc || '';
              // Parents (App.jsx) fetches and normalizes the image URLs already
              const imageUrl = s.image || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80';

              return (
                <div
                  key={serviceId}
                  className="service-card"
                  onClick={() => onNavigateDetail(serviceId)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="service-image-container">
                    <img
                      src={imageUrl}
                      alt={serviceTitle}
                      className="service-card-image"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80';
                      }}
                    />
                  </div>
                  <div className="service-card-content">
                    <span className="service-category-badge">{serviceCategory}</span>
                    <h3 className="service-title">{serviceTitle}</h3>
                    <p className="service-description">
                      {trimDescription(serviceDesc, 100)}
                    </p>
                    <div className="service-action-link">
                      View Specifications →
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
};

export default Services;