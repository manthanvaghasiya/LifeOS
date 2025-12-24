import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../services/api'; 
import { UserPlus, Wallet, Sparkles, User, Mail, Lock, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

const Signup = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await API.post('/auth/register', formData);
      
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data));
      
      toast.success("Welcome to the club!");
      navigate('/');
      window.location.reload();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration Failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4 sm:p-6 transition-colors duration-300">
      <div className="max-w-5xl w-full bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl shadow-slate-200/50 dark:shadow-none overflow-hidden flex flex-col md:flex-row min-h-[650px] border border-slate-100 dark:border-slate-800 animate-fade-in">
        
        {/* Left: Branding Section (Visible on Desktop) */}
        <div className="hidden md:flex w-1/2 bg-slate-900 dark:bg-black relative flex-col justify-center items-center text-white p-12 text-center overflow-hidden">
            {/* Abstract Background Shapes */}
            <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[100px] -ml-20 -mt-20 animate-pulse-slow"></div>
            <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-emerald-600/10 rounded-full blur-[100px] -mr-20 -mb-20 animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>

            <div className="relative z-10 max-w-md">
                <div className="mb-6 flex justify-center">
                    <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md border border-white/10 shadow-xl">
                        <Wallet className="w-8 h-8 text-emerald-400" />
                    </div>
                </div>
                <h3 className="text-4xl font-bold mb-4 tracking-tight leading-tight">
                    Start Your Journey to <br/>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-400">Financial Freedom</span>
                </h3>
                <p className="text-slate-400 text-lg leading-relaxed mb-8">
                    Create your personal operating system for life. Track wealth, build habits, and crush goals.
                </p>
                
                {/* Social Proof Placeholder */}
                <div className="flex items-center justify-center gap-4 py-4 px-6 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm">
                    <div className="flex -space-x-3">
                        {[1,2,3,4].map(i => (
                            <div key={i} className="w-8 h-8 rounded-full bg-slate-700 border-2 border-slate-800 flex items-center justify-center text-[10px] font-bold">
                                {String.fromCharCode(64+i)}
                            </div>
                        ))}
                    </div>
                    <div className="text-left">
                        <p className="text-sm font-bold text-white">Join the Community</p>
                        <p className="text-xs text-slate-400">Design your best life today.</p>
                    </div>
                </div>
            </div>
        </div>

        {/* Right: Form Section */}
        <div className="w-full md:w-1/2 p-10 sm:p-14 flex flex-col justify-center relative">
            
            {/* Mobile Header */}
            <div className="md:hidden mb-8">
                <div className="flex items-center gap-2 mb-2">
                    <div className="p-2 bg-indigo-600 rounded-lg text-white">
                        <Wallet className="w-5 h-5" />
                    </div>
                    <span className="font-bold text-lg text-slate-900 dark:text-white">LifeOS</span>
                </div>
            </div>

            <div className="mb-8">
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2 tracking-tight">Create Account</h2>
                <p className="text-slate-500 dark:text-slate-400">It only takes a minute to get started.</p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider ml-1">Full Name</label>
                <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input 
                      type="text" 
                      required
                      className="w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-semibold text-slate-900 dark:text-white transition-all placeholder:text-slate-400"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider ml-1">Email Address</label>
                <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input 
                      type="email" 
                      required
                      className="w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-semibold text-slate-900 dark:text-white transition-all placeholder:text-slate-400"
                      placeholder="name@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                </div>
              </div>
              
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider ml-1">Password</label>
                <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input 
                      type="password" 
                      required
                      className="w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-semibold text-slate-900 dark:text-white transition-all placeholder:text-slate-400"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                    />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-indigo-600 text-white p-4 rounded-xl font-bold hover:bg-indigo-700 shadow-xl shadow-indigo-500/20 transition-all transform active:scale-[0.98] flex items-center justify-center gap-2 mt-4 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                    <>
                        <UserPlus className="w-5 h-5" /> Create Account
                    </>
                )}
              </button>
            </form>
            
            <div className="mt-8 text-center">
                <p className="text-slate-500 dark:text-slate-400 font-medium text-sm">
                  Already have an account?{' '}
                  <Link to="/login" className="text-slate-900 dark:text-white font-bold hover:underline transition-colors">
                    Log in
                  </Link>
                </p>
            </div>
        </div>

      </div>
    </div>
  );
};

export default Signup;