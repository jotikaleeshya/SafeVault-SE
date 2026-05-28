import React, { useState } from 'react';
import ModalOverlay from './ModalOverlay';
import PasswordInput from '../common/PasswordInput';
import { useAuth } from '../../context/AuthContext';
import './ConfirmModal.css';

/**
 * ViewPasswordModal - master password gate before viewing credentials
 * Single Responsibility: master password verification flow
 */
const ViewPasswordModal = ({ onClose, onVerified }) => {
  const { verifyMasterPassword } = useAuth();
  const [masterPassword, setMasterPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleView = async () => {
    if (!masterPassword) {
      setError('Please enter your master password.');
      return;
    }
    setIsLoading(true);
    setError('');
    try {
      const isValid = await verifyMasterPassword(masterPassword);
      if (isValid) {
        onVerified?.();
      } else {
        setError('Incorrect master password.');
      }
    } catch {
      setError('Verification failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleView();
  };

  return (
    <ModalOverlay onClose={onClose} size="sm">
      <div className="confirm-modal">
        <div className="confirm-modal-icon confirm-modal-icon--blue">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        </div>

        <h2 className="confirm-modal-title">View Password?</h2>
        <p className="confirm-modal-subtitle">Please input your master password</p>

        <div className="confirm-modal-body">
          {error && <div className="confirm-modal-error">{error}</div>}
          <div onKeyDown={handleKeyDown}>
            <PasswordInput
              value={masterPassword}
              onChange={(e) => { setMasterPassword(e.target.value); setError(''); }}
              showToggle={true}
              autoComplete="new-password"
            />
          </div>
        </div>

        <div className="confirm-modal-actions">
          <button className="confirm-cancel-btn" onClick={onClose} disabled={isLoading}>
            Cancel
          </button>
          <button className="confirm-primary-btn" onClick={handleView} disabled={isLoading}>
            {isLoading ? 'Verifying...' : 'View'}
          </button>
        </div>
      </div>
    </ModalOverlay>
  );
};

export default ViewPasswordModal;
