import React, { useEffect, useState } from 'react';
import { Trophy, Star, X, Zap } from 'lucide-react';

const LevelUpModal = ({ level, onClose }) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(true);
    // Auto-close confetti effect/modal after 5 seconds if not clicked
    const timer = setTimeout(() => {
        handleClose();
    }, 6000);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setShow(false);
    setTimeout(onClose, 300); // Wait for animation
  };

  return (
    <div className={`fixed inset-0 z-[100] flex items-center justify-center p-4 transition-all duration-500 ${show ? 'bg-black/80 backdrop-blur-sm' : 'bg-transparent pointer-events-none'}`}>
      
      {/* BACKGROUND RAYS EFFECT */}
      <div className={`absolute inset-0 overflow-hidden pointer-events-none transition-opacity duration-1000 ${show ? 'opacity-100' : 'opacity-0'}`}>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-full blur-3xl animate-pulse"></div>
      </div>

      {/* MAIN CARD */}
      <div className={`relative bg-white dark:bg-gray-900 border-2 border-yellow-400 p-8 rounded-[2.5rem] shadow-2xl shadow-yellow-500/50 max-w-sm w-full text-center transform transition-all duration-700 cubic-bezier(0.34, 1.56, 0.64, 1) ${show ? 'scale-100 translate-y-0 opacity-100' : 'scale-50 translate-y-20 opacity-0'}`}>
        
        {/* ICON */}
        <div className="absolute -top-12 left-1/2 -translate-x-1/2">
            <div className="relative">
                <div className="absolute inset-0 bg-yellow-400 rounded-full blur-xl animate-pulse"></div>
                <div className="bg-gradient-to-br from-yellow-300 to-orange-500 p-6 rounded-full shadow-lg relative z-10 border-4 border-white dark:border-gray-900">
                    <Trophy className="w-10 h-10 text-white fill-white" />
                </div>
            </div>
        </div>

        {/* CONTENT */}
        <div className="mt-8 space-y-4">
            <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-orange-600 uppercase tracking-tighter">
                Level Up!
            </h2>
            
            <div className="py-2">
                <span className="text-6xl font-black text-gray-900 dark:text-white drop-shadow-lg">
                    {level}
                </span>
            </div>

            <p className="text-gray-600 dark:text-gray-300 font-medium text-sm">
                Incredible work! You are now a <br/>
                <span className="text-yellow-600 dark:text-yellow-400 font-bold">Level {level} Achiever</span>.
            </p>

            {/* STATS BADGES */}
            <div className="flex justify-center gap-2 pt-2">
                <span className="px-3 py-1 bg-yellow-50 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 rounded-lg text-xs font-bold flex items-center gap-1">
                    <Zap className="w-3 h-3" /> XP Boost
                </span>
                <span className="px-3 py-1 bg-orange-50 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 rounded-lg text-xs font-bold flex items-center gap-1">
                    <Star className="w-3 h-3" /> New Badge
                </span>
            </div>
        </div>

        {/* BUTTON */}
        <button onClick={handleClose} className="mt-8 w-full bg-gray-900 dark:bg-white text-white dark:text-black py-3.5 rounded-2xl font-bold hover:scale-[1.02] active:scale-95 transition shadow-xl">
            Continue Journey
        </button>

      </div>
    </div>
  );
};

export default LevelUpModal;