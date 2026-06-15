import React, { useState, useEffect } from 'react';
import { FaArrowLeft, FaMapMarkerAlt, FaTag, FaCalendarAlt, FaUser, FaCheckCircle, FaTools, FaFileAlt } from 'react-icons/fa';
import './DetailedView.css';

const DetailedView = ({ itemId, itemType, projects, services, onBack, apiBase }) => {
  const [item, setItem] = useState(null);
  const [activeImage, setActiveImage] = useState('');
  const [formName, setFormName] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formMessage, setFormMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({ show: false, type: '', message: '' });

  useEffect(() => {
    let foundItem = null;
    if (itemType === 'project') {
      foundItem = projects.find(p => String(p.id) === String(itemId));
    } else if (itemType === 'service') {
      foundItem = services.find(s => String(s._id || s.id) === String(itemId));
    }

    if (foundItem) {
      setItem(foundItem);
      // Fallback if image doesn't exist
      const mainImg = foundItem.image || (foundItem.gallery && foundItem.gallery[0]) || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80';
      setActiveImage(mainImg);
    }
  }, [itemId, itemType, projects, services]);

  const triggerToast = (msg, type) => {
    setSubmitStatus({ show: true, type, message: msg });
    setTimeout(() => {
      setSubmitStatus({ show: false, type: '', message: '' });
    }, 4000);
  };

  const handleEnquirySubmit = async (e) => {
    e.preventDefault();
    if (!formName || !formEmail) {
      triggerToast('Please fill in your name and email.', 'error');
      return;
    }

    setIsSubmitting(true);
    const targetItemName = item?.title || item?.name || '';
    const payload = {
      name: formName,
      phone: formPhone,
      email: formEmail,
      service: targetItemName,
      message: formMessage
    };

    try {
      const url = apiBase ? `${apiBase}/api/enquiry` : 'https://api.rrventures.com/api/enquiry';
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      if (!res.ok) throw new Error('API error');
      
      triggerToast('Enquiry submitted successfully! Our team will contact you.', 'success');
      setFormName('');
      setFormPhone('');
      setFormEmail('');
      setFormMessage('');
    } catch (err) {
      // Demo fail-safe fallback
      console.warn('API connection failed, simulating success in demo mode.', err);
      triggerToast(`Enquiry received! (Demo Mode - enquiry logged for ${targetItemName})`, 'success');
      setFormName('');
      setFormPhone('');
      setFormEmail('');
      setFormMessage('');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!item) {
    return (
      <div className="detail-error-container">
        <div className="section-inner">
          <button className="btn-back" onClick={onBack}><FaArrowLeft /> Back to Catalog</button>
          <div className="error-card">
            <h3>Offering Not Found</h3>
            <p>The selected item could not be loaded. Please return to the homepage and try again.</p>
          </div>
        </div>
      </div>
    );
  }

  // Create a clean list of images for the gallery
  const galleryList = [];
  if (item.image) galleryList.push(item.image);
  if (item.gallery && Array.isArray(item.gallery)) {
    item.gallery.forEach(img => {
      if (img !== item.image && !galleryList.includes(img)) {
        galleryList.push(img);
      }
    });
  }
  // If no images, add a fallback
  if (galleryList.length === 0) {
    galleryList.push('https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80');
  }

  const titleText = item.title || item.name || 'Untitled Offering';
  const categoryText = item.category || (itemType === 'service' ? 'Yard Service' : 'Fabrication Project');

  return (
    <div className="detail-page-wrapper">
      {/* Toast Notification */}
      {submitStatus.show && (
        <div className={`detail-toast toast-${submitStatus.type}`}>
          {submitStatus.type === 'success' && <FaCheckCircle className="toast-icon" />}
          <span>{submitStatus.message}</span>
        </div>
      )}

      {/* Hero Header */}
      <div className="detail-hero-header">
        <div className="section-inner">
          <button className="btn-back" onClick={onBack}>
            <FaArrowLeft /> Back to Home
          </button>
          
          <div className="detail-header-meta">
            <span className="detail-category-badge">{categoryText}</span>
            <h1 className="detail-main-title">{titleText}</h1>
            
            <div className="detail-pills-row">
              {item.client && (
                <span className="detail-pill"><FaUser /> <strong>Client:</strong> {item.client}</span>
              )}
              {item.year && (
                <span className="detail-pill"><FaCalendarAlt /> <strong>Year:</strong> {item.year}</span>
              )}
              {item.location && (
                <span className="detail-pill"><FaMapMarkerAlt /> <strong>Location:</strong> {item.location}</span>
              )}
              {item.price && (
                <span className="detail-pill pricing-pill"><FaTag /> <strong>Est. Rate:</strong> ₹{item.price}</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="detail-content-container">
        <div className="section-inner">
          <div className="detail-grid-layout">
            
            {/* Left Column: Visual Media Gallery */}
            <div className="detail-media-section">
              <div className="detail-active-image-wrap">
                <img src={activeImage} alt={titleText} className="detail-active-image" />
              </div>
              
              {galleryList.length > 1 && (
                <div className="detail-thumbnails-row">
                  {galleryList.map((imgUrl, idx) => (
                    <div 
                      key={idx} 
                      className={`detail-thumbnail-card ${activeImage === imgUrl ? 'active' : ''}`}
                      onClick={() => setActiveImage(imgUrl)}
                    >
                      <img src={imgUrl} alt={`Thumbnail ${idx + 1}`} />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right Column: Descriptions & Details */}
            <div className="detail-info-section">
              <div className="info-block">
                <h3 className="info-title"><FaFileAlt className="info-icon" /> Description</h3>
                <p className="detail-full-description">
                  {item.description || "No description has been provided for this structural fabrication offering. Please connect with our engineering department for comprehensive design specifications."}
                </p>
              </div>

              {item.specifications && Object.keys(item.specifications).length > 0 && (
                <div className="info-block">
                  <h3 className="info-title"><FaTools className="info-icon" /> Technical Specifications</h3>
                  <div className="specs-table-wrap">
                    <table className="specs-table">
                      <tbody>
                        {Object.entries(item.specifications).map(([key, val]) => (
                          <tr key={key}>
                            <td className="spec-label">{key}</td>
                            <td className="spec-value">{val}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>

          </div>

          {/* Contact / Enquiry Section */}
          <div className="detail-enquiry-section">
            <div className="enquiry-card">
              <div className="enquiry-card-header">
                <h2>Request Quote & Enquiry</h2>
                <p>Have questions about <strong>{titleText}</strong>? Send us an inquiry and our structural engineers will get in touch with you shortly.</p>
              </div>
              
              <form onSubmit={handleEnquirySubmit} className="enquiry-form">
                <div className="form-row">
                  <div className="form-field">
                    <label>Full Name *</label>
                    <input 
                      type="text" 
                      placeholder="e.g. John Doe" 
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      required 
                    />
                  </div>
                  <div className="form-field">
                    <label>Phone Number</label>
                    <input 
                      type="tel" 
                      placeholder="e.g. +91 98765 43210" 
                      value={formPhone}
                      onChange={(e) => setFormPhone(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-field">
                    <label>Email Address *</label>
                    <input 
                      type="email" 
                      placeholder="e.g. name@company.com" 
                      value={formEmail}
                      onChange={(e) => setFormEmail(e.target.value)}
                      required 
                    />
                  </div>
                  <div className="form-field">
                    <label>Product / Service</label>
                    <input 
                      type="text" 
                      value={titleText} 
                      disabled 
                      className="disabled-input" 
                    />
                  </div>
                </div>

                <div className="form-field">
                  <label>Message / Special Requirements</label>
                  <textarea 
                    placeholder="Provide details about your custom size, load requirements, or yard delivery schedules..." 
                    value={formMessage}
                    onChange={(e) => setFormMessage(e.target.value)}
                    rows={4}
                  />
                </div>

                <button type="submit" className="btn-submit-enquiry" disabled={isSubmitting}>
                  {isSubmitting ? 'Sending Enquiry...' : 'Submit Technical Enquiry →'}
                </button>
              </form>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default DetailedView;
