import React from 'react';
import './Button.css';

const Button = ({ children, onClick, type = 'button', variant = 'solid', href, className = '' }) => {
  const btnClass = `btn btn-${variant} ${className}`;

  if (href) {
    return (
      <a href={href} className={btnClass}>
        {children}
      </a>
    );
  }

  return (
    <button type={type} onClick={onClick} className={btnClass}>
      {children}
    </button>
  );
};

export default Button;
