// File: src/components/ui/InkWell.jsx
import React, { useState } from 'react';
import { Haptics } from '../../utils/haptics';

/**
 * InkWell Component
 * Mimics Flutter's InkWell widget: produces an expanding radial ripple centered
 * exactly at the touch coordinate, accompanied by a subtle native haptic tap.
 */
export const InkWell = ({
  children,
  onClick,
  className = '',
  splashColor = 'rgba(255, 255, 255, 0.18)',
  disabled = false,
  enableHaptics = true,
  ...props
}) => {
  const [ripples, setRipples] = useState([]);

  const handlePointerDown = (e) => {
    if (disabled) return;

    if (enableHaptics) {
      Haptics.light();
    }

    const rect = e.currentTarget.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 2;
    const clientX = e.clientX ?? (e.touches ? e.touches[0].clientX : rect.left + rect.width / 2);
    const clientY = e.clientY ?? (e.touches ? e.touches[0].clientY : rect.top + rect.height / 2);

    const x = clientX - rect.left - size / 2;
    const y = clientY - rect.top - size / 2;

    const newRipple = { x, y, size, id: `${Date.now()}-${Math.random()}` };
    setRipples((prev) => [...prev, newRipple]);
  };

  const removeRipple = (id) => {
    setRipples((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <div
      onPointerDown={handlePointerDown}
      onClick={(e) => {
        if (!disabled && onClick) onClick(e);
      }}
      className={`relative overflow-hidden cursor-pointer select-none active:scale-[0.985] transition-transform duration-100 ${
        disabled ? 'pointer-events-none opacity-50' : ''
      } ${className}`}
      {...props}
    >
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          onAnimationEnd={() => removeRipple(ripple.id)}
          className="absolute rounded-full pointer-events-none animate-inkwell"
          style={{
            top: ripple.y,
            left: ripple.x,
            width: ripple.size,
            height: ripple.size,
            backgroundColor: splashColor,
          }}
        />
      ))}
      {children}
    </div>
  );
};

export default InkWell;
