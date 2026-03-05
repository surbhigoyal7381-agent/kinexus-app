import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  ChevronDown, ChevronRight, ArrowRight, Activity, Clock, Shield, 
  Workflow, Zap, BarChart, CheckCircle2, Globe, Users, Settings, 
  Factory, Truck, Pill, Building, ShoppingCart, Landmark, 
  Lightbulb, GraduationCap, HeartPulse, Coffee, FileText, Menu, X,
  Search, PlayCircle, Download, HelpCircle, XCircle, DollarSign,
  Briefcase, Smile, AlertTriangle, Cpu, TrendingUp, Mail, Phone, 
  MapPin, Database, Sparkles, Filter, Maximize2, Battery, Signal, Plus, Trash2, Edit3, Save
} from 'lucide-react';

// --- ICON MAPPER (For Dynamic Storage) ---
const ICON_MAP = {
  Activity, Clock, Shield, Workflow, Zap, BarChart, CheckCircle2, Globe, Users, Settings,
  Factory, Truck, Pill, Building, ShoppingCart, Landmark, Lightbulb, GraduationCap,
  HeartPulse, Coffee, FileText, Search, Download, HelpCircle, XCircle, DollarSign,
  Briefcase, Smile, AlertTriangle, Cpu, TrendingUp, Mail, Phone, MapPin, Database, 
  Sparkles, Filter, Maximize2, Battery, Signal
};

const getIcon = (name) => ICON_MAP[name] || Activity;

// --- STYLES & FONTS ---
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
  
  :root {
    --primary-purple: #5856D6;
    --teal-accent: #2EC5CE;
    --deep-navy: #212121;
    --light-lavender: #E8E7FF;
    --pure-white: #FFFFFF;
    --supporting-gray: #6B6B6B;
  }

  body {
    font-family: 'Poppins', sans-serif;
    color: var(--deep-navy);
    background-color: var(--pure-white);
    -webkit-font-smoothing: antialiased;
    line-height: 1.5;
    font-size: 14px;
    overflow-x: hidden;
  }

  /* --- UTILITIES --- */
  .bg-grid-pattern {
    background-size: 40px 40px;
    background-image: linear-gradient(to right, rgba(88, 86, 214, 0.03) 1px, transparent 1px),
                      linear-gradient(to bottom, rgba(88, 86, 214, 0.03) 1px, transparent 1px);
    mask-image: linear-gradient(to bottom, black 60%, transparent 100%);
  }

  .text-gradient {
    background: linear-gradient(135deg, #5856D6 0%, #2EC5CE 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .glass-card {
    background: rgba(255, 255, 255, 0.95);
    border: 1px solid rgba(88, 86, 214, 0.1);
    box-shadow: 0 4px 20px -5px rgba(0, 0, 0, 0.05);
  }

  .hover-lift {
    transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s ease;
  }
  .hover-lift:hover {
    transform: translateY(-5px);
    box-shadow: 0 20px 40px -10px rgba(88, 86, 214, 0.1);
  }

  .no-scrollbar::-webkit-scrollbar { display: none; }
  .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

  /* --- ANIMATIONS --- */
  @keyframes blob {
    0% { transform: translate(0px, 0px) scale(1); }
    33% { transform: translate(30px, -50px) scale(1.1); }
    66% { transform: translate(-20px, 20px) scale(0.9); }
    100% { transform: translate(0px, 0px) scale(1); }
  }
  .animate-blob { animation: blob 10s infinite; }

  .reveal-section {
    opacity: 0;
    transform: translateY(30px);
    transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1);
  }
  .reveal-section.is-visible {
    opacity: 1;
    transform: translateY(0);
  }
  
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-fade-in-up { animation: fadeInUp 0.5s ease-out forwards; }
  /* Parallax helpers */
  .parallax-root { scroll-behavior: smooth; }
  .parallax-section { position: relative; }
  .parallax-section:nth-child(odd) { background-attachment: fixed; background-size: cover; background-position: center; }
  .parallax-section:nth-child(even) { background-color: #ffffff; }
`;

// --- INITIAL DATA SEEDING (THE "DATABASE") ---
// This data is used if localStorage is empty.

const INITIAL_INDUSTRIES = [
  { 
    id: 'manufacturing', name: 'Manufacturing', icon: 'Factory', 
    desc: 'Reduce downtime 40%, boost OEE 25%',
    hero: "Stop Running Your Factory on Excel and Gut Feel.",
    subhead: "70% of production plans are outdated within 2 hours. Kinexus autonomous agents adapt to disruptions in real-time.",
    gap: "Most manufacturers rely on static, planner-dependent scheduling that can't adapt to real-world chaos.",
    pain: "Frequent rescheduling, underutilised capacity (8-12% loss), and material shortages.",
    solution: "An autonomous planning agent that reads ERP/MES data and recalibrates schedules instantly."
  },
  { 
    id: 'logistics', name: 'Logistics', icon: 'Truck', 
    desc: 'Optimize routes, automate warehouses',
    hero: "Dispatch is Science, Not Art. Stop Guessing.",
    subhead: "Inefficient dispatching increases costs by 12-18%. Let agents handle the complexity.",
    gap: "Dispatchers rely on gut feel. Truck allocation is reactive and rarely optimized.",
    pain: "Delayed dispatches, high freight costs, and wasted truck capacity.",
    solution: "Agents automate dispatch end-to-end—reading orders and SLAs to auto-assign resources."
  },
  { id: 'pharma', name: 'Pharma', icon: 'Pill', desc: 'Automate clinical trials & compliance', hero: 'Paperwork is the Silent Killer of Pharma Agility.', subhead: 'Automate compliance, don\'t just digitise it.', gap: 'Batch records are manual and error-prone.', pain: 'Batch release delays and regulatory risk.', solution: 'Agents automate BMR/BPR end-to-end, reading logs to auto-fill records.' },
  { id: 'real-estate', name: 'Real Estate', icon: 'Building', desc: 'Streamline project mgmt & procurement', hero: 'Build with Certainty.', subhead: 'Projects exceed timelines by 20-80%.', gap: 'Progress reporting is subjective.', pain: 'Cost overruns and overpayments.', solution: 'Agents analyse site photos to verify progress objectively.' },
  { id: 'retail', name: 'Retail', icon: 'ShoppingCart', desc: 'Optimize inventory & dynamic pricing', hero: 'Retail is Detail. Automate it.', subhead: 'High volume means high inefficiency.', gap: 'Inventory managed by averages.', pain: 'Stockouts and overstock.', solution: 'Agents forecast demand at SKU level and adjust pricing.' },
  { id: 'banking', name: 'Banking', icon: 'Landmark', desc: 'Automate KYC & fraud detection', hero: 'Frictionless Banking.', subhead: 'Banks lose 20-40% of customers due to friction.', gap: 'KYC is manual.', pain: 'High drop-off rates and fraud.', solution: 'Agents read ID proofs and validate instantly.' },
  { id: 'insurance', name: 'Insurance', icon: 'Shield', desc: 'Automate claims & underwriting', hero: 'Stop Paying for Leakage.', subhead: 'Underwriting inefficiency reduces profitability.', gap: 'Underwriting is manual and slow.', pain: 'High claims leakage and slow issuance.', solution: 'Agents read reports to assess risk autonomously.' },
  { id: 'energy', name: 'Energy', icon: 'Lightbulb', desc: 'Grid optimization & predictive maintenance', hero: 'Stabilize the Grid.', subhead: 'Load forecasting errors cost millions.', gap: 'Static models miss real-time shifts.', pain: 'Peak load stress and grid instability.', solution: 'Agents forecast load using weather and consumption data.' },
  { id: 'healthcare', name: 'Healthcare', icon: 'HeartPulse', desc: 'Coordinate patient care & claims', hero: 'Let Clinicians Care.', subhead: 'Clinicians spend 40% time on paperwork.', gap: 'Intake is manual.', pain: 'Long wait times and burnout.', solution: 'Agents triage patients and generate notes.' },
  { id: 'hospitality', name: 'Hospitality', icon: 'Coffee', desc: 'Automate bookings & guest experience', hero: 'Turn Guests into Loyalists.', subhead: 'Generic service leads to low loyalty.', gap: 'Guest data is siloed.', pain: 'Low repeat business.', solution: 'Agents build unified profiles to predict preferences.' },
  { id: 'education', name: 'Education', icon: 'GraduationCap', desc: 'Automate student onboarding & scheduling', hero: 'Focus on Learning.', subhead: 'Admissions inefficiency loses applicants.', gap: 'Admissions are manual.', pain: 'Lost applicants and revenue.', solution: 'Agents score leads and optimise timetables.' },
];

const INITIAL_USE_CASES = [
  // Manufacturing
  { id: 'mfg-1', industry: 'Manufacturing', icon: 'Factory', title: 'Autonomous Production Planning Agent', gap: '70% of production plans are outdated within 2 hours.', pain: 'Frequent rescheduling causes chaos, 8-12% capacity loss.', solution: 'Recalculates schedules instantly upon disruption.', metrics: ['12% Productivity Gain', 'Zero Latency'] },
  { id: 'mfg-2', industry: 'Manufacturing', icon: 'Activity', title: 'Real-Time Shop Floor Monitoring', gap: 'MES dashboards are passive and don\'t trigger action.', pain: 'Delayed response to downtime, OEE leaks.', solution: 'Agents watch PLC data 24/7 and alert technicians.', metrics: ['15% OEE Uplift', 'Instant Response'] },
  { id: 'mfg-3', industry: 'Manufacturing', icon: 'Zap', title: 'Energy Optimisation Agent', gap: 'Energy consumption is rarely optimised against tariffs.', pain: 'High energy bills and missed ESG targets.', solution: 'Aligns production with low-tariff periods.', metrics: ['15% Cost Reduction', 'Lower Carbon'] },
  { id: 'ev-1', industry: 'Manufacturing', icon: 'Battery', title: 'Battery Cell Quality Prediction', gap: 'Cell testing is slow/manual. Degradation not predicted.', pain: 'Thermal runaway risk, warranty claims.', solution: 'Analyses test data to predict failure risk.', metrics: ['Reduced Warranty Claims', 'High Reliability'] },
  
  // Logistics
  { id: 'log-1', industry: 'Logistics', icon: 'Truck', title: 'Dispatch Automation Agent', gap: 'Dispatch is manual and gut-feel based.', pain: 'Delayed dispatches, 20% wasted truck capacity.', solution: 'Auto-assigns trucks based on order readiness.', metrics: ['18% Cost Reduction', '99% SLA'] },
  { id: 'log-2', industry: 'Logistics', icon: 'Truck', title: 'Dynamic Route Optimisation', gap: 'Static routes don\'t account for traffic.', pain: 'High fuel costs, missed windows.', solution: 'Continuous re-routing based on live conditions.', metrics: ['15% Fuel Savings', 'On-Time Delivery'] },
  
  // Pharma
  { id: 'pharma-1', industry: 'Pharma', icon: 'Pill', title: 'BMR/BPR Automation', gap: 'Batch records are paper-heavy and error-prone.', pain: 'Release delays, regulatory risk, QA burnout.', solution: 'Auto-fills records from equipment logs.', metrics: ['40% Faster Release', 'Zero Errors'] },
  { id: 'pharma-2', industry: 'Pharma', icon: 'AlertTriangle', title: 'CAPA Documentation Agent', gap: 'CAPA processes are slow and disjointed.', pain: 'Repeat deviations and slow closure.', solution: 'Drafts CAPA forms and tracks closure.', metrics: ['50% Faster Closure', 'Audit-Ready'] },

  // Banking
  { id: 'bank-1', industry: 'Banking', icon: 'Landmark', title: 'KYC & Onboarding Automation', gap: 'KYC is manual and fragmented.', pain: '40% drop-off, high cost.', solution: 'Reads docs, validates, auto-fills forms.', metrics: ['80% Faster', 'Zero Backlog'] },
  { id: 'bank-2', industry: 'Banking', icon: 'Shield', title: 'Fraud Detection Agent', gap: 'Rule-based systems have high false positives.', pain: 'Financial losses, customer friction.', solution: 'Behavioral AI detects anomalies real-time.', metrics: ['95% Detection', 'Low False Positives'] },

  // Insurance
  { id: 'ins-1', industry: 'Insurance', icon: 'Shield', title: 'Intelligent Underwriting', gap: 'Underwriting is manual and subjective.', pain: 'Slow issuance, inconsistent pricing.', solution: 'Reads reports, assesses risk instantly.', metrics: ['10x Faster Quotes', 'Consistent Risk'] },
  
  // Energy
  { id: 'energy-1', industry: 'Energy', icon: 'Lightbulb', title: 'Grid Load Forecasting', gap: 'Static models fail on weather shifts.', pain: 'Peak load stress, high spot costs.', solution: 'Real-time forecasting with weather data.', metrics: ['98% Accuracy', 'Lower Costs'] },

  // Real Estate
  { id: 're-1', industry: 'Real Estate', icon: 'Building', title: 'Project Progress Monitoring', gap: 'Reporting is manual and subjective.', pain: 'Cost overruns, delays.', solution: 'Analyses site photos against BOQ.', metrics: ['100% Visibility', 'Prevent Overpayment'] },

  // Retail
  { id: 'ret-1', industry: 'Retail', icon: 'ShoppingCart', title: 'Inventory Optimisation', gap: 'Inventory managed by averages.', pain: 'Stockouts and overstock.', solution: 'Predicts SKU-level demand per store.', metrics: ['15% Less Stockouts', 'Lower Working Cap'] }
];

// --- UTILITY COMPONENTS ---
const ScrollReveal = ({ children, className = '', delay = 0 }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => { if (ref.current) observer.unobserve(ref.current); };
  }, [delay]);

  return (
    <div ref={ref} className={`reveal-section ${isVisible ? 'is-visible' : ''} ${className}`}>
      {children}
    </div>
  );
};

const Button = ({ children, variant = 'primary', className = '', onClick, icon: Icon, type = 'button', disabled = false }) => {
  const baseStyle = "inline-flex items-center justify-center px-5 py-2.5 rounded-xl font-semibold transition-all duration-300 text-[14px] tracking-wide relative overflow-hidden group";
  
  const variants = {
    primary: "bg-[#2EC5CE] text-white hover:bg-[#25a8b0] hover:shadow-lg hover:-translate-y-1 shadow-md disabled:bg-gray-300",
    secondary: "border-2 border-[#5856D6] text-[#5856D6] hover:bg-[#E8E7FF] hover:-translate-y-1",
    purple: "bg-[#5856D6] text-white hover:bg-[#4644ab] hover:shadow-lg hover:-translate-y-1",
    text: "text-[#5856D6] hover:text-[#2EC5CE] p-0 font-bold",
    danger: "bg-red-500 text-white hover:bg-red-600 hover:shadow-lg"
  };
  
  return (
    <button type={type} disabled={disabled} className={`${baseStyle} ${variants[variant]} ${className}`} onClick={onClick}>
      <span className="relative z-10 flex items-center">
        {children}
        {Icon && <Icon className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />}
      </span>
    </button>
  );
};

const SectionHeading = ({ title, subtitle, centered = false }) => (
  <ScrollReveal className={`mb-12 ${centered ? 'text-center' : ''}`}>
    <h2 className="text-[28px] md:text-[36px] leading-tight mb-4 text-gradient font-semibold tracking-tight">{title}</h2>
    {subtitle && <p className="text-[16px] md:text-[18px] text-[#6B6B6B] max-w-3xl mx-auto leading-relaxed">{subtitle}</p>}
  </ScrollReveal>
);

// --- PARALLAX PAGE (combines sections into a single scrollable page) ---
const ParallaxPage = ({ navigate, industries, useCases }) => {
  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  useEffect(() => {
    // enable deep-link scroll if URL contains a hash
    if (window.location.hash) {
      const id = window.location.hash.replace('#', '');
      setTimeout(() => scrollTo(id), 50);
    }
  }, []);

  return (
    <div className="parallax-root">
      <div id="home-section" className="parallax-section">{/* reuse HomePage content */}
        <HomePage navigate={navigate} />
      </div>

      <div id="industries-section" className="parallax-section"> 
        <IndustriesPage navigate={navigate} industries={industries} />
      </div>

      <div id="services-section" className="parallax-section">
        <ServicesPage navigate={navigate} />
      </div>

      <div id="usecases-section" className="parallax-section">
        <UseCasesPage navigate={navigate} useCases={useCases} industries={industries} />
      </div>

      <div id="contact-section" className="parallax-section">
        <ContactPage navigate={navigate} />
      </div>
    </div>
  );
};

// --- MAIN APPLICATION COMPONENTS ---

const UseCasesPage = ({ navigate, useCases, industries }) => {
  const [selectedIndustry, setSelectedIndustry] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeUseCase, setActiveUseCase] = useState(null);

  const filteredCases = useMemo(() => {
    return useCases.filter(item => {
      const matchesIndustry = selectedIndustry === 'All' || item.industry === selectedIndustry;
      const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            item.gap.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesIndustry && matchesSearch;
    });
  }, [selectedIndustry, searchQuery, useCases]);

  return (
    <div className="min-h-screen bg-white pt-20 pb-24 relative overflow-hidden bg-grid-pattern">
      <div className="relative z-10">
        <div className="max-w-7xl mx-auto px-6 text-center mb-10 animate-fade-in">
           <div className="inline-flex items-center space-x-2 bg-[#E8E7FF] text-[#5856D6] px-4 py-2 rounded-full text-sm font-semibold mb-6">
             <Workflow className="w-4 h-4" />
             <span>{useCases.length}+ Pre-Built Workflows</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-semibold text-[#212121] mb-4 tracking-tight">
            Library of <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5856D6] to-[#2EC5CE]">Autonomous Agents</span>
          </h1>
          <p className="text-base text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Browse our catalog of industry-specific AI agents ready to deploy.
          </p>
        </div>

        {/* Search */}
        <div className="relative max-w-xl mx-auto mb-12">
          <div className="relative bg-white rounded-full shadow-sm border border-gray-200 flex items-center px-6 py-4 focus-within:shadow-md focus-within:border-[#5856D6] transition-all">
            <Search className="w-5 h-5 text-gray-400 mr-4" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search workflows..."
              className="w-full bg-transparent focus:outline-none text-[#212121]"
            />
          </div>
        </div>

        {/* Filter */}
        <div className="sticky top-20 z-30 bg-white/95 backdrop-blur-md border-b border-gray-100 py-4 mb-8">
          <div className="max-w-7xl mx-auto px-6 overflow-x-auto no-scrollbar">
            <div className="flex space-x-2">
              <button onClick={() => setSelectedIndustry('All')} className={`px-6 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${selectedIndustry === 'All' ? 'bg-[#212121] text-white shadow-lg' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>All</button>
              {industries.map((ind) => (
                <button key={ind.id} onClick={() => setSelectedIndustry(ind.name)} className={`px-6 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${selectedIndustry === ind.name ? 'bg-[#212121] text-white shadow-lg' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                  {ind.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Grid */}
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in-up">
          {filteredCases.map((useCase) => {
            const Icon = getIcon(useCase.icon);
            return (
              <div key={useCase.id} onClick={() => setActiveUseCase(useCase)} className="group bg-white border border-gray-100 rounded-2xl p-8 hover:shadow-xl hover:border-[#5856D6]/30 transition-all cursor-pointer flex flex-col h-full relative overflow-hidden">
                <div className="flex justify-between items-start mb-6">
                  <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-[#5856D6] group-hover:bg-[#5856D6] group-hover:text-white transition-colors">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="bg-gray-100 text-gray-500 px-3 py-1 rounded text-xs font-bold uppercase tracking-wider">{useCase.industry}</div>
                </div>
                <h3 className="text-lg font-semibold text-[#212121] mb-3 group-hover:text-[#5856D6] transition-colors">{useCase.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-6 line-clamp-3 flex-grow">{useCase.gap}</p>
                <div className="flex items-center text-[#5856D6] font-bold text-sm group-hover:translate-x-1 transition-transform mt-auto">
                  <span>View Details</span><ArrowRight className="w-4 h-4 ml-2" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal */}
      {activeUseCase && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#212121]/60 backdrop-blur-sm" onClick={() => setActiveUseCase(null)}></div>
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto animate-fade-in-up">
            <div className="sticky top-0 bg-white/95 backdrop-blur z-10 p-6 border-b border-gray-100 flex justify-between items-start">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-[#E8E7FF] rounded-2xl flex items-center justify-center text-[#5856D6]">
                  {React.createElement(getIcon(activeUseCase.icon), { className: "w-8 h-8" })}
                </div>
                <div>
                  <div className="text-sm font-semibold text-[#5856D6] uppercase tracking-wider mb-1">{activeUseCase.industry}</div>
                  <h2 className="text-2xl font-semibold text-[#212121] leading-tight">{activeUseCase.title}</h2>
                </div>
              </div>
              <button onClick={() => setActiveUseCase(null)} className="p-2 rounded-full hover:bg-gray-100"><X className="w-6 h-6" /></button>
            </div>
            <div className="p-8 space-y-8">
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-red-50 p-6 rounded-2xl border border-red-100">
                  <div className="flex items-center space-x-2 mb-4 text-red-600 font-bold"><AlertTriangle className="w-5 h-5" /><span>The Real Gap</span></div>
                  <p className="text-[#212121] text-sm opacity-90">{activeUseCase.gap}</p>
                </div>
                <div className="bg-orange-50 p-6 rounded-2xl border border-orange-100">
                  <div className="flex items-center space-x-2 mb-4 text-orange-600 font-bold"><DollarSign className="w-5 h-5" /><span>The Hidden Pain</span></div>
                  <p className="text-[#212121] text-sm opacity-90">{activeUseCase.pain}</p>
                </div>
                <div className="bg-[#212121] p-6 rounded-2xl text-white shadow-lg relative overflow-hidden">
                  <div className="flex items-center space-x-2 mb-4 text-[#2EC5CE] font-bold relative z-10"><CheckCircle2 className="w-5 h-5" /><span>Kinexus Solution</span></div>
                  <p className="text-gray-300 text-sm relative z-10">{activeUseCase.solution}</p>
                </div>
              </div>
              <div className="bg-[#F8F9FC] rounded-2xl p-8">
                <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Projected Impact</h4>
                <div className="flex flex-wrap gap-4">
                  {activeUseCase.metrics.map((m, i) => (
                    <div key={i} className="flex items-center space-x-2 bg-white px-4 py-2 rounded-lg border border-gray-100 shadow-sm">
                      <Activity className="w-4 h-4 text-[#5856D6]" /><span className="text-sm font-bold text-[#212121]">{m}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const IndustryPage = ({ id, navigate, industries, useCases }) => {
  const industryInfo = industries.find(i => i.id === id) || industries[0];
  const industryUseCases = useCases.filter(uc => uc.industry === industryInfo.name);
  const Icon = getIcon(industryInfo.icon);

  return (
    <div className="animate-fade-in pt-20 bg-white">
      <section className="bg-white pt-20 pb-12 lg:pt-20 lg:pb-20 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-[#E8E7FF]/30 rounded-bl-[200px] -z-10 animate-blob opacity-40"></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <Button variant="text" onClick={() => navigate('industries')} className="mb-8 pl-0 text-sm hover:-translate-x-1">← Back to All Industries</Button>
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-[#E8E7FF] rounded-lg"><Icon className="w-6 h-6 text-[#5856D6]" /></div>
            <span className="text-[#5856D6] font-bold uppercase tracking-wider text-sm">{industryInfo.name} Transformation</span>
          </div>
          <h1 className="text-3xl lg:text-4xl font-semibold leading-[1.15] mb-6 max-w-4xl text-[#212121]">{industryInfo.hero}</h1>
          <p className="text-base lg:text-lg text-[#6B6B6B] max-w-3xl mb-10 leading-relaxed">{industryInfo.subhead}</p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button onClick={() => navigate('contact')}>Start Your Transformation</Button>
            <Button variant="secondary" onClick={() => navigate('useCases')}>Explore Use Cases</Button>
          </div>
        </div>
      </section>

      <section className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeading title="The Reality Check" subtitle="Why traditional methods are failing your teams." centered />
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-10 rounded-2xl shadow-sm border border-gray-100 hover:border-[#5856D6] transition-all hover-lift h-full">
              <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center mb-6 text-red-500"><AlertTriangle className="w-7 h-7" /></div>
              <h3 className="text-lg font-semibold mb-4 text-[#212121]">The Real Gap</h3>
              <p className="text-[#6B6B6B] text-sm leading-relaxed">{industryInfo.gap}</p>
            </div>
            <div className="bg-white p-10 rounded-2xl shadow-sm border border-gray-100 hover:border-[#5856D6] transition-all hover-lift h-full">
              <div className="w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center mb-6 text-orange-500"><DollarSign className="w-7 h-7" /></div>
              <h3 className="text-lg font-semibold mb-4 text-[#212121]">The Hidden Pain</h3>
              <p className="text-[#6B6B6B] text-sm leading-relaxed">{industryInfo.pain}</p>
            </div>
            <div className="bg-[#212121] p-10 rounded-2xl shadow-xl text-white relative overflow-hidden h-full hover-lift">
              <div className="w-14 h-14 bg-[#5856D6] rounded-2xl flex items-center justify-center mb-6 text-white relative z-10"><CheckCircle2 className="w-7 h-7" /></div>
              <h3 className="text-lg font-semibold mb-4 text-white relative z-10">The Kinexus Difference</h3>
              <p className="text-gray-300 text-sm leading-relaxed relative z-10">{industryInfo.solution}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-white bg-grid-pattern">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeading title={`High-ROI Use Cases for ${industryInfo.name}`} subtitle="These aren't experiments. These are deployable, autonomous agents." />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {industryUseCases.map((uc) => {
              const Icon = getIcon(uc.icon);
              return (
                <div key={uc.id} className="glass-card p-8 rounded-2xl hover-lift group cursor-default h-full">
                  <div className="flex justify-between items-start mb-6">
                     <div className="p-3 bg-[#E8E7FF] rounded-xl group-hover:bg-[#5856D6] transition-colors"><Icon className="w-6 h-6 text-[#5856D6] group-hover:text-white" /></div>
                  </div>
                  <h3 className="text-[20px] font-bold mb-3 text-[#212121] group-hover:text-[#5856D6] transition-colors">{uc.title}</h3>
                  <p className="text-[#6B6B6B] text-[16px] leading-relaxed">{uc.solution}</p>
                </div>
              );
            })}
          </div>
          <div className="mt-24 text-center">
            <Button onClick={() => navigate('contact')} className="shadow-xl shadow-purple-200">Schedule a {industryInfo.name} Demo</Button>
          </div>
        </div>
      </section>
    </div>
  );
};

// --- ADMIN DASHBOARD ---
const AdminDashboard = ({ navigate, leads, clearLeads, downloadLeads, useCases, setUseCases, industries, setIndustries }) => {
  const [activeTab, setActiveTab] = useState('leads');
  
  // Use Case Form State
  const [newUseCase, setNewUseCase] = useState({
    title: '', industry: industries[0].name, icon: 'Workflow', gap: '', pain: '', solution: '', metrics: ''
  });

  // Industry Form State
  const [newIndustry, setNewIndustry] = useState({
    name: '', icon: 'Factory', desc: '', hero: '', subhead: '', gap: '', pain: '', solution: ''
  });

  const handleAddUseCase = (e) => {
    e.preventDefault();
    const useCase = {
      id: `custom-${Date.now()}`,
      ...newUseCase,
      metrics: newUseCase.metrics.split(',').map(m => m.trim())
    };
    const updated = [useCase, ...useCases];
    setUseCases(updated);
    localStorage.setItem('kinexus_useCases', JSON.stringify(updated));
    alert('Use Case Added!');
    setNewUseCase({ ...newUseCase, title: '', gap: '', pain: '', solution: '', metrics: '' });
  };

  const handleAddIndustry = (e) => {
    e.preventDefault();
    const industry = {
      id: newIndustry.name.toLowerCase().replace(/\s+/g, '-'),
      ...newIndustry
    };
    const updated = [...industries, industry];
    setIndustries(updated);
    localStorage.setItem('kinexus_industries', JSON.stringify(updated));
    alert('Industry Added!');
    setNewIndustry({ name: '', icon: 'Factory', desc: '', hero: '', subhead: '', gap: '', pain: '', solution: '' });
  };

  return (
    <div className="pt-32 pb-24 px-6 min-h-screen bg-gray-100 animate-fade-in">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-3">
             <div className="bg-[#212121] text-white p-2 rounded-lg"><Database className="w-6 h-6"/></div>
             <h1 className="text-3xl font-bold text-[#212121]">Admin Dashboard</h1>
          </div>
          <div className="flex space-x-4">
            <Button variant="secondary" onClick={() => navigate('home')}>Exit Admin</Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-4 mb-8">
          <button onClick={() => setActiveTab('leads')} className={`px-6 py-3 rounded-lg font-bold transition-all ${activeTab === 'leads' ? 'bg-[#5856D6] text-white shadow-lg' : 'bg-white text-gray-600'}`}>
            Leads ({leads.length})
          </button>
          <button onClick={() => setActiveTab('content')} className={`px-6 py-3 rounded-lg font-bold transition-all ${activeTab === 'content' ? 'bg-[#5856D6] text-white shadow-lg' : 'bg-white text-gray-600'}`}>
            Manage Content
          </button>
        </div>

        {activeTab === 'leads' ? (
          <div className="bg-white rounded-2xl shadow-card overflow-hidden border border-gray-200">
            {leads.length === 0 ? (
              <div className="p-12 text-center text-gray-500">No leads yet.</div>
            ) : (
              <div>
                <div className="p-4 bg-gray-50 flex justify-end space-x-2 border-b border-gray-200">
                   <Button variant="danger" onClick={clearLeads}>Clear Data</Button>
                   <Button onClick={downloadLeads} icon={Download}>Export CSV</Button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead><tr className="bg-gray-50 text-sm text-gray-500"><th className="p-4">Date</th><th className="p-4">Name</th><th className="p-4">Company</th><th className="p-4">Message</th></tr></thead>
                    <tbody className="divide-y divide-gray-100">
                      {leads.map(lead => (
                        <tr key={lead.id} className="hover:bg-gray-50"><td className="p-4 text-sm">{lead.date}</td><td className="p-4 font-bold">{lead.name}</td><td className="p-4">{lead.company}</td><td className="p-4 text-sm text-gray-600 truncate max-w-xs">{lead.message}</td></tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-8">
            {/* Add Use Case Form */}
            <div className="bg-white p-8 rounded-2xl shadow-card">
              <h2 className="text-2xl font-bold mb-6 flex items-center"><Plus className="w-5 h-5 mr-2 text-[#5856D6]" /> Add Use Case</h2>
              <form onSubmit={handleAddUseCase} className="space-y-4">
                <input required placeholder="Title" className="w-full border p-3 rounded-lg" value={newUseCase.title} onChange={e => setNewUseCase({...newUseCase, title: e.target.value})} />
                <div className="grid grid-cols-2 gap-4">
                  <select className="border p-3 rounded-lg" value={newUseCase.industry} onChange={e => setNewUseCase({...newUseCase, industry: e.target.value})}>
                    {industries.map(i => <option key={i.id} value={i.name}>{i.name}</option>)}
                  </select>
                  <select className="border p-3 rounded-lg" value={newUseCase.icon} onChange={e => setNewUseCase({...newUseCase, icon: e.target.value})}>
                    {Object.keys(ICON_MAP).map(key => <option key={key} value={key}>{key}</option>)}
                  </select>
                </div>
                <textarea required placeholder="The Real Gap (Problem)" className="w-full border p-3 rounded-lg h-20" value={newUseCase.gap} onChange={e => setNewUseCase({...newUseCase, gap: e.target.value})} />
                <textarea required placeholder="The Hidden Pain (Consequences)" className="w-full border p-3 rounded-lg h-20" value={newUseCase.pain} onChange={e => setNewUseCase({...newUseCase, pain: e.target.value})} />
                <textarea required placeholder="Kinexus Solution" className="w-full border p-3 rounded-lg h-20" value={newUseCase.solution} onChange={e => setNewUseCase({...newUseCase, solution: e.target.value})} />
                <input required placeholder="Metrics (comma separated)" className="w-full border p-3 rounded-lg" value={newUseCase.metrics} onChange={e => setNewUseCase({...newUseCase, metrics: e.target.value})} />
                <Button type="submit" className="w-full">Publish Use Case</Button>
              </form>
            </div>

            {/* Add Industry Form */}
            <div className="bg-white p-8 rounded-2xl shadow-card">
              <h2 className="text-2xl font-bold mb-6 flex items-center"><Globe className="w-5 h-5 mr-2 text-[#5856D6]" /> Add Industry</h2>
              <form onSubmit={handleAddIndustry} className="space-y-4">
                <input required placeholder="Industry Name" className="w-full border p-3 rounded-lg" value={newIndustry.name} onChange={e => setNewIndustry({...newIndustry, name: e.target.value})} />
                <input required placeholder="Card Description (Short)" className="w-full border p-3 rounded-lg" value={newIndustry.desc} onChange={e => setNewIndustry({...newIndustry, desc: e.target.value})} />
                <select className="w-full border p-3 rounded-lg" value={newIndustry.icon} onChange={e => setNewIndustry({...newIndustry, icon: e.target.value})}>
                    {Object.keys(ICON_MAP).map(key => <option key={key} value={key}>{key}</option>)}
                </select>
                <div className="border-t border-gray-100 pt-4 mt-4"><p className="text-sm font-bold text-gray-500 mb-2">Page Details</p></div>
                <input required placeholder="Hero Headline" className="w-full border p-3 rounded-lg" value={newIndustry.hero} onChange={e => setNewIndustry({...newIndustry, hero: e.target.value})} />
                <input required placeholder="Subheadline" className="w-full border p-3 rounded-lg" value={newIndustry.subhead} onChange={e => setNewIndustry({...newIndustry, subhead: e.target.value})} />
                <textarea required placeholder="Industry Gap Analysis" className="w-full border p-3 rounded-lg h-20" value={newIndustry.gap} onChange={e => setNewIndustry({...newIndustry, gap: e.target.value})} />
                <textarea required placeholder="Industry Pain Points" className="w-full border p-3 rounded-lg h-20" value={newIndustry.pain} onChange={e => setNewIndustry({...newIndustry, pain: e.target.value})} />
                <textarea required placeholder="Kinexus Solution" className="w-full border p-3 rounded-lg h-20" value={newIndustry.solution} onChange={e => setNewIndustry({...newIndustry, solution: e.target.value})} />
                <Button type="submit" className="w-full">Launch Industry Vertical</Button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// --- MAIN APP CONTROLLER ---
export default function App() {
  const [currentView, setCurrentView] = useState('home');
  const [viewParams, setViewParams] = useState(null);
  
  // Dynamic Content State with LocalStorage Persistence
  const [industries, setIndustries] = useState(() => {
    const saved = localStorage.getItem('kinexus_industries');
    return saved ? JSON.parse(saved) : INITIAL_INDUSTRIES;
  });

  const [useCases, setUseCases] = useState(() => {
    const saved = localStorage.getItem('kinexus_useCases');
    return saved ? JSON.parse(saved) : INITIAL_USE_CASES;
  });

  // Leads State
  const [leads, setLeads] = useState(() => {
    return JSON.parse(localStorage.getItem('kinexus_leads') || '[]');
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('admin') === 'true') {
      setCurrentView('admin');
    }
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentView, viewParams]);

  const navigate = (view, params = null) => {
    setCurrentView(view);
    setViewParams(params);
  };

  // Lead Helpers
  const clearLeads = () => {
    // use window.confirm to avoid ESLint no-restricted-globals error
    if (window.confirm('Delete all leads?')) {
      localStorage.removeItem('kinexus_leads');
      setLeads([]);
    }
  };

  const downloadLeads = () => {
    const headers = ['ID', 'Date', 'Name', 'Email', 'Company', 'Industry', 'Message'];
    const csvContent = [
      headers.join(','),
      ...leads.map(lead => [
        lead.id, `"${lead.date}"`, `"${lead.name}"`, `"${lead.email}"`, `"${lead.company}"`, `"${lead.industry}"`, `"${lead.message.replace(/"/g, '""')}"`
      ].join(','))
    ].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `kinexus_leads.csv`;
    link.click();
  };

  // View Routing
  const renderView = () => {
    switch (currentView) {
      case 'home': return <HomePage navigate={navigate} />;
      case 'industry': return <IndustryPage id={viewParams?.id} navigate={navigate} industries={industries} useCases={useCases} />;
      case 'industries': return <IndustriesPage navigate={navigate} industries={industries} />; 
      case 'services': return <ServicesPage navigate={navigate} />;
      case 'service': return <ServicesPage navigate={navigate} />;
      case 'useCases': return <UseCasesPage navigate={navigate} useCases={useCases} industries={industries} />;
      case 'contact': return <ContactPage navigate={navigate} />;
      case 'about': return <HomePage navigate={navigate} />;
      case 'admin': return (
        <AdminDashboard 
          navigate={navigate} 
          leads={leads} 
          clearLeads={clearLeads} 
          downloadLeads={downloadLeads}
          useCases={useCases}
          setUseCases={setUseCases}
          industries={industries}
          setIndustries={setIndustries}
        />
      );
      default: return <HomePage navigate={navigate} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <style>{styles}</style>
      <Navbar navigate={navigate} />
      <main className="flex-grow">
        {currentView === 'home' ? <ParallaxPage navigate={navigate} industries={industries} useCases={useCases} /> : renderView()}
      </main>
      <Footer navigate={navigate} />
    </div>
  );
}

// --- SUB-COMPONENTS (Simplified for space, functionality remains) ---
// Note: HomePage, IndustriesPage, ServicesPage, ContactPage, Navbar, Footer
// These components are reused from previous logic but receive 'navigate' prop.
// Below are the essential ones needed for context.

const HomePage = ({ navigate }) => (
  <div className="animate-fade-in bg-white overflow-x-hidden">
    <section className="relative pt-0 pb-12 lg:pt-0 lg:pb-16 overflow-hidden bg-grid-pattern">
      <div className="absolute top-20 right-0 w-[600px] h-[600px] bg-[#E8E7FF] rounded-full mix-blend-multiply filter blur-[120px] opacity-40 animate-blob"></div>
      <div className="max-w-7xl mx-auto px-6 relative z-10 grid lg:grid-cols-2 gap-16 items-center">
        <ScrollReveal>
          <div className="inline-flex items-center space-x-2 bg-white/50 backdrop-blur-sm border border-purple-100 text-[#5856D6] px-4 py-2 rounded-full text-sm font-bold mb-8 shadow-sm">
             <Zap className="w-4 h-4 fill-current" /><span>Enterprise Agentic AI Platform</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-semibold leading-[1.12] mb-4 text-[#212121] tracking-tight">Your Teams Deserve Better Than <span className="text-gradient">Endless Manual Work</span></h1>
          <p className="text-base text-[#6B6B6B] mb-8 leading-relaxed max-w-xl">Kinexus builds AI agents that take over the tedious work—so your people can focus on what actually moves your business forward. Real autonomy. Real results.</p>
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mb-8">
            <Button onClick={() => navigate('contact')} icon={ArrowRight}>Let's Talk About Your Reality</Button>
            <Button variant="secondary" onClick={() => navigate('useCases')} icon={PlayCircle}>Explore Use Cases</Button>
          </div>
        </ScrollReveal>
        <div className="relative"><div className="w-full aspect-square relative flex items-center justify-center"><div className="absolute inset-0 bg-gradient-to-tr from-[#E8E7FF] to-white rounded-full opacity-30 blur-3xl"></div><Activity className="w-32 h-32 text-[#5856D6] animate-float" /></div></div>
      </div>
    </section>
  </div>
);

const IndustriesPage = ({ navigate, industries }) => (
  <div className="pt-20 pb-12 animate-fade-in bg-white min-h-screen bg-grid-pattern">
    <div className="max-w-7xl mx-auto px-6 text-center mb-12">
      <h1 className="text-3xl font-semibold text-[#212121] mb-4">Industries We <span className="text-gradient">Transform</span></h1>
    </div>
    <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {industries.map((ind) => {
        const Icon = getIcon(ind.icon);
        return (
          <div key={ind.id} onClick={() => navigate('industry', {id: ind.id})} className="bg-white border border-gray-100 p-8 rounded-2xl hover-lift cursor-pointer group">
            <div className="w-16 h-16 bg-[#F3F4F6] rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#5856D6] transition-colors"><Icon className="w-8 h-8 text-[#5856D6] group-hover:text-white" /></div>
            <h3 className="text-2xl font-bold text-[#212121] mb-3">{ind.name}</h3>
            <p className="text-[#6B6B6B] mb-8">{ind.desc}</p>
            <div className="flex items-center text-[#5856D6] font-bold group-hover:text-[#2EC5CE]"><span>View Transformation</span><ArrowRight className="w-5 h-5 ml-2" /></div>
          </div>
        );
      })}
    </div>
  </div>
);

const ServicesPage = ({ navigate }) => (
  <div className="pt-20 pb-16 animate-fade-in text-center min-h-screen bg-grid-pattern">
    <h1 className="text-3xl font-semibold text-[#212121] mb-6">Our <span className="text-gradient">Services</span></h1>
    <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto px-6">
       {[{id: '1', name: 'Full AI Transformation', icon: Workflow}, {id: '2', name: 'Autonomous Workflows', icon: Activity}].map((s) => (
         <div key={s.id} className="glass-card p-10 rounded-3xl hover-lift text-left"><div className="w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center mb-6"><s.icon className="w-7 h-7 text-[#5856D6]"/></div><h3 className="text-2xl font-bold mb-4">{s.name}</h3></div>
       ))}
    </div>
    <Button onClick={() => navigate('home')} className="mt-16">Return Home</Button>
  </div>
);

const ContactPage = ({ navigate }) => {
  const [formData, setFormData] = useState({ name: '', email: '', company: '', message: '' });
  const [status, setStatus] = useState('idle');
  const handleSubmit = (e) => {
    e.preventDefault(); setStatus('submitting');
    setTimeout(() => {
      const newLead = { id: Date.now(), date: new Date().toLocaleString(), ...formData, industry: 'Unknown' };
      const leads = JSON.parse(localStorage.getItem('kinexus_leads') || '[]');
      localStorage.setItem('kinexus_leads', JSON.stringify([newLead, ...leads]));
      setStatus('success');
    }, 1000);
  };
  if (status === 'success') return <div className="pt-20 text-center"><h2 className="text-3xl font-bold">Request Received</h2><Button onClick={() => navigate('home')} className="mt-8">Home</Button></div>;
  return (
    <div className="pt-20 pb-20 max-w-2xl mx-auto px-6">
      <h1 className="text-2xl font-semibold mb-6">Let's Talk</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input required placeholder="Name" className="w-full border p-4 rounded-xl" onChange={e => setFormData({...formData, name: e.target.value})} />
        <input required placeholder="Email" className="w-full border p-4 rounded-xl" onChange={e => setFormData({...formData, email: e.target.value})} />
        <input required placeholder="Company" className="w-full border p-4 rounded-xl" onChange={e => setFormData({...formData, company: e.target.value})} />
        <textarea required placeholder="Message" className="w-full border p-4 rounded-xl h-32" onChange={e => setFormData({...formData, message: e.target.value})} />
        <Button type="submit" className="w-full" disabled={status === 'submitting'}>Submit</Button>
      </form>
    </div>
  );
};

// --- NAVBAR & FOOTER ---
const Navbar = ({ navigate }) => {
  const go = (section, fallbackView) => {
    // ensure we're on the parallax home view, then scroll
    navigate('home');
    setTimeout(() => {
      const el = document.getElementById(section);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      else if (fallbackView) navigate(fallbackView);
    }, 80);
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-2 flex justify-between items-center">
        <div className="text-xl font-bold cursor-pointer" onClick={() => go('home-section', 'home')}>Kinexus</div>
        <div className="space-x-6 hidden md:flex">
          <button onClick={() => go('home-section', 'home')} className="text-black hover:text-[#5856D6]">Home</button>
          <button onClick={() => go('services-section', 'services')} className="text-black hover:text-[#5856D6]">Services</button>
          <button onClick={() => go('industries-section', 'industries')} className="text-black hover:text-[#5856D6]">Industries</button>
          <button onClick={() => go('usecases-section', 'useCases')} className="text-black hover:text-[#5856D6]">Use Cases</button>
          <button onClick={() => go('about-section', 'about')} className="text-black hover:text-[#5856D6]">About</button>
          <button onClick={() => go('contact-section', 'contact')} className="bg-[#25a8b0] text-white px-4 py-2 rounded-lg hover:bg-[#1e8b98]">Contact</button>
        </div>
        <div className="md:hidden">
          {/* mobile menu placeholder */}
          <button className="text-black">Menu</button>
        </div>
      </div>
    </nav>
  );
};

const Footer = ({ navigate }) => (
  <footer className="bg-black text-white py-12">
    <div className="max-w-7xl mx-auto px-6 text-center">
      <p className="mb-4">© {new Date().getFullYear()} Kinexus. All rights reserved.</p>
      <div className="space-x-4">
        <button onClick={() => navigate('home')} className="hover:underline">Home</button>
        <button onClick={() => navigate('about')} className="hover:underline">About</button>
        <button onClick={() => navigate('contact')} className="hover:underline">Contact</button>
      </div>
    </div>
  </footer>
);
