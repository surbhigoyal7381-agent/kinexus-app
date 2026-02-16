import React, { useState, useEffect } from 'react';
import { 
  ChevronDown, ChevronRight, ArrowRight, Activity, Clock, Shield, 
  Workflow, Zap, BarChart, CheckCircle2, Globe, Users, Settings, 
  Factory, Truck, Pill, Building, ShoppingCart, Landmark, 
  Lightbulb, GraduationCap, HeartPulse, Coffee, FileText, Menu, X,
  Search, PlayCircle, Download, HelpCircle, XCircle, DollarSign,
  Briefcase, Smile, AlertTriangle, Cpu, TrendingUp
} from 'lucide-react';

// --- STYLES & FONTS ---
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');
  
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
    line-height: 1.7;
  }

  h1, h2, h3, h4, h5, h6 {
    font-weight: 700;
    color: var(--deep-navy);
    line-height: 1.2;
  }

  p {
    font-size: 18px;
    color: var(--deep-navy);
  }

  .text-body { color: var(--deep-navy); }
  .text-muted { color: var(--supporting-gray); }
  
  .bg-lavender { background-color: var(--light-lavender); }
  .bg-purple { background-color: var(--primary-purple); }
  .bg-teal { background-color: var(--teal-accent); }
  
  .text-purple { color: var(--primary-purple); }
  .text-teal { color: var(--teal-accent); }
  
  .border-purple { border-color: var(--primary-purple); }
  
  .gradient-purple-indigo {
    background: linear-gradient(135deg, #5856D6 0%, #3F3D9A 100%);
  }

  .shadow-card {
    box-shadow: 0 12px 40px -12px rgba(88, 86, 214, 0.15);
  }

  .animate-fade-in {
    animation: fadeIn 0.6s ease-out forwards;
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

// --- DATA MOCKS ---
const industries = [
  { id: 'manufacturing', name: 'Manufacturing', icon: Factory, desc: 'Reduce downtime 40%, boost OEE 25%' },
  { id: 'logistics', name: 'Logistics & SCM', icon: Truck, desc: 'Optimize routes, automate warehouses' },
  { id: 'pharma', name: 'Pharma & Life Sciences', icon: Pill, desc: 'Automate clinical trials & compliance' },
  { id: 'real-estate', name: 'Real Estate & Construction', icon: Building, desc: 'Streamline project mgmt & procurement' },
  { id: 'retail', name: 'Retail & Omni-channel', icon: ShoppingCart, desc: 'Optimize inventory & dynamic pricing' },
  { id: 'banking', name: 'Banking & FS', icon: Landmark, desc: 'Automate KYC & fraud detection' },
  { id: 'insurance', name: 'Insurance', icon: Shield, desc: 'Automate claims & underwriting' },
  { id: 'energy', name: 'Energy & Utilities', icon: Lightbulb, desc: 'Grid optimization & predictive maintenance' },
  { id: 'healthcare', name: 'Healthcare', icon: HeartPulse, desc: 'Coordinate patient care & claims' },
  { id: 'hospitality', name: 'Hospitality', icon: Coffee, desc: 'Automate bookings & guest experience' },
  { id: 'education', name: 'Education', icon: GraduationCap, desc: 'Automate student onboarding & scheduling' },
];

// --- RICH INDUSTRY CONTENT ---
const industryData = {
  manufacturing: {
    hero: "Stop Running Your Factory on Excel and Gut Feel.",
    subhead: "70% of production plans are outdated within 2 hours. Kinexus autonomous agents adapt to disruptions in real-time.",
    gap: "Most manufacturers rely on static, planner-dependent scheduling that can't adapt to real-world chaos.",
    pain: "Frequent rescheduling, underutilised capacity (8-12% loss), and material shortages leading to emergency procurement.",
    solution: "We don't give you a dashboard. We give you an autonomous planning agent that reads ERP/MES data and recalibrates schedules instantly.",
    useCases: [
      { title: "Autonomous Production Planning", desc: "Recalculates schedules every time a disruption occurs, balancing constraints dynamically." },
      { title: "Real-Time Shop Floor Monitoring", desc: "Reads PLCs and sensors to detect anomalies instantly and trigger corrective workflows." },
      { title: "Quality Inspection (Vision + Text)", desc: "Combines vision AI for defects and text AI for reports, ensuring 95%+ accuracy." },
      { title: "Predictive Maintenance", desc: "Predicts failures days in advance using vibration and temp data, preventing unplanned downtime." },
      { title: "SOP Automation", desc: "Converts text-heavy SOPs into step-by-step executable workflows for operators." }
    ]
  },
  logistics: {
    hero: "Dispatch is Science, Not Art. Stop Guessing.",
    subhead: "Inefficient dispatching increases costs by 12-18%. Let agents handle the complexity.",
    gap: "Dispatchers rely on gut feel. Truck allocation is reactive, and route planning rarely considers real-time constraints.",
    pain: "Delayed dispatches, high freight costs due to poor consolidation, and 10-20% wasted truck capacity.",
    solution: "Kinexus agents automate dispatch end-to-end—reading orders, truck availability, and SLAs to auto-assign optimal resources.",
    useCases: [
      { title: "Dispatch Automation", desc: "Auto-assigns optimal trucks based on orders, routes, and SLAs." },
      { title: "Dynamic Route Optimisation", desc: "Recalculates routes in real-time based on traffic, load type, and delivery windows." },
      { title: "Real-Time Exception Management", desc: "Detects delays from GPS/weather feeds and triggers corrective actions before customers complain." },
      { title: "Freight Audit & Reconciliation", desc: "Audits invoices against contracts and GPS logs to identify overcharges automatically." },
      { title: "Warehouse Slotting", desc: "Optimises bin locations based on picking frequency and item size to reduce travel time." }
    ]
  },
  pharma: {
    hero: "Paperwork is the Silent Killer of Pharma Agility.",
    subhead: "Documentation errors cause 30-40% of batch rejections. Automate compliance, don't just digitise it.",
    gap: "Batch records are manual and error-prone. QA teams spend 60% of their time reviewing documents instead of ensuring quality.",
    pain: "Batch release delays, regulatory risk (FDA 483s), and high QA burnout due to documentation overload.",
    solution: "Our agents automate BMR/BPR end-to-end, reading equipment logs and operator entries to auto-fill records with zero errors.",
    useCases: [
      { title: "BMR/BPR Automation", desc: "Auto-fills batch records from MES/QC data, validating compliance in real-time." },
      { title: "CAPA Documentation", desc: "Drafts CAPA forms, suggests root causes, and tracks closure timelines automatically." },
      { title: "Deviation Investigation", desc: "Correlates historical data to suggest likely root causes and auto-generate reports." },
      { title: "Regulatory Submission", desc: "Compiles protocols and trial data into submission-ready documents for FDA/EMA." },
      { title: "Cold Chain Monitoring", desc: "Detects temperature excursions instantly and triggers alerts to prevent spoilage." }
    ]
  },
  'real-estate': {
    hero: "Build with Certainty in an Uncertain World.",
    subhead: "Projects exceed timelines by 20-80% due to poor visibility. We bring truth to the job site.",
    gap: "Progress reporting is subjective and manual. Leadership relies on delayed WhatsApp updates and unstructured photos.",
    pain: "Cost overruns, overpayments to contractors, and inability to detect delays until it's too late.",
    solution: "Kinexus agents analyse site photos, videos, and BOQs to objectively verify progress and automate contractor billing.",
    useCases: [
      { title: "Project Progress Monitoring", desc: "Analyses site visual data to compare actual progress against schedule and BOQ." },
      { title: "Contractor Billing Verification", desc: "Validates contractor bills against verified progress to prevent overpayment." },
      { title: "Material Procurement Coordination", desc: "Predicts material needs based on schedule and triggers vendor follow-ups." },
      { title: "Drawing Control", desc: "Ensures site teams always use the latest approved drawings, preventing rework." },
      { title: "Safety Monitoring", desc: "Uses CCTV analysis to detect PPE violations and unsafe behaviors continuously." }
    ]
  },
  banking: {
    hero: "Frictionless Banking, Powered by Autonomous Agents.",
    subhead: "Banks lose 20-40% of customers due to onboarding friction. Fix the process, save the customer.",
    gap: "KYC and onboarding are manual and document-heavy. Fraud detection is reactive and rule-based.",
    pain: "High drop-off rates, regulatory penalties for incomplete KYC, and high operational costs for back-office teams.",
    solution: "Agents read ID proofs, validate authenticity, cross-check databases, and auto-fill forms instantly.",
    useCases: [
      { title: "KYC & Onboarding Automation", desc: "End-to-end verification and form filling, reducing onboarding time to minutes." },
      { title: "Fraud Detection & Prevention", desc: "Proactively detects transaction anomalies and flags suspicious behavior patterns." },
      { title: "Loan Underwriting", desc: "Analyses statements and credit reports to recommend risk-scored decisions autonomously." },
      { title: "Customer Service Resolution", desc: "Instantly resolves queries by reading account data, reducing call center load." },
      { title: "Regulatory Compliance", desc: "Auto-generates reports and flags anomalies to ensure continuous audit readiness." }
    ]
  },
  insurance: {
    hero: "Stop Paying for Leakage. Start Automating Accuracy.",
    subhead: "Underwriting inefficiency reduces profitability by 5-15%. Let data make the decisions.",
    gap: "Underwriting and claims processing are manual, slow, and prone to human bias and error.",
    pain: "High claims leakage, slow policy issuance, fraud losses, and inconsistent risk pricing.",
    solution: "Kinexus agents read medical reports and proposals to assess risk and adjudicate claims autonomously.",
    useCases: [
      { title: "Intelligent Underwriting", desc: "Analyses risk factors from documents to recommend consistent pricing and acceptance." },
      { title: "Claims Triage & Adjudication", desc: "Validates coverage and evidence to recommend approval or rejection instantly." },
      { title: "Fraud Investigation", desc: "Detects patterns and anomalies across claims to identify fraud rings proactively." },
      { title: "Policy Servicing", desc: "Handles endorsements and queries end-to-end, improving customer retention." },
      { title: "Renewal Prediction", desc: "Predicts churn risk and recommends personalised retention offers." }
    ]
  },
  energy: {
    hero: "Stabilize the Grid with Predictive Intelligence.",
    subhead: "Load forecasting errors cost millions. Move from static models to real-time prediction.",
    gap: "Utilities rely on manual adjustments and static models that miss DER impact and real-time shifts.",
    pain: "Peak load stress, high power purchase costs, grid instability, and regulatory penalties.",
    solution: "Our agents forecast load in real-time using weather and consumption data to recommend demand response actions.",
    useCases: [
      { title: "Grid Load Forecasting", desc: "Real-time prediction using weather and DER data to optimise dispatch." },
      { title: "Predictive Maintenance", desc: "Analyses SCADA data to predict asset failures before they cause outages." },
      { title: "Renewable Integration", desc: "Forecasts solar/wind output to optimise grid balancing and storage usage." },
      { title: "Energy Theft Detection", desc: "Identifies non-technical losses by analysing consumption anomalies at the feeder level." },
      { title: "Outage Restoration", desc: "Predicts probable fault locations and coordinates field crews for faster restoration." }
    ]
  },
  healthcare: {
    hero: "Let Clinicians Care, Let Agents Handle the Rest.",
    subhead: "Clinicians spend 40% of their time on paperwork. We give that time back to patients.",
    gap: "Intake and documentation are manual and slow, causing bottlenecks and clinician burnout.",
    pain: "Long wait times, delayed diagnosis, billing errors, and high staff stress levels.",
    solution: "Kinexus agents triage patients, generate clinical notes, and manage bed flow autonomously.",
    useCases: [
      { title: "Intelligent Patient Triage", desc: "Reads symptoms and vitals to prioritise patients by urgency and auto-fill EMR." },
      { title: "Clinical Documentation", desc: "Listens to consults and generates SOAP notes and coding automatically." },
      { title: "Appointment Scheduling", desc: "Optimises calendar slots based on case complexity and doctor availability." },
      { title: "Revenue Cycle Management", desc: "Validates documentation and codes to prevent claim denials and leakage." },
      { title: "Bed Management", desc: "Tracks availability and predicts discharges to optimise patient flow." }
    ]
  },
  hospitality: {
    hero: "Turn Guests into Loyalists, Not Just Transactions.",
    subhead: "Generic service leads to low loyalty. Personalise every touchpoint autonomously.",
    gap: "Guest data is siloed. Staff rely on manual checks, missing opportunities for personalisation.",
    pain: "Low repeat business, missed upsell opportunities, and inconsistent service quality.",
    solution: "Agents build unified profiles to predict preferences and trigger personalised actions across the stay.",
    useCases: [
      { title: "Guest Personalisation", desc: "Predicts preferences for room and dining to tailor the experience pre-arrival." },
      { title: "Dynamic Revenue Management", desc: "Optimises pricing in real-time based on demand, events, and competitor rates." },
      { title: "Housekeeping Optimisation", desc: "Prioritises room cleaning based on arrival times and staff workload." },
      { title: "F&B Demand Forecasting", desc: "Predicts consumption to reduce wastage and optimise inventory levels." },
      { title: "Feedback Intelligence", desc: "Analyses reviews to detect sentiment and flag service failures instantly." }
    ]
  },
  education: {
    hero: "Focus on Learning, Automate the Administration.",
    subhead: "Admissions inefficiency leads to lost applicants. Streamline the journey from lead to alumni.",
    gap: "Admissions and planning are manual and scattered, leading to low conversion and operational chaos.",
    pain: "Lost high-quality applicants, classroom conflicts, faculty burnout, and revenue volatility.",
    solution: "Agents score leads, optimise timetables, and monitor student performance to intervene early.",
    useCases: [
      { title: "Admissions Intelligence", desc: "Scores leads and personalises communication to boost enrollment conversion." },
      { title: "Timetable Optimisation", desc: "Generates clash-free schedules aligned with faculty availability and room capacity." },
      { title: "Student Early Intervention", desc: "Detects academic or behavioural risks early to trigger support mechanisms." },
      { title: "Faculty Workload Management", desc: "Balances teaching, research, and admin loads to prevent burnout." },
      { title: "Fee Management", desc: "Predicts default risk and automates personalised reminders to secure revenue." }
    ]
  },
  retail: {
    hero: "Retail is Detail. Automate the Details.",
    subhead: "High volume means high inefficiency. Optimise every SKU, every shelf, every shift.",
    gap: "Inventory and staffing are managed by averages, not real-time local demand signals.",
    pain: "Stockouts, overstock, shrinkage, and missed revenue opportunities due to rigid pricing.",
    solution: "Agents forecast demand at the SKU level, optimise shift schedules, and adjust pricing dynamically.",
    useCases: [
      { title: "Store Operations Agent", desc: "Runs daily store checklists and operations autonomously to boost productivity." },
      { title: "Inventory Optimisation", desc: "Balances stock levels across stores/warehouses to reduce working capital." },
      { title: "Dynamic Pricing", desc: "Adjusts pricing based on demand, expiry, and competition to maximise margin." },
      { title: "Workforce Scheduling", desc: "Aligns staffing levels with predicted footfall to reduce labor costs." },
      { title: "Shrinkage Detection", desc: "Identifies patterns of theft or error to reduce inventory loss." }
    ]
  }
};

const faqs = [
  { q: "How is this different from the RPA we tried?", a: "RPA automates steps. Our AI agents automate decisions. RPA breaks when things change. Our agents adapt. Think of RPA as a robot following a script. Kinexus agents are colleagues who think." },
  { q: "What if our systems are old?", a: "Perfect. Most of our clients run SAP from 2008 or custom-built ERP. We integrate with anything that has an API (or even a UI). Old systems are our specialty." },
  { q: "Do we need a data science team?", a: "Nope. We bring the AI expertise. Your team brings the process knowledge. Together, we build something that works." },
  { q: "How long until we see results?", a: "Pilot results in 8-12 weeks. Full transformation ROI in 12-18 months. We move fast because we've done this before." },
  { q: "What does this cost?", a: "Pilots: ₹50-75 lakh. Full transformation: ₹1-5 crore. Monthly retainer: ₹25-75 lakh. Yes, it's an investment. But most clients break even in Year 1 and 10x their money by Year 2." },
  { q: "Is our data safe?", a: "Yes. SOC 2 Type II, ISO 27001, GDPR compliant. Data stays in your environment. We don't train models on your data. Security isn't optional—it's foundational." },
  { q: "What if it doesn't work?", a: "We start with a pilot. Low risk. If it doesn't deliver measurable value, you walk away with ₹50-75 lakh spent and lessons learned. But in 3 years, we've never had a pilot fail. (Knock on wood.)" },
];

const services = [
  { id: 'full-ai-transformation', name: 'Full AI Transformation', icon: Workflow },
  { id: 'autonomous-workflows', name: 'Autonomous Workflows', icon: Activity },
  { id: 'ai-agents', name: '24/7 AI Agents', icon: Clock },
  { id: 'integrations', name: 'Deep Integrations', icon: Settings }
];

// --- UI COMPONENTS ---
const Button = ({ children, variant = 'primary', className = '', onClick, icon: Icon }) => {
  const baseStyle = "inline-flex items-center justify-center px-8 py-4 rounded-lg font-semibold transition-all duration-300 text-[18px]";
  const variants = {
    primary: "bg-[#2EC5CE] text-white hover:bg-[#25a8b0] hover:shadow-lg hover:-translate-y-1",
    secondary: "border-2 border-[#5856D6] text-[#5856D6] hover:bg-[#E8E7FF]",
    purple: "bg-[#5856D6] text-white hover:bg-[#4644ab] hover:shadow-lg",
    text: "text-[#5856D6] hover:text-[#2EC5CE] p-0 font-bold"
  };
  
  return (
    <button className={`${baseStyle} ${variants[variant]} ${className}`} onClick={onClick}>
      {children}
      {Icon && <Icon className="ml-2 w-5 h-5" />}
    </button>
  );
};

const SectionHeading = ({ title, subtitle, centered = false }) => (
  <div className={`mb-16 ${centered ? 'text-center' : ''}`}>
    <h2 className="text-[42px] md:text-[56px] leading-tight mb-6 text-[#5856D6]">{title}</h2>
    {subtitle && <p className="text-[18px] md:text-[20px] text-[#212121] max-w-3xl mx-auto leading-relaxed">{subtitle}</p>}
  </div>
);

const Accordion = ({ items }) => {
  const [openIndex, setOpenIndex] = useState(0);
  
  return (
    <div className="space-y-4">
      {items.map((item, idx) => (
        <div key={idx} className="border border-gray-200 rounded-xl overflow-hidden bg-white">
          <button 
            className="w-full flex justify-between items-center p-6 text-left hover:bg-gray-50 transition-colors"
            onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
          >
            <span className="text-[18px] font-bold text-[#212121]">{item.q}</span>
            {openIndex === idx ? <ChevronDown className="text-[#5856D6]" /> : <ChevronRight className="text-gray-400" />}
          </button>
          {openIndex === idx && (
            <div className="p-6 pt-0 bg-gray-50/50">
              <p className="text-[#6B6B6B] text-[16px]">{item.a}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

// --- NAVIGATION SHELL ---
const Navbar = ({ navigate }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <nav className="fixed w-full bg-white/95 backdrop-blur-md z-50 border-b border-gray-100 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 h-24 flex items-center justify-between">
        <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate('home')}>
          <div className="w-10 h-10 bg-[#5856D6] rounded-xl flex items-center justify-center shadow-lg">
            <Activity className="text-white w-6 h-6" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-[#212121]">Kinexus</span>
        </div>

        <div className="hidden lg:flex items-center space-x-8 text-[16px]">
          <button onClick={() => navigate('services')} className="text-[#212121] hover:text-[#5856D6] font-medium transition-colors">Services</button>
          <button onClick={() => navigate('industries')} className="text-[#212121] hover:text-[#5856D6] font-medium transition-colors">Industries</button>
          <button onClick={() => navigate('useCases')} className="text-[#212121] hover:text-[#5856D6] font-medium transition-colors">Use Cases</button>
          <button onClick={() => navigate('about')} className="text-[#212121] hover:text-[#5856D6] font-medium transition-colors">Company</button>
        </div>

        <div className="hidden lg:flex items-center space-x-6">
          <button className="text-[#212121] font-semibold hover:text-[#5856D6]">Login</button>
          <Button onClick={() => navigate('contact')} className="!py-2 !px-6 text-[16px]">Let's Talk</Button>
        </div>

        <button className="lg:hidden text-[#212121]" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
        </button>
      </div>
    </nav>
  );
};

const Footer = ({ navigate }) => (
  <footer className="bg-[#212121] text-white pt-24 pb-12">
    <div className="max-w-7xl mx-auto px-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
        <div className="lg:col-span-1">
          <div className="flex items-center space-x-2 mb-6">
            <div className="w-10 h-10 bg-[#5856D6] rounded-xl flex items-center justify-center">
              <Activity className="text-white w-6 h-6" />
            </div>
            <span className="text-2xl font-bold tracking-tight">Kinexus</span>
          </div>
          <p className="text-gray-400 mb-8 leading-relaxed">
            We're not a software vendor. We're your transformation partner.
          </p>
        </div>
        
        <div>
          <h4 className="text-lg font-bold mb-6 text-white">Services</h4>
          <ul className="space-y-4 text-gray-400">
            {services.map(s => <li key={s.id}><button onClick={() => navigate('service', {id: s.id})} className="hover:text-white transition-colors">{s.name}</button></li>)}
          </ul>
        </div>

        <div>
          <h4 className="text-lg font-bold mb-6 text-white">Industries</h4>
          <ul className="space-y-4 text-gray-400">
            {industries.slice(0, 5).map(i => <li key={i.id}><button onClick={() => navigate('industry', {id: i.id})} className="hover:text-white transition-colors">{i.name}</button></li>)}
          </ul>
        </div>

        <div>
          <h4 className="text-lg font-bold mb-6 text-white">Let's Connect</h4>
          <p className="text-gray-400 mb-4">Pune, India • Global HQ</p>
          <p className="text-gray-400 mb-6">hello@kinexus.ai</p>
          <div className="flex space-x-4">
             <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#5856D6] cursor-pointer transition-colors"><Globe className="w-5 h-5" /></div>
          </div>
        </div>
      </div>
      
      <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
        <p>© 2026 Kinexus Enterprise AI. All rights reserved.</p>
        <div className="flex space-x-6 mt-4 md:mt-0">
          <button className="hover:text-white">Privacy</button>
          <button className="hover:text-white">Terms</button>
        </div>
      </div>
    </div>
  </footer>
);

// --- NEW COMPONENT: INDUSTRIES LISTING PAGE ---
const IndustriesPage = ({ navigate }) => {
  return (
    <div className="pt-32 pb-24 animate-fade-in bg-white">
      <div className="max-w-7xl mx-auto px-6 text-center mb-16">
        <div className="inline-flex items-center space-x-2 bg-[#E8E7FF] text-[#5856D6] px-4 py-2 rounded-full text-sm font-bold mb-6">
           <Globe className="w-4 h-4" />
           <span>Vertical Expertise</span>
        </div>
        <h1 className="text-5xl font-bold text-[#5856D6] mb-6">Industries We Transform</h1>
        <p className="text-xl text-[#212121] max-w-2xl mx-auto leading-relaxed">
          Deep, vertical-specific AI agents pre-trained on the nuances, compliance needs, and workflows of your sector.
        </p>
      </div>
      
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {industries.map(ind => (
          <div 
            key={ind.id} 
            onClick={() => navigate('industry', {id: ind.id})}
            className="bg-white border border-gray-100 p-8 rounded-2xl hover:shadow-card hover:-translate-y-1 hover:border-[#5856D6] transition-all duration-300 cursor-pointer group relative overflow-hidden"
          >
            {/* Hover Accent */}
            <div className="absolute top-0 right-0 bg-[#E8E7FF] w-32 h-32 rounded-bl-full -mr-10 -mt-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <div className="w-16 h-16 bg-[#F3F4F6] rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#5856D6] transition-colors relative z-10">
              <ind.icon className="w-8 h-8 text-[#5856D6] group-hover:text-white transition-colors" />
            </div>
            
            <h3 className="text-2xl font-bold text-[#212121] mb-3 relative z-10">{ind.name}</h3>
            <p className="text-[#6B6B6B] mb-8 leading-relaxed relative z-10">{ind.desc}</p>
            
            <div className="flex items-center text-[#5856D6] font-bold group-hover:text-[#2EC5CE] transition-colors relative z-10">
              <span>View Transformation</span>
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        ))}
      </div>

      <div className="max-w-4xl mx-auto mt-24 bg-[#212121] rounded-3xl p-12 text-center text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#5856D6] to-[#2EC5CE] opacity-10"></div>
        <h2 className="text-3xl font-bold mb-4 relative z-10">Don't see your industry?</h2>
        <p className="text-gray-300 mb-8 max-w-2xl mx-auto relative z-10">
          Our agentic core is adaptable. We serve many specialized verticals including Telecommunications, Media, and Public Sector.
        </p>
        <Button variant="primary" onClick={() => navigate('contact')} className="relative z-10">Contact an Industry Specialist</Button>
      </div>
    </div>
  );
};

// --- INDUSTRY PAGE COMPONENT (DYNAMIC) ---
const IndustryPage = ({ id, navigate }) => {
  const industryInfo = industries.find(i => i.id === id) || industries[0];
  const content = industryData[id] || industryData['manufacturing'];

  return (
    <div className="animate-fade-in pt-24">
      {/* Hero */}
      <section className="bg-white pt-20 pb-20 lg:pt-32 lg:pb-24 overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <Button variant="text" onClick={() => navigate('industries')} className="mb-8 pl-0 text-sm">
             ← Back to All Industries
          </Button>
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-[#E8E7FF] rounded-lg">
              <industryInfo.icon className="w-6 h-6 text-[#5856D6]" />
            </div>
            <span className="text-[#5856D6] font-bold uppercase tracking-wider text-sm">{industryInfo.name} Transformation</span>
          </div>
          <h1 className="text-[48px] lg:text-[64px] font-bold leading-tight mb-8 max-w-4xl text-[#212121]">
            {content.hero}
          </h1>
          <p className="text-[20px] lg:text-[24px] text-[#6B6B6B] max-w-3xl mb-12 leading-relaxed">
            {content.subhead}
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button onClick={() => navigate('contact')}>Start Your Transformation</Button>
            <Button variant="secondary" onClick={() => navigate('useCases')}>Explore Use Cases</Button>
          </div>
        </div>
        {/* Background Accent */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-[#E8E7FF] to-transparent opacity-50 z-0 pointer-events-none"></div>
      </section>

      {/* The Reality Check (Gap Analysis) */}
      <section className="py-24 bg-[#E8E7FF]">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeading title="The Reality Check" subtitle="Why traditional methods are failing your teams." centered />
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-10 rounded-2xl shadow-sm border border-transparent hover:border-[#5856D6] transition-all">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-6 text-red-500">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="text-[24px] font-bold mb-4 text-[#212121]">The Real Gap</h3>
              <p className="text-[#6B6B6B] text-[17px]">{content.gap}</p>
            </div>
            
            <div className="bg-white p-10 rounded-2xl shadow-sm border border-transparent hover:border-[#5856D6] transition-all">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-6 text-orange-500">
                <DollarSign className="w-6 h-6" />
              </div>
              <h3 className="text-[24px] font-bold mb-4 text-[#212121]">The Hidden Pain</h3>
              <p className="text-[#6B6B6B] text-[17px]">{content.pain}</p>
            </div>

            <div className="bg-[#212121] p-10 rounded-2xl shadow-xl text-white relative overflow-hidden">
               <div className="absolute top-0 right-0 w-24 h-24 bg-[#5856D6] opacity-20 rounded-full blur-2xl transform translate-x-1/2 -translate-y-1/2"></div>
              <div className="w-12 h-12 bg-[#5856D6] rounded-full flex items-center justify-center mb-6 text-white">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-[24px] font-bold mb-4 text-white">The Kinexus Difference</h3>
              <p className="text-gray-300 text-[17px]">{content.solution}</p>
            </div>
          </div>
        </div>
      </section>

      {/* High-Impact Use Cases */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeading title={`High-ROI Use Cases for ${industryInfo.name}`} subtitle="These aren't experiments. These are deployable, autonomous agents ready to work." />
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {content.useCases.map((uc, idx) => (
              <div key={idx} className="bg-white border border-gray-200 p-8 rounded-xl hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
                <div className="flex justify-between items-start mb-6">
                   <div className="p-3 bg-[#E8E7FF] rounded-lg group-hover:bg-[#5856D6] transition-colors">
                     <Workflow className="w-6 h-6 text-[#5856D6] group-hover:text-white transition-colors" />
                   </div>
                   <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-[#5856D6] transition-colors" />
                </div>
                <h3 className="text-[20px] font-bold mb-3 text-[#212121]">{uc.title}</h3>
                <p className="text-[#6B6B6B] text-[16px] leading-relaxed">{uc.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <p className="text-[20px] text-[#212121] mb-8 font-medium">Ready to see how these agents work in your environment?</p>
            <Button onClick={() => navigate('contact')}>Schedule a {industryInfo.name} Demo</Button>
          </div>
        </div>
      </section>
    </div>
  );
};

// --- HOME PAGE ---
const HomePage = ({ navigate }) => {
  return (
    <div className="animate-fade-in">
      {/* SECTION 1: HERO */}
      <section className="relative pt-40 pb-20 lg:pt-48 lg:pb-32 bg-gradient-to-b from-[#E8E7FF] to-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative z-10 grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h1 className="text-[56px] lg:text-[64px] font-bold leading-[1.1] mb-6 text-[#5856D6] tracking-tight">
              Your Teams Deserve Better Than Endless Manual Work
            </h1>
            <p className="text-[20px] lg:text-[22px] text-[#212121] mb-6 leading-relaxed">
              You've hired brilliant people. But they're drowning in repetitive tasks, fighting fragmented systems, and working late because "that's just how it is."
            </p>
            <p className="text-[20px] lg:text-[22px] text-[#212121] mb-10 leading-relaxed font-bold">
              It doesn't have to be this way.
            </p>
            <p className="text-[18px] text-[#6B6B6B] mb-10 leading-relaxed max-w-xl">
              Kinexus builds AI agents that take over the tedious work—so your people can focus on what actually moves your business forward. Real autonomy. Real results. Starting in 8-12 weeks.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mb-8">
              <Button onClick={() => navigate('contact')}>Let's Talk About Your Reality →</Button>
              <Button variant="secondary" onClick={() => {}} icon={PlayCircle}>See How It Works</Button>
            </div>
            <p className="text-sm text-[#6B6B6B] font-semibold">
              Trusted by ₹1000-5000 crore companies across 10 industries
            </p>
          </div>
          <div className="relative">
            {/* Isometric Illustration Mockup */}
            <div className="w-full aspect-square rounded-3xl bg-white shadow-card p-8 relative overflow-hidden flex items-center justify-center">
               <div className="absolute inset-0 bg-[#E8E7FF] opacity-30"></div>
               <div className="relative z-10 w-64 h-64">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-[#5856D6] rounded-2xl shadow-xl flex items-center justify-center transform -rotate-6 hover:rotate-0 transition-transform duration-500">
                    <Users className="w-12 h-12 text-white" />
                  </div>
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-[#2EC5CE] rounded-2xl shadow-lg flex items-center justify-center animate-bounce">
                    <Activity className="w-10 h-10 text-white" />
                  </div>
                  <div className="absolute bottom-0 right-0 w-24 h-24 bg-[#212121] rounded-2xl shadow-lg flex items-center justify-center animate-pulse">
                    <Settings className="w-10 h-10 text-white" />
                  </div>
                  <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{zIndex: -1}}>
                     <path d="M 50% 20% L 20% 80%" stroke="#5856D6" strokeWidth="2" strokeDasharray="4,4" />
                     <path d="M 50% 20% L 80% 80%" stroke="#5856D6" strokeWidth="2" strokeDasharray="4,4" />
                  </svg>
               </div>
               <div className="absolute bottom-6 w-full text-center text-[#6B6B6B] font-mono text-sm">
                 Autonomous Agents Orchestrating Workflow...
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: THE REALITY CHECK */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeading title="If This Sounds Familiar, You're in the Right Place" centered />
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-[#E8E7FF] p-10 rounded-2xl shadow-sm hover:shadow-card transition-all duration-300">
              <div className="text-6xl mb-6">😓</div>
              <h3 className="text-[28px] font-bold mb-4 text-[#5856D6]">Your Teams Are Tired</h3>
              <p className="text-[#212121] text-[18px]">They're working late. Again. Not because they're slow—but because manual processes eat their days. Document review. Data entry. It's soul-crushing, and everyone knows it.</p>
            </div>
            <div className="bg-[#E8E7FF] p-10 rounded-2xl shadow-sm hover:shadow-card transition-all duration-300">
              <div className="text-6xl mb-6">💸</div>
              <h3 className="text-[28px] font-bold mb-4 text-[#5856D6]">Your Costs Keep Climbing</h3>
              <p className="text-[#212121] text-[18px]">You've added headcount. Outsourced tasks. But OPEX still grows 10-15% year-over-year. Meanwhile, your competitors are moving faster. You feel it.</p>
            </div>
            <div className="bg-[#E8E7FF] p-10 rounded-2xl shadow-sm hover:shadow-card transition-all duration-300">
              <div className="text-6xl mb-6">🚫</div>
              <h3 className="text-[28px] font-bold mb-4 text-[#5856D6]">AI Pilots Haven't Worked</h3>
              <p className="text-[#212121] text-[18px]">You've tried "AI solutions." They promised magic. Delivered PowerPoints. Or maybe automated one tiny thing that broke later. You're skeptical now. We understand.</p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 7: INDUSTRIES (Refined Grid) */}
      <section className="py-24 bg-[#E8E7FF]">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeading title="We Speak Your Industry's Language" centered />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {industries.map(ind => (
              <div 
                key={ind.id} 
                onClick={() => navigate('industry', {id: ind.id})}
                className="bg-white rounded-xl p-6 hover:-translate-y-1 hover:shadow-lg transition-all duration-300 cursor-pointer group border border-transparent hover:border-[#2EC5CE]"
              >
                <div className="w-12 h-12 bg-[#F3F4F6] rounded-lg flex items-center justify-center mb-4 group-hover:bg-[#5856D6] transition-colors">
                  <ind.icon className="w-6 h-6 text-[#5856D6] group-hover:text-white transition-colors" />
                </div>
                <h4 className="font-bold text-[16px] mb-2">{ind.name}</h4>
                <p className="text-[14px] text-gray-500 leading-tight mb-4">{ind.desc}</p>
                <span className="text-[14px] font-bold text-[#2EC5CE] opacity-0 group-hover:opacity-100 transition-opacity">Explore Solutions →</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 8: FAQ */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <SectionHeading title="What People Usually Ask Us" />
          <Accordion items={faqs} />
        </div>
      </section>

      {/* SECTION 10: FINAL CTA */}
      <section className="py-32 bg-[#2EC5CE] text-center">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-[48px] font-bold text-white mb-6">Ready to Free Your Team from the Tedium?</h2>
          <p className="text-[24px] text-white/90 mb-10">Let's have an honest conversation about your reality.</p>
          <button className="bg-white text-[#2EC5CE] px-10 py-5 rounded-xl font-bold text-[20px] hover:bg-[#E8E7FF] hover:shadow-2xl hover:-translate-y-1 transition-all">
            Start the Conversation
          </button>
        </div>
      </section>
    </div>
  );
};

// --- SUBPAGES ---
const ServicesPage = ({ navigate }) => (
  <div className="pt-32 pb-24 animate-fade-in text-center">
    <h1 className="text-5xl font-bold text-[#5856D6] mb-8">Our Services</h1>
    <p className="text-xl max-w-2xl mx-auto">Full details on our transformation methodology, autonomous workflows, and integration capabilities.</p>
    <Button onClick={() => navigate('home')} className="mt-8">Return Home</Button>
  </div>
);

const UseCasesPage = ({ navigate }) => (
  <div className="pt-32 pb-24 animate-fade-in text-center">
    <h1 className="text-5xl font-bold text-[#5856D6] mb-8">Use Case Library</h1>
    <p className="text-xl max-w-2xl mx-auto">Explore 50+ pre-built agentic workflows.</p>
    <Button onClick={() => navigate('home')} className="mt-8">Return Home</Button>
  </div>
);

// --- MAIN APP CONTROLLER ---
export default function App() {
  const [currentView, setCurrentView] = useState('home');
  const [viewParams, setViewParams] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentView, viewParams]);

  const navigate = (view, params = null) => {
    setCurrentView(view);
    setViewParams(params);
  };

  const renderView = () => {
    switch (currentView) {
      case 'home': return <HomePage navigate={navigate} />;
      case 'industry': return <IndustryPage id={viewParams?.id} navigate={navigate} />;
      case 'industries': return <IndustriesPage navigate={navigate} />; 
      case 'services': return <ServicesPage navigate={navigate} />;
      case 'service': return <ServicesPage navigate={navigate} />;
      case 'useCases': return <UseCasesPage navigate={navigate} />;
      case 'contact': return <div className="pt-40 text-center"><h1 className="text-4xl">Contact Form</h1><Button onClick={() => navigate('home')}>Back</Button></div>;
      default: return <HomePage navigate={navigate} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <style>{styles}</style>
      <Navbar navigate={navigate} />
      <main className="flex-grow">
        {renderView()}
      </main>
      <Footer navigate={navigate} />
    </div>
  );
}
