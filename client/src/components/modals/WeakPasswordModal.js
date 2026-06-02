import React from 'react';
import ModalOverlay from './ModalOverlay';
import { calculatePasswordStrength } from '../../utils/passwordUtils';
import './ConfirmModal.css';

/**
 * WeakPasswordModal - warns user that their password is weak
 * Single Responsibility: weak password warning and choice to continue
 */
const WeakPasswordModal = ({ password, onClose, onConfirm }) => {
  const { score, label, color } = calculatePasswordStrength(password);

  return (
    <ModalOverlay onClose={onClose} size="sm">
      <div className="confirm-modal">
        <div className="confirm-modal-icon confirm-modal-icon--red">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
        </div>

        <h2 className="confirm-modal-title">Weak Password</h2>
        <p className="confirm-modal-subtitle">
          Your chosen password is <strong>{label.toLowerCase()}</strong>. A weak password puts your credentials at risk.
        </p>

        <div className="confirm-modal-body">
          <div className="confirm-password-strength-info" style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid var(--border-subtle)',
            padding: '12px',
            borderRadius: 'var(--radius-md)',
            width: '100%',
            textAlign: 'left'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Strength Score:</span>
              <span style={{ color: color, fontWeight: '700' }}>{score}%</span>
            </div>
            <div style={{ width: '100%', height: '6px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
              <div style={{ width: `${score}%`, height: '100%', background: color, transition: 'width 0.3s ease' }} />
            </div>
          </div>
        </div>

        <div className="confirm-modal-actions">
          <button className="confirm-cancel-btn" onClick={onClose}>
            Make It Stronger
          </button>
          <button className="confirm-delete-btn" onClick={onConfirm}>
            Continue Anyway
          </button>
        </div>
      </div>
    </ModalOverlay>
  );
};

export default WeakPasswordModal;
