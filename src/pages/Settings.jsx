import React, { useState, useEffect } from 'react';
import API from '../services/api'; 
import { User, Mail, Lock, Save, Trash2, LogOut, Shield, AlertTriangle, Camera } from 'lucide-react';
import toast from 'react-hot-toast';

const Settings = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  // FETCH USER DATA
  useEffect(() => {
    const fetchProfile = async () => {
        try {
            const res = await API.get('/users/profile');
            setFormData({
                name: res.data.name,
                email: res.data.email,
                password: '' 
            });
            setInitialLoading(false);
        } catch (err) {
            console.error("Failed to load profile", err);
            setInitialLoading(false);
        }
    };
    fetchProfile();
  }, []);

  // UPDATE FUNCTION
  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await API.put('/users/profile', formData);
      
      if (res.data) {
          localStorage.setItem('user', JSON.stringify(res.data));
      }
      
      window.dispatchEvent(new Event('authChange')); 
      toast.success("Profile Updated Successfully!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Update Failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.dispatchEvent(new Event('authChange'));
    window.location.href = '/login';
  };

  const handleDeleteAccount = async (e) => {
    e.preventDefault();
    const confirm = window.prompt("Type 'DELETE' to confirm account deletion. This cannot be undone.");
    if (confirm === 'DELETE') {
        try {
            await API.delete('/users/profile');
            handleLogout();
        } catch (err) { 
            toast.error(err.response?.data?.message || "Error deleting account"); 
        }
    }
  };

  if (initialLoading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="animate-fade-in space-y-8 max-w-2xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center gap-4">
            <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-2xl text-indigo-600 dark:text-indigo-400">
                <Shield className="w-6 h-6" />
            </div>
            <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                    Settings
                </h1>
                <p className="text-slate-500 dark:text-slate-400 font-medium text-sm">
                    Manage your account details and security.
                </p>
            </div>
        </div>

        {/* PROFILE CARD */}
        <div className="glass-panel p-8 relative overflow-hidden">
            {/* Decorative bg blob */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
            
            <form onSubmit={handleUpdate} className="space-y-6 relative z-10">
                
                {/* Avatar Placeholder (Visual Only) */}
                <div className="flex justify-center mb-6">
                    <div className="relative group cursor-pointer">
                        <div className="w-24 h-24 rounded-full bg-slate-100 dark:bg-slate-800 border-4 border-white dark:border-slate-900 shadow-xl flex items-center justify-center text-3xl font-bold text-slate-400 group-hover:bg-slate-200 transition-colors">
                            {formData.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="absolute bottom-0 right-0 p-2 bg-indigo-600 rounded-full text-white shadow-md border-2 border-white dark:border-slate-900 group-hover:scale-110 transition-transform">
                            <Camera className="w-3.5 h-3.5" />
                        </div>
                    </div>
                </div>

                <div className="space-y-5">
                    <div>
                        <label className="label">Full Name</label>
                        <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input 
                                type="text" 
                                className="input-field pl-11 font-semibold" 
                                value={formData.name} 
                                onChange={(e) => setFormData({...formData, name: e.target.value})} 
                            />
                        </div>
                    </div>

                    <div>
                        <label className="label">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input 
                                type="email" 
                                className="input-field pl-11 font-semibold" 
                                value={formData.email} 
                                onChange={(e) => setFormData({...formData, email: e.target.value})} 
                            />
                        </div>
                    </div>

                    <div>
                        <label className="label">New Password</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input 
                                type="password" 
                                placeholder="Leave blank to keep current" 
                                className="input-field pl-11 font-semibold placeholder:font-normal" 
                                value={formData.password} 
                                onChange={(e) => setFormData({...formData, password: e.target.value})} 
                            />
                        </div>
                    </div>
                </div>

                <div className="pt-4">
                    <button 
                        type="submit" 
                        disabled={loading} 
                        className="w-full btn-primary py-3.5 text-base flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20"
                    >
                        {loading ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                <span>Saving...</span>
                            </>
                        ) : (
                            <>
                                <Save className="w-4 h-4" /> 
                                <span>Save Changes</span>
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>

        {/* DANGER ZONE */}
        <div className="rounded-3xl p-6 border border-rose-200 dark:border-rose-900/30 bg-rose-50/50 dark:bg-rose-900/10">
            <div className="flex items-start gap-4">
                <div className="p-3 bg-rose-100 dark:bg-rose-900/30 rounded-xl text-rose-600 dark:text-rose-400 shrink-0">
                    <AlertTriangle className="w-6 h-6" />
                </div>
                <div>
                    <h3 className="text-lg font-bold text-rose-700 dark:text-rose-400">Danger Zone</h3>
                    <p className="text-sm text-rose-600/80 dark:text-rose-400/70 font-medium mt-1 mb-6">
                        Irreversible actions. Please proceed with caution.
                    </p>
                    
                    <div className="flex flex-col sm:flex-row gap-4">
                        <button 
                            type="button" 
                            onClick={handleLogout} 
                            className="flex-1 px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition shadow-sm flex items-center justify-center gap-2"
                        >
                            <LogOut className="w-4 h-4" /> Logout
                        </button>
                        <button 
                            type="button" 
                            onClick={handleDeleteAccount} 
                            className="flex-1 px-4 py-2.5 bg-rose-600 text-white rounded-xl font-bold hover:bg-rose-700 transition shadow-lg shadow-rose-500/20 flex items-center justify-center gap-2"
                        >
                            <Trash2 className="w-4 h-4" /> Delete Account
                        </button>
                    </div>
                </div>
            </div>
        </div>

    </div>
  );
};

export default Settings;