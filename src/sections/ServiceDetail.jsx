import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/ServiceDetail.css';
import { API_BASE_URL } from '../App';

const ServiceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServiceData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/provideservices/public`);
        if (!response.ok) {
          throw new Error('Network error');
        }
        const data = await response.json();
        const servicesList = data.data || data;
        const found = servicesList.find(s => String(s._id || s.id) === String(id));
        setService(found || null);
      } catch (err) {
        console.error('Error fetching service details: ', err);
        setService(null);
      } finally {
        setLoading(false);
      }
    };

    fetchServiceData();
  }, [id]);

  const handleBackClick = () => {
    navigate('/');
  };

  if (loading) {
    return (
      <div className="service-detail-state-screen">
        <div className="service-detail-state-card">
          <div className="service-detail-state-spinner"></div>
          <div className="service-detail-state-text">Loading...</div>
        </div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="service-detail-state-screen">
        <div className="service-detail-state-card">
          <div className="service-detail-state-icon">🔍</div>
          <div className="service-detail-state-text">Service not found.</div>
          <button className="btn-back-services" onClick={handleBackClick} style={{ marginTop: '16px' }}>
            ← Back to Services
          </button>
        </div>
      </div>
    );
  }

  const titleText = service.title || 'Untitled Service';
  const descText = service.longDescription || 'No description available for this service.';

  return (
    <div className="service-detail-page">
      <div className="service-detail-container">
        <div className="service-detail-back-bar">
          <button className="btn-back-services" onClick={handleBackClick}>
            ← Back to Services
          </button>
        </div>

        <div className="service-detail-content">
          <h1 className="service-detail-title">{titleText}</h1>

          {service.images && Array.isArray(service.images) && service.images.length > 0 && (
            <div className="service-detail-gallery" style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
              gap: '16px',
              marginTop: '16px',
              marginBottom: '24px'
            }}>
              {service.images.map((image, index) => (
                <img
                  key={index}
                  src={`${API_BASE_URL}/uploads/${image}`}
                  alt={`${service.title}-${index}`}
                  style={{
                    width: '100%',
                    height: '180px',
                    objectFit: 'cover',
                    borderRadius: 'var(--radius)',
                    border: '1px solid var(--gray-200)'
                  }}
                />
              ))}
            </div>
          )}

          <div className="service-detail-divider"></div>
          <p className="service-detail-desc">{descText}</p>

          {service.features && Array.isArray(service.features) && service.features.length > 0 && (
            <div className="service-detail-features" style={{ marginTop: '24px' }}>
              <h3 className="features-title" style={{ marginBottom: '12px', fontSize: '18px', color: 'var(--steel)' }}>Key Features</h3>
              <ul style={{ paddingLeft: '20px', lineHeight: '1.6' }}>
                {service.features.map((feature, index) => (
                  <li key={index} style={{ marginBottom: '8px', color: 'var(--gray-700)' }}>{feature}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ServiceDetail;
