/**
 * Simple toast notification system
 * Provides success, error, and info toast messages
 */

let toastContainer = null;
let toastCounter = 0;

/**
 * Initialize toast container if not already present
 */
function initToastContainer() {
  if (toastContainer) return;
  
  toastContainer = document.createElement('div');
  toastContainer.id = 'toast-container';
  toastContainer.style.cssText = `
    position: fixed;
    top: 80px;
    right: 20px;
    z-index: 9999;
    display: flex;
    flex-direction: column;
    gap: 12px;
    max-width: 400px;
  `;
  document.body.appendChild(toastContainer);
}

/**
 * Show a toast notification
 * @param {string} message - Toast message
 * @param {string} type - Toast type: 'success', 'error', 'info'
 * @param {number} duration - Duration in milliseconds
 */
// PUBLIC_INTERFACE
export function showToast(message, type = 'info', duration = 3000) {
  initToastContainer();
  
  const toastId = `toast-${toastCounter++}`;
  const toast = document.createElement('div');
  toast.id = toastId;
  
  const colors = {
    success: { bg: '#1DB954', border: '#1aa34a', icon: '✓' },
    error: { bg: '#EF4444', border: '#dc2626', icon: '✕' },
    info: { bg: '#2563EB', border: '#1d4ed8', icon: 'ℹ' }
  };
  
  const color = colors[type] || colors.info;
  
  toast.style.cssText = `
    background-color: ${color.bg};
    color: white;
    padding: 14px 18px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 14px;
    font-weight: 500;
    animation: slideIn 0.3s ease-out;
    border: 1px solid ${color.border};
    min-width: 280px;
  `;
  
  toast.innerHTML = `
    <span style="font-size: 18px; font-weight: 700;">${color.icon}</span>
    <span style="flex: 1;">${message}</span>
    <button 
      onclick="this.parentElement.remove()" 
      style="background: transparent; border: none; color: white; font-size: 18px; cursor: pointer; padding: 0; margin-left: 8px; line-height: 1;"
      aria-label="Close"
    >×</button>
  `;
  
  toastContainer.appendChild(toast);
  
  // Auto-remove after duration
  setTimeout(() => {
    if (toast.parentElement) {
      toast.style.animation = 'slideOut 0.3s ease-in';
      setTimeout(() => toast.remove(), 300);
    }
  }, duration);
}

/**
 * Show a success toast
 * @param {string} message - Success message
 */
// PUBLIC_INTERFACE
export function showSuccess(message) {
  showToast(message, 'success');
}

/**
 * Show an error toast
 * @param {string} message - Error message
 */
// PUBLIC_INTERFACE
export function showError(message) {
  showToast(message, 'error', 4000);
}

/**
 * Show an info toast
 * @param {string} message - Info message
 */
// PUBLIC_INTERFACE
export function showInfo(message) {
  showToast(message, 'info');
}

// Add animations to document
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from {
      transform: translateX(400px);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  @keyframes slideOut {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(400px);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);
