// -----------------------------------------------------------------------------
// ToastContext
// Provides a simple global notification system for short messages
// (login/logout success, etc.).
// -----------------------------------------------------------------------------
import React, { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext();

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null); // { message, type }

  // show a toast for 3 seconds
  const showToast = useCallback((message, type = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast && <Toast message={toast.message} type={toast.type} />}
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);

// -----------------------------------------------------------------------------
// Inline Toast component
// -----------------------------------------------------------------------------
function Toast({ message, type }) {
  const background = type === 'success' ? '#28a745' : '#333';
  return (
    <div
      style={{
        position: 'fixed',
        bottom: '2rem',
        right: '2rem',
        padding: '0.75rem 1.25rem',
        background,
        color: '#fff',
        borderRadius: '4px',
        boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
        fontWeight: 500,
        zIndex: 9999,
        transition: 'opacity 0.3s ease',
      }}
    >
      {message}
    </div>
  );
}
