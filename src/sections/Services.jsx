import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../App';
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
        const response = await fetch(`${API_BASE_URL}/provideservices/public`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        const servicesList = data.data || data;

        // Normalize dynamic API data to ensure correct image path and fields
        const normalizedData = servicesList.map(s => {
          return {
            _id: s._id || s.id,
            title: s.title,
            shortDescription: s.shortDescription,
            images: s.images
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
              const serviceId = s._id;
              const serviceTitle = s.title || 'Untitled Service';
              const serviceDesc = s.shortDescription || '';
              const firstImage = s.images?.[0];

              return (
                <div
                  key={serviceId}
                  className="service-card"
                  onClick={() => onNavigateDetail(serviceId)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="service-image-container">
                    {firstImage ? (
                      <img
                        src={`${API_BASE_URL}/uploads/${firstImage}`}
                        alt={serviceTitle}
                        className="service-card-image"
                      />
                    ) : (
                      <div className="service-card-placeholder" style={{
                        width: '100%',
                        height: '100%',
                        backgroundColor: '#e5e7eb',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#9ca3af',
                        fontSize: '14px',
                        fontWeight: '500',
                        fontFamily: 'var(--display)'
                      }}>
                        No Image
                      </div>
                    )}
                  </div>
                  <div className="service-card-content">
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