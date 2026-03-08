import React, { useState, useRef } from 'react';
import { Edit, Trash } from 'lucide-react';

const IndustryAdminPage = ({ navigate, industries = [], setIndustries = () => {} }) => {
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ id: '', name: '', icon: '', desc: '' });

  const reset = () => { setEditingId(null); setForm({ id: '', name: '', icon: '', desc: '' }); };

  const handleEdit = (i) => { setEditingId(i.id); setForm({ id: i.id, name: i.name, icon: i.icon, desc: i.desc }); window.scrollTo({ top: 0, behavior: 'smooth' }); };
  const handleDelete = (id) => { if (!window.confirm('Delete this industry?')) return; setIndustries(industries.filter(i => i.id !== id)); };
  const handleSave = (e) => {
    e.preventDefault();
    if (!form.name) { alert('Name required'); return; }
    if (editingId) {
      setIndustries(industries.map(i => i.id === editingId ? { ...i, name: form.name, icon: form.icon, desc: form.desc } : i));
    } else {
      const id = form.id || `industry-${Date.now()}`;
      setIndustries([{ id, name: form.name, icon: form.icon, desc: form.desc }, ...industries]);
    }
    reset();
    try { setTimeout(() => { listingRef.current && listingRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 80); } catch (err) {}
  };

  const listingRef = useRef(null);

  return (
    <div className="pt-6 pb-12">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white p-6 rounded-2xl shadow mb-6">
          <h2 className="text-xl font-bold mb-3">Add / Edit Industry</h2>
          <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input placeholder="ID (optional)" value={form.id} onChange={e => setForm({...form, id: e.target.value})} className="w-full border p-3 rounded" />
            <input placeholder="Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full border p-3 rounded" />
            <input placeholder="Icon name (lucide)" value={form.icon} onChange={e => setForm({...form, icon: e.target.value})} className="w-full border p-3 rounded md:col-span-2" />
            <textarea placeholder="Description" value={form.desc} onChange={e => setForm({...form, desc: e.target.value})} className="w-full border p-3 rounded md:col-span-2 h-36" />
            <div className="md:col-span-2 flex space-x-2">
              <button type="submit" className="px-3 py-2 bg-[#2EC5CE] text-white rounded">{editingId ? 'Save' : 'Add'}</button>
              <button type="button" className="px-3 py-2 border rounded" onClick={reset}>Reset</button>
            </div>
          </form>
        </div>

        <div ref={listingRef} className="bg-white p-6 rounded-2xl shadow">
          <h3 className="text-lg font-semibold mb-4">Existing Industries</h3>
          {industries.length === 0 ? <div className="text-sm text-gray-500">No industries</div> : (
            <div className="space-y-3">
              {industries.map(i => (
                <div key={i.id} className="p-3 border rounded flex items-start justify-between">
                  <div>
                    <div className="font-semibold">{i.name} <span className="text-xs text-gray-400">{i.id}</span></div>
                    <div className="text-sm text-gray-600">{i.desc}</div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button onClick={() => handleEdit(i)} className="text-sm text-[#5856D6] flex items-center"><Edit className="w-4 h-4 mr-1"/>Edit</button>
                    <button onClick={() => handleDelete(i.id)} className="text-sm text-red-500 flex items-center"><Trash className="w-4 h-4 mr-1"/>Delete</button>
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

export default IndustryAdminPage;
