import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { 
  Plus, Search, X, Sparkles, PenTool, StickyNote, Hash, Pin, ArrowLeft 
} from 'lucide-react';
import toast from 'react-hot-toast';
import NoteCard from '../components/notes/NoteCard';

const COLORS = [
  { name: 'Default', class: 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700' },
  { name: 'Cream', class: 'bg-amber-50 dark:bg-amber-900/20 border-amber-100 dark:border-amber-900/30' },
  { name: 'Mint', class: 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-100 dark:border-emerald-900/30' },
  { name: 'Azure', class: 'bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-900/30' },
  { name: 'Lavender', class: 'bg-violet-50 dark:bg-violet-900/20 border-violet-100 dark:border-violet-900/30' },
  { name: 'Rose', class: 'bg-rose-50 dark:bg-rose-900/20 border-rose-100 dark:border-rose-900/30' },
];

const Notes = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [editId, setEditId] = useState(null);
  
  // Form State
  const [formData, setFormData] = useState({ title: '', content: '', color: COLORS[0].class, isPinned: false, tags: [] });
  const [tagInput, setTagInput] = useState('');

  useEffect(() => { fetchNotes(); }, []);

  const fetchNotes = async () => {
    try {
      const res = await API.get('/notes');
      setNotes(res.data);
      setLoading(false);
    } catch (err) { console.error(err); setLoading(false); }
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault(); // Handle both button click and form submit
    if (!formData.title.trim() && !formData.content.trim()) {
        toast.error("Can't save an empty note");
        return;
    }
    
    try {
      if (editId) {
        const res = await API.put(`/notes/${editId}`, formData);
        setNotes(notes.map(n => n._id === editId ? res.data : n));
        toast.success('Note updated');
      } else {
        const res = await API.post('/notes', formData);
        setNotes([res.data, ...notes]);
        toast.success('Note created');
      }
      closeForm();
    } catch (err) { toast.error('Error saving note'); }
  };

  const handleAddTag = (e) => {
      if (e.key === 'Enter' && tagInput.trim()) {
          e.preventDefault();
          if (!formData.tags.includes(tagInput.trim())) {
              setFormData({ ...formData, tags: [...formData.tags, tagInput.trim()] });
          }
          setTagInput('');
      }
  };

  const removeTag = (tagToRemove) => {
      setFormData({ ...formData, tags: formData.tags.filter(t => t !== tagToRemove) });
  };

  const togglePin = async (e, note) => {
    try {
      const res = await API.put(`/notes/${note._id}`, { ...note, isPinned: !note.isPinned });
      setNotes(notes.map(n => n._id === note._id ? res.data : n));
      toast.success(res.data.isPinned ? 'Pinned' : 'Unpinned');
    } catch (err) { toast.error('Update failed'); }
  };

  const handleDelete = async (e, id) => {
    if (!window.confirm("Delete note?")) return;
    try {
      await API.delete(`/notes/${id}`);
      setNotes(notes.filter(n => n._id !== id));
      toast.success('Deleted');
    } catch (err) { toast.error('Delete failed'); }
  };

  const closeForm = () => {
    setShowForm(false); setEditId(null);
    setFormData({ title: '', content: '', color: COLORS[0].class, isPinned: false, tags: [] });
    setTagInput('');
  };

  const filteredNotes = notes.filter(n => {
    const search = searchTerm.toLowerCase();
    return (
      n.title?.toLowerCase().includes(search) || 
      n.content?.toLowerCase().includes(search) ||
      n.tags?.some(tag => tag.toLowerCase().includes(search))
    );
  });

  const pinnedNotes = filteredNotes.filter(n => n.isPinned);
  const otherNotes = filteredNotes.filter(n => !n.isPinned);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center"><div className="w-10 h-10 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin"></div></div>
  );

  return (
    <div className="p-4 md:p-8 max-w-[1600px] mx-auto space-y-8 md:space-y-10 animate-fade-in min-h-screen pb-32 lg:pb-12">
        {/* Header - Responsive Layout */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div>
                <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
                    Knowledge Base <Sparkles className="w-6 h-6 md:w-8 md:h-8 text-amber-500 fill-amber-200" />
                </h1>
                <p className="text-slate-500 dark:text-slate-400 font-bold mt-1 text-xs md:text-sm uppercase tracking-widest">Organize. Think. Evolve.</p>
            </div>
            
            <div className="flex gap-3 w-full md:w-auto">
                <div className="relative flex-1 md:w-80">
                    <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                    <input 
                        type="text" 
                        placeholder="Search ideas..." 
                        className="w-full pl-11 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl md:rounded-2xl text-sm font-bold focus:ring-4 focus:ring-blue-500/10 outline-none transition-all shadow-sm" 
                        value={searchTerm} 
                        onChange={(e) => setSearchTerm(e.target.value)} 
                    />
                </div>
                
                {/* Action Button - Visible on both Mobile & Desktop */}
                <button 
                    onClick={() => setShowForm(true)} 
                    className="flex shrink-0 bg-blue-600 text-white items-center gap-2 py-3 px-5 rounded-xl md:rounded-2xl font-black shadow-xl hover:scale-105 transition-all text-[10px] md:text-xs uppercase tracking-widest"
                >
                    <Plus className="w-4 h-4" /> 
                    <span>New</span>
                </button>
            </div>
        </div>

        {/* Pinned Section */}
        {pinnedNotes.length > 0 && (
          <div className="space-y-4 md:space-y-6">
            <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] flex items-center gap-2 ml-1">
                <Pin className="w-3 h-3 fill-current text-amber-500" /> Priority
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {pinnedNotes.map(note => (
                <NoteCard key={note._id} note={note} onEdit={() => { setFormData({...note}); setEditId(note._id); setShowForm(true); }} onTogglePin={togglePin} onDelete={handleDelete} />
              ))}
            </div>
          </div>
        )}

        {/* Grid / Empty State */}
        <div className="space-y-6">
          {filteredNotes.length > 0 ? (
            <>
              {pinnedNotes.length > 0 && <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] ml-1">Fragments</h2>}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                  {otherNotes.map(note => (
                    <NoteCard key={note._id} note={note} onEdit={() => { setFormData({...note}); setEditId(note._id); setShowForm(true); }} onTogglePin={togglePin} onDelete={handleDelete} />
                  ))}
              </div>
            </>
          ) : !loading && (
            <div className="min-h-[50vh] flex flex-col items-center justify-center text-center px-4">
                <div className="bg-slate-100 dark:bg-slate-800 p-8 md:p-12 rounded-[3.5rem] mb-6 animate-bounce"><StickyNote className="w-12 h-12 md:w-16 md:h-16 text-slate-300" /></div>
                <h3 className="text-lg md:text-xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Mind is clear.</h3>
                <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium text-sm">Add a note to start your collection.</p>
            </div>
          )}
        </div>

        {/* Full Screen Modal */}
        {showForm && (
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-end md:items-center justify-center z-50 p-0 md:p-6 animate-fade-in">
                <div className={`flex flex-col w-full max-w-5xl h-[100dvh] md:h-[90vh] bg-white dark:bg-slate-900 md:rounded-[3rem] shadow-2xl border-none overflow-hidden transition-all duration-500 ${formData.color}`}>
                    
                    {/* MODAL HEADER - FIXED FOR MOBILE */}
                    <div className="flex items-center justify-between px-5 md:px-8 py-3 md:py-5 border-b border-black/5 bg-white/20 backdrop-blur-xl shrink-0">
                        {/* Left Side */}
                        <div className="flex items-center gap-3">
                             {/* Mobile Back Button (Replaces Close) */}
                             <button onClick={closeForm} className="md:hidden p-2 -ml-2 text-slate-600 active:scale-95 transition-transform">
                                <ArrowLeft className="w-6 h-6" />
                             </button>

                             {/* Desktop Status */}
                             <div className="hidden md:flex items-center gap-2 text-slate-500">
                                <PenTool className="w-4 h-4 md:w-5 md:h-5" />
                                <span className="text-[10px] font-black uppercase tracking-[0.2em]">{editId ? 'Refining' : 'Drafting'}</span>
                             </div>
                        </div>

                        {/* Right Side */}
                        <div className="flex items-center gap-3">
                            {/* Pin Button */}
                            <button type="button" onClick={() => setFormData({...formData, isPinned: !formData.isPinned})} className={`p-2 rounded-full md:rounded-2xl transition-all ${formData.isPinned ? 'bg-amber-100 text-amber-600' : 'bg-black/5 text-slate-500 hover:bg-black/10'}`}>
                                <Pin className={`w-5 h-5 ${formData.isPinned ? 'fill-current' : ''}`} />
                            </button>

                            {/* MOBILE: SAVE BUTTON (Top Right - Always Visible) */}
                            <button 
                                onClick={handleSubmit}
                                className="md:hidden bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg shadow-blue-500/20 active:scale-95 transition-all"
                            >
                                Save
                            </button>

                            {/* Desktop: Close Button */}
                            <button onClick={closeForm} className="hidden md:block p-3 rounded-2xl bg-white/50 text-slate-600 hover:bg-rose-50 hover:text-rose-500 transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-hidden relative">
                        {/* Scrollable Content */}
                        <div className="p-6 md:p-12 flex-1 overflow-y-auto custom-scrollbar space-y-4 md:space-y-6">
                           <input 
                                type="text" 
                                placeholder="Untitled" 
                                className="w-full text-3xl md:text-5xl font-black bg-transparent outline-none text-slate-900 tracking-tight placeholder:text-slate-400/40" 
                                value={formData.title} 
                                onChange={(e) => setFormData({...formData, title: e.target.value})} 
                                autoFocus 
                            />
                           <textarea 
                                placeholder="Start typing your thoughts..." 
                                className="w-full h-full text-base md:text-lg font-medium bg-transparent outline-none resize-none text-slate-700 leading-relaxed min-h-[150px] placeholder:text-slate-400/50" 
                                value={formData.content} 
                                onChange={(e) => setFormData({...formData, content: e.target.value})} 
                            />
                           
                           {/* Tag Input */}
                           <div className="space-y-3 pt-4">
                                <div className="flex flex-wrap gap-2">
                                    {formData.tags.map((tag, index) => (
                                        <span key={index} className="px-3 py-1 bg-black/5 rounded-lg text-xs font-bold text-slate-600 flex items-center gap-2">
                                            # {tag}
                                            <button type="button" onClick={() => removeTag(tag)} className="hover:text-rose-500 p-0.5"><X className="w-3 h-3" /></button>
                                        </span>
                                    ))}
                                </div>
                                <div className="flex items-center gap-2 text-slate-400">
                                    <Hash className="w-4 h-4" />
                                    <input 
                                        type="text" 
                                        value={tagInput}
                                        onChange={(e) => setTagInput(e.target.value)}
                                        onKeyDown={handleAddTag}
                                        placeholder="Add tags..." 
                                        className="bg-transparent text-sm font-bold outline-none placeholder:text-slate-400/50 w-full p-2 rounded-lg focus:bg-black/5 transition-colors"
                                    />
                                </div>
                           </div>
                        </div>

                        {/* MODAL FOOTER */}
                        <div className="px-6 md:px-8 py-4 md:py-6 bg-white/40 backdrop-blur-2xl border-t border-black/5 flex flex-col sm:flex-row justify-between items-center gap-4 shrink-0 pb-8 md:pb-6">
                            
                            {/* Color Picker - Centered on Mobile */}
                            <div className="flex gap-2 p-1.5 bg-white/50 rounded-full shadow-sm w-full sm:w-auto justify-center sm:justify-start">
                                {COLORS.map(c => (
                                    <button 
                                        key={c.name} 
                                        type="button" 
                                        onClick={() => setFormData({...formData, color: c.class})} 
                                        className={`w-8 h-8 rounded-full border-2 transition-all ${c.class.split(' ')[0]} ${formData.color === c.class ? 'scale-110 border-slate-900 shadow-md ring-2 ring-white' : 'border-transparent hover:scale-110'}`} 
                                        title={c.name} 
                                    />
                                ))}
                            </div>

                            {/* Desktop: Save Button (Hidden on Mobile) */}
                            <button type="submit" className="hidden md:block w-full sm:w-auto px-10 py-3.5 bg-slate-900 text-white rounded-xl md:rounded-2xl font-black uppercase tracking-widest text-xs hover:scale-105 active:scale-95 transition-all shadow-xl shadow-slate-900/20">
                                Save Note
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        )}
    </div>
  );
};

export default Notes;
