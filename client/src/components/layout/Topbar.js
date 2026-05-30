import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Topbar.css';
import React, { useState, useRef, useEffect } from 'react';

/**
 * Topbar - header with search and actions
 * Single Responsibility: header/search bar only
 */
const Topbar = ({ onSearch, searchValue }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showTips, setShowTips] = useState(false);
  const tipsRef = useRef(null);

  // Tutup kalau klik di luar
  useEffect(() => {
    const handleClick = (e) => {
      if (tipsRef.current && !tipsRef.current.contains(e.target)) {
        setShowTips(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const tips = [
  {
    icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
    text: 'Click "+ Add Entry" to save a new password',
  },
  {
    icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
    text: 'Use the search bar to find entries quickly',
  },
  {
    icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
    text: 'Click an entry to view or copy your password',
  },
  {
    icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
    text: 'Check Security page to find weak passwords',
  },
  {
    icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
    text: 'Enable Autofill in Settings to use the extension',
  },
];

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
        <div className="topbar-tips-wrap" ref={tipsRef}>
          <button
            className={`topbar-icon-btn ${showTips ? 'active' : ''}`}
            title="Quick Tips"
            onClick={() => setShowTips(!showTips)}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
              <line x1="12" y1="17" x2="12.01" y2="17" strokeWidth="3" strokeLinecap="round" />
            </svg>
          </button>

          {showTips && (
            <div className="topbar-tips-dropdown">
              <div className="topbar-tips-title">Quick Tips</div>
              {tips.map((tip, i) => (
                <div key={i} className="topbar-tips-item">
                  <span className="topbar-tips-icon">{tip.icon}</span>
                  <span className="topbar-tips-text">{tip.text}</span>
                </div>
              ))}
            </div>
          )}
        </div>

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