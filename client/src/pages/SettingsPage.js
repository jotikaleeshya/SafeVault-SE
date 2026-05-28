import React, { useState } from 'react';
import Sidebar from '../components/layout/Sidebar';
import { useAuth } from '../context/AuthContext';
import './SettingsPage.css';

/**
 * SettingsPage - user profile and app settings
 * Single Responsibility: settings display and toggles
 */
const SettingsPage = () => {
  const { user } = useAuth();
  const [autofill, setAutofill] = useState(true);

  const settingsRows = [
    { label: 'About', type: 'link' },
    { label: 'Help', type: 'link' },
    { label: 'Autofill', type: 'toggle', value: autofill, onChange: () => setAutofill(v => !v) },
    { label: 'Trusted Devices', type: 'link' },
    { label: 'Notifications', type: 'link' },
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
                <button className="settings-edit-btn" title="Edit email">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                </button>
              </div>
              <div>
                <div className="settings-profile-key">MASTER PASSWORD</div>
                <div className="settings-profile-value" style={{ letterSpacing: '3px', fontSize: '0.7rem' }}>
                  ············
                </div>
              </div>
            </div>
          </div>

          {/* Settings rows */}
          <div className="settings-rows">
            {settingsRows.map((row) => (
              <div key={row.label} className="settings-row">
                <span className="settings-row-label">{row.label}</span>
                {row.type === 'toggle' ? (
                  <button
                    className={`settings-toggle ${row.value ? 'active' : ''}`}
                    onClick={row.onChange}
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
      </div>
    </div>
  );
};

export default SettingsPage;
