import toast from 'react-hot-toast';

// Simple XP System
export const addXP = (amount) => {
  const currentXP = parseInt(localStorage.getItem('user_xp') || '0');
  const newXP = currentXP + amount;
  localStorage.setItem('user_xp', newXP.toString());
  
  // Level Up Logic (Every 100 XP)
  const oldLevel = Math.floor(currentXP / 100);
  const newLevel = Math.floor(newXP / 100);

  if (newLevel > oldLevel) {
    toast.success(`🎉 Level Up! You are now Level ${newLevel}`, {
        icon: '⭐',
        style: {
            borderRadius: '10px',
            background: '#333',
            color: '#fff',
        },
    });
  }
};

export const getLevel = () => {
    const xp = parseInt(localStorage.getItem('user_xp') || '0');
    return Math.floor(xp / 100);
};

export const getXPProgress = () => {
    const xp = parseInt(localStorage.getItem('user_xp') || '0');
    return xp % 100; // Returns 0-99 for progress bar
};