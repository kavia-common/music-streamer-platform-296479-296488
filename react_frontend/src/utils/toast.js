/**
 * Simple toast notification utility
 * Displays temporary success/error messages to the user
 */

// Toast container management
let toastContainer = null;

/**
 * Initialize toast container if it doesn't exist
 */
// PUBLIC_INTERFACE
function initToastContainer() {
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'toast-container';
    toastContainer.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 10000;
      display: flex;
      flex-direction: column;
      gap: 10px;
      pointer-events: none;
    `;
    document.body.appendChild(toastContainer);
  }
  return toastContainer;
}

/**
 * Show a toast message
 * @param {string} message - Message to display
 * @param {string} type - Type of toast ('success' or 'error')
 * @param {number} duration - Duration in milliseconds (default 3000)
 */
// PUBLIC_INTERFACE
function showToast(message, type = 'info', duration = 3000) {
  const container = initToastContainer();
  
  const toast = document.createElement('div');
  toast.style.cssText = `
    background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#2563EB'};
    color: white;
    padding: 12px 20px;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    font-size: 14px;
    font-weight: 500;
    max-width: 300px;
    word-wrap: break-word;
    pointer-events: auto;
    animation: slideIn 0.3s ease-out;
    opacity: 1;
    transition: opacity 0.3s;
  `;
  
  toast.textContent = message;
  container.appendChild(toast);
  
  // Auto-remove after duration
  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 300);
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
  showToast(message, 'error');
}

/**
 * Show an info toast
 * @param {string} message - Info message
 */
// PUBLIC_INTERFACE
export function showInfo(message) {
  showToast(message, 'info');
}

// Add animation keyframes to document
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideIn {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
  `;
  document.head.appendChild(style);
}
