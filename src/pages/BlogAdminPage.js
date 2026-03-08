import React, { useState, useRef } from 'react';
import { Database } from 'lucide-react';

const Button = ({ children, variant = 'primary', className = '', onClick, type = 'button' }) => {
  const variants = { primary: 'bg-[#2EC5CE] text-white', secondary: 'border-2 border-[#5856D6] text-[#5856D6]' };
  return (<button type={type} onClick={onClick} className={`inline-flex items-center px-4 py-2 rounded ${variants[variant] || ''} ${className}`}>{children}</button>);
};

const BlogAdminPage = ({ navigate, leads = [], clearLeads = () => {}, downloadLeads = () => {}, useCases = [], setUseCases = () => {}, industries = [], setIndustries = () => {}, blogs = [], setBlogs = () => {} }) => {
  const [editingBlog, setEditingBlog] = useState(null);
  const [blogForm, setBlogForm] = useState({ title: '', date: '', image: '', excerpt: '', content: '', status: 'draft', author: 'Kinexus Team' });
  const [previewMode, setPreviewMode] = useState(false);
  const [showInsights, setShowInsights] = useState(() => {
    try { return typeof window !== 'undefined' && window.localStorage && window.localStorage.getItem('kinexus_show_insights') === 'true'; } catch (err) { return false; }
  });

  const resetBlogForm = () => setBlogForm({ title: '', date: '', image: '', excerpt: '', content: '', status: 'draft', author: 'Kinexus Team' });

  const handleEditBlog = (b) => { setEditingBlog(b.id); setBlogForm({ ...b }); window.scrollTo({ top: 0, behavior: 'smooth' }); };
  const handleDeleteBlog = (id) => { if (!window.confirm('Delete this blog?')) return; const updated = blogs.filter(b => b.id !== id); setBlogs(updated); if (editingBlog === id) { setEditingBlog(null); resetBlogForm(); } };
  const handleTogglePublish = (id) => { const updated = blogs.map(b => b.id === id ? { ...b, status: b.status === 'published' ? 'draft' : 'published', date: b.status === 'published' ? b.date : new Date().toLocaleDateString() } : b); setBlogs(updated); };
  const handleImageUpload = (file) => { if (!file) return; const reader = new FileReader(); reader.onload = () => { setBlogForm(f => ({ ...f, image: reader.result })); }; reader.readAsDataURL(file); };
  const listingRef = useRef(null);
  const handleSaveBlog = (e) => { e.preventDefault(); const payload = { ...blogForm }; if (!payload.title) { alert('Title required'); return; } if (!payload.date && payload.status === 'published') payload.date = new Date().toLocaleDateString(); if (editingBlog) { const updated = blogs.map(b => b.id === editingBlog ? { ...b, ...payload } : b); setBlogs(updated); setEditingBlog(null); } else { const id = `blog-${Date.now()}`; const newBlog = { id, ...payload }; setBlogs([newBlog, ...blogs]); } resetBlogForm(); // scroll to listing
    try { setTimeout(() => { listingRef.current && listingRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 80); } catch (err) { /* ignore */ }
  };

  return (
    <div className="pt-24 pb-16 px-6 min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-3"><div className="bg-[#212121] text-white p-2 rounded-lg"><Database className="w-6 h-6"/></div><h1 className="text-3xl font-bold text-[#212121]">Admin Dashboard</h1></div>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-600">Home Insights: <span className="font-semibold">{showInsights ? 'On' : 'Off'}</span></div>
            <Button variant="secondary" onClick={() => {
              const next = !showInsights;
              try { window.localStorage.setItem('kinexus_show_insights', next ? 'true' : 'false'); } catch (err) { /* ignore */ }
              setShowInsights(next);
              alert(`Home Insights ${next ? 'enabled' : 'disabled'}`);
            }}>{showInsights ? 'Disable' : 'Enable'}</Button>
            <Button onClick={() => navigate('home')}>View Home</Button>
            <Button variant="secondary" onClick={() => navigate('home')}>Exit Admin</Button>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-8 rounded-2xl shadow-card mt-8">
            <h2 className="text-2xl font-bold mb-4">Manage Blogs</h2>
            <div>
              <form onSubmit={handleSaveBlog} className="space-y-3">
                  <input required placeholder="Title" className="w-full border p-3 rounded-lg" value={blogForm.title} onChange={e => setBlogForm({...blogForm, title: e.target.value})} />
                  <input placeholder="Date (optional)" className="w-full border p-3 rounded-lg" value={blogForm.date} onChange={e => setBlogForm({...blogForm, date: e.target.value})} />
                  <input placeholder="Excerpt" className="w-full border p-3 rounded-lg" value={blogForm.excerpt} onChange={e => setBlogForm({...blogForm, excerpt: e.target.value})} />
                  <input placeholder="Author" className="w-full border p-3 rounded-lg" value={blogForm.author} onChange={e => setBlogForm({...blogForm, author: e.target.value})} />
                  <div>
                    <label className="text-sm block mb-1">Image (URL or upload)</label>
                    <input type="text" placeholder="Image URL" className="w-full border p-3 rounded-lg mb-2" value={blogForm.image} onChange={e => setBlogForm({...blogForm, image: e.target.value})} />
                    <input type="file" accept="image/*" onChange={e => handleImageUpload(e.target.files && e.target.files[0])} />
                  </div>
                  <textarea placeholder="Content (HTML allowed)" className="w-full border p-3 rounded-lg h-36" value={blogForm.content} onChange={e => setBlogForm({...blogForm, content: e.target.value})} />
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center space-x-2"><input type="checkbox" checked={blogForm.status === 'published'} onChange={e => setBlogForm({...blogForm, status: e.target.checked ? 'published' : 'draft'})} /> <span className="text-sm">Publish</span></label>
                    <Button type="submit">Save</Button>
                    <Button variant="secondary" onClick={() => { setEditingBlog(null); resetBlogForm(); }}>Reset</Button>
                    <button type="button" onClick={() => setPreviewMode(v => !v)} className="text-sm text-gray-600 underline">{previewMode ? 'Hide Preview' : 'Preview'}</button>
                  </div>
              </form>
            </div>
          </div>

          <div ref={listingRef} className="bg-white p-6 rounded-2xl shadow">
            {previewMode ? (
              <div className="p-4 border rounded-lg">
                <div className="text-sm text-gray-400 mb-1">{blogForm.date || new Date().toLocaleDateString()}</div>
                <h3 className="text-xl font-bold mb-2">{blogForm.title || 'Preview Title'}</h3>
                <div className="text-sm text-gray-500 mb-4">By {blogForm.author || 'Kinexus Team'} • {Math.max(1, Math.ceil((blogForm.content || '').replace(/<[^>]+>/g,'').split(/\s+/).length / 200))} min read</div>
                {blogForm.image && <img src={blogForm.image} alt="preview" className="w-full h-48 object-cover rounded mb-4" />}
                <div className="prose max-w-none text-gray-700" dangerouslySetInnerHTML={{ __html: blogForm.content || '<p>Preview content</p>' }} />
              </div>
            ) : (
              <div className="space-y-3">
                {blogs.length === 0 ? <div className="text-sm text-gray-500">No blogs yet.</div> : blogs.map(b => (
                  <div key={b.id} className="p-3 border rounded-lg flex items-center justify-between">
                    <div>
                      <div className="font-semibold">{b.title} <span className="text-xs text-gray-400">{b.status === 'published' ? `• ${b.date}` : '• Draft'}</span></div>
                      <div className="text-sm text-gray-600">{b.excerpt}</div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button onClick={() => handleEditBlog(b)} className="text-sm text-[#5856D6]">Edit</button>
                      <button onClick={() => handleTogglePublish(b.id)} className="text-sm">{b.status === 'published' ? 'Unpublish' : 'Publish'}</button>
                      <button onClick={() => handleDeleteBlog(b.id)} className="text-sm text-red-500">Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogAdminPage;
