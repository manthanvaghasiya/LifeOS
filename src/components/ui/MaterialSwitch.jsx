// File: src/components/ui/MaterialSwitch.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { Haptics } from '../../utils/haptics';

/**
 * Material 3 & Cupertino Style Animated Switch
 * Replaces traditional HTML checkboxes with smooth spring physics and haptics.
 */
export const MaterialSwitch = ({
  checked = false,
  onChange,
  disabled = false,
  activeColor = 'bg-blue-600',
  inactiveColor = 'bg-slate-300 dark:bg-slate-700',
  size = 'md',
}) => {
  const isSmall = size === 'sm';

  const toggle = () => {
    if (disabled) return;
    Haptics.medium();
    if (onChange) onChange(!checked);
  };

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={toggle}
      disabled={disabled}
      className={`relative inline-flex flex-shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200 focus:outline-none select-none ${
        isSmall ? 'h-6 w-11' : 'h-7 w-13'
      } ${checked ? activeColor : inactiveColor} ${
        disabled ? 'opacity-40 cursor-not-allowed' : ''
      }`}
    >
      <motion.span
        layout
        transition={{
          type: 'spring',
          stiffness: 600,
          damping: 35,
        }}
        className={`inline-block rounded-full bg-white shadow-md pointer-events-none ${
          isSmall
            ? checked
              ? 'h-4.5 w-4.5 translate-x-5.5'
              : 'h-4 w-4 translate-x-1'
            : checked
            ? 'h-5.5 w-5.5 translate-x-6.5'
            : 'h-4.5 w-4.5 translate-x-1'
        }`}
      />
    </button>
  );
};

export default MaterialSwitch;
