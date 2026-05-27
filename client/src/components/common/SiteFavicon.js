import React, { useState } from 'react';
import './SiteFavicon.css';

/**
 * SiteFavicon - displays favicon or generated initial avatar
 * Single Responsibility: favicon display logic only
 */
const SiteFavicon = ({ siteName, siteUrl, size = 40 }) => {
  const [imgError, setImgError] = useState(false);

  const faviconUrl = siteUrl
    ? `https://www.google.com/s2/favicons?domain=${siteUrl}&sz=64`
    : null;

  const initial = siteName ? siteName.charAt(0).toUpperCase() : '?';

  const colors = [
    '#4f73ff', '#7c3aed', '#db2777', '#059669', '#d97706', '#dc2626',
  ];
  const colorIndex = siteName
    ? siteName.charCodeAt(0) % colors.length
    : 0;

  if (faviconUrl && !imgError) {
    return (
      <div className="site-favicon" style={{ width: size, height: size }}>
        <img
          src={faviconUrl}
          alt={siteName}
          onError={() => setImgError(true)}
          style={{ width: '60%', height: '60%', objectFit: 'contain' }}
        />
      </div>
    );
  }

  return (
    <div
      className="site-favicon site-favicon--initial"
      style={{
        width: size,
        height: size,
        fontSize: size * 0.4,
        background: `${colors[colorIndex]}22`,
        border: `1.5px solid ${colors[colorIndex]}44`,
        color: colors[colorIndex],
      }}
    >
      {initial}
    </div>
  );
};

export default SiteFavicon;
