import React, { useEffect, useRef } from 'react';
import './ConfirmationModal.css';

const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Are you sure?",
  message = "Are you sure you want to continue?",
  confirmText = "Confirm",
  cancelText = "Cancel"
}) => {
  const modalRef = useRef(null);
  const previousFocusRef = useRef(null); // Pehle wale focused element ko yaad rakhne ke liye

  useEffect(() => {
    const handleKeyDown = (e) => {
      // 1. Escape key dabane par close ho
      if (e.key === "Escape") {
        onClose();
        return;
      }

      // 2. Focus Trapping Logic (Tab and Shift+Tab handle karne ke liye)
      if (e.key === "Tab" && modalRef.current) {
        // Modal ke andar ke saare focusable elements ko dhoondho
        const focusableElements = modalRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([-1])'
        );
        
        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          // Agar Shift + Tab daba ho aur hum pehle element par hain, toh aakhri element par le jao
          if (document.activeElement === firstElement) {
            lastElement.focus();
            e.preventDefault();
          }
        } else {
          // Agar sirf Tab daba ho aur hum aakhri element par hain, toh pehle element par le jao
          if (document.activeElement === lastElement) {
            firstElement.focus();
            e.preventDefault();
          }
        }
      }
    };

    if (isOpen) {
      // Modal khulne par active element ko save karo taaki baad me focus return kar sakein
      previousFocusRef.current = document.activeElement;
      
      document.addEventListener("keydown", handleKeyDown);

      // Auto-focus the first button inside the modal when it opens
      setTimeout(() => {
        if (modalRef.current) {
          const focusableElements = modalRef.current.querySelectorAll('button');
          if (focusableElements.length > 0) {
            focusableElements[0].focus();
          }
        }
      }, 50);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      // Modal band hote hi focus wapas purane element par bhej do
      if (!isOpen && previousFocusRef.current) {
        previousFocusRef.current.focus();
      }
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="confirmation-modal-overlay"
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirmation-modal-title"
    >
      <div ref={modalRef} className="confirmation-modal-content" tabIndex="-1">

        <div className="confirmation-modal-header">
          <h3 id="confirmation-modal-title">
            {title}
          </h3>
        </div>

        <div className="confirmation-modal-body">
          <p>{message}</p>
        </div>

        <div className="confirmation-modal-actions">

          <button
            className="confirmation-modal-btn confirmation-modal-btn-cancel focus-visible:ring-2 focus-visible:ring-blue-500 outline-none"
            onClick={onClose}
          >
            {cancelText}
          </button>

          <button
            className="confirmation-modal-btn confirmation-modal-btn-confirm focus-visible:ring-2 focus-visible:ring-blue-500 outline-none"
            onClick={onConfirm}
          >
            {confirmText}
          </button>

        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;