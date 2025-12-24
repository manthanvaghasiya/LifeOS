import React from 'react';
import { Pin, Trash2, Calendar } from 'lucide-react';

const NoteCard = ({ note, onEdit, onTogglePin, onDelete }) => {
  // Ensure we have a valid color class
  const colorClass = note.color || 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700';

  return (
    <div 
      onClick={onEdit}
      className={`group relative p-7 rounded-[2.5rem] border shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 cursor-pointer flex flex-col h-72 overflow-hidden ${colorClass}`}
    >
      {/* Header Info */}
      <div className="flex justify-between items-start mb-4">
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
           <Calendar className="w-3 h-3" /> {new Date(note.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
        </span>
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onTogglePin(e, note);
          }}
          className={`p-2 rounded-xl transition-all ${note.isPinned ? 'bg-amber-100 text-amber-600 scale-110' : 'opacity-0 group-hover:opacity-100 bg-black/5 text-slate-400 hover:text-slate-600'}`}
        >
          <Pin className={`w-3.5 h-3.5 ${note.isPinned ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* Note Body */}
      <div className="flex-1 overflow-hidden relative">
        <h3 className="font-black text-slate-900 dark:text-white text-xl mb-3 line-clamp-1 tracking-tight leading-tight">
          {note.title || "Untitled Fragment"}
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-bold opacity-80 line-clamp-5">
          {note.content}
        </p>
      </div>
      
      {/* Footer Actions */}
      <div className="mt-4 pt-5 border-t border-black/5 flex justify-between items-center">
        <div className="flex gap-1">
           <div className="w-2 h-2 rounded-full bg-black/10" />
           <div className="w-2 h-2 rounded-full bg-black/5" />
        </div>
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onDelete(e, note._id);
          }} 
          className="p-2.5 bg-rose-50 text-rose-500 rounded-xl transition-all opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 shadow-lg hover:bg-rose-500 hover:text-white"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default NoteCard; // This line is required