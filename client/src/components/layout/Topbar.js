import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Topbar.css';

/**
 * Topbar - header with search and actions
 * Single Responsibility: header/search bar only
 */
const Topbar = ({ onSearch, searchValue }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="topbar">
      <div className="topbar-search">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="topbar-search-icon">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          type="text"
          className="topbar-search-input"
          placeholder="Search site name..."
          value={searchValue || ''}
          onChange={(e) => onSearch?.(e.target.value)}
        />
      </div>

      <div className="topbar-actions">
        <button className="topbar-icon-btn" title="Help">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
            <line x1="12" y1="17" x2="12.01" y2="17" strokeWidth="3" strokeLinecap="round" />
          </svg>
        </button>
        <div className="topbar-divider" />
        <button
          className="topbar-avatar"
          onClick={() => navigate('/settings')}
          title="Settings"
        >
          <span>{user?.email?.charAt(0).toUpperCase() || 'U'}</span>
        </button>
      </div>
    </header>
  );
};

export default Topbar;
