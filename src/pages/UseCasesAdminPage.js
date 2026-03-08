import React, { useState, useRef } from 'react';
import { Trash, Edit } from 'lucide-react';

const Button = ({ children, variant = 'primary', onClick, type = 'button' }) => (
  <button type={type} onClick={onClick} className={`inline-flex items-center px-3 py-2 rounded ${variant === 'primary' ? 'bg-[#2EC5CE] text-white' : 'border'}`}>{children}</button>
);

const UseCasesAdminPage = ({ navigate, useCases = [], setUseCases = () => {}, industries = [] }) => {
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ title: '', industry: industries[0]?.id || '', excerpt: '', details: '' });

  const reset = () => { setEditingId(null); setForm({ title: '', industry: industries[0]?.id || '', excerpt: '', details: '' }); };

  const handleEdit = (u) => { setEditingId(u.id); setForm({ title: u.title, industry: u.industry, excerpt: u.excerpt || '', details: u.details || '' }); window.scrollTo({ top: 0, behavior: 'smooth' }); };
  const handleDelete = (id) => { if (!window.confirm('Delete this use case?')) return; setUseCases(useCases.filter(u => u.id !== id)); };
  const handleSave = (e) => {
    e.preventDefault();
    if (!form.title) { alert('Title required'); return; }
    if (editingId) {
      setUseCases(useCases.map(u => u.id === editingId ? { ...u, ...form } : u));
    } else {
      const id = `usecase-${Date.now()}`;
      setUseCases([{ id, ...form }, ...useCases]);
    }
    reset();
    // scroll after saving
    try { setTimeout(() => { listingRef.current && listingRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 80); } catch (err) {}
  };

  const listingRef = useRef(null);

  // scroll to listing after save
  const scrollToListing = () => {
    try { setTimeout(() => { listingRef.current && listingRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 80); } catch (err) {}
  };

  return (
    <div className="pt-6 pb-12">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white p-6 rounded-2xl shadow mb-6">
          <h2 className="text-xl font-bold mb-3">Add / Edit Use Case</h2>
          <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input placeholder="Title" value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="w-full border p-3 rounded" />
            <select value={form.industry} onChange={e => setForm({...form, industry: e.target.value})} className="w-full border p-3 rounded">
              <option value="">Select industry</option>
              {industries.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
            </select>
            <input placeholder="Excerpt" value={form.excerpt} onChange={e => setForm({...form, excerpt: e.target.value})} className="w-full border p-3 rounded md:col-span-2" />
            <textarea placeholder="Details (HTML allowed)" value={form.details} onChange={e => setForm({...form, details: e.target.value})} className="w-full border p-3 rounded md:col-span-2 h-36" />
            <div className="md:col-span-2 flex space-x-2">
              <Button type="submit">{editingId ? 'Save Changes' : 'Add Use Case'}</Button>
              <Button variant="secondary" onClick={reset}>Reset</Button>
            </div>
          </form>
        </div>

        <div ref={listingRef} className="bg-white p-6 rounded-2xl shadow">
          <h3 className="text-lg font-semibold mb-4">Existing Use Cases</h3>
          {useCases.length === 0 ? <div className="text-sm text-gray-500">No use cases</div> : (
            <div className="space-y-3">
              {useCases.map(u => (
                <div key={u.id} className="p-3 border rounded flex items-start justify-between">
                  <div>
                    <div className="font-semibold">{u.title} <span className="text-xs text-gray-400">{industries.find(i=>i.id===u.industry)?.name || ''}</span></div>
                    <div className="text-sm text-gray-600">{u.excerpt}</div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button onClick={() => handleEdit(u)} className="text-sm text-[#5856D6] flex items-center"><Edit className="w-4 h-4 mr-1"/>Edit</button>
                    <button onClick={() => handleDelete(u.id)} className="text-sm text-red-500 flex items-center"><Trash className="w-4 h-4 mr-1"/>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UseCasesAdminPage;
