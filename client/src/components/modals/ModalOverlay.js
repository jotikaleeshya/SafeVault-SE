import React, { useEffect } from 'react';
import './ModalOverlay.css';

/**
 * ModalOverlay - base modal backdrop and container
 * Single Responsibility: modal presentation/accessibility only
 */
const ModalOverlay = ({ children, onClose, size = 'md' }) => {
  // Close on Escape key
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  // Prevent body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  return (
    <div className="modal-overlay">
      <div
        className={`modal-container modal-container--${size}`}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
};

export default ModalOverlay;
