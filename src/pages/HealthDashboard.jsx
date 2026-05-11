import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Activity, Flame, Footprints, Timer, Scale, HeartPulse, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import useHealthData from '../hooks/useHealthData';
import HealthSkeleton from '../components/health/HealthSkeleton';

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

const HealthDashboard = () => {
  const { todayData, historyData, updateHealthData, loading } = useHealthData();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});

  if (loading || !todayData) return <HealthSkeleton />;

  // --- DERIVED METRICS ---
  const remainingCalories = todayData.dailyCalorieGoal - todayData.caloriesConsumed + todayData.caloriesBurned;
  const caloriePercent = Math.min((todayData.caloriesConsumed / (todayData.dailyCalorieGoal + todayData.caloriesBurned || 1)) * 100, 100);
  
  const stepPercent = Math.min((todayData.totalSteps / (todayData.dailyStepGoal || 1)) * 100, 100);

  // --- HANDLERS ---
  const handleEditClick = () => {
    setFormData(todayData);
    setIsEditing(true);
  };

  const handleSave = async () => {
    // Only send the fields that we want to update
    await updateHealthData({
      caloriesConsumed: Number(formData.caloriesConsumed) || 0,
      caloriesBurned: Number(formData.caloriesBurned) || 0,
      totalSteps: Number(formData.totalSteps) || 0,
      workoutDuration: Number(formData.workoutDuration) || 0,
      weight: Number(formData.weight) || todayData.weight,
      dailyCalorieGoal: Number(formData.dailyCalorieGoal) || todayData.dailyCalorieGoal,
      dailyStepGoal: Number(formData.dailyStepGoal) || todayData.dailyStepGoal,
    });
    setIsEditing(false);
  };

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // --- CHART FORMATTING ---
  const formattedHistory = historyData.map(d => {
    const dateObj = new Date(d.date);
    return {
      ...d,
      displayDate: `${dateObj.getDate()} ${dateObj.toLocaleString('default', { month: 'short' })}`
    };
  });

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
            <div className="flex items-center gap-2 text-rose-500 mb-1">
              <HeartPulse size={20} className="animate-pulse" />
              <span className="font-bold uppercase tracking-wider text-sm">Health & Fitness</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              Today's Overview
            </h1>
          </div>
          
          <button 
            onClick={isEditing ? handleSave : handleEditClick}
            className={`px-6 py-2.5 rounded-full font-bold shadow-lg transition-all active:scale-95 ${
              isEditing 
                ? "bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/30"
                : "bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:scale-105"
            }`}
          >
            {isEditing ? 'Save Progress' : 'Update Metrics'}
          </button>
        </motion.div>

        {/* TOP METRICS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* 1. CALORIE RING */}
          <motion.div 
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            className="glass-panel p-6 flex flex-col items-center justify-center min-h-[300px] relative overflow-hidden group border border-slate-200 dark:border-slate-800"
          >
            <div className="absolute top-4 left-4 p-2 bg-rose-100 dark:bg-rose-900/30 rounded-xl">
              <Activity className="w-5 h-5 text-rose-500" />
            </div>
            <h3 className="absolute top-5 right-6 text-sm font-bold text-slate-500 uppercase">Energy Balance</h3>

            {/* Circular Progress (CSS based) */}
            <div className="relative w-48 h-48 mt-6">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="96" cy="96" r="80" fill="transparent" stroke="currentColor" strokeWidth="16" className="text-slate-100 dark:text-slate-800" />
                <circle 
                  cx="96" cy="96" r="80" 
                  fill="transparent" 
                  stroke="currentColor" 
                  strokeWidth="16" 
                  strokeDasharray={`${2 * Math.PI * 80}`}
                  strokeDashoffset={`${2 * Math.PI * 80 * (1 - caloriePercent / 100)}`}
                  strokeLinecap="round"
                  className="text-rose-500 transition-all duration-1000 ease-out" 
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-black text-slate-900 dark:text-white">{remainingCalories}</span>
                <span className="text-xs font-bold text-slate-500">kcal left</span>
              </div>
            </div>

            <div className="flex w-full mt-8 gap-4">
              <div className="flex-1 bg-slate-50 dark:bg-slate-900/50 p-3 rounded-2xl flex flex-col items-center border border-slate-100 dark:border-slate-800">
                <span className="text-[10px] uppercase font-bold text-slate-400 mb-1">Eaten</span>
                {isEditing ? (
                  <input type="number" name="caloriesConsumed" value={formData.caloriesConsumed} onChange={handleChange} className="w-16 text-center font-bold bg-transparent border-b border-rose-500 outline-none" />
                ) : (
                  <span className="font-black text-slate-700 dark:text-slate-300">{todayData.caloriesConsumed}</span>
                )}
              </div>
              <div className="flex-1 bg-slate-50 dark:bg-slate-900/50 p-3 rounded-2xl flex flex-col items-center border border-slate-100 dark:border-slate-800">
                <span className="text-[10px] uppercase font-bold text-slate-400 mb-1">Burned</span>
                {isEditing ? (
                  <input type="number" name="caloriesBurned" value={formData.caloriesBurned} onChange={handleChange} className="w-16 text-center font-bold bg-transparent border-b border-amber-500 outline-none" />
                ) : (
                  <span className="font-black text-amber-500">{todayData.caloriesBurned}</span>
                )}
              </div>
            </div>
          </motion.div>

          {/* 2. RIGHT COLUMN: STEPS & WORKOUT */}
          <div className="md:col-span-2 flex flex-col gap-6">
            
            {/* Steps Card */}
            <motion.div 
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              className="glass-panel p-6 flex-1 flex flex-col justify-center border border-slate-200 dark:border-slate-800 relative overflow-hidden"
            >
              <div className="absolute -right-10 -bottom-10 opacity-5">
                <Footprints size={120} />
              </div>
              
              <div className="flex justify-between items-end mb-4 relative z-10">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-2xl">
                    <Footprints className="w-6 h-6 text-emerald-500" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-500 uppercase">Daily Steps</h3>
                    <div className="flex items-baseline gap-1 mt-1">
                      {isEditing ? (
                         <input type="number" name="totalSteps" value={formData.totalSteps} onChange={handleChange} className="text-4xl font-black w-32 bg-transparent border-b border-emerald-500 outline-none" />
                      ) : (
                         <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">{todayData.totalSteps.toLocaleString()}</h2>
                      )}
                      <span className="text-sm font-bold text-slate-400">/ {todayData.dailyStepGoal.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-4 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden relative z-10 shadow-inner">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${stepPercent}%` }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full relative"
                >
                  <div className="absolute top-0 right-0 bottom-0 w-[2px] bg-white/50 shadow-[0_0_8px_rgba(255,255,255,0.8)]"></div>
                </motion.div>
              </div>
            </motion.div>

            {/* Bottom Row: Workout & Weight */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 flex-1">
              
              <motion.div variants={itemVariants} whileHover={{ scale: 1.02 }} className="glass-panel p-5 border border-slate-200 dark:border-slate-800 flex items-center justify-between group">
                <div>
                  <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Workout Time</h3>
                  <div className="flex items-baseline gap-1">
                    {isEditing ? (
                      <input type="number" name="workoutDuration" value={formData.workoutDuration} onChange={handleChange} className="text-3xl font-black w-16 bg-transparent border-b border-indigo-500 outline-none" />
                    ) : (
                      <span className="text-3xl font-black text-slate-900 dark:text-white">{todayData.workoutDuration}</span>
                    )}
                    <span className="text-sm font-bold text-slate-500">min</span>
                  </div>
                </div>
                <div className="p-4 bg-indigo-100 dark:bg-indigo-900/30 rounded-full group-hover:rotate-12 transition-transform">
                  <Timer className="w-8 h-8 text-indigo-500" />
                </div>
              </motion.div>

              <motion.div variants={itemVariants} whileHover={{ scale: 1.02 }} className="glass-panel p-5 border border-slate-200 dark:border-slate-800 flex items-center justify-between group">
                <div>
                  <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Current Weight</h3>
                  <div className="flex items-baseline gap-1">
                    {isEditing ? (
                      <input type="number" step="0.1" name="weight" value={formData.weight || ''} onChange={handleChange} className="text-3xl font-black w-24 bg-transparent border-b border-sky-500 outline-none" />
                    ) : (
                      <span className="text-3xl font-black text-slate-900 dark:text-white">{todayData.weight || '--'}</span>
                    )}
                    <span className="text-sm font-bold text-slate-500">kg</span>
                  </div>
                </div>
                <div className="p-4 bg-sky-100 dark:bg-sky-900/30 rounded-full group-hover:-translate-y-1 transition-transform">
                  <Scale className="w-8 h-8 text-sky-500" />
                </div>
              </motion.div>

            </div>
          </div>
        </div>

        {/* 3. WEIGHT JOURNEY CHART */}
        <motion.div variants={itemVariants} className="glass-panel p-6 border border-slate-200 dark:border-slate-800 min-h-[400px]">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
              <TrendingUp className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900 dark:text-white">Weight Journey</h2>
              <p className="text-xs font-bold text-slate-500">Last 30 Days</p>
            </div>
          </div>
          
          {historyData.length > 0 ? (
            <div className="w-full h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={formattedHistory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis 
                    dataKey="displayDate" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }}
                    dy={10}
                  />
                  <YAxis 
                    domain={['dataMin - 2', 'dataMax + 2']} 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }}
                  />
                  <Tooltip 
                    cursor={{ fill: 'rgba(148, 163, 184, 0.1)' }}
                    contentStyle={{ 
                      backgroundColor: 'rgba(15, 23, 42, 0.9)', 
                      border: 'none', 
                      borderRadius: '12px', 
                      color: '#fff',
                      fontWeight: 'bold',
                      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)'
                    }}
                    itemStyle={{ color: '#38bdf8' }}
                  />
                  <Bar dataKey="weight" radius={[6, 6, 0, 0]} maxBarSize={40}>
                    {formattedHistory.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === formattedHistory.length - 1 ? '#38bdf8' : '#e2e8f0'} className="dark:fill-slate-800 dark:last:fill-sky-500" />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="w-full h-72 flex flex-col items-center justify-center text-slate-400">
              <Scale className="w-12 h-12 mb-2 opacity-20" />
              <p className="font-bold">No weight data logged yet.</p>
            </div>
          )}
        </motion.div>

      </motion.div>
    </div>
  );
};

export default HealthDashboard;
