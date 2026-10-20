// File: src/components/navigation/NativePageTransition.jsx
import React from 'react';
import { motion } from 'framer-motion';

/**
 * NativePageTransition
 * Flutter-grade fluid route transition: clean vertical rise and micro-fade,
 * optimized for 60fps/120fps mobile displays without horizontal scroll jitter.
 */
const pageVariants = {
  initial: {
    opacity: 0,
    y: 10,
    scale: 0.995,
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.22,
      ease: [0.22, 1, 0.36, 1], // Flutter cubic standard
    },
  },
  exit: {
    opacity: 0,
    y: -6,
    scale: 0.995,
    transition: {
      duration: 0.15,
      ease: [0.4, 0, 1, 1],
    },
  },
};

export const NativePageTransition = ({ children, className = '' }) => {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className={`w-full min-h-full ${className}`}
    >
      {children}
    </motion.div>
  );
};

export default NativePageTransition;
