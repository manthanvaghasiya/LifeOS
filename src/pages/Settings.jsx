import React, { useState, useEffect } from 'react';
import API from '../services/api'; // Ensure this matches your API setup
import { User, Mail, Lock, Save, Trash2, LogOut, Shield } from 'lucide-react';

const Settings = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);

  // 1. FETCH REAL USER DATA ON MOUNT
  useEffect(() => {
    const fetchProfile = async () => {
        try {
            const res = await API.get('/users/profile');
            setFormData({
                name: res.data.name,
                email: res.data.email,
                password: '' // Don't fill password for security
            });
        } catch (err) {
            console.error("Failed to load profile", err);
        }
    };
    fetchProfile();
  }, []);

  // 2. REAL UPDATE FUNCTION
  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Send data to backend
      const res = await API.put('/users/profile', formData);
      
      // Update LocalStorage with new Token/User info if the backend returns it
      if (res.data) {
          localStorage.setItem('user', JSON.stringify(res.data));
          // If token is rotated, update it too: localStorage.setItem('token', res.data.token);
      }
      
      // Dispatch event to update Navbar name immediately
      window.dispatchEvent(new Event('authChange')); 
      // Note: We use 'authChange' or 'xpUpdate' depending on what Navbar listens to for name changes
      
      alert("Profile Updated Successfully!");
    } catch (err) {
      alert(err.response?.data?.message || "Update Failed.");
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

  // 3. REAL DELETE FUNCTION
  const handleDeleteAccount = async (e) => {
    e.preventDefault();
    const confirm = window.prompt("Type 'DELETE' to confirm account deletion. This cannot be undone.");
    if (confirm === 'DELETE') {
        try {
            await API.delete('/users/profile');
            handleLogout();
        } catch (err) { 
            alert(err.response?.data?.message || "Error deleting account"); 
        }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-gray-950/20 p-6 pb-20 transition-colors duration-300">
      <div className="max-w-2xl mx-auto space-y-8 animate-fade-in">
        
        {/* Header */}
        <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight flex items-center gap-3">
                Settings <Shield className="w-6 h-6 text-indigo-500" />
            </h1>
            <p className="text-gray-500 dark:text-gray-400 font-medium mt-1">Manage your account and security.</p>
        </div>

        {/* PROFILE CARD */}
        <div className="bg-white dark:bg-gray-900/60 rounded-[2.5rem] shadow-xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-gray-800 p-8 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 dark:bg-indigo-900/20 rounded-full blur-3xl -mr-10 -mt-10"></div>
            
            <form onSubmit={handleUpdate} className="space-y-6 relative z-10">
                <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase ml-1">Full Name</label>
                    <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-800 p-3 rounded-2xl border border-gray-100 dark:border-gray-700">
                        <User className="w-5 h-5 text-gray-400" />
                        <input type="text" className="bg-transparent outline-none w-full font-bold text-gray-800 dark:text-white" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase ml-1">Email Address</label>
                    <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-800 p-3 rounded-2xl border border-gray-100 dark:border-gray-700">
                        <Mail className="w-5 h-5 text-gray-400" />
                        <input type="email" className="bg-transparent outline-none w-full font-bold text-gray-800 dark:text-white" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase ml-1">New Password</label>
                    <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-800 p-3 rounded-2xl border border-gray-100 dark:border-gray-700">
                        <Lock className="w-5 h-5 text-gray-400" />
                        <input type="password" placeholder="Leave blank to keep current" className="bg-transparent outline-none w-full font-bold text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} />
                    </div>
                </div>

                <div className="pt-4">
                    <button type="submit" disabled={loading} className="w-full bg-indigo-600 text-white p-4 rounded-2xl font-bold hover:bg-indigo-700 transition shadow-lg shadow-indigo-200 dark:shadow-none flex items-center justify-center gap-2 disabled:opacity-70">
                        {loading ? 'Saving...' : <><Save className="w-5 h-5" /> Save Changes</>}
                    </button>
                </div>
            </form>
        </div>

        {/* DANGER ZONE */}
        <div className="bg-red-50 dark:bg-red-900/10 rounded-[2.5rem] p-8 border border-red-100 dark:border-red-900/30">
            <h3 className="text-red-800 dark:text-red-400 font-bold text-lg mb-2">Danger Zone</h3>
            <p className="text-red-600/70 dark:text-red-400/60 text-sm mb-6 font-medium">Once you delete your account, there is no going back. Please be certain.</p>
            
            <div className="flex flex-col sm:flex-row gap-4">
                <button type="button" onClick={handleLogout} className="flex-1 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 p-3 rounded-xl font-bold hover:bg-gray-100 dark:hover:bg-gray-700 transition shadow-sm border border-gray-200 dark:border-gray-700 flex items-center justify-center gap-2">
                    <LogOut className="w-4 h-4" /> Logout
                </button>
                <button type="button" onClick={handleDeleteAccount} className="flex-1 bg-red-600 text-white p-3 rounded-xl font-bold hover:bg-red-700 transition shadow-lg shadow-red-200 dark:shadow-none flex items-center justify-center gap-2">
                    <Trash2 className="w-4 h-4" /> Delete Account
                </button>
            </div>
        </div>

      </div>
    </div>
  );
};

export default Settings;