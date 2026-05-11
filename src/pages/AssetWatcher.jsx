import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase, TrendingUp, TrendingDown, Plus, X, BarChart3, Trash2 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import useAssets from '../hooks/useAssets';
import AssetSkeleton from '../components/assets/AssetSkeleton';
import { formatCurrency } from '../utils/helpers';
import toast from 'react-hot-toast';

// --- ANIMATION VARIANTS ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

const AssetWatcher = () => {
  const { assets, addAsset, updateAssetPrice, removeAsset, loading } = useAssets();
  
  const [selectedAsset, setSelectedAsset] = useState(null); // For Chart Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(null); // Stores the asset object to update

  // Forms
  const [newAssetForm, setNewAssetForm] = useState({ assetName: '', category: 'Precious Metals', currentValue: '', targetPurchasePrice: '', quantity: '1' });
  const [updatePriceForm, setUpdatePriceForm] = useState('');

  if (loading) return <AssetSkeleton />;

  // --- HANDLERS ---
  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if(!newAssetForm.assetName || !newAssetForm.currentValue) return toast.error("Name and Current Value are required");

    const payload = {
        ...newAssetForm,
        currentValue: Number(newAssetForm.currentValue),
        targetPurchasePrice: newAssetForm.targetPurchasePrice ? Number(newAssetForm.targetPurchasePrice) : null,
        quantity: Number(newAssetForm.quantity)
    };

    const success = await addAsset(payload);
    if(success) {
        toast.success("Asset added!");
        setShowAddModal(false);
        setNewAssetForm({ assetName: '', category: 'Precious Metals', currentValue: '', targetPurchasePrice: '', quantity: '1' });
    }
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    if(!updatePriceForm) return;

    const success = await updateAssetPrice(showUpdateModal._id, Number(updatePriceForm));
    if(success) {
        toast.success("Price updated!");
        setShowUpdateModal(null);
        setUpdatePriceForm('');
        
        // If they had the chart open for this asset, close it to avoid stale data issues (or we could fetch/update it)
        if(selectedAsset?._id === showUpdateModal._id) setSelectedAsset(null);
    }
  };

  const handleDelete = async (e, id) => {
      e.stopPropagation(); // prevent opening chart
      if(window.confirm("Delete this asset tracker?")) {
          const success = await removeAsset(id);
          if(success) toast.success("Asset deleted");
      }
  };

  // --- HELPERS ---
  const calculateChange = (history) => {
      if(!history || history.length < 2) return null;
      const latest = history[history.length - 1].recordedPrice;
      const previous = history[history.length - 2].recordedPrice;
      const diff = latest - previous;
      const percent = (diff / previous) * 100;
      return { diff, percent };
  };

  const categories = ["Precious Metals", "Real Estate", "Vehicles", "Crypto", "Collectibles", "Other"];

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950/20 p-6 pb-24">
      <motion.div 
        className="max-w-7xl mx-auto space-y-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        
        {/* HEADER */}
        <motion.div variants={itemVariants} className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 text-indigo-500 mb-1">
              <Briefcase size={20} />
              <span className="font-bold uppercase tracking-wider text-sm">Asset Watcher</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              Market Tracker
            </h1>
          </div>
          
          <button 
            onClick={() => setShowAddModal(true)}
            className="px-6 py-2.5 rounded-full font-bold shadow-lg shadow-indigo-500/30 transition-all active:scale-95 bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-2"
          >
            <Plus size={18} /> Track New Asset
          </button>
        </motion.div>

        {/* ASSET GRID */}
        {assets.length === 0 ? (
            <motion.div variants={itemVariants} className="glass-panel p-12 flex flex-col items-center justify-center text-center">
                <Briefcase className="w-16 h-16 text-slate-300 dark:text-slate-700 mb-4" />
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No Assets Tracked</h2>
                <p className="text-slate-500 dark:text-slate-400 max-w-md">You aren't tracking any local market assets yet. Add your first asset to start monitoring its price journey.</p>
            </motion.div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {assets.map(asset => {
                    const change = calculateChange(asset.priceHistory);
                    const isUp = change && change.diff > 0;
                    const isDown = change && change.diff < 0;

                    return (
                        <motion.div 
                            key={asset._id}
                            variants={itemVariants}
                            whileHover={{ scale: 1.02 }}
                            onClick={() => setSelectedAsset(asset)}
                            className="glass-panel p-6 border border-slate-200 dark:border-slate-800 relative overflow-hidden group cursor-pointer flex flex-col justify-between min-h-[200px]"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl -mr-16 -mt-16 group-hover:bg-indigo-500/10 transition-colors pointer-events-none"></div>
                            
                            <div>
                                <div className="flex justify-between items-start mb-4">
                                    <div className="inline-block px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                                        {asset.category}
                                    </div>
                                    <div className="flex gap-2">
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); setShowUpdateModal(asset); }}
                                            className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-indigo-500 transition-colors"
                                            title="Update Price"
                                        >
                                            <TrendingUp size={16} />
                                        </button>
                                        <button 
                                            onClick={(e) => handleDelete(e, asset._id)}
                                            className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-rose-500 transition-colors"
                                            title="Delete"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white leading-tight mb-1">{asset.assetName}</h3>
                                {asset.quantity !== 1 && <p className="text-xs text-slate-500 font-medium">Qty: {asset.quantity}</p>}
                            </div>

                            <div className="mt-6 flex items-end justify-between">
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Current Value</p>
                                    <div className="text-2xl font-black text-slate-900 dark:text-white">{formatCurrency(asset.currentValue)}</div>
                                </div>
                                
                                {change && (
                                    <div className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs font-bold ${
                                        isUp ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" :
                                        isDown ? "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400" :
                                        "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400"
                                    }`}>
                                        {isUp ? <TrendingUp size={12} /> : isDown ? <TrendingDown size={12} /> : null}
                                        {Math.abs(change.percent).toFixed(1)}%
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )
                })}
            </div>
        )}

      </motion.div>

      {/* --- MODALS --- */}
      <AnimatePresence>
          {/* 1. ADD ASSET MODAL */}
          {showAddModal && (
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm"
              >
                  <motion.div 
                    initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
                    className="bg-white dark:bg-slate-900 rounded-3xl p-6 w-full max-w-md shadow-2xl border border-slate-200 dark:border-slate-800"
                  >
                      <div className="flex justify-between items-center mb-6">
                          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Track New Asset</h2>
                          <button onClick={() => setShowAddModal(false)} className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">
                              <X size={20} />
                          </button>
                      </div>
                      
                      <form onSubmit={handleAddSubmit} className="space-y-4">
                          <div>
                              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Asset Name</label>
                              <input required type="text" placeholder="e.g. 24K Gold (10g)" value={newAssetForm.assetName} onChange={e => setNewAssetForm({...newAssetForm, assetName: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all" />
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                              <div>
                                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Category</label>
                                  <select value={newAssetForm.category} onChange={e => setNewAssetForm({...newAssetForm, category: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all">
                                      {categories.map(c => <option key={c} value={c}>{c}</option>)}
                                  </select>
                              </div>
                              <div>
                                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Quantity</label>
                                  <input type="number" step="0.01" min="0" value={newAssetForm.quantity} onChange={e => setNewAssetForm({...newAssetForm, quantity: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all" />
                              </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                              <div>
                                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Current Value</label>
                                  <input required type="number" placeholder="₹0" value={newAssetForm.currentValue} onChange={e => setNewAssetForm({...newAssetForm, currentValue: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all" />
                              </div>
                              <div>
                                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Target Price (Opt)</label>
                                  <input type="number" placeholder="₹0" value={newAssetForm.targetPurchasePrice} onChange={e => setNewAssetForm({...newAssetForm, targetPurchasePrice: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all" />
                              </div>
                          </div>

                          <button type="submit" className="w-full py-4 mt-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-colors shadow-lg shadow-indigo-500/20">
                              Start Tracking
                          </button>
                      </form>
                  </motion.div>
              </motion.div>
          )}

          {/* 2. UPDATE PRICE MODAL */}
          {showUpdateModal && (
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm"
              >
                  <motion.div 
                    initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
                    className="bg-white dark:bg-slate-900 rounded-3xl p-6 w-full max-w-sm shadow-2xl border border-slate-200 dark:border-slate-800"
                  >
                      <div className="flex justify-between items-center mb-6">
                          <div>
                              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Update Price</h2>
                              <p className="text-xs font-bold text-slate-500">{showUpdateModal.assetName}</p>
                          </div>
                          <button onClick={() => setShowUpdateModal(null)} className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">
                              <X size={20} />
                          </button>
                      </div>
                      
                      <form onSubmit={handleUpdateSubmit} className="space-y-4">
                          <div>
                              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Today's Market Value</label>
                              <div className="relative">
                                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</span>
                                  <input autoFocus required type="number" placeholder={showUpdateModal.currentValue} value={updatePriceForm} onChange={e => setUpdatePriceForm(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl pl-8 pr-4 py-4 text-2xl font-black text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all" />
                              </div>
                          </div>
                          
                          <button type="submit" className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold transition-colors shadow-lg shadow-emerald-500/20">
                              Log New Price
                          </button>
                      </form>
                  </motion.div>
              </motion.div>
          )}

          {/* 3. CHART MODAL */}
          {selectedAsset && (
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md"
                onClick={() => setSelectedAsset(null)} // Click outside to close
              >
                  <motion.div 
                    initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
                    onClick={(e) => e.stopPropagation()} // Prevent close when clicking inside
                    className="bg-white dark:bg-slate-900 rounded-3xl p-6 w-full max-w-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden"
                  >
                      <div className="flex justify-between items-start mb-8">
                          <div>
                              <div className="flex items-center gap-2 text-indigo-500 mb-1">
                                  <BarChart3 size={18} />
                                  <span className="font-bold uppercase tracking-wider text-xs">Price History</span>
                              </div>
                              <h2 className="text-2xl font-black text-slate-900 dark:text-white">{selectedAsset.assetName}</h2>
                              <p className="text-sm font-bold text-slate-500">Current: <span className="text-emerald-500">{formatCurrency(selectedAsset.currentValue)}</span></p>
                          </div>
                          <button onClick={() => setSelectedAsset(null)} className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">
                              <X size={20} />
                          </button>
                      </div>

                      <div className="w-full h-[300px] min-h-[300px]">
                          <ResponsiveContainer width="99%" height="100%">
                              <LineChart data={selectedAsset.priceHistory.map(h => ({
                                  ...h,
                                  displayDate: new Date(h.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
                              }))} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.1)" vertical={false} />
                                  <XAxis 
                                      dataKey="displayDate" 
                                      axisLine={false} 
                                      tickLine={false} 
                                      tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }}
                                      dy={10}
                                  />
                                  <YAxis 
                                      domain={['auto', 'auto']}
                                      axisLine={false} 
                                      tickLine={false} 
                                      tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }}
                                      tickFormatter={(value) => `₹${value}`}
                                  />
                                  <Tooltip 
                                      contentStyle={{ 
                                          backgroundColor: 'rgba(15, 23, 42, 0.9)', 
                                          border: 'none', 
                                          borderRadius: '12px', 
                                          color: '#fff',
                                          fontWeight: 'bold',
                                          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)'
                                      }}
                                      formatter={(value) => [`₹${value}`, 'Price']}
                                  />
                                  <Line 
                                      type="monotone" 
                                      dataKey="recordedPrice" 
                                      stroke="#6366f1" 
                                      strokeWidth={4}
                                      dot={{ r: 4, strokeWidth: 2, fill: '#fff', stroke: '#6366f1' }}
                                      activeDot={{ r: 6, strokeWidth: 0, fill: '#6366f1' }}
                                  />
                              </LineChart>
                          </ResponsiveContainer>
                      </div>
                  </motion.div>
              </motion.div>
          )}
      </AnimatePresence>

    </div>
  );
};

export default AssetWatcher;
