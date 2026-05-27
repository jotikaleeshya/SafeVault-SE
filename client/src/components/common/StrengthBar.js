import React from 'react';
import { calculatePasswordStrength } from '../../utils/passwordUtils';
import './StrengthBar.css';

/**
 * StrengthBar - displays password strength visually
 * Single Responsibility: strength visualization only
 */
const StrengthBar = ({ password }) => {
  const { score, label, color } = calculatePasswordStrength(password);
  const segments = 4;
  const filledSegments = Math.ceil((score / 100) * segments);

  return (
    <div className="strength-bar-container">
      <div className="strength-bar-header">
        <span className="strength-label" style={{ color }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill={color} style={{ marginRight: 4 }}>
            <path d="M12 2L3.09 8.26 4 21h16l.91-12.74L12 2z" />
          </svg>
          {label}
        </span>
        <span className="strength-score">{score}%</span>
      </div>
      <div className="strength-segments">
        {Array.from({ length: segments }, (_, i) => (
          <div
            key={i}
            className="strength-segment"
            style={{
              backgroundColor: i < filledSegments ? color : 'rgba(255,255,255,0.08)',
              transition: `background-color 0.3s ease ${i * 0.05}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default StrengthBar;
