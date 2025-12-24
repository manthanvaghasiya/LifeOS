import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../services/api'; 
import { LogIn, Wallet, Sparkles, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await API.post('/auth/login', formData);
      
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data));
      
      toast.success("Welcome back!");
      navigate('/');
      window.location.reload();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid Credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4 sm:p-6 transition-colors duration-300">
      <div className="max-w-5xl w-full bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl shadow-slate-200/50 dark:shadow-none overflow-hidden flex flex-col md:flex-row min-h-[650px] border border-slate-100 dark:border-slate-800 animate-fade-in">
        
        {/* Left: Form Section */}
        <div className="w-full md:w-1/2 p-10 sm:p-14 flex flex-col justify-center relative">
            
            {/* Mobile Logo */}
            <div className="md:hidden flex items-center gap-2 mb-8">
                <div className="p-2.5 bg-indigo-600 rounded-xl text-white shadow-lg shadow-indigo-500/30">
                    <span className="font-bold text-xl">L</span>
                </div>
                <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">LifeOS</span>
            </div>

            <div className="mb-10">
                <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-3 tracking-tight">Welcome Back</h2>
                <p className="text-slate-500 dark:text-slate-400 text-lg">Enter your details to access your command center.</p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider ml-1">Email Address</label>
                <input 
                  type="email" 
                  required
                  className="w-full p-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-semibold text-slate-900 dark:text-white transition-all"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center ml-1">
                    <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Password</label>
                    <a href="#" className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300">Forgot password?</a>
                </div>
                <input 
                  type="password" 
                  required
                  className="w-full p-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-semibold text-slate-900 dark:text-white transition-all placeholder:text-slate-400"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 p-4 rounded-xl font-bold hover:bg-slate-800 dark:hover:bg-slate-200 shadow-xl shadow-slate-900/10 transition-all transform active:scale-[0.98] flex items-center justify-center gap-2 mt-4 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 dark:border-slate-900/30 border-t-white dark:border-t-slate-900 rounded-full animate-spin"></div>
                ) : (
                    <>
                        <LogIn className="w-5 h-5" /> Login
                    </>
                )}
              </button>
            </form>
            
            <div className="mt-10 text-center">
                <p className="text-slate-500 dark:text-slate-400 font-medium text-sm">
                  Don't have an account?{' '}
                  <Link to="/signup" className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-bold transition-colors">
                    Create an account
                  </Link>
                </p>
            </div>
        </div>

        {/* Right: Branding Section */}
        <div className="hidden md:flex w-1/2 bg-slate-900 dark:bg-black relative flex-col justify-center items-center text-white p-12 text-center overflow-hidden">
            {/* Abstract Background Shapes */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/30 rounded-full blur-[100px] -mr-20 -mt-20 animate-pulse-slow"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[100px] -ml-20 -mb-20 animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
            
            {/* Pattern Overlay */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>

            <div className="relative z-10 max-w-md">
                <div className="mb-8 inline-flex p-4 bg-white/5 rounded-2xl backdrop-blur-xl border border-white/10 shadow-2xl ring-1 ring-white/20">
                    <Sparkles className="w-8 h-8 text-indigo-300" />
                </div>
                <h3 className="text-4xl font-bold mb-6 tracking-tight leading-tight">
                    Design Your Life, <br/>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Master Your Future</span>
                </h3>
                <p className="text-slate-400 text-lg leading-relaxed mb-8">
                    Join thousands of high-achievers tracking their habits, wealth, and goals in one unified system.
                </p>
                
                {/* Feature Pills */}
                <div className="flex flex-wrap justify-center gap-3">
                    {['Finance Tracker', 'Habit Loops', 'Goal Setting'].map((tag) => (
                        <span key={tag} className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm font-medium text-slate-300 backdrop-blur-sm">
                            {tag}
                        </span>
                    ))}
                </div>
            </div>
        </div>

      </div>
    </div>
  );
};

export default Login;