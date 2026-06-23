import React, { useState } from 'react';
import './Contact.css';
import { API_BASE_URL } from '../App';

const Contact = ({ companyDetails, services = [] }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    service: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [toasts, setToasts] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const showToast = (msg, type = '') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, msg, type, show: true }]);

    setTimeout(() => {
      setToasts(prev => prev.map(t => t.id === id ? { ...t, show: false } : t));
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id));
      }, 300);
    }, 3200);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, phone, email, service, message } = formData;

    if (!name.trim() || !email.trim() || !service || service === "") {
      showToast('Please fill in name, email, and select a service.', 'error');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${companyDetails.apiBase}/api/enquiry`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const responseData = await res.json().catch(() => ({}));

      if (!res.ok) {
        // Agar fir bhi server koi dynamic error array bhejta h toh use extract karo
        const errMsg = Array.isArray(responseData.message)
          ? responseData.message.join(', ')
          : (responseData.message || 'Submission failed');
        throw new Error(errMsg);
      }

      showToast('Enquiry sent! We will get back to you soon.', 'success');
      setFormData({ name: '', phone: '', email: '', service: '', message: '' });
    } catch (err) {
      showToast('Something went wrong. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact">
      <div className="section-inner">
        <div className="contact-grid">
          <div>
            <div className="section-eyebrow">Get In Touch</div>
            <h2 className="section-title">Let's build<br />something together.</h2>
            <p className="section-sub" style={{ marginBottom: '36px' }}>
              Tell us what you need and our team will get back to you with a quote.
            </p>

            <div className="contact-info">
              <div className="contact-item">
                <div className="contact-item-icon">📍</div>
                <div>
                  <div className="contact-item-label">Location</div>
                  <div className="contact-item-value">{companyDetails?.address}</div>
                </div>
              </div>
              <div className="contact-item">
                <div className="contact-item-icon">📞</div>
                <div>
                  <div className="contact-item-label">Phone</div>
                  <div className="contact-item-value">{companyDetails?.phone}</div>
                </div>
              </div>
              <div className="contact-item">
                <div className="contact-item-icon">✉️</div>
                <div>
                  <div className="contact-item-label">Email</div>
                  <div className="contact-item-value">{companyDetails?.email}</div>
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="contact-form">
            <div className="form-row-2">
              <div className="form-group">
                <label className="form-label" htmlFor="cName">Full Name</label>
                <input
                  className="form-input"
                  type="text"
                  placeholder="John Smith"
                  id="cName"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="cPhone">Phone</label>
                <input
                  className="form-input"
                  type="tel"
                  placeholder="+91 00000 00000"
                  id="cPhone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="cEmail">Email</label>
              <input
                className="form-input"
                type="email"
                placeholder="you@email.com"
                id="cEmail"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="cService">Service Needed</label>
              <select
                className="form-select"
                id="cService"
                name="service"
                value={formData.service}
                onChange={handleChange}
                required
              >
                <option value="">Select a service…</option>
                {services.map((s) => (
                  <option key={s._id || s.id} value={s._id || s.id}>
                    {s.name || s.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="cMessage">Message</label>
              <textarea
                className="form-textarea"
                placeholder="Tell us about your requirement…"
                id="cMessage"
                name="message"
                value={formData.message}
                onChange={handleChange}
              ></textarea>
            </div>

            <button type="submit" className="btn-submit" id="btnSubmit" disabled={loading}>
              {loading ? 'Sending…' : 'Send Enquiry →'}
            </button>
          </form>
        </div>
      </div>

      {/* Toast wrap */}
      <div className="toast-wrap" id="toastWrap">
        {toasts.map(t => (
          <div key={t.id} className={`toast ${t.type ? `toast-${t.type}` : ''} ${t.show ? 'show' : ''}`}>
            {t.msg}
          </div>
        ))}
      </div>
    </section>
  );
};

export default Contact;