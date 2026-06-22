import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Services.css';
import { fallbackServices } from '../data/services';

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch('http://localhost:3000/provideservices/public');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        // The API returns the list of services directly or wrapped in standard envelopes
        const servicesList = data.data || data;
        setServices(servicesList);
      } catch (err) {
        console.error('API Error: ', err);
        setError('Failed to load services');
        // Fall back to static services so the UI remains usable even if local API is down
        setServices(fallbackServices);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const trimDescription = (text, maxLength = 100) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const getServiceImage = (s) => {
    if (s.images) {
      return `http://localhost:3000/uploads/${s.images}`;
    }
    // Fallback if s.images doesn't exist but s.image exists (from mock services)
    return s.image || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80';
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
            <div className="services-loading" id="servicesLoading">
              <div className="services-loading-spinner"></div>
              <span>Loading services...</span>
            </div>
          ) : error && services.length === 0 ? (
            <div className="services-error" id="servicesError">
              <div className="services-error-icon">⚠️</div>
              <span>Failed to load services</span>
              <div className="services-error-desc">Please try again later.</div>
            </div>
          ) : (
            services.map((s) => {
              const serviceId = s._id || s.id;
              const serviceTitle = s.title || s.name || 'Untitled Service';
              const serviceCategory = s.category || 'Fabrication';
              const serviceDesc = s.description || s.desc || '';

              return (
                <div
                  key={serviceId}
                  className="service-card"
                  onClick={() => navigate(`/services/${serviceId}`)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="service-image-container">
                    <img
                      src={getServiceImage(s)}
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
