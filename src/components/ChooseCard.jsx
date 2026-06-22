import React from 'react';
import * as Icons from 'react-icons/fa';
import './ChooseCard.css';

const ChooseCard = ({ title, shortDescription, iconName }) => {
  const IconComponent = Icons[iconName] || Icons.FaCheckCircle;

  return (
    <div className="choose-card">
      <div className="choose-icon-wrapper">
        <IconComponent className="choose-icon" />
      </div>
      <div className="choose-content">
        <h3 className="choose-title">{title}</h3>
        <p className="choose-description">{shortDescription}</p>
      </div>
    </div>
  );
};

export default ChooseCard;
