import React from 'react';
import './Services.css';

const Services = ({ services, loading, onNavigateDetail }) => {
  return (
    <section id="services">
      <div className="section-inner">
        <div className="services-header">
          <div>
            <div className="section-eyebrow">What We Do</div>
            <h2 className="section-title">Our Services</h2>
            <p className="section-sub">
              Every fabrication job is handled with precision engineering and industry-grade materials.
            </p>
          </div>
        </div>

        <div className="services-grid" id="servicesGrid">
          {loading ? (
            // Render 6 skeleton cards while loading
            Array.from({ length: 6 }).map((_, idx) => (
              <div key={idx} className="skeleton service-skeleton"></div>
            ))
          ) : services.length === 0 ? (
            <div className="services-error" style={{ gridColumn: '1/-1' }}>
              No services available right now. Please check back later.
            </div>
          ) : (
            services.map((s) => (
              <div 
                key={s._id || s.id} 
                className="service-card clickable-card"
                onClick={() => onNavigateDetail(s._id || s.id)}
                style={{ cursor: 'pointer' }}
              >
                <span className="service-icon">{s.icon || '🔧'}</span>
                <div className="service-name">{s.name || s.title}</div>
                <div className="service-desc">{s.description || s.desc || ''}</div>
                <div className="service-more-link" style={{ color: 'var(--rust)', fontSize: '11px', fontWeight: 'bold', marginTop: '14px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  View Specifications →
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default Services;
