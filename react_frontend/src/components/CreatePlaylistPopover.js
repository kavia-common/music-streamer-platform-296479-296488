import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { createPlaylist } from '../api/apiClient';
import { showSuccess, showError } from '../utils/toast';
import './CreatePlaylistPopover.css';

/**
 * Popover component for creating a new playlist
 * Displays a simple form anchored to the create button with only a name field
 * Renders via a portal to avoid clipping and ensure it can overlap the Sidebar.
 * @param {object} props - Component props
 * @param {boolean} props.isOpen - Whether the popover is open
 * @param {function} props.onClose - Callback to close the popover
 * @param {function} props.onSuccess - Callback when playlist is created successfully
 * @param {object} props.anchorRef - Ref to the anchor element (button)
 */
// PUBLIC_INTERFACE
function CreatePlaylistPopover({ isOpen, onClose, onSuccess, anchorRef }) {
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const popoverRef = useRef(null);
  const nameInputRef = useRef(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  // Compute and set popover position relative to the anchor element
  useEffect(() => {
    if (!isOpen || !anchorRef?.current) return;

    const computePosition = () => {
      const rect = anchorRef.current.getBoundingClientRect();
      const margin = 8; // gap from button
      const width = 304; // expected popover width (approx w-76)
      // Prefer aligning right edge with anchor's right, but keep within viewport
      let left = rect.right - width;
      left = Math.max(8, Math.min(left, window.innerWidth - width - 8));
      const top = rect.bottom + margin + window.scrollY;

      setPosition({ top, left: left + window.scrollX });
    };

    computePosition();
    // Recompute on window resize/scroll
    window.addEventListener('resize', computePosition);
    window.addEventListener('scroll', computePosition, true);
    return () => {
      window.removeEventListener('resize', computePosition);
      window.removeEventListener('scroll', computePosition, true);
    };
  }, [isOpen, anchorRef]);

  // Focus input when open
  useEffect(() => {
    if (isOpen && nameInputRef.current) {
      nameInputRef.current.focus();
    }
  }, [isOpen]);

  // Handle click outside to close
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target) &&
        anchorRef.current &&
        !anchorRef.current.contains(event.target)
      ) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose, anchorRef]);

  // Handle escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        event.stopPropagation();
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  /**
   * Validate form inputs
   * @returns {boolean} True if validation passes
   */
  const validateForm = () => {
    const newErrors = {};

    if (!name.trim()) {
      newErrors.name = 'Playlist name is required';
    } else if (name.length > 100) {
      newErrors.name = 'Playlist name must be 100 characters or less';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handle form submission
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      const result = await createPlaylist(name.trim());
      showSuccess(`Playlist "${name}" created successfully!`);

      setName('');
      setErrors({});

      if (onSuccess) {
        onSuccess(result.playlist);
      }

      onClose();
    } catch (error) {
      console.error('Error creating playlist:', error);
      showError(error.message || 'Failed to create playlist');
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Handle cancel button
   */
  const handleCancel = () => {
    setName('');
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  const popover = (
    <div
      className="create-playlist-popover dark-theme z-overlay"
      ref={popoverRef}
      role="dialog"
      aria-label="Create new playlist"
      aria-modal="true"
      style={{
        position: 'absolute',
        top: `${position.top}px`,
        left: `${position.left}px`,
      }}
    >
      <div className="popover-header">
        <h3>Create Playlist</h3>
      </div>

      <form onSubmit={handleSubmit} className="popover-form">
        <div className="form-field">
          <label htmlFor="playlist-name">
            Name <span className="required">*</span>
          </label>
          <input
            id="playlist-name"
            ref={nameInputRef}
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="My Awesome Playlist"
            disabled={isSubmitting}
            className={errors.name ? 'error' : ''}
            maxLength={100}
            aria-required="true"
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? 'name-error' : undefined}
          />
          {errors.name && (
            <span id="name-error" className="field-error" role="alert">
              {errors.name}
            </span>
          )}
        </div>

        <div className="popover-actions">
          <button
            type="button"
            className="btn-cancel"
            onClick={handleCancel}
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn-submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating...' : 'Create'}
          </button>
        </div>
      </form>
    </div>
  );

  // Render via portal to avoid any ancestor overflow clipping (e.g., Sidebar)
  return ReactDOM.createPortal(popover, document.body);
}

export default CreatePlaylistPopover;
