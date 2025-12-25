import React from 'react';
import { Pin, Trash2, Calendar, Hash } from 'lucide-react';

const NoteCard = ({ note, onEdit, onTogglePin, onDelete }) => {
  const colorClass = note.color || 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700';

  return (
    <div 
      onClick={onEdit}
      className={`group relative p-5 md:p-6 rounded-[2rem] border shadow-sm hover:shadow-xl transition-all duration-300 lg:hover:-translate-y-1.5 cursor-pointer flex flex-col h-64 md:h-72 overflow-hidden ${colorClass}`}
    >
      {/* Header Info */}
      <div className="flex justify-between items-start mb-3 shrink-0">
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
           <Calendar className="w-3 h-3" /> {new Date(note.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
        </span>
        
        {/* Pin Button: Always visible on Mobile, Hover on Desktop unless pinned */}
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onTogglePin(e, note);
          }}
          className={`p-2 rounded-xl transition-all duration-200 z-10 
            ${note.isPinned 
                ? 'bg-amber-100 text-amber-600 scale-100 opacity-100' 
                : 'bg-black/5 text-slate-400 hover:text-slate-600 lg:opacity-0 lg:group-hover:opacity-100 opacity-100'
            }`}
        >
          <Pin className={`w-3.5 h-3.5 ${note.isPinned ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* Note Body */}
      <div className="flex-1 overflow-hidden relative mb-2">
        {note.title && (
            <h3 className="font-bold text-slate-900 dark:text-white text-lg md:text-xl mb-2 leading-tight line-clamp-2">
            {note.title}
            </h3>
        )}
        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium opacity-80 line-clamp-5 md:line-clamp-4">
          {note.content}
        </p>
      </div>

      {/* Tags & Footer Actions */}
      <div className="mt-auto shrink-0 flex flex-col gap-3">
          {note.tags && note.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 h-6 overflow-hidden">
                  {note.tags.map((tag, i) => (
                      <span key={i} className="px-2 py-0.5 rounded-md bg-black/5 dark:bg-white/10 text-[9px] font-bold text-slate-500 dark:text-slate-300 flex items-center gap-1">
                          <Hash className="w-2 h-2 opacity-50" /> {tag}
                      </span>
                  ))}
              </div>
          )}
      
        <div className="pt-3 border-t border-black/5 flex justify-between items-center">
            <div className="flex gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-black/10 dark:bg-white/20" />
                <div className="w-1.5 h-1.5 rounded-full bg-black/5 dark:bg-white/10" />
            </div>
            
            {/* Delete Button: Always visible on Mobile, Hover on Desktop */}
            <button 
                onClick={(e) => {
                    e.stopPropagation();
                    onDelete(e, note._id);
                }} 
                className="p-2 bg-white/50 hover:bg-rose-50 text-slate-400 hover:text-rose-500 rounded-xl transition-all z-10 
                lg:opacity-0 lg:group-hover:opacity-100 lg:translate-y-2 lg:group-hover:translate-y-0 opacity-100 translate-y-0"
            >
                <Trash2 className="w-4 h-4" />
            </button>
        </div>
      </div>
    </div>
  );
};

export default NoteCard;
