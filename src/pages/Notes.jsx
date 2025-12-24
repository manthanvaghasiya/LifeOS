import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { 
  Plus, Trash2, Pin, Search, X, 
  Sparkles, PenTool, StickyNote 
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
  const [formData, setFormData] = useState({ title: '', content: '', color: COLORS[0].class, isPinned: false });

  useEffect(() => { fetchNotes(); }, []);

  const fetchNotes = async () => {
    try {
      const res = await API.get('/notes');
      setNotes(res.data);
      setLoading(false);
    } catch (err) { console.error(err); setLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() && !formData.content.trim()) return;
    try {
      if (editId) {
        const res = await API.put(`/notes/${editId}`, formData);
        setNotes(notes.map(n => n._id === editId ? res.data : n));
        toast.success('Thought refined');
      } else {
        const res = await API.post('/notes', formData);
        setNotes([res.data, ...notes]);
        toast.success('Idea captured');
      }
      closeForm();
    } catch (err) { toast.error('Error saving'); }
  };

  const togglePin = async (e, note) => {
    try {
      const res = await API.put(`/notes/${note._id}`, { ...note, isPinned: !note.isPinned });
      setNotes(notes.map(n => n._id === note._id ? res.data : n));
    } catch (err) { toast.error('Pin failed'); }
  };

  const handleDelete = async (e, id) => {
    if (!window.confirm("Delete note?")) return;
    try {
      await API.delete(`/notes/${id}`);
      setNotes(notes.filter(n => n._id !== id));
      toast.success('Removed');
    } catch (err) { toast.error('Failed'); }
  };

  const closeForm = () => {
    setShowForm(false); setEditId(null);
    setFormData({ title: '', content: '', color: COLORS[0].class, isPinned: false });
  };

  const filteredNotes = notes.filter(n => 
    n.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    n.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const pinnedNotes = filteredNotes.filter(n => n.isPinned);
  const otherNotes = filteredNotes.filter(n => !n.isPinned);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center"><div className="w-10 h-10 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin"></div></div>
  );

  return (
    <div className="p-4 md:p-8 max-w-[1600px] mx-auto space-y-10 animate-fade-in min-h-screen pb-32 lg:pb-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div>
                <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
                    Knowledge Base <Sparkles className="w-8 h-8 text-amber-500 fill-amber-200" />
                </h1>
                <p className="text-slate-500 dark:text-slate-400 font-bold mt-1 text-sm uppercase tracking-widest">Organize. Think. Evolve.</p>
            </div>
            <div className="flex gap-3 w-full md:w-auto">
                <div className="relative flex-1 md:w-80">
                    <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                    <input type="text" placeholder="Search..." className="w-full pl-11 pr-4 py-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                </div>
                <button onClick={() => setShowForm(true)} className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 flex items-center gap-2 py-3.5 px-6 rounded-2xl font-black shadow-xl hover:scale-105 transition-all text-xs uppercase tracking-widest"><Plus className="w-4 h-4" /> New</button>
            </div>
        </div>

        {/* Pinned Section */}
        {pinnedNotes.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] flex items-center gap-2 ml-2"><Pin className="w-3 h-3 fill-current text-amber-500" /> Priority</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
              <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] ml-2">Fragments</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  <div onClick={() => setShowForm(true)} className="hidden sm:flex flex-col items-center justify-center h-72 border-4 border-dashed border-slate-100 dark:border-slate-800 rounded-[2.5rem] text-slate-300 hover:text-indigo-500 transition-all cursor-pointer group"><Plus className="w-8 h-8 group-hover:scale-110 transition-transform" /></div>
                  {otherNotes.map(note => (
                    <NoteCard key={note._id} note={note} onEdit={() => { setFormData({...note}); setEditId(note._id); setShowForm(true); }} onTogglePin={togglePin} onDelete={handleDelete} />
                  ))}
              </div>
            </>
          ) : !loading && (
            <div className="min-h-[50vh] flex flex-col items-center justify-center text-center">
                <div className="bg-slate-100 dark:bg-slate-800 p-12 rounded-[3.5rem] mb-6"><StickyNote className="w-16 h-16 text-slate-300" /></div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Mind is clear.</h3>
                <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">Add a note to start your collection.</p>
            </div>
          )}
        </div>

        {/* Floating Button */}
        <button onClick={() => setShowForm(true)} className="fixed bottom-24 right-6 md:hidden w-16 h-16 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-full shadow-2xl flex items-center justify-center z-40 hover:scale-110 active:scale-95 transition-all"><Plus className="w-8 h-8" /></button>

        {/* Form Modal */}
        {showForm && (
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-50 p-0 md:p-6 animate-fade-in">
                <div className={`flex flex-col w-full max-w-5xl h-full md:h-[90vh] md:rounded-[3rem] shadow-2xl border-none overflow-hidden transition-all duration-500 ${formData.color}`}>
                    <div className="flex items-center justify-between px-8 py-6 border-b border-black/5">
                        <div className="flex items-center gap-3"><PenTool className="w-5 h-5 text-slate-600" /><span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">{editId ? 'Refining' : 'Drafting'}</span></div>
                        <div className="flex items-center gap-3">
                            <button type="button" onClick={() => setFormData({...formData, isPinned: !formData.isPinned})} className={`p-3 rounded-2xl ${formData.isPinned ? 'bg-amber-100 text-amber-600' : 'bg-black/5 text-slate-400'}`}><Pin className={`w-5 h-5 ${formData.isPinned ? 'fill-current' : ''}`} /></button>
                            <button onClick={closeForm} className="p-3 rounded-2xl bg-rose-50 text-rose-500"><X className="w-5 h-5" /></button>
                        </div>
                    </div>
                    <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-hidden">
                        <div className="p-8 md:p-12 flex-1 overflow-y-auto custom-scrollbar space-y-6">
                           <input type="text" placeholder="Title..." className="w-full text-4xl font-black bg-transparent outline-none text-slate-900 tracking-tighter" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} autoFocus />
                           <textarea placeholder="Start typing..." className="w-full h-full text-lg font-bold bg-transparent outline-none resize-none text-slate-700 leading-relaxed min-h-[400px]" value={formData.content} onChange={(e) => setFormData({...formData, content: e.target.value})} />
                        </div>
                        <div className="px-8 py-6 bg-white/40 backdrop-blur-2xl border-t border-black/5 flex flex-col sm:flex-row justify-between items-center gap-6">
                            <div className="flex gap-3 p-2 bg-black/5 rounded-[2rem]">
                                {COLORS.map(c => (
                                    <button key={c.name} type="button" onClick={() => setFormData({...formData, color: c.class})} className={`w-8 h-8 rounded-full border-2 transition-all ${c.class.split(' ')[0]} ${formData.color === c.class ? 'scale-125 border-slate-900 shadow-xl' : 'border-transparent'}`} title={c.name} />
                                ))}
                            </div>
                            <button type="submit" className="w-full sm:w-auto px-12 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-[10px]">Lock In Thought</button>
                        </div>
                    </form>
                </div>
            </div>
        )}
    </div>
  );
};

export default Notes;