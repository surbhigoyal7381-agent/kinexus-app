import React, { useState, useEffect, useRef, useMemo } from 'react';
import About from './pages/About';
import IndustryPage from './pages/IndustryPage';
// local hero assets
import heroManufacturing from './assets/hero-manufacturing.svg';
import heroLogistics from './assets/hero-logistics.svg';
import heroPharma from './assets/hero-pharma.svg';
import heroRealEstate from './assets/hero-real-estate.svg';
import heroRetail from './assets/hero-retail.svg';
import heroBanking from './assets/hero-banking.svg';
import heroInsurance from './assets/hero-insurance.svg';
import heroEnergy from './assets/hero-energy.svg';
import heroHealthcare from './assets/hero-healthcare.svg';
import heroHospitality from './assets/hero-hospitality.svg';
import heroEducation from './assets/hero-education.svg';
import BackToTop from './components/BackToTop';
import CaseCarousel from './components/CaseCarousel';
import { 
  ArrowRight, Activity, Clock, Shield, 
  Workflow, Zap, BarChart, CheckCircle2, Globe, Users, Settings, 
  Factory, Truck, Pill, Building, ShoppingCart, Landmark, 
  Lightbulb, GraduationCap, HeartPulse, Coffee, FileText, X,
  Search, PlayCircle, Download, HelpCircle, XCircle, DollarSign,
  Briefcase, Smile, AlertTriangle, Cpu, TrendingUp, Mail, Phone, 
  MapPin, Database, Sparkles, Filter, Maximize2, Battery, Signal, Plus
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
  @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
  .animate-fade-in { animation: fadeIn 0.45s ease-out forwards; }
  /* Parallax helpers */
  .parallax-root { scroll-behavior: smooth; }
  .parallax-section { position: relative; }
  .parallax-section:nth-child(odd) { background-attachment: fixed; background-size: cover; background-position: center; }
  .parallax-section:nth-child(even) { background-color: #ffffff; }
  .parallax-layer { position: absolute; inset: 0; pointer-events: none; z-index: 0; }
  .parallax-bg { position: absolute; inset: 0; pointer-events: none; z-index: 0; overflow: visible; }
  /* Fixed-sized centered bg strip that sits behind hero/CTA areas (Home) */
  .parallax-bg.strip { display: flex; justify-content: center; }
  .parallax-bg.strip .bg-image { position: absolute; left: 50%; top: calc(var(--nav-height) + 12px); transform: translateX(-50%) translateY(0); width: 100%; max-width: 1400px; height: 520px; background-size: cover; background-position: center; filter: saturate(1.05) contrast(1.03) blur(3px) brightness(0.98); transition: transform 0.08s linear; opacity: 0.44; z-index: 0; border-radius: 12px; pointer-events: none; }
  /* Full-page background layers for industry pages */
  .parallax-bg.fullpage { inset: 0; display: block; }
  .parallax-bg.fullpage .bg-image { position: absolute; inset: 0; width: 100%; height: 100%; background-size: cover; background-position: center; filter: saturate(1.02) contrast(1.02) blur(4px) brightness(0.95); transition: transform 0.12s linear; opacity: 0.22; pointer-events: none; }
  .parallax-bg.fullpage .bg-image.layer-top { opacity: 0.42; filter: saturate(1.05) contrast(1.03) blur(2px) brightness(0.98); }
  .parallax-layer .blob { position: absolute; border-radius: 9999px; filter: blur(40px); opacity: 0.45; }
  .parallax-content { position: relative; z-index: 10; }

  :root { --nav-height: 64px; }
  html, body, #root { height: 100%; }
  body { overflow: hidden; }
  .app-scroll { height: calc(100vh - var(--nav-height)); overflow-y: auto; -webkit-overflow-scrolling: touch; scroll-behavior: smooth; }
  /* reduce top padding so hero sits closer to fixed navbar */
  main.app-scroll { padding-top: calc(var(--nav-height) - 8px); }
`;

// --- INITIAL DATA SEEDING (THE "DATABASE") ---
// This data is used if localStorage is empty.

const INITIAL_INDUSTRIES = [
  { 
    id: 'manufacturing', name: 'Manufacturing', icon: 'Factory', 
    desc: 'Reduce downtime 40%, boost OEE 25%',
    backgrounds: ['hero-manufacturing.jpg','hero-manufacturing-800.jpg'],
    hero: "Stop Running Your Factory on Excel and Gut Feel.",
    heroSvg: heroManufacturing,
    subhead: "70% of production plans are outdated within 2 hours. Kinexus autonomous agents adapt to disruptions in real-time.",
    gap: "Most manufacturers rely on static, planner-dependent scheduling that can't adapt to real-world chaos.",
    pain: "Frequent rescheduling, underutilised capacity (8-12% loss), and material shortages.",
    solution: "An autonomous planning agent that reads ERP/MES data and recalibrates schedules instantly."
    ,customSections: [
      { title: 'Operational Resilience', body: 'We build agents that keep lines running during supply shocks and equipment failures by auto-resequencing and reallocating resources.' },
      { title: 'Quality at Scale', body: 'Agent-assisted inspection reduces human error and standardises deviation handling across plants.' }
    ]
  },
  { 
    id: 'logistics', name: 'Logistics', icon: 'Truck', 
    desc: 'Optimize routes, automate warehouses',
    hero: "Dispatch is Science, Not Art. Stop Guessing.",
    heroSvg: heroLogistics,
    subhead: "Inefficient dispatching increases costs by 12-18%. Let agents handle the complexity.",
    gap: "Dispatchers rely on gut feel. Truck allocation is reactive and rarely optimized.",
    pain: "Delayed dispatches, high freight costs, and wasted truck capacity.",
    solution: "Agents automate dispatch end-to-end—reading orders and SLAs to auto-assign resources."
    ,customSections: [
      { title: 'Dynamic Routing', body: 'Agents re-route fleets in real-time using traffic, ETA windows, and driver availability to cut fuel and improve on-time performance.' },
      { title: 'Warehouse Automation', body: 'Automated orchestration across WMS and TMS reduces manual handoffs and speeds throughput.' }
    ]
  },
  { id: 'pharma', name: 'Pharma', icon: 'Pill', desc: 'Automate clinical trials & compliance', hero: 'Paperwork is the Silent Killer of Pharma Agility.', heroSvg: heroPharma, subhead: 'Automate compliance, don\'t just digitise it.', gap: 'Batch records are manual and error-prone.', pain: 'Batch release delays and regulatory risk.', solution: 'Agents automate BMR/BPR end-to-end, reading logs to auto-fill records.', customSections: [{ title: 'Compliance Automation', body: 'We create auditable automation that reduces review cycles and enforces SOPs automatically.' }] },
  { id: 'real-estate', name: 'Real Estate', icon: 'Building', desc: 'Streamline project mgmt & procurement', hero: 'Build with Certainty.', heroSvg: heroRealEstate, subhead: 'Projects exceed timelines by 20-80%.', gap: 'Progress reporting is subjective.', pain: 'Cost overruns and overpayments.', solution: 'Agents analyse site photos to verify progress objectively.', customSections: [{ title: 'Photo-Based Verification', body: 'Agents compare images to project plans to validate progress and trigger payments only for verified work.' }] },
  { id: 'retail', name: 'Retail', icon: 'ShoppingCart', desc: 'Optimize inventory & dynamic pricing', hero: 'Retail is Detail. Automate it.', heroSvg: heroRetail, subhead: 'High volume means high inefficiency.', gap: 'Inventory managed by averages.', pain: 'Stockouts and overstock.', solution: 'Agents forecast demand at SKU level and adjust pricing.', customSections: [{ title: 'Node-Level Forecasting', body: 'Per-store, per-SKU forecasts and automated replenishment rules reduce lost sales and excess working capital.' }] },
  { id: 'banking', name: 'Banking', icon: 'Landmark', desc: 'Automate KYC & fraud detection', hero: 'Frictionless Banking.', heroSvg: heroBanking, subhead: 'Banks lose 20-40% of customers due to friction.', gap: 'KYC is manual.', pain: 'High drop-off rates and fraud.', solution: 'Agents read ID proofs and validate instantly.', customSections: [{ title: 'Secure & Compliant KYC', body: 'Automated document verification with audit trails and exception workflows reduces onboarding drop-off and compliance risk.' }] },
  { id: 'insurance', name: 'Insurance', icon: 'Shield', desc: 'Automate claims & underwriting', hero: 'Stop Paying for Leakage.', heroSvg: heroInsurance, subhead: 'Underwriting inefficiency reduces profitability.', gap: 'Underwriting is manual and slow.', pain: 'High claims leakage and slow issuance.', solution: 'Agents read reports to assess risk autonomously.', customSections: [{ title: 'Claims Automation', body: 'Fast triage and straight-through processing for routine claims with human-in-the-loop for exceptions.' }] },
  { id: 'energy', name: 'Energy', icon: 'Lightbulb', desc: 'Grid optimization & predictive maintenance', hero: 'Stabilize the Grid.', heroSvg: heroEnergy, subhead: 'Load forecasting errors cost millions.', gap: 'Static models miss real-time shifts.', pain: 'Peak load stress and grid instability.', solution: 'Agents forecast load using weather and consumption data.', customSections: [{ title: 'Predictive Maintenance', body: 'Sensors + agents detect early faults and schedule maintenance before failures.' }] },
  { id: 'healthcare', name: 'Healthcare', icon: 'HeartPulse', desc: 'Coordinate patient care & claims', hero: 'Let Clinicians Care.', heroSvg: heroHealthcare, subhead: 'Clinicians spend 40% time on paperwork.', gap: 'Intake is manual.', pain: 'Long wait times and burnout.', solution: 'Agents triage patients and generate notes.', customSections: [{ title: 'Clinical Triage', body: 'Automated triage routes cases to the right clinician and prepares succinct notes to reduce admin time.' }] },
  { id: 'hospitality', name: 'Hospitality', icon: 'Coffee', desc: 'Automate bookings & guest experience', hero: 'Turn Guests into Loyalists.', heroSvg: heroHospitality, subhead: 'Generic service leads to low loyalty.', gap: 'Guest data is siloed.', pain: 'Low repeat business.', solution: 'Agents build unified profiles to predict preferences.', customSections: [{ title: 'Personalised Guest Journeys', body: 'Agents manage preferences and personalise offers across stays to lift loyalty and RevPAR.' }] },
  { id: 'education', name: 'Education', icon: 'GraduationCap', desc: 'Automate student onboarding & scheduling', hero: 'Focus on Learning.', heroSvg: heroEducation, subhead: 'Admissions inefficiency loses applicants.', gap: 'Admissions are manual.', pain: 'Lost applicants and revenue.', solution: 'Agents score leads and optimise timetables.', customSections: [{ title: 'Admissions Optimisation', body: 'Automated lead scoring, scheduling and document verification to reduce lost applicants.' }] },
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
  ,
  // Healthcare
  { id: 'health-1', industry: 'Healthcare', icon: 'HeartPulse', title: 'Intelligent Patient Intake & Triage Agent', gap: 'Patient intake is still:\nManual and paper-heavy\nSlow and inconsistent\nDependent on front-desk staff\nNot integrated with EMR\nNot linked to clinical urgency\nProne to errors', pain: 'Long waiting times; Delayed diagnosis; Patient dissatisfaction; High staff workload; Inaccurate triage; Risk of adverse events.', solution: 'Kinexus agents triage patients intelligently: read symptoms, vitals and history, prioritise by urgency, auto-fill EMR, flag red flags and guide staff.', metrics: ['30% Less Wait Time', 'Better Clinical Safety'] },
  { id: 'health-2', industry: 'Healthcare', icon: 'FileText', title: 'Clinical Documentation & EMR Automation Agent', gap: 'Clinicians spend 30–40% of their time on documentation: notes typed manually, inconsistent templates, coding errors and slow EMR navigation.', pain: 'Reduced face time with patients; Clinician burnout; Inaccurate records; Billing errors and compliance risk.', solution: 'Kinexus agents generate clinical notes automatically, suggest ICD/CPT codes, update EMR and flag missing information to improve accuracy and reduce burden.', metrics: ['Reduced Burnout', 'Accurate Billing'] },
  { id: 'health-3', industry: 'Healthcare', icon: 'CalendarCheck', title: 'Appointment Scheduling & Capacity Optimisation', gap: 'Scheduling remains manual and disconnected from clinician availability or case complexity; not predictive.', pain: 'Long waiting lists; Idle clinician time; High no-show rates; Revenue leakage and operational inefficiency.', solution: 'Kinexus agents predict appointment duration, reduce no-shows, balance workload and recommend optimal slots while syncing with EMR.', metrics: ['10-25% Throughput Gain', 'Lower No-Shows'] },
  { id: 'health-4', industry: 'Healthcare', icon: 'Stethoscope', title: 'Diagnostic Reporting & Radiology Assistant', gap: 'Radiology reporting faces high backlogs, manual reviews and inconsistent quality with slow turnaround.', pain: 'Delayed clinical decisions; Radiologist burnout; Risk of missed findings.', solution: 'Kinexus agents assist radiologists by analysing scans, highlighting abnormalities, suggesting structured reports and flagging urgent findings.', metrics: ['Faster Diagnosis', 'Reduced Burnout'] },
  { id: 'health-5', industry: 'Healthcare', icon: 'BedDouble', title: 'Hospital Bed Management & Patient Flow', gap: 'Bed management is manual, spreadsheet-driven, not real-time and poorly linked to discharge planning or ED/ICU.', pain: 'ED overcrowding; Delayed admissions; Poor bed utilisation; High staff stress.', solution: 'Kinexus agents track bed availability in real time, predict discharges, recommend placements and flag bottlenecks to optimise flow.', metrics: ['Optimised Patient Flow', 'Reduced ED Overcrowding'] },

  // Hospitality
  { id: 'hosp-1', industry: 'Hospitality', icon: 'Coffee', title: 'Intelligent Guest Experience & Personalisation', gap: 'Hotels collect guest data but don\'t use it: preferences not captured consistently, no unified profile, and no real-time personalisation.', pain: 'Low repeat business; Weak loyalty; Missed upsells; Inconsistent service and negative reviews.', solution: 'Kinexus builds unified guest profiles, predicts preferences, triggers personalised outreach and recommends upsells while syncing with PMS and CRM.', metrics: ['↑ RevPAR', '↑ Repeat Guests'] },
  { id: 'hosp-2', industry: 'Hospitality', icon: 'DollarSign', title: 'Dynamic Pricing & Revenue Management', gap: 'Revenue management is manual, slow to react and not optimised for ancillary revenue.', pain: 'Suboptimal room rates; Low occupancy off-peak; Lost revenue during peaks.', solution: 'Kinexus analyses demand, events and competitor pricing to recommend optimal rates and distribution to maximise yield.', metrics: ['5-15% Revenue Uplift', 'Better Yield'] },
  { id: 'hosp-3', industry: 'Hospitality', icon: 'BedDouble', title: 'Housekeeping Productivity & Room Readiness', gap: 'Housekeeping coordination is manual and not aligned with check-in patterns or PMS status.', pain: 'Delayed room readiness; Guest dissatisfaction; High staff fatigue.', solution: 'Kinexus predicts room readiness, assigns tasks based on workload, optimises routes and syncs with PMS for timely check-ins.', metrics: ['Faster Turnaround', 'Higher Staff Productivity'] },
  { id: 'hosp-4', industry: 'Hospitality', icon: 'Coffee', title: 'F&B Demand Forecasting & Menu Optimisation', gap: 'F&B forecasting is manual; menu engineering is not data-driven and inventory is poorly aligned.', pain: 'Food wastage; Stockouts; Poor menu profitability.', solution: 'Kinexus forecasts demand by outlet and daypart, recommends menu engineering and aligns inventory to consumption to improve margins.', metrics: ['Lower Wastage', 'Higher F&B Profitability'] },
  { id: 'hosp-5', industry: 'Hospitality', icon: 'UserCheck', title: 'Front Desk Automation & Service Excellence', gap: 'Front desk workflows are manual, slow and error-prone, not integrated with guest profiles.', pain: 'Long check-in times; Inaccurate billing; Low upsell conversion.', solution: 'Kinexus auto-fills guest details, predicts needs, recommends upsells, flags VIPs and syncs with housekeeping/F&B/CRM to improve service.', metrics: ['Faster Check-in', 'Higher Upsell Conversion'] }
];

const CASE_STUDIES = [
  {
    title: '₹2000 Cr Manufacturing Company, Pune',
    challenge: 'Quality control was manual. 40% of inspection time wasted on paperwork.',
    solution: 'We deployed AI agents to automate QC documentation and defect routing.',
    metrics: ['35% reduction in inspection time','50% fewer defects','₹4.2 Cr annual savings'],
    quote: 'Our QC team used to work weekends to keep up. Now they leave at 5 PM and quality improved.'
  },
  {
    title: 'Large Logistics Fleet, Delhi',
    challenge: 'Dispatch scheduling caused late deliveries and idle trucks.',
    solution: 'Dynamic dispatch agents reduced empty miles and improved on-time performance.',
    metrics: ['18% fuel savings','99% SLA'],
    quote: 'We cut fuel costs and improved customer satisfaction overnight.'
  },
  {
    title: 'Regional Pharma Manufacturer',
    challenge: 'Batch record paperwork delayed releases.',
    solution: 'Agents auto-filled BMRs from equipment logs and QA checks.',
    metrics: ['40% faster release','Zero paperwork errors'],
    quote: 'Regulatory reviews are straightforward now — no surprises.'
  }
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
    const node = ref.current;
    if (node) observer.observe(node);
    return () => { if (node) observer.unobserve(node); };
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

const SectionHeading = ({ title, subtitle, centered = false, className = '' }) => {
  // allow `title` to be either a string (old behavior) or a React node
  const renderTitle = () => {
    if (typeof title === 'string') {
      const parts = String(title).trim().split(' ');
      const last = parts.pop();
      const first = parts.join(' ');
      return (
        <h2 className="text-[#212121] text-[22px] md:text-[34px] lg:text-[40px] leading-tight font-bold tracking-tight">
          {first && <span className="mr-2">{first}</span>}
          <span className="text-gradient">{last}</span>
        </h2>
      );
    }
    // if it's not a string, render whatever node was passed (allows custom highlighting)
    return (
      <h2 className="text-[#212121] text-[22px] md:text-[34px] lg:text-[40px] leading-tight font-bold tracking-tight">
        {title}
      </h2>
    );
  };

  return (
    <ScrollReveal className={`mb-4 ${className} ${centered ? 'text-center' : ''}`}>
      <div className={`mb-2 ${centered ? 'flex flex-col items-center' : ''}`}>
        {renderTitle()}
      </div>
      {subtitle && <p className="text-[14px] md:text-[16px] text-[#4B5563] max-w-3xl mx-auto leading-relaxed">{subtitle}</p>}
    </ScrollReveal>
  );
};

// ParallaxPage was removed — site uses separate pages and sections now.

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
    <div className="min-h-screen bg-white pt-16 pb-16 relative overflow-hidden bg-grid-pattern animate-fade-in-up">
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

// `IndustryPage` is provided as a separate file at `src/pages/IndustryPage.js`.

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
    <div className="pt-24 pb-16 px-6 min-h-screen bg-gray-100 animate-fade-in">
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
    const scroller = document.querySelector('.app-scroll');
    if (scroller) scroller.scrollTo({ top: 0, left: 0 });
    else window.scrollTo(0, 0);
  }, [currentView, viewParams]);

  // parallax state
  const [scrollY, setScrollY] = useState(0);
  const mainRef = useRef(null);
  // support multiple background layers
  const [bgUrls, setBgUrls] = useState([]);

  const navigate = (view, params = null) => {
    setCurrentView(view);
    setViewParams(params);
  };

  // pick the best available background image variant for the current view
  useEffect(() => {
    let mounted = true;
    (async () => {
      const tryUrls = async (urls) => {
        for (const u of urls) {
          try {
            const res = await fetch(u, { method: 'HEAD' });
            if (res.ok) return u;
          } catch (e) {
            // ignore and try next
          }
        }
        return null;
      };

        if (currentView === 'industry' && viewParams?.id) {
          const id = viewParams.id;
          // look up industry record to see if multiple backgrounds are defined
          const industry = industries.find(it => it.id === id);
          if (industry && Array.isArray(industry.backgrounds) && industry.backgrounds.length) {
            const results = [];
            for (const bg of industry.backgrounds) {
              // allow either full path or id-like name
              const base = bg.startsWith('/') ? bg : `/assets/${bg}`;
              const candidates = [
                `${base.replace(/\.jpg$/, '')}-1600.jpg`,
                `${base.replace(/\.jpg$/, '')}-1200.jpg`,
                `${base.replace(/\.jpg$/, '')}-800.jpg`,
                `${base.replace(/\.jpg$/, '')}-480.jpg`,
                base
              ];
              const found = await tryUrls(candidates);
              results.push(found || null);
            }
            if (mounted) { console.debug('parallax: industry multi-bg found', results); setBgUrls(results.filter(Boolean)); }
            return;
          }

          const candidates = [
            `/assets/hero-${id}-1600.jpg`,
            `/assets/hero-${id}-1200.jpg`,
            `/assets/hero-${id}-800.jpg`,
            `/assets/hero-${id}-480.jpg`,
            `/assets/hero-${id}.jpg`
          ];
          // build layered set from available variants (largest -> smallest)
          const available = [];
          for (const u of candidates) {
            try {
              const res = await fetch(u, { method: 'HEAD' });
              if (res.ok) available.push(u);
            } catch (e) {
              // ignore
            }
          }
          if (mounted) { console.debug('parallax: industry bg layers', available); setBgUrls(available); }
          return;
        }

      if (currentView === 'home') {
        // pick the section in view that has `data-bg` set
        try {
          const root = mainRef.current;
          if (root) {
            const sections = Array.from(root.querySelectorAll('.home-section[data-bg]'));
            // find first section whose bounding rect intersects the viewport center
            const viewportHeight = root.clientHeight || window.innerHeight;
            const centerY = viewportHeight * 0.45;
            let chosen = null;
            for (const s of sections) {
              const rect = s.getBoundingClientRect();
              // rect is relative to viewport; adjust if scroller is not window
              const top = rect.top;
              const bottom = rect.bottom;
              if (top <= centerY && bottom >= centerY) { chosen = s; break; }
            }
            if (!chosen && sections.length) chosen = sections[0];
            if (chosen) {
              const bg = chosen.getAttribute('data-bg');
              // prefer high-res variants if available
              const idMatch = bg && bg.match(/hero-([a-zA-Z0-9-]+)(?:-\d+)?\.jpg$/);
              if (idMatch) {
                const id = idMatch[1];
                const candidates = [`/assets/hero-${id}-1600.jpg`,`/assets/hero-${id}-1200.jpg`,`/assets/hero-${id}-800.jpg`,`/assets/hero-${id}-480.jpg`, `/assets/hero-${id}.jpg`];
                const found = await tryUrls(candidates);
                if (mounted) { console.debug('parallax: home section bg found', found); setBgUrls(found ? [found] : []); }
                return;
              }
              if (mounted) { console.debug('parallax: home section bg (raw)', bg); setBgUrls(bg ? [bg] : []); }
              return;
            }
          }
        } catch (e) {
          // fallback to static retail hero
        }
        const candidates = ['/assets/hero-retail-1600.jpg','/assets/hero-retail-1200.jpg','/assets/hero-retail.jpg'];
        const found = await tryUrls(candidates);
        if (mounted) { console.debug('parallax: fallback bg found', found); setBgUrls(found ? [found] : []); }
        return;
      }

      if (mounted) setBgUrls([]);
    })();
    return () => { mounted = false; };
  }, [currentView, viewParams, industries]);

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
      case 'useCases': return <UseCasesPage navigate={navigate} useCases={useCases} industries={industries} initialIndustry={viewParams?.industry} />;
      case 'contact': return <ContactPage navigate={navigate} />;
      case 'about': return <About navigate={navigate} />;
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

  // bgUrl is computed by effect; default null

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <style>{styles}</style>
      <Navbar navigate={navigate} />
      <main ref={mainRef} onScroll={(e) => setScrollY(e.target.scrollTop)} className="flex-grow app-scroll no-scrollbar relative">
        {/* Parallax background: only show the centered strip on Home; hide on industry pages */}
        {currentView === 'home' ? (
          <div className={`parallax-bg strip`} aria-hidden>
            {bgUrls && bgUrls.length > 0 ? (
              bgUrls.map((u, i) => {
                const depth = 0.15 + (i * 0.02);
                const transform = `translateX(-50%) translateY(${Math.round(scrollY * depth)}px)`;
                const className = `bg-image`;
                return <div key={`bg-${i}`} className={className} style={{ backgroundImage: `url(${u})`, transform }} />;
              })
            ) : null}
          </div>
        ) : (
          <div className="parallax-bg" aria-hidden />
        )}

        <div className="parallax-content relative z-10">
          {renderView()}
        </div>
      </main>
      <Footer navigate={navigate} />
      <BackToTop />
    </div>
  );
}

// --- SUB-COMPONENTS (Simplified for space, functionality remains) ---
// Note: HomePage, IndustriesPage, ServicesPage, ContactPage, Navbar, Footer
// These components are reused from previous logic but receive 'navigate' prop.
// Below are the essential ones needed for context.

const HomePage = ({ navigate }) => {

  return (
    <div className="animate-fade-in bg-white overflow-x-hidden">
      <section className="home-section relative pt-0 pb-8 lg:pt-0 lg:pb-12 overflow-hidden bg-grid-pattern" data-bg="/assets/hero-retail-1600.jpg">
        <div className="absolute top-20 right-0 w-[600px] h-[600px] bg-[#E8E7FF] rounded-full mix-blend-multiply filter blur-[120px] opacity-40 animate-blob"></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10 grid lg:grid-cols-2 gap-16 items-center">
          <ScrollReveal>
            <div className="inline-flex items-center space-x-2 bg-white/50 backdrop-blur-sm border border-purple-100 text-[#5856D6] px-4 py-2 rounded-full text-sm font-bold -mt-2 mb-3 shadow-sm">
               <Zap className="w-4 h-4 fill-current" /><span>Enterprise Agentic AI Platform</span>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold leading-[1.12] mb-4 text-[#212121] tracking-tight">Your Teams Deserve Better Than <span className="text-gradient">Endless Manual Work</span></h1>
            <p className="text-base text-[#6B6B6B] mb-8 leading-relaxed max-w-xl">Kinexus builds AI agents that take over the tedious work—so your people can focus on what actually moves your business forward. Real autonomy. Real results.</p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mb-8">
              <Button onClick={() => navigate('contact')} icon={ArrowRight}>Let's Talk About Your Reality</Button>
              <Button variant="secondary" onClick={() => navigate('useCases')} icon={PlayCircle}>Explore Use Cases</Button>
            </div>
          </ScrollReveal>
          <div className="relative"><div className="w-full aspect-square relative flex items-center justify-center"><div className="absolute inset-0 bg-gradient-to-tr from-[#E8E7FF] to-white rounded-full opacity-30 blur-3xl"></div><Activity className="w-32 h-32 text-[#5856D6] animate-float" /></div></div>
        </div>
      </section>

      {/* Reality Check */}
      <section className="home-section py-12 bg-white" data-bg="/assets/hero-manufacturing-1600.jpg">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeading className="-mt-6" title={<>If This Sounds Familiar, You're in the <span className="text-gradient">Right</span> <span className="text-gradient">Place</span></>} />
          <div className="grid md:grid-cols-3 gap-6 mt-8">
            <div className="p-6 rounded-2xl bg-[#F7F5FF]">
              <h4 className="font-bold text-lg mb-2">Your Teams Are Tired</h4>
              <p className="text-gray-600">They're working late not because they're slow—but because manual processes eat their days.</p>
            </div>
            <div className="p-6 rounded-2xl bg-[#FFF7F0]">
              <h4 className="font-bold text-lg mb-2">Your Costs Keep Climbing</h4>
              <p className="text-gray-600">Headcount and tools didn't reduce operating costs — you need smarter workflows.</p>
            </div>
            <div className="p-6 rounded-2xl bg-[#F0FFF7]">
              <h4 className="font-bold text-lg mb-2">AI Pilots Haven't Worked</h4>
              <p className="text-gray-600">Too many pilots deliver slides, not working agents that actually run your operations.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How We Work (Timeline) */}
      <section className="home-section py-6 bg-[#F8F9FF]" data-bg="/assets/hero-logistics-1600.jpg">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeading title="Here's What Happens When You Work With Kinexus" />
          <div className="mt-3">
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3 items-start">
              {[
                {
                  step: 'Week 1-2',
                  title: 'We Study Your Reality',
                  desc: 'We embed with your teams, observe actual workflows, interview stakeholders, and map systems and data flows to identify root causes, constraints, and quick-win automation opportunities.'
                },
                {
                  step: 'Week 3-4',
                  title: 'We Pick the Right Battle',
                  desc: 'We analyze impact vs complexity, prioritize 2–3 workflows with measurable ROI, define success metrics and acceptance criteria, and align stakeholders on a rapid pilot plan.'
                },
                {
                  step: 'Week 5-12',
                  title: 'We Build Your First Agent',
                  desc: 'We design, integrate, and iterate a production-ready agent that automates end-to-end tasks, including integrations, validation, error handling, and user feedback loops; we pilot with real users and refine.'
                },
                {
                  step: 'Month 3-6',
                  title: 'We Scale What Works',
                  desc: 'We expand proven agents across teams and systems, harden reliability and performance, onboard operators, and establish monitoring, governance, and deployment practices for wider rollout.'
                },
                {
                  step: 'Ongoing',
                  title: 'We Stay With You',
                  desc: 'We operate and continuously improve your agents—monitoring outcomes, retraining models, adding capabilities, and providing SLA-backed support and quarterly roadmaps to sustain value.'
                }
              ].map((t, i) => (
                <div key={i} className="bg-white p-4 rounded-xl shadow-sm flex flex-col items-start text-left">
                  <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[#E8E7FF] text-[#5856D6] font-bold text-sm mb-2">{i+1}</div>
                  <div className="text-xs text-gray-500 mb-1">{t.step}</div>
                  <div className="font-semibold text-sm md:text-base text-[#212121] mb-1">{t.title}</div>
                  <div className="text-sm text-gray-600 leading-tight">{t.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Who This Isn't For */}
      <section className="home-section py-12 bg-white" data-bg="/assets/hero-banking-1600.jpg">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <SectionHeading title="Let's Be Honest: Kinexus Isn't for Everyone" />
          <p className="text-[#212121] text-lg max-w-3xl mx-auto mb-4">If you're looking for a cheap chatbot, we're not your people. If you expect magic without investment, this won't work. If your team isn't ready for change, it's too early. But if you're tired of throwing people at problems that AI should solve—if you're ready to invest seriously in transformation—then yes, let's talk.</p>
          <p className="text-sm text-gray-500 italic mb-6">We work with manufacturing, logistics, pharma, banking, retail, real estate, energy, education, healthcare, hospitality, and insurance companies.</p>
          <div className="flex justify-center"><Button onClick={() => navigate('contact')}>I Want to Explore This for My Company →</Button></div>
        </div>
      </section>

      {/* Real Results (Case Cards) */}
      <section className="home-section py-6 bg-[#F8F9FF]" data-bg="/assets/hero-energy-1600.jpg">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeading title="It's Not Theory. It's Working Right Now." />
          <div className="mt-4">
            <CaseCarousel items={CASE_STUDIES} />
          </div>
        </div>
      </section>

      {/* What Makes Us Different */}
      <section className="home-section py-20 bg-white" data-bg="/assets/hero-education-1600.jpg">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeading title="Why Companies Choose Kinexus Over Point Solutions" />
          <div className="mt-8 grid md:grid-cols-2 gap-6">
            <div className="bg-gray-50 p-8 rounded-2xl">
              <h4 className="font-bold mb-4 text-gray-700">Most 'AI' Solutions</h4>
              <ul className="space-y-3 text-gray-600">
                <li>Automate one task</li>
                <li>You integrate it yourself</li>
                <li>Generic AI models</li>
                <li>Works in isolation</li>
                <li>They disappear after sale</li>
              </ul>
            </div>
            <div className="bg-gradient-to-br from-[#5856D6] to-[#2EC5CE] p-8 rounded-2xl text-white">
              <h4 className="font-bold mb-4">Kinexus</h4>
              <ul className="space-y-3">
                <li>Transform entire workflows</li>
                <li>We handle integrations</li>
                <li>Custom agents for your industry</li>
                <li>Agents collaborate autonomously</li>
                <li>We stay and maintain — long term partner</li>
              </ul>
            </div>
          </div>
          <p className="text-center text-sm text-gray-600 mt-6">*Terms apply. Based on 12-month transformation engagements.</p>
        </div>
      </section>

      {/* Results & Industries & FAQ */}
      <section className="home-section py-20 bg-white" data-bg="/assets/hero-healthcare-1600.jpg">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeading title="It's Not Theory. It's Working Right Now." />
          <div className="grid md:grid-cols-3 gap-6 mt-8">
            <div className="p-6 rounded-2xl bg-[#E8F7FF]">
              <div className="text-3xl font-extrabold">35%</div>
              <div className="text-sm text-gray-600">Reduction in inspection time</div>
            </div>
            <div className="p-6 rounded-2xl bg-[#FFF4F0]">
              <div className="text-3xl font-extrabold">50%</div>
              <div className="text-sm text-gray-600">Fewer defects reaching customers</div>
            </div>
            <div className="p-6 rounded-2xl bg-[#F0FFF7]">
              <div className="text-3xl font-extrabold">10x</div>
              <div className="text-sm text-gray-600">Typical ROI within 24 months</div>
            </div>
          </div>

          <div className="mt-12">
            <SectionHeading title="Industries We Transform" />
            <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
              {INITIAL_INDUSTRIES.map(ind => (
                <div key={ind.id} onClick={() => navigate('industry', { id: ind.id })} className="p-6 border rounded-2xl hover:shadow-lg cursor-pointer">
                  <div className="font-bold text-lg mb-2">{ind.name}</div>
                  <div className="text-sm text-gray-600">{ind.desc}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-12">
            <SectionHeading title="The Answer Is Yes." subtitle="We do the heavy lifting — integrations, operations, and measurable outcomes." centered />
            <p className="text-gray-600 max-w-3xl mx-auto text-sm mb-6">You can deploy agentic automation in real operations without heroic data projects. Below are the guarantees we offer when we work together.</p>

            <div className="mt-6 grid gap-6 md:grid-cols-3">
              <div className="p-6 rounded-2xl bg-white/90 border shadow-sm text-left">
                <h4 className="font-semibold text-lg mb-2">We integrate with your systems</h4>
                <p className="text-gray-600 text-sm">ERP, MES, WMS, CRMs — agents orchestrate across your stack without replacing it.</p>
              </div>

              <div className="p-6 rounded-2xl bg-white/90 border shadow-sm text-left">
                <h4 className="font-semibold text-lg mb-2">Pilot to production</h4>
                <p className="text-gray-600 text-sm">Fast pilots that demonstrate impact in 8–12 weeks and production rollouts that scale reliably.</p>
              </div>

              <div className="p-6 rounded-2xl bg-white/90 border shadow-sm text-left">
                <h4 className="font-semibold text-lg mb-2">We operate with you</h4>
                <p className="text-gray-600 text-sm">Monitoring, governance, and SLA-backed operations — we stay until outcomes are repeatable.</p>
              </div>

              <div className="p-6 rounded-2xl bg-white/90 border shadow-sm text-left">
                <h4 className="font-semibold text-lg mb-2">Security & compliance</h4>
                <p className="text-gray-600 text-sm">Audit trails, role-based controls, and privacy-first integrations are standard in every deployment.</p>
              </div>

              <div className="p-6 rounded-2xl bg-white/90 border shadow-sm text-left">
                <h4 className="font-semibold text-lg mb-2">Human-in-the-loop</h4>
                <p className="text-gray-600 text-sm">We design decision gates so humans retain control where necessary, with rich context and suggested actions.</p>
              </div>

              <div className="p-6 rounded-2xl bg-white/90 border shadow-sm text-left">
                <h4 className="font-semibold text-lg mb-2">Measurable ROI</h4>
                <p className="text-gray-600 text-sm">Throughput, cost, and quality metrics tracked from day one — so you see the value in dollars and time saved.</p>
              </div>
            </div>
            <div className="mt-8 flex justify-center"><Button onClick={() => navigate('contact')}>Talk with an Engineer →</Button></div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="home-section py-12 bg-[#2EC5CE] text-white" data-bg="/assets/hero-hospitality-1600.jpg">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Free Your Team from the Tedium?</h2>
          <p className="mb-6">Let's have an honest conversation about your reality.</p>
          <Button onClick={() => navigate('contact')} className="bg-white text-[#2EC5CE]">Start the Conversation</Button>
        </div>
      </section>
    </div>
  );
};

const IndustriesPage = ({ navigate, industries }) => (
  <div className="pt-16 pb-10 animate-fade-in-up bg-white min-h-screen bg-grid-pattern">
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
  <div className="pt-16 pb-12 animate-fade-in-up text-center min-h-screen bg-grid-pattern">
    <h1 className="text-3xl font-semibold text-[#212121] mb-6">Our <span className="text-gradient">Services</span></h1>
    <div className="max-w-7xl mx-auto px-6 mt-8">
      <div className="grid md:grid-cols-3 gap-8">
        {[
          { id: 'ai-readiness', name: 'AI Readiness Audit', desc: 'We assess your data, systems and processes to create a clear roadmap for agentic transformation.', bullets: ['Data maturity review', 'Systems & API map', 'Roadmap & quick wins'] },
          { id: 'pilot-production', name: 'Pilot → Production', desc: 'Fast pilots (8–12 weeks) that transition to hardened production agents with monitoring and SLAs.', bullets: ['Prototype agent', 'Operationalize & harden', 'Runbooks & SLAs'] },
          { id: 'integration', name: 'Systems Integration & Orchestration', desc: 'We connect ERP, MES, TMS and legacy systems so agents can act across your stack.', bullets: ['API connectors', 'UI automation fallbacks', 'Event orchestration'] },
          { id: 'agent-design', name: 'Agentic Workflow Design', desc: 'Design and build autonomous agents that make decisions, not just move data.', bullets: ['Decision modeling', 'Human-in-the-loop flows', 'Monitoring hooks'] },
          { id: 'governance', name: 'Governance & Security', desc: 'Security-first delivery: audit trails, access controls, and compliance (SOC2/ISO/GDPR).', bullets: ['Audit logs & traceability', 'Access controls', 'Compliance packaging'] },
          { id: 'training', name: 'Change & Adoption', desc: 'Role-based training, playbooks and ops-runbooks to embed agents into daily work.', bullets: ['Operator playbooks', 'Hands-on workshops', 'Adoption metrics'] }
        ].map(s => (
          <div key={s.id} className="glass-card p-8 rounded-3xl hover-lift text-left">
            <div className="mb-4">
              <div className="w-12 h-12 bg-[#E8E7FF] rounded-lg flex items-center justify-center text-[#5856D6] font-bold">{s.name.split(' ').map(w => w[0]).slice(0,2).join('')}</div>
            </div>
            <h3 className="text-xl font-bold mb-2 text-[#212121]">{s.name}</h3>
            <p className="text-gray-600 mb-3">{s.desc}</p>
            <ul className="text-sm text-gray-600 list-disc list-inside space-y-1">
              {s.bullets.map((b, i) => <li key={i}>{b}</li>)}
            </ul>
          </div>
        ))}
      </div>
      <div className="mt-12 text-center">
        <Button onClick={() => navigate('contact')}>Book an AI Readiness Audit</Button>
      </div>
    </div>
  </div>
);

const ContactPage = ({ navigate }) => {
  const [formData, setFormData] = useState({ name: '', email: '', company: '', message: '' });
  const [status, setStatus] = useState('idle');
  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus('submitting');
    setTimeout(() => {
      // simulate submit success
      setStatus('sent');
      setFormData({ name: '', email: '', company: '', message: '' });
    }, 800);
  };
  return (
    <div className="pt-16 pb-16 min-h-screen bg-white animate-fade-in-up">
      <div className="max-w-3xl mx-auto px-6">
        <SectionHeading title="Contact Us" subtitle="Start a conversation — we'll respond within 48 hours." centered />
        <form onSubmit={handleSubmit} className="space-y-4 mt-8">
          <input required placeholder="Full name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full border p-3 rounded-lg" />
          <input required type="email" placeholder="Email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full border p-3 rounded-lg" />
          <input placeholder="Company" value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})} className="w-full border p-3 rounded-lg" />
          <textarea placeholder="Tell us about your challenge" required value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} className="w-full border p-3 rounded-lg h-36" />
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-500">{status === 'submitting' ? 'Sending…' : status === 'sent' ? 'Thanks — we will be in touch.' : ''}</div>
            <Button type="submit" disabled={status === 'submitting'}>Send Message</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

// --- NAVBAR & FOOTER ---
const Navbar = ({ navigate }) => {
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    const scroller = document.querySelector('.app-scroll') || window;
    lastY.current = scroller === window ? window.scrollY : scroller.scrollTop;
    let ticking = false;
    const onScroll = () => {
      const y = scroller === window ? window.scrollY : scroller.scrollTop;
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (y > lastY.current && y > 100) setHidden(true); // scrolling down
          else setHidden(false); // scrolling up or near top
          lastY.current = y;
          ticking = false;
        });
        ticking = true;
      }
    };
    scroller.addEventListener('scroll', onScroll, { passive: true });
    return () => scroller.removeEventListener('scroll', onScroll);
  }, []);

  // Show navbar when mouse moves near the top on desktop
  useEffect(() => {
    const onMove = (e) => {
      try {
        if (window.innerWidth >= 768 && e.clientY <= 80) {
          setHidden(false);
        }
      } catch (err) {
        // ignore
      }
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  // simple page navigation (no parallax scrolling)
  const goTo = (view) => navigate(view);

  return (
    <nav className={`fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-md shadow-md z-50 transform transition-transform duration-300 ${hidden ? '-translate-y-full' : 'translate-y-0'}`}>
      <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
        <div className="text-xl font-bold cursor-pointer" onClick={() => goTo('home')}>Kinexus</div>
        <div className="space-x-6 hidden md:flex">
          <button onClick={() => goTo('home')} className="text-black hover:text-[#5856D6]">Home</button>
          <button onClick={() => goTo('services')} className="text-black hover:text-[#5856D6]">Services</button>
          <button onClick={() => goTo('industries')} className="text-black hover:text-[#5856D6]">Industries</button>
          <button onClick={() => goTo('useCases')} className="text-black hover:text-[#5856D6]">Use Cases</button>
          <button onClick={() => goTo('about')} className="text-black hover:text-[#5856D6]">About</button>
          <button onClick={() => goTo('contact')} className="bg-[#25a8b0] text-white px-4 py-2 rounded-lg hover:bg-[#1e8b98]">Contact</button>
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
