// File: src/utils/haptics.js

/**
 * Mobile Haptic Engine
 * Provides subtle tactile feedback matching Flutter's HapticFeedback APIs
 */
export const Haptics = {
  // Light impact (for buttons, tab switches, list item taps)
  light: () => {
    try {
      if (typeof window !== 'undefined' && 'vibrate' in navigator) {
        navigator.vibrate(10);
      }
    } catch {}
  },

  // Medium impact (for toggle switches, state changes)
  medium: () => {
    try {
      if (typeof window !== 'undefined' && 'vibrate' in navigator) {
        navigator.vibrate(18);
      }
    } catch {}
  },

  // Selection click (for dropdowns, wheels, picker items)
  selection: () => {
    try {
      if (typeof window !== 'undefined' && 'vibrate' in navigator) {
        navigator.vibrate(6);
      }
    } catch {}
  },

  // Success pattern (for task completion, level ups, goal reached)
  success: () => {
    try {
      if (typeof window !== 'undefined' && 'vibrate' in navigator) {
        navigator.vibrate([12, 40, 25]);
      }
    } catch {}
  },

  // Error/Warning pattern
  error: () => {
    try {
      if (typeof window !== 'undefined' && 'vibrate' in navigator) {
        navigator.vibrate([35, 50, 35]);
      }
    } catch {}
  },
};

export default Haptics;
