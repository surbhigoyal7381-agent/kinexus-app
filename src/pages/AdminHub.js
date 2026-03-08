import React, { useState } from 'react';
import BlogAdminPage from './BlogAdminPage';
import UseCasesAdminPage from './UseCasesAdminPage';
import IndustryAdminPage from './IndustryAdminPage';

const TabButton = ({ children, active, onClick }) => (
  <button onClick={onClick} className={`px-4 py-2 rounded ${active ? 'bg-[#5856D6] text-white' : 'border'}`}>
    {children}
  </button>
);

const AdminHub = ({ navigate, leads, clearLeads, downloadLeads, useCases, setUseCases, industries, setIndustries, blogs, setBlogs }) => {
  const [tab, setTab] = useState('blogs');
  return (
    <div>
      <div className="pt-24 pb-6 px-6 bg-white">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold">Admin</h1>
            <div className="inline-flex space-x-2">
              <TabButton active={tab==='blogs'} onClick={() => setTab('blogs')}>Blogs</TabButton>
              <TabButton active={tab==='usecases'} onClick={() => setTab('usecases')}>Use Cases</TabButton>
              <TabButton active={tab==='industries'} onClick={() => setTab('industries')}>Industries</TabButton>
            </div>
          </div>
          <div>
            <button onClick={() => navigate('home')} className="text-sm text-gray-600">Exit Admin</button>
          </div>
        </div>
      </div>

      <div className="px-6">
        {tab === 'blogs' && (
          <BlogAdminPage navigate={navigate} leads={leads} clearLeads={clearLeads} downloadLeads={downloadLeads} useCases={useCases} setUseCases={setUseCases} industries={industries} setIndustries={setIndustries} blogs={blogs} setBlogs={setBlogs} />
        )}

        {tab === 'usecases' && (
          <UseCasesAdminPage navigate={navigate} useCases={useCases} setUseCases={setUseCases} industries={industries} setIndustries={setIndustries} />
        )}

        {tab === 'industries' && (
          <IndustryAdminPage navigate={navigate} industries={industries} setIndustries={setIndustries} />
        )}
      </div>
    </div>
  );
};

export default AdminHub;
