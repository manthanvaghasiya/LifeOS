import React, { useState } from 'react';
import API from '../services/api';
import { User, Mail, Lock, Save, Trash2, LogOut, Shield } from 'lucide-react';
import toast from 'react-hot-toast'; // Assuming you have this, or use alert

const Settings = () => {
  // Get initial user from local storage
  const initialUser = JSON.parse(localStorage.getItem('user')) || {};
  
  const [formData, setFormData] = useState({
    name: initialUser.name || '',
    email: initialUser.email || '',
    password: ''
  });

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await API.put('/users/profile', formData);
      // Update Local Storage
      const updatedUser = { ...initialUser, ...res.data };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      alert("Profile Updated Successfully!");
      window.location.reload();
    } catch (err) {
      alert("Update Failed.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  const handleDeleteAccount = async () => {
    const confirm = window.prompt("Type 'DELETE' to confirm account deletion. This cannot be undone.");
    if (confirm === 'DELETE') {
        try {
            await API.delete('/users/profile');
            handleLogout();
        } catch (err) { alert("Error deleting account"); }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 p-6 pb-20">
      <div className="max-w-2xl mx-auto space-y-8 animate-fade-in">
        
        {/* Header */}
        <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight flex items-center gap-3">
                Settings <Shield className="w-6 h-6 text-indigo-500" />
            </h1>
            <p className="text-gray-500 font-medium mt-1">Manage your account and security.</p>
        </div>

        {/* PROFILE CARD */}
        <div className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100 p-8 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full blur-3xl -mr-10 -mt-10"></div>
            
            <form onSubmit={handleUpdate} className="space-y-6 relative z-10">
                <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase ml-1">Full Name</label>
                    <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-2xl border border-gray-100">
                        <User className="w-5 h-5 text-gray-400" />
                        <input type="text" className="bg-transparent outline-none w-full font-bold text-gray-800" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase ml-1">Email Address</label>
                    <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-2xl border border-gray-100">
                        <Mail className="w-5 h-5 text-gray-400" />
                        <input type="email" className="bg-transparent outline-none w-full font-bold text-gray-800" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase ml-1">New Password</label>
                    <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-2xl border border-gray-100">
                        <Lock className="w-5 h-5 text-gray-400" />
                        <input type="password" placeholder="Leave blank to keep current" className="bg-transparent outline-none w-full font-bold text-gray-800" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} />
                    </div>
                </div>

                <div className="pt-4">
                    <button type="submit" className="w-full bg-indigo-600 text-white p-4 rounded-2xl font-bold hover:bg-indigo-700 transition shadow-lg shadow-indigo-200 flex items-center justify-center gap-2">
                        <Save className="w-5 h-5" /> Save Changes
                    </button>
                </div>
            </form>
        </div>

        {/* DANGER ZONE */}
        <div className="bg-red-50 rounded-[2.5rem] p-8 border border-red-100">
            <h3 className="text-red-800 font-bold text-lg mb-2">Danger Zone</h3>
            <p className="text-red-600/70 text-sm mb-6 font-medium">Once you delete your account, there is no going back. Please be certain.</p>
            
            <div className="flex flex-col sm:flex-row gap-4">
                <button onClick={handleLogout} className="flex-1 bg-white text-gray-700 p-3 rounded-xl font-bold hover:bg-gray-100 transition shadow-sm border border-gray-200 flex items-center justify-center gap-2">
                    <LogOut className="w-4 h-4" /> Logout
                </button>
                <button onClick={handleDeleteAccount} className="flex-1 bg-red-600 text-white p-3 rounded-xl font-bold hover:bg-red-700 transition shadow-lg shadow-red-200 flex items-center justify-center gap-2">
                    <Trash2 className="w-4 h-4" /> Delete Account
                </button>
            </div>
        </div>

      </div>
    </div>
  );
};

export default Settings;