// File: src/components/ui/PullToRefresh.jsx
import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { Haptics } from '../../utils/haptics';

/**
 * PullToRefresh Container
 * Replicates Flutter's RefreshIndicator widget with elastic pull physics,
 * visual rotation, and haptic trigger threshold.
 */
export const PullToRefresh = ({ onRefresh, children, className = '' }) => {
  const [pullY, setPullY] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const startYRef = useRef(0);
  const isPullingRef = useRef(false);
  const containerRef = useRef(null);

  const TRIGGER_THRESHOLD = 70;
  const MAX_PULL = 110;

  const handleTouchStart = (e) => {
    // Only allow pull-to-refresh if we're at the very top of the scroll container
    if (containerRef.current && containerRef.current.scrollTop <= 0) {
      startYRef.current = e.touches[0].clientY;
      isPullingRef.current = true;
    }
  };

  const handleTouchMove = (e) => {
    if (!isPullingRef.current || isRefreshing) return;

    const currentY = e.touches[0].clientY;
    const rawDiff = currentY - startYRef.current;

    if (rawDiff > 0 && containerRef.current && containerRef.current.scrollTop <= 0) {
      // Elastic dampening curve
      const dampened = Math.min(rawDiff * 0.45, MAX_PULL);
      setPullY(dampened);

      if (dampened >= TRIGGER_THRESHOLD && pullY < TRIGGER_THRESHOLD) {
        Haptics.light();
      }
    } else {
      setPullY(0);
    }
  };

  const handleTouchEnd = async () => {
    if (!isPullingRef.current) return;
    isPullingRef.current = false;

    if (pullY >= TRIGGER_THRESHOLD && !isRefreshing && onRefresh) {
      setIsRefreshing(true);
      setPullY(TRIGGER_THRESHOLD);
      Haptics.medium();

      try {
        await onRefresh();
      } catch (err) {
        console.error('Refresh error:', err);
      } finally {
        setIsRefreshing(false);
        setPullY(0);
        Haptics.light();
      }
    } else {
      setPullY(0);
    }
  };

  return (
    <div
      ref={containerRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className={`relative overflow-y-auto overscroll-contain no-scrollbar ${className}`}
    >
      {/* Floating Refresh Indicator (Flutter Style) */}
      <motion.div
        animate={{
          y: pullY > 0 || isRefreshing ? pullY - 35 : -50,
          scale: pullY > 15 || isRefreshing ? 1 : 0.6,
          opacity: pullY > 15 || isRefreshing ? 1 : 0,
        }}
        transition={{ type: 'spring', damping: 25, stiffness: 350 }}
        className="absolute top-2 left-1/2 -translate-x-1/2 z-40 pointer-events-none"
      >
        <div className="w-10 h-10 rounded-full bg-white dark:bg-slate-800 shadow-xl border border-slate-200 dark:border-slate-700 flex items-center justify-center text-blue-600 dark:text-blue-400">
          <Loader2
            size={20}
            className={`${isRefreshing ? 'animate-spin' : ''}`}
            style={{
              transform: isRefreshing ? undefined : `rotate(${pullY * 4}deg)`,
            }}
          />
        </div>
      </motion.div>

      {/* Main Content with dynamic push */}
      <motion.div
        animate={{ y: pullY > 0 ? pullY * 0.35 : 0 }}
        transition={{ type: 'spring', damping: 28, stiffness: 320 }}
      >
        {children}
      </motion.div>
    </div>
  );
};

export default PullToRefresh;
