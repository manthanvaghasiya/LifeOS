import React, { useState, useEffect, useRef } from 'react';
import { X, Loader2 } from 'lucide-react';

const GoalForm = ({ onClose, onSubmit, initialData }) => {
  const [formData, setFormData] = useState({ 
      title: '', 
      type: 'Long Term', 
      deadline: '' 
  });
  const [submitting, setSubmitting] = useState(false);
  const isSubmittingRef = useRef(false);

  useEffect(() => {
    if (initialData) {
        setFormData({
            title: initialData.title,
            type: initialData.type || 'Long Term',
            deadline: initialData.deadline ? initialData.deadline.split('T')[0] : ''
        });
    }
  }, [initialData]);

  const handleSubmit = async (e) => {
      e.preventDefault();
      if (!formData.title.trim()) return;
      if (isSubmittingRef.current) return;
      isSubmittingRef.current = true;
      setSubmitting(true);

      try {
        await onSubmit(formData);
      } finally {
        isSubmittingRef.current = false;
        setSubmitting(false);
      }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fade-in">
        <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] w-full max-w-md shadow-2xl relative border border-slate-200 dark:border-slate-800 scale-100 animate-in zoom-in-95 duration-200">
            <button 
                onClick={onClose} 
                className="absolute top-6 right-6 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition text-slate-400 hover:text-slate-600"
            >
                <X className="w-5 h-5" />
            </button>
            
            <h2 className="text-2xl font-black mb-1 text-slate-900 dark:text-white">
                {initialData ? 'Refine Vision' : 'New Ambition'}
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 font-medium">Define what success looks like.</p>
            
            <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block ml-1">Goal Title</label>
                    <input 
                        type="text" 
                        required 
                        className="w-full p-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500/20 font-bold text-slate-900 dark:text-white placeholder:text-slate-400" 
                        value={formData.title} 
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })} 
                        placeholder="e.g. Save ₹10 Lakhs" 
                        autoFocus
                    />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block ml-1">Horizon</label>
                        <select 
                            className="w-full p-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl outline-none font-bold text-slate-700 dark:text-gray-200 cursor-pointer appearance-none" 
                            value={formData.type} 
                            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                        >
                            <option value="Short Term">Short Term</option>
                            <option value="Long Term">Long Term</option>
                        </select>
                    </div>
                    <div>
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block ml-1">Deadline</label>
                        <input 
                            type="date" 
                            required 
                            className="w-full p-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl outline-none font-bold text-slate-700 dark:text-gray-200 cursor-pointer" 
                            value={formData.deadline} 
                            onChange={(e) => setFormData({ ...formData, deadline: e.target.value })} 
                        />
                    </div>
                </div>
                
                <button 
                    type="submit" 
                    disabled={submitting}
                    className={`w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 p-4 rounded-2xl font-black hover:scale-[1.02] transition-all shadow-xl shadow-slate-900/10 mt-2 uppercase tracking-widest text-xs flex items-center justify-center gap-2 ${
                        submitting ? 'opacity-60 pointer-events-none' : ''
                    }`}
                >
                    {submitting ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Saving...</span>
                        </>
                    ) : (
                        <span>{initialData ? 'Update Goal' : 'Launch Goal'}</span>
                    )}
                </button>
            </form>
        </div>
    </div>
  );
};

export default GoalForm;