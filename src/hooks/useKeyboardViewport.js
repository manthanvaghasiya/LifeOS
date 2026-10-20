// File: src/hooks/useKeyboardViewport.js
import { useEffect, useState } from 'react';

/**
 * Custom hook to monitor dynamic mobile virtual keyboard geometry.
 * Prevents fixed navigation bars and footers from getting distorted or trapped behind the keyboard.
 */
export const useKeyboardViewport = () => {
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);

  useEffect(() => {
    // 1. Modern Chromium / Android Virtual Keyboard API
    if (typeof navigator !== 'undefined' && 'virtualKeyboard' in navigator) {
      navigator.virtualKeyboard.overlaysContent = true;
      const onGeometryChange = () => {
        const height = navigator.virtualKeyboard.boundingRect.height;
        setKeyboardHeight(height);
        setIsKeyboardOpen(height > 50);
      };

      navigator.virtualKeyboard.addEventListener('geometrychange', onGeometryChange);
      return () => {
        navigator.virtualKeyboard.removeEventListener('geometrychange', onGeometryChange);
      };
    }

    // 2. iOS Safari & Fallback: Visual Viewport API
    const handleResize = () => {
      if (!window.visualViewport) return;
      const visualHeight = window.visualViewport.height;
      const windowHeight = window.innerHeight;
      const diff = windowHeight - visualHeight;

      if (diff > 120) {
        setKeyboardHeight(diff);
        setIsKeyboardOpen(true);
      } else {
        setKeyboardHeight(0);
        setIsKeyboardOpen(false);
      }
    };

    window.visualViewport?.addEventListener('resize', handleResize);
    window.visualViewport?.addEventListener('scroll', handleResize);

    return () => {
      window.visualViewport?.removeEventListener('resize', handleResize);
      window.visualViewport?.removeEventListener('scroll', handleResize);
    };
  }, []);

  return { keyboardHeight, isKeyboardOpen };
};

export default useKeyboardViewport;
