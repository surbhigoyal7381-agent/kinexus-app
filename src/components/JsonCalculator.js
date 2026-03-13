import React, { useState, useEffect } from 'react';

// Simple expression evaluator using a safe context object
function evalFormula(formula, context) {
  // replace identifiers with context values by referencing context.<id>
  const code = formula.replace(/\b([a-zA-Z_][\w]*)\b/g, (m) => `context.${m}`);
  try {
    // eslint-disable-next-line no-new-func
    const fn = new Function('context', `return (${code});`);
    const res = fn(context);
    let val = res;
    if (typeof val !== 'number') val = Number(val);
    // return null for NaN or Infinity to indicate an undefined/non-finite result
    if (!isFinite(val)) return null;
    return val;
  } catch (e) {
    return null;
  }
}

export default function JsonCalculator({ config }) {
  const inputs = config.inputs || [];
  const computed = config.computed || [];

  const initialValues = inputs.reduce((acc, f) => ({ ...acc, [f.id]: Number(f.default || 0) || 0 }), {});
  const [values, setValues] = useState(initialValues);
  const [results, setResults] = useState({});

  useEffect(() => {
    computeAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values]);

  function onChange(id, v) {
    setValues(prev => ({ ...prev, [id]: Number(v) || 0 }));
  }

  function computeAll() {
    const ctx = { ...values };
    const out = {};
    for (const c of computed) {
      const val = evalFormula(c.formula, ctx);
      ctx[c.id] = val;
      out[c.id] = val;
    }
    setResults(out);
  }

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm">
      <h2 className="text-xl font-semibold mb-4">{config.name}</h2>
      <div className="space-y-3">
        {inputs.map(i => (
          <div key={i.id} className="flex items-center gap-3">
            <label className="w-56 text-sm text-gray-700">{i.label}</label>
            <input type="number" value={values[i.id]} onChange={e => onChange(i.id, e.target.value)} className="flex-1 border p-2 rounded-lg" />
          </div>
        ))}
      </div>

      <div className="mt-6">
        <div className="text-sm text-gray-600 mb-2">Computed Outputs</div>
        <table className="w-full text-sm">
          <tbody>
            {computed.map(c => (
              <tr key={c.id} className="border-t">
                <td className="py-2 text-gray-600">{c.label}</td>
                <td className="py-2 text-right font-medium">
                  {results[c.id] === null || results[c.id] === undefined
                    ? 'N/A'
                    : (typeof results[c.id] === 'number' ? Number(results[c.id]).toLocaleString() : String(results[c.id]))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 text-right">
        <div className="text-sm text-gray-600">Payback (months): <span className="font-bold">{results.payback_months === null || results.payback_months === undefined ? 'N/A' : Math.round(results.payback_months)}</span></div>
      </div>
    </div>
  );
}
