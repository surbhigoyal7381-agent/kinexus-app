// Extracted large static constants from src/App.js to keep the file smaller
export const INDUSTRY_SLIDE_METRICS = {
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

export const CASE_STUDIES = [
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
