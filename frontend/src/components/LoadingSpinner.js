// -----------------------------------------------------------------------------
// Reusable loading spinner component
// -----------------------------------------------------------------------------
// Usage:
//   import LoadingSpinner from '../components/LoadingSpinner';
//   ...
//   return <LoadingSpinner />;
//
// Automatically centers a CSS-animated ring in its container.
// -----------------------------------------------------------------------------
import React from 'react';
import styles from './LoadingSpinner.module.css';

export default function LoadingSpinner() {
  return (
    <div className={styles.wrapper} role="status" aria-label="Loading">
      <div className={styles.spinner}></div>
    </div>
  );
}
