import React from 'react';
import ModalOverlay from './ModalOverlay';
import './ConfirmModal.css';

/**
 * CannotChangePasswordModal - warns user that master passwords cannot be changed
 * Single Responsibility: warning presentation
 */
const CannotChangePasswordModal = ({ onClose, onConfirm }) => {
  return (
    <ModalOverlay onClose={onClose} size="sm">
      <div className="confirm-modal">
        <div className="confirm-modal-icon confirm-modal-icon--red">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            <line x1="12" y1="15" x2="12" y2="17" />
          </svg>
        </div>

        <h2 className="confirm-modal-title">Important Security Warning</h2>
        <p className="confirm-modal-subtitle">
          Your master password <strong>cannot be changed</strong> once your vault is created. 
          Make sure you have written it down or saved it securely, as it cannot be recovered.
        </p>

        <div className={`confirm-modal-actions ${!onConfirm ? 'confirm-modal-actions--single' : ''}`}>
          {onConfirm ? (
            <>
              <button className="confirm-cancel-btn" onClick={onClose}>
                Go Back
              </button>
              <button className="confirm-delete-btn" onClick={onConfirm}>
                Continue
              </button>
            </>
          ) : (
            <button className="confirm-back-btn" onClick={onClose}>
              Understood
            </button>
          )}
        </div>
      </div>
    </ModalOverlay>
  );
};

export default CannotChangePasswordModal;
