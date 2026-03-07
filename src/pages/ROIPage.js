import React, { useState, useMemo } from 'react';

// ROI configuration for common industries (same shape as used previously)
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
      const revenueGain = v.revenuePerDay * v.daysPerYear * (v.productionGainPercent / 100);
      const annual = labor + revenueGain;
      return { annualSavings: annual, paybackMonths: v.implementationCost > 0 ? (v.implementationCost / (annual / 12)) : null };
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
      const annual = annualKmCost * (v.fuelSavingsPercent / 100);
      return { annualSavings: annual, paybackMonths: v.implementationCost > 0 ? (v.implementationCost / (annual / 12)) : null };
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
      const timeSavedHours = (v.avgProcessMin / 60) * v.applicationsPerDay * (v.reductionPercent / 100) * v.daysPerYear;
      const annual = timeSavedHours * v.staffCostPerHour;
      return { annualSavings: annual, paybackMonths: v.implementationCost > 0 ? (v.implementationCost / (annual / 12)) : null };
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
      const revenue = v.patientsPerDay * v.revenuePerPatient * v.daysPerYear * (v.revenueIncreasePercent / 100);
      const annual = labor + revenue;
      return { annualSavings: annual, paybackMonths: v.implementationCost > 0 ? (v.implementationCost / (annual / 12)) : null };
    }
  },
  retail: {
    fields: [
      { key: 'avgInventoryValue', label: 'Average inventory value', placeholder: '500000', unit: '$' },
      { key: 'inventoryReductionPercent', label: 'Working capital reduction (%)', placeholder: '8', unit: '%' },
      { key: 'implementationCost', label: 'Implementation cost (one-time)', placeholder: '30000', unit: '$' }
    ],
    compute: (v) => {
      const annual = v.avgInventoryValue * (v.inventoryReductionPercent / 100);
      return { annualSavings: annual, paybackMonths: v.implementationCost > 0 ? (v.implementationCost / (annual / 12)) : null };
    }
  }
};

const number = (v) => (isNaN(Number(v)) ? 0 : Number(v));

function ROIForm({ industryId }) {
  const cfg = useMemo(() => ROI_CONFIG[industryId] || ROI_CONFIG['manufacturing'], [industryId]);
  const initial = useMemo(() => cfg.fields.reduce((acc, f) => ({ ...acc, [f.key]: number(f.placeholder) }), {}), [cfg]);
  const [values, setValues] = useState(initial);
  const [result, setResult] = useState(() => {
    try { return cfg.compute(initial); } catch (e) { return { annualSavings: 0, paybackMonths: null }; }
  });

  const onChange = (k, v) => setValues(prev => ({ ...prev, [k]: number(v) }));

  // when industry changes, reset form and result
  React.useEffect(() => {
    setValues(initial);
    try { setResult(cfg.compute(initial)); } catch (e) { setResult({ annualSavings: 0, paybackMonths: null }); }
  }, [cfg, initial]);

  const handleCalculate = () => {
    try {
      const r = cfg.compute(values);
      // ensure numeric fallbacks
      r.annualSavings = isNaN(Number(r.annualSavings)) ? 0 : Number(r.annualSavings);
      r.paybackMonths = isNaN(Number(r.paybackMonths)) ? null : Number(r.paybackMonths);
      setResult(r);
    } catch (e) {
      setResult({ annualSavings: 0, paybackMonths: null });
    }
  };

  const safeAnnual = isNaN(Number(result?.annualSavings)) ? 0 : Number(result?.annualSavings);

  return (
    <div>
      <div className="space-y-3">
        {cfg.fields.map(f => (
          <div key={f.key} className="flex items-center gap-3">
            <label className="w-56 text-sm text-gray-700">{f.label}</label>
            <input
              type="number"
              value={values[f.key]}
              onChange={e => onChange(f.key, e.target.value)}
              placeholder={f.placeholder}
              className="flex-1 border p-2 rounded-lg"
            />
            {f.unit && (
              <div className="w-16 text-right text-sm text-gray-500">{f.unit}</div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-4 p-4 bg-white border rounded-lg flex items-center justify-between">
        <div>
          <div className="text-sm text-gray-600">Estimated annual savings</div>
          <div className="text-2xl font-bold text-[#212121]">${Math.round(safeAnnual).toLocaleString()}</div>
          <div className="text-sm text-gray-600 mt-2">{result.paybackMonths ? `Payback: ${Math.round(result.paybackMonths)} months` : 'Payback: N/A'}</div>
        </div>
        <div>
          <button onClick={handleCalculate} className="px-4 py-2 bg-[#5856D6] text-white rounded-lg">Calculate</button>
        </div>
      </div>
    </div>
  );
}

export default function ROIPage({ navigate, industries = [], initialIndustry }) {
  const defaultId = initialIndustry || industries[0]?.id || 'manufacturing';
  const [industryId, setIndustryId] = useState(defaultId);

  return (
    <div className="pt-24 pb-16 min-h-screen bg-white animate-fade-in-up">
      <div className="max-w-5xl mx-auto px-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">ROI Calculator</h1>
            <p className="text-gray-600 mt-2">Select an industry to load tailored parameters for the ROI estimate.</p>
          </div>
          <div className="flex space-x-3">
            <button onClick={() => navigate('home')} className="px-4 py-2 rounded-lg border">Back</button>
            <button onClick={() => navigate('contact')} className="px-4 py-2 rounded-lg bg-[#2EC5CE] text-white">Request Demo</button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 items-start">
          <div className="md:col-span-1 bg-white p-6 rounded-2xl shadow-sm">
            <label className="text-sm text-gray-600">Industry</label>
            <select value={industryId} onChange={e => setIndustryId(e.target.value)} className="w-full border p-2 rounded-lg mt-2">
              {industries.map(ind => <option key={ind.id} value={ind.id}>{ind.name}</option>)}
            </select>
            <div className="mt-4 text-sm text-gray-500">Choose an industry to pre-load typical assumptions. Adjust inputs to reflect your business.</div>
          </div>

          <div className="md:col-span-2 bg-white p-6 rounded-2xl shadow-sm">
            <ROIForm industryId={industryId} />
          </div>
        </div>
      </div>
    </div>
  );
}
