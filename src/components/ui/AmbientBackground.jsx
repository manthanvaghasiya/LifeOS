import React from 'react';

const AmbientBackground = () => {
  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
      {/* Top Left: Deep Blue/Purple */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-blue-400/30 dark:bg-blue-600/10 rounded-full blur-[120px] animate-blob mix-blend-multiply dark:mix-blend-normal"></div>
      
      {/* Top Right: Rose/Pink (Delayed) */}
      <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] bg-rose-300/30 dark:bg-rose-600/10 rounded-full blur-[120px] animate-blob animation-delay-2000 mix-blend-multiply dark:mix-blend-normal"></div>
      
      {/* Bottom Left: Indigo (Delayed more) */}
      <div className="absolute bottom-[-20%] left-[-10%] w-[50%] h-[50%] bg-indigo-400/30 dark:bg-indigo-600/10 rounded-full blur-[120px] animate-blob animation-delay-4000 mix-blend-multiply dark:mix-blend-normal"></div>
      
      {/* Bottom Center: Violet Accent */}
      <div className="absolute bottom-[-10%] right-[20%] w-[40%] h-[40%] bg-violet-400/30 dark:bg-violet-600/10 rounded-full blur-[100px] animate-blob animation-delay-2000"></div>
    </div>
  );
};

export default AmbientBackground;
