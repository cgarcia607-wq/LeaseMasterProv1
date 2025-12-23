import React, { useState, useMemo } from 'react';
import { 
  Calculator, MessageSquare, ShieldAlert, 
  CheckCircle2, AlertCircle, Copy, Sparkles, 
  TrendingDown, Zap, Info, DollarSign, MousePointer2
} from 'lucide-react';

const fmt = (n) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);

export default function LeaseMasterPro() {
  const [view, setView] = useState('dashboard');
  const [copied, setCopied] = useState(false);
  const [tone, setTone] = useState('professional');
  const [useApr, setUseApr] = useState(true);
  
  // Input State
  const [inputs, setInputs] = useState({
    msrp: 50000, 
    sellPrice: 47000, 
    term: 36, 
    resPercent: 58, 
    apr: 4.5, 
    mf: 0.001875, 
    downPmt: 3000, 
    acqFee: 695, 
    docFee: 899, 
    regFee: 350,
    taxRate: 8.0, 
    taxMethod: 'monthly', 
    state: 'CA', 
    escCost: 0, 
    dealerName: 'Local Dealer', 
    vehicleName: '2024 Vehicle'
  });

  const stateTaxLookup = {
    "TX": "capcost", "VA": "capcost", "MD": "capcost", "SD": "capcost", "MT": "capcost",
    "NY": "upfront", "NJ": "upfront", "MN": "upfront", "OH": "upfront", "GA": "upfront", "NH": "upfront",
    "IL": "depreciation",
    "AL": "monthly", "AK": "monthly", "AZ": "monthly", "AR": "monthly", "CA": "monthly", "CO": "monthly", 
    "CT": "monthly", "DE": "monthly", "FL": "monthly", "HI": "monthly", "ID": "monthly", "IN": "monthly", 
    "IA": "monthly", "KS": "monthly", "KY": "monthly", "LA": "monthly", "ME": "monthly", "MA": "monthly", 
    "MI": "monthly", "MS": "monthly", "MO": "monthly", "NE": "monthly", "NV": "monthly", "NC": "monthly", 
    "ND": "monthly", "OK": "monthly", "OR": "monthly", "PA": "monthly", "RI": "monthly", "SC": "monthly", 
    "TN": "monthly", "UT": "monthly", "VT": "monthly", "WA": "monthly", "WV": "monthly", "WI": "monthly", 
    "WY": "monthly", "DC": "monthly", "NM": "monthly"
  };

  const states = [
    { code: 'AL', name: 'Alabama' }, { code: 'AK', name: 'Alaska' }, { code: 'AZ', name: 'Arizona' },
    { code: 'AR', name: 'Arkansas' }, { code: 'CA', name: 'California' }, { code: 'CO', name: 'Colorado' },
    { code: 'CT', name: 'Connecticut' }, { code: 'DE', name: 'Delaware' }, { code: 'FL', name: 'Florida' },
    { code: 'GA', name: 'Georgia' }, { code: 'HI', name: 'Hawaii' }, { code: 'ID', name: 'Idaho' },
    { code: 'IL', name: 'Illinois' }, { code: 'IN', name: 'Indiana' }, { code: 'IA', name: 'Iowa' },
    { code: 'KS', name: 'Kansas' }, { code: 'KY', name: 'Kentucky' }, { code: 'LA', name: 'Louisiana' },
    { code: 'ME', name: 'Maine' }, { code: 'MD', name: 'Maryland' }, { code: 'MA', name: 'Massachusetts' },
    { code: 'MI', name: 'Michigan' }, { code: 'MN', name: 'Minnesota' }, { code: 'MS', name: 'Mississippi' },
    { code: 'MO', name: 'Missouri' }, { code: 'MT', name: 'Montana' }, { code: 'NE', name: 'Nebraska' },
    { code: 'NV', name: 'Nevada' }, { code: 'NH', name: 'New Hampshire' }, { code: 'NJ', name: 'New Jersey' },
    { code: 'NM', name: 'New Mexico' }, { code: 'NY', name: 'New York' }, { code: 'NC', name: 'North Carolina' },
    { code: 'ND', name: 'North Dakota' }, { code: 'OH', name: 'Ohio' }, { code: 'OK', name: 'Oklahoma' },
    { code: 'OR', name: 'Oregon' }, { code: 'PA', name: 'Pennsylvania' }, { code: 'RI', name: 'Rhode Island' },
    { code: 'SC', name: 'South Carolina' }, { code: 'SD', name: 'South Dakota' }, { code: 'TN', name: 'Tennessee' },
    { code: 'TX', name: 'Texas' }, { code: 'UT', name: 'Utah' }, { code: 'VT', name: 'Vermont' },
    { code: 'VA', name: 'Virginia' }, { code: 'WA', name: 'Washington' }, { code: 'WV', name: 'West Virginia' },
    { code: 'WI', name: 'Wisconsin' }, { code: 'WY', name: 'Wyoming' }, { code: 'DC', name: 'Washington DC' }
  ];

  const handleStateChange = (stateCode) => {
    const method = stateTaxLookup[stateCode] || "monthly";
    setInputs({ ...inputs, state: stateCode, taxMethod: method });
  };

  const [capSettings, setCapSettings] = useState({ acq: true, doc: false, reg: false, esc: false });

  // --- Advanced Calculation Engine ---
  const res = useMemo(() => {
    const capFees = (capSettings.acq ? inputs.acqFee : 0) + (capSettings.doc ? inputs.docFee : 0) + (capSettings.reg ? inputs.regFee : 0) + (capSettings.esc ? inputs.escCost : 0);
    const upfrontFees = (!capSettings.acq ? inputs.acqFee : 0) + (!capSettings.doc ? inputs.docFee : 0) + (!capSettings.reg ? inputs.regFee : 0) + (!capSettings.esc ? inputs.escCost : 0);
    
    const resVal = (inputs.resPercent / 100) * inputs.msrp;
    const adjCap = (inputs.sellPrice + capFees) - inputs.downPmt;
    const mf = inputs.apr / 2400;
    
    const mDep = (adjCap - resVal) / inputs.term;
    const mFin = (adjCap + resVal) * mf;
    const base = mDep + mFin;

    // Advanced Tax Logic
    let taxPerMonth = 0;
    let upfrontTax = 0;
    const rate = inputs.taxRate / 100;

    if (inputs.taxMethod === 'monthly') {
      taxPerMonth = base * rate;
    } else if (inputs.taxMethod === 'upfront') {
      upfrontTax = (base * inputs.term) * rate;
    } else if (inputs.taxMethod === 'depreciation') {
      upfrontTax = (adjCap - resVal) * rate;
    } else if (inputs.taxMethod === 'capcost') {
      upfrontTax = inputs.sellPrice * rate;
    }

    const total = base + taxPerMonth;
    const das = total + inputs.downPmt + upfrontFees + upfrontTax;
    
    const discount = inputs.msrp - inputs.sellPrice;
    const discountPct = (discount / inputs.msrp) * 100;
    const feeInterestCost = capFees > 0 ? (capFees * mf * inputs.term) : 0;

    return { 
      total, das, mDep, mFin, tax: taxPerMonth, upfrontTax, 
      resVal, adjCap, capFees, upfrontFees, discount, 
      discountPct, feeInterestCost, isHighFee: inputs.docFee > 400, 
      isHighRate: inputs.apr > 4.0 
    };
  }, [inputs, capSettings]);

  // Negotiation Script
  const script = useMemo(() => {
    const target = res.total - 50;
    const targetDas = res.das - 500;
    return tone === 'professional' 
      ? `Hi, I'm reviewing the quote for the ${inputs.vehicleName}. Based on current market benchmarks, I'm looking for a payment of ${fmt(target)}/mo with ${fmt(targetDas)} total due at signing. I noticed the doc fee is ${fmt(inputs.docFee)}—if we can adjust the selling price to offset this and hit my target, I'm ready to sign.`
      : `I've run the numbers on the ${inputs.vehicleName}. To get a deal done today, I need to be at ${fmt(target)}/mo inclusive of tax, with ${fmt(targetDas)} total out of pocket. Let me know if you can meet these terms and I'll head over.`;
  }, [tone, res, inputs]);

  const toggleCap = (key) => setCapSettings(prev => ({ ...prev, [key]: !prev[key] }));

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 p-6 hidden md:flex md:flex-col">
        <div className="font-black text-xl text-blue-600 mb-8 flex items-center gap-2 italic">
          <Zap fill="currentColor" size={24} /> LEASEPRO
        </div>
        <nav className="space-y-2 flex-1">
          <NavBtn active={view === 'dashboard'} onClick={() => setView('dashboard')} icon={<Calculator size={18}/>} label="Calculator" />
          <NavBtn active={view === 'audit'} onClick={() => setView('audit')} icon={<ShieldAlert size={18}/>} label="Deal Audit" />
          <NavBtn active={view === 'script'} onClick={() => setView('script')} icon={<MessageSquare size={18}/>} label="Negotiator" />
        </nav>
      </aside>

      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        {view === 'dashboard' && (
          <div className="max-w-6xl mx-auto space-y-8">
            <header className="flex justify-between items-end">
              <div>
                <h1 className="text-3xl font-black tracking-tight">Lease Strategist</h1>
                <p className="text-sm text-slate-500">Configure deal parameters with state-specific tax logic.</p>
              </div>
            </header>

            <div className="grid lg:grid-cols-12 gap-8">
              <div className="lg:col-span-7 space-y-6">
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="State" value={inputs.state} onChange={handleStateChange} isSelect options={states} />
                    <Field label="Vehicle" value={inputs.vehicleName} onChange={v => setInputs({...inputs, vehicleName: v})} isText />
                    <Field label="MSRP" value={inputs.msrp} onChange={v => setInputs({...inputs, msrp: v})} />
                    <Field label="Selling Price" value={inputs.sellPrice} onChange={v => setInputs({...inputs, sellPrice: v})} />
                    <Field label="Residual %" value={inputs.resPercent} onChange={v => setInputs({...inputs, resPercent: v})} />
                    <Field label="Term (Months)" value={inputs.term} onChange={v => setInputs({...inputs, term: v})} />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                       <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Rate (APR %)</label>
                       <input type="number" step="0.01" value={inputs.apr} onChange={e => setInputs({...inputs, apr: Number(e.target.value)})} className="w-full bg-slate-50 border rounded-2xl px-4 py-2.5 font-bold text-sm" />
                    </div>
                    <Field label="Tax Rate %" value={inputs.taxRate} onChange={v => setInputs({...inputs, taxRate: v})} step="0.1" />
                  </div>

                  <div className="space-y-3">
                    <SectionTitle title="Fee Customization" />
                    <FeeRow label="Acquisition" value={inputs.acqFee} isCap={capSettings.acq} onToggle={() => toggleCap('acq')} onChange={v => setInputs({...inputs, acqFee: v})} />
                    <FeeRow label="Dealer Doc" value={inputs.docFee} isCap={capSettings.doc} onToggle={() => toggleCap('doc')} onChange={v => setInputs({...inputs, docFee: v})} />
                    <Field label="Cash Down Payment" value={inputs.downPmt} onChange={v => setInputs({...inputs, downPmt: v})} />
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5">
                <div className="bg-slate-900 text-white p-8 rounded-[2.5rem] shadow-2xl sticky top-8">
                  <p className="text-blue-400 text-[10px] font-black uppercase tracking-widest mb-1">Monthly Payment</p>
                  <div className="text-6xl font-black mb-1">{fmt(res.total)}</div>
                  <p className="text-slate-400 text-xs mb-8">Due at signing: {fmt(res.das)}</p>
                  
                  <div className="space-y-3 border-t border-slate-800 pt-6">
                    <ResultRow label="Depreciation" value={fmt(res.mDep)} />
                    <ResultRow label="Rent Charge" value={fmt(res.mFin)} />
                    <ResultRow label="Monthly Tax" value={fmt(res.tax)} />
                    {res.upfrontTax > 0 && <ResultRow label="Upfront State Tax" value={fmt(res.upfrontTax)} />}
                    <div className="mt-4 p-4 bg-blue-600/20 rounded-2xl">
                       <p className="text-[10px] font-bold text-blue-300 uppercase">Strategy Note</p>
                       <p className="text-xs text-blue-100">Tax Method: {inputs.taxMethod.toUpperCase()}. {res.discountPct > 8 ? 'Strong discount!' : 'Aim for 8%+ discount.'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {view === 'audit' && (
           <div className="max-w-3xl mx-auto space-y-4">
              <AuditItem label="Doc Fee" value={fmt(inputs.docFee)} isBad={res.isHighFee} msg={res.isHighFee ? "This is significantly above average." : "Standard fee."} />
              <AuditItem label="Money Factor" value={(inputs.apr/2400).toFixed(5)} isBad={res.isHighRate} msg={res.isHighRate ? "Rate seems marked up." : "Competitive rate."} />
           </div>
        )}

        {view === 'script' && (
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="bg-white p-8 rounded-[2rem] border shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-black text-xl">Negotiation Script</h2>
                <div className="flex bg-slate-100 p-1 rounded-lg">
                  <button onClick={() => setTone('professional')} className={`px-3 py-1 text-xs font-bold rounded ${tone==='professional'?'bg-white shadow-sm':''}`}>Professional</button>
                  <button onClick={() => setTone('firm')} className={`px-3 py-1 text-xs font-bold rounded ${tone==='firm'?'bg-white shadow-sm':''}`}>Firm</button>
                </div>
              </div>
              <div className="bg-slate-50 p-6 rounded-2xl border italic text-slate-700 whitespace-pre-wrap">
                {script}
              </div>
              <button onClick={() => {navigator.clipboard.writeText(script); setCopied(true);}} className="w-full mt-4 bg-blue-600 text-white py-3 rounded-xl font-bold">
                {copied ? 'Copied!' : 'Copy to Clipboard'}
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

// Sub-components
const NavBtn = ({ active, onClick, icon, label }) => (
  <button onClick={onClick} className={`w-full flex items-center gap-3 p-3.5 rounded-2xl font-bold text-sm transition-all ${active ? 'bg-blue-50 text-blue-600' : 'text-slate-400 hover:bg-slate-50'}`}>
    {icon} {label}
  </button>
);

const Field = ({ label, value, onChange, isText, isSelect, options, step=1 }) => (
  <div className="space-y-1">
    <label className="text-[10px] font-bold text-slate-500 uppercase">{label}</label>
    {isSelect ? (
      <select value={value} onChange={e => onChange(e.target.value)} className="w-full bg-slate-50 border rounded-2xl px-4 py-2.5 font-bold text-sm outline-none">
        {options.map(s => <option key={s.code} value={s.code}>{s.name}</option>)}
      </select>
    ) : (
      <input type={isText ? 'text' : 'number'} step={step} value={value} onChange={e => onChange(isText ? e.target.value : Number(e.target.value))} className="w-full bg-slate-50 border rounded-2xl px-4 py-2.5 font-bold text-sm outline-none focus:border-blue-500" />
    )}
  </div>
);

const FeeRow = ({ label, value, isCap, onToggle, onChange }) => (
  <div className="flex items-center gap-3 p-3 bg-slate-50 border rounded-2xl">
    <div className="flex-1">
      <div className="text-[9px] font-black text-slate-400 uppercase">{label}</div>
      <input type="number" value={value} onChange={e => onChange(Number(e.target.value))} className="bg-transparent font-bold text-sm outline-none w-full" />
    </div>
    <button onClick={onToggle} className={`px-3 py-1 rounded-lg text-[10px] font-black ${isCap ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-500'}`}>
      {isCap ? 'ROLL IN' : 'UPFRONT'}
    </button>
  </div>
);

const ResultRow = ({ label, value }) => (
  <div className="flex justify-between text-sm py-1 border-b border-slate-800/50">
    <span className="text-slate-400">{label}</span>
    <span className="font-bold">{value}</span>
  </div>
);

const SectionTitle = ({ title }) => <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{title}</h3>;

const AuditItem = ({ label, value, isBad, msg }) => (
  <div className={`p-6 rounded-3xl border flex items-center justify-between ${isBad ? 'bg-red-50 border-red-100' : 'bg-green-50 border-green-100'}`}>
    <div className="flex items-center gap-4">
      {isBad ? <AlertCircle className="text-red-500" /> : <CheckCircle2 className="text-green-500" />}
      <div>
        <p className="text-[10px] font-bold uppercase text-slate-400">{label}</p>
        <p className="text-sm font-bold">{msg}</p>
      </div>
    </div>
    <div className="text-xl font-black">{value}</div>
  </div>
);
