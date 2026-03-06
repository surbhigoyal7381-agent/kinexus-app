import React, { useEffect } from 'react';
import { ArrowRight, Activity, Factory, Truck, BarChart, Globe, Users, ShoppingCart, FileText } from 'lucide-react';
import { useState, useMemo } from 'react';

const ICON_MAP = { Activity, Factory, Truck, BarChart, Globe, Users, ShoppingCart, FileText };
const getIcon = (name) => ICON_MAP[name] || Activity;

// --- ROI Calculator ---
const ROI_CONFIG = {
  manufacturing: {
    fields: [
      { key: 'laborCostPerHour', label: 'Average labour cost (per hour)', placeholder: '50', unit: '$' },
      { key: 'hoursSavedPerDay', label: 'Labour hours saved (per day)', placeholder: '10', unit: 'h' },
      { key: 'daysPerYear', label: 'Working days per year', placeholder: '250', unit: 'd' },
      { key: 'revenuePerDay', label: 'Revenue per day', placeholder: '20000', unit: '$' },
      { key: 'productionGainPercent', label: 'Expected production gain (%)', placeholder: '5', unit: '%' },
      { key: 'implementationCost', label: 'Implementation cost (one-time)', placeholder: '50000', unit: '$' }
    ],
    compute: (v) => {
      const labor = v.laborCostPerHour * v.hoursSavedPerDay * v.daysPerYear;
      const revenueGain = v.revenuePerDay * v.daysPerYear * (v.productionGainPercent/100);
      const annual = labor + revenueGain;
      return { annualSavings: annual, paybackMonths: v.implementationCost > 0 ? (v.implementationCost / (annual/12)) : null };
    }
  },
  logistics: {
    fields: [
      { key: 'vehicles', label: 'Number of vehicles', placeholder: '10' },
      { key: 'milesPerVehiclePerDay', label: 'Avg miles per vehicle / day', placeholder: '120', unit: 'mi' },
      { key: 'costPerMile', label: 'Operating cost per mile', placeholder: '1.2', unit: '$' },
      { key: 'fuelSavingsPercent', label: 'Expected cost reduction (%)', placeholder: '8', unit: '%' },
      { key: 'daysPerYear', label: 'Operating days / year', placeholder: '300' },
      { key: 'implementationCost', label: 'Implementation cost (one-time)', placeholder: '40000', unit: '$' }
    ],
    compute: (v) => {
      const annualKmCost = v.vehicles * v.milesPerVehiclePerDay * v.costPerMile * v.daysPerYear;
      const annual = annualKmCost * (v.fuelSavingsPercent/100);
      return { annualSavings: annual, paybackMonths: v.implementationCost > 0 ? (v.implementationCost / (annual/12)) : null };
    }
  },
  banking: {
    fields: [
      { key: 'avgProcessMin', label: 'Avg manual processing time (min)', placeholder: '20', unit: 'min' },
      { key: 'applicationsPerDay', label: 'Applications processed / day', placeholder: '200' },
      { key: 'staffCostPerHour', label: 'Staff cost per hour', placeholder: '30', unit: '$' },
      { key: 'reductionPercent', label: 'Time reduction (%)', placeholder: '60', unit: '%' },
      { key: 'daysPerYear', label: 'Working days / year', placeholder: '250' },
      { key: 'implementationCost', label: 'Implementation cost (one-time)', placeholder: '30000', unit: '$' }
    ],
    compute: (v) => {
      const timeSavedHours = (v.avgProcessMin/60) * v.applicationsPerDay * (v.reductionPercent/100) * v.daysPerYear;
      const annual = timeSavedHours * v.staffCostPerHour;
      return { annualSavings: annual, paybackMonths: v.implementationCost > 0 ? (v.implementationCost / (annual/12)) : null };
    }
  },
  healthcare: {
    fields: [
      { key: 'clinicianHoursSavedPerDay', label: 'Clinician hours saved / day', placeholder: '5', unit: 'h' },
      { key: 'clinicianCostPerHour', label: 'Clinician cost / hour', placeholder: '90', unit: '$' },
      { key: 'daysPerYear', label: 'Working days / year', placeholder: '250' },
      { key: 'patientsPerDay', label: 'Patients seen / day', placeholder: '80' },
      { key: 'revenuePerPatient', label: 'Revenue per patient', placeholder: '100', unit: '$' },
      { key: 'revenueIncreasePercent', label: 'Revenue increase (%)', placeholder: '2', unit: '%' },
      { key: 'implementationCost', label: 'Implementation cost (one-time)', placeholder: '60000', unit: '$' }
    ],
    compute: (v) => {
      const labor = v.clinicianHoursSavedPerDay * v.clinicianCostPerHour * v.daysPerYear;
      const revenue = v.patientsPerDay * v.revenuePerPatient * v.daysPerYear * (v.revenueIncreasePercent/100);
      const annual = labor + revenue;
      return { annualSavings: annual, paybackMonths: v.implementationCost > 0 ? (v.implementationCost / (annual/12)) : null };
    }
  },
  retail: {
    fields: [
      { key: 'avgInventoryValue', label: 'Average inventory value', placeholder: '500000', unit: '$' },
      { key: 'inventoryReductionPercent', label: 'Working capital reduction (%)', placeholder: '8', unit: '%' },
      { key: 'implementationCost', label: 'Implementation cost (one-time)', placeholder: '30000', unit: '$' }
    ],
    compute: (v) => {
      const annual = v.avgInventoryValue * (v.inventoryReductionPercent/100);
      return { annualSavings: annual, paybackMonths: v.implementationCost > 0 ? (v.implementationCost / (annual/12)) : null };
    }
  }
};

const number = (v) => (isNaN(Number(v)) ? 0 : Number(v));

function ROIForm({ industryId, industryName }) {
  const cfg = ROI_CONFIG[industryId] || ROI_CONFIG['manufacturing'];
  const initial = cfg.fields.reduce((acc, f) => ({ ...acc, [f.key]: number(f.placeholder) }), {});
  const [values, setValues] = useState(initial);

  const onChange = (k, v) => setValues(prev => ({ ...prev, [k]: number(v) }));

  const result = useMemo(() => {
    try {
      return cfg.compute(values);
    } catch (e) {
      return { annualSavings: 0, paybackMonths: null };
    }
  }, [values, cfg]);

  return (
    <div>
      <div className="space-y-3">
        {cfg.fields.map(f => (
          <div key={f.key} className="flex items-center gap-3">
            <label className="w-56 text-sm text-gray-700">{f.label}</label>
            <input type="number" value={values[f.key]} onChange={e => onChange(f.key, e.target.value)} placeholder={f.placeholder} className="flex-1 border p-2 rounded-lg" />
            {f.unit && <div className="w-16 text-right text-sm text-gray-500">{f.unit}</div>}
          </div>
        ))}
      </div>

      <div className="mt-4 p-4 bg-white border rounded-lg">
        <div className="text-sm text-gray-600">Estimated annual savings</div>
        <div className="text-2xl font-bold text-[#212121]">${Math.round(result.annualSavings).toLocaleString()}</div>
        <div className="text-sm text-gray-600 mt-2">{result.paybackMonths ? `Payback: ${Math.round(result.paybackMonths)} months` : 'Payback: N/A'}</div>
      </div>
    </div>
  );
}

export default function IndustryPage({ id, navigate, industries = [], useCases = [] }) {
  const industry = industries.find(i => i.id === id) || industries.find(i => i.name === id);
  // hero images removed from industry pages (UI-only); skip loading/variants

  // SEO: set title and meta description + og:image
  useEffect(() => {
    if (!industry) return;
    const title = `${industry.name} Automation & AI | Kinexus`;
    const desc = industry.subhead || industry.desc || `${industry.name} transformation with agentic AI to reduce cost and improve throughput.`;
    document.title = title;

    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.name = 'description';
      document.head.appendChild(metaDesc);
    }
    metaDesc.content = desc;

    // Open Graph tags
    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (!ogTitle) { ogTitle = document.createElement('meta'); ogTitle.setAttribute('property', 'og:title'); document.head.appendChild(ogTitle); }
    ogTitle.content = title;

    let ogDesc = document.querySelector('meta[property="og:description"]');
    if (!ogDesc) { ogDesc = document.createElement('meta'); ogDesc.setAttribute('property', 'og:description'); document.head.appendChild(ogDesc); }
    ogDesc.content = desc;

    // no og:image for industry pages (hero removed)
    // add JSON-LD script for structured data
    const ld = {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": title,
      "description": desc,
      "mainEntity": {
        "@type": "Service",
        "name": `${industry.name} Automation` ,
        "description": industry.subhead || industry.desc
      }
    };
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.setAttribute('data-generated', `industry-${industry.id}`);
    script.textContent = JSON.stringify(ld);
    document.head.appendChild(script);

    // canonical link
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.href = window.location.href;

    return () => {
      // remove the injected JSON-LD when navigating away
      try { document.head.removeChild(script); } catch (e) { /* ignore */ }
    };
  }, [industry]);

  if (!industry) {
    return (
      <div className="min-h-screen pt-24 pb-16 bg-transparent">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-2xl font-bold mb-4">Industry not found</h2>
          <p className="text-gray-600 mb-6">The industry you requested doesn't exist or was removed.</p>
          <button onClick={() => navigate('industries')} className="inline-flex items-center px-4 py-2 bg-[#5856D6] text-white rounded-lg">Back to Industries</button>
        </div>
      </div>
    );
  }

  const Icon = getIcon(industry.icon);
  const relatedCases = useCases.filter(c => c.industry === industry.name || c.industry === industry.id);
  

  return (
    <div className="min-h-screen bg-transparent pt-24 pb-16 animate-fade-in-up">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-8 items-center mb-8">
          <div>
            <div className="inline-flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 rounded-lg bg-[#E8E7FF] flex items-center justify-center text-[#5856D6]"><Icon className="w-6 h-6" /></div>
              <div>
                <div className="text-xs text-gray-500">Industry</div>
                <div className="text-2xl font-bold">{industry.name}</div>
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl font-semibold mb-4">{industry.hero || `Transforming ${industry.name}`}</h1>
            <p className="text-gray-600 mb-6 max-w-3xl">{industry.subhead || industry.desc}</p>
            <div className="space-y-4">
              <p className="text-gray-700">{industry.gap || 'We analyse the end-to-end operations to remove friction, reduce costs and unlock automation opportunities that deliver measurable ROI.'}</p>
              <p className="text-gray-700">{industry.pain || 'Typical pain points include manual handoffs, siloed data, high operating costs, and fragile processes that break at scale.'}</p>
            </div>
            <div className="mt-6 flex space-x-4">
              <button onClick={() => navigate('contact')} className="inline-flex items-center px-4 py-2 bg-[#2EC5CE] text-white rounded-lg">Talk to an Expert <ArrowRight className="w-4 h-4 ml-2" /></button>
              <button onClick={() => navigate('useCases', { industry: industry.name })} className="inline-flex items-center px-4 py-2 border border-[#5856D6] text-[#5856D6] rounded-lg">See Use Cases</button>
            </div>
          </div>
          <div className="bg-[#F7F5FF] p-6 rounded-2xl">
            <h3 className="font-semibold mb-3">How we help</h3>
            <ul className="space-y-3 text-gray-700">
              <li>Agent-led process automation across systems and teams</li>
              <li>Custom integrations and data orchestration</li>
              <li>Operational monitoring, error handling and governance</li>
              <li>Business outcome tracking (throughput, cost, quality)</li>
            </ul>
          </div>
        </div>

        {/* Custom sections driven from industry data */}
          {industry.customSections && industry.customSections.length > 0 && (
            <div className="mt-10 space-y-6">
              {industry.customSections.map((s, i) => (
                <div key={i} className={`p-6 rounded-2xl ${i % 2 === 0 ? 'bg-white/90 border' : 'bg-[#F7F7FF]'} shadow-sm grid md:grid-cols-3 gap-4 items-center`}>
                  <div className="md:col-span-2">
                    <h4 className="font-semibold mb-2 text-[#212121]">{s.title}</h4>
                    <p className="text-gray-700 text-sm leading-relaxed">{s.body}</p>
                  </div>
                  <div className="flex justify-end md:justify-center">
                    <div className="w-16 h-16 bg-[#E8E7FF] rounded-lg flex items-center justify-center text-[#5856D6] font-bold">{s.title.split(' ').slice(0,1)}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

        <div className="mt-8">
          <h3 className="text-xl font-bold mb-4">Real use cases</h3>
          <div className="grid md:grid-cols-2 gap-6">
              {relatedCases.length ? relatedCases.map((c, idx) => (
              <div key={idx} className="p-4 border rounded-xl bg-white/90">
                <div className="text-sm text-gray-500 mb-1">{c.title}</div>
                <div className="text-gray-700 text-sm mb-2">{c.challenge}</div>
                <div className="text-xs text-gray-600">Solution: {c.solution}</div>
              </div>
            )) : (
              <div className="p-6 bg-gray-50 rounded-xl text-gray-600">No pre-built use cases found for this industry yet. We can design tailored pilots during Week 1-4.</div>
            )}
          </div>
        </div>

        {/* ROI Calculator */}
        <div className="mt-10 grid lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <h3 className="text-xl font-bold mb-4">ROI Calculator</h3>
            <p className="text-sm text-gray-600 mb-4">Estimate annual savings and payback for automations in the {industry.name} vertical.</p>
            <ROIForm industryId={industry.id} industryName={industry.name} />
          </div>
          <div className="bg-[#F8F9FF] p-6 rounded-2xl">
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <div className="text-3xl font-extrabold">35%</div>
              <div className="text-sm text-gray-600">Typical improvement in process throughput</div>
            </div>
            <div>
              <div className="text-3xl font-extrabold">40%</div>
              <div className="text-sm text-gray-600">Reduction in manual reviews</div>
            </div>
            <div>
              <div className="text-3xl font-extrabold">10x</div>
              <div className="text-sm text-gray-600">ROI within 12–24 months (typical)</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
