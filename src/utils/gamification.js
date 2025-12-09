import API from '../services/api';
import toast from 'react-hot-toast'; // Or use alert if you don't have toast

export const addXP = async (amount) => {
  try {
    const res = await API.put('/users/xp', { xp: amount });
    
    // 1. Update Local Storage immediately
    const currentUser = JSON.parse(localStorage.getItem('user')) || {};
    const updatedUser = { 
        ...currentUser, 
        level: res.data.level, 
        currentXP: res.data.currentXP, 
        requiredXP: res.data.requiredXP 
    };
    localStorage.setItem('user', JSON.stringify(updatedUser));

    // 2. Trigger Event so Navbar updates instantly
    window.dispatchEvent(new Event('xpUpdate'));

    // 3. Visual Feedback
    if (res.data.leveledUp) {
        alert(`🎉 LEVEL UP! You are now Level ${res.data.level}!`);
    }
  } catch (err) {
    console.error("XP Error", err);
  }
};