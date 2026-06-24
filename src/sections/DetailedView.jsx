import React, { useState, useEffect, useMemo } from 'react';
import {
  FaArrowLeft,
  FaMapMarkerAlt,
  FaTag,
  FaCalendarAlt,
  FaUser,
  FaCheckCircle,
  FaTools,
  FaFileAlt,
} from 'react-icons/fa';
import './DetailedView.css';
import { API_BASE_URL } from '../App';
import { getServiceFallbackImage } from '../utils/imageFallback';


const useEnquiryForm = (itemName) => {
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState({ show: false, type: '', message: '' });

  const showToast = (message, type) => {
    setToast({ show: true, type, message });
    setTimeout(() => setToast({ show: false, type: '', message: '' }), 4000);
  };

  const updateField = (field) => (e) =>
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      showToast('Please fill in your name and email.', 'error');
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/enquiry`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, service: itemName }),
      });
      if (!res.ok) throw new Error('API error');
      showToast('Enquiry submitted successfully! Our team will contact you.', 'success');
    } catch (err) {
      showToast(`Enquiry received! (Demo Mode - logged for ${itemName})`, 'success');
    } finally {
      setIsSubmitting(false);
      setFormData({ name: '', phone: '', email: '', message: '' });
    }
  };

  return { formData, updateField, handleSubmit, isSubmitting, toast };
};

const getFullImgUrl = (imgUrl) => {
  if (!imgUrl) return null;
  return `${API_BASE_URL}${imgUrl}`;
};

const Toast = ({ toast }) => {
  if (!toast.show) return null;
  const toastClass = toast.type === 'success' ? 'toast-success' : 'toast-error';
  return (
    <div className={`detail-toast ${toastClass}`}>
      {toast.type === 'success' && <FaCheckCircle className="toast-icon" />}
      <span>{toast.message}</span>
    </div>
  );
};

const HeroHeader = ({ category, meta, onBack }) => (
  <div className="detail-top-bar">
    <button className="btn-back" onClick={onBack}>
      <FaArrowLeft /> Back to Catalog
    </button>
    <div className="detail-pills-row">
      <span className="detail-category-badge">{category}</span>
      {meta.client && <span className="detail-pill"><FaUser className="pill-icon" /> <strong>Client:</strong> {meta.client}</span>}
      {meta.year && <span className="detail-pill"><FaCalendarAlt className="pill-icon" /> <strong>Year:</strong> {meta.year}</span>}
      {meta.location && <span className="detail-pill"><FaMapMarkerAlt className="pill-icon" /> <strong>Location:</strong> {meta.location}</span>}
      {meta.price && <span className="detail-pill pricing-pill"><FaTag className="pill-icon" /> <strong>Est. Rate:</strong> ₹{meta.price}</span>}
    </div>
  </div>
);

const EnquirySection = ({ itemName, formData, updateField, handleSubmit, isSubmitting }) => (
  <div className="detail-enquiry-section">
    <div className="enquiry-card">
      <div className="enquiry-card-header">
        <h2>Request Quote & Enquiry</h2>
        <p>Have questions about <strong>{itemName}</strong>? Send us an inquiry.</p>
      </div>
      <form onSubmit={handleSubmit} className="enquiry-form">
        <div className="form-row">
          <div className="form-field">
            <label>Full Name *</label>
            <input type="text" placeholder="e.g. John Doe" value={formData.name} onChange={updateField('name')} required />
          </div>
          <div className="form-field">
            <label>Phone Number</label>
            <input type="tel" placeholder="e.g. +91 98765 43210" value={formData.phone} onChange={updateField('phone')} />
          </div>
        </div>
        <div className="form-row">
          <div className="form-field">
            <label>Email Address *</label>
            <input type="email" placeholder="e.g. name@company.com" value={formData.email} onChange={updateField('email')} required />
          </div>
          <div className="form-field">
            <label>Product / Service</label>
            <input type="text" value={itemName} disabled className="disabled-input" />
          </div>
        </div>
        <div className="form-field">
          <label>Message / Special Requirements</label>
          <textarea placeholder="Provide details about custom sizes, load requirements..." value={formData.message} onChange={updateField('message')} rows={3} />
        </div>
        <button type="submit" className="btn-submit-enquiry" disabled={isSubmitting}>
          {isSubmitting ? 'Sending Enquiry...' : 'Submit Technical Enquiry →'}
        </button>
      </form>
    </div>
  </div>
);

const DetailedView = ({ itemId, itemType, projects, services, onBack }) => {
  const [activeImage, setActiveImage] = useState('');

  const item = useMemo(() => {
    if (itemType === 'project') return projects.find((p) => String(p.id) === String(itemId));
    if (itemType === 'service') return services.find((s) => String(s._id || s.id) === String(itemId));
    return null;
  }, [itemId, itemType, projects, services]);

  const titleText = item?.title || item?.name || 'Untitled Offering';
  const categoryText = item?.category || (itemType === 'service' ? 'Yard Service' : 'Fabrication Project');

  const { formData, updateField, handleSubmit, isSubmitting, toast } = useEnquiryForm(titleText);

  useEffect(() => {
    let objectUrl = '';

    if (item) {
      const rawImg = item.images || item.gallery?.[0];

      if (rawImg) {
        // CASE 1: Agar admin ne nayi file select ki hai (Blob/File Object)
        if (rawImg instanceof Blob || rawImg instanceof File) {
          objectUrl = URL.createObjectURL(rawImg);
          setActiveImage(objectUrl);
        }
        // CASE 2: Agar admin ne Base64 format mein data diya hai
        else if (typeof rawImg === 'string' && rawImg.startsWith('data:image')) {
          setActiveImage(rawImg);
        }
        // CASE 3: Agar backend se pehle se saved filename aa raha hai
        else {
          setActiveImage(`${API_BASE_URL}/uploads/${rawImg}`);
        }
      } else {
        // Agar koi image nahi hai, toh state ko null kar do
        setActiveImage(null);
      }
    }

    // Cleanup memory
    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [item]);

  if (!item) {
    return (
      <div className="detail-error-container">
        <div className="section-inner">
          <button className="btn-back" onClick={onBack}><FaArrowLeft /> Back to Catalog</button>
          <div className="error-card"><h3>Offering Not Found</h3></div>
        </div>
      </div>
    );
  }

  return (
    <div className="image-container">
      {activeImage ? (
        <img
          src={activeImage}
          alt="Service Dynamic Preview"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = getServiceFallbackImage(titleText);
          }}
          style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
        />
      ) : (
        <img
          src={getServiceFallbackImage(titleText)}
          alt="Service Dynamic Preview"
          style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
        />
      )}
    </div>
  );
};

export default DetailedView;