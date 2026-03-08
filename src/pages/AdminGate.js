import React, { useState } from 'react';

const AdminGate = ({ children }) => {
  const [authed, setAuthed] = useState(() => localStorage.getItem('kinexus_admin_auth') === 'true');
  const [pw, setPw] = useState('');
  const password = process.env.REACT_APP_ADMIN_PASSWORD || 'admin123';

  const handleSubmit = (e) => {
    e.preventDefault();
    if (pw === password) {
      try { localStorage.setItem('kinexus_admin_auth', 'true'); } catch (e) {}
      setAuthed(true);
    } else {
      alert('Incorrect password');
    }
  };

  const handleSignOut = () => {
    try { localStorage.removeItem('kinexus_admin_auth'); } catch (e) {}
    setAuthed(false);
    setPw('');
    // reload to clear any admin-only state
    try { window.location.reload(); } catch (e) {}
  };

  if (authed) {
    return (
      <div>
        {children}
        <div style={{ maxWidth: 1200, margin: '16px auto', padding: '0 24px' }}>
          <button onClick={handleSignOut} className="text-sm text-red-500">Sign out</button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-16 min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow">
        <h3 className="text-xl font-bold mb-4">Admin Login</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="password" value={pw} onChange={e => setPw(e.target.value)} placeholder="Password" className="w-full border p-3 rounded-lg" />
          <div className="flex justify-between items-center">
            <button className="px-4 py-2 rounded bg-[#2EC5CE] text-white" type="submit">Enter</button>
          </div>
        </form>
        <p className="text-xs text-gray-500 mt-4">This is a client-side password gate for demo only. For production, secure the admin area on the server.</p>
      </div>
    </div>
  );
};

export default AdminGate;
