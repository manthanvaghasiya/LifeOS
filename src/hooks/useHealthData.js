import { useState, useEffect, useCallback } from 'react';
import API from '../services/api';

const useHealthData = () => {
  const [todayData, setTodayData] = useState(null);
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchHealthData = useCallback(async () => {
    setLoading(true);
    try {
      // Fetch concurrently for performance
      const [todayRes, historyRes] = await Promise.all([
        API.get('/health/today'),
        API.get('/health/history')
      ]);
      
      setTodayData(todayRes.data);
      setHistoryData(historyRes.data);
    } catch (error) {
      console.error('Failed to fetch health data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHealthData();
  }, [fetchHealthData]);

  // Expose an update function that optimistically updates the local state
  const updateHealthData = async (payload) => {
    // Optimistic Update
    setTodayData(prev => ({ ...prev, ...payload }));
    
    // Also update history if weight was changed so charts reflect immediately
    if (payload.weight) {
      setHistoryData(prev => {
        const todayStr = new Date().toISOString().split('T')[0];
        const lastEntry = prev.length > 0 ? prev[prev.length - 1] : null;
        
        if (lastEntry && new Date(lastEntry.date).toISOString().split('T')[0] === todayStr) {
          // Update today's existing history entry
          return [...prev.slice(0, -1), { ...lastEntry, weight: payload.weight }];
        } else {
          // Add a new entry for today if none exists in history
          return [...prev, { date: new Date().toISOString(), weight: payload.weight }];
        }
      });
    }

    try {
      const res = await API.post('/health/today', payload);
      // Ensure state is perfectly synced with DB after save
      setTodayData(res.data);
    } catch (error) {
      console.error('Failed to update health data:', error);
      // Depending on requirements, you might want to revert the optimistic update here
      // or trigger a toast notification.
      fetchHealthData(); // Re-sync with server on failure
    }
  };

  return {
    todayData,
    historyData,
    updateHealthData,
    loading,
    refresh: fetchHealthData
  };
};

export default useHealthData;
