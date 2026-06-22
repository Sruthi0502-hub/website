import React from 'react';
import * as Icons from 'react-icons/fa';
import './ServiceCard.css';

const ServiceCard = ({ title, longDescription, }) => {
  // Dynamic icon mapping using react-icons/fa
  const IconComponent = Icons[iconName] || Icons.FaTools;

  return (
    <div className="service-card">
      <div className="card-icon-container">
        <IconComponent className="card-icon" />
      </div>
      <h3 className="card-title">{title}</h3>
      <p className="card-description">{longDescription}</p>
      <div className="card-accent-border"></div>
    </div>
  );
};

export default ServiceCard;
