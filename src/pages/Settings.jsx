import React, { useState, useEffect } from 'react';
import API from '../services/api';
import {
    User, Mail, Lock, Save, Trash2, LogOut, Shield,
    Moon, Sun, Monitor, AlertTriangle, Camera,
    ArrowLeft, ChevronRight, Trophy, Database
} from 'lucide-react';
import toast from 'react-hot-toast'; // Kept toast import as per your file (or useToast if you prefer)
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import useCategories from '../hooks/useCategories';

const Settings = () => {
    const { user, login, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const { expenseCategories, incomeCategories, investmentTypes, bankAccounts, removeCategory } = useCategories();

    // LOGIC: Handle Image Upload
    const fileInputRef = React.useRef(null);
    const [imagePreview, setImagePreview] = useState(user?.avatar || null);

    const handleImageClick = () => {
        fileInputRef.current.click();
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const objectUrl = URL.createObjectURL(file);
            setImagePreview(objectUrl);
            // setFormData({ ...formData, avatar: file }) // Todo: Connect to backend
        }
    };

    // State for Navigation Tabs
    const [activeTab, setActiveTab] = useState('profile');

    // Form State
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        password: ''
    });

    const [loading, setLoading] = useState(false);

    // Sync state with context if user changes
    useEffect(() => {
        if (user) {
            setFormData(prev => ({
                ...prev,
                name: user.name,
                email: user.email
            }));
        }
    }, [user]);

    // ✨ LEVEL CALCULATION
    const currentXP = user?.currentXP || 0;
    const requiredXP = user?.requiredXP || 100;
    const xpProgress = Math.min((currentXP / requiredXP) * 100, 100);

    // --- ACTIONS ---

    const handleUpdate = async (e) => {
        e.preventDefault();

        if (!formData.name.trim() || !formData.email.trim()) {
            return toast.error("Name and Email are required.");
        }
        if (formData.password && formData.password.length < 6) {
            return toast.error("Password must be at least 6 characters.");
        }

        setLoading(true);
        try {
            const res = await API.put('/users/profile', formData);
            if (res.data) {
                login(res.data.token, res.data);
                toast.success("Profile Updated Successfully!");
                setFormData(prev => ({ ...prev, password: '' }));
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "Update Failed.");
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteAccount = async () => {
        const confirm = window.prompt("Type 'DELETE' to confirm. This is permanent.");
        if (confirm === 'DELETE') {
            try {
                await API.delete('/users/profile');
                logout();
            } catch (err) {
                toast.error("Error deleting account");
            }
        }
    };

    const [showMobileMenu, setShowMobileMenu] = useState(true);

    // --- RENDER HELPERS ---

    const NavItem = ({ id, icon: Icon, label, isDanger }) => (
        <button
            onClick={() => {
                setActiveTab(id);
                setShowMobileMenu(false);
            }}
            className={`
      w-full flex items-center gap-3 px-4 py-4 lg:py-3 rounded-xl transition-all duration-200 font-semibold text-sm border lg:border-none
      ${activeTab === id
                    ? "bg-blue-50 border-blue-100 text-blue-600 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-400 shadow-sm"
                    : "bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50"} 
      ${isDanger ? "text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 border-rose-100 dark:border-rose-900/30" : ""}
    `}
        >
            <Icon className={`w-5 h-5 ${activeTab === id ? "text-blue-600 dark:text-blue-400" : (isDanger ? "text-rose-500" : "text-slate-400")}`} />
            <span className="flex-1 text-left">{label}</span>
            <ChevronRight className="w-4 h-4 text-slate-300 dark:text-slate-600 lg:hidden" />
        </button>
    );

    return (
    <div className="max-w-6xl mx-auto px-4 lg:px-8 py-6 lg:py-10 animate-fade-in pb-24 lg:pb-12">
      
      {/* --- MOBILE NAVIGATION HEADER --- */}
      <div className={`lg:hidden sticky top-0 z-30 mb-6 -mx-4 px-4 py-3 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-all ${showMobileMenu ? 'hidden' : 'block'}`}>
        <button 
          onClick={() => setShowMobileMenu(true)}
          className="flex items-center gap-3 text-slate-600 dark:text-slate-300 font-bold active:scale-95 transition-transform"
        >
          <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full">
             <ArrowLeft className="w-5 h-5 text-slate-900 dark:text-white" />
          </div>
          <span className="text-lg">Back to Settings</span>
        </button>
      </div>

      {/* --- PROFILE HEADER --- */}
      <div className={`${!showMobileMenu ? 'hidden lg:block' : 'block'} mb-8`}>
         <div className="relative p-6 rounded-[2rem] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden group">
             {/* Gradient Background */}
             <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>
             <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none"></div>

             <div className="flex flex-col sm:flex-row items-center gap-6 relative z-10">
                 {/* Avatar Upload */}
                 <div className="relative shrink-0 cursor-pointer group/avatar" onClick={handleImageClick}>
                     <div className="w-24 h-24 rounded-full p-1 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-slate-700 dark:to-slate-700">
                         <div className="w-full h-full rounded-full bg-white dark:bg-slate-900 p-1">
                             <div className="w-full h-full rounded-full overflow-hidden bg-slate-100 dark:bg-slate-800 flex items-center justify-center relative">
                                  {imagePreview ? (
                                    <img src={imagePreview} className="w-full h-full object-cover transition-transform group-hover/avatar:scale-105" alt="Avatar" />
                                  ) : (
                                    <span className="text-3xl font-bold text-slate-300 dark:text-slate-600">{user?.name?.charAt(0) || 'U'}</span>
                                  )}
                                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover/avatar:opacity-100 transition-opacity flex items-center justify-center">
                                    <Camera className="w-6 h-6 text-white drop-shadow-md" />
                                  </div>
                             </div>
                         </div>
                     </div>
                     <input type="file" ref={fileInputRef} onChange={handleImageChange} className="hidden" accept="image/*" />
                     <div className="absolute bottom-0 right-0 p-1.5 bg-blue-600 text-white rounded-full border-4 border-white dark:border-slate-900 shadow-sm">
                        <Camera className="w-3 h-3" />
                     </div>
                 </div>

                 {/* Text Info */}
                 <div className="flex-1 text-center sm:text-left">
                     <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">{user?.name}</h1>
                     <p className="text-slate-500 dark:text-slate-400 font-medium mb-3">{user?.email}</p>
                     <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                        <Shield className="w-3 h-3" /> LifeOS Member
                     </div>
                 </div>

                 {/* ✨ NEW: GAMIFICATION STATS (Visible on Mobile & Laptop) */}
                 <div className="w-full sm:w-64 bg-white/50 dark:bg-black/20 rounded-2xl p-4 border border-indigo-50 dark:border-indigo-500/20 backdrop-blur-sm mt-4 sm:mt-0 sm:ml-auto">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                            <div className="p-1.5 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg text-yellow-600 dark:text-yellow-400">
                                <Trophy className="w-4 h-4" />
                            </div>
                            <span className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">Level {user?.level || 1}</span>
                        </div>
                        <span className="text-[10px] font-bold text-slate-400">{currentXP} / {requiredXP} XP</span>
                    </div>
                    
                    <div className="relative h-2.5 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div 
                            className="absolute top-0 left-0 h-full bg-gradient-to-r from-yellow-400 to-orange-500 transition-all duration-1000 ease-out"
                            style={{ width: `${xpProgress}%` }}
                        />
                    </div>
                    <p className="text-[10px] text-slate-400 text-right mt-1.5 font-medium">
                        {Math.round(requiredXP - currentXP)} XP to next level
                    </p>
                 </div>

             </div>
         </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        
        {/* --- SIDEBAR MENU --- */}
        <div className={`lg:w-72 flex-shrink-0 w-full ${!showMobileMenu ? 'hidden lg:block' : 'block'}`}>
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-3 shadow-sm lg:sticky lg:top-24">
            
            <h3 className="lg:hidden text-lg font-bold text-slate-900 dark:text-white mb-4 px-2 mt-2">Settings Menu</h3>
            
            <nav className="flex flex-col gap-1.5">
               <NavItem id="profile" icon={User} label="My Profile" />
               <NavItem id="security" icon={Shield} label="Security" />
               <NavItem id="appearance" icon={Monitor} label="Appearance" />
               <NavItem id="data" icon={Database} label="Data & Categories" />
               <div className="h-px bg-slate-100 dark:bg-slate-800 my-2 mx-2"></div>
               <NavItem id="danger" icon={AlertTriangle} label="Danger Zone" isDanger />
               <button 
                  onClick={logout}
                  className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 font-medium text-sm text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white group"
               >
                  <div className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 group-hover:bg-white dark:group-hover:bg-slate-700 transition-colors">
                    <LogOut className="w-4 h-4" />
                  </div>
                  <span className="flex-1 text-left">Log Out</span>
                  <ChevronRight className="w-4 h-4 text-slate-300 dark:text-slate-600 lg:hidden" />
               </button>
            </nav>

          </div>
        </div>

        {/* --- CONTENT AREA --- */}
        <div className={`flex-1 w-full min-h-[500px] ${showMobileMenu ? 'hidden lg:block' : 'block'}`}>
          
          {/* PROFILE TAB */}
          {activeTab === 'profile' && (
             <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 p-6 lg:p-10 shadow-sm animate-fade-in">
                <div className="mb-8">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">Profile Information</h2>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Update your account details and public information.</p>
                </div>

                <form onSubmit={handleUpdate} className="space-y-6 max-w-lg">
                   <div className="space-y-5">
                      <div>
                          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Full Name</label>
                          <div className="relative">
                              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                              <input 
                                type="text" 
                                className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none" 
                                value={formData.name} 
                                onChange={e => setFormData({...formData, name: e.target.value})} 
                              />
                          </div>
                      </div>
                      <div>
                          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Email Address</label>
                          <div className="relative">
                              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                              <input 
                                type="email" 
                                className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none" 
                                value={formData.email} 
                                onChange={e => setFormData({...formData, email: e.target.value})} 
                              />
                          </div>
                      </div>
                   </div>
                   <div className="pt-2">
                       <button type="submit" className="w-full sm:w-auto px-8 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-lg shadow-blue-500/30 transition-all active:scale-95 flex items-center justify-center gap-2">
                           <Save className="w-4 h-4" /> Save Changes
                       </button>
                   </div>
                </form>
             </div>
          )}
          
          {/* SECURITY TAB */}
          {activeTab === 'security' && (
              <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 p-6 lg:p-10 shadow-sm animate-fade-in">
                  <div className="mb-8">
                      <h2 className="text-xl font-bold text-slate-900 dark:text-white">Security</h2>
                      <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Manage your password and account security.</p>
                  </div>

                  <form onSubmit={handleUpdate} className="space-y-6 max-w-lg">
                      <div>
                          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">New Password</label>
                          <div className="relative">
                              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                              <input 
                                type="password" 
                                className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none placeholder:text-slate-400" 
                                placeholder="Min 6 characters" 
                                value={formData.password} 
                                onChange={e => setFormData({...formData, password: e.target.value})} 
                              />
                          </div>
                          <p className="text-xs text-slate-500 mt-2 pl-1">Leave blank to keep current password.</p>
                      </div>
                      <div className="pt-2">
                          <button type="submit" className="w-full sm:w-auto px-8 py-3 rounded-xl bg-slate-900 dark:bg-slate-700 text-white font-bold hover:bg-slate-800 dark:hover:bg-slate-600 transition-all active:scale-95">
                              Update Password
                          </button>
                      </div>
                  </form>
              </div>
          )}

          {/* APPEARANCE TAB */}
          {activeTab === 'appearance' && (
             <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 p-6 lg:p-10 shadow-sm animate-fade-in">
                <div className="mb-8">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">Interface Theme</h2>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Choose how LifeOS looks on your device.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                   <button 
                     onClick={() => theme === 'dark' && toggleTheme()} 
                     className={`group relative p-4 rounded-2xl border-2 text-left transition-all overflow-hidden ${theme === 'light' ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-900/10' : 'border-slate-200 dark:border-slate-800 hover:border-blue-200 dark:hover:border-slate-700'}`}
                   >
                      <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                          <Sun className="w-16 h-16 text-orange-500" />
                      </div>
                      <div className="flex items-center gap-4 mb-3 relative z-10">
                          <div className="p-3 bg-orange-100 text-orange-600 rounded-xl">
                              <Sun className="w-6 h-6" />
                          </div>
                          <div>
                              <div className="font-bold text-slate-900 dark:text-white">Light Mode</div>
                              <div className="text-xs text-slate-500 font-medium">Clear & Bright</div>
                          </div>
                      </div>
                      {theme === 'light' && <div className="absolute top-4 right-4 w-3 h-3 bg-blue-500 rounded-full"></div>}
                   </button>

                   <button 
                     onClick={() => theme === 'light' && toggleTheme()} 
                     className={`group relative p-4 rounded-2xl border-2 text-left transition-all overflow-hidden ${theme === 'dark' ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-900/10' : 'border-slate-200 dark:border-slate-800 hover:border-blue-200 dark:hover:border-slate-700'}`}
                   >
                      <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                          <Moon className="w-16 h-16 text-indigo-500" />
                      </div>
                      <div className="flex items-center gap-4 mb-3 relative z-10">
                          <div className="p-3 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 rounded-xl">
                              <Moon className="w-6 h-6" />
                          </div>
                          <div>
                              <div className="font-bold text-slate-900 dark:text-white">Dark Mode</div>
                              <div className="text-xs text-slate-500 font-medium">Easy on the eyes</div>
                          </div>
                      </div>
                      {theme === 'dark' && <div className="absolute top-4 right-4 w-3 h-3 bg-blue-500 rounded-full"></div>}
                   </button>
                </div>
             </div>
          )}

          {/* DATA TAB */}
          {activeTab === 'data' && (
             <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 p-6 lg:p-10 shadow-sm animate-fade-in">
                <div className="mb-8">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">Data Management</h2>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Manage your custom categories and bank accounts.</p>
                </div>

                <div className="space-y-8 max-w-2xl">
                    {[
                      { title: 'Bank Accounts', type: 'bankAccounts', data: bankAccounts },
                      { title: 'Expense Categories', type: 'expense', data: expenseCategories },
                      { title: 'Income Categories', type: 'income', data: incomeCategories },
                      { title: 'Investment Types', type: 'investmentTypes', data: investmentTypes },
                    ].map(section => (
                      <div key={section.type}>
                         <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">{section.title}</h3>
                         <div className="flex flex-wrap gap-2">
                           {section.data.map(item => (
                             <div key={item} className="flex items-center gap-2 bg-slate-50 dark:bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800">
                               <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{item}</span>
                               <button 
                                  onClick={() => {
                                     if(window.confirm(`Delete ${item}?`)) removeCategory(section.type, item);
                                  }}
                                  className="p-1.5 hover:bg-rose-100 dark:hover:bg-rose-900/30 text-slate-400 hover:text-rose-500 rounded-md transition-colors"
                                  title="Delete"
                               >
                                 <Trash2 className="w-3.5 h-3.5" />
                               </button>
                             </div>
                           ))}
                           {section.data.length === 0 && <span className="text-sm text-slate-400">None added</span>}
                         </div>
                      </div>
                    ))}
                </div>
             </div>
          )}

          {/* DANGER ZONE */}
          {activeTab === 'danger' && (
              <div className="bg-rose-50 dark:bg-rose-900/10 rounded-[2rem] border border-rose-200 dark:border-rose-900/30 p-6 lg:p-10 animate-fade-in">
                  <div className="flex gap-5 items-start">
                      <div className="p-3 bg-rose-100 dark:bg-rose-900/30 rounded-xl text-rose-600 dark:text-rose-400 shrink-0">
                          <AlertTriangle className="w-6 h-6" />
                      </div>
                      <div>
                          <h2 className="text-xl font-bold text-rose-700 dark:text-rose-400">Danger Zone</h2>
                          <p className="text-rose-600/80 dark:text-rose-400/70 text-sm font-medium mt-1 mb-6 max-w-md">
                              Permanently delete your account and all associated data. This action cannot be undone.
                          </p>
                          <button 
                            onClick={handleDeleteAccount} 
                            className="px-6 py-3 bg-rose-600 text-white rounded-xl font-bold shadow-lg shadow-rose-500/20 hover:bg-rose-700 transition-all active:scale-95 flex items-center gap-2"
                          >
                              <Trash2 className="w-4 h-4" /> Delete My Account
                          </button>
                      </div>
                  </div>
              </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Settings;