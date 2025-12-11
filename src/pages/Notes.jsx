import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { 
  Plus, Trash2, Pencil, Pin, Search, X, 
  Sparkles, PenTool, Calendar, LayoutGrid 
} from 'lucide-react';
import toast from 'react-hot-toast';

// Updated Colors: Added explicit dark mode overrides
const COLORS = [
  { name: 'Default', class: 'bg-white border-gray-100 dark:bg-gray-800 dark:border-gray-700', hex: '#ffffff' },
  { name: 'Cream', class: 'bg-orange-50 border-orange-100 dark:bg-orange-900/20 dark:border-orange-900/30', hex: '#fff7ed' },
  { name: 'Mint', class: 'bg-green-50 border-green-100 dark:bg-green-900/20 dark:border-green-900/30', hex: '#f0fdf4' },
  { name: 'Azure', class: 'bg-blue-50 border-blue-100 dark:bg-blue-900/20 dark:border-blue-900/30', hex: '#eff6ff' },
  { name: 'Lavender', class: 'bg-purple-50 border-purple-100 dark:bg-purple-900/20 dark:border-purple-900/30', hex: '#faf5ff' },
  { name: 'Rose', class: 'bg-pink-50 border-pink-100 dark:bg-pink-900/20 dark:border-pink-900/30', hex: '#fdf2f8' },
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
        toast.success('Note updated');
      } else {
        const res = await API.post('/notes', formData);
        setNotes([res.data, ...notes]);
        toast.success('Note created');
      }
      closeForm();
    } catch (err) { toast.error('Error saving note'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this note?")) return;
    try {
      await API.delete(`/notes/${id}`);
      setNotes(notes.filter(n => n._id !== id));
      toast.success('Note deleted');
    } catch (err) { toast.error('Error deleting note'); }
  };

  const handleEdit = (note) => {
    // If opening an old note, map old color class to new one if needed, or just use what is saved
    setFormData({ title: note.title, content: note.content, color: note.color, isPinned: note.isPinned });
    setEditId(note._id);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false); setEditId(null);
    setFormData({ title: '', content: '', color: COLORS[0].class, isPinned: false });
  };

  // Helper to ensure old notes look good in dark mode
  const getNoteClasses = (savedColorClass) => {
    // If the saved class is just "bg-white...", append default dark classes
    if (savedColorClass.includes('bg-white') && !savedColorClass.includes('dark:')) {
        return `${savedColorClass} dark:bg-gray-800 dark:border-gray-700`;
    }
    return savedColorClass;
  };

  const filteredNotes = notes
    .filter(n => n.title.toLowerCase().includes(searchTerm.toLowerCase()) || n.content.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => Number(b.isPinned) - Number(a.isPinned));

  if (loading) return <div className="min-h-screen bg-gray-50 flex items-center justify-center text-gray-400 font-medium dark:bg-gray-950 dark:text-gray-500">Loading ideas...</div>;

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-gray-950/20 p-6 pb-20 transition-colors duration-300">
      <div className="max-w-7xl mx-auto space-y-10 animate-fade-in">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight flex items-center gap-3">
                    My Notes <Sparkles className="w-6 h-6 text-yellow-500 fill-yellow-200 animate-pulse" />
                </h1>
                <p className="text-gray-500 dark:text-gray-400 font-medium mt-1 text-base">Capture your best ideas instantly.</p>
            </div>

            <div className="flex flex-wrap gap-3 w-full md:w-auto">
                <div className="flex items-center gap-3 bg-white dark:bg-gray-900/60 px-4 py-3 rounded-2xl shadow-sm border border-gray-200/60 dark:border-gray-800 flex-1 md:flex-none md:w-80">
                    <Search className="w-5 h-5 text-gray-400" />
                    <input 
                        type="text" 
                        placeholder="Search notes..." 
                        className="bg-transparent outline-none text-sm font-medium text-gray-700 dark:text-white w-full placeholder-gray-400"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <button onClick={() => setShowForm(true)} className="group flex items-center gap-2 bg-gray-900 dark:bg-white text-white dark:text-black px-6 py-3 rounded-2xl font-bold hover:bg-black dark:hover:bg-gray-200 transition shadow-xl hover:shadow-2xl transform hover:-translate-y-0.5 text-sm">
                    <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" /> Create
                </button>
            </div>
        </div>

        {/* NOTES GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredNotes.map(note => (
                <div 
                    key={note._id} 
                    className={`relative group p-6 rounded-[2rem] shadow-sm hover:shadow-xl border transition-all duration-300 transform hover:-translate-y-1 flex flex-col justify-between h-64 overflow-hidden ${getNoteClasses(note.color)}`}
                >
                    {note.isPinned && (
                        <div className="absolute top-0 right-0 p-4">
                            <div className="bg-yellow-100 dark:bg-yellow-900/30 p-2 rounded-full text-yellow-600 dark:text-yellow-400 shadow-sm">
                                <Pin className="w-4 h-4 fill-current" />
                            </div>
                        </div>
                    )}

                    <div>
                        <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-3 line-clamp-1 pr-10">{note.title}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed line-clamp-5 whitespace-pre-wrap font-medium">
                            {note.content}
                        </p>
                    </div>
                    
                    <div className="flex justify-between items-end mt-4 pt-4 border-t border-black/5 dark:border-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider flex items-center gap-1">
                            <Calendar className="w-3 h-3" /> {new Date(note.createdAt).toLocaleDateString()}
                        </span>
                        <div className="flex gap-2">
                            <button onClick={() => handleEdit(note)} className="p-2 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 bg-white/50 dark:bg-black/20 hover:bg-white dark:hover:bg-gray-800 rounded-xl transition shadow-sm">
                                <Pencil className="w-4 h-4" />
                            </button>
                            <button onClick={() => handleDelete(note._id)} className="p-2 text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 bg-white/50 dark:bg-black/20 hover:bg-white dark:hover:bg-gray-800 rounded-xl transition shadow-sm">
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            ))}
            
            {filteredNotes.length === 0 && !loading && (
                <div className="col-span-full py-20 text-center flex flex-col items-center justify-center opacity-60">
                    <div className="bg-white dark:bg-gray-900/60 p-6 rounded-full shadow-sm mb-4">
                        <LayoutGrid className="w-10 h-10 text-gray-300 dark:text-gray-600" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-500 dark:text-gray-400">No notes found.</h3>
                    <p className="text-sm text-gray-400 dark:text-gray-500">Tap "Create" to start writing.</p>
                </div>
            )}
        </div>

        {/* EDITOR MODAL */}
        {showForm && (
            <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fadeIn">
                <div className={`p-8 rounded-[2.5rem] w-full max-w-2xl shadow-2xl relative transform transition-all scale-100 border ${getNoteClasses(formData.color)}`}>
                    <button onClick={closeForm} className="absolute top-6 right-6 p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition text-gray-500 dark:text-gray-400"><X className="w-6 h-6" /></button>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-gray-900 dark:bg-white text-white dark:text-black rounded-xl"><PenTool className="w-5 h-5" /></div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{editId ? 'Edit Note' : 'New Idea'}</h2>
                    </div>
                    
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <input 
                            type="text" 
                            placeholder="Title..." 
                            className="w-full text-xl font-bold bg-transparent outline-none placeholder-gray-400/70 text-gray-900 dark:text-white"
                            value={formData.title} 
                            onChange={(e) => setFormData({...formData, title: e.target.value})} 
                            autoFocus
                        />
                        <div className="h-px w-full bg-black/5 dark:bg-white/10"></div>
                        <textarea 
                            placeholder="Start typing your thoughts..." 
                            rows={8}
                            className="w-full text-base font-medium bg-transparent outline-none resize-none placeholder-gray-400/70 text-gray-700 dark:text-gray-300 leading-relaxed"
                            value={formData.content}
                            onChange={(e) => setFormData({...formData, content: e.target.value})}
                        />
                        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4">
                            <div className="flex gap-2">
                                {COLORS.map(c => (
                                    <button key={c.name} type="button" onClick={() => setFormData({...formData, color: c.class})} className={`w-8 h-8 rounded-full border-2 transition-all duration-200 ${c.class} ${formData.color === c.class ? 'ring-2 ring-gray-900 dark:ring-white ring-offset-2 dark:ring-offset-gray-900 scale-110' : 'border-gray-200 dark:border-gray-600 hover:scale-110'}`} title={c.name} />
                                ))}
                            </div>
                            <div className="flex items-center gap-3 w-full sm:w-auto">
                                <button type="button" onClick={() => setFormData({...formData, isPinned: !formData.isPinned})} className={`flex-1 sm:flex-none px-4 py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition ${formData.isPinned ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400' : 'bg-white/50 dark:bg-black/20 text-gray-500 dark:text-gray-400 hover:bg-white dark:hover:bg-black/30'}`}>
                                    <Pin className={`w-4 h-4 ${formData.isPinned ? 'fill-current' : ''}`} />{formData.isPinned ? 'Pinned' : 'Pin'}
                                </button>
                                <button type="submit" className="flex-1 sm:flex-none px-8 py-3 bg-gray-900 dark:bg-white text-white dark:text-black rounded-xl font-bold hover:bg-black dark:hover:bg-gray-200 shadow-lg hover:shadow-xl transition transform hover:-translate-y-0.5">Save</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default Notes;