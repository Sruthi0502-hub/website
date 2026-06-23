import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/ServiceDetail.css';
import { API_BASE_URL } from '../App';
import { fallbackServices } from '../data/services';

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
        let found = servicesList.find(s => String(s._id || s.id) === String(id));
        if (!found) {
          found = fallbackServices.find(s => String(s._id || s.id) === String(id));
        }
        setService(found || null);
      } catch (err) {
        console.error('Error fetching service details, trying fallback: ', err);
        const found = fallbackServices.find(s => String(s._id || s.id) === String(id));
        setService(found || null);
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
          <div className="service-detail-state-text">Service not found</div>
          <button className="btn-back-services" onClick={handleBackClick} style={{ marginTop: '16px' }}>
            ← Back to Services
          </button>
        </div>
      </div>
    );
  }

  const imageUrl = service.images 
    ? `${API_BASE_URL}/uploads/${Array.isArray(service.images) ? service.images[0] : service.images}` 
    : (service.image || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80');

  const titleText = service.title || service.name || 'Untitled Service';
  const categoryText = service.category || 'Fabrication';
  const descText = service.description || service.desc || 'No description available for this service.';

  return (
    <div className="service-detail-page">
      <div className="service-detail-container">
        <div className="service-detail-back-bar">
          <button className="btn-back-services" onClick={handleBackClick}>
            ← Back to Services
          </button>
        </div>
        
        <div className="service-detail-image-wrap">
          <img 
            src={imageUrl} 
            alt={titleText} 
            className="service-detail-image"
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80';
            }}
          />
        </div>

        <div className="service-detail-content">
          <span className="service-detail-badge">{categoryText}</span>
          <h1 className="service-detail-title">{titleText}</h1>
          <div className="service-detail-divider"></div>
          <p className="service-detail-desc">{descText}</p>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetail;
