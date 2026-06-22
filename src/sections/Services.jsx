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
            // Loading ke samay 6 skeleton dikhao
            Array.from({ length: 6 }).map((_, idx) => (
              <div key={idx} className="skeleton service-skeleton"></div>
            ))
          ) : services.length === 0 ? (
            <div className="services-error" style={{ gridColumn: '1/-1' }}>
              No services available right now. Please check back later.
            </div>
          ) : (
            services.map((s) => {
              // Admin ne jo data bheja hai use dekhne ke liye console log (optional)
              // console.log("Admin Service Data:", s);

              return (
                <div
                  key={s._id || s.id}
                  className="service-card clickable-card"
                  onClick={() => onNavigateDetail(s._id || s.id)}
                  style={{ cursor: 'pointer' }}
                >
                  {/* 1. IMAGE WALA PART */}
                  {/* Agar admin ne multiple images bheji hain aur aapko card par sirf PEHLI image dikhani hai: */}
                  {s.images && s.images.length > 0 ? (
                    <img
                      className="service-image"
                      src={`https://dashboard-management-u6vj.onrender.com/uploads/${s.images[0]}`}

                    />
                  ) : (
                    // Agar admin ne koi image upload nahi ki, toh ek fallback/default image dikhao
                    <div className="no-image-placeholder">No Image Available</div>
                  )}

                  {/* 2. TITLE WALA PART */}
                  {/* Jo title admin ne dashboard me dala tha */}
                  <div className="service-name">{s.title}</div>

                  {/* 3. DESCRIPTION WALA PART */}
                  {/* Jo description admin ne likha tha */}
                  <div className="service-desc">{s.shortDescription}</div>

                  <div className="service-more-link" style={{ color: 'var(--rust)', fontSize: '11px', fontWeight: 'bold', marginTop: '14px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    View Specifications →
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