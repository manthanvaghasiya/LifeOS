import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { Plus, Trash2, Pencil, Pin, Search, X, StickyNote } from 'lucide-react';
import toast from 'react-hot-toast';

// Pastel Colors for Notes
const COLORS = [
  { name: 'White', class: 'bg-white border-gray-200' },
  { name: 'Yellow', class: 'bg-yellow-100 border-yellow-200' },
  { name: 'Green', class: 'bg-green-100 border-green-200' },
  { name: 'Blue', class: 'bg-blue-100 border-blue-200' },
  { name: 'Purple', class: 'bg-purple-100 border-purple-200' },
  { name: 'Pink', class: 'bg-pink-100 border-pink-200' },
];

const Notes = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Form State
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({ title: '', content: '', color: 'bg-white border-gray-200', isPinned: false });

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
        toast.success('Note added');
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
    setFormData({ title: note.title, content: note.content, color: note.color, isPinned: note.isPinned });
    setEditId(note._id);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false); setEditId(null);
    setFormData({ title: '', content: '', color: 'bg-white border-gray-200', isPinned: false });
  };

  // Filter Logic
  const filteredNotes = notes.filter(n => 
    n.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    n.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <StickyNote className="text-yellow-500" /> My Notes
            </h1>
            <p className="text-sm text-gray-500">Capture ideas and daily thoughts.</p>
        </div>
        
        <div className="flex gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
                <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <input 
                    type="text" 
                    placeholder="Search notes..." 
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <button onClick={() => setShowForm(true)} className="bg-black text-white px-4 py-2 rounded-xl font-bold hover:bg-gray-800 flex items-center gap-2 shadow-lg">
                <Plus className="w-5 h-5" />
            </button>
        </div>
      </div>

      {/* Notes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredNotes.map(note => (
            <div key={note._id} className={`p-6 rounded-2xl shadow-sm border flex flex-col justify-between h-64 transition hover:shadow-md ${note.color}`}>
                <div>
                    <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-gray-800 text-lg line-clamp-1">{note.title}</h3>
                        {note.isPinned && <Pin className="w-4 h-4 text-gray-500 fill-gray-500" />}
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed line-clamp-6 whitespace-pre-wrap">
                        {note.content}
                    </p>
                </div>
                
                <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-black/5">
                    <button onClick={() => handleEdit(note)} className="p-2 text-gray-500 hover:text-blue-600 rounded-full hover:bg-white/50 transition">
                        <Pencil className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(note._id)} className="p-2 text-gray-500 hover:text-red-600 rounded-full hover:bg-white/50 transition">
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            </div>
        ))}
        {filteredNotes.length === 0 && !loading && (
            <div className="col-span-full text-center py-20 text-gray-400">
                <p>No notes found. Create your first one!</p>
            </div>
        )}
      </div>

      {/* Modal Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl relative animate-fadeIn overflow-hidden">
                <button onClick={closeForm} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><X className="w-6 h-6" /></button>
                
                <div className="p-6 border-b border-gray-100 bg-gray-50">
                    <h2 className="text-xl font-bold text-gray-800">{editId ? 'Edit Note' : 'New Note'}</h2>
                </div>
                
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <input 
                        type="text" 
                        placeholder="Title" 
                        className="w-full text-xl font-bold placeholder-gray-400 outline-none"
                        value={formData.title} 
                        onChange={(e) => setFormData({...formData, title: e.target.value})} 
                    />
                    
                    <textarea 
                        placeholder="Type something..." 
                        rows={6}
                        className="w-full text-gray-600 placeholder-gray-400 outline-none resize-none"
                        value={formData.content}
                        onChange={(e) => setFormData({...formData, content: e.target.value})}
                    />

                    {/* Color Picker */}
                    <div className="flex gap-2 pt-2">
                        {COLORS.map(c => (
                            <button
                                key={c.name}
                                type="button"
                                onClick={() => setFormData({...formData, color: c.class})}
                                className={`w-8 h-8 rounded-full border ${c.class} ${formData.color === c.class ? 'ring-2 ring-black ring-offset-2' : ''}`}
                                title={c.name}
                            />
                        ))}
                        <button 
                            type="button"
                            onClick={() => setFormData({...formData, isPinned: !formData.isPinned})}
                            className={`ml-auto p-2 rounded-full transition ${formData.isPinned ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-400'}`}
                            title="Pin Note"
                        >
                            <Pin className="w-4 h-4" />
                        </button>
                    </div>

                    <button type="submit" className="w-full bg-black text-white py-3 rounded-xl font-bold hover:bg-gray-800 transition">
                        Save Note
                    </button>
                </form>
            </div>
        </div>
      )}
    </div>
  );
};

export default Notes;