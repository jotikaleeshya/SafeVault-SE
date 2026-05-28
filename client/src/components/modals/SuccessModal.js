import React from 'react';
import ModalOverlay from './ModalOverlay';
import './ConfirmModal.css';

/**
 * SuccessModal - feedback after successful actions
 * Single Responsibility: success state display only
 */
const SuccessModal = ({ type = 'saved', onClose }) => {
  const isSaved = type === 'saved';

  return (
    <ModalOverlay onClose={onClose} size="sm">
      <div className="confirm-modal">
        <div className={`confirm-modal-icon ${isSaved ? 'confirm-modal-icon--neutral' : 'confirm-modal-icon--red'}`}>
          {isSaved ? (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
              <polyline points="17 21 17 13 7 13 7 21" />
              <polyline points="7 3 7 8 15 8" />
            </svg>
          ) : (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6l-1 14H6L5 6" />
              <path d="M10 11v6M14 11v6" />
              <path d="M9 6V4h6v2" />
            </svg>
          )}
        </div>

        <h2 className="confirm-modal-title">{isSaved ? 'Data Saved!' : 'Data Deleted!'}</h2>
        <p className="confirm-modal-subtitle">
          {isSaved ? 'Your data has been saved safely!' : 'Your data has been deleted!'}
        </p>

        <div className="confirm-modal-actions confirm-modal-actions--single">
          <button className="confirm-back-btn" onClick={onClose}>
            Back to Dashboard
          </button>
        </div>
      </div>
    </ModalOverlay>
  );
};

export default SuccessModal;
