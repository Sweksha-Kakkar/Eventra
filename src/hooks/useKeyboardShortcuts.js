import { useEffect } from 'react';

export const useKeyboardShortcuts = (callbacks) => {
  useEffect(() => {
    const handleKeyDown = (event) => {
      // Ensure shortcuts don't fire when typing inside inputs or textareas
      const activeElement = document.activeElement;
      const isTyping = activeElement && (
        activeElement.tagName === 'INPUT' || 
        activeElement.tagName === 'TEXTAREA' || 
        activeElement.isContentEditable
      );

      if (isTyping) {
        if (event.key === 'Escape') {
          activeElement.blur(); // Escape pops focus out of input
        }
        return;
      }

      // Key shortcut mappings
      if (event.key.toLowerCase() === 'n') {
        event.preventDefault();
        if (callbacks.onNewEvent) callbacks.onNewEvent();
      } else if (event.key === ' ') { // Fixed fallback shortcut instead of forward-slash to prevent default browser search loops
        event.preventDefault();
        if (callbacks.onSearchFocus) callbacks.onSearchFocus();
      } else if (event.key === 'Escape') {
        if (callbacks.onCloseModals) callbacks.onCloseModals();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [callbacks]);
};