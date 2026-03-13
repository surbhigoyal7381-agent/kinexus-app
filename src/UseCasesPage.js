import React, { useState, useMemo, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { 
  Search, X, Factory, Truck, Pill, Building, ShoppingCart, Landmark, 
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
  {
    id: 'ins-3',
    industry: 'Insurance',
    icon: 'Shield',
    title: 'Fraud Detection & Investigation',
    gap: 'Rule-based systems produce high false positives, lack cross-policy intelligence and don\'t detect fraud rings quickly.',
    pain: 'Fraud losses of 8–15% of claims cost, high investigation workload, delayed settlements and reputational damage.',
    solution: 'Analyses claim patterns, detects anomalies and fraud rings, generates investigation summaries and syncs with claims and underwriting agents.',
    metrics: ['Reduced Fraud Losses', 'Faster Investigations']
  },
  {
    id: 'ins-4',
    industry: 'Insurance',
    icon: 'Users',
    title: 'Policy Servicing & Customer Support',
    gap: 'Servicing is manual, fragmented across channels and not personalised; policy and claims data are not integrated.',
    pain: 'High call centre cost, slow responses, low CSAT, churn and low self-service adoption.',
    solution: 'Handles servicing end-to-end: reads policy details, answers queries, processes endorsements, triggers renewals and syncs with CRM.',
    metrics: ['Lower Call Volume', 'Higher CSAT']
  },
  {
    id: 'ins-5',
    industry: 'Insurance',
    icon: 'BarChart3',
    title: 'Renewal Prediction & Retention',
    gap: 'Renewals are treated as transactions with no visibility into churn risk or personalised offers.',
    pain: 'Low renewal rates, high acquisition cost, lost LTV and weak cross-sell.',
    solution: 'Predicts churn risk, recommends personalised renewal offers, triggers proactive outreach and syncs with CRM and distribution.',
    metrics: ['Higher Retention', 'Lower CAC']
  },
  {
    id: 'ins-6',
    industry: 'Insurance',
    icon: 'Users',
    title: 'Agent & Broker Performance Intelligence',
    gap: 'Performance is measured on basic metrics and not linked to persistency, claims quality or customer satisfaction.',
    pain: 'High lapse rates, mis-selling complaints, poor-quality business and regulatory scrutiny.',
    solution: 'Analyses sales, persistency and claims quality; predicts agent performance and recommends training or corrective actions.',
    metrics: ['Better Persistency', 'Improved Quality']
  },
  {
    id: 'ins-7',
    industry: 'Insurance',
    icon: 'BarChart3',
    title: 'Pricing & Actuarial Intelligence',
    gap: 'Pricing is slow, based on historical loss ratios, not personalised and not integrated with behavioural data.',
    pain: 'Underpricing → high loss ratios; overpricing → lost customers; inaccurate reserves and poor profitability.',
    solution: 'Analyses risk, behaviour and claims history to predict loss cost, recommend pricing and model elasticity.',
    metrics: ['Optimised Pricing', 'Improved Reserving']
  },
  {
    id: 'ins-8',
    industry: 'Insurance',
    icon: 'FileText',
    title: 'Health Claims Medical Coding',
    gap: 'Medical coding is manual, slow and error-prone, dependent on specialist coders and not standardised.',
    pain: 'Incorrect coding leads to over/underpayment, regulatory issues and high operational cost.',
    solution: 'Reads medical reports and bills to assign ICD/CPT codes, flag inconsistencies and sync with claims and fraud agents.',
    metrics: ['Accurate Coding', 'Faster Adjudication']
  },
  {
    id: 'ins-9',
    industry: 'Insurance',
    icon: 'Truck',
    title: 'Motor Claims Assessment',
    gap: 'Assessment is manual, dependent on surveyor judgement and not standardised or integrated with repair history.',
    pain: 'Inflated estimates, slow settlement, fraud exposure and poor CX.',
    solution: 'Analyses accident photos, estimates repair cost, compares historical repair data and flags inflated claims.',
    metrics: ['Faster Settlements', 'Lower Leakage']
  },
  {
    id: 'ins-10',
    industry: 'Insurance',
    icon: 'FileText',
    title: 'Document Intelligence for Insurance',
    gap: 'Document processing is broken: proposal forms, claims docs and medical reports are unstructured and slow to process.',
    pain: 'Slow TAT, operational cost, inaccurate data entry and compliance risk.',
    solution: 'Extracts data from documents, validates completeness, flags inconsistencies and auto-fills systems.',
    metrics: ['Faster Processing', 'Fewer Errors']
  },
  {
    id: 'ins-11',
    industry: 'Insurance',
    icon: 'CheckCircle2',
    title: 'Regulatory Compliance & IRDAI Reporting',
    gap: 'Compliance is manual, spreadsheet-driven, fragmented and not audit-ready.',
    pain: 'IRDAI penalties, delayed filings, audit findings and reputational damage.',
    solution: 'Pulls data across functions, validates accuracy, auto-generates IRDAI reports and maintains audit trails.',
    metrics: ['Audit-Ready Reports', 'Lower Compliance Cost']
  },
  {
    id: 'ins-12',
    industry: 'Insurance',
    icon: 'BarChart3',
    title: 'Reinsurance Optimisation',
    gap: 'Reinsurance decisions are slow, based on historical ratios and not optimised for current portfolio behaviour.',
    pain: 'Over/under-reinsurance, slow treaty negotiations and suboptimal capital allocation.',
    solution: 'Analyses portfolio risk, predicts loss distributions and recommends optimal treaty structures.',
    metrics: ['Optimised Ceding', 'Lower Capital Cost']
  },
  {
    id: 'ins-13',
    industry: 'Insurance',
    icon: 'Users',
    title: 'Customer 360 Intelligence for Insurance',
    gap: 'Customer data is scattered across policy, claims and servicing; no unified profile or predictive segmentation.',
    pain: 'Low cross-sell, high churn and missed upsell opportunities.',
    solution: 'Consolidates data into a real-time Customer 360, predicts needs and recommends personalised offers.',
    metrics: ['Higher Cross-Sell', 'Lower Churn']
  },
  {
    id: 'ins-14',
    industry: 'Insurance',
    icon: 'Workflow',
    title: 'Product Development Intelligence',
    gap: 'Product development is slow, based on outdated actuarial models and not aligned with claims insights or customer needs.',
    pain: 'Low adoption, poor profitability and missed segments.',
    solution: 'Analyses claims and customer data to identify unmet needs, predict product performance and recommend features/pricing.',
    metrics: ['Faster Launch', 'Better Fit']
  },
  {
    id: 'ins-15',
    industry: 'Insurance',
    icon: 'AlertTriangle',
    title: 'Grievance Redressal & IRDAI Compliance',
    gap: 'Grievances are manual, poorly documented and not categorised intelligently.',
    pain: 'IRDAI complaints, penalties, poor CSAT and regulatory risk.',
    solution: 'Categorises complaints, recommends resolutions, generates responses and tracks TAT for compliance.',
    metrics: ['Faster Resolution', 'Lower Complaints']
  },
  {
    id: 'ins-16',
    industry: 'Insurance',
    icon: 'Landmark',
    title: 'Hospital Network Performance (Health Insurance)',
    gap: 'Network management is fragmented, audit-driven and not monitored in real time.',
    pain: 'Inflated billing, unnecessary procedures, high cashless claim cost and fraud collusion risk.',
    solution: 'Monitors hospital billing patterns, benchmarks performance and detects inflated charges.',
    metrics: ['Lower Cashless Cost', 'Better Network Performance']
  },
  {
    id: 'ins-17',
    industry: 'Insurance',
    icon: 'Truck',
    title: 'Field Surveyor & Loss Adjuster Assistant',
    gap: 'Surveyors face manual documentation, inconsistent assessments and slow reporting with no access to historical claim data.',
    pain: 'Inflated estimates, slow settlements and high claims leakage.',
    solution: 'Analyses photos/videos, estimates damage, compares historical claims and generates survey reports.',
    metrics: ['Faster Adjustments', 'Lower Leakage']
  },
  {
    id: 'ins-18',
    industry: 'Insurance',
    icon: 'Users',
    title: 'Insurance Sales Enablement',
    gap: 'Sales teams lack personalised scripts, real-time objection handling and visibility into customer intent.',
    pain: 'Low conversion, high CAC and inconsistent messaging.',
    solution: 'Acts as a real-time sales co-pilot: analyses profiles, recommends pitches, handles objections and updates CRM.',
    metrics: ['Higher Conversion', 'Lower CAC']
  },
  {
    id: 'ins-19',
    industry: 'Insurance',
    icon: 'BarChart3',
    title: 'Portfolio Profitability Intelligence',
    gap: 'No unified view of product profitability, channel performance or segment-level risk; data lives in silos.',
    pain: 'Poor capital allocation, unprofitable products and weak board reporting.',
    solution: 'Consolidates cross-functional data to flag unprofitable segments, recommend actions and improve reporting.',
    metrics: ['Better Portfolio Mix', 'Higher Profitability']
  },
  {
    id: 'ins-20',
    industry: 'Insurance',
    icon: 'Workflow',
    title: 'Multi-Agent Orchestration for Insurance',
    gap: 'Operations are fragmented — underwriting, claims, fraud, distribution and servicing don\'t share decisions.',
    pain: 'High leakage, slow customer journeys, regulatory risk and inconsistent decisions.',
    solution: 'Orchestrates agents across underwriting, claims, fraud, network and servicing to share data and actions autonomously.',
    metrics: ['System-wide Coordination', 'Lower Operational Friction']
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
  {
    id: 'energy-3',
    industry: 'Energy',
    icon: 'Activity',
    title: 'Predictive Maintenance for Power Plants & Substations',
    gap: `Maintenance is reactive, time-based and dependent on manual inspections. Asset health is poorly integrated with SCADA.`,
    pain: `Forced outages, high repair cost, reduced asset life, safety risks and regulatory non-compliance. Unplanned outages cost utilities heavily.`,
    solution: `Analyses vibration, temperature, load and SCADA data to predict failures and recommend maintenance schedules.`,
    metrics: ['Reduced Unplanned Outages', 'Lower Maintenance Cost']
  },
  {
    id: 'energy-4',
    industry: 'Energy',
    icon: 'Signal',
    title: 'Renewable Energy Forecasting & Integration',
    gap: `Renewables are intermittent, hard to forecast, poorly integrated with grid ops and not coordinated with storage.`,
    pain: `High curtailment, grid balancing challenges, inaccurate scheduling and lost renewable revenue.`,
    solution: `Predicts solar and wind output, recommends optimal dispatch, reduces curtailment and coordinates with storage and trading.`,
    metrics: ['Reduced Curtailment', 'Better Renewable Utilisation']
  },
  {
    id: 'energy-5',
    industry: 'Energy',
    icon: 'Zap',
    title: 'Outage Prediction & Restoration',
    gap: `Outage management is reactive, slow to diagnose and poorly coordinated across field teams.`,
    pain: `High SAIDI/SAIFI, long restoration times, customer churn and regulatory penalties.`,
    solution: `Predicts outage likelihood, identifies probable fault locations and coordinates field crews for faster restoration.`,
    metrics: ['Faster Restoration', 'Lower SAIDI/SAIFI']
  },
  {
    id: 'energy-6',
    industry: 'Energy',
    icon: 'BarChart3',
    title: 'Energy Trading & Market Bidding',
    gap: `Bidding is manual, market signals are not analysed in real time and renewable variability is not factored accurately.`,
    pain: `Suboptimal bids, imbalance penalties, revenue leakage and poor utilisation of generation assets.`,
    solution: `Predicts market prices, recommends optimal bids, factors renewable variability and analyses risk exposure.`,
    metrics: ['Improved Margins', 'Reduced Penalties']
  },
  {
    id: 'energy-7',
    industry: 'Energy',
    icon: 'DollarSign',
    title: 'Customer Billing Accuracy & Revenue Assurance',
    gap: `Billing is error-prone, fragmented and slow to reconcile; meter data issues create leakage.`,
    pain: `Incorrect bills, customer complaints, revenue leakage and regulatory penalties.`,
    solution: `Validates meter data, detects anomalies, predicts billing errors and recommends corrective actions.`,
    metrics: ['Fewer Billing Errors', 'Improved Cash Collection']
  },
  {
    id: 'energy-8',
    industry: 'Energy',
    icon: 'Activity',
    title: 'Smart Meter Analytics & Consumption Intelligence',
    gap: `Smart meter data is underutilised: no real-time consumption insights, segmentation or personalised recommendations.`,
    pain: `High peak demand, low DR participation, unnoticed anomalies and weak customer engagement.`,
    solution: `Analyses consumption patterns, predicts peak usage, flags anomalies and recommends personalised energy-saving actions.`,
    metrics: ['Higher DR Participation', 'Peak Reduction']
  },
  {
    id: 'energy-9',
    industry: 'Energy',
    icon: 'Truck',
    title: 'Field Workforce Scheduling & Dispatch',
    gap: `Field operations are manual, poorly routed and not aligned with outage priority or asset health.`,
    pain: `Delayed outage response, high travel time, poor crew utilisation and safety risks.`,
    solution: `Recommends optimal crew routing, prioritises tasks by risk and predicts job duration to improve utilisation.`,
    metrics: ['Faster Response', 'Better Utilisation']
  },
  {
    id: 'energy-10',
    industry: 'Energy',
    icon: 'Shield',
    title: 'Safety, Compliance & Incident Response',
    gap: `Safety processes are manual, poorly documented and not predictive.`,
    pain: `Safety incidents, regulatory non-compliance, high liability and operational downtime.`,
    solution: `Analyses incident patterns, predicts risk zones, auto-generates compliance docs and recommends prevention.`,
    metrics: ['Fewer Incidents', 'Audit Readiness']
  },
  {
    id: 'energy-11',
    industry: 'Energy',
    icon: 'Battery',
    title: 'Fuel Mix & Generation Optimisation',
    gap: `Generation planning is manual, not optimised for fuel cost or renewable variability and slow to react to demand shifts.`,
    pain: `High fuel cost, suboptimal generation mix and increased emissions.`,
    solution: `Analyses fuel prices, demand and renewable output to recommend optimal dispatch and lower fuel cost.`,
    metrics: ['Lower Fuel Spend', 'Improved Utilisation']
  },
  {
    id: 'energy-12',
    industry: 'Energy',
    icon: 'Thermometer',
    title: 'Carbon Emissions Tracking & ESG Intelligence',
    gap: `ESG reporting is manual, spreadsheet-driven and not integrated with generation or consumption data.`,
    pain: `Inaccurate emissions reporting, regulatory risk and poor sustainability metrics.`,
    solution: `Tracks emissions across assets, predicts ESG performance and auto-generates compliance reports.`,
    metrics: ['Real-time ESG', 'Audit-Ready Reports']
  },
  {
    id: 'energy-13',
    industry: 'Energy',
    icon: 'Battery',
    title: 'Storage & Battery Dispatch Optimisation',
    gap: `Battery storage is underutilised, poorly dispatched and not aligned with market prices or renewable peaks.`,
    pain: `High curtailment, poor ROI, inefficient cycles and missed arbitrage opportunities.`,
    solution: `Predicts peaks, recommends charge/discharge cycles and maximises arbitrage revenue while extending battery life.`,
    metrics: ['Higher Battery ROI', 'Less Curtailment']
  },
  {
    id: 'energy-14',
    industry: 'Energy',
    icon: 'Signal',
    title: 'Transmission Line Monitoring',
    gap: `Monitoring is infrequent and manual; weather and vegetation risks are not analysed in real time.`,
    pain: `Line faults, wildfire risk in some regions, high repair costs and catastrophic failures.`,
    solution: `Analyses thermal load, sag and weather to predict faults and flag vegetation risks for preventive action.`,
    metrics: ['Fewer Faults', 'Safer Network']
  },
  {
    id: 'energy-15',
    industry: 'Energy',
    icon: 'Signal',
    title: 'DER Orchestration',
    gap: `DERs are proliferating but utilities lack visibility, control and coordination with grid ops.`,
    pain: `Voltage fluctuations, reverse power flow, high curtailment and regulatory pressure.`,
    solution: `Predicts DER output, balances contribution with grid needs, recommends demand response and reduces curtailment.`,
    metrics: ['Stabler Grid', 'Better DER Utilisation']
  },
  {
    id: 'energy-16',
    industry: 'Energy',
    icon: 'Activity',
    title: 'Microgrid Management',
    gap: `Microgrids are fragmented, not optimised for local generation and poorly coordinated with the main grid.`,
    pain: `Island instability, poor utilisation of local renewables and high operational cost.`,
    solution: `Predicts local load and generation, optimises islanding/reconnection and coordinates storage and DERs.`,
    metrics: ['Resilient Microgrids', 'Improved Local ROI']
  },
  {
    id: 'energy-17',
    industry: 'Energy',
    icon: 'Activity',
    title: 'Energy Efficiency & Demand Response',
    gap: `DR programs are poorly adopted, not personalised and not integrated with smart meter data or customer behaviour.`,
    pain: `Low participation, high peak demand and regulatory pressure.`,
    solution: `Predicts peaks, identifies customers, recommends personalised DR actions and triggers automated reductions.`,
    metrics: ['Higher DR Savings', 'Peak Reduction']
  },
  {
    id: 'energy-18',
    industry: 'Energy',
    icon: 'Users',
    title: 'Customer Experience & Self-Service',
    gap: `Customer service is slow, manual, not personalised and not integrated with billing or outage systems.`,
    pain: `High call volumes, billing disputes, low digital adoption and poor trust.`,
    solution: `Provides instant answers, personalises communication and auto-resolves billing and outage queries.`,
    metrics: ['Lower Call Volume', 'Higher CSAT']
  },
  {
    id: 'energy-19',
    industry: 'Energy',
    icon: 'BarChart3',
    title: 'Real-Time Grid Operations Command Center',
    gap: `Data lives in silos; there is no unified visibility or predictive alerts for grid health.`,
    pain: `Delayed outage response, operational chaos and high SAIDI/SAIFI.`,
    solution: `Consolidates SCADA, GIS and AMI data to predict faults, recommend actions and coordinate crews.`,
    metrics: ['Faster Decisions', 'Lower Outage Impact']
  },
  {
    id: 'energy-20',
    industry: 'Energy',
    icon: 'Workflow',
    title: 'Multi-Agent Orchestration for Energy',
    gap: `Energy systems are a chain of systems that don't exchange decisions — load, generation, trading and storage are fragmented.`,
    pain: `High operational cost, grid instability and revenue leakage caused by fragmented decision-making.`,
    solution: `Enables agents to share data, decisions and actions across load forecasting, generation, trading, storage and DERs for autonomous orchestration.`,
    metrics: ['System-wide Optimisation', 'Lower Operational Friction']
  },

  // --- HEALTHCARE (Updated with Deep Dive) ---
  {
    id: 'health-1',
    industry: 'Healthcare',
    icon: 'UserCheck',
    title: 'Intelligent Patient Intake & Triage Agent',
    gap: `Patient intake is still:\nManual and paper-heavy\nSlow and inconsistent\nDependent on front-desk staff\nNot integrated with EMR\nNot linked to clinical urgency\nProne to errors\nThis creates delays, bottlenecks, and clinical risk.`,
    pain: `Long waiting times; Delayed diagnosis; Patient dissatisfaction; High staff workload; Inaccurate triage; Risk of adverse events. A slow intake process directly impacts patient outcomes.`,
    solution: `Kinexus agents triage patients intelligently and instantly. They read symptoms, vitals and history, prioritise by clinical urgency, auto-fill the EMR, flag red flags, and guide staff on next steps — protecting patient safety rather than just digitising forms.`,
    metrics: ['30% Less Wait Time', 'Better Clinical Safety']
  },
  {
    id: 'health-2',
    industry: 'Healthcare',
    icon: 'FileText',
    title: 'Clinical Documentation & EMR Automation Agent',
    gap: `Clinicians spend 30–40% of their time on documentation: notes typed manually, templates that vary, coding errors, slow EMR navigation, and rising cognitive load — driving inefficiency and burnout.`,
    pain: `Reduced face time with patients; Clinician burnout; Inaccurate medical records; Billing errors and compliance risk; Lower patient satisfaction. Documentation is a major drag on productivity.`,
    solution: `Kinexus agents generate clinical notes automatically: they listen to clinician–patient conversations, draft SOAP notes, suggest ICD/CPT codes, update the EMR, and flag missing information — reducing documentation burden while improving accuracy and revenue capture.`,
    metrics: ['Reduced Burnout', 'Accurate Billing']
  },
  {
    id: 'health-3',
    industry: 'Healthcare',
    icon: 'CalendarCheck',
    title: 'Appointment Scheduling & Capacity Optimisation',
    gap: `Scheduling remains manual and disconnected from clinician availability or case complexity. It is not predictive and is often siloed from resource availability.`,
    pain: `Long waiting lists; Idle clinician time; High no-show rates; Poor patient experience; Revenue leakage and operational inefficiency. Scheduling inefficiency can reduce hospital throughput by 10–25%.`,
    solution: `Kinexus agents optimise scheduling dynamically by predicting appointment duration, reducing no-shows, balancing clinician workload, recommending optimal slots, and syncing with EMR and resource agents — improving throughput and patient access.`,
    metrics: ['10-25% Throughput Gain', 'Lower No-Shows']
  },
  {
    id: 'health-4',
    industry: 'Healthcare',
    icon: 'Stethoscope',
    title: 'Diagnostic Reporting & Radiology Assistant',
    gap: `Radiology and diagnostic reporting face high backlogs, manual image review, inconsistent reporting quality, slow turnaround and lack of structured reports — placing heavy reliance on specialists.`,
    pain: `Delayed clinical decisions; Radiologist burnout; Inconsistent report quality; Patient anxiety; Operational bottlenecks and risk of missed findings.`,
    solution: `Kinexus agents assist radiologists by analysing scans (X‑ray, CT, MRI), highlighting abnormalities, suggesting structured reports, flagging urgent findings, and syncing findings with EMR and triage — accelerating diagnosis and reducing risk.`,
    metrics: ['Faster Diagnosis', 'Reduced Burnout']
  },
  {
    id: 'health-5',
    industry: 'Healthcare',
    icon: 'BedDouble',
    title: 'Hospital Bed Management & Patient Flow',
    gap: `Bed management is manual, spreadsheet-driven, not updated in real time, and poorly linked to discharge planning or ED/ICU coordination.`,
    pain: `ED overcrowding; Delayed admissions; Long patient wait times; Poor bed utilisation; High staff stress and clinical risk. Patient flow inefficiency drives hospital chaos.`,
    solution: `Kinexus agents manage beds autonomously: they track availability in real time, predict discharges, recommend patient placement, flag bottlenecks and sync with ED, ICU and scheduling agents to optimise flow and reduce overcrowding.`,
    metrics: ['Optimised Patient Flow', 'Reduced ED Overcrowding']
  },
  {
    id: 'health-6',
    industry: 'Healthcare',
    icon: 'FileText',
    title: 'Clinical Coding Automation',
    gap: 'Coding teams are backlogged; clinical notes are inconsistent and manual coding is slow.',
    pain: 'Delayed billing cycles, lost revenue, and coding errors leading to denials.',
    solution: 'Automatically extracts structured codes (ICD/ CPT) from clinical notes and flags ambiguous cases for human review.',
    metrics: ['Faster Coding Turnaround', 'Higher First-Pass Reimbursement']
  },
  {
    id: 'health-7',
    industry: 'Healthcare',
    icon: 'CalendarCheck',
    title: 'Discharge & Follow-up Automation',
    gap: 'Discharge summaries and follow-up scheduling are manual and often delayed.',
    pain: 'Longer LOS, missed follow-ups, readmissions, and poor patient experience.',
    solution: 'Generates discharge summaries, schedules follow-up appointments, and sends patient instructions automatically.',
    metrics: ['Reduced Readmissions', 'Improved Patient Satisfaction']
  },
  {
    id: 'health-8',
    industry: 'Healthcare',
    icon: 'DollarSign',
    title: 'Claims & Billing Automation',
    gap: 'Claims are frequently rejected due to coding/format errors and missing documentation.',
    pain: 'Revenue leakage, long AR cycles, and high administrative cost.',
    solution: 'Validates claims against documentation, auto-submits clean claims, and routes exceptions for rapid resolution.',
    metrics: ['Faster Claims Processing', 'Lower Denial Rates']
  },
  {
    id: 'health-9',
    industry: 'Healthcare',
    icon: 'Truck',
    title: 'Inventory & Supply Automation',
    gap: 'Manual inventory tracking leads to stockouts of critical supplies and expirations.',
    pain: 'Wasted spend, emergency procurement, and clinical delays.',
    solution: 'Monitors stock levels, predicts usage, and automates replenishment across sites.',
    metrics: ['Reduced Stockouts', 'Lower Holding Costs']
  },

  // --- HOSPITALITY (Updated with Deep Dive) ---
  {
    id: 'hosp-1',
    industry: 'Hospitality',
    icon: 'Coffee',
    title: 'Intelligent Guest Experience & Personalisation',
    gap: `Hotels collect guest data — but don’t use it intelligently. Preferences aren’t captured consistently; there is no unified guest profile; real‑time personalisation is missing; communication is generic; systems (PMS, CRM, POS, loyalty) are fragmented — creating forgettable experiences.`,
    pain: `Low repeat business; Weak loyalty program performance; Missed upsell opportunities; Inconsistent service quality; Negative reviews. Guest experience is the biggest driver of RevPAR — yet underutilised.`,
    solution: `Kinexus agents personalise the guest experience continuously: they build unified guest profiles, predict preferences (room, amenities, dining), trigger personalised outreach, recommend upsells, and sync across PMS, CRM and F&B — turning stays into loyalty and revenue.`,
    metrics: ['↑ RevPAR', '↑ Repeat Guests']
  },
  {
    id: 'hosp-2',
    industry: 'Hospitality',
    icon: 'DollarSign',
    title: 'Dynamic Pricing & Revenue Management',
    gap: `Revenue management is manual, dependent on specialist expertise, slow to react to demand shifts, disconnected from competitor pricing and ancillary channels, and not predictive.`,
    pain: `Suboptimal room rates; Low occupancy off-peak; Lost revenue during peak; Inaccurate forecasting; Heavy reliance on RM teams. Hotels can lose 5–15% revenue from pricing inefficiencies.`,
    solution: `Kinexus agents optimise pricing scientifically by analysing demand, events, seasonality and competitor moves, predicting occupancy and recommending optimal rates and distribution to maximise RevPAR and ancillary yield.`,
    metrics: ['5-15% Revenue Uplift', 'Better Yield']
  },
  {
    id: 'hosp-3',
    industry: 'Hospitality',
    icon: 'BedDouble',
    title: 'Housekeeping Productivity & Room Readiness',
    gap: `Housekeeping coordination is manual and supervisor-dependent, not aligned with check-in patterns or PMS status, and often causes delays and unpredictability.`,
    pain: `Delayed room readiness; Guest dissatisfaction; High staff fatigue; Inconsistent cleaning quality; Poor turnaround time. Housekeeping inefficiency directly impacts guest experience.`,
    solution: `Kinexus agents optimise housekeeping in real time: they predict room readiness, assign tasks based on workload, flag delays, recommend optimal cleaning routes and sync with PMS and front desk to ensure on-time check‑ins.`,
    metrics: ['Faster Turnaround', 'Higher Staff Productivity']
  },
  {
    id: 'hosp-4',
    industry: 'Hospitality',
    icon: 'Coffee',
    title: 'F&B Demand Forecasting & Menu Optimisation',
    gap: `F&B operations lack reliable demand forecasts; menu engineering is manual; inventory is poorly aligned to consumption; and profitability by dish is opaque.`,
    pain: `Food wastage; Stockouts during peak; Poor menu profitability; Inconsistent guest experience; Inefficient staffing. F&B is a major revenue driver but often poorly optimised.`,
    solution: `Kinexus agents forecast demand by outlet and daypart, recommend menu engineering changes, predict wastage, and align inventory and staffing with consumption — improving margins and guest satisfaction.`,
    metrics: ['Lower Wastage', 'Higher F&B Profitability']
  },
  {
    id: 'hosp-5',
    industry: 'Hospitality',
    icon: 'UserCheck',
    title: 'Front Desk Automation & Service Excellence',
    gap: `Front desk workflows are manual, slow, error-prone and not integrated with unified guest profiles or downstream operations.`,
    pain: `Long check-in/check-out times; Guest frustration; High staff workload; Inaccurate billing; Low upsell conversion; Poor first impressions that hurt stay satisfaction.`,
    solution: `Kinexus agents elevate front desk operations by auto‑filling guest details, predicting needs, recommending upsells, flagging VIPs and syncing with housekeeping, F&B and CRM — delivering faster check‑ins and better conversion.`,
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
  ,
  {
    id: 'edu-3',
    industry: 'Education',
    icon: 'CalendarCheck',
    title: 'Academic Planning & Timetable Optimisation',
    gap: `Timetabling is manual, error-prone and not aligned with faculty availability or student demand.`,
    pain: `Classroom conflicts, faculty overload, underutilised infrastructure and student dissatisfaction.`,
    solution: `Analyses faculty schedules and predicted demand to recommend optimal room allocation and prevent clashes.`,
    metrics: ['Better Utilisation', 'Fewer Clashes']
  },
  {
    id: 'edu-4',
    industry: 'Education',
    icon: 'Activity',
    title: 'Faculty Productivity & Workload Management',
    gap: `Faculty workload is uneven, dependent on manual planning and not tracked in real time.`,
    pain: `Burnout, inconsistent teaching quality, low research output and high attrition.`,
    solution: `Analyses teaching hours, research load and admin tasks to recommend balanced schedules and resource allocation.`,
    metrics: ['Balanced Workload', 'Higher Retention']
  },
  {
    id: 'edu-5',
    industry: 'Education',
    icon: 'BarChart3',
    title: 'Curriculum Mapping & Learning Outcome Intelligence',
    gap: `Curriculum design is manual, not linked to outcomes and not updated dynamically.`,
    pain: `Outdated curriculum, poor learning outcomes and accreditation challenges.`,
    solution: `Analyses course content, links topics to outcomes, identifies gaps and recommends updates.`,
    metrics: ['Improved Outcomes', 'Accreditation Ready']
  },
  {
    id: 'edu-6',
    industry: 'Education',
    icon: 'Activity',
    title: 'Attendance Monitoring & Behaviour Intelligence',
    gap: `Attendance tracking is manual, inconsistent and not predictive.`,
    pain: `Chronic absenteeism, late interventions and high dropout risk.`,
    solution: `Detects absentee patterns, predicts risk and recommends interventions while alerting teachers and parents.`,
    metrics: ['Early Alerts', 'Reduced Absenteeism']
  },
  {
    id: 'edu-7',
    industry: 'Education',
    icon: 'Users',
    title: 'LMS Engagement & Learning Analytics',
    gap: `LMS data is unused: engagement not analysed and personalised paths are missing.`,
    pain: `Low course completion, weak mastery and silent disengagement.`,
    solution: `Analyses engagement, predicts learning gaps and recommends personalised content and interventions.`,
    metrics: ['Higher Completion', 'Better Mastery']
  },
  {
    id: 'edu-8',
    industry: 'Education',
    icon: 'FileText',
    title: 'Examination & Assessment Automation',
    gap: `Assessment is manual, slow and not standardised.`,
    pain: `Slow result processing, inconsistent grading and high teacher workload.`,
    solution: `Auto-grades objective items, assists with subjective evaluation and maps results to learning outcomes.`,
    metrics: ['Faster Results', 'Consistent Grading']
  },
  {
    id: 'edu-9',
    industry: 'Education',
    icon: 'Users',
    title: 'Parent Communication & Engagement',
    gap: `Parent communication is inconsistent, manual and not personalised.`,
    pain: `Parents unaware of issues, low involvement and escalations.`,
    solution: `Personalises parent communication, shares performance updates and alerts for at-risk students.`,
    metrics: ['Higher Engagement', 'Faster Escalation']
  },
  {
    id: 'edu-10',
    industry: 'Education',
    icon: 'Users',
    title: 'Student Counselling & Wellbeing Agent',
    gap: `Wellbeing is under-monitored and reactive.`,
    pain: `Undetected mental health issues, high dropout risk and counsellor overload.`,
    solution: `Analyses academic and behavioural signals to predict wellbeing risk and recommend interventions to counsellors.`,
    metrics: ['Early Intervention', 'Reduced Crises']
  },
  {
    id: 'edu-11',
    industry: 'Education',
    icon: 'CheckCircle2',
    title: 'Accreditation & Compliance Agent',
    gap: `Accreditation is documentation-heavy, manual and reactive.`,
    pain: `Last-minute audit panic, non-compliance findings and high administrative workload.`,
    solution: `Tracks compliance indicators in real time, auto-generates documentation and flags gaps for corrective action.`,
    metrics: ['Audit Ready', 'Reduced Admin Overhead']
  },
  {
    id: 'edu-12',
    industry: 'Education',
    icon: 'DollarSign',
    title: 'Fee Management & Revenue Intelligence',
    gap: `Fee management is manual, fragmented and prone to errors.`,
    pain: `Delayed fee collection, outstanding dues and parent frustration.`,
    solution: `Predicts default risk, sends personalised reminders and auto-reconciles payments.`,
    metrics: ['Improved Collections', 'Lower DSO']
  },
  {
    id: 'edu-13',
    industry: 'Education',
    icon: 'Activity',
    title: 'Hostel & Campus Operations Agent',
    gap: `Hostel operations are manual and poorly monitored.`,
    pain: `Safety incidents, poor room allocation and high maintenance cost.`,
    solution: `Predicts room needs, tracks movement, flags safety risks and recommends maintenance actions.`,
    metrics: ['Safer Campus', 'Optimised Allocation']
  },
  {
    id: 'edu-14',
    industry: 'Education',
    icon: 'BarChart3',
    title: 'Placement & Employability Intelligence',
    gap: `Placements are manual, not data-driven and not aligned with industry needs.`,
    pain: `Low placement rates, poor salary outcomes and weak employer relationships.`,
    solution: `Analyses student skills, predicts employability and matches students to opportunities while recommending training.`,
    metrics: ['Higher Placements', 'Better Salary Outcomes']
  },
  {
    id: 'edu-15',
    industry: 'Education',
    icon: 'Users',
    title: 'Research Productivity & Grant Intelligence',
    gap: `Research ops are fragmented and poorly tracked.`,
    pain: `Missed grants, low publication rates and weak reputation.`,
    solution: `Analyses expertise, recommends topics, matches grants and tracks progress.`,
    metrics: ['More Grants', 'Higher Output']
  },
  {
    id: 'edu-16',
    industry: 'Education',
    icon: 'BarChart3',
    title: 'Library Intelligence & Resource Optimisation',
    gap: `Library operations are manual, poorly catalogued and not aligned with demand.`,
    pain: `Low utilisation, high subscription cost and poor learning support.`,
    solution: `Analyses borrowing/search patterns to predict demand and recommend subscription optimisation.`,
    metrics: ['Higher Utilisation', 'Lower Cost']
  },
  {
    id: 'edu-17',
    industry: 'Education',
    icon: 'Truck',
    title: 'Transport & Route Optimisation',
    gap: `Transport is manual, poorly routed and not linked to attendance.`,
    pain: `Late arrivals, safety risks and high fuel cost.`,
    solution: `Recommends optimal routes, predicts delays and tracks bus utilisation to improve safety and cost.`,
    metrics: ['Safer Transport', 'Lower Fuel']
  },
  {
    id: 'edu-18',
    industry: 'Education',
    icon: 'Activity',
    title: 'Multi-Campus Performance Intelligence',
    gap: `Multi-campus institutions lack unified visibility and cross-campus benchmarking.`,
    pain: `Uneven performance, operational inefficiency and slow decision-making.`,
    solution: `Consolidates data, benchmarks campuses and flags underperforming units for corrective action.`,
    metrics: ['Unified Visibility', 'Faster Decisions']
  },
  {
    id: 'edu-19',
    industry: 'Education',
    icon: 'Workflow',
    title: 'Student Lifecycle Journey Agent',
    gap: `Student journeys are fragmented across Admissions, Academics, Wellbeing and Placements.`,
    pain: `High dropout rates, fragmented interventions and poor student experience.`,
    solution: `Orchestrates the student journey end-to-end: predicts risks, triggers interventions and coordinates stakeholders.`,
    metrics: ['Lower Dropout', 'Better Experience']
  },
  {
    id: 'edu-20',
    industry: 'Education',
    icon: 'Workflow',
    title: 'Multi-Agent Orchestration for Education',
    gap: `Education systems don't talk to each other: Admissions, Academics, Counselling and Finance are siloed.`,
    pain: `Fragmented experience, operational cost and slow interventions.`,
    solution: `Enables cross-agent collaboration to share data, decisions and actions across the institution.`,
    metrics: ['System-wide Coordination', 'Operational Efficiency']
  }
];

// Remove duplicates from USE_CASE_DB by normalized title+industry
const _dedupeUseCases = (arr) => {
  const seen = new Set();
  const out = [];
  arr.forEach(u => {
    const key = ((u.title || '') + '|' + (u.industry || '')).toString().toLowerCase().replace(/[^a-z0-9]/g, '');
    if (!seen.has(key)) { seen.add(key); out.push(u); }
  });
  return out;
};

let UNIQUE_USE_CASE_DB = _dedupeUseCases(USE_CASE_DB);

// If a developer has generated `src/useCases.import.json` (from the Drive export),
// merge those entries into the database at runtime for review. Imported entries
// will be normalized and deduped by `id`.
try {
  // eslint-disable-next-line global-require, import/no-dynamic-require
  const imported = require('./useCases.import.json');
  if (Array.isArray(imported) && imported.length) {
    const existingIds = new Set(USE_CASE_DB.map(u => u.id));
    let nextIdx = 1;
    for (const raw of imported) {
      const item = typeof raw === 'object' ? raw : {};
      let id = (item.id || '').toString().trim();
      if (!id) {
        const base = (item.industry || 'misc').toString().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'uc';
        id = `${base}-${nextIdx++}`;
      }
      if (existingIds.has(id)) continue; // skip duplicates
      existingIds.add(id);
      USE_CASE_DB.push({
        id,
        industry: item.industry || 'Other',
        icon: item.icon || 'Activity',
        title: item.title || (item.name || 'Imported Use Case'),
        gap: item.gap || item.description || '',
        pain: item.pain || '',
        solution: item.solution || '',
        metrics: Array.isArray(item.metrics) ? item.metrics : (item.metrics ? [item.metrics] : [])
      });
    }
    // eslint-disable-next-line no-console
    console.debug('USE_CASE_DB: merged', imported.length, 'imported use-cases');
  }
} catch (e) {
  // file missing or parse error — that's fine in development
}

// recompute unique DB after any runtime merges
UNIQUE_USE_CASE_DB = _dedupeUseCases(USE_CASE_DB);

// Industries list is computed at runtime from the DB (see 'industries' useMemo)

// --- HELPER COMPONENTS ---
// (FilterBar and SearchBar removed to avoid unused-var lint warnings)

const UseCaseModal = ({ useCase, onClose }) => {
  if (!useCase) return null;
  const Icon = getIcon(useCase.icon);

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6">
        <div className="sticky top-0 bg-white/95 z-10 p-4 border-b border-gray-100 flex justify-between items-start">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 bg-[#E8E7FF] rounded-2xl flex items-center justify-center text-[#5856D6]"><Icon className="w-8 h-8" /></div>
            <div>
              <div className="text-sm font-semibold text-[#5856D6] uppercase tracking-wider mb-1">{useCase.industry}</div>
              <h2 className="text-2xl font-semibold text-[#212121] leading-tight">{useCase.title}</h2>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100"><X className="w-6 h-6" /></button>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-red-50 p-6 rounded-2xl border border-red-100">
              <div className="flex items-center space-x-2 mb-4 text-red-600 font-bold"><AlertTriangle className="w-5 h-5" /><span>The Real Gap</span></div>
              <p className="text-[#212121] text-sm opacity-90">{useCase.gap}</p>
            </div>
            <div className="bg-orange-50 p-6 rounded-2xl border border-orange-100">
              <div className="flex items-center space-x-2 mb-4 text-orange-600 font-bold"><DollarSign className="w-5 h-5" /><span>The Hidden Pain</span></div>
              <p className="text-[#212121] text-sm opacity-90">{useCase.pain}</p>
            </div>
            <div className="bg-[#212121] p-6 rounded-2xl text-white shadow-lg relative overflow-hidden">
              <div className="flex items-center space-x-2 mb-4 text-[#2EC5CE] font-bold relative z-10"><CheckCircle2 className="w-5 h-5" /><span>Kinexus Solution</span></div>
              <p className="text-gray-300 text-sm relative z-10">{useCase.solution}</p>
            </div>
          </div>

          <div className="bg-[#F8F9FC] rounded-2xl p-6">
            <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Projected Impact</h4>
            <div className="flex flex-wrap gap-4">
              {(useCase.metrics || []).map((m, i) => (
                <div key={i} className="flex items-center space-x-2 bg-white px-4 py-2 rounded-lg border border-gray-100 shadow-sm">
                  <Activity className="w-4 h-4 text-[#5856D6]" />
                  <span className="text-sm font-bold text-[#212121]">{m}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

// --- MAIN PAGE COMPONENT (Premium 2-pane Industry Explorer + Canvas) ---
const UseCasesPage = ({ navigate, initialIndustry = null }) => {
  const [searchParams, setSearchParamsState] = useState(() => new URLSearchParams(window.location.search));
  const [loading, setLoading] = useState(false);
  // omit prefers-reduced-motion handling for now (unused)

  const getParam = (k) => searchParams.get(k);
  const getArray = (k) => (searchParams.get(k) || '').split(',').filter(Boolean);

  useEffect(() => {
    const onPop = () => setSearchParamsState(new URLSearchParams(window.location.search));
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  useEffect(() => {
    if (initialIndustry) {
      const p = new URLSearchParams(window.location.search);
      if (!p.get('industry')) {
        p.set('industry', initialIndustry.toString().toLowerCase());
        window.history.replaceState({}, '', p.toString() ? `?${p.toString()}` : window.location.pathname);
        setSearchParamsState(new URLSearchParams(window.location.search));
      }
    }
  }, [initialIndustry]);

  const setParams = (updater) => {
    setLoading(true);
    const p = new URLSearchParams(window.location.search);
    updater(p);
    const qs = p.toString();
    window.history.pushState({}, '', qs ? `?${qs}` : window.location.pathname + window.location.hash);
    setTimeout(() => {
      setSearchParamsState(new URLSearchParams(window.location.search));
      setLoading(false);
      try { window.scrollTo({ top: 0, behavior: 'smooth' }); } catch (e) {}
    }, 220);
  };

  const industryParam = (getParam('industry') || 'all').toString().toLowerCase();
  const qParam = getParam('q') || '';
  const problemParam = getArray('problem');
  const complexityParam = getArray('complexity');

  const industries = useMemo(() => {
    const map = new Map();
    UNIQUE_USE_CASE_DB.forEach(u => map.set(u.industry || 'Other', (map.get(u.industry) || 0) + 1));
    const list = ['All', 'Favourites', ...Array.from(map.keys())];
    return { list, counts: map };
  }, []);

  const microCopy = [
    'Select an industry to see where agents replace manual ops.',
    'Agents reduce manual effort and improve throughput.',
    'Explore pre-built blueprints and integration patterns.'
  ];
  const [mcIndex, setMcIndex] = useState(0);
  useEffect(() => { const t = setInterval(() => setMcIndex(i => (i+1) % microCopy.length), 4200); return () => clearInterval(t); }, [microCopy.length]);

  const [favs, setFavs] = useState(() => { try { return JSON.parse(localStorage.getItem('kinexus_favs') || '[]'); } catch (e) { return []; } });
  const toggleFav = (id) => { const next = favs.includes(id) ? favs.filter(x=>x!==id) : [...favs, id]; setFavs(next); localStorage.setItem('kinexus_favs', JSON.stringify(next)); };
  const [activeUseCase, setActiveUseCase] = useState(null);
  // admin import handled in admin pages

  const clusterFor = (u) => {
    const s = `${u.title} ${u.gap} ${u.solution}`.toLowerCase();
    if (s.includes('dispatch') || s.includes('route') || s.includes('eta') || s.includes('driver')) return 'Dispatch & Routing';
    if (s.includes('warehouse') || s.includes('inventory') || s.includes('slot') || s.includes('replenish')) return 'Warehouse & Inventory';
    if (s.includes('audit') || s.includes('freight') || s.includes('cost')) return 'Network & Cost Optimisation';
    if (s.includes('predict') || s.includes('forecast') || s.includes('demand')) return 'Forecasting & Visibility';
    return 'Other Outcomes';
  };

  // Merge any admin-imported usecases saved in localStorage at runtime
  useEffect(() => {
    try {
      const raw = localStorage.getItem('kinexus_imported_usecases');
      if (raw) {
        const imported = JSON.parse(raw);
        if (Array.isArray(imported) && imported.length) {
          const existingIds = new Set(USE_CASE_DB.map(u => u.id));
          let nextIdx = 1;
          for (const item of imported) {
            const it = typeof item === 'object' && item ? item : {};
            let id = (it.id || '').toString().trim();
            if (!id) {
              const base = (it.industry || 'misc').toString().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'uc';
              id = `${base}-import-${nextIdx++}`;
            }
            if (existingIds.has(id)) continue;
            existingIds.add(id);
            USE_CASE_DB.push({
              id,
              industry: it.industry || 'Other',
              icon: it.icon || 'Activity',
              title: it.title || it.name || 'Imported Use Case',
              gap: it.gap || it.description || '',
              pain: it.pain || '',
              solution: it.solution || '',
              metrics: Array.isArray(it.metrics) ? it.metrics : (it.metrics ? [it.metrics] : [])
            });
          }
          UNIQUE_USE_CASE_DB = _dedupeUseCases(USE_CASE_DB);
          setSearchParamsState(s => new URLSearchParams(s.toString()));
        }
      }
    } catch (e) {
      // ignore parse errors
    }
  }, []);

  const filtered = useMemo(() => {
    const q = (qParam || '').toLowerCase().trim();
    return UNIQUE_USE_CASE_DB.filter(u => {
      const ind = (u.industry || '').toLowerCase();
      if (industryParam !== 'all') {
        if (industryParam === 'favourites') { if (!favs.includes(u.id)) return false; }
        else if (industryParam !== ind) return false;
      }
      if (q) { const hay = `${u.title} ${u.gap} ${u.pain} ${u.solution} ${u.metrics.join(' ')}`.toLowerCase(); if (!hay.includes(q)) return false; }
      for (const tok of problemParam) if (!`${u.title} ${u.gap} ${u.solution}`.toLowerCase().includes(tok.toLowerCase())) return false;
      for (const c of complexityParam) { const t = c.toLowerCase(); if (t === 'basic' && `${u.solution}`.toLowerCase().includes('predict')) return false; }
      return true;
    });
  }, [industryParam, qParam, problemParam, complexityParam, favs]);

  const groups = useMemo(() => { const m = new Map(); filtered.forEach(u => { const cl = clusterFor(u); if (!m.has(cl)) m.set(cl, []); m.get(cl).push(u); }); return m; }, [filtered]);

  const setIndustry = (label) => setParams(p => { if (!label || label==='All') p.delete('industry'); else p.set('industry', label.toString().toLowerCase()); });
  const onSearch = (v) => setParams(p => { if (v) p.set('q', v); else p.delete('q'); });
  const toggleChip = (k,v) => setParams(p => { const arr = (p.get(k)||'').split(',').filter(Boolean); const idx = arr.indexOf(v); if (idx>=0) arr.splice(idx,1); else arr.push(v); if (arr.length) p.set(k, arr.join(',')); else p.delete(k); });

  const countFor = (industry) => { if (industry === 'All') return UNIQUE_USE_CASE_DB.length; if (industry === 'Favourites') return UNIQUE_USE_CASE_DB.filter(u=>favs.includes(u.id)).length; return UNIQUE_USE_CASE_DB.filter(u => (u.industry||'').toLowerCase() === industry.toLowerCase()).length; };

  const problemChips = ['Planning','Execution','Visibility','Finance','Customer Experience'];
  const complexityChips = ['Basic','Advanced','Multi-agent'];

  const canvasRef = useRef(null);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const localStyles = `
  .usecases-root { --bg: var(--pure-white); color: var(--deep-navy); }
  .usecases-root .panel { background: linear-gradient(180deg, var(--pure-white), #fbfbff); border-radius: 18px; }
  .usecases-root .usecases-hero { background: var(--pure-white); border-radius: 18px; padding: 28px; }
  .usecases-root .usecases-card { background: var(--pure-white); border-radius: 14px; border: 1px solid rgba(17,24,39,0.04); box-shadow: 0 10px 30px rgba(17,24,39,0.04); padding: 22px; }
  .usecases-root .usecase-title { font-size: 1.125rem; line-height: 1.45; margin-bottom: 0.75rem; color: var(--deep-navy); }
  .usecases-root .usecase-desc { line-height: 1.8; color: var(--supporting-gray); margin-bottom: 0.75rem; }
  .usecases-root .industry-badge { background: rgba(88,86,214,0.06); color: var(--primary-purple); padding: 6px 10px; border-radius: 9999px; font-weight:700; font-size: 12px; }
  .usecases-root .left-aside { background: linear-gradient(180deg, rgba(8,38,58,0.04), rgba(6,50,67,0.02)); border-radius: 14px; }
  .usecases-root .right-scroll { max-height: calc(100vh - 6.5rem); overflow-y: auto; scrollbar-gutter: stable both-edges; padding-right: 8px; }
  .usecases-root .right-scroll::-webkit-scrollbar { width: 12px; }
  .usecases-root .right-scroll::-webkit-scrollbar-thumb { background: rgba(17,24,39,0.06); border-radius: 8px; }
  @media (max-width: 768px) { .usecases-root .usecase-title { font-size: 1rem; } }
  `;

  return (
    <div className="usecases-root min-h-screen bg-white pt-16 pb-16 relative overflow-hidden">
      <style>{localStyles}</style>
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex gap-8">
          <aside className="w-80 text-sm">
            <div className="bg-white border border-gray-100 rounded-2xl p-5 sticky top-24 text-[#0b1f2c]">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="text-white text-lg font-bold">Industry Explorer</h3>
                  <div className="text-xs text-slate-300 mt-1">{microCopy[mcIndex]}</div>
                </div>
                <div className="text-xs text-slate-300">{loading ? 'Updating…' : ''}</div>
              </div>

              <div className="mt-3 space-y-2">
                {industries.list.map((ind) => {
                  const key = ind;
                  const active = (industryParam === ind.toString().toLowerCase()) || (industryParam === 'all' && ind === 'All');
                  return (
                    <button
                      key={key}
                      onClick={() => setIndustry(ind)}
                      className={`w-full text-left flex items-center justify-between px-3 py-2 rounded-lg transition-all border-l-4 border-transparent ${active ? 'bg-transparent border-[#2EC5CE] shadow-sm' : 'hover:bg-gray-50'}`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${active ? 'bg-[#2EC5CE] text-white' : 'bg-white/5 text-slate-400'}`}>{ind}</div>
                      </div>
                      <div className="text-xs text-slate-400">{countFor(ind)}</div>
                    </button>
                  );
                })}
              </div>

              <div className="mt-5 pt-4 border-t border-white/6">
                <div className="text-xs text-slate-300 mb-2">Quick filters</div>
                <div className="flex flex-wrap gap-2">
                  <button onClick={() => setParams(p => { p.delete('q'); p.delete('problem'); p.delete('complexity'); p.delete('industry'); })} className="px-3 py-1 rounded-full bg-white/5 text-xs">Reset</button>
                  <button onClick={() => setIndustry('Favourites')} className="px-3 py-1 rounded-full bg-white/5 text-xs">Favourites</button>
                </div>
              </div>
            </div>
          </aside>

          <main className="flex-1" ref={canvasRef}>
            <div className="right-scroll">
              <div className="bg-white rounded-2xl p-4 shadow-sm sticky top-0 z-20">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold" style={{color: 'var(--deep-navy)'}}>{industryParam==='all' ? 'Agent Library' : `${industryParam.charAt(0).toUpperCase()+industryParam.slice(1)} Agent Library`}</h2>
                  <div className="text-sm text-gray-600 mt-1">{filtered.length} pre-built agents to explore</div>
                </div>
                <div className="flex items-center gap-3">
                    <button onClick={() => setFiltersOpen(s => !s)} className="px-3 py-1 rounded-md bg-gray-100 text-sm">{filtersOpen ? 'Hide filters' : 'Show filters'}</button>
                </div>
              </div>

              {filtersOpen && (
                <div className="mt-4">
                  <div className="hidden md:flex gap-2 mb-3">
                    {problemChips.map(c => <button key={c} onClick={() => toggleChip('problem', c)} className={`px-3 py-1 rounded-full text-sm ${getArray('problem').includes(c) ? 'bg-[#2EC5CE] text-white' : 'bg-gray-100 text-gray-700'}`}>{c}</button>)}
                  </div>

                  <div className="w-full">
                    <div className="relative bg-white rounded-full border border-gray-200 px-4 py-3">
                      <Search className="w-5 h-5 text-gray-400 inline-block mr-3" />
                      <input defaultValue={qParam} onChange={(e)=> onSearch(e.target.value)} placeholder="Search by pain, e.g. 'ETA', 'slotting'…" className="w-full px-2 text-sm focus:outline-none" />
                    </div>
                  </div>

                  <div className="mt-3 flex gap-2">
                    {complexityChips.map(c => <button key={c} onClick={() => toggleChip('complexity', c)} className={`px-3 py-1 rounded-lg text-sm ${getArray('complexity').includes(c) ? 'bg-[#2EC5CE] text-white' : 'bg-gray-100 text-gray-700'}`}>{c}</button>)}
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6 space-y-6">
              {loading && (<div className="p-6 bg-white/5 rounded-lg animate-pulse text-center text-gray-400">Loading agents…</div>)}

              {!loading && (groups.size === 0) && (
                <div className="bg-white rounded-2xl p-12 text-center">
                  <div className="mb-4 text-6xl">🤖</div>
                  <h3 className="text-xl font-bold">No agents match this combo yet</h3>
                  <p className="text-gray-600">Tell us what you want to automate and we'll build it.</p>
                </div>
              )}

              {!loading && Array.from(groups.entries()).map(([cluster, items]) => (
                <section key={cluster}>
                  {cluster !== 'Other Outcomes' && (
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-lg font-semibold">{cluster}</h4>
                      <div className="text-sm text-gray-500">{items.length} agents</div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {items.map((u) => {
                        const Icon = getIcon(u.icon);
                        return (
                          <div key={u.id} className="usecases-card p-6 transition-transform hover:-translate-y-1">
                            <div className="flex items-center justify-between">
                              <div className="text-xs text-slate-500 font-semibold">{u.industry.toUpperCase()} · {cluster}</div>
                              <div className="flex items-center gap-3">
                                <button onClick={(e)=>{ e.stopPropagation(); toggleFav(u.id); }} className={`p-1 rounded-full ${favs.includes(u.id)?'bg-yellow-100':'bg-white'}`}><HeartPulse className="w-4 h-4 text-red-500" /></button>
                                <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center" style={{color: 'var(--primary-purple)'}}><Icon className="w-5 h-5" /></div>
                              </div>
                            </div>

                            <h5 className="usecase-title font-bold mt-3">{u.title}</h5>
                            <p className="usecase-desc text-sm mt-2 line-clamp-3">{u.gap}</p>

                            <div className="mt-4 flex items-center gap-2 text-xs text-gray-600 card-metrics">
                              <div className="px-2 py-1 bg-gray-100 rounded-full">Go-live: 2–4 weeks</div>
                              <div className="px-2 py-1 bg-gray-100 rounded-full">ROI: {u.metrics && u.metrics[0] ? u.metrics[0] : 'Varies'}</div>
                              <div className="px-2 py-1 bg-gray-100 rounded-full">Integrates: TMS, GPS, WMS</div>
                            </div>

                            <div className="mt-4 flex items-center justify-between">
                              <div className="text-sm text-gray-500">Ideal for fleets &gt; 50 vehicles</div>
                              <button onClick={() => setActiveUseCase(u)} className="px-3 py-1 rounded-lg border font-semibold" style={{borderColor: 'var(--primary-purple)', color: 'var(--primary-purple)'}}>View Details</button>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </section>
              ))}
            </div>
            </div>
          </main>
        </div>
      </div>
      <UseCaseModal useCase={activeUseCase} onClose={() => setActiveUseCase(null)} />
    </div>
  );
};

export default UseCasesPage;