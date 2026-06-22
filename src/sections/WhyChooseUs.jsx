import React from 'react';
import ChooseCard from '../components/ChooseCard';
import Button from '../components/Button';
import './WhyChooseUs.css';

const WhyChooseUs = () => {
  const values = [
    {
      title: "Quality Assurance",
      description: "Strict ISO welding inspections, load tests, and protective coating checks before shipment.",
      iconName: "FaAward"
    },
    {
      title: "Skilled Team",
      description: "AWS-certified welders, skilled structural engineers, and precision design coordinators.",
      iconName: "FaUsers"
    },
    {
      title: "Custom Fabrication",
      description: "Tailoring designs from blueprints to final products to match your operations.",
      iconName: "FaTools"
    },
    {
      title: "Timely Delivery",
      description: "Optimized metalwork processes ensure lead times are met on every batch order.",
      iconName: "FaCalendarCheck"
    },
    {
      title: "Customer Satisfaction",
      description: "Direct communications, layout reviews, and reliable engineering support.",
      iconName: "FaHandshake"
    }
  ];

  return (
    <section id="why-choose-us" className="why-choose-us-section section-padding">
      <div className="container why-grid">
        <div className="why-intro">
          <span className="why-tagline">Our Strengths</span>
          <h2 className="why-title">Precision Steel Crafting Meets Structural Safety</h2>
          <div className="accent-bar"></div>
          <p className="why-text">
            We don't just bend metal; we manufacture core industrial assets. Our production lines combine automated plasma cutting and hydraulic forming presses with certified hand welding to ensure long lifespans in tough environments.
          </p>
          <p className="why-text">
            Whether ordering a single forklift cage or a batch of heavy-duty roll-on bins, we provide structural certifications and material test certificates to guarantee field safety.
          </p>
          <Button href="#contact" variant="accent" className="why-cta-btn">
            Discuss Your Project
          </Button>
        </div>

        <div className="why-cards-grid">
          {values.map((val, idx) => (
            <ChooseCard
              key={idx}
              title={val.title}
              description={val.longDescription}
              iconName={val.iconName}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
