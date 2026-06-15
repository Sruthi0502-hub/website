import React from 'react';
import './Footer.css';

const Footer = ({ companyDetails }) => {
  const brandName = companyDetails?.name || "RRventures";
  const firstWord = brandName.substring(0, 2);
  const remainingWord = brandName.substring(2);

  return (
    <footer>
      <div className="footer-logo">
        {firstWord}<span>{remainingWord}</span>
      </div>
      <div className="footer-copy">
        {companyDetails?.footerText || `© ${new Date().getFullYear()} ${brandName}. All rights reserved.`}
      </div>
    </footer>
  );
};

export default Footer;
