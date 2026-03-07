import React, { useEffect, useMemo, useState } from 'react';
import { ArrowRight, Activity, Factory, Truck, BarChart, Globe, Users, ShoppingCart, FileText, DollarSign } from 'lucide-react';
import kinexusHero from '../assets/kinexus-hero.png';
import logisticHero from '../assets/logistic_hero.png';
import manufacturingHero from '../assets/Manufacturing_hero.png';
import retailHero from '../assets/retail_hero.png';
import educationHero from '../assets/hero-education.svg';
import energyHero from '../assets/energy_hero.png';
import pharmaHero from '../assets/pharma_hero.png';
import hospitalityHero from '../assets/hospitality_hero.png';
import realestateHero from '../assets/realestate_hero.png';

const ICON_MAP = { Activity, Factory, Truck, BarChart, Globe, Users, ShoppingCart, FileText };
const getIcon = (name) => ICON_MAP[name] || Activity;

// ROI calculator moved to its own page: src/pages/ROIPage.js

export default function IndustryPage({ id, navigate, industries = [], useCases = [] }) {
  const industry = useMemo(() => industries.find(i => i.id === id) || industries.find(i => i.name === id), [id, industries]);

  // Image query candidates (moved before early returns to keep hooks stable)

  const IMAGE_QUERIES = {
    manufacturing: 'manufacturing factory production',
    logistics: 'logistics trucks warehouse dispatch',
    banking: 'banking finance office',
    healthcare: 'healthcare hospital clinic',
    retail: 'retail store inventory shelves'
  };

  const query = IMAGE_QUERIES[industry?.id] || IMAGE_QUERIES[industry?.name?.toLowerCase()] || 'industry workplace';

  // Build a small list of Unsplash candidates (different sig param to vary results).
  const UNSPLASH_BASE = 'https://source.unsplash.com';
  const candidates = useMemo(() => {
    return [
      `${UNSPLASH_BASE}/1200x800/?${encodeURIComponent(query)}&sig=1`,
      `${UNSPLASH_BASE}/1000x700/?${encodeURIComponent(query)}&sig=2`,
      `${UNSPLASH_BASE}/800x600/?${encodeURIComponent(query)}&sig=3`
    ];
  }, [query]);

  const [imgAttempt, setImgAttempt] = useState(0);
  const prefersManufacturingLocal = (industry?.id === 'manufacturing' || industry?.name?.toLowerCase() === 'manufacturing');
  const prefersLogisticLocal = (industry?.id === 'logistics' || industry?.name?.toLowerCase() === 'logistics');
  const prefersRetailLocal = (industry?.id === 'retail' || industry?.name?.toLowerCase() === 'retail');
  const prefersEducationLocal = (industry?.id === 'education' || industry?.name?.toLowerCase() === 'education');
  const prefersPharmaLocal = (industry?.id === 'pharma' || industry?.name?.toLowerCase() === 'pharma');
  const prefersEnergyLocal = (industry?.id === 'energy' || industry?.name?.toLowerCase() === 'energy');
  const prefersRealEstateLocal = (industry?.id === 'realestate' || industry?.id === 'real-estate' || industry?.name?.toLowerCase() === 'real estate' || industry?.name?.toLowerCase() === 'realestate');
  const prefersHospitalityLocal = (industry?.id === 'hospitality' || industry?.name?.toLowerCase() === 'hospitality');
  const currentImgSrc = prefersManufacturingLocal ? manufacturingHero
    : prefersLogisticLocal ? logisticHero
    : prefersRetailLocal ? retailHero
    : prefersEducationLocal ? educationHero
    : prefersPharmaLocal ? pharmaHero
    : prefersHospitalityLocal ? hospitalityHero
    : prefersRealEstateLocal ? realestateHero
    : prefersEnergyLocal ? energyHero
    : (candidates[imgAttempt] || kinexusHero);

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

    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (!ogTitle) { ogTitle = document.createElement('meta'); ogTitle.setAttribute('property', 'og:title'); document.head.appendChild(ogTitle); }
    ogTitle.content = title;

    let ogDesc = document.querySelector('meta[property="og:description"]');
    if (!ogDesc) { ogDesc = document.createElement('meta'); ogDesc.setAttribute('property', 'og:description'); document.head.appendChild(ogDesc); }
    ogDesc.content = desc;

    const ld = {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: title,
      description: desc,
      mainEntity: {
        "@type": "Service",
        name: `${industry.name} Automation`,
        description: industry.subhead || industry.desc
      }
    };
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.setAttribute('data-generated', `industry-${industry.id}`);
    script.textContent = JSON.stringify(ld);
    document.head.appendChild(script);

    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.href = window.location.href;

    return () => {
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
  const normalizeKey = (v) => (v || '').toString().toLowerCase().replace(/[^a-z0-9]/g, '');
  const targetKey = normalizeKey(industry.id || industry.name);
  const relatedCases = useCases.filter(c => normalizeKey(c.industry) === targetKey);

  // Industry-specific impact metrics (read-only)
  const INDUSTRY_METRICS = {
    manufacturing: [
      { value: '35%', label: 'Process throughput improvement' },
      { value: '40%', label: 'Reduction in manual reviews' },
      { value: '10x', label: 'Typical ROI (12–24 months)' }
    ],
    logistics: [
      { value: '18%', label: 'Fuel / cost savings' },
      { value: '22%', label: 'On-time delivery improvement' },
      { value: '3x', label: 'Typical ROI (12 months)' }
    ],
    banking: [
      { value: '60%', label: 'Process time reduction' },
      { value: '80%', label: 'Faster onboarding' },
      { value: '4x', label: 'Typical ROI (6–12 months)' }
    ],
    healthcare: [
      { value: '30%', label: 'Admin time saved' },
      { value: '20%', label: 'Throughput improvement' },
      { value: '5x', label: 'Typical ROI (12 months)' }
    ],
    retail: [
      { value: '15%', label: 'Working capital reduction' },
      { value: '12%', label: 'Reduced stockouts' },
      { value: '2.5x', label: 'Typical ROI (12–18 months)' }
    ]
  };

  const metrics = INDUSTRY_METRICS[industry.id] || INDUSTRY_METRICS[industry.name?.toLowerCase()] || INDUSTRY_METRICS['manufacturing'];

  

  return (
    <div className="min-h-screen bg-transparent pb-16 animate-fade-in-up" style={{ paddingTop: '40pt' }}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-8 items-center mb-8">
          <div className="p-6">
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
              <button onClick={() => navigate('useCases', { industry: industry.id })} className="inline-flex items-center px-4 py-2 border border-[#5856D6] text-[#5856D6] rounded-lg">See Use Cases</button>
              <button onClick={() => navigate('roi', { id: industry.id })} className="inline-flex items-center px-4 py-2 border border-[#5856D6] text-[#5856D6] rounded-lg">Calculate ROI <DollarSign className="w-4 h-4 ml-2" /></button>
            </div>
          </div>
          <div className="rounded-2xl overflow-visible shadow-sm p-6 flex items-center justify-center relative">
            <img
              src={currentImgSrc}
              alt={`${industry.name} hero`}
              className="w-full h-64 md:h-80 object-cover rounded-lg img-professional animate-subtle-float"
              loading="lazy"
              onError={() => setImgAttempt(a => a + 1)}
            />

            {/* Metrics overlay — bottom-right, overlaying hero image (20% width, 15pt right padding) */}
            <div className="absolute z-40" style={{ right: '15pt', bottom: '6%', width: '20%', minWidth: '200px' }}>
              <div className="glass-card p-4 rounded-2xl shadow-lg hover-lift">
                <div className="grid grid-cols-1 gap-3 text-center">
                  {metrics.slice(0,3).map((m, i) => (
                    <div key={i} className={`p-3 rounded-lg ${i===0? 'bg-[#E8F7FF]': i===1? 'bg-[#FFF4F0]' : 'bg-[#F0FFF7]'}`}>
                      <div className="text-xl md:text-2xl font-extrabold">{m.value}</div>
                      <div className="text-xs text-gray-600">{m.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {industry.customSections && industry.customSections.length > 0 && (
          <div className="mt-10 space-y-6">
            {industry.customSections.map((s, i) => (
              <div key={i} className={`p-6 rounded-2xl ${i % 2 === 0 ? 'bg-white/90 border' : 'bg-[#F7F7FF]'} shadow-sm grid md:grid-cols-3 gap-4 items-center`}>
                <div className="md:col-span-2">
                  <h4 className="font-semibold mb-2 text-[#212121]">{s.title}</h4>
                  <p className="text-gray-700 text-sm leading-relaxed">{s.body}</p>
                </div>
                <div className="flex justify-end md:justify-center">
                  <div className="inline-flex items-center justify-center bg-[#E8E7FF] rounded-lg px-4 py-3 text-[#5856D6] font-bold whitespace-nowrap">
                    {s.title.split(' ')[0]}
                  </div>
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

        <div className="mt-10">
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

      </div>
    </div>
  );
}
