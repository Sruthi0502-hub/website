import React, { useState, useEffect } from 'react';
import { fetchServices, fallbackServices } from '../data/services';
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
        const data = await fetchServices();
        
        // Normalize dynamic API data to ensure correct image path and fields
        const normalizedData = data.map(s => {
          let imagePath = '';
          if (s.images) {
            const firstImage = Array.isArray(s.images) ? s.images[0] : s.images;
            imagePath = firstImage ? `http://localhost:3000/uploads/${firstImage}` : '';
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
        setError('Unable to load services from the backend. Displaying fallback services.');
        
        // Keep fallbackServices as backup only if API fails
        const normalizedFallback = fallbackServices.map(s => ({
          ...s,
          image: s.image || ''
        }));
        setServices(normalizedFallback);
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

        {error && (
          <div className="services-error-banner" style={{
            background: 'rgba(185, 74, 26, 0.08)',
            border: '1px solid rgba(185, 74, 26, 0.2)',
            color: 'var(--rust)',
            padding: '12px 24px',
            borderRadius: 'var(--radius)',
            maxWidth: 'var(--max)',
            margin: '0 auto 24px auto',
            textAlign: 'center',
            fontSize: '14px',
            fontFamily: 'var(--body)'
          }}>
            ⚠️ <strong>Notice:</strong> {error}
          </div>
        )}

        <div className="services-grid" id="servicesGrid">
          {loading ? (
            <div className="services-loading">
              <div className="services-loading-spinner"></div>
              <span>Loading services...</span>
            </div>
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