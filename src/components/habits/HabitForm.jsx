import React from 'react';
import { Plus, X, Save, Target } from 'lucide-react';

const HabitForm = ({ handleSubmit, newHabit, setNewHabit, newTarget, setNewTarget, editId, cancelEdit }) => {
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
        
        {/* Habit Title Input - Glass Style */}
        <div>
            <label className="block text-xs font-bold text-indigo-200 uppercase tracking-wider mb-1.5 ml-1">Habit Title</label>
            <input 
                type="text" 
                className="w-full bg-white/10 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-indigo-200/50 outline-none focus:ring-2 focus:ring-white/20 transition-all font-semibold" 
                placeholder="e.g. Read 10 pages" 
                value={newHabit} 
                onChange={(e) => setNewHabit(e.target.value)} 
            />
        </div>
        
        {/* Target Input - Glass Style */}
        <div>
            <label className="block text-xs font-bold text-indigo-200 uppercase tracking-wider mb-1.5 ml-1">Daily Target</label>
            <div className="flex gap-2">
                <div className="flex items-center gap-2 bg-white/10 border border-white/10 rounded-xl px-3 py-2 flex-1">
                    <Target className="w-4 h-4 text-indigo-300" />
                    <input 
                        type="number" 
                        className="w-full bg-transparent text-sm font-bold text-white outline-none placeholder-indigo-300/50"
                        placeholder="21"
                        value={newTarget} 
                        onChange={(e) => setNewTarget(e.target.value)} 
                    />
                    <span className="text-xs text-indigo-200 font-medium whitespace-nowrap">days</span>
                </div>
            </div>
        </div>

        {/* Buttons - IMPROVED: Stronger visual weight */}
        <div className="flex gap-2 pt-2">
            <button 
                type="submit" 
                className="flex-1 bg-white text-indigo-950 rounded-xl py-3.5 font-bold hover:bg-indigo-50 transition-all shadow-lg hover:shadow-xl active:scale-95 flex items-center justify-center gap-2"
            >
                {editId ? <Save className="w-4 h-4 text-indigo-600"/> : <Plus className="w-4 h-4 text-indigo-600"/>}
                <span>{editId ? 'Update Habit' : 'Start New Habit'}</span>
            </button>
            
            {editId && (
                <button 
                    type="button" 
                    onClick={cancelEdit} 
                    className="px-4 bg-white/10 text-white rounded-xl hover:bg-white/20 transition flex items-center justify-center border border-white/10"
                >
                    <X className="w-5 h-5" />
                </button>
            )}
        </div>
    </form>
  );
};

export default HabitForm;