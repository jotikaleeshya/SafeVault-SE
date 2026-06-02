import React, { useState } from 'react';
import './PasswordInput.css';

/**
 * PasswordInput - reusable password field with show/hide toggle
 * Single Responsibility: password input UI only
 */
const PasswordInput = ({ value, onChange, id, name, autoComplete, showToggle = true }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="password-input-wrapper">
      <span className="password-input-icon">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
      </span>
      <input
        type={isVisible ? 'text' : 'password'}
        className="password-input-field"
        value={value}
        onChange={onChange}
        id={id}
        name={name}
        autoComplete={autoComplete}
      />
      {showToggle && (
        <button
          type="button"
          className="password-toggle-btn"
          onClick={() => setIsVisible(v => !v)}
          aria-label={isVisible ? 'Hide password' : 'Show password'}
        >
          {isVisible ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
              <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
              <line x1="1" y1="1" x2="23" y2="23" />
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          )}
        </button>
      )}
    </div>
  );
};

export default PasswordInput;
