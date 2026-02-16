import React, { useState, useMemo } from 'react';
import { 
  Search, Filter, X, ArrowRight,  
  Factory, Truck, Pill, Building, ShoppingCart, Landmark, 
  Shield, Lightbulb, HeartPulse, Coffee, GraduationCap, 
  Workflow, CheckCircle2, AlertTriangle, DollarSign, Activity,
  Battery, Cpu, Signal, Zap, FileText, Users, BarChart3,
  Stethoscope, CalendarCheck, BedDouble, Thermometer, UserCheck
} from 'lucide-react';

// --- ICON MAPPER ---
const ICON_MAP = {
  Factory, Truck, Pill, Building, ShoppingCart, Landmark, 
  Shield, Lightbulb, HeartPulse, Coffee, GraduationCap, 
  Workflow, Battery, Cpu, Signal, Zap, FileText, Users, BarChart3, Activity,
  Stethoscope, CalendarCheck, BedDouble, Thermometer, UserCheck
};

const getIcon = (iconName) => ICON_MAP[iconName] || Workflow;

// --- FULL USE CASE DATABASE (Synthesized from all Industry Documents) ---
const USE_CASE_DB = [
  // --- MANUFACTURING (General) ---
  {
    id: 'mfg-1',
    industry: 'Manufacturing',
    icon: 'Factory',
    title: 'Autonomous Production Planning',
    gap: '70% of production plans are outdated within 2 hours. Excel/APS tools can\'t adapt to real-time disruptions.',
    pain: 'Frequent rescheduling causes chaos, 8-12% capacity loss, material shortages, and planner burnout.',
    solution: 'Reads ERP/MES data, recalculates schedules instantly upon disruption, and auto-reschedules based on constraints.',
    metrics: ['12% Productivity Gain', 'Zero Planning Latency']
  },
  {
    id: 'mfg-2',
    industry: 'Manufacturing',
    icon: 'Activity',
    title: 'Real-Time Shop Floor Monitoring',
    gap: 'MES dashboards are passive. They show data but don\'t trigger action. Supervisors waste time walking the floor.',
    pain: 'Delayed response to downtime, micro-stops go unnoticed, OEE leaks, and reactive maintenance.',
    solution: 'Agents watch PLC data 24/7. When a parameter drifts, the agent alerts the specific technician with a diagnosis.',
    metrics: ['15% OEE Uplift', '30% Less Downtime']
  },
  {
    id: 'mfg-3',
    industry: 'Manufacturing',
    icon: 'Zap',
    title: 'Energy Optimisation Agent',
    gap: 'Energy consumption is poorly measured and rarely optimised against production schedules or tariff windows.',
    pain: 'High energy bills (2nd largest cost), missed ESG targets, and inefficient machine utilisation.',
    solution: 'Reads machine cycles and load curves to suggest load shifting and align production with low-tariff periods.',
    metrics: ['8-15% Cost Reduction', 'Lower Carbon Footprint']
  },
  
  // --- EV MANUFACTURING ---
  {
    id: 'ev-1',
    industry: 'EV Manufacturing',
    icon: 'Battery',
    title: 'Battery Cell Quality Prediction',
    gap: 'Cell testing is slow/manual. Degradation patterns are not predicted real-time. Variability across suppliers is high.',
    pain: 'Thermal runaway risk, high warranty claims, inconsistent range performance, and brand damage.',
    solution: 'Continuously analyses cell-level test data to predict degradation and failure risk before pack assembly.',
    metrics: ['Reduced Warranty Claims', 'Higher Pack Reliability']
  },
  {
    id: 'ev-2',
    industry: 'EV Manufacturing',
    icon: 'Cpu',
    title: 'Supply Chain Risk & Semiconductor Agent',
    gap: 'Volatile semiconductor availability and scarce battery materials. No predictive risk modelling for tier-N suppliers.',
    pain: 'Line shutdowns, delayed vehicle deliveries, and high inventory costs due to "just-in-case" hoarding.',
    solution: 'Predicts shortages by analysing supplier performance and global logistics risks, recommending alternate sourcing.',
    metrics: ['Prevented Line Stoppages', 'Optimised Inventory']
  },

  // --- LOGISTICS & SUPPLY CHAIN ---
  {
    id: 'log-1',
    industry: 'Logistics',
    icon: 'Truck',
    title: 'Dispatch Automation Agent',
    gap: 'Dispatch is manual and gut-feel based. Production readiness and truck arrival are rarely synchronized.',
    pain: 'Delayed dispatches, 10-20% wasted truck capacity, high freight costs, and customer penalties.',
    solution: 'Auto-assigns trucks based on real-time order readiness, route optimization, and SLA priority.',
    metrics: ['18% Cost Reduction', '99% SLA Adherence']
  },
  {
    id: 'log-2',
    industry: 'Logistics',
    icon: 'Truck',
    title: 'Dynamic Route Optimisation',
    gap: 'Static route plans don\'t account for real-time traffic, weather, or last-minute order injections.',
    pain: 'High fuel costs, missed delivery windows, and inability to consolidate partial loads.',
    solution: 'Continuous re-routing based on live conditions. The agent renegotiates slots and notifies drivers automatically.',
    metrics: ['15% Fuel Savings', 'On-Time Delivery ↑']
  },
  {
    id: 'log-3',
    industry: 'Logistics',
    icon: 'DollarSign',
    title: 'Freight Audit & Reconciliation',
    gap: 'Freight bills are complex; most companies overpay due to unverified accessorial charges and duplicate billing.',
    pain: 'Direct financial leakage (up to 5% of freight spend), disputes with carriers, and delayed payments.',
    solution: 'Reads invoices, contracts, and GPS logs to flag mismatches and identify overcharges automatically.',
    metrics: ['2-5% Cost Savings', '90% Faster Audit']
  },

  // --- PHARMA ---
  {
    id: 'pharma-1',
    industry: 'Pharma',
    icon: 'Pill',
    title: 'BMR/BPR Automation Agent',
    gap: 'Batch records are paper-heavy and filled at end of shifts. Errors are common and review takes weeks.',
    pain: 'Batch release delays, regulatory risk (FDA 483s), QA burnout, and inventory hold-ups.',
    solution: 'Reads equipment logs and operator inputs to auto-fill batch records in real-time, validating compliance.',
    metrics: ['40% Faster Release', 'Zero Errors']
  },
  {
    id: 'pharma-2',
    industry: 'Pharma',
    icon: 'FileText',
    title: 'Regulatory Submission Agent',
    gap: 'Submissions (FDA, EMA) are complex and manual. Formatting requirements are strict and compilation takes weeks.',
    pain: 'Delayed product approvals (lost revenue), regulatory queries, and high documentation workload.',
    solution: 'Reads protocols and trial data to generate submission-ready documents, validating formatting and compliance.',
    metrics: ['Faster Market Entry', 'Reduced Rework']
  },
  {
    id: 'pharma-3',
    industry: 'Pharma',
    icon: 'Shield',
    title: 'Cold Chain Monitoring Agent',
    gap: 'Cold chain monitoring is reactive. Excursions are noticed too late. IoT sensors not integrated with ERP.',
    pain: 'Product spoilage, regulatory non-compliance, recalls, and high investigation workload.',
    solution: 'Reads sensor data to detect excursions instantly, triggering alerts and corrective workflows.',
    metrics: ['Zero Spoilage', 'Audit-Ready Logs']
  },

  // --- BANKING ---
  {
    id: 'bank-1',
    industry: 'Banking',
    icon: 'Landmark',
    title: 'KYC & Onboarding Automation',
    gap: 'KYC is manual, document-heavy, and fragmented. Fraud checks are not integrated with onboarding.',
    pain: '20-40% customer drop-off due to friction, high operational costs, and regulatory penalties.',
    solution: 'Reads ID docs, validates against databases, checks fraud signals, and auto-fills forms in seconds.',
    metrics: ['80% Faster Onboarding', 'Zero Backlog']
  },
  {
    id: 'bank-2',
    industry: 'Banking',
    icon: 'Shield',
    title: 'Fraud Detection & Prevention',
    gap: 'Rule-based systems generate high false positives and are slow to adapt to new fraud patterns.',
    pain: 'Financial losses, customer friction from blocked cards, and huge investigation workloads.',
    solution: 'Behavioral AI detects anomalies in real-time and auto-blocks high-confidence threats.',
    metrics: ['95% Detection Rate', '60% Less False Positives']
  },
  {
    id: 'bank-3',
    industry: 'Banking',
    icon: 'DollarSign',
    title: 'Loan Underwriting Agent',
    gap: 'Underwriting is slow, inconsistent across branches, and prone to human bias.',
    pain: 'Slow TAT drives customers to competitors. High credit risk due to inconsistent decisions.',
    solution: 'Reads bank statements and credit reports, analyses cash flows, and scores risk autonomously.',
    metrics: ['10-20% Book Growth', 'Faster TAT']
  },

  // --- INSURANCE ---
  {
    id: 'ins-1',
    industry: 'Insurance',
    icon: 'Shield',
    title: 'Intelligent Underwriting',
    gap: 'Underwriting relies on manual document review and subjective judgment. Data is often weeks old.',
    pain: 'Slow policy issuance (lost customers), inconsistent risk pricing, and leakage.',
    solution: 'Reads medical/financial reports, assesses risk against actuarial models, and recommends pricing.',
    metrics: ['10x Faster Quotes', 'Consistent Risk']
  },
  {
    id: 'ins-2',
    industry: 'Insurance',
    icon: 'AlertTriangle',
    title: 'Claims Triage & Adjudication',
    gap: 'Claims processing is manual and slow. Adjusters spend time on low-value claims instead of complex ones.',
    pain: 'High claims leakage (5-10%), fraud payouts, and poor customer satisfaction scores.',
    solution: 'Validates coverage, reads evidence photos, detects fraud patterns, and auto-approves routine claims.',
    metrics: ['70% Auto-Processing', 'Lower Leakage']
  },

  // --- REAL ESTATE ---
  {
    id: 're-1',
    industry: 'Real Estate',
    icon: 'Building',
    title: 'Project Progress Monitoring',
    gap: 'Progress reporting is manual (WhatsApp/Excel) and subjective. Leadership lacks "truth" on site status.',
    pain: 'Cost overruns, delayed timelines (20-80%), and overpayments to contractors.',
    solution: 'Analyzes site photos/videos against BOQ and schedule to objectively verify progress.',
    metrics: ['100% Visibility', 'Prevent Overpayment']
  },
  {
    id: 're-2',
    industry: 'Real Estate',
    icon: 'DollarSign',
    title: 'Contractor Billing Verification',
    gap: 'Bills are raised based on self-reported progress. Verification is slow, manual, and error-prone.',
    pain: 'Financial leakage (5-12% overpayment), contractor disputes, and cash flow unpredictability.',
    solution: 'Reads bills, BOQ, and progress photos to validate quantities and flag discrepancies instantly.',
    metrics: ['Eliminate Leakage', 'Faster Cycles']
  },

  // --- RETAIL ---
  {
    id: 'ret-1',
    industry: 'Retail',
    icon: 'ShoppingCart',
    title: 'Demand Forecasting & Replenishment',
    gap: 'Forecasting relies on Excel and gut feel. No integration with promotions, seasonality, or local events.',
    pain: 'Stockouts (lost sales), overstock (markdowns), and high working capital.',
    solution: 'Forecasts demand at SKU/Store/Channel level using AI to recommend precise replenishment.',
    metrics: ['10-20% Less Stockouts', 'Lower Working Cap']
  },
  {
    id: 'ret-2',
    industry: 'Retail',
    icon: 'Users',
    title: 'Store Operations Productivity',
    gap: 'Store operations are manual and inconsistent. Not linked to real-time footfall or workload.',
    pain: 'Long queues, poor shelf availability, high labour cost, and customer dissatisfaction.',
    solution: 'Analyses footfall and workload to recommend task allocation and staffing adjustments.',
    metrics: ['10% Productivity Gain', 'Better Service']
  },

  // --- ENERGY ---
  {
    id: 'energy-1',
    industry: 'Energy',
    icon: 'Lightbulb',
    title: 'Grid Load Forecasting',
    gap: 'Static models fail to account for weather shifts, events, and DER (Distributed Energy) variability.',
    pain: 'Peak load stress, expensive spot power purchases, and grid instability risks.',
    solution: 'Real-time forecasting using weather, consumption, and generation data to optimize dispatch.',
    metrics: ['98% Forecast Accuracy', 'Lower Power Costs']
  },
  {
    id: 'energy-2',
    industry: 'Energy',
    icon: 'AlertTriangle',
    title: 'Energy Theft Detection',
    gap: 'High AT&C losses. Manual detection. No real-time anomaly detection at feeder level.',
    pain: 'Massive revenue leakage, billing inefficiencies, and regulatory scrutiny.',
    solution: 'Analyses consumption patterns to detect anomalies at feeder/transformer levels instantly.',
    metrics: ['Reduced Theft', 'Revenue Assurance']
  },

  // --- HEALTHCARE (Updated with Deep Dive) ---
  {
    id: 'health-1',
    industry: 'Healthcare',
    icon: 'UserCheck',
    title: 'Intelligent Patient Intake & Triage Agent',
    gap: 'Intake is manual, paper-heavy, and inconsistent. Triage depends on front-desk staff rather than clinical urgency.',
    pain: 'Long waiting times, delayed diagnosis, patient dissatisfaction, and risk of adverse events due to inaccurate triage.',
    solution: 'Reads symptoms, vitals, and history to prioritise patients by clinical urgency, auto-filling EMR and guiding staff.',
    metrics: ['30% Less Wait Time', 'Better Clinical Safety']
  },
  {
    id: 'health-2',
    industry: 'Healthcare',
    icon: 'FileText',
    title: 'Clinical Documentation & EMR Automation Agent',
    gap: 'Clinicians spend 30-40% of time on documentation. Notes are typed manually, templates are inconsistent, and coding errors are common.',
    pain: 'Reduced face time with patients, clinician burnout, inaccurate records, and billing errors leading to revenue leakage.',
    solution: 'Listens to clinician-patient conversations to generate SOAP notes, suggest ICD codes, and update EMR automatically.',
    metrics: ['Reduced Burnout', 'Accurate Billing']
  },
  {
    id: 'health-3',
    industry: 'Healthcare',
    icon: 'CalendarCheck',
    title: 'Appointment Scheduling & Capacity Optimisation',
    gap: 'Scheduling is manual, not aligned with doctor availability or case complexity, and prone to no-shows.',
    pain: 'Long waiting lists, idle doctor time, revenue leakage from no-shows, and operational chaos.',
    solution: 'Predicts appointment duration, reduces no-shows, balances workload, and recommends optimal slots dynamically.',
    metrics: ['10-25% Throughput Gain', 'Lower No-Shows']
  },
  {
    id: 'health-4',
    industry: 'Healthcare',
    icon: 'Stethoscope',
    title: 'Diagnostic Reporting & Radiology Assistant',
    gap: 'High reporting backlog, manual image review, inconsistent quality, and slow turnaround time for diagnosis.',
    pain: 'Delayed clinical decisions, radiologist burnout, patient anxiety, and risk of missed findings.',
    solution: 'Analyses scans (X-ray, CT, MRI) to highlight abnormalities and suggest structured reports, accelerating diagnosis.',
    metrics: ['Faster Diagnosis', 'Reduced Burnout']
  },
  {
    id: 'health-5',
    industry: 'Healthcare',
    icon: 'BedDouble',
    title: 'Hospital Bed Management & Patient Flow',
    gap: 'Bed management is manual, spreadsheet-driven, and not updated in real-time or linked to discharge planning.',
    pain: 'ED overcrowding, delayed admissions, poor bed utilisation, and high staff stress.',
    solution: 'Tracks bed availability in real-time, predicts discharges, and recommends patient placement to clear bottlenecks.',
    metrics: ['Optimised Patient Flow', 'Reduced ED Overcrowding']
  },

  // --- HOSPITALITY (Updated with Deep Dive) ---
  {
    id: 'hosp-1',
    industry: 'Hospitality',
    icon: 'Coffee',
    title: 'Intelligent Guest Experience & Personalisation',
    gap: 'Hotels collect data but don\'t use it. Preferences are not captured, profiles are not unified, and service is generic.',
    pain: 'Low repeat business, weak loyalty, poor satisfaction, missed upsell opportunities, and inconsistent service quality.',
    solution: 'Builds a unified guest profile to predict preferences and trigger personalised communication and upsells.',
    metrics: ['↑ RevPAR', '↑ Repeat Guests']
  },
  {
    id: 'hosp-2',
    industry: 'Hospitality',
    icon: 'DollarSign',
    title: 'Dynamic Pricing & Revenue Management',
    gap: 'Revenue management is manual, dependent on experts, slow to react, and not optimised for ancillary revenue.',
    pain: 'Revenue leakage, suboptimal room rates, low occupancy during off-peak, and poor yield management.',
    solution: 'Analyses demand, events, and competition to recommend optimal rates and maximise yield scientifically.',
    metrics: ['5-15% Revenue Uplift', 'Better Yield']
  },
  {
    id: 'hosp-3',
    industry: 'Hospitality',
    icon: 'BedDouble',
    title: 'Housekeeping Productivity & Room Readiness',
    gap: 'Housekeeping is manual, supervisor-dependent, not aligned with check-ins, and prone to delays.',
    pain: 'Delayed room readiness, guest dissatisfaction, high staff fatigue, and inconsistent cleaning quality.',
    solution: 'Predicts room readiness, assigns tasks based on workload, and optimises cleaning routes in real-time.',
    metrics: ['Faster Turnaround', 'Higher Staff Productivity']
  },
  {
    id: 'hosp-4',
    industry: 'Hospitality',
    icon: 'Coffee',
    title: 'F&B Demand Forecasting & Menu Optimisation',
    gap: 'F&B demand is unpredictable, menu engineering is manual, and wastage is high due to poor inventory alignment.',
    pain: 'Food wastage, stockouts during peak hours, poor menu profitability, and inconsistent guest experience.',
    solution: 'Forecasts demand by dish and daypart, recommends menu changes, and suggests optimal inventory levels.',
    metrics: ['Lower Wastage', 'Higher F&B Profitability']
  },
  {
    id: 'hosp-5',
    industry: 'Hospitality',
    icon: 'UserCheck',
    title: 'Front Desk Automation & Service Excellence',
    gap: 'Front desk operations are manual, slow, prone to errors, and not integrated with guest profiles.',
    pain: 'Long check-in times, guest frustration, high workload, inaccurate billing, and low upsell conversion.',
    solution: 'Auto-fills details, predicts guest needs, recommends upsells, and flags VIP arrivals for seamless service.',
    metrics: ['Faster Check-in', 'Higher Upsell Conversion']
  },

  // --- EDUCATION ---
  {
    id: 'edu-1',
    industry: 'Education',
    icon: 'GraduationCap',
    title: 'Admissions Intelligence Agent',
    gap: 'Lead data is scattered. Follow-ups are generic. High-quality applicants are lost.',
    pain: 'Low enrollment conversion, high acquisition cost, and revenue volatility.',
    solution: 'Scores leads by propensity, personalizes communication, and guides counselors.',
    metrics: ['20% Higher Enrollment', 'Lower CAC']
  },
  {
    id: 'edu-2',
    industry: 'Education',
    icon: 'Activity',
    title: 'Student Early Intervention',
    gap: 'Performance monitoring is reactive (exams). Attendance and behaviour signals are ignored.',
    pain: 'High dropout rates, low academic outcomes, and late interventions.',
    solution: 'Analyses attendance and behaviour to predict risk and recommend interventions.',
    metrics: ['Reduced Dropouts', 'Student Success']
  }
];

const INDUSTRIES = [
  'All', 
  'Manufacturing', 
  'EV Manufacturing',
  'Logistics', 
  'Pharma', 
  'Banking', 
  'Insurance', 
  'Real Estate', 
  'Retail',
  'Energy', 
  'Healthcare', 
  'Hospitality', 
  'Education'
];

// --- HELPER COMPONENTS ---

const FilterBar = ({ selected, onSelect }) => (
  <div className="sticky top-20 z-30 bg-white/95 backdrop-blur-md border-b border-gray-100 py-4 mb-8">
    <div className="max-w-7xl mx-auto px-6 overflow-x-auto no-scrollbar">
      <div className="flex space-x-2">
        {INDUSTRIES.map((ind) => (
          <button
            key={ind}
            onClick={() => onSelect(ind)}
            className={`
              px-6 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-300
              ${selected === ind 
                ? 'bg-[#212121] text-white shadow-lg transform -translate-y-0.5' 
                : 'bg-gray-50 text-gray-600 hover:bg-[#E8E7FF] hover:text-[#5856D6]'}
            `}
          >
            {ind}
          </button>
        ))}
      </div>
    </div>
  </div>
);

const SearchBar = ({ value, onChange }) => (
  <div className="relative max-w-xl mx-auto mb-12 group">
    <div className="relative bg-white rounded-full shadow-sm border border-gray-200 flex items-center px-6 py-4 transition-all focus-within:shadow-md focus-within:border-[#5856D6]">
      <Search className="w-5 h-5 text-gray-400 mr-4" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search workflows (e.g., 'Planning', 'KYC', 'Maintenance')..."
        className="w-full bg-transparent focus:outline-none text-[#212121] placeholder-gray-400 font-medium"
      />
      {value && (
        <button onClick={() => onChange('')} className="ml-2 text-gray-400 hover:text-[#5856D6]">
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  </div>
);

const UseCaseModal = ({ useCase, onClose }) => {
  if (!useCase) return null;
  const Icon = getIcon(useCase.icon);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-[#212121]/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto animate-fade-in-up">
        {/* Header */}
        <div className="sticky top-0 bg-white/98 backdrop-blur z-10 p-8 border-b border-gray-100 flex justify-between items-start">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-[#E8E7FF] rounded-2xl flex items-center justify-center text-[#5856D6]">
              <Icon className="w-8 h-8" />
            </div>
            <div>
              <div className="text-sm font-bold text-[#5856D6] uppercase tracking-wider mb-1">{useCase.industry}</div>
              <h2 className="text-3xl font-bold text-[#212121] leading-tight">{useCase.title}</h2>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 text-gray-500">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Body */}
        <div className="p-8 space-y-8">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-red-50 p-6 rounded-2xl border border-red-100">
              <div className="flex items-center space-x-2 mb-4 text-red-600 font-bold">
                <AlertTriangle className="w-5 h-5" />
                <span>The Real Gap</span>
              </div>
              <p className="text-[#212121] text-sm leading-relaxed opacity-90">{useCase.gap}</p>
            </div>

            <div className="bg-orange-50 p-6 rounded-2xl border border-orange-100">
              <div className="flex items-center space-x-2 mb-4 text-orange-600 font-bold">
                <DollarSign className="w-5 h-5" />
                <span>The Hidden Pain</span>
              </div>
              <p className="text-[#212121] text-sm leading-relaxed opacity-90">{useCase.pain}</p>
            </div>

            <div className="bg-[#212121] p-6 rounded-2xl border border-gray-800 text-white shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-[#5856D6] opacity-30 rounded-full blur-2xl transform translate-x-1/2 -translate-y-1/2"></div>
              <div className="flex items-center space-x-2 mb-4 text-[#2EC5CE] font-bold relative z-10">
                <CheckCircle2 className="w-5 h-5" />
                <span>Kinexus Solution</span>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed relative z-10">{useCase.solution}</p>
            </div>
          </div>

          <div className="bg-[#F8F9FC] rounded-2xl p-8 flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">Projected Impact</h4>
              <div className="flex flex-wrap gap-3">
                {useCase.metrics.map((m, i) => (
                  <div key={i} className="flex items-center space-x-2 bg-white px-4 py-2 rounded-lg border border-gray-200">
                    <Activity className="w-4 h-4 text-[#5856D6]" />
                    <span className="text-sm font-bold text-[#212121]">{m}</span>
                  </div>
                ))}
              </div>
            </div>
            <button className="bg-[#5856D6] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#4644ab] transition-all shadow-lg hover:shadow-xl hover:-translate-y-1">
              Deploy This Agent
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- MAIN PAGE COMPONENT ---
const UseCasesPage = ({ navigate }) => {
  const [selectedIndustry, setSelectedIndustry] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeUseCase, setActiveUseCase] = useState(null);

  const filteredCases = useMemo(() => {
    return USE_CASE_DB.filter(item => {
      const matchesIndustry = selectedIndustry === 'All' || item.industry === selectedIndustry;
      const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            item.gap.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            item.industry.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesIndustry && matchesSearch;
    });
  }, [selectedIndustry, searchQuery]);

  return (
    <div className="min-h-screen bg-white pt-32 pb-24 relative overflow-hidden">
      {/* Background Decor */}
      <div className="fixed top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoODgsIDg2LCAyMTQsIDAuMDUpIi8+PC9zdmc+')] z-0 pointer-events-none"></div>
      
      <div className="relative z-10">
        <div className="max-w-7xl mx-auto px-6 text-center mb-10 animate-fade-in">
          <div className="inline-flex items-center space-x-2 bg-[#E8E7FF] text-[#5856D6] px-4 py-2 rounded-full text-sm font-bold mb-6">
             <Workflow className="w-4 h-4" />
             <span>60+ Enterprise Workflows</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-[#212121] mb-6 tracking-tight">
            Library of <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5856D6] to-[#2EC5CE]">Autonomous Agents</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Browse our catalog of industry-specific AI agents ready to deploy into your existing architecture.
          </p>
        </div>

        <SearchBar value={searchQuery} onChange={setSearchQuery} />
        <FilterBar selected={selectedIndustry} onSelect={setSelectedIndustry} />

        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in-up">
          {filteredCases.length > 0 ? (
            filteredCases.map((useCase) => {
              const Icon = getIcon(useCase.icon);
              return (
                <div 
                  key={useCase.id}
                  onClick={() => setActiveUseCase(useCase)}
                  className="group bg-white border border-gray-100 rounded-2xl p-8 hover:shadow-[0_20px_40px_-15px_rgba(88,86,214,0.15)] hover:border-[#5856D6]/30 transition-all duration-300 cursor-pointer flex flex-col h-full relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-[#E8E7FF]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                  <div className="flex justify-between items-start mb-6 relative z-10">
                    <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-[#5856D6] group-hover:bg-[#5856D6] group-hover:text-white transition-colors duration-300">
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="bg-gray-100 text-gray-500 px-3 py-1 rounded text-xs font-bold uppercase tracking-wider group-hover:bg-[#E8E7FF] group-hover:text-[#5856D6] transition-colors">
                      {useCase.industry}
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-[#212121] mb-3 group-hover:text-[#5856D6] transition-colors relative z-10">
                    {useCase.title}
                  </h3>
                  
                  <p className="text-gray-500 text-sm leading-relaxed mb-6 line-clamp-3 relative z-10 flex-grow">
                    {useCase.gap}
                  </p>

                  <div className="flex items-center text-[#5856D6] font-bold text-sm group-hover:translate-x-1 transition-transform relative z-10 mt-auto">
                    <span>View Details</span>
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-full text-center py-20">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-700">No workflows found</h3>
              <p className="text-gray-500">Try adjusting your search or filters.</p>
            </div>
          )}
        </div>

        <div className="max-w-7xl mx-auto px-6 mt-24 mb-12">
          <div className="bg-[#212121] rounded-3xl p-12 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#5856D6] rounded-full opacity-20 blur-[80px]"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#2EC5CE] rounded-full opacity-20 blur-[80px]"></div>
            
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 relative z-10">Can't find what you need?</h2>
            <p className="text-gray-400 max-w-2xl mx-auto mb-8 relative z-10">
              We build custom agents for specific enterprise needs. Our architecture is flexible enough to handle any workflow.
            </p>
            <button onClick={() => navigate('contact')} className="bg-white text-[#212121] px-8 py-4 rounded-xl font-bold hover:bg-[#E8E7FF] transition-colors relative z-10">
              Request Custom Agent
            </button>
          </div>
        </div>
      </div>

      <UseCaseModal useCase={activeUseCase} onClose={() => setActiveUseCase(null)} />
      
      <style>{styles}</style>
    </div>
  );
};

export default UseCasesPage;