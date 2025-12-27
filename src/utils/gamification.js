import toast from 'react-hot-toast';
import API from '../services/api';

/**
 * Awards XP to the user, updates local storage, and syncs with backend.
 * @param {number} amount - XP to add (e.g., 10)
 */
export const addXP = async (amount) => {
  try {
    // 1. Call Backend to calculate Level/XP securely
    const { data } = await API.put('/users/xp', { xp: amount });

    // 2. Update Local Storage so Navbar updates instantly
    const currentUser = JSON.parse(localStorage.getItem('user'));
    
    const updatedUser = {
      ...currentUser,
      level: data.level,
      currentXP: data.currentXP,
      requiredXP: data.requiredXP
    };

    localStorage.setItem('user', JSON.stringify(updatedUser));

    // 3. Notify the App (Navbar/AuthContext) to refresh
    window.dispatchEvent(new Event('authChange'));

    // 4. Show Celebration if Leveled Up
    if (data.leveledUp) {
      toast.success(`🎉 LEVEL UP! You are now Lvl ${data.level}`, {
        duration: 5000,
        icon: '⭐',
        style: {
          borderRadius: '12px',
          background: '#1e293b', // Slate-800
          color: '#fbbf24',       // Amber-400
          border: '1px solid #334155'
        },
      });
    } else {
      // Optional: Small toast for XP gain
      toast.success(`+${amount} XP`, { 
        duration: 1500, 
        icon: '⚡',
        position: 'bottom-right' 
      });
    }

  } catch (error) {
    console.error("Failed to add XP", error);
  }
};
