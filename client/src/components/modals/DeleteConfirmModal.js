import React, { useState } from 'react';
import ModalOverlay from './ModalOverlay';
import { useVault } from '../../context/VaultContext';
import './ConfirmModal.css';

/**
 * DeleteConfirmModal - confirms and executes entry deletion
 * Single Responsibility: delete confirmation flow
 */
const DeleteConfirmModal = ({ entryId, onClose, onSuccess }) => {
  const { deleteEntry } = useVault();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleDelete = async () => {
    setIsLoading(true);
    setError('');
    try {
      await deleteEntry(entryId);
      onSuccess?.();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete entry.');
      setIsLoading(false);
    }
  };

  return (
    <ModalOverlay onClose={onClose} size="sm">
      <div className="confirm-modal">
        <div className="confirm-modal-icon confirm-modal-icon--red">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6l-1 14H6L5 6" />
            <path d="M10 11v6M14 11v6" />
            <path d="M9 6V4h6v2" />
          </svg>
        </div>

        <h2 className="confirm-modal-title">Delete Entry?</h2>
        <p className="confirm-modal-subtitle">
          Are you sure you want to delete this password?{' '}
          <strong>This action cannot be undone</strong> and you will lose access to this credential immediately.
        </p>

        {error && (
          <div className="confirm-modal-body">
            <div className="confirm-modal-error">{error}</div>
          </div>
        )}

        <div className="confirm-modal-actions">
          <button className="confirm-cancel-btn" onClick={onClose} disabled={isLoading}>
            Cancel
          </button>
          <button className="confirm-delete-btn" onClick={handleDelete} disabled={isLoading}>
            {isLoading ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </ModalOverlay>
  );
};

export default DeleteConfirmModal;
