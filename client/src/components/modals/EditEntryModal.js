import React, { useState } from 'react';
import ModalOverlay from './ModalOverlay';
import PasswordInput from '../common/PasswordInput';
import StrengthBar from '../common/StrengthBar';
import { useVault } from '../../context/VaultContext';
import './EntryModal.css';

/**
 * EditEntryModal - handles updating existing vault entry
 * Single Responsibility: edit entry form and submission
 */
const EditEntryModal = ({ entry, onClose, onSuccess }) => {
  const { updateEntry } = useVault();
  const [form, setForm] = useState({
    username: entry?.username || '',
    siteURL: entry?.siteURL,
    password: entry?.password,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (field) => (e) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }));
    setError('');
  };

  const handleSubmit = async () => {
    if (!form.username) {
      setError('Username is required.');
      return;
    }

    const usernameUnchanged = form.username === entry?.username;
    const passwordUnchanged = form.password === entry?.password;
    const urlUnchange = form.siteURL === entry?.siteURL;

    if (usernameUnchanged && urlUnchange && passwordUnchanged) {
      setError('No changes made. Edit something or click Cancel to go back.');
      return;
    }

    setIsLoading(true);
    try {
      const updates = {};
      if (form.username !== entry?.username) {
      updates.username = form.username;
      }
      if (form.password !== entry?.password) {
      updates.password = form.password;
      }
      if (form.siteURL !== entry?.siteURL) {
      updates.siteURL = form.siteURL;
      }

      await updateEntry(entry._id, updates)

      const updatedEntry = await updateEntry(entry._id, updates);
      onSuccess?.(updatedEntry);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update entry.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ModalOverlay onClose={onClose}>
      <div className="entry-modal">
        <div className="entry-modal-header">
          <div className="entry-modal-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
            </svg>
          </div>
          <div>
            <h2 className="entry-modal-title">Edit Password</h2>
            <p className="entry-modal-subtitle">Edit credential securely</p>
          </div>
        </div>

        <div className="entry-modal-body">
          {error && <div className="entry-modal-error">{error}</div>}

          <div className="entry-modal-field">
            <label className="entry-modal-label">USERNAME / EMAIL</label>
            <div className="entry-modal-input-wrap">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="input-prefix-icon">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              <input
                type="text"
                className="entry-modal-input"
                placeholder="your@email.com"
                value={form.username}
                onChange={handleChange('username')}
              />
            </div>
          </div>

          <div className="entry-modal-field">
            <label className="entry-modal-label">SITE URL</label>
            <div className="entry-modal-input-wrap">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="input-prefix-icon">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
              </svg>
              <input
                type="text"
                className="entry-modal-input"
                placeholder="e.g. https://"
                value={form.siteURL}
                onChange={handleChange('siteURL')}
              />
            </div>
          </div>

          <div className="entry-modal-field">
              <label className="entry-modal-label">PASSWORD</label>
            <PasswordInput
              value={form.password}
              onChange={handleChange('password')}
              placeholder="New password"
            />
            {form.password && (
              <div style={{ marginTop: 8 }}>
                <StrengthBar password={form.password} />
              </div>
            )}
          </div>
        </div>

        <div className="entry-modal-actions">
          <button className="entry-modal-cancel-btn" onClick={onClose} disabled={isLoading}>
            Cancel
          </button>
          <button className="entry-modal-submit-btn" onClick={handleSubmit} disabled={isLoading}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            {isLoading ? 'Saving...' : 'Encrypt & Save'}
          </button>
        </div>

        <div className="entry-modal-footer">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
          End-to-end encrypted
        </div>
      </div>
    </ModalOverlay>
  );
};

export default EditEntryModal;
