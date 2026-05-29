import React, { useState } from 'react';
import Sidebar from '../components/layout/Sidebar';
import { useAuth } from '../context/AuthContext';
import CannotChangePasswordModal from '../components/modals/CannotChangePasswordModal';
import './SettingsPage.css';
import { useNavigate } from 'react-router-dom';

/**
 * SettingsPage - user profile and app settings
 * Single Responsibility: settings display and toggles
 */
const SettingsPage = () => {
  const { user } = useAuth();
  const [autofill, setAutofill] = useState(true);
  const [showCannotChangeModal, setShowCannotChangeModal] = useState(false);
  const navigate = useNavigate();

  const settingsRows = [
    { label: 'About', type: 'link', href: '/about' },
    { label: 'Help', type: 'link' , href: '/help'},
    { label: 'Autofill', type: 'toggle', value: autofill, onChange: () => setAutofill(v => !v) },
  ];

  return (
    <div className="settings-layout">
      <Sidebar />
      <div className="settings-main">
        <div className="settings-body">
          {/* Profile card */}
          <div className="settings-profile">
            <div className="settings-avatar">
              <span>{user?.email?.charAt(0).toUpperCase() || 'U'}</span>
            </div>
            <div className="settings-profile-info">
              <div className="settings-profile-row">
                <div>
                  <div className="settings-profile-key">EMAIL</div>
                  <div className="settings-profile-value">{user?.email}</div>
                </div>
              </div>
              <div 
                onClick={() => setShowCannotChangeModal(true)}
                style={{ cursor: 'pointer' }}
                title="Click for master password details"
              >
                <div className="settings-profile-key" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  MASTER PASSWORD
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ opacity: 0.6 }}>
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="16" x2="12" y2="12" />
                    <line x1="12" y1="8" x2="12.01" y2="8" />
                  </svg>
                </div>
                <div className="settings-profile-value" style={{ letterSpacing: '3px', fontSize: '0.7rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  ············
                  <span style={{ fontSize: '0.7rem', opacity: 0.5, letterSpacing: 'normal' }}>(Cannot change)</span>
                </div>
              </div>
            </div>
          </div>

        {settingsRows.map((row) => (
          <div
            key={row.label}
            className="settings-row"
            onClick={() => row.href && navigate(row.href)}
            style={{ cursor: row.href ? 'pointer' : 'default' }}
          >
            <span className="settings-row-label">{row.label}</span>
            {row.type === 'toggle' ? (
              <button
                className={`settings-toggle ${row.value ? 'active' : ''}`}
                onClick={(e) => { e.stopPropagation(); row.onChange(); }}
                aria-checked={row.value}
                role="switch"
              >
                <span className="settings-toggle-thumb" />
              </button>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="settings-row-arrow">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            )}
          </div>
        ))}
        </div>
      </div>
      {showCannotChangeModal && (
        <CannotChangePasswordModal onClose={() => setShowCannotChangeModal(false)} />
      )}
    </div>
  );
};

export default SettingsPage;
