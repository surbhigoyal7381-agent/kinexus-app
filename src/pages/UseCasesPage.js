import React, { useState, useEffect, useMemo, useRef } from 'react';
import ReactDOM from 'react-dom';
import {
  ArrowRight, Activity, Workflow, Search, ChevronDown, ChevronUp, X, AlertTriangle, DollarSign, CheckCircle2
} from 'lucide-react';

// lightweight icon map for local use
const ICON_MAP = { Activity, Workflow, Search, ArrowRight, ChevronDown, ChevronUp, X, AlertTriangle, DollarSign, CheckCircle2 };
const getIcon = (name) => ICON_MAP[name] || Activity;

// ScrollReveal helper removed from this file to avoid duplicate definition (App.js provides it)

const UseCasesPage = ({ navigate, useCases = [], industries = [], initialIndustry = null, filter = null, onFilterChange = null }) => {
  const [selectedIndustry, setSelectedIndustry] = useState(initialIndustry || 'All');
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [activeUseCase, setActiveUseCase] = useState(null);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => { if (initialIndustry) { setSelectedIndustry(initialIndustry); if (onFilterChange) onFilterChange(initialIndustry); } }, [initialIndustry, onFilterChange]);
  useEffect(() => { if (filter !== null && filter !== undefined) setSelectedIndustry(filter); }, [filter]);

  const filteredCases = useMemo(() => {
    const normalizeKey = (v) => (v || '').toString().toLowerCase().replace(/[^a-z0-9]/g, '');
    const selectedKey = selectedIndustry === 'All' ? 'all' : selectedIndustry;
    const industryLookup = new Map();
    industries.forEach(ind => { industryLookup.set(normalizeKey(ind.id), ind.id); industryLookup.set(normalizeKey(ind.name), ind.id); });

    return useCases.filter(item => {
      const caseNorm = normalizeKey(item.industry);
      const resolvedId = industryLookup.get(caseNorm) || null;
      const matchesIndustry = selectedKey === 'all' || resolvedId === selectedKey || normalizeKey(selectedKey) === caseNorm;
      const q = (searchQuery || '').toString().toLowerCase();
      const matchesSearch = (item.title || '').toLowerCase().includes(q) || (item.gap || '').toLowerCase().includes(q);
      return matchesIndustry && matchesSearch;
    });
  }, [selectedIndustry, searchQuery, useCases, industries]);

  return (
    <div className="min-h-screen bg-white pt-16 pb-16 relative overflow-hidden bg-grid-pattern animate-fade-in-up">
      <div className="relative z-10">
        <div className="max-w-7xl mx-auto px-6 text-center mb-10 animate-fade-in">
          <div className="inline-flex items-center space-x-2 bg-[#E8E7FF] text-[#5856D6] px-4 py-2 rounded-full text-sm font-semibold mb-6">
            <Workflow className="w-4 h-4" />
            <span>{useCases.length}+ Pre-Built Workflows</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-semibold text-[#212121] mb-4 tracking-tight">Library of <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5856D6] to-[#2EC5CE]">Autonomous Agents</span></h1>
          <p className="text-base text-gray-600 max-w-2xl mx-auto leading-relaxed">Browse our catalog of industry-specific AI agents ready to deploy.</p>
        </div>

        <div className="relative max-w-xl mx-auto mb-12">
          <div className="relative bg-white rounded-full shadow-sm border border-gray-200 flex items-center px-6 py-4 focus-within:shadow-md focus-within:border-[#5856D6] transition-all">
            <Search className="w-5 h-5 text-gray-400 mr-4" />
            <input type="text" value={searchQuery} onChange={(e) => { const v = e.target.value; setSearchQuery(v); if (!v) { setSuggestions([]); return; } const q = v.toLowerCase(); const matches = [...new Set([...useCases.filter(u => (u.title||'').toLowerCase().includes(q)).map(u => u.title), ...industries.filter(i => (i.name||'').toLowerCase().includes(q)).map(i => i.name)])].slice(0,6); setSuggestions(matches); }} placeholder="Search workflows..." className="w-full bg-transparent focus:outline-none text-[#212121]" />
            {suggestions.length > 0 && (
              <div className="absolute left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-40">
                {suggestions.map((s, i) => (
                  <button key={i} onClick={() => { setSearchQuery(s); setSuggestions([]); const ind = industries.find(it => it.name === s); if (ind) { if (onFilterChange) onFilterChange(ind.id); else setSelectedIndustry(ind.id); } }} className="w-full text-left px-4 py-2 hover:bg-gray-50">{s}</button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in-up">
          {filteredCases.map((useCase) => {
            const Icon = getIcon(useCase.icon);
            const displayIndustry = industries.find(i => i.id === useCase.industry)?.name || useCase.industry || '';
            return (
              <div key={useCase.id} onClick={() => setActiveUseCase(useCase)} className="group bg-white border border-gray-100 rounded-2xl p-8 hover:shadow-xl hover:border-[#5856D6]/30 transition-all cursor-pointer flex flex-col h-full relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[#E8E7FF]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                <div className="flex justify-between items-start mb-6">
                  <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-[#5856D6] group-hover:bg-[#5856D6] group-hover:text-white transition-colors">
                    <Icon className="w-6 h-6" />
                  </div>
                  { !['Banking','Insurance','Healthcare'].includes(displayIndustry) && (
                    <div className="bg-gray-100 text-gray-500 px-3 py-1 rounded text-xs font-bold uppercase tracking-wider">{displayIndustry}</div>
                  ) }
                </div>
                <h3 className="text-lg font-semibold text-[#212121] mb-3 group-hover:text-[#5856D6] transition-colors">{useCase.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-6 line-clamp-3 flex-grow">{useCase.gap}</p>
                <div className="flex items-center justify-between text-[#5856D6] font-bold text-sm group-hover:translate-x-1 transition-transform mt-auto">
                  <div className="flex items-center"><span>View Details</span><ArrowRight className="w-4 h-4 ml-2" /></div>
                  <button onClick={(e) => { e.stopPropagation(); setExpandedId(expandedId === useCase.id ? null : useCase.id); }} aria-expanded={expandedId === useCase.id} className="ml-4 text-sm text-gray-500 bg-gray-50 px-3 py-1 rounded-full hover:bg-gray-100">{expandedId === useCase.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}</button>
                </div>

                {expandedId === useCase.id && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg text-sm text-gray-700">
                    <div className="mb-3"><div className="font-bold text-[13px] text-gray-600 mb-1">Problem</div><div className="text-sm">{useCase.gap}</div></div>
                    <div className="mb-3"><div className="font-bold text-[13px] text-gray-600 mb-1">Impact</div><div className="text-sm">{useCase.pain}</div></div>
                    <div className="mb-3"><div className="font-bold text-[13px] text-gray-600 mb-1">Kinexus Solution</div><div className="text-sm">{useCase.solution}</div></div>
                    <div className="flex flex-wrap gap-2 mt-2">{(useCase.metrics||[]).map((m, i) => (<div key={i} className="px-3 py-1 bg-white border rounded-full text-xs font-semibold">{m}</div>))}</div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {activeUseCase && ReactDOM.createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#212121]/60 backdrop-blur-sm" onClick={() => setActiveUseCase(null)}></div>
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-full sm:max-w-4xl max-h-[90vh] overflow-y-auto animate-fade-in-up mx-4 sm:mx-auto">
            <div className="sticky top-0 bg-white/95 backdrop-blur z-10 p-6 border-b border-gray-100 flex justify-between items-start">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-[#E8E7FF] rounded-2xl flex items-center justify-center text-[#5856D6]"><Activity className="w-8 h-8" /></div>
                <div>
                  <div className="text-sm font-semibold text-[#5856D6] uppercase tracking-wider mb-1">{industries.find(i => i.id === activeUseCase.industry)?.name || activeUseCase.industry}</div>
                  <h2 className="text-2xl font-semibold text-[#212121] leading-tight">{activeUseCase.title}</h2>
                </div>
              </div>
              <button onClick={() => setActiveUseCase(null)} className="p-2 rounded-full hover:bg-gray-100"><X className="w-6 h-6" /></button>
            </div>
            <div className="p-8 space-y-8">
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-red-50 p-6 rounded-2xl border border-red-100"><div className="flex items-center space-x-2 mb-4 text-red-600 font-bold"><AlertTriangle className="w-5 h-5" /><span>The Real Gap</span></div><p className="text-[#212121] text-sm opacity-90">{activeUseCase.gap}</p></div>
                <div className="bg-orange-50 p-6 rounded-2xl border border-orange-100"><div className="flex items-center space-x-2 mb-4 text-orange-600 font-bold"><DollarSign className="w-5 h-5" /><span>The Hidden Pain</span></div><p className="text-[#212121] text-sm opacity-90">{activeUseCase.pain}</p></div>
                <div className="bg-[#212121] p-6 rounded-2xl text-white shadow-lg relative overflow-hidden"><div className="flex items-center space-x-2 mb-4 text-[#2EC5CE] font-bold relative z-10"><CheckCircle2 className="w-5 h-5" /><span>Kinexus Solution</span></div><p className="text-gray-300 text-sm relative z-10">{activeUseCase.solution}</p></div>
              </div>
              <div className="bg-[#F8F9FC] rounded-2xl p-8"><h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Projected Impact</h4><div className="flex flex-wrap gap-4">{(activeUseCase.metrics||[]).map((m, i) => (<div key={i} className="flex items-center space-x-2 bg-white px-4 py-2 rounded-lg border border-gray-100 shadow-sm"><Activity className="w-4 h-4 text-[#5856D6]" /><span className="text-sm font-bold text-[#212121]">{m}</span></div>))}</div></div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default UseCasesPage;
