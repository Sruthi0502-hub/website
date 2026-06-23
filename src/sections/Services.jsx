import React, { useState, useEffect } from 'react';
import '../styles/Services.css';

const Services = ({ onNavigateDetail }) => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const trimDescription = (text, maxLength = 100) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  useEffect(() => {
    const loadServices = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch('https://dashboard-management-u6vj.onrender.com/provideservices/public');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        const servicesList = data.data || data;

        // Normalize dynamic API data to ensure correct image path and fields
        const normalizedData = servicesList.map(s => {
          let imagePath = '';
          if (s.images) {
            const firstImage = Array.isArray(s.images) ? s.images[0] : s.images;
            imagePath = firstImage ? `https://dashboard-management-u6vj.onrender.com/uploads/${firstImage}` : '';
          } else {
            imagePath = s.image || '';
          }
          return {
            ...s,
            image: imagePath
          };
        });

        setServices(normalizedData);
      } catch (err) {
        console.error('Error fetching services from API:', err);
        setError('Unable to load services. Please try again later.');
        setServices([]);
      } finally {
        setLoading(false);
      }
    };

    loadServices();
  }, []);

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
            <div className="services-loading">
              <div className="services-loading-spinner"></div>
              <span>Loading services...</span>
            </div>
          ) : error ? (
            <div className="services-error" style={{ gridColumn: '1/-1' }}>
              <div className="services-error-icon">⚠️</div>
              <span>{error}</span>
            </div>
          ) : services.length === 0 ? (
            <div className="services-error" style={{ gridColumn: '1/-1' }}>
              <div className="services-error-icon">⚠️</div>
              <span>No services available right now. Please check back later.</span>
            </div>
          ) : (
            services.map((s) => {
              const serviceId = s._id || s.id;
              const serviceTitle = s.title;
              const serviceCategory = s.category;
              const serviceDesc = s.shortDescription;
              const imageUrl = s.images;

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