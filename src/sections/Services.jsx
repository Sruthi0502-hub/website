import React from 'react';
import '../styles/Services.css';
import { getServiceFallbackImage } from '../utils/imageFallback';


// 🟢 अब यह खुद फ़ेच नहीं करेगा, सीधे App.jsx से आ रहे 'services' और 'loading' को यूज़ करेगा
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
            <div className="services-loading">
              <div className="services-loading-spinner"></div>
              <span>Loading services...</span>
            </div>
          ) : services.length === 0 ? (
            <div className="services-error" style={{ gridColumn: '1/-1' }}>
              <div className="services-error-icon">⚠️</div>
              <span>No services available right now.</span>
            </div>
          ) : (
            services.map((s) => {
              // 🟢 App.jsx से आ रहा क्लीन URL सीधे यूज़ करें
              const serviceImage = s.images;

              return (
                <div
                  key={s._id}
                  className="service-card"
                  onClick={() => onNavigateDetail(s._id)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="service-image-container">
                    <img
                      src={serviceImage ? serviceImage : getServiceFallbackImage(s.title)}
                      alt={s.title || 'Untitled Service'}
                      className="service-card-image"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = getServiceFallbackImage(s.title);
                      }}
                    />
                  </div>
                  <div className="service-card-content">
                    <h3 className="service-title">{s.title || 'Untitled Service'}</h3>
                    <p className="service-description">
                      {trimDescription(s.shortDescription, 100)}
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