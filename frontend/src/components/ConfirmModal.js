// -----------------------------------------------------------------------------
// ConfirmModal.js
// -----------------------------------------------------------------------------
// Reusable modal dialog for confirmations (e.g., delete actions)
// Usage:
//   <ConfirmModal
//      show={show}
//      title="Delete Issue"
//      message="Are you sure you want to delete this issue?"
//      onConfirm={handleConfirm}
//      onCancel={() => setShow(false)}
//   />
// -----------------------------------------------------------------------------

import React from 'react';
import styles from './ConfirmModal.module.css';

export default function ConfirmModal({ show, title, message, onConfirm, onCancel }) {
  if (!show) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2 className={styles.title}>{title}</h2>
        <p className={styles.message}>{message}</p>

        <div className={styles.actions}>
          <button onClick={onCancel} className={styles.cancelBtn}>
            Cancel
          </button>
          <button onClick={onConfirm} className={styles.confirmBtn}>
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
