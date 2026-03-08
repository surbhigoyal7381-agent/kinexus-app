import React, { useState, useEffect, useRef, useMemo } from 'react';
import ReactDOM from 'react-dom';
import About from './pages/About';
import IndustryPage from './pages/IndustryPage';
import ROIPage from './pages/ROIPage';
import ExternalUseCasesPage from './pages/UseCasesPage';
import BlogAdminPage from './pages/BlogAdminPage';
import AdminHub from './pages/AdminHub';
import AdminGate from './pages/AdminGate';
// local hero assets
import heroManufacturing from './assets/hero-manufacturing.svg';
import heroLogistics from './assets/hero-logistics.svg';
import heroPharma from './assets/hero-pharma.svg';
import heroRealEstate from './assets/hero-real-estate.svg';
import heroRetail from './assets/hero-retail.svg';
import heroEnergy from './assets/hero-energy.svg';
import heroHospitality from './assets/hero-hospitality.svg';
import heroEducation from './assets/hero-education.svg';
import kinexusHero from './assets/kinexus-hero.png';
import BackToTop from './components/BackToTop';
import CaseCarousel from './components/CaseCarousel';
import { 
  ArrowRight, Activity, Clock, Shield, 
  Workflow, Zap, BarChart, CheckCircle2, Globe, Users, Settings, 
  Factory, Truck, Pill, Building, ShoppingCart, Landmark, 
  Lightbulb, GraduationCap, HeartPulse, Coffee, FileText, X,
  Search, PlayCircle, Download, HelpCircle, XCircle, DollarSign,
  Briefcase, Smile, AlertTriangle, Cpu, TrendingUp, Mail, Phone, 
  MapPin, Database, Sparkles, Filter, Maximize2, Battery, Signal, Plus,
  ChevronDown, ChevronUp
} from 'lucide-react';

// Rich text editor
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

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
    --nav-height: 64px;
    --hero-offset: var(--nav-height);
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

  /* make sizing predictable and avoid unexpected overflow */
  *, *:before, *:after { box-sizing: border-box; }

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

  /* Professional subtle float used for hero/industry imagery */
  @keyframes subtleFloat {
    0% { transform: translateY(0px) scale(1); }
    50% { transform: translateY(-8px) scale(1.01); }
    100% { transform: translateY(0px) scale(1); }
  }
  .animate-subtle-float { animation: subtleFloat 6s ease-in-out infinite; }

  .img-professional { transition: transform 0.45s cubic-bezier(0.2,0.9,0.2,1), box-shadow 0.3s; }
  .img-professional:hover { transform: translateY(-6px) scale(1.03); box-shadow: 0 20px 40px rgba(0,0,0,0.08); }
  .down-arrow { position: absolute; left: 50%; bottom: 20px; transform: translateX(-50%); width: 44px; height: 44px; background: rgba(255,255,255,0.66); backdrop-filter: blur(6px); border-radius: 9999px; display: flex; align-items: center; justify-content: center; color: #5856D6; box-shadow: 0 8px 20px rgba(17,24,39,0.06); border: 1px solid rgba(88,86,214,0.06); z-index: 60; }
  .down-arrow svg { display: block; transform-origin: center; animation: downBounce 1.6s infinite; width: 20px; height: 20px; }
  @keyframes downBounce {
    0% { transform: translateY(0); opacity: 0.95; }
    50% { transform: translateY(6px); opacity: 0.6; }
    100% { transform: translateY(0); opacity: 0.95; }
  }
  /* down-arrow remains stationary; horizontal float removed for accessibility */

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
  /* reduce vertical spacing between major sections on Home */
  .parallax-section { padding-top: 12pt; padding-bottom: 12pt; }
  /* Normalize home-section vertical spacing and add more separation between sections */
  .home-section { padding-top: 24pt !important; padding-bottom: 24pt !important; margin-bottom: 12pt; }
  /* ensure the first (Hero) home section sits below the fixed navbar — locked to --hero-offset */
  main.app-scroll .home-section:first-of-type { padding-top: var(--hero-offset) !important; }
  /* ensure sections can host an absolute-positioned down button */
  .home-section, .parallax-content section { position: relative; }

  /* per-section down button */
  .section-down-btn { position: absolute; right: 20px; bottom: 20px; width: 44px; height: 44px; background: rgba(255,255,255,0.66); backdrop-filter: blur(6px); border-radius: 9999px; display: flex; align-items: center; justify-content: center; color: #5856D6; box-shadow: 0 8px 20px rgba(17,24,39,0.06); border: 1px solid rgba(88,86,214,0.06); cursor: pointer; z-index: 60; animation: pulseArrow 3s infinite; transition: transform 0.24s ease, box-shadow 0.24s ease; }
  .section-down-btn:hover { transform: translateY(-4px) scale(1.02); box-shadow: 0 14px 28px rgba(17,24,39,0.08); }
  @keyframes pulseArrow { 0% { transform: translateY(0) scale(1); opacity: 0.96; } 50% { transform: translateY(-3px) scale(1.02); opacity: 0.9; } 100% { transform: translateY(0) scale(1); opacity: 0.96; } }
  .section-down-btn svg { width: 20px; height: 20px; display: block; }
  .section-down-btn:focus { outline: 2px solid rgba(88,86,214,0.18); outline-offset: 2px; }
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

  /* nav height already declared in :root above */
  html, body, #root { height: 100%; }
  /* prevent horizontal overflow while using an internal vertical scroller */
  body { overflow-x: hidden; }
  .app-scroll { height: calc(100vh - var(--nav-height)); overflow-y: auto; -webkit-overflow-scrolling: touch; scroll-behavior: smooth; }
  /* reduce top padding so hero sits closer to fixed navbar */
  main.app-scroll { padding-top: 0pt; }
`;

/* Blog-specific enhancements */
const blogStyles = `
  .blog-hero { border-radius: 12px; overflow: hidden; position: relative; }
  .blog-hero img { width: 100%; height: 420px; object-fit: cover; display: block; }
  .blog-hero .overlay { position: absolute; inset: 0; background: linear-gradient(180deg, rgba(0,0,0,0.35), rgba(0,0,0,0.55)); }
  .blog-hero .meta { position: absolute; left: 32px; bottom: 28px; z-index: 20; color: white; max-width: 70%; }
  .blog-hero .meta h1 { font-size: 32px; line-height: 1.08; margin: 0 0 8px 0; }
  .blog-meta-row { display:flex; gap:12px; align-items:center; color:#9CA3AF; font-size:14px; }
  .blog-container { display: grid; grid-template-columns: 1fr 320px; gap: 36px; align-items:start; }
  @media (max-width: 1024px) { .blog-container { grid-template-columns: 1fr; } .blog-hero img { height: 260px; } }
  .blog-content .prose { max-width: 760px; margin: 0; }
  .blog-content .prose p:first-of-type::first-letter { float:left; font-size:48px; line-height:40px; padding-right:8px; font-weight:700; color:#222; }
  .blog-sidebar { position:sticky; top: calc(var(--nav-height) + 24px); }
  .share-buttons { display:flex; gap:8px; flex-wrap:wrap; }
  .share-button { background:#F3F4F6; padding:8px 10px; border-radius:8px; font-weight:600; font-size:13px; color:#374151; }
  .related-post { display:flex; gap:12px; align-items:center; padding:8px 0; border-bottom:1px solid #F3F4F6; }
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
  // Banking and Insurance industries removed per request
  { id: 'energy', name: 'Energy', icon: 'Lightbulb', desc: 'Grid optimization & predictive maintenance', hero: 'Stabilize the Grid.', heroSvg: heroEnergy, subhead: 'Load forecasting errors cost millions.', gap: 'Static models miss real-time shifts.', pain: 'Peak load stress and grid instability.', solution: 'Agents forecast load using weather and consumption data.', customSections: [{ title: 'Predictive Maintenance', body: 'Sensors + agents detect early faults and schedule maintenance before failures.' }] },
  // Healthcare industry removed per request
  { id: 'hospitality', name: 'Hospitality', icon: 'Coffee', desc: 'Automate bookings & guest experience', hero: 'Turn Guests into Loyalists.', heroSvg: heroHospitality, subhead: 'Generic service leads to low loyalty.', gap: 'Guest data is siloed.', pain: 'Low repeat business.', solution: 'Agents build unified profiles to predict preferences.', customSections: [{ title: 'Personalised Guest Journeys', body: 'Agents manage preferences and personalise offers across stays to lift loyalty and RevPAR.' }] },
  { id: 'education', name: 'Education', icon: 'GraduationCap', desc: 'Automate student onboarding & scheduling', hero: 'Focus on Learning.', heroSvg: heroEducation, subhead: 'Admissions inefficiency loses applicants.', gap: 'Admissions are manual.', pain: 'Lost applicants and revenue.', solution: 'Agents score leads and optimise timetables.', customSections: [{ title: 'Admissions Optimisation', body: 'Automated lead scoring, scheduling and document verification to reduce lost applicants.' }] },
  { id: 'electric-vehicles', name: 'Electric Vehicles', icon: 'Battery', desc: 'Secure battery quality, production and supply', hero: 'Build Electric Vehicles Customers Trust.', heroSvg: heroEnergy, subhead: 'Kinexus understands EV engineering complexity, supply fragility and production pressure.', gap: 'Battery & powertrain quality, supplier variability and software/hardware integration gaps create risk.', pain: 'Warranty risk, recalls, delayed launches and brand damage.', solution: 'Agentic monitoring across battery, powertrain, supply chain and telematics to predict failures and protect production.', customSections: [{ title: 'Battery Confidence', body: 'Continuous cell-level monitoring, predictive degradation and supplier benchmarking to reduce warranty risk.' }, { title: 'Orchestrated Production', body: 'End-to-end orchestration across MES, procurement and quality to keep EV lines running.' }] },
];

const INITIAL_USE_CASES = [
  { id: 'mfg-1', industry: 'Manufacturing', icon: 'Factory', title: 'Autonomous Production Planning Agent', gap: '70% of production plans are outdated within 2 hours.', pain: 'Frequent rescheduling causes chaos, 8-12% capacity loss.', solution: 'Recalculates schedules instantly upon disruption.', metrics: ['12% Productivity Gain', 'Zero Latency'] },
  { id: 'mfg-2', industry: 'Manufacturing', icon: 'Activity', title: 'Real-Time Shop Floor Monitoring', gap: 'MES dashboards are passive and don\'t trigger action.', pain: 'Delayed response to downtime, OEE leaks.', solution: 'Agents watch PLC data 24/7 and alert technicians.', metrics: ['15% OEE Uplift', 'Instant Response'] },
  { id: 'log-1', industry: 'Logistics', icon: 'Truck', title: 'Dispatch Automation Agent', gap: 'Dispatch is manual and gut-feel based.', pain: 'Delayed dispatches, wasted truck capacity.', solution: 'Auto-assigns trucks based on order readiness.', metrics: ['18% Cost Reduction', '99% SLA'] },
  { id: 'log-2', industry: 'Logistics', icon: 'Truck', title: 'Dynamic Route Optimisation', gap: 'Static routes don\'t account for traffic.', pain: 'High fuel costs, missed windows.', solution: 'Continuous re-routing based on live conditions.', metrics: ['15% Fuel Savings', 'On-Time Delivery'] },
  { id: 'pharma-1', industry: 'Pharma', icon: 'Pill', title: 'BMR/BPR Automation', gap: 'Batch records are paper-heavy and error-prone.', pain: 'Release delays, regulatory risk.', solution: 'Auto-fills records from equipment logs.', metrics: ['40% Faster Release', 'Zero Errors'] },
  { id: 'bank-1', industry: 'Other', icon: 'Landmark', title: 'KYC & Onboarding Automation', gap: 'KYC is manual and fragmented.', pain: 'High drop-off and cost.', solution: 'Reads docs, validates, auto-fills forms.', metrics: ['80% Faster', 'Zero Backlog'] },
  { id: 'ins-1', industry: 'Other', icon: 'Shield', title: 'Intelligent Underwriting', gap: 'Underwriting is manual and subjective.', pain: 'Slow issuance, inconsistent pricing.', solution: 'Reads reports, assesses risk instantly.', metrics: ['10x Faster Quotes', 'Consistent Risk'] },
  { id: 'energy-1', industry: 'Energy', icon: 'Lightbulb', title: 'Grid Load Forecasting & Demand Management Agent', gap: `Utilities still rely on static forecasting models, manual adjustments, limited DER visibility, and no real-time demand prediction — creating slow responses to load fluctuations.`, pain: `Peak load stress, grid instability, high peak power purchase cost, inefficient load balancing and regulatory penalties; procurement cost can rise 8–15%.`, solution: `Real-time agents that analyse weather, consumption and DER output to predict short- and long-term load, recommend demand response actions, flag overload risks and sync with generation/distribution agents.`, metrics: ['Reduced Peak Cost', 'Improved Stability'] },
  { id: 'energy-2', industry: 'Energy', icon: 'Activity', title: 'Predictive Maintenance for Power Plants & Substations', gap: `Maintenance is reactive, time-based, manual and poorly integrated with SCADA or asset health data.`, pain: `Forced outages, high repair cost, reduced asset life, safety risks, regulatory non-compliance and revenue loss.`, solution: `Analyses vibration, temperature, load and SCADA data to predict failures, recommend maintenance schedules and flag abnormal patterns while syncing with field crews and asset management.`, metrics: ['Fewer Forced Outages', 'Lower Repair Cost'] },
  { id: 'energy-3', industry: 'Energy', icon: 'Zap', title: 'Renewable Energy Forecasting & Integration Agent', gap: `Renewables are intermittent, hard to forecast and poorly integrated with grid operations and storage.`, pain: `High curtailment, inaccurate scheduling, lost renewable revenue and grid balancing challenges.`, solution: `Predicts solar and wind output, recommends optimal dispatch, reduces curtailment and coordinates with storage and trading agents to improve utilisation.`, metrics: ['Reduced Curtailment', 'Better Renewable Utilisation'] },
  { id: 'energy-4', industry: 'Energy', icon: 'Shield', title: 'Energy Theft & Loss Detection Agent', gap: `Manual theft detection, poor feeder-level visibility and no behavioural analysis or real-time anomaly detection.`, pain: `High AT&C losses, billing inefficiencies, fraudulent connections and regulatory scrutiny — losses can be 10–25% in some regions.`, solution: `Analyses consumption patterns to detect anomalies at feeder, transformer and consumer levels, flag suspicious behaviours and recommend investigations while syncing with billing and field ops.`, metrics: ['Lower AT&C Losses', 'Faster Detection'] },
  { id: 'energy-5', industry: 'Energy', icon: 'Zap', title: 'Outage Prediction & Restoration Agent', gap: `Outage management is reactive, slow to diagnose root causes and poorly coordinated across field teams.`, pain: `High SAIDI/SAIFI, long restoration times, customer churn, regulatory penalties and brand damage.`, solution: `Predicts outage likelihood, identifies probable fault locations, recommends restoration actions and coordinates field crews while syncing with SCADA, GIS and customer service.`, metrics: ['Faster Restoration', 'Lower SAIDI/SAIFI'] },
  { id: 'energy-6', industry: 'Energy', icon: 'TrendingUp', title: 'Energy Trading & Market Bidding Agent', gap: `Bidding is manual and experience-driven; market signals and renewable variability are not analysed in real time.`, pain: `Suboptimal bids, imbalance penalties, revenue leakage and poor generation utilisation; trading inefficiency can cut margins by 5–12%.`, solution: `Predicts market prices, recommends optimal bids factoring renewable variability and risk, and syncs with generation, forecasting and storage agents.`, metrics: ['Improved Margins', 'Reduced Penalties'] },
  { id: 'energy-7', industry: 'Energy', icon: 'DollarSign', title: 'Customer Billing Accuracy & Revenue Assurance Agent', gap: `Billing is error-prone, meter-reading dependent and fragmented across systems, slow to reconcile and not predictive.`, pain: `Incorrect bills, high complaints, revenue leakage, delayed collections and regulatory exposure.`, solution: `Validates meter data, detects anomalies, predicts billing errors and recommends corrective actions while syncing with CRM and revenue systems.`, metrics: ['Higher Billing Accuracy', 'Reduced Leakage'] },
  { id: 'energy-8', industry: 'Energy', icon: 'Database', title: 'Smart Meter Analytics & Consumption Intelligence Agent', gap: `Smart meters produce data but utilities lack real-time insights, segmentation and anomaly detection.`, pain: `High peak demand, poor DR participation, unnoticed anomalies and weak customer engagement.`, solution: `Analyses consumption patterns, predicts peaks, flags anomalies and recommends personalised energy-saving actions while syncing with billing and load forecasting agents.`, metrics: ['Higher DR Participation', 'Peak Reduction'] },
  { id: 'energy-9', industry: 'Energy', icon: 'MapPin', title: 'Field Workforce Scheduling & Dispatch Agent', gap: `Field ops are manual, poorly routed and not prioritised by outage risk or asset health.`, pain: `Delayed restoration, high travel time, poor crew utilisation and safety risks.`, solution: `Recommends optimal crew routing, prioritises jobs by risk, predicts job duration and tracks performance while syncing with outage and asset agents.`, metrics: ['Faster Response', 'Better Utilisation'] },
  { id: 'energy-10', industry: 'Energy', icon: 'Shield', title: 'Safety, Compliance & Incident Response Agent', gap: `Safety processes are manual, poorly documented and reactive rather than preventive.`, pain: `Safety incidents, regulatory non-compliance, liability and operational downtime.`, solution: `Analyses incident patterns, predicts high-risk zones, auto-generates compliance documentation and recommends preventive actions while syncing with field and command-center agents.`, metrics: ['Fewer Incidents', 'Audit Readiness'] },
  { id: 'energy-11', industry: 'Energy', icon: 'Factory', title: 'Fuel Mix & Generation Optimisation Agent', gap: `Generation planning is manual, not optimised for fuel cost or renewables and slow to react to demand shifts.`, pain: `High fuel cost, suboptimal dispatch, increased emissions and revenue leakage.`, solution: `Analyses fuel prices, demand and renewable output to recommend optimal dispatch and fuel mix, reducing cost and emissions.`, metrics: ['Lower Generation Cost', 'Better Asset Utilisation'] },
  { id: 'energy-12', industry: 'Energy', icon: 'Thermometer', title: 'Carbon Emissions Tracking & ESG Intelligence Agent', gap: `ESG reporting is manual, spreadsheet-driven and not integrated with generation/consumption data.`, pain: `Inaccurate reporting, regulatory risk and reputational exposure.`, solution: `Tracks emissions across assets, predicts ESG performance and auto-generates compliance reports while syncing with operations and trading.`, metrics: ['Accurate ESG', 'Faster Reporting'] },
  { id: 'energy-13', industry: 'Energy', icon: 'Battery', title: 'Storage & Battery Dispatch Optimisation Agent', gap: `Battery storage is underutilised, poorly dispatched and not aligned with market prices or renewable peaks.`, pain: `High curtailment, poor ROI, inefficient cycles and missed arbitrage opportunities.`, solution: `Predicts renewable peaks, recommends charge/discharge cycles, maximises arbitrage revenue and extends battery life while syncing with trading and grid agents.`, metrics: ['Higher Arbitrage Revenue', 'Extended Battery Life'] },
  { id: 'energy-14', industry: 'Energy', icon: 'Signal', title: 'Transmission Line Monitoring Agent', gap: `Monitoring is infrequent, inspections are rare and weather/vegetation risks are not predicted.`, pain: `Line faults, wildfire risk, high repair cost and catastrophic failures.`, solution: `Analyses thermal load, sag and weather to predict faults, flag vegetation risk and recommend preventive actions while syncing with field teams.`, metrics: ['Fewer Faults', 'Lower Risk'] },
  { id: 'energy-15', industry: 'Energy', icon: 'Users', title: 'Distributed Energy Resource (DER) Orchestration Agent', gap: `No visibility or control over DERs; forecasting and coordination with grid ops are missing.`, pain: `Voltage fluctuations, reverse power flow, high curtailment and customer dissatisfaction.`, solution: `Predicts DER output, balances DER contributions with grid needs, recommends demand response and reduces curtailment while syncing with storage and grid agents.`, metrics: ['Stabilised Voltage', 'Better DER Utilisation'] },
  { id: 'energy-16', industry: 'Energy', icon: 'Maximize2', title: 'Microgrid Management Agent', gap: `Microgrids are fragmented, not optimised for local generation and poorly coordinated with the main grid.`, pain: `Island instability, poor local renewable utilisation and high operational cost.`, solution: `Predicts local load and generation, optimises islanding/reconnection and coordinates storage and DERs to maintain voltage and frequency stability.`, metrics: ['Resilient Microgrids', 'Improved ROI'] },
  { id: 'energy-17', industry: 'Energy', icon: 'Workflow', title: 'Energy Efficiency & Demand Response Agent', gap: `DR programs are poorly adopted, not personalised and not integrated with smart meter data.`, pain: `Low DR participation, high peak demand and regulatory pressure.`, solution: `Predicts peaks, identifies eligible customers, recommends personalised DR actions and triggers automated load reduction while syncing with smart meters and customer agents.`, metrics: ['Higher DR Uptake', 'Lower Peak'] },
  { id: 'energy-18', industry: 'Energy', icon: 'Smile', title: 'Customer Experience & Self-Service Agent', gap: `Customer service is slow, manual and not integrated with billing or outage systems.`, pain: `High call volumes, billing disputes and poor digital adoption.`, solution: `Provides instant answers, personalises communication, auto-resolves billing and outage queries and syncs with backend systems.`, metrics: ['Lower Call Volume', 'Higher Satisfaction'] },
  { id: 'energy-19', industry: 'Energy', icon: 'BarChart3', title: 'Real-Time Grid Operations Command Center Agent', gap: `Data lives in silos; there is no unified visibility or predictive alerts for grid health.`, pain: `Delayed outage response, operational chaos and high SAIDI/SAIFI.`, solution: `Consolidates SCADA, GIS and AMI data to predict faults, recommend corrective actions and coordinate crews in real time.`, metrics: ['Operational Visibility', 'Faster Decisions'] },
  { id: 'energy-20', industry: 'Energy', icon: 'Cpu', title: 'Multi-Agent Orchestration for Energy', gap: `Energy systems are interconnected but don’t share decisions — load, generation, trading, storage and DERs operate in silos.`, pain: `Fragmented decision-making causing high operational cost, grid instability and revenue leakage.`, solution: `Enables agents to share data, decisions and actions across the energy ecosystem for autonomous, system-wide optimisation.`, metrics: ['System-wide Optimisation', 'Lower Operational Cost'] },
  { id: 'ret-1', industry: 'Retail', icon: 'ShoppingCart', title: 'Inventory Optimisation', gap: 'Inventory managed by averages.', pain: 'Stockouts and overstock.', solution: 'Predicts SKU-level demand per store.', metrics: ['15% Less Stockouts', 'Lower Working Cap'] },
  { id: 'health-1', industry: 'Other', icon: 'HeartPulse', title: 'Intelligent Patient Intake & Triage Agent', gap: 'Patient intake is manual and slow.', pain: 'Long waits and burnout.', solution: 'Triages patients and auto-fills EMR.', metrics: ['30% Less Wait Time', 'Better Clinical Safety'] }
];

// Short slide metrics per industry for richer carousel cards
const INDUSTRY_SLIDE_METRICS = {
  manufacturing: ['35% throughput improvement', '40% fewer manual reviews', '10x ROI (12–24 months)'],
  logistics: ['18% fuel & cost savings', '22% on-time delivery improvement', '3x ROI (12 months)'],
  pharma: ['40% faster batch release', 'Zero paperwork errors', 'Audit-ready compliance'],
  'real-estate': ['Faster progress verification', 'Reduced billing leakage', 'Shorter handover time'],
  retail: ['15% fewer stockouts', 'Lower working capital', 'Higher conversion rate'],
  energy: ['Reduced peak procurement cost', 'Improved grid stability', 'Faster outage restoration'],
  hospitality: ['Higher RevPAR', 'Increased repeat bookings', 'Lower energy & labour cost'],
  education: ['Higher enrollment conversion', 'Fewer timetable conflicts', 'Improved student retention'],
  other: ['Operational efficiency', 'Measured cost savings', 'Faster time to value'],
  'electric-vehicles': ['Higher battery reliability', 'Fewer warranty claims', 'Improved production uptime']
};

// --- HOSPITALITY USE CASES (added) ---
INITIAL_USE_CASES.push(
  { id: 'hosp-1', industry: 'Hospitality', icon: 'Users', title: 'Intelligent Guest Experience & Personalisation Agent', gap: 'Preferences not captured consistently; no unified guest profile; fragmented systems.', pain: 'Forgettable experiences, low loyalty, missed upsells.', solution: 'Builds unified guest profiles, predicts preferences, triggers personalised communication and upsells; syncs with PMS/CRM/F&B.', metrics: ['↑ RevPAR', '↑ Repeat Bookings'] },
  { id: 'hosp-2', industry: 'Hospitality', icon: 'TrendingUp', title: 'Dynamic Pricing & Revenue Management Agent', gap: 'Manual RM, slow to react, not predictive.', pain: 'Revenue leakage, poor yield, inaccurate forecasting.', solution: 'Analyses demand and competitor pricing, predicts occupancy and recommends optimal rates.', metrics: ['5-15% Revenue Lift', 'Improved RevPAR'] },
  { id: 'hosp-3', industry: 'Hospitality', icon: 'Activity', title: 'Housekeeping Productivity & Room Readiness Agent', gap: 'Manual housekeeping assignment, not aligned with check-ins.', pain: 'Delayed room readiness, guest dissatisfaction, high staff fatigue.', solution: 'Predicts readiness, assigns tasks, optimises routes and syncs with PMS.', metrics: ['Faster Turnaround', 'Lower Overtime'] },
  { id: 'hosp-4', industry: 'Hospitality', icon: 'ShoppingCart', title: 'F&B Demand Forecasting & Menu Optimisation Agent', gap: 'Unpredictable demand and manual menu engineering.', pain: 'Wastage, stockouts, low profitability.', solution: 'Forecasts demand, recommends menu changes, predicts wastage and syncs procurement.', metrics: ['Lower Food Waste', 'Higher Dish Profitability'] },
  { id: 'hosp-5', industry: 'Hospitality', icon: 'Smile', title: 'Front Desk Automation & Service Excellence Agent', gap: 'Manual check-in/out, error-prone billing, not integrated with guest profiles.', pain: 'Long waits, low upsell conversion, poor first impressions.', solution: 'Auto-fills guest details, predicts needs, recommends upsells, flags VIPs and syncs operations.', metrics: ['Shorter Check-in', 'Higher Conversion'] },
  { id: 'hosp-6', industry: 'Hospitality', icon: 'FileText', title: 'Guest Feedback & Reputation Management Agent', gap: 'Feedback scattered, manual review, not linked to ops.', pain: 'Negative reviews, low NPS, missed recoveries.', solution: 'Aggregates reviews, detects sentiment, flags urgent failures and recommends recovery actions.', metrics: ['↑ NPS', 'Faster Recovery'] },
  { id: 'hosp-7', industry: 'Hospitality', icon: 'Battery', title: 'Energy & Utility Optimisation Agent', gap: 'HVAC not occupancy-driven, no predictive maintenance.', pain: 'High energy bills, equipment breakdowns, poor sustainability.', solution: 'Optimises HVAC, predicts failures, reduces energy waste.', metrics: ['Lower Energy Cost', 'Predictive Maintenance'] },
  { id: 'hosp-8', industry: 'Hospitality', icon: 'Clock', title: 'Staff Scheduling & Labour Optimisation Agent', gap: 'Manual scheduling, not aligned with occupancy.', pain: 'Over/understaffing, high overtime, burnout.', solution: 'Predicts workload, recommends staffing and balances shifts.', metrics: ['Lower Labour Cost', 'Better Coverage'] },
  { id: 'hosp-9', industry: 'Hospitality', icon: 'Calendar', title: 'Event & Banquet Operations Agent', gap: 'Manual coordination and poor forecasting for events.', pain: 'Service failures, wastage, low profitability.', solution: 'Predicts event needs, coordinates kitchen/sales/ops and tracks execution in real time.', metrics: ['Higher Event Profit', 'Lower Wastage'] },
  { id: 'hosp-10', industry: 'Hospitality', icon: 'Settings', title: 'Preventive Maintenance & Asset Health Agent', gap: 'Reactive maintenance and poor documentation.', pain: 'Breakdowns, high repair costs, guest complaints.', solution: 'Analyses equipment performance, predicts failures and schedules maintenance.', metrics: ['Reduced Downtime', 'Lower Repair Cost'] },
  { id: 'hosp-11', industry: 'Hospitality', icon: 'Sparkles', title: 'Loyalty Program Intelligence Agent', gap: 'Transactional loyalty, poor segmentation and low engagement.', pain: 'Low repeat stays and weak redemption rates.', solution: 'Analyses behaviour, predicts churn, recommends personalised rewards and campaigns.', metrics: ['Higher Retention', 'Improved Redemption'] },
  { id: 'hosp-12', industry: 'Hospitality', icon: 'Filter', title: 'Procurement & Vendor Performance Agent', gap: 'Manual procurement, over-ordering and lack of benchmarks.', pain: 'Wastage, stockouts, poor supply quality.', solution: 'Analyses vendor performance, predicts consumption and recommends orders.', metrics: ['Lower Procurement Cost', 'Fewer Stockouts'] },
  { id: 'hosp-13', industry: 'Hospitality', icon: 'Database', title: 'Multi-Property Performance Intelligence Agent', gap: 'Data silos across properties; no benchmarking.', pain: 'Uneven performance, missed opportunities, slow decisions.', solution: 'Consolidates data, benchmarks properties and flags underperformers.', metrics: ['Chain-wide Insights', 'Faster Decisions'] },
  { id: 'hosp-14', industry: 'Hospitality', icon: 'Shield', title: 'Safety, Security & Incident Response Agent', gap: 'Reactive security and poor documentation.', pain: 'Delayed response, safety risks and regulatory exposure.', solution: 'Analyses incidents, predicts high-risk zones and auto-generates reports.', metrics: ['Faster Response', 'Lower Risk'] },
  { id: 'hosp-15', industry: 'Hospitality', icon: 'Mail', title: 'Marketing Personalisation & Campaign Intelligence Agent', gap: 'Generic marketing, poor measurement and manual segmentation.', pain: 'Low conversion and wasted spend.', solution: 'Personalises campaigns, predicts booking intent and measures uplift.', metrics: ['Higher Conversion', 'Lower CPA'] },
  { id: 'hosp-16', industry: 'Hospitality', icon: 'HeartPulse', title: 'Spa, Wellness & Ancillary Revenue Agent', gap: 'Underutilised spa services and poor forecasting.', pain: 'Low utilisation and cancellations.', solution: 'Predicts demand, personalises offers and optimises therapist schedules.', metrics: ['Higher Ancillary Rev', 'Lower Cancellations'] },
  { id: 'hosp-17', industry: 'Hospitality', icon: 'Workflow', title: 'Guest Journey Orchestration Agent', gap: 'Fragmented pre-arrival to post-stay data and no cross-department coordination.', pain: 'Missed upsells, inconsistent experiences and low repeat business.', solution: 'Orchestrates guest journey, predicts needs and coordinates actions across teams.', metrics: ['Improved Guest NPS', 'Higher Repeat Rate'] },
  { id: 'hosp-18', industry: 'Hospitality', icon: 'Globe', title: 'OTA Performance & Parity Agent', gap: 'Poorly monitored OTA performance and parity issues.', pain: 'Lost bookings and high commission.', solution: 'Analyses OTA rankings, flags parity issues and recommends content/rate changes.', metrics: ['Better OTA Rankings', 'Higher Direct Bookings'] },
  { id: 'hosp-19', industry: 'Hospitality', icon: 'Maximize2', title: 'Real-Time Operations Command Center Agent', gap: 'No unified real-time operational command center.', pain: 'Slow service recovery and operational bottlenecks.', solution: 'Consolidates real-time data, predicts bottlenecks and recommends actions.', metrics: ['Faster Recovery', 'Operational Visibility'] },
  { id: 'hosp-20', industry: 'Hospitality', icon: 'Cpu', title: 'Multi-Agent Orchestration for Hospitality', gap: 'Disconnected systems and poor cross-department collaboration.', pain: 'Fragmented experience and revenue leakage.', solution: 'Orchestrates agents across guest experience, ops, F&B, procurement and energy to automate the entire hotel.', metrics: ['End-to-end Automation', 'Higher Profitability'] }
);

// --- EDUCATION USE CASES (added) ---
INITIAL_USE_CASES.push(
  { id: 'edu-1', industry: 'Education', icon: 'GraduationCap', title: 'Student Enrollment & Admissions Intelligence Agent', gap: 'Lead data is scattered; follow-ups inconsistent; no predictive scoring or automated verification.', pain: 'Lost applicants, high acquisition cost and revenue volatility.', solution: 'Scores leads, auto-verifies documents, personalises outreach and predicts seat fill.', metrics: ['Higher Conversion', 'Lower CAC'] },
  { id: 'edu-2', industry: 'Education', icon: 'Calendar', title: 'Academic Planning & Timetable Optimisation Agent', gap: 'Timetabling is manual and error-prone; not aligned with faculty availability.', pain: 'Class conflicts, faculty overload and underutilised classrooms.', solution: 'Analyses faculty schedules and student demand to recommend optimal allocations and prevent clashes.', metrics: ['Better Utilisation', 'Fewer Conflicts'] },
  { id: 'edu-3', industry: 'Education', icon: 'BarChart', title: 'Student Performance & Early Intervention Agent', gap: 'Performance monitoring is reactive and not predictive.', pain: 'Late interventions, high dropout risk and poor engagement.', solution: 'Analyses attendance, assignments and assessments to predict decline and recommend interventions.', metrics: ['Lower Dropout', 'Improved Outcomes'] },
  { id: 'edu-4', industry: 'Education', icon: 'Briefcase', title: 'Faculty Productivity & Workload Management Agent', gap: 'Faculty workload is uneven and not tracked in real time.', pain: 'Burnout, inconsistent teaching quality and high attrition.', solution: 'Balances workloads, flags overload and recommends resource allocation.', metrics: ['Lower Burnout', 'Higher Retention'] },
  { id: 'edu-5', industry: 'Education', icon: 'Globe', title: 'Curriculum Mapping & Learning Outcome Intelligence Agent', gap: 'Curriculum design is manual and not linked to learning outcomes.', pain: 'Outdated curriculum, low employability and accreditation challenges.', solution: 'Maps course content to outcomes, identifies gaps and recommends updates.', metrics: ['Improved Outcomes', 'Accreditation Ready'] },
  { id: 'edu-6', industry: 'Education', icon: 'Clock', title: 'Attendance Monitoring & Behaviour Intelligence Agent', gap: 'Attendance tracking is manual and inconsistent.', pain: 'Chronic absenteeism and late interventions.', solution: 'Detects patterns, predicts risk and alerts teachers and parents.', metrics: ['Early Alerts', 'Reduced Absenteeism'] },
  { id: 'edu-7', industry: 'Education', icon: 'Database', title: 'LMS Engagement & Learning Analytics Agent', gap: 'LMS data is underutilised and engagement is not analysed.', pain: 'Low completion rates and weak mastery.', solution: 'Analyses engagement, predicts gaps and recommends personalised content.', metrics: ['Higher Completion', 'Better Mastery'] },
  { id: 'edu-8', industry: 'Education', icon: 'FileText', title: 'Examination & Assessment Automation Agent', gap: 'Assessments are manual and slow.', pain: 'Delayed results, inconsistent grading and high teacher workload.', solution: 'Auto-grades objective items, assists subjective evaluation and maps to outcomes.', metrics: ['Faster Results', 'Consistent Grading'] },
  { id: 'edu-9', industry: 'Education', icon: 'Mail', title: 'Parent Communication & Engagement Agent', gap: 'Parent communication is inconsistent and not personalised.', pain: 'Low parent involvement and escalations.', solution: 'Personalises updates, flags issues and syncs with academic teams.', metrics: ['Higher Engagement', 'Lower Escalations'] },
  { id: 'edu-10', industry: 'Education', icon: 'HeartPulse', title: 'Student Counselling & Wellbeing Agent', gap: 'Wellbeing is under-monitored and reactive.', pain: 'Undetected crises and counsellor overload.', solution: 'Predicts wellbeing risk, recommends interventions and assists counsellors.', metrics: ['Early Intervention', 'Reduced Crises'] },
  { id: 'edu-11', industry: 'Education', icon: 'CheckCircle2', title: 'Accreditation & Compliance Agent', gap: 'Accreditation preparation is manual and documentation-heavy.', pain: 'Last-minute audit panic and non-compliance.', solution: 'Tracks compliance indicators, auto-generates docs and flags gaps.', metrics: ['Audit Ready', 'Lower Admin Burden'] },
  { id: 'edu-12', industry: 'Education', icon: 'DollarSign', title: 'Fee Management & Revenue Intelligence Agent', gap: 'Fee management is fragmented and error-prone.', pain: 'Delayed collections and forecasting issues.', solution: 'Predicts default risk, auto-reconciles payments and sends personalised reminders.', metrics: ['Higher Collections', 'Lower DSO'] },
  { id: 'edu-13', industry: 'Education', icon: 'Sparkles', title: 'Hostel & Campus Operations Agent', gap: 'Hostel operations are manual and poorly monitored.', pain: 'Safety incidents and inefficient room allocation.', solution: 'Predicts room needs, tracks movement and flags safety risks.', metrics: ['Improved Safety', 'Optimised Allocation'] },
  { id: 'edu-14', industry: 'Education', icon: 'TrendingUp', title: 'Placement & Employability Intelligence Agent', gap: 'Placements are not data-driven and poorly aligned with industry needs.', pain: 'Low placement rates and weak employer relationships.', solution: 'Analyses skills, predicts employability and matches students to roles.', metrics: ['Higher Placement Rate', 'Better Salaries'] },
  { id: 'edu-15', industry: 'Education', icon: 'Activity', title: 'Research Productivity & Grant Intelligence Agent', gap: 'Research ops are fragmented and not matched to funding opportunities.', pain: 'Missed grants and low publication output.', solution: 'Matches grants to researchers, recommends topics and tracks progress.', metrics: ['More Grants', 'Higher Output'] },
  { id: 'edu-16', industry: 'Education', icon: 'BarChart', title: 'Library Intelligence & Resource Optimisation Agent', gap: 'Library resources are poorly catalogued and misaligned with demand.', pain: 'Low utilisation and wasted subscriptions.', solution: 'Analyses borrowing/search patterns and recommends subscription optimisation.', metrics: ['Higher Utilisation', 'Lower Cost'] },
  { id: 'edu-17', industry: 'Education', icon: 'MapPin', title: 'Transport & Route Optimisation Agent', gap: 'Transport is manual and poorly routed.', pain: 'Late arrivals, safety risks and high fuel cost.', solution: 'Optimises routes, predicts delays and tracks bus utilisation.', metrics: ['Safer Transport', 'Lower Fuel'] },
  { id: 'edu-18', industry: 'Education', icon: 'Globe', title: 'Multi-Campus Performance Intelligence Agent', gap: 'Multi-campus data lives in silos; no cross-campus benchmarking.', pain: 'Uneven performance and slow decisions.', solution: 'Consolidates data and benchmarks campuses to flag underperformers.', metrics: ['Unified Insights', 'Faster Decisions'] },
  { id: 'edu-19', industry: 'Education', icon: 'Workflow', title: 'Student Lifecycle Journey Agent', gap: 'Student journeys are fragmented and departments don\'t share signals.', pain: 'High dropout rates and fragmented interventions.', solution: 'Orchestrates lifecycle, predicts risks and triggers interventions.', metrics: ['Lower Dropout', 'Better Experience'] },
  { id: 'edu-20', industry: 'Education', icon: 'Cpu', title: 'Multi-Agent Orchestration for Education', gap: 'Systems are disconnected and decisions are fragmented.', pain: 'Operational friction and inconsistent student experience.', solution: 'Orchestrates admissions, academics, counselling and placements for system-wide optimisation.', metrics: ['End-to-end Coordination', 'Lower Operational Cost'] }
);

// --- RETAIL USE CASES (added) ---
INITIAL_USE_CASES.push(
  { id: 'ret-3', industry: 'Retail', icon: 'ShoppingCart', title: 'Demand Forecasting & Replenishment Agent', gap: 'Excel-based forecasting, delayed POS data and no SKU×store granularity.', pain: 'Stockouts, overstock, high working capital and poor omnichannel availability.', solution: 'Forecasts at SKU×store×channel using POS, promotions and seasonality; recommends replenishment and syncs with warehouses.', metrics: ['Fewer Stockouts', 'Lower Working Capital'] },
  { id: 'ret-4', industry: 'Retail', icon: 'DollarSign', title: 'Price & Markdown Optimisation Agent', gap: 'Reactive pricing, not linked to elasticity or margin/volume trade-offs.', pain: 'Margin leakage and slow-moving inventory.', solution: 'Analyses elasticity, competition and seasonality to recommend optimal prices and targeted markdowns.', metrics: ['Improved Margin', 'Faster Sell-through'] },
  { id: 'ret-5', industry: 'Retail', icon: 'Users', title: 'Store Operations Productivity Agent', gap: 'Manual, paper-driven store ops not linked to real-time workload.', pain: 'Long queues, poor shelf availability and high labour cost.', solution: 'Analyses footfall and workload to recommend tasks, staffing and peak handling.', metrics: ['Higher Throughput', 'Lower Labour Cost'] },
  { id: 'ret-6', industry: 'Retail', icon: 'Smile', title: 'Customer Experience & Personalisation Agent', gap: 'Loyalty data underutilised and no unified customer profile.', pain: 'Low repeat purchase and ineffective marketing.', solution: 'Builds unified profiles, predicts next-best offers and personalises communication across channels.', metrics: ['Higher Repeat Rate', 'Higher LTV'] },
  { id: 'ret-7', industry: 'Retail', icon: 'Filter', title: 'Inventory Accuracy & Shrinkage Control Agent', gap: 'Manual counts, theft and disconnected systems reduce accuracy.', pain: 'Stock discrepancies, shrinkage losses and audit failures.', solution: 'Reconciles POS/WMS/shelf data, detects shrinkage patterns and flags discrepancies for action.', metrics: ['Lower Shrinkage', 'Accurate Inventory'] },
  { id: 'ret-8', industry: 'Retail', icon: 'MapPin', title: 'Omnichannel Fulfilment Agent', gap: 'Inventory not unified across stores, DCs and online; returns disrupt accuracy.', pain: 'Cancelled orders, high last-mile cost and poor fulfilment promises.', solution: 'Unifies inventory, recommends fulfilment source and guides store picking while predicting delays.', metrics: ['Faster Fulfilment', 'Higher On-time Rate'] },
  { id: 'ret-9', industry: 'Retail', icon: 'Truck', title: 'Returns & Reverse Logistics Agent', gap: 'Return reasons unanalysed and slow reintegration to inventory.', pain: 'High reverse logistics cost and inventory stuck in pipeline.', solution: 'Analyses return reasons, detects fraud, recommends disposition and accelerates QC and reintegration.', metrics: ['Lower Return Cost', 'Faster Resell'] },
  { id: 'ret-10', industry: 'Retail', icon: 'BarChart', title: 'Merchandising & Assortment Planning Agent', gap: 'Assortment based on intuition, not local demand.', pain: 'Wrong SKUs per store, dead stock and lost sales.', solution: 'Analyses local demand and recommends SKU-level assortment and space allocation.', metrics: ['Higher SKU Productivity', 'Lower Dead Stock'] },
  { id: 'ret-11', industry: 'Retail', icon: 'Filter', title: 'Supplier Performance Intelligence Agent', gap: 'Supplier evaluation is manual and not predictive.', pain: 'Delayed deliveries, poor quality and procurement risk.', solution: 'Analyses supplier delivery, quality and fill rates to predict supplier risk and recommend allocation.', metrics: ['Fewer Supplier Failures', 'Better Fill Rates'] },
  { id: 'ret-12', industry: 'Retail', icon: 'Sparkles', title: 'Promotion Effectiveness Agent', gap: 'Promotions are broad, gut-driven and poorly measured.', pain: 'Low ROI, margin erosion and cannibalisation.', solution: 'Analyses uplift, cannibalisation and halo effects to recommend targeted promotions and timing.', metrics: ['Higher Promo ROI', 'Lower Cannibalisation'] },
  { id: 'ret-13', industry: 'Retail', icon: 'Calendar', title: 'Workforce Scheduling Agent', gap: 'Manual shift planning not aligned with footfall or task load.', pain: 'Over/understaffing, high overtime and low morale.', solution: 'Recommends optimal staffing per hour, predicts peaks and suggests cross-training.', metrics: ['Lower Labour Cost', 'Better Coverage'] },
  { id: 'ret-14', industry: 'Retail', icon: 'FileText', title: 'Planogram Compliance Agent', gap: 'Shelf execution varies; audits are slow and manual.', pain: 'Lost promotional impact and poor shelf productivity.', solution: 'Analyses shelf photos to detect compliance gaps and recommend fixes.', metrics: ['Higher Compliance', 'Improved Sales'] },
  { id: 'ret-15', industry: 'Retail', icon: 'AlertTriangle', title: 'Loss Prevention Agent', gap: 'Shrinkage patterns not analysed and CCTV rarely reviewed.', pain: '1–3% revenue loss, high investigation workload and safety risks.', solution: 'Analyses CCTV, POS anomalies and behaviour to detect theft and collusion, flagging incidents proactively.', metrics: ['Reduced Shrinkage', 'Faster Detection'] },
  { id: 'ret-16', industry: 'Retail', icon: 'HelpCircle', title: 'Customer Service Automation Agent', gap: 'Customer service is manual, slow and not integrated with order/inventory.', pain: 'Slow responses, high call costs and poor CX.', solution: 'Auto-resolves queries using order/inventory context and escalates only when needed.', metrics: ['Lower Call Volume', 'Faster Resolution'] },
  { id: 'ret-17', industry: 'Retail', icon: 'MapPin', title: 'Store Expansion & Location Intelligence Agent', gap: 'Location decisions are gut-driven and outdated.', pain: 'Underperforming stores and poor capital allocation.', solution: 'Analyses demographics, competition and category performance to predict store returns and cannibalisation.', metrics: ['Better Site ROI', 'Fewer Failures'] },
  { id: 'ret-18', industry: 'Retail', icon: 'ShoppingCart', title: 'E-commerce Conversion Optimisation Agent', gap: 'Generic analytics, slow A/B and no real-time personalisation.', pain: 'Low conversion, high cart abandonment and high CAC.', solution: 'Analyses behaviour, personalises listings, optimises funnels and suggests UX fixes for higher conversion.', metrics: ['Higher Conversion', 'Lower Cart Abandonment'] },
  { id: 'ret-19', industry: 'Retail', icon: 'Workflow', title: 'Marketplace Operations Agent', gap: 'Listing errors, price mismatches and inventory sync failures across marketplaces.', pain: 'Account health issues, penalties and lost Buy Box.', solution: 'Manages listings, syncs inventory, optimises pricing and predicts SLA risk across marketplaces.', metrics: ['Better Marketplace Health', 'Lower Penalties'] },
  { id: 'ret-20', industry: 'Retail', icon: 'BarChart', title: 'Private Label Profitability Agent', gap: 'Lack of visibility into cost per SKU, supplier performance and cannibalisation.', pain: 'Low private label margins and high dead stock.', solution: 'Analyses cost, demand and supplier data to recommend private label pricing and assortment.', metrics: ['Higher Private Label Margin', 'Faster NPD'] },
  { id: 'ret-21', industry: 'Retail', icon: 'BarChart', title: 'Real-Time Business Health Agent', gap: 'Data silos and delayed reports prevent real-time leadership decisions.', pain: 'Missed opportunities, poor promo performance and slow responses.', solution: 'Consolidates POS/WMS/CRM and provides predictive alerts and executive insights.', metrics: ['Real-time Visibility', 'Faster Actions'] },
  { id: 'ret-22', industry: 'Retail', icon: 'Cpu', title: 'Multi-Agent Orchestration for Retail', gap: 'Functions operate in silos with fragmented decisions.', pain: 'Stockouts, overstock, high fulfilment cost and margin leakage.', solution: 'Orchestrates demand, pricing, inventory, fulfilment and service agents for system-wide optimisation.', metrics: ['System-wide Coordination', 'Lower Operational Cost'] }
);

// --- REAL ESTATE & CONSTRUCTION USE CASES (added) ---
INITIAL_USE_CASES.push(
  { id: 're-3', industry: 'Real Estate', icon: 'Building', title: 'Project Progress Monitoring Agent', gap: 'Progress reporting is manual, unstructured and delayed; BOQ reconciliation rarely happens in real time.', pain: 'Delayed timelines, cost overruns, inaccurate billing and reputational damage.', solution: 'Analyses site photos/videos vs BOQ and schedule, flags deviations, and generates evidence-backed progress reports.', metrics: ['Reduced Overruns', 'Faster Issue Detection'] },
  { id: 're-4', industry: 'Real Estate', icon: 'DollarSign', title: 'Contractor Billing Verification Agent', gap: 'Contractor bills are self-reported and verification is slow and error-prone.', pain: 'Overpayments (5–12%), cash flow unpredictability and disputes.', solution: 'Reads bills, BOQ and progress evidence to validate quantities and flag discrepancies automatically.', metrics: ['Lower Billing Leakage', 'Faster Verification'] },
  { id: 're-5', industry: 'Real Estate', icon: 'Truck', title: 'Material Procurement & Delivery Coordination Agent', gap: 'PRs and deliveries are manual; vendor follow-ups and tracking are ad-hoc.', pain: 'Late materials, emergency procurement, wastage and site congestion.', solution: 'Predicts material needs from schedules/BOQ, tracks deliveries, follows up with vendors and flags delays.', metrics: ['On-time Deliveries', 'Lower Logistics Cost'] },
  { id: 're-6', industry: 'Real Estate', icon: 'FileText', title: 'Drawing & Document Control Agent', gap: 'Drawings and RFIs circulate informally; version control is poor and approvals are slow.', pain: 'Rework, disputes, regulatory non-compliance and execution errors.', solution: 'Manages revisions, flags outdated versions, notifies teams and maintains audit trails for drawings and docs.', metrics: ['Fewer Reworks', 'Faster Approvals'] },
  { id: 're-7', industry: 'Real Estate', icon: 'Shield', title: 'Site Safety Monitoring Agent', gap: 'Safety checks are manual; CCTV is underused and incident logs are incomplete.', pain: 'Accidents, regulatory penalties, higher insurance and project stoppages.', solution: 'Analyses CCTV to detect PPE violations and unsafe behaviour, triggers alerts and maintains safety logs.', metrics: ['Lower Incidents', 'Improved Compliance'] },
  { id: 're-8', industry: 'Real Estate', icon: 'Users', title: 'Labour Attendance & Productivity Agent', gap: 'Attendance is supervisor-managed and not linked to output; ghost workers are common.', pain: 'Payroll leakage, low productivity and inaccurate contractor billing.', solution: 'Validates attendance via access/CCTV, links hours to progress and flags productivity gaps.', metrics: ['Lower Payroll Leakage', 'Higher Productivity'] },
  { id: 're-9', industry: 'Real Estate', icon: 'Database', title: 'BOQ vs Actual Consumption Agent', gap: 'Material consumption is recorded late and poorly reconciled with BOQ.', pain: 'Material wastage, budget overruns and contractor disputes.', solution: 'Compares issue slips/delivery challans with BOQ in real time, flags variances and identifies wastage patterns.', metrics: ['Lower Material Leakage', 'Accurate Costing'] },
  { id: 're-10', industry: 'Real Estate', icon: 'CheckCircle2', title: 'RERA Compliance Agent', gap: 'RERA updates are manual, inconsistent and time-sensitive.', pain: 'Penalties, registration issues and customer complaints.', solution: 'Pulls progress/financials/photos to auto-generate RERA updates, validate compliance and maintain audit trails.', metrics: ['Audit-Ready Compliance', 'Lower Penalties'] },
  { id: 're-11', industry: 'Real Estate', icon: 'FileText', title: 'Customer Handover & Snag Management Agent', gap: 'Snag lists are manual and unstructured; closure tracking is poor.', pain: 'Delayed handovers, customer dissatisfaction and rework.', solution: 'Reads snag photos/descriptions, categorises issues, assigns tasks, tracks closure and notifies customers.', metrics: ['Faster Handover', 'Higher Customer Satisfaction'] },
  { id: 're-12', industry: 'Real Estate', icon: 'DollarSign', title: 'Sales & CRM Intelligence Agent', gap: 'Leads are disorganised with poor follow-up discipline and no intent signals.', pain: 'Low conversion, inaccurate forecasting and delayed cash inflows.', solution: 'Analyses leads, predicts conversion probability, suggests next-best actions and auto-updates CRM.', metrics: ['Higher Conversion', 'Faster Cash Flow'] },
  { id: 're-13', industry: 'Real Estate', icon: 'BarChart', title: 'Cash Flow Forecasting Agent', gap: 'Forecasting is Excel-based and not linked to project progress or billing.', pain: 'Cash shortages, overdraft interest and stalled projects.', solution: 'Integrates sales, collections, bills and progress to predict inflows/outflows and flag cash gaps.', metrics: ['Fewer Cash Crises', 'Better Planning'] },
  { id: 're-14', industry: 'Real Estate', icon: 'AlertTriangle', title: 'Project Delay Prediction Agent', gap: 'Delays build up silently across suppliers, labour and materials and are detected too late.', pain: 'Cost overruns, customer escalations and RERA impacts.', solution: 'Analyses progress, labour, materials and approvals to surface early warning signals and predict milestone slippage.', metrics: ['Earlier Alerts', 'Reduced Slippage'] },
  { id: 're-15', industry: 'Real Estate', icon: 'Users', title: 'Vendor Performance Intelligence Agent', gap: 'Vendor evaluation is subjective and not data-driven.', pain: 'Poor quality, delays and weak negotiation leverage.', solution: 'Scores vendors on delivery, quality and billing accuracy; predicts risk and recommends allocation.', metrics: ['Better Vendor Reliability', 'Lower Risk'] },
  { id: 're-16', industry: 'Real Estate', icon: 'FileText', title: 'Tender Evaluation Agent', gap: 'Tendering is manual, Excel-driven and inconsistent across commercial/technical evaluation.', pain: 'Overpriced contracts, poor vendor selection and audit findings.', solution: 'Reads BOQs and bids, compares line items, flags hidden costs and scores vendors for selection.', metrics: ['Better Tender Outcomes', 'Faster Selection'] },
  { id: 're-17', industry: 'Real Estate', icon: 'BarChart', title: 'Cost Overrun Analysis Agent', gap: 'Cost variances are detected late with no link to progress metrics.', pain: 'Budget overruns, investor disappointment and project risk.', solution: 'Identifies cost variances in real time, predicts future overruns and recommends corrective actions.', metrics: ['Lower Overruns', 'Faster Root-Cause'] },
  { id: 're-18', industry: 'Real Estate', icon: 'Globe', title: 'ESG & Sustainability Monitoring Agent', gap: 'ESG metrics are tracked manually and not audit-ready.', pain: 'Regulatory risk, poor investor confidence and inability to meet green targets.', solution: 'Monitors energy, water and waste, tracks emissions, and generates audit-ready ESG reports.', metrics: ['Transparent ESG', 'Audit-Ready Reports'] },
  { id: 're-19', industry: 'Real Estate', icon: 'Factory', title: 'Asset Maintenance Agent', gap: 'Maintenance after handover is reactive with limited asset health visibility.', pain: 'Frequent breakdowns, high lifecycle costs and tenant complaints.', solution: 'Reads IoT sensors, predicts failures, schedules maintenance and tracks AMC compliance.', metrics: ['Less Downtime', 'Lower Lifecycle Cost'] },
  { id: 're-20', industry: 'Real Estate', icon: 'Cpu', title: 'Multi-Agent Orchestration for Real Estate & Construction', gap: 'Functions operate in silos and decisions are fragmented across planning, procurement and sales.', pain: 'Delays, cost overruns and poor customer experience.', solution: 'Orchestrates progress, procurement, billing and sales agents to share signals and actions across the project lifecycle.', metrics: ['System-wide Coordination', 'Lower Operational Cost'] }
);

// --- PHARMA & LIFE SCIENCES USE CASES ---
INITIAL_USE_CASES.push(
  { id: 'ph-1', industry: 'Pharma', icon: 'FileText', title: 'Batch Manufacturing Record (BMR/BPR) Automation Agent', gap: 'Batch records remain paper-heavy, late-filled, fragmented and error-prone across MES, QC and operator notes.', pain: 'Batch release delays, regulatory observations, QA burnout and traceability gaps during recalls.', solution: 'Reads MES, QC, equipment logs and operator entries to auto-fill, validate and produce audit-ready BMRs; flags deviations instantly.', metrics: ['Faster Batch Release','Audit-Ready Records'] },
  { id: 'ph-2', industry: 'Pharma', icon: 'FileText', title: 'CAPA Documentation Agent', gap: 'CAPA processes are slow, manual and evidence is scattered across systems.', pain: 'Regulatory citations, repeat deviations and missed closure timelines.', solution: 'Drafts CAPA forms from deviations, tracks actions, escalates delays and maintains full traceability.', metrics: ['Faster CAPA Closure','Improved Traceability'] },
  { id: 'ph-3', industry: 'Pharma', icon: 'AlertTriangle', title: 'Deviation Investigation Agent', gap: 'Investigations are manual, reliant on senior QA, and data is siloed across MES/LIMS/logs.', pain: 'Recurring deviations, batch rejections and delayed releases.', solution: 'Correlates batch data, equipment logs and historical deviations to suggest root causes and auto-generate reports.', metrics: ['Shorter Investigation Cycle','Fewer Repeat Deviations'] },
  { id: 'ph-4', industry: 'Pharma', icon: 'File', title: 'Regulatory Submission Agent', gap: 'Submissions are document-heavy, manual and prone to formatting and completeness errors.', pain: 'Submission delays, rework, lost market opportunity.', solution: 'Compiles protocols, trial data and SOPs into submission-ready packages, validates formatting and flags missing info.', metrics: ['Faster Submissions','Lower Rework'] },
  { id: 'ph-5', industry: 'Pharma', icon: 'Shield', title: 'GMP Compliance Monitoring Agent', gap: 'GMP checks are reactive and checklist-driven; logs and training records are inconsistent.', pain: 'Regulatory findings, production stoppages and audit failures.', solution: 'Continuously reads logs, SOPs and training records to flag non-compliance and keep audit trails in sync.', metrics: ['Continuous Compliance','Lower Audit Findings'] },
  { id: 'ph-6', industry: 'Pharma', icon: 'FileText', title: 'Audit Readiness Agent', gap: 'Audit packs are manually compiled from scattered LIMS/MES/ERP sources.', pain: 'Late-night audit prep, documentation gaps and regulatory findings.', solution: 'Auto-generates evidence packs, validates completeness and keeps the site audit-ready daily.', metrics: ['Day-1 Audit Readiness','Less QA Overtime'] },
  { id: 'ph-7', industry: 'Pharma', icon: 'BookOpen', title: 'R&D Literature Intelligence Agent', gap: 'Researchers drown in literature and miss critical insights.', pain: 'Slow R&D cycles and missed breakthroughs.', solution: 'Summarises papers, patents and trials, highlights relevance to molecules and suggests directions.', metrics: ['Faster Insights','Improved R&D Throughput'] },
  { id: 'ph-8', industry: 'Pharma', icon: 'FileText', title: 'Clinical Trial Documentation Agent', gap: 'Trial docs are fragmented: CRFs, lab outputs and logs are inconsistent.', pain: 'Delayed milestones, regulatory queries and higher trial cost.', solution: 'Harmonises CRFs, lab results and logs to auto-generate trial summaries and flag deviations.', metrics: ['Faster Data Cleaning','Improved Compliance'] },
  { id: 'ph-9', industry: 'Pharma', icon: 'AlertTriangle', title: 'Protocol Deviation Analysis Agent', gap: 'Protocol deviations are underreported and not analysed across sites.', pain: 'Trial delays, data integrity risks and regulatory scrutiny.', solution: 'Detects, compares and analyses deviations against protocols and surfaces cross-site patterns.', metrics: ['Reduced Trial Risk','Faster Root Cause'] },
  { id: 'ph-10', industry: 'Pharma', icon: 'Database', title: 'Lab Data Harmonisation Agent', gap: 'Lab outputs vary by instrument, units and formats and require extensive cleaning.', pain: 'Delayed analysis and risk of incorrect conclusions.', solution: 'Normalises units/formats, validates quality and produces analysis-ready datasets.', metrics: ['Less Data Prep','Faster QC Analysis'] },
  { id: 'ph-11', industry: 'Pharma', icon: 'Calendar', title: 'Production Planning Agent', gap: 'Planning relies on static Excel/ERP, ignoring cleaning/changeover and QC release variability.', pain: 'Throughput loss, high WIP and cascading delays.', solution: 'Optimises schedules with equipment readiness, cleaning cycles and QC lead times; auto-reschedules on disruptions.', metrics: ['Higher Throughput','Lower WIP'] },
  { id: 'ph-12', industry: 'Pharma', icon: 'Thermometer', title: 'Cold Chain Monitoring Agent', gap: 'Cold chain sensors and logs are not harmonised nor tied to audit trails.', pain: 'Spoilage, recalls and regulatory exposure.', solution: 'Monitors IoT sensors continuously, detects excursions, triggers workflows and auto-documents incidents.', metrics: ['Fewer Excursions','Audit-Ready Logs'] },
  { id: 'ph-13', industry: 'Pharma', icon: 'Box', title: 'Inventory Optimisation Agent', gap: 'Inventory is expiry-sensitive and not optimised for batch-specific constraints.', pain: 'Expiry write-offs, stockouts and trapped working capital.', solution: 'Forecasts demand, recommends safety stock by batch and flags at-risk SKUs.', metrics: ['Lower Write-Offs','Fewer Stockouts'] },
  { id: 'ph-14', industry: 'Pharma', icon: 'FileText', title: 'Procurement Automation Agent', gap: 'Procurement is manual, compliance-heavy and slow.', pain: 'Late materials, high procurement cost and audit risk.', solution: 'Automates PR→PO workflows, benchmarks pricing and maintains procurement audit trails.', metrics: ['Faster Procurement','Lower Spend'] },
  { id: 'ph-15', industry: 'Pharma', icon: 'UserCheck', title: 'Vendor Qualification Agent', gap: 'Qualification is subjective, slow and scattered across reports.', pain: 'Supply disruptions and quality issues.', solution: 'Scores vendors from certificates, delivery history and audits to predict risk and recommend allocation.', metrics: ['Lower Supply Risk','Better Vendor Decisions'] },
  { id: 'ph-16', industry: 'Pharma', icon: 'TrendingUp', title: 'Demand Forecasting Agent', gap: 'Forecasts ignore tender volatility, doctor behaviour and campaign effects.', pain: 'Stockouts, overstock and poor S&OP performance.', solution: 'Incorporates market signals, seasonality and tenders to predict SKU-level demand and syncs with planning.', metrics: ['More Accurate Forecasts','Smoother S&OP'] },
  { id: 'ph-17', industry: 'Pharma', icon: 'BarChart', title: 'Portfolio Optimisation Agent', gap: 'Profitability by SKU×region×channel is opaque and misleads investment.', pain: 'Carrying unprofitable SKUs and wasted spend.', solution: 'Computes SKU-level profitability, recommends portfolio and pricing moves.', metrics: ['Improved Margins','Better Portfolio Decisions'] },
  { id: 'ph-18', industry: 'Pharma', icon: 'Users', title: 'Sales Enablement Agent (Medical Rep Assistant)', gap: 'Reps spend 40–50% time on admin and CRM hygiene.', pain: 'Low rep productivity and missed engagements.', solution: 'Suggests messages, next-best-actions, and auto-updates CRM after visits.', metrics: ['Higher Rep Productivity','Better CRM Hygiene'] },
  { id: 'ph-19', industry: 'Pharma', icon: 'Star', title: 'KOL Engagement Agent', gap: 'KOL interactions are manual, unstructured and poorly tracked.', pain: 'Missed advocacy and inconsistent scientific strategy.', solution: 'Scores KOLs, recommends engagement strategies and tracks interactions.', metrics: ['Stronger Advocacy','Better Engagement ROI'] },
  { id: 'ph-20', industry: 'Pharma', icon: 'Cpu', title: 'Multi-Agent Orchestration for Pharma Operations', gap: 'Functions (production, QC, QA, regulatory, supply) operate in silos.', pain: 'Fragmented decisions, delays and high friction.', solution: 'Orchestrates BMR, QC, CAPA, production and inventory agents to share signals and act holistically.', metrics: ['System Coordination','Lower Operational Cost'] }
);

// --- LOGISTICS & SUPPLY CHAIN USE CASES ---
INITIAL_USE_CASES.push(
  { id: 'log-1', industry: 'Logistics', icon: 'Package', title: 'Dispatch Automation Agent', gap: 'Dispatch planning remains Excel- and planner-driven with poor real-time sync to production and TMS.', pain: 'Missed SLAs, underutilised trucks, high freight cost and last-minute chaos.', solution: 'Reads orders, truck availability and SLAs to auto-assign trucks, sync with production readiness and trigger dispatch workflows.', metrics: ['Reduced Freight Cost','Higher Utilisation'] },
  { id: 'log-2', industry: 'Logistics', icon: 'Map', title: 'Route Optimisation Agent', gap: 'Routing is static, not traffic-aware or constrained by delivery windows and load types.', pain: 'Higher fuel consumption, delayed deliveries and driver frustration.', solution: 'Generates real-time optimised routes considering traffic, load, windows and disruptions; recalculates on the fly.', metrics: ['Lower Fuel Use','Faster Deliveries'] },
  { id: 'log-3', industry: 'Logistics', icon: 'Bell', title: 'Real-Time Exception Management Agent', gap: 'Exceptions are detected late; GPS, carrier and weather feeds aren’t integrated into automated workflows.', pain: 'Reactive firefighting, customer escalations and high cost-to-serve.', solution: 'Monitors GPS, carrier feeds, weather and traffic to detect and auto-resolve exceptions before impact.', metrics: ['Fewer Escalations','Lower Cost-to-Serve'] },
  { id: 'log-4', industry: 'Logistics', icon: 'Clock', title: 'ETA Prediction Agent', gap: 'ETAs are manual, static and rarely updated in real time.', pain: 'Customer disputes, warehouse congestion and poor planning.', solution: 'Predicts ETAs with AI using historical patterns and live data; updates stakeholders automatically.', metrics: ['Improved ETA Accuracy','Lower Customer Escalations'] },
  { id: 'log-5', industry: 'Logistics', icon: 'Box', title: 'Warehouse Slotting Optimisation Agent', gap: 'Slotting is static and driven by habit rather than picking data.', pain: 'Longer pick times, congestion and higher labour cost.', solution: 'Analyses pick frequency and order patterns to recommend continuous slotting and pick-path optimisation.', metrics: ['Faster Picking','Lower Fulfilment Cost'] },
  { id: 'log-6', industry: 'Logistics', icon: 'Cpu', title: 'Autonomous Picking & Putaway Agent', gap: 'Picking and putaway remain manual with poor dynamic guidance for operators.', pain: 'Productivity loss, high error rates and training burden.', solution: 'Guides operators with optimal pick paths and putaway suggestions, adapts to congestion and updates inventory in real time.', metrics: ['Higher Productivity','Lower Errors'] },
  { id: 'log-7', industry: 'Logistics', icon: 'RefreshCw', title: 'Inventory Reconciliation Agent', gap: 'Cycle counts are infrequent and disconnected from WMS/ERP.', pain: 'Stockouts despite system availability and excess safety stock.', solution: 'Continuously reconciles WMS, RFID/sensor counts and physical checks, flags mismatches and suggests corrections.', metrics: ['Higher Accuracy','Fewer Stockouts'] },
  { id: 'log-8', industry: 'Logistics', icon: 'Calendar', title: 'Inbound/Outbound Scheduling Agent', gap: 'Dock scheduling is reactive and first-come-first-serve, causing congestion.', pain: 'Truck delays, demurrage and overloaded warehouse teams.', solution: 'Intelligently schedules dock slots based on arrivals, urgency and load types and notifies carriers.', metrics: ['Shorter Turnaround','Lower Demurrage'] },
  { id: 'log-9', industry: 'Logistics', icon: 'FileText', title: 'Freight Audit & Reconciliation Agent', gap: 'Freight invoices often mismatch contracts and GPS logs; manual audits miss overcharges.', pain: 'Direct financial leakage and disputes with carriers.', solution: 'Reads invoices, contracts and GPS logs to flag mismatches, identify overcharges and auto-generate dispute files.', metrics: ['Recovered Spend','Faster Reconciliation'] },
  { id: 'log-10', industry: 'Logistics', icon: 'Globe', title: 'Customs Documentation Agent', gap: 'Export/import docs are manual, error-prone and dependent on a few experts.', pain: 'Shipment delays, demurrage and regulatory penalties.', solution: 'Auto-generates compliant customs documents from invoices, packing lists and HS codes and validates accuracy.', metrics: ['Faster Clearance','Fewer Delays'] },
  { id: 'log-11', industry: 'Logistics', icon: 'CheckCircle2', title: 'Proof-of-Delivery (POD) Automation Agent', gap: 'POD collection is inconsistent and often delayed; images/signatures are missing or illegible.', pain: 'Delayed invoicing, cash flow strain and disputes.', solution: 'Validates PODs automatically from images/signatures and updates ERP to enable faster invoicing.', metrics: ['Shorter DSO','Fewer Disputes'] },
  { id: 'log-12', industry: 'Logistics', icon: 'ShieldOff', title: 'Claims Processing Agent', gap: 'Damage and loss claims are slow, poorly documented and rely on manual evidence compilation.', pain: 'Under-recovered claims and high admin burden.', solution: 'Aggregates PODs, photos and logs to auto-generate claim files, submit and track resolutions.', metrics: ['Higher Recovery','Faster Resolution'] },
  { id: 'log-13', industry: 'Logistics', icon: 'Truck', title: 'Carrier Selection Agent', gap: 'Carrier choice is relationship-driven with poor performance benchmarking.', pain: 'Higher freight cost and unreliable deliveries.', solution: 'Scores carriers on cost, reliability and SLAs and recommends optimal carriers per lane.', metrics: ['Lower Freight Cost','Better On-Time Delivery'] },
  { id: 'log-14', industry: 'Logistics', icon: 'TrendingUp', title: 'Freight Rate Benchmarking Agent', gap: 'Rate benchmarking is irregular and lacks market context.', pain: 'Overpaying and weak negotiation leverage.', solution: 'Continuously benchmarks rates, flags overpriced lanes and recommends negotiation targets.', metrics: ['Lower Freight Spend','Stronger Negotiation'] },
  { id: 'log-15', industry: 'Logistics', icon: 'Users', title: 'Vendor Negotiation Agent', gap: 'Negotiations lack data and are inconsistent across buyers.', pain: 'Missed savings and variable contract terms.', solution: 'Prepares negotiation intelligence using performance and market data to recommend levers and targets.', metrics: ['Higher Savings','Consistent Contracts'] },
  { id: 'log-16', industry: 'Logistics', icon: 'LayoutList', title: 'Network Optimisation Agent', gap: 'Networks are static and never modelled against changing demand patterns.', pain: 'High logistics cost and poor service in emerging regions.', solution: 'Simulates network scenarios, optimises warehouse/hub locations and predicts cost-to-serve impacts.', metrics: ['Lower Network Cost','Improved Service'] },
  { id: 'log-17', industry: 'Logistics', icon: 'DollarSign', title: 'Cost-to-Serve Intelligence Agent', gap: 'True cost-to-serve by customer/region is opaque and misallocates margins.', pain: 'Serving unprofitable customers and margin leakage.', solution: 'Allocates freight, handling and returns cost to compute SKU×customer profitability and recommend pricing/service changes.', metrics: ['Clear Profitability','Better Pricing'] },
  { id: 'log-18', industry: 'Logistics', icon: 'Sync', title: 'Demand-Supply Alignment Agent', gap: 'Demand and supply teams operate in silos without real-time alignment mechanisms.', pain: 'Bullwhip effect, stockouts and emergency shipments.', solution: 'Aligns forecasts, replenishment and production plans and predicts shortages to recommend corrective actions.', metrics: ['Fewer Stockouts','Smoother S&OP'] },
  { id: 'log-19', industry: 'Logistics', icon: 'UserCheck', title: 'Warehouse Workforce Productivity Agent', gap: 'Labour planning is manual and not workload-linked, causing inefficiency.', pain: 'Over/under-staffing, high overtime and low morale.', solution: 'Optimises staffing dynamically by zone and skillset, predicts shortages and suggests cross-training.', metrics: ['Lower Labour Cost','Higher Throughput'] },
  { id: 'log-20', industry: 'Logistics', icon: 'Cpu', title: 'Multi-Agent Orchestration for End-to-End Logistics', gap: 'Functional silos prevent coordinated decision-making across dispatch, routing, warehouse and finance.', pain: 'Multiply cascading delays, manual handovers and high operational friction.', solution: 'Orchestrates dispatch, routing, warehouse and finance agents to share signals, coordinate actions and act autonomously.', metrics: ['System Coordination','Lower Operational Friction'] }
);

// --- MANUFACTURING INDUSTRY USE CASES ---
INITIAL_USE_CASES.push(
  { id: 'mfg-1', industry: 'Manufacturing', icon: 'Cpu', title: 'Autonomous Production Planning Agent', gap: 'Production planning is Excel- and planner-driven; APS tools rarely adapt to real-time disruptions or tribal knowledge.', pain: 'Outdated plans, frequent rescheduling, underutilised capacity and planner burnout.', solution: 'Reads ERP/MES/inventory/machine data, recalculates schedules on disruptions, applies SOPs and auto-reschedules.', metrics: ['Faster Rescheduling','Higher Utilisation'] },
  { id: 'mfg-2', industry: 'Manufacturing', icon: 'Activity', title: 'Real-Time Shop Floor Monitoring Agent', gap: 'MES updates are delayed, incomplete or manual; operators see issues before systems.', pain: 'Undetected downtime, unnoticed bottlenecks and silent OEE decline.', solution: 'Reads PLCs, sensors and MES logs, detects anomalies instantly and triggers corrective workflows.', metrics: ['Higher OEE','Faster Issue Resolution'] },
  { id: 'mfg-3', industry: 'Manufacturing', icon: 'Eye', title: 'Quality Inspection Agent (Vision + Text)', gap: 'Inspections are manual and subjective; documentation is incomplete.', pain: 'Higher scrap/rework, warranty claims and reputation damage.', solution: 'Combines vision AI and text analysis to detect defects, auto-document and suggest fixes.', metrics: ['Lower Scrap','Improved First-Pass Yield'] },
  { id: 'mfg-4', industry: 'Manufacturing', icon: 'Tool', title: 'Root-Cause Analysis Agent', gap: 'RCA is slow and data collection consumes most of the effort.', pain: 'Recurring defects, high scrap and slow CAPA closure.', solution: 'Correlates MES/QC/maintenance data, suggests likely root causes and auto-generates RCA docs.', metrics: ['Faster RCA','Fewer Repeat Defects'] },
  { id: 'mfg-5', industry: 'Manufacturing', icon: 'Zap', title: 'Predictive Maintenance Agent', gap: 'Maintenance is reactive or schedule-based, not condition-driven.', pain: 'Unplanned downtime, safety risk and wasted maintenance cost.', solution: 'Reads vibration/temperature/cycle counts to predict failures and schedule optimal maintenance windows.', metrics: ['Less Downtime','Lower Maintenance Cost'] },
  { id: 'mfg-6', industry: 'Manufacturing', icon: 'ZapOff', title: 'Energy Optimisation Agent', gap: 'Energy use is poorly measured and schedules ignore tariff windows.', pain: 'High energy bills, missed ESG targets and hidden utilisation waste.', solution: 'Monitors load curves, machine cycles and tariffs to shift load, reduce idle running and optimise schedules.', metrics: ['Lower Energy Spend','Improved ESG'] },
  { id: 'mfg-7', industry: 'Manufacturing', icon: 'Layers', title: 'Material Requirement Planning (MRP) Agent', gap: 'MRP is static and disconnected from real-time operations and supplier variability.', pain: 'Line stoppages, emergency procurement and excess inventory.', solution: 'Makes MRP dynamic: reads live production/inventory/supplier data, predicts shortages and triggers procurement.', metrics: ['Fewer Line Stops','Lower WIP'] },
  { id: 'mfg-8', industry: 'Manufacturing', icon: 'Box', title: 'Inventory Optimisation Agent', gap: 'Inventory rules are outdated; safety stock is arbitrary.', pain: 'Working capital trapped, obsolescence and production delays.', solution: 'Forecasts SKU-level demand, recommends safety stock and triggers replenishment autonomously.', metrics: ['Lower Carrying Cost','Fewer Stockouts'] },
  { id: 'mfg-9', industry: 'Manufacturing', icon: 'ShoppingCart', title: 'Procurement Automation Agent', gap: 'Procurement teams are overloaded with manual tasks and follow-ups.', pain: 'Delayed POs, price leakage and vendor chaos.', solution: 'Automates PR→PO workflows, benchmarks quotes and follows up with vendors automatically.', metrics: ['Faster PO Cycle','Lower Procurement Cost'] },
  { id: 'mfg-10', industry: 'Manufacturing', icon: 'Clipboard', title: 'Vendor Performance Intelligence Agent', gap: 'Vendor scoring is subjective and infrequent.', pain: 'Supply disruptions and weak negotiation leverage.', solution: 'Creates live vendor scores from delivery, quality and pricing history and predicts vendor risk.', metrics: ['Lower Supply Risk','Better Negotiation'] },
  { id: 'mfg-11', industry: 'Manufacturing', icon: 'FileText', title: 'Logistics Coordination Agent', gap: 'Dispatch coordination uses WhatsApp/phones/Excel and is not integrated with production readiness.', pain: 'Demurrage, wasted capacity and late shipments.', solution: 'Synchronises production readiness with carriers, optimises dispatch and updates ERP/WMS.', metrics: ['Lower Demurrage','Faster Shipments'] },
  { id: 'mfg-12', industry: 'Manufacturing', icon: 'BookOpen', title: 'SOP Automation Agent', gap: 'SOPs are long, text-heavy and not integrated into workflows.', pain: 'Process deviations, audit findings and inconsistent execution.', solution: 'Parses SOPs into step-by-step executable guidance, enforces compliance and auto-documents steps.', metrics: ['Fewer Deviations','Faster Training'] },
  { id: 'mfg-13', industry: 'Manufacturing', icon: 'FileText', title: 'Audit Documentation Agent', gap: 'Audit prep is manual and last-minute with scattered data.', pain: 'Audit failures, CAPAs and team burnout.', solution: 'Pulls ERP/MES/QC/maintenance data to generate audit packs and keep sites continuously audit-ready.', metrics: ['Day-1 Audit Readiness','Less QA Overtime'] },
  { id: 'mfg-14', industry: 'Manufacturing', icon: 'Shield', title: 'Safety Compliance Monitoring Agent', gap: 'Safety checks are manual and many violations go unreported.', pain: 'Accidents, insurance hikes and production stoppages.', solution: 'Analyses CCTV and sensor data to detect PPE violations, unsafe behaviour and maintain safety logs.', metrics: ['Fewer Incidents','Better Compliance'] },
  { id: 'mfg-15', industry: 'Manufacturing', icon: 'Clipboard', title: 'Batch Record Automation Agent', gap: 'Batch records are manual, paper-heavy and error-prone in process industries.', pain: 'Batch release delays, regulatory exposure and traceability gaps.', solution: 'Reads MES/QC/equipment logs to auto-fill and validate batch records and generate audit-ready documentation.', metrics: ['Faster Release','Audit-Ready Records'] },
  { id: 'mfg-16', industry: 'Manufacturing', icon: 'BarChart', title: 'Production Cost Intelligence Agent', gap: 'Costing is backward-looking and scattered across systems.', pain: 'Incorrect pricing, hidden losses and poor product-mix decisions.', solution: 'Combines machine, scrap, labour and energy data to produce real-time cost-per-batch and anomaly alerts.', metrics: ['Accurate Costing','Faster Root-Cause'] },
  { id: 'mfg-17', industry: 'Manufacturing', icon: 'TrendingUp', title: 'Demand Forecasting Agent', gap: 'Forecasting is spreadsheet-driven and not linked to real-time signals.', pain: 'Over/under-production, bullwhip and inefficiency.', solution: 'Delivers AI-driven SKU-level forecasts that ingest sales signals and sync with production and procurement.', metrics: ['More Accurate Forecasts','Smoother S&OP'] },
  { id: 'mfg-18', industry: 'Manufacturing', icon: 'PieChart', title: 'Profitability Optimisation Agent', gap: 'True profitability by SKU×customer×region is opaque.', pain: 'Serving unprofitable customers and misallocated capacity.', solution: 'Calculates real-time profitability, recommends portfolio/pricing moves and aligns production priorities.', metrics: ['Improved Margins','Better Portfolio'] },
  { id: 'mfg-19', industry: 'Manufacturing', icon: 'Users', title: 'Workforce Productivity Agent', gap: 'Labour planning is manual and not workload-linked.', pain: 'Over/under-staffing, high overtime and low morale.', solution: 'Optimises staffing per line by skill and load, predicts shortages and recommends cross-training.', metrics: ['Lower Labour Cost','Higher Throughput'] },
  { id: 'mfg-20', industry: 'Manufacturing', icon: 'Cpu', title: 'Multi-Agent Orchestration for End-to-End Operations', gap: 'Digital tools stay siloed; functions don’t share signals.', pain: 'Cascading delays, manual handovers and high friction.', solution: 'Orchestrates planning, MRP, quality, maintenance and logistics agents to act collaboratively and autonomously.', metrics: ['System Coordination','Lower Operational Friction'] }
);

// --- ELECTRIC VEHICLES USE CASES (added) ---
INITIAL_USE_CASES.push(
  { id: 'ev-1', industry: 'electric-vehicles', icon: 'Battery', title: 'Battery Cell Quality & Degradation Prediction Agent', gap: 'Cell testing is slow, degradation patterns are not predicted, and data is scattered across labs, BMS and suppliers.', pain: 'Thermal runaway risk, high warranty claims, inconsistent range, supplier disputes and brand damage.', solution: 'Continuously analyses cell-level test data, predicts degradation and failure risk, flags supplier inconsistencies and syncs with BMS and quality systems.', metrics: ['Lower Warranty Claims','Fewer Recalls','Improved Cell Yield'] },
  { id: 'ev-2', industry: 'electric-vehicles', icon: 'Tool', title: 'EV Powertrain Assembly & Torque Quality Agent', gap: 'Assembly depends on technician skill and torque consistency is not monitored or traced in real time.', pain: 'Motor noise, vibration, premature wear, rework and safety concerns.', solution: 'Analyses torque signatures, predicts assembly defects, recommends corrective actions and flags operator/tool deviations.', metrics: ['Lower Rework Rate','Fewer NVH Issues','Higher Assembly Yield'] },
  { id: 'ev-3', industry: 'electric-vehicles', icon: 'Globe', title: 'EV Supply Chain Risk & Semiconductor Availability Agent', gap: 'Semiconductor volatility, scarce battery materials and poor multi-tier visibility create fragile supply.', pain: 'Line shutdowns, delayed deliveries, high inventory cost and lost market share.', solution: 'Predicts supplier shortages, recommends alternate sourcing and flags geopolitical/logistics risks.', metrics: ['Reduced Line Downtime','Faster Sourcing','Lower Stockouts'] },
  { id: 'ev-4', industry: 'electric-vehicles', icon: 'Battery', title: 'EV Range Prediction & Calibration Intelligence Agent', gap: 'Range estimates are inconsistent and not personalised or predictive.', pain: 'Range anxiety, customer complaints and poor BMS calibration.', solution: 'Analyses driving patterns, predicts real-world range, recommends BMS calibration and flags energy anomalies.', metrics: ['More Accurate Range','Fewer Range Complaints','Improved Customer Satisfaction'] },
  { id: 'ev-5', industry: 'electric-vehicles', icon: 'BarChart', title: 'EV Plant Throughput & Bottleneck Prediction Agent', gap: 'Variable takt times and complex assembly create unpredictable bottlenecks.', pain: 'Missed targets, high WIP, overtime and revenue leakage.', solution: 'Predicts bottlenecks, recommends line balancing, optimises takt times and flags slow equipment.', metrics: ['Higher OEE','Lower WIP','On-time Delivery Rate'] },
  { id: 'ev-6', industry: 'electric-vehicles', icon: 'Battery', title: 'Battery Pack Assembly & Thermal Management Agent', gap: 'Pack assembly is sensitive to alignment, compression and TIM application, with hotspots hard to predict.', pain: 'Thermal incidents, reduced battery life, high scrap and regulatory scrutiny.', solution: 'Analyses assembly torque/pressure/TIM patterns, predicts hotspot formation and recommends corrective actions.', metrics: ['Fewer Thermal Events','Lower Scrap','Higher Pack Consistency'] },
  { id: 'ev-7', industry: 'electric-vehicles', icon: 'Cpu', title: 'Motor & Inverter Testing Intelligence Agent', gap: 'Motor and inverter testing is manual, slow and not correlated with field data.', pain: 'Noise/vibration, inverter overheating and warranty claims.', solution: 'Analyses torque curves and thermal signatures, predicts failure modes and recommends calibration.', metrics: ['Lower Warranty Exposure','Better Efficiency','Fewer Field Failures'] },
  { id: 'ev-8', industry: 'electric-vehicles', icon: 'MapPin', title: 'EV Charging Infrastructure Planning Agent', gap: 'Charging planning is reactive and not integrated with telematics.', pain: 'Underutilised chargers, overloaded stations and poor customer satisfaction.', solution: 'Analyses telematics and heatmaps, predicts charging demand and recommends station locations.', metrics: ['Higher Charger Utilisation','Lower Capex Waste','Better Coverage'] },
  { id: 'ev-9', industry: 'electric-vehicles', icon: 'FileText', title: 'Warranty Claims & Field Failure Prediction Agent', gap: 'Warranty management is reactive and not linked to manufacturing or telematics.', pain: 'High payouts, recalls and poor product improvement cycles.', solution: 'Analyses telematics, service and manufacturing data to predict failures and recommend proactive service.', metrics: ['Lower Payouts','Faster Root-Cause','Fewer Recalls'] },
  { id: 'ev-10', industry: 'electric-vehicles', icon: 'Download', title: 'EV Software OTA Update Intelligence Agent', gap: 'OTA updates are not personalised or validated across variants.', pain: 'Field software bugs, inconsistent UX and high service load.', solution: 'Analyses vehicle behaviour, predicts software issues, recommends targeted OTAs and validates compatibility.', metrics: ['Fewer Field Issues','Higher Feature Adoption','Lower Service Calls'] },
  { id: 'ev-11', industry: 'electric-vehicles', icon: 'CheckCircle2', title: 'Supplier Quality & PPAP Automation Agent', gap: 'PPAP and supplier validation are manual and slow to connect with production data.', pain: 'Late-stage escapes, supplier disputes and stoppages.', solution: 'Automates PPAP analysis, predicts supplier risk and flags documentation gaps.', metrics: ['Faster Supplier Validation','Lower Incoming Rejections','Reduced Supplier Risk'] },
  { id: 'ev-12', industry: 'electric-vehicles', icon: 'AlertTriangle', title: 'EV Safety & Crashworthiness Simulation Agent', gap: 'CAE cycles are slow and not predictive of real-world failures.', pain: 'Failed tests, redesign cost and delayed launches.', solution: 'Analyses simulation data, predicts failure zones, recommends reinforcements and optimises materials.', metrics: ['Faster Homologation','Fewer Design Iterations','Lower Crash Risk'] },
  { id: 'ev-13', industry: 'electric-vehicles', icon: 'DollarSign', title: 'Material Cost Optimisation & Design-to-Value Agent', gap: 'BOM costs are high and optimisation is manual and siloed.', pain: 'High vehicle price, low margins and slow design cycles.', solution: 'Analyses BOM drivers, recommends substitutions and predicts cost trends.', metrics: ['Lower BOM Cost','Improved Margin','Faster Design Iteration'] },
  { id: 'ev-14', industry: 'electric-vehicles', icon: 'Truck', title: 'Logistics & Finished Vehicle Distribution Agent', gap: 'EV logistics are battery-sensitive and not optimised for transit.', pain: 'Late deliveries, battery discharge and dealer dissatisfaction.', solution: 'Optimises routing, predicts delays, monitors SOC and syncs with dealers.', metrics: ['Fewer Transit Issues','Lower Transport Cost','Improved Delivery SLA'] },
  { id: 'ev-15', industry: 'electric-vehicles', icon: 'Recycle', title: 'EV Recycling & Battery Second-Life Agent', gap: 'End-of-life battery management is manual and not integrated with health data.', pain: 'High recycling cost and missed second-life revenue.', solution: 'Predicts second-life suitability, recommends repurposing vs recycling and optimises recovery.', metrics: ['Higher Recovery Value','Lower Disposal Cost','New Revenue Streams'] },
  { id: 'ev-16', industry: 'electric-vehicles', icon: 'Eye', title: 'Autonomous Driving Sensor Calibration Agent', gap: 'Sensor calibration drifts and is not validated across variants.', pain: 'Lane-keeping failures, phantom braking and safety risk.', solution: 'Analyses sensor fusion, predicts drift, recommends recalibration and validates performance.', metrics: ['Improved ADAS Reliability','Fewer Calibration Failures','Lower Service Interventions'] },
  { id: 'ev-17', industry: 'electric-vehicles', icon: 'Database', title: 'Telematics Data Intelligence Agent', gap: 'Telematics data is underutilised and not tied to design or service.', pain: 'Missed failure signals, poor range optimisation and slow product iteration.', solution: 'Turns telematics into predictive intelligence for maintenance, OTA and design feedback.', metrics: ['Faster Issue Detection','Better Range Predictions','Improved Product Iteration'] },
  { id: 'ev-18', industry: 'electric-vehicles', icon: 'Wrench', title: 'Dealer Service Operations Agent', gap: 'Service ops are unstandardized and not predictive, causing long repair times.', pain: 'High part replacements, low dealer productivity and customer frustration.', solution: 'Predicts service needs, recommends diagnostics and optimises scheduling for dealers.', metrics: ['Shorter Service Time','Lower Parts Cost','Higher Dealer Efficiency'] },
  { id: 'ev-19', industry: 'electric-vehicles', icon: 'Sparkles', title: 'EV Customer Experience & Personalisation Agent', gap: 'Customer experience is generic and not personalised to driving/charging behaviour.', pain: 'Low loyalty, weak app engagement and missed upsell.', solution: 'Analyses driving and charging, personalises communication and triggers proactive outreach.', metrics: ['Higher Retention','Better App Engagement','More Upsell'] },
  { id: 'ev-20', industry: 'electric-vehicles', icon: 'Cpu', title: 'Multi-Agent Orchestration for EV Manufacturing', gap: 'EV operations are siloed and decisions are fragmented across battery, powertrain, OTA and telematics.', pain: 'High cost of poor quality, slow improvement cycles and production delays.', solution: 'Orchestrates agents across the EV ecosystem so they share data, decisions and actions autonomously.', metrics: ['System-wide Coordination','Lower Warranty Cost','Higher Throughput'] }
);

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

// --- BLOGS / THOUGHT LEADERSHIP (Latest 3) ---
const BLOGS = [
  {
    id: 'blog-when-machines-lead',
    title: "When Machines Lead: The Human Future of Agentic AI",
    date: 'March 8, 2026',
    image: 'https://source.unsplash.com/1200x800/?artificial-intelligence,ai',
    excerpt: 'Agentic AI is no longer a lab curiosity — it is a new class of software that reasons, decides and acts. This essay explores how leaders can design agentic systems that augment human judgment while preserving accountability.',
    content: `<p>Agentic AI — systems that take decisions and execute tasks with minimal human supervision — is arriving faster than most organisations expect. Unlike narrow automation, agentic systems are designed to perceive, plan and act across multiple systems and stakeholders. That power is transformative: when done right, agents reduce cognitive load, shorten decision cycles and unlock entirely new operating models.</p>
    <p>But power without guardrails is dangerous. The real leadership question is not "Can we build agents?" but "How do we embed them so humans retain oversight, values, and accountability?" Successful deployments pair agent autonomy with clear decision gates, transparent reasoning traces, and human-in-the-loop escalation for edge cases. They invest more in orchestration and governance than in models alone.</p>
    <p>Practical steps: start with high-frequency low-risk workflows, instrument decision logs from day one, codify acceptance criteria and measure outcomes in dollars and time — not just accuracy. Agentic systems that earn trust become partners, not replacements.</p>`
  },
  {
    id: 'blog-orchestra-autonomy',
    title: 'The Orchestra of Autonomy: Designing Agentic Systems that Earn Trust',
    date: 'February 24, 2026',
    image: 'https://source.unsplash.com/1200x800/?technology,network',
    excerpt: 'Agentic systems must operate like an orchestra — many specialised agents playing together under a conductor of governance and metrics. This post outlines design patterns and metrics that turn promising pilots into repeatable value.',
    content: `<p>Think of agentic AI as an orchestra: many specialised players (agents) each perform distinct parts, but they must harmonise to produce value. The conductor is your orchestration layer: policies, contracts, signal routing, and error handling that ensure agents don’t contradict each other or create unsafe side effects.</p>
    <p>Design patterns that work include capability contracts (clear input/output expectations), heartbeat & health channels (live telemetry), rollback & compensation flows, and human approval lanes. Metrics should focus on business outcomes — cycle time, touch avoidance, cost-per-transaction — rather than model-centric measures alone.</p>
    <p>Organisations that succeed treat orchestration and operational engineering as first-class products. The result is resilient autonomy that scales across teams and legacy systems.</p>`
  },
  {
    id: 'blog-from-bots-to-colleagues',
    title: 'From Bots to Colleagues: The Radical ROI of Truly Agentic AI',
    date: 'January 15, 2026',
    image: 'https://source.unsplash.com/1200x800/?robot,industry',
    excerpt: 'Early adopters are no longer asking whether agentic AI works — they are asking how fast they can scale it. This article shows case-driven ROI patterns and practical playbooks for industrial adopters.',
    content: `<p>When agents move from pilots into live operations, their impact compounds. One deployed agent that eliminates manual handoffs in a production line prevents dozens of downstream delays, slashes rework, and changes how teams prioritise work. That compound effect — not isolated model improvements — drives the most meaningful ROI.</p>
    <p>Leaders should map value chains, identify choke points, and ask: which repetitive, cross-system decisions would benefit from continuous sensing and automated action? Start small with measurable KPIs, instrument end-to-end value flows, and reinvest measured gains into expanding agent coverage.</p>
    <p>The future of work will see agents as colleagues: they surface options, execute agreed actions, and leave auditable trails. The companies that reframe roles and incentives around this new reality will capture disproportionate advantage.</p>`
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

const Button = ({ children, variant = 'primary', className = '', onClick, icon: Icon, type = 'button', disabled = false, style = {} }) => {
  const baseStyle = "inline-flex items-center justify-center px-5 py-2.5 rounded-xl font-semibold transition-all duration-300 text-[14px] tracking-wide relative overflow-hidden group";
  
  const variants = {
    primary: "bg-[#2EC5CE] text-white hover:bg-[#25a8b0] hover:shadow-lg hover:-translate-y-1 shadow-md disabled:bg-gray-300",
    secondary: "border-2 border-[#5856D6] text-[#5856D6] hover:bg-[#E8E7FF] hover:-translate-y-1",
    purple: "bg-[#5856D6] text-white hover:bg-[#4644ab] hover:shadow-lg hover:-translate-y-1",
    text: "text-[#5856D6] hover:text-[#2EC5CE] p-0 font-bold",
    danger: "bg-red-500 text-white hover:bg-red-600 hover:shadow-lg"
  };

  // Button is a simple styled control; section injection is handled at App scope.
  
  return (
    <button type={type} disabled={disabled} className={`${baseStyle} ${variants[variant]} ${className}`} onClick={onClick} style={style}>
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

const UseCasesPage = ({ navigate, useCases, industries, initialIndustry = null, filter = null, onFilterChange = null }) => {
  const [selectedIndustry, setSelectedIndustry] = useState(initialIndustry || 'All');
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [activeUseCase, setActiveUseCase] = useState(null);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    if (initialIndustry) {
      setSelectedIndustry(initialIndustry);
      if (onFilterChange) onFilterChange(initialIndustry);
    }
  }, [initialIndustry, onFilterChange]);

  // If parent provides a controlled filter, sync local state
  useEffect(() => {
    if (filter !== null && filter !== undefined) {
      setSelectedIndustry(filter);
    }
  }, [filter]);

  const filteredCases = useMemo(() => {
    const normalizeKey = (v) => (v || '').toString().toLowerCase().replace(/[^a-z0-9]/g, '');
    const selectedKey = selectedIndustry === 'All' ? 'all' : selectedIndustry;

    // Build mapping from normalized names/ids -> canonical industry id
    const industryLookup = new Map();
    industries.forEach(ind => {
      industryLookup.set(normalizeKey(ind.id), ind.id);
      industryLookup.set(normalizeKey(ind.name), ind.id);
    });

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
              onChange={(e) => {
                const v = e.target.value;
                setSearchQuery(v);
                if (!v) { setSuggestions([]); return; }
                const q = v.toLowerCase();
                const matches = [
                  ...new Set([
                    ...useCases.filter(u => (u.title||'').toLowerCase().includes(q)).map(u => u.title),
                    ...industries.filter(i => (i.name||'').toLowerCase().includes(q)).map(i => i.name)
                  ])
                ].slice(0,6);
                setSuggestions(matches);
              }}
              placeholder="Search workflows..."
              className="w-full bg-transparent focus:outline-none text-[#212121]"
            />
            {suggestions.length > 0 && (
              <div className="absolute left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-40">
                {suggestions.map((s, i) => (
                  <button key={i} onClick={() => {
                    setSearchQuery(s);
                    setSuggestions([]);
                    const ind = industries.find(it => it.name === s);
                    if (ind) {
                      if (onFilterChange) onFilterChange(ind.id); else setSelectedIndustry(ind.id);
                    }
                  }} className="w-full text-left px-4 py-2 hover:bg-gray-50">
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* This Use Cases view is intended to be industry-scoped. If opened without an industry, the page redirects to Industries. */}
        {/* Filter bar intentionally removed to avoid an 'All' view. */}

        {/* Grid */}
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
                  <div className="flex items-center">
                    <span>View Details</span><ArrowRight className="w-4 h-4 ml-2" />
                  </div>
                  <button onClick={(e) => { e.stopPropagation(); setExpandedId(expandedId === useCase.id ? null : useCase.id); }} aria-expanded={expandedId === useCase.id} className="ml-4 text-sm text-gray-500 bg-gray-50 px-3 py-1 rounded-full hover:bg-gray-100">
                    {expandedId === useCase.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>

                {expandedId === useCase.id && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg text-sm text-gray-700">
                    <div className="mb-3">
                      <div className="font-bold text-[13px] text-gray-600 mb-1">Problem</div>
                      <div className="text-sm">{useCase.gap}</div>
                    </div>
                    <div className="mb-3">
                      <div className="font-bold text-[13px] text-gray-600 mb-1">Impact</div>
                      <div className="text-sm">{useCase.pain}</div>
                    </div>
                    <div className="mb-3">
                      <div className="font-bold text-[13px] text-gray-600 mb-1">Kinexus Solution</div>
                      <div className="text-sm">{useCase.solution}</div>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {useCase.metrics.map((m, i) => (
                        <div key={i} className="px-3 py-1 bg-white border rounded-full text-xs font-semibold">{m}</div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal (rendered via portal to avoid clipping by transformed/overflowed ancestors) */}
      {activeUseCase && ReactDOM.createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#212121]/60 backdrop-blur-sm" onClick={() => setActiveUseCase(null)}></div>
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-full sm:max-w-4xl max-h-[90vh] overflow-y-auto animate-fade-in-up mx-4 sm:mx-auto">
              <div className="sticky top-0 bg-white/95 backdrop-blur z-10 p-6 border-b border-gray-100 flex justify-between items-start">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-[#E8E7FF] rounded-2xl flex items-center justify-center text-[#5856D6]">
                  {React.createElement(getIcon(activeUseCase.icon), { className: "w-8 h-8" })}
                </div>
                <div>
                  <div className="text-sm font-semibold text-[#5856D6] uppercase tracking-wider mb-1">{industries.find(i => i.id === activeUseCase.industry)?.name || activeUseCase.industry}</div>
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
        </div>,
        document.body
      )}
    </div>
  );
};

// `IndustryPage` is provided as a separate file at `src/pages/IndustryPage.js`.

// --- ADMIN DASHBOARD ---
const AdminDashboard = ({ navigate, leads, clearLeads, downloadLeads, useCases, setUseCases, industries, setIndustries, blogs, setBlogs }) => {
  const [activeTab, setActiveTab] = useState('leads');
  
  // Use Case Form State
  const [newUseCase, setNewUseCase] = useState({
    title: '', industry: industries[0].name, icon: 'Workflow', gap: '', pain: '', solution: '', metrics: ''
  });

  // Industry Form State
  const [newIndustry, setNewIndustry] = useState({
    name: '', icon: 'Factory', desc: '', hero: '', subhead: '', gap: '', pain: '', solution: ''
  });

  // Blog management state
  const [editingBlog, setEditingBlog] = useState(null);
  const [blogForm, setBlogForm] = useState({ title: '', date: '', image: '', excerpt: '', content: '', status: 'draft', author: 'Kinexus Team' });

  const resetBlogForm = () => setBlogForm({ title: '', date: '', image: '', excerpt: '', content: '', status: 'draft', author: 'Kinexus Team' });
  const [previewMode, setPreviewMode] = useState(false);

  const handleEditBlog = (b) => {
    setEditingBlog(b.id);
    setBlogForm({ ...b });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteBlog = (id) => {
    if (!window.confirm('Delete this blog?')) return;
    const updated = blogs.filter(b => b.id !== id);
    setBlogs(updated);
    if (editingBlog === id) { setEditingBlog(null); resetBlogForm(); }
  };

  const handleTogglePublish = (id) => {
    const updated = blogs.map(b => b.id === id ? { ...b, status: b.status === 'published' ? 'draft' : 'published', date: b.status === 'published' ? b.date : new Date().toLocaleDateString() } : b);
    setBlogs(updated);
  };

  const handleImageUpload = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => { setBlogForm(f => ({ ...f, image: reader.result })); };
    reader.readAsDataURL(file);
  };

  const handleSaveBlog = (e) => {
    e.preventDefault();
    const payload = { ...blogForm };
    if (!payload.title) { alert('Title required'); return; }
    if (!payload.date && payload.status === 'published') payload.date = new Date().toLocaleDateString();
    if (editingBlog) {
      const updated = blogs.map(b => b.id === editingBlog ? { ...b, ...payload } : b);
      setBlogs(updated);
      setEditingBlog(null);
    } else {
      const id = `blog-${Date.now()}`;
      const newBlog = { id, ...payload };
      setBlogs([newBlog, ...blogs]);
    }
    resetBlogForm();
  };

  const handleAddUseCase = (e) => {
    e.preventDefault();
    const useCase = {
      id: `custom-${Date.now()}`,
      ...newUseCase,
      metrics: newUseCase.metrics.split(',').map(m => m.trim()),
      // store canonical industry id when adding from Admin select (the select uses industry names)
      industry: (() => {
        const chosen = newUseCase.industry;
        // find by name or id
        const found = industries.find(i => i.name === chosen || i.id === chosen);
        return found ? found.id : chosen;
      })()
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
            <div className="bg-white p-8 rounded-2xl shadow-card mt-8">
              <h2 className="text-2xl font-bold mb-4">Manage Blogs</h2>
              <div className="grid md:grid-cols-2 gap-6">
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
                    <div>
                      <label className="text-sm block mb-1">Content</label>
                      <ReactQuill theme="snow" value={blogForm.content} onChange={val => setBlogForm({...blogForm, content: val})} />
                    </div>
                    <div className="flex items-center space-x-4">
                      <label className="flex items-center space-x-2"><input type="checkbox" checked={blogForm.status === 'published'} onChange={e => setBlogForm({...blogForm, status: e.target.checked ? 'published' : 'draft'})} /> <span className="text-sm">Publish</span></label>
                      <Button type="submit">Save</Button>
                      <Button variant="secondary" onClick={() => { setEditingBlog(null); resetBlogForm(); }}>Reset</Button>
                      <button type="button" onClick={() => setPreviewMode(v => !v)} className="text-sm text-gray-600 underline">{previewMode ? 'Hide Preview' : 'Preview'}</button>
                    </div>
                  </form>
                </div>

                <div>
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

  const resolveIndustryId = (industryStr, industriesList) => {
    if (!industryStr) return null;
    const key = (industryStr || '').toString().toLowerCase().replace(/[^a-z0-9]/g, '');
    const found = industriesList.find(i => {
      const nid = (i.id || '').toString().toLowerCase().replace(/[^a-z0-9]/g, '');
      const nname = (i.name || '').toString().toLowerCase().replace(/[^a-z0-9]/g, '');
      return nid === key || nname === key;
    });
    return found ? found.id : null;
  };

  const [useCases, setUseCases] = useState(() => {
    const saved = localStorage.getItem('kinexus_useCases');
    const source = saved ? JSON.parse(saved) : INITIAL_USE_CASES;
    // canonicalize industry values to industry.id where possible
    const canonicalized = source.map(u => {
      try {
        const canonical = resolveIndustryId(u.industry || u.industry === 0 ? u.industry : '', INITIAL_INDUSTRIES) || u.industry;
        return { ...u, industry: canonical };
      } catch (e) {
        return u;
      }
    });

    // remove duplicates (by normalized title + industry)
    const seen = new Set();
    const unique = [];
    canonicalized.forEach(u => {
      const key = ((u.title || '') + '|' + (u.industry || '')).toString().toLowerCase().replace(/[^a-z0-9]/g, '');
      if (!seen.has(key)) {
        seen.add(key);
        unique.push(u);
      }
    });
    return unique;
  });

  // Ensure useCases industry fields stay canonical if `industries` changes
  useEffect(() => {
    setUseCases(prev => prev.map(u => {
      try {
        const canonical = resolveIndustryId(u.industry || '', industries) || u.industry;
        return { ...u, industry: canonical };
      } catch (e) {
        return u;
      }
    }));
  }, [industries]);

  // Leads State
  const [leads, setLeads] = useState(() => {
    return JSON.parse(localStorage.getItem('kinexus_leads') || '[]');
  });

  // Blogs State (persisted)
  const [blogs, setBlogs] = useState(() => {
    const saved = localStorage.getItem('kinexus_blogs');
    if (saved) return JSON.parse(saved);
    // default seed: mark existing BLOGS published
    return BLOGS.map(b => ({ ...b, status: b.status || 'published' }));
  });

  // ensure blogs persist
  useEffect(() => {
    try { localStorage.setItem('kinexus_blogs', JSON.stringify(blogs)); } catch (e) {}
  }, [blogs]);

  // Centralized filter for Use Cases so clicks from any page use the same function
  const [useCasesFilter, setUseCasesFilter] = useState('All');

  useEffect(() => {
    const navigateFromPath = () => {
      const path = window.location.pathname || '/';
      if (path === '/admin') {
        setCurrentView('admin');
        setViewParams(null);
        return;
      }
      if (path.startsWith('/industry/')) {
        const parts = path.split('/');
        const id = parts[2];
        setCurrentView('industry');
        setViewParams({ id });
        return;
      }
      if (path === '/use-cases' || path === '/usecases') {
        setCurrentView('useCases');
        setViewParams(null);
        return;
      }
      if (path === '/roi') { setCurrentView('roi'); setViewParams(null); return; }
      if (path === '/contact') { setCurrentView('contact'); setViewParams(null); return; }
      if (path === '/about') { setCurrentView('about'); setViewParams(null); return; }
      setCurrentView('home');
    };

    navigateFromPath();
    window.addEventListener('popstate', navigateFromPath);
    return () => window.removeEventListener('popstate', navigateFromPath);
  }, []);

  useEffect(() => {
    const scroller = document.querySelector('.app-scroll');
    if (scroller) scroller.scrollTo({ top: 0, left: 0 });
    else window.scrollTo(0, 0);
  }, [currentView, viewParams]);

  // parallax state
  const [scrollY, setScrollY] = useState(0);
  const mainRef = useRef(null);
  const [showDownArrow, setShowDownArrow] = useState(false);
  // support multiple background layers
  const [bgUrls, setBgUrls] = useState([]);

  const navigate = (view, params = null) => {
    setCurrentView(view);
    setViewParams(params);
    // update browser URL for deep-linking to admin and industry pages
    try {
      let path = '/';
      if (view === 'admin') path = '/admin';
      else if (view === 'industry' && params?.id) path = `/industry/${params.id}`;
      else if (view === 'useCases') path = '/use-cases';
      else if (view === 'blog' && params?.id) path = `/blog/${params.id}`;
      else if (view === 'contact') path = '/contact';
      else if (view === 'about') path = '/about';
      else if (view === 'roi') path = '/roi';
      window.history.pushState({}, '', path);
    } catch (e) {
      // ignore
    }
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

  const addLead = (lead) => {
    const id = `lead-${Date.now()}`;
    const date = new Date().toISOString();
    const record = { id, date, ...lead };
    const updated = [record, ...leads];
    setLeads(updated);
    localStorage.setItem('kinexus_leads', JSON.stringify(updated));
    return record;
  };

  // View Routing
  const renderView = () => {
    switch (currentView) {
      case 'home': return <HomePage navigate={navigate} blogs={blogs} />;
      case 'blog': return <BlogPage id={viewParams?.id} navigate={navigate} blogs={blogs} />;
      case 'industry': return <IndustryPage id={viewParams?.id} navigate={navigate} industries={industries} useCases={useCases} />;
      case 'industries': return <IndustriesPage navigate={navigate} industries={industries} />; 
      case 'services': return <ServicesPage navigate={navigate} />;
      case 'service': return <ServicesPage navigate={navigate} />;
      case 'useCases': return <ExternalUseCasesPage navigate={navigate} useCases={useCases} industries={industries} initialIndustry={viewParams?.industry} filter={useCasesFilter} onFilterChange={(v) => setUseCasesFilter(v)} />;
      case 'roi': return <ROIPage navigate={navigate} industries={industries} initialIndustry={viewParams?.id} />;
      case 'contact': return <ContactPage navigate={navigate} addLead={addLead} industries={industries} />;
      case 'about': return <About navigate={navigate} />;
      case 'admin': return (
        <AdminGate>
          <AdminHub
            navigate={navigate}
            leads={leads}
            clearLeads={clearLeads}
            downloadLeads={downloadLeads}
            useCases={useCases}
            setUseCases={setUseCases}
            industries={industries}
            setIndustries={setIndustries}
            blogs={blogs}
            setBlogs={setBlogs}
          />
        </AdminGate>
      );
      default: return <HomePage navigate={navigate} />;
    }
  };

  // bgUrl is computed by effect; default null

  // Show/hide down arrow based on scrollable content and position
  useEffect(() => {
    const scroller = mainRef.current || document.querySelector('.app-scroll');
    if (!scroller) return;
    const update = () => {
      const scrollTop = scroller === window ? window.scrollY : scroller.scrollTop;
      const clientH = scroller === window ? window.innerHeight : scroller.clientHeight;
      const scrollH = scroller === window ? document.documentElement.scrollHeight : scroller.scrollHeight;
      const canScroll = scrollH > clientH + 10;
      const notAtBottom = scrollTop + clientH + 20 < scrollH;
      setShowDownArrow(canScroll && notAtBottom);
    };
    update();
    scroller.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      scroller.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, [mainRef, currentView, viewParams, bgUrls]);

  // Remove empty section immediately after hero on Home (if present)
  useEffect(() => {
    if (currentView !== 'home') return;
    const root = mainRef.current || document.querySelector('.app-scroll');
    if (!root) return;
    try {
      const first = root.querySelector('.home-section');
      if (!first) return;
      let next = first.nextElementSibling;
      // skip text nodes
      while (next && next.nodeType !== 1) next = next.nextSibling;
      if (next && next.tagName === 'SECTION') {
        const html = (next.innerHTML || '').trim();
        const text = (next.textContent || '').trim();
        const hasMeaningful = html.length > 8 && text.length > 8;
        if (!hasMeaningful) {
          next.parentNode && next.parentNode.removeChild(next);
          // force recompute backgrounds
          setTimeout(() => { try { window.dispatchEvent(new Event('resize')); } catch (e) {} }, 60);
        }
      }
    } catch (e) {
      // ignore
    }
  }, [currentView]);

  // Scroll to next visible section inside the main scroller
  const scrollToNextSection = () => {
    const scroller = mainRef.current || document.querySelector('.app-scroll');
    if (!scroller) return;

    const isWindowScroller = scroller === window || scroller === document.body || scroller === document.documentElement;
    const clientH = isWindowScroller ? window.innerHeight : scroller.clientHeight;
    const scrollTop = isWindowScroller ? window.scrollY : (scroller.scrollTop || 0);
    const scrollH = isWindowScroller ? document.documentElement.scrollHeight : scroller.scrollHeight;

    // Target one full viewport down from current position, clamped to available scroll range
    const rawTarget = scrollTop + clientH;
    const maxTop = Math.max(0, scrollH - clientH);
    const target = Math.min(rawTarget, maxTop);
    if (Math.abs(target - scrollTop) < 8) return; // already at or very near bottom

    if (isWindowScroller) window.scrollTo({ top: Math.round(target), behavior: 'smooth' });
    else scroller.scrollTo({ top: Math.round(target), behavior: 'smooth' });
  };

  // Inject a single down-button into the first Hero (.home-section) only
  useEffect(() => {
    const scroller = mainRef.current || document.querySelector('.app-scroll');
    if (!scroller) return;

    const container = scroller === window ? document : scroller;
    try {
      // remove any previously-injected buttons first
      const previous = container.querySelectorAll('.section-down-btn');
      previous.forEach((b) => b.remove());

      const hero = container.querySelector('.home-section');
      if (!hero) return;
      if (hero.querySelector('.section-down-btn')) return;

      const btn = document.createElement('button');
      btn.className = 'section-down-btn';
      btn.type = 'button';
      btn.setAttribute('aria-label', 'Scroll to next section');
      btn.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
          <path d="M12 5v14M19 12l-7 7-7-7" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
        </svg>`;
      btn.addEventListener('click', scrollToNextSection);
      btn.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); scrollToNextSection(); } });
      hero.appendChild(btn);
    } catch (e) {
      // ignore injection errors
    }

    return () => {
      try {
        const existing = container.querySelectorAll('.section-down-btn');
        existing.forEach((b) => b.remove());
      } catch (e) {}
    };
  }, [mainRef, currentView, viewParams]);

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
        {/* Down arrow indicator when page has more content below the fold */}
        <div
          aria-hidden
          onClick={scrollToNextSection}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') scrollToNextSection(); }}
          className={`down-arrow cursor-pointer transition-opacity duration-300 ${showDownArrow ? 'opacity-100' : 'opacity-0'}`}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
            <path d="M12 5v14M19 12l-7 7-7-7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
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

// (metrics overlay functions removed — restoring static overlay below)

const HomePage = ({ navigate, blogs = [] }) => {

  const showInsights = (typeof process !== 'undefined' && process.env && process.env.REACT_APP_SHOW_INSIGHTS === 'true') || (typeof window !== 'undefined' && window.localStorage && window.localStorage.getItem('kinexus_show_insights') === 'true');

  return (
    <div className="animate-fade-in bg-white overflow-x-hidden">
      <section className="home-section relative pt-0 pb-8 lg:pt-0 lg:pb-12 overflow-hidden bg-grid-pattern" data-bg="/assets/hero-retail-1600.jpg">
        <div className="absolute top-20 right-0 w-[600px] h-[600px] bg-[#E8E7FF] rounded-full mix-blend-multiply filter blur-[120px] opacity-40 animate-blob"></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10 grid lg:grid-cols-2 gap-16 items-center">
          <ScrollReveal>
            <div className="inline-flex items-center space-x-2 bg-white/50 backdrop-blur-sm border border-purple-100 text-[#5856D6] px-4 py-2 rounded-full text-sm font-bold -mt-2 mb-3 shadow-sm">
               <Zap className="w-4 h-4 fill-current" /><span>Enterprise Agentic AI Platform</span>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold leading-[1.12] mb-4 text-[#212121] tracking-tight"><span className="text-gradient">Scale your operations</span>, not your overhead.</h1>
            <p className="text-base text-[#6B6B6B] mb-8 leading-relaxed max-w-xl">Manual workflows are a tax on your growth. Reclaim thousands of high-value hours by deploying autonomous agents that handle the <span className="text-gradient">how</span>, so your team can focus on the <span className="text-gradient">why</span>.</p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mb-8">
              <Button onClick={() => navigate('contact')} icon={ArrowRight}>Let's Talk About Your Reality</Button>
              <Button variant="secondary" onClick={() => navigate('useCases')} icon={PlayCircle}>Explore Use Cases</Button>
              <Button variant="purple" onClick={() => navigate('roi')} icon={DollarSign}>ROI Calculator</Button>
            </div>
          </ScrollReveal>
          <div className="relative overflow-visible">
            <div className="w-full aspect-square relative flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-tr from-[#E8E7FF] to-white rounded-full opacity-30 blur-3xl"></div>

              <div className="relative w-full flex items-center justify-center">
                <img
                  src={kinexusHero}
                  alt="Kinexus hero"
                  className="block w-[110%] md:w-[120%] lg:w-[130%] h-auto object-cover rounded-3xl shadow-2xl transform transition-transform duration-700 hover:scale-105 -ml-6 md:-ml-12 animate-float"
                />

                {/* Metrics overlay — bottom-right, overlaying hero image (20% width, 15pt right padding) */}
                <div className="absolute z-40" style={{ right: '15pt', bottom: '6%', width: '20%', minWidth: '200px' }}>
                  <div className="glass-card p-4 rounded-2xl shadow-lg hover-lift">
                    <div className="grid grid-cols-1 gap-3 text-center">
                      <div className="p-3 rounded-lg bg-[#E8F7FF]">
                        <div className="text-xl md:text-2xl font-extrabold">35%</div>
                        <div className="text-xs text-gray-600">Reduction in inspection time</div>
                      </div>
                      <div className="p-3 rounded-lg bg-[#FFF4F0]">
                        <div className="text-xl md:text-2xl font-extrabold">50%</div>
                        <div className="text-xs text-gray-600">Fewer defects reaching customers</div>
                      </div>
                      <div className="p-3 rounded-lg bg-[#F0FFF7]">
                        <div className="text-xl md:text-2xl font-extrabold">10x</div>
                        <div className="text-xs text-gray-600">Typical ROI within 24 months</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* decorative floating blobs */}
                <div className="absolute -left-10 -top-8 w-36 h-36 bg-[#E8E7FF] rounded-full opacity-40 animate-blob" />
                <div className="absolute right-6 bottom-6 w-20 h-20 bg-[#2EC5CE] rounded-full opacity-30 animate-blob" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Reality Check */}
      <section className="home-section bg-white" data-bg="/assets/hero-manufacturing-1600.jpg" style={{ paddingTop: '20pt', paddingBottom: '3rem' }}>
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

      

      

      {/* What Makes Us Different */}
      <section className="home-section py-12 bg-white" data-bg="/assets/hero-education-1600.jpg">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeading title="Why Companies Choose Kinexus Over Point Solutions" />
          <div className="mt-8 grid md:grid-cols-2 gap-6">
            <div className="bg-gray-50 p-8 rounded-2xl">
              <h4 className="font-bold mb-4 text-gray-700 text-lg md:text-xl">Most 'AI' Solutions</h4>
              <ul className="space-y-3 text-gray-700 text-base md:text-lg">
                <li>Automate one task</li>
                <li>You integrate it yourself</li>
                <li>Generic AI models</li>
                <li>Works in isolation</li>
                <li>They disappear after sale</li>
              </ul>
            </div>
            <div className="bg-gradient-to-br from-[#5856D6] to-[#2EC5CE] p-8 rounded-2xl text-white">
              <h4 className="font-bold mb-4 text-lg md:text-xl">Kinexus</h4>
              <ul className="space-y-3 text-white text-base md:text-lg">
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

      {/* Agentic Implementation Workflow (business-friendly sneak peek) */}
      <section className="home-section py-12 bg-white" data-bg="/assets/hero-services-1600.jpg">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeading title="Agentic Implementation Workflow" subtitle="A concise, business-friendly sneak peek at how we deliver production-ready agentic workflows" />
          <div className="mt-8 grid grid-cols-1 md:grid-cols-5 gap-6 items-start">
            {[
              { step: '01', title: 'Discover', subtitle: 'Prioritise high-impact workflows', body: 'We run rapid ROI audits and stakeholder interviews to identify decision-heavy processes and measurable KPIs.' },
              { step: '02', title: 'Design', subtitle: 'Agent spec & orchestration plan', body: 'Define agent responsibilities, inputs/outputs, failure modes and orchestration contracts (LangGraph/Swarms).' },
              { step: '03', title: 'Build', subtitle: 'Integrations & agent development', body: 'Implement connectors, build agents, and instrument monitoring and telemetry for operational visibility.' },
              { step: '04', title: 'Validate', subtitle: 'HITL safety & governance', body: 'Establish guardrails, audit logs, escalation paths and rollout criteria so leaders can trust agent decisions.' },
              { step: '05', title: 'Scale', subtitle: 'Operationalise & expand', body: 'Harden reliability, measure outcomes against KPIs, and extend agents across processes for sustained value.' }
            ].map((s, i) => (
              <div key={i} className="p-6 rounded-2xl bg-white border shadow-sm flex flex-col h-full">
                <div className="flex items-start space-x-4 mb-4">
                  <div className="w-12 h-12 rounded-lg bg-[#F3F5FF] text-[#5856D6] flex items-center justify-center font-bold">{s.step}</div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-lg">{s.title}</h4>
                    </div>
                    <div className="text-sm text-gray-500 mb-2">{s.subtitle}</div>
                    <p className="text-gray-600 text-sm">{s.body}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Button onClick={() => navigate('contact')} className="px-8">Talk to an Engineer</Button>
          </div>
        </div>
      </section>

      {/* Who This Isn't For (moved below 'Why Companies Choose...') */}
      <section className="home-section py-12 bg-white" data-bg="/assets/hero-education-1600.jpg">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <SectionHeading title={<>Let's Be Honest: Kinexus <span className="text-gradient">Isn't for Everyone</span></>} />
          <p className="text-[#212121] text-lg max-w-3xl mx-auto mb-4">If you're looking for a cheap chatbot, we're not your people. If you expect magic without investment, this won't work. If your team isn't ready for change, it's too early. But if you're tired of throwing people at problems that AI should solve—if you're ready to invest seriously in transformation—then yes, let's talk.</p>
          <p className="text-sm text-gray-500 italic mb-6">We work with manufacturing, logistics, pharma, retail, real estate, energy, education, hospitality, and other enterprise companies.</p>
          <div className="flex justify-center"><Button onClick={() => navigate('contact')}>I Want to Explore This for My Company →</Button></div>
        </div>
      </section>

      {/* Results & Industries & FAQ */}
      <section className="home-section py-20 bg-white" data-bg="/assets/hero-energy-1600.jpg">
        <div className="max-w-7xl mx-auto px-6">
          {/* Removed large title per request */}
          {/* metrics moved into hero overlay */}

          

          <div className="mt-12">
            <SectionHeading title="The Answer Is Yes." subtitle="We do the heavy lifting — integrations, operations, and measurable outcomes." centered />
            <p className="text-gray-600 max-w-3xl mx-auto text-sm mb-6">You can deploy agentic automation in real operations without heroic data projects. Below are the guarantees we offer when we work together.</p>

            <div className="mt-6 grid gap-6 md:grid-cols-3">
              <div className="p-6 rounded-2xl bg-white/90 border shadow-sm text-left flex flex-col h-full min-h-[140px]">
                <h4 className="font-semibold text-lg mb-2">We integrate with your systems</h4>
                <p className="text-gray-600 text-sm mt-auto break-words">ERP, MES, WMS, CRMs — agents orchestrate across your stack without replacing it.</p>
              </div>

              <div className="p-6 rounded-2xl bg-white/90 border shadow-sm text-left flex flex-col h-full min-h-[140px]">
                <h4 className="font-semibold text-lg mb-2">Pilot to production</h4>
                <p className="text-gray-600 text-sm mt-auto break-words">Fast pilots that demonstrate impact in 8–12 weeks and production rollouts that scale reliably.</p>
              </div>

              <div className="p-6 rounded-2xl bg-white/90 border shadow-sm text-left flex flex-col h-full min-h-[140px]">
                <h4 className="font-semibold text-lg mb-2">We operate with you</h4>
                <p className="text-gray-600 text-sm mt-auto break-words">Monitoring, governance, and SLA-backed operations — we stay until outcomes are repeatable.</p>
              </div>

              <div className="p-6 rounded-2xl bg-white/90 border shadow-sm text-left flex flex-col h-full min-h-[140px]">
                <h4 className="font-semibold text-lg mb-2">Security & compliance</h4>
                <p className="text-gray-600 text-sm mt-auto break-words">Audit trails, role-based controls, and privacy-first integrations are standard in every deployment.</p>
              </div>

              <div className="p-6 rounded-2xl bg-white/90 border shadow-sm text-left flex flex-col h-full min-h-[140px]">
                <h4 className="font-semibold text-lg mb-2">Human-in-the-loop</h4>
                <p className="text-gray-600 text-sm mt-auto break-words">We design decision gates so humans retain control where necessary, with rich context and suggested actions.</p>
              </div>

              <div className="p-6 rounded-2xl bg-white/90 border shadow-sm text-left flex flex-col h-full min-h-[140px]">
                <h4 className="font-semibold text-lg mb-2">Measurable ROI</h4>
                <p className="text-gray-600 text-sm mt-auto break-words">Throughput, cost, and quality metrics tracked from day one — so you see the value in dollars and time saved.</p>
              </div>
            </div>
            <div className="mt-8 flex justify-center"><Button onClick={() => navigate('contact')}>Talk with an Engineer →</Button></div>
          </div>
        </div>
      </section>

      {showInsights && (
        <section className="home-section py-12 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <SectionHeading title="Latest Insights" subtitle="Research, case studies, and thinking from the Kinexus team" />
            <div className="mt-8 grid md:grid-cols-3 gap-6">
              {(blogs || []).slice(0,3).map(b => (
                <div key={b.id} className="bg-white border rounded-2xl p-6 hover-lift">
                  {b.image && <img src={b.image} alt={b.title} className="w-full h-44 object-cover rounded-md mb-4" />}
                  <div className="text-sm text-gray-400 mb-1">{b.date} • {b.author || 'Kinexus Team'}</div>
                  <h3 className="font-semibold text-lg mb-2">{b.title}</h3>
                  <p className="text-gray-600 text-sm mb-4">{(b.excerpt || '').slice(0,140)}</p>
                  <div className="flex justify-between items-center">
                    <Button onClick={() => navigate('blog', { id: b.id })}>Read</Button>
                    <a href="#" onClick={(e) => { e.preventDefault(); navigator.clipboard && navigator.clipboard.writeText(window.location.origin + window.location.pathname + `#blog-${b.id}`); alert('Link copied'); }} className="text-sm text-gray-400">Share</a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Final CTA */}
      <section className="home-section py-12 bg-[#2EC5CE] text-white" data-bg="/assets/hero-hospitality-1600.jpg">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Free Your Team from the Tedium?</h2>
          <p className="mb-6">Let's have an honest conversation about your reality.</p>
          <Button onClick={() => navigate('contact')} className="" style={{ backgroundColor: '#ffffff', color: '#2EC5CE' }}>Start the Conversation</Button>
        </div>
      </section>
      
    </div>
  );
};

const BlogPage = ({ id, navigate, blogs = [] }) => {
  const source = (blogs && blogs.length) ? blogs : BLOGS;
  const blog = source.find(b => b.id === id);
  if (!blog) {
    return (
      <div className="pt-24 pb-16 min-h-screen bg-white animate-fade-in-up">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-2xl font-bold mb-4">Post not found</h2>
          <p className="text-gray-600 mb-6">We couldn't find the article you're looking for.</p>
          <Button onClick={() => navigate('home')}>Return Home</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-16 min-h-screen bg-white animate-fade-in-up">
      <div className="max-w-7xl mx-auto px-6">
        <style>{blogStyles}</style>
        <div className="mb-6 flex items-center justify-between">
          <div>
            <div className="text-sm text-gray-400 mb-1">{blog.date} • By {blog.author || 'Kinexus Team'} • {Math.max(1, Math.ceil(((blog.content||'').replace(/<[^>]+>/g,'').split(/\s+/).length || 0) / 200))} min read</div>
            <h1 className="text-3xl font-bold leading-tight mb-2">{blog.title}</h1>
          </div>
          <div>
            <Button variant="text" onClick={() => navigate('home')}>Back</Button>
          </div>
        </div>
        {blog.image && (
          <div className="blog-hero mb-8">
            <img src={blog.image} alt={blog.title} />
            <div className="overlay" />
            <div className="meta">
              <div className="blog-meta-row">{blog.date} • By {blog.author || 'Kinexus Team'} • {Math.max(1, Math.ceil(((blog.content||'').replace(/<[^>]+>/g,'').split(/\s+/).length || 0) / 200))} min read</div>
              <h1 style={{ color: '#fff', marginTop: 8 }}>{blog.title}</h1>
            </div>
          </div>
        )}

        <div className="blog-container">
          <div className="blog-content">
            <div className="prose max-w-none text-gray-700 mb-8" dangerouslySetInnerHTML={{ __html: blog.content }} />
            <div className="mt-8 flex items-center justify-between">
              <div className="text-sm text-gray-500">Was this article helpful?</div>
              <div className="share-buttons">
                <button className="share-button" onClick={() => { navigator.clipboard && navigator.clipboard.writeText(window.location.href); alert('Link copied to clipboard'); }}>Copy link</button>
                <a className="share-button" href={`mailto:?subject=${encodeURIComponent(blog.title)}&body=${encodeURIComponent(window.location.href)}`}>Email</a>
                <a className="share-button" target="_blank" rel="noreferrer" href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(blog.title)}&url=${encodeURIComponent(window.location.href)}`}>Tweet</a>
              </div>
            </div>
          </div>

          <aside className="blog-sidebar">
            <div className="bg-white p-6 rounded-2xl shadow-sm">
              <div className="mb-4 font-semibold">Related Posts</div>
              {blogs.filter(b => b.id !== blog.id).slice(0,4).map(r => (
                <div key={r.id} className="related-post">
                  <img src={r.image} alt={r.title} className="w-16 h-12 object-cover rounded" />
                  <div style={{flex:1}}>
                    <div className="text-sm font-semibold cursor-pointer text-[#1f2937]" onClick={() => navigate('blog', { id: r.id })}>{r.title}</div>
                    <div className="text-xs text-gray-400">{r.date}</div>
                  </div>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </div>
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

// ContactPage is defined below (wired to `addLead`) — earlier duplicate removed.

// --- NAVBAR & FOOTER ---
const ContactPage = ({ navigate, addLead, industries = [] }) => {
  const [formData, setFormData] = useState({ name: '', email: '', company: '', industry: industries[0]?.name || '', message: '' });
  const [status, setStatus] = useState('idle');
  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus('submitting');
    try {
      const lead = {
        name: formData.name,
        email: formData.email,
        company: formData.company || '',
        industry: formData.industry || '',
        message: formData.message || ''
      };
      addLead(lead);
      setStatus('sent');
      setFormData({ name: '', email: '', company: '', industry: industries[0]?.name || '', message: '' });
    } catch (err) {
      console.error('Failed to save lead', err);
      setStatus('error');
    }
  };
    return (
      <div className="pt-16 pb-16 min-h-screen bg-white animate-fade-in-up">
        <div className="max-w-3xl mx-auto px-6">
          <SectionHeading title="Contact Us" subtitle="Start a conversation — we'll respond within 48 hours." centered />
          <form onSubmit={handleSubmit} className="space-y-4 mt-8">
            <input required placeholder="Full name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full border p-3 rounded-lg" />
            <input required type="email" placeholder="Email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full border p-3 rounded-lg" />
            <input placeholder="Company" value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})} className="w-full border p-3 rounded-lg" />
            <select value={formData.industry} onChange={e => setFormData({...formData, industry: e.target.value})} className="w-full border p-3 rounded-lg">
              <option value="">Select industry (optional)</option>
              {industries.map(i => <option key={i.id} value={i.name}>{i.name}</option>)}
            </select>
            <textarea placeholder="Tell us about your challenge" required value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} className="w-full border p-3 rounded-lg h-36" />
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-500">{status === 'submitting' ? 'Sending…' : status === 'sent' ? 'Thanks — we will be in touch.' : status === 'error' ? 'Failed to send. Try again.' : ''}</div>
              <Button type="submit" disabled={status === 'submitting'}>Send Message</Button>
            </div>
          </form>
        </div>
      </div>
    );

  };

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
            if (y > lastY.current && y > 100) setHidden(true);
            else setHidden(false);
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
          <div className="cursor-pointer flex items-center" onClick={() => goTo('home')}>
            <img src="/assets/logo-1.png" alt="Kinexus" className="h-8 object-contain mr-2" onError={(e) => { try { e.target.style.display = 'none'; const fallback = e.target.nextSibling; if (fallback) fallback.style.display = 'inline-block'; } catch (err) {} }} />
            <div className="text-xl font-bold" style={{ display: 'none' }}>Kinexus</div>
          </div>
          <div className="space-x-6 hidden md:flex">
            <button onClick={() => goTo('home')} className="text-black hover:text-[#5856D6]">Home</button>
            <button onClick={() => goTo('services')} className="text-black hover:text-[#5856D6]">Services</button>
            <button onClick={() => goTo('industries')} className="text-black hover:text-[#5856D6]">Industries</button>
            {/* Use Cases removed from main nav - industry pages link directly to filtered use cases */}
            <button onClick={() => goTo('about')} className="text-black hover:text-[#5856D6]">About</button>
            <button onClick={() => goTo('contact')} className="bg-[#25a8b0] text-white px-4 py-2 rounded-lg hover:bg-[#1e8b98]">Contact</button>
          </div>
          <div className="md:hidden relative">
            <MobileMenu navigate={navigate} />
          </div>
        </div>
      </nav>
    );
  };

  const MobileMenu = ({ navigate }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <div className="relative">
        <button
          aria-expanded={isOpen}
          aria-controls="mobile-menu"
          onClick={() => setIsOpen(v => !v)}
          className="inline-flex items-center justify-center p-2 rounded-md text-black hover:bg-gray-100"
        >
          {isOpen ? <X className="w-5 h-5" /> : <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M4 6h16M4 12h16M4 18h16" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>}
        </button>

        {isOpen && (
          <div id="mobile-menu" className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg ring-1 ring-black ring-opacity-5 py-3 z-50">
            <div className="flex flex-col px-4 space-y-2">
              <button onClick={() => { setIsOpen(false); navigate('home'); }} className="text-left px-3 py-2 rounded hover:bg-gray-100">Home</button>
              <button onClick={() => { setIsOpen(false); navigate('services'); }} className="text-left px-3 py-2 rounded hover:bg-gray-100">Services</button>
              <button onClick={() => { setIsOpen(false); navigate('industries'); }} className="text-left px-3 py-2 rounded hover:bg-gray-100">Industries</button>
              {/* Use Cases removed from mobile menu - industries link to their use cases directly */}
              <button onClick={() => { setIsOpen(false); navigate('about'); }} className="text-left px-3 py-2 rounded hover:bg-gray-100">About</button>
              <button onClick={() => { setIsOpen(false); navigate('contact'); }} className="mt-2 px-3 py-2 rounded bg-[#25a8b0] text-white hover:bg-[#1e8b98]">Contact</button>
            </div>
          </div>
        )}
      </div>
    );
  };

const Footer = ({ navigate }) => (
  <footer className="bg-black text-white" style={{ height: 'var(--nav-height)' }}>
    <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-full">
      <p className="m-0">© {new Date().getFullYear()} Kinexus. All rights reserved.</p>
      <div className="space-x-4">
        <button onClick={() => navigate('home')} className="text-white opacity-90 hover:opacity-100 text-sm">Home</button>
        <button onClick={() => navigate('about')} className="text-white opacity-90 hover:opacity-100 text-sm">About</button>
        <button onClick={() => navigate('contact')} className="text-white opacity-90 hover:opacity-100 text-sm">Contact</button>
      </div>
    </div>
  </footer>
);
