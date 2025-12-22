import API from '../services/api';
// Remove toast if you want to rely solely on the Navbar updates or use it for small XP gains only.

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

    // 3. Visual Feedback (REPLACED ALERT WITH EVENT)
    if (res.data.leveledUp) {
        // Dispatch custom event with the new level
        const event = new CustomEvent('levelUp', { detail: { level: res.data.level } });
        window.dispatchEvent(event);
    }
  } catch (err) {
    console.error("XP Error", err);
  }
};