import React from 'react';
import calculators from '../data/roi-calculators.json';
import JsonCalculator from '../components/JsonCalculator';

export default function ROIJsonReference() {
  const cfg = calculators.calculators.find(c => c.id === 'manufacturing_general') || calculators.calculators[0];
  return (
    <div className="pt-24 pb-16 min-h-screen bg-white animate-fade-in-up">
      <div className="max-w-4xl mx-auto px-6">
        <JsonCalculator config={cfg} />
      </div>
    </div>
  );
}
