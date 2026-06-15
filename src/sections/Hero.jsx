import React from 'react';
import './Hero.css';

const Hero = ({ companyDetails }) => {
  const stats = companyDetails?.stats || [
    { label: "Service Types", value: "10+" },
    { label: "Units Delivered", value: "500+" },
    { label: "Years Experience", value: "15+" }
  ];

  return (
    <section className="hero" id="home">
      <div className="hero-inner">
        <div className="hero-eyebrow">{companyDetails?.tagline || "Structural Fabrication Works"}</div>
        <h1 className="hero-title">
          Built to <em>carry</em><br/>the hardest loads.
        </h1>
        <p className="hero-desc">
          {companyDetails?.heroDescription || "RRventures specializes in heavy vehicle body fabrication, tankers, trailers, and custom industrial structures — engineered to perform."}
        </p>
        <div className="hero-actions">
          <a href="#services" className="btn-primary">Explore Services</a>
          <a href="#contact" className="btn-outline">Get a Quote</a>
        </div>
        
        <div className="hero-stats">
          {stats.map((stat, idx) => (
            <div key={idx}>
              <div className="hero-stat-num">
                {stat.value.replace('+', '')}<span>+</span>
              </div>
              <div className="hero-stat-label">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;
