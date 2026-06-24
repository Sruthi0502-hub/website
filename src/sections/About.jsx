import React from 'react';
import './About.css';

const About = () => {
  return (
    <section id="about">
      <div className="section-inner">
        <div className="about-grid">
          <div className="about-visual">
            <img src="/rr-logo.png" alt="RR Ventures Logo" className="about-logo-img" />
          </div>
          <div>
            <div className="section-eyebrow">Who We Are</div>
            <h2 className="section-title">Precision built.<br/>Industry trusted.</h2>
            <p className="section-sub">
              RRventures is a specialized structural fabrication company delivering heavy-duty vehicle bodies, tankers, and custom industrial structures to clients across industries.
            </p>
            
            <div className="about-points">
              <div className="about-point">
                <div className="about-point-icon">🏗️</div>
                <div>
                  <div className="about-point-title">Heavy Industry Expertise</div>
                  <div className="about-point-desc">From single cargo bodies to full fleet builds — we handle every scale of fabrication work.</div>
                </div>
              </div>
              <div className="about-point">
                <div className="about-point-icon">🔩</div>
                <div>
                  <div className="about-point-title">Custom Engineering</div>
                  <div className="about-point-desc">Every structure is fabricated to your exact specifications using industry-grade materials.</div>
                </div>
              </div>
              <div className="about-point">
                <div className="about-point-icon">✅</div>
                <div>
                  <div className="about-point-title">Quality Assured</div>
                  <div className="about-point-desc">Rigorous inspection at every stage ensures every unit meets safety and durability standards.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
