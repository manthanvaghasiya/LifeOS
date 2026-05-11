import { useState, useEffect, useCallback } from 'react';
import API from '../services/api';

const useAssets = () => {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAssets = useCallback(async () => {
    setLoading(true);
    try {
      const res = await API.get('/assets');
      setAssets(res.data);
    } catch (error) {
      console.error('Failed to fetch assets:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAssets();
  }, [fetchAssets]);

  const addAsset = async (payload) => {
    try {
      const res = await API.post('/assets', payload);
      setAssets(prev => [res.data, ...prev]);
      return true;
    } catch (error) {
      console.error('Failed to add asset:', error);
      return false;
    }
  };

  const updateAssetPrice = async (id, newPrice) => {
    try {
      const res = await API.put(`/assets/${id}/price`, { newPrice });
      
      // Update local state with the returned updated document
      setAssets(prev => prev.map(asset => asset._id === id ? res.data : asset));
      return true;
    } catch (error) {
      console.error('Failed to update asset price:', error);
      return false;
    }
  };
  
  const removeAsset = async (id) => {
      try {
          await API.delete(`/assets/${id}`);
          setAssets(prev => prev.filter(asset => asset._id !== id));
          return true;
      } catch (error) {
          console.error('Failed to remove asset:', error);
          return false;
      }
  };

  return {
    assets,
    addAsset,
    updateAssetPrice,
    removeAsset,
    loading,
    refresh: fetchAssets
  };
};

export default useAssets;
