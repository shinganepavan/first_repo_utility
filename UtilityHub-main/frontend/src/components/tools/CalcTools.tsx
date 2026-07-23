import React, { useState } from 'react';
import { Button } from '../common/Button';
import { Card } from '../common/Card';
import { Input } from '../common/Input';

interface ToolProps {
  toolId: string;
}

export const CalcTools: React.FC<ToolProps> = ({ toolId }) => {
  // Scientific Calculator states
  const [calcExpr, setCalcExpr] = useState('');
  const [calcResult, setCalcResult] = useState('');

  // BMI states
  const [weight, setWeight] = useState(70);
  const [height, setHeight] = useState(175);
  const [bmiResult, setBmiResult] = useState<{ score: number; label: string; color: string } | null>(null);

  // Age states
  const [birthdate, setBirthdate] = useState('');
  const [ageResult, setAgeResult] = useState<{ years: number; months: number; days: number } | null>(null);

  // Percent states
  const [percentVal, setPercentVal] = useState(10);
  const [percentOf, setPercentOf] = useState(100);
  const [percentResult, setPercentResult] = useState<number | null>(null);

  // EMI states
  const [loanAmount, setLoanAmount] = useState(10000);
  const [interestRate, setInterestRate] = useState(8.5);
  const [tenureYears, setTenureYears] = useState(5);
  const [emiResult, setEmiResult] = useState<{ emi: number; totalInterest: number; totalPayment: number } | null>(null);

  // GST states
  const [gstAmount, setGstAmount] = useState(1000);
  const [gstRate, setGstRate] = useState(18);
  const [gstResult, setGstResult] = useState<{ cgst: number; sgst: number; igst: number; total: number } | null>(null);

  // Unit Converter states
  const [unitType, setUnitType] = useState<'length' | 'weight' | 'temp'>('length');
  const [fromUnit, setFromUnit] = useState('m');
  const [toUnit, setToUnit] = useState('km');
  const [unitInput, setUnitInput] = useState(1);
  const [unitResult, setUnitResult] = useState<number | null>(null);

  // 1. Calculator actions
  const handleCalcClick = (val: string) => {
    if (val === '=') {
      try {
        // Safe math evaluation
        const clean = calcExpr.replace(/sin/g, 'Math.sin').replace(/cos/g, 'Math.cos').replace(/tan/g, 'Math.tan').replace(/log/g, 'Math.log10').replace(/ln/g, 'Math.log');
        const evaluated = new Function(`return ${clean}`)();
        setCalcResult(String(evaluated));
      } catch {
        setCalcResult('Error');
      }
    } else if (val === 'C') {
      setCalcExpr('');
      setCalcResult('');
    } else if (val === '⌫') {
      setCalcExpr((prev) => prev.slice(0, -1));
    } else {
      setCalcExpr((prev) => prev + val);
    }
  };

  // 2. BMI Calculation
  const calculateBmi = () => {
    const heightInMeters = height / 100;
    const score = Number((weight / (heightInMeters * heightInMeters)).toFixed(1));
    let label = 'Normal';
    let color = 'text-green-500 bg-green-500/10 border-green-500/20';
    if (score < 18.5) {
      label = 'Underweight';
      color = 'text-amber-500 bg-amber-500/10 border-amber-500/20';
    } else if (score >= 25 && score < 29.9) {
      label = 'Overweight';
      color = 'text-orange-500 bg-orange-500/10 border-orange-500/20';
    } else if (score >= 30) {
      label = 'Obese';
      color = 'text-red-500 bg-red-500/10 border-red-500/20';
    }
    setBmiResult({ score, label, color });
  };

  // 3. Age Calculation
  const calculateAge = () => {
    if (!birthdate) return;
    const birth = new Date(birthdate);
    const today = new Date();
    
    let years = today.getFullYear() - birth.getFullYear();
    let months = today.getMonth() - birth.getMonth();
    let days = today.getDate() - birth.getDate();

    if (months < 0 || (months === 0 && days < 0)) {
      years--;
      months += 12;
    }
    if (days < 0) {
      const prevMonth = new Date(today.getFullYear(), today.getMonth(), 0);
      days += prevMonth.getDate();
      months--;
    }
    setAgeResult({ years, months, days });
  };

  // 4. Percentage Calculation
  const calculatePercent = () => {
    const res = (percentVal / 100) * percentOf;
    setPercentResult(res);
  };

  // 5. EMI Calculation
  const calculateEmi = () => {
    const P = loanAmount;
    const r = interestRate / 12 / 100;
    const n = tenureYears * 12;
    
    const emi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalPayment = emi * n;
    const totalInterest = totalPayment - P;

    setEmiResult({
      emi: Math.round(emi),
      totalInterest: Math.round(totalInterest),
      totalPayment: Math.round(totalPayment),
    });
  };

  // 6. GST Calculation
  const calculateGst = () => {
    const tax = (gstAmount * gstRate) / 100;
    setGstResult({
      cgst: tax / 2,
      sgst: tax / 2,
      igst: tax,
      total: gstAmount + tax,
    });
  };

  // 7. Unit Converter Calculation
  const handleUnitConvert = () => {
    let result = unitInput;
    if (unitType === 'length') {
      // Base: meter
      let meters = unitInput;
      if (fromUnit === 'km') meters = unitInput * 1000;
      if (fromUnit === 'cm') meters = unitInput / 100;
      if (fromUnit === 'inch') meters = unitInput * 0.0254;
      
      if (toUnit === 'm') result = meters;
      if (toUnit === 'km') result = meters / 1000;
      if (toUnit === 'cm') result = meters * 100;
      if (toUnit === 'inch') result = meters / 0.0254;
    } else if (unitType === 'weight') {
      // Base: kg
      let kg = unitInput;
      if (fromUnit === 'g') kg = unitInput / 1000;
      if (fromUnit === 'lb') kg = unitInput * 0.453592;

      if (toUnit === 'kg') result = kg;
      if (toUnit === 'g') result = kg * 1000;
      if (toUnit === 'lb') result = kg / 0.453592;
    } else if (unitType === 'temp') {
      if (fromUnit === 'C') {
        if (toUnit === 'F') result = (unitInput * 9) / 5 + 32;
        if (toUnit === 'K') result = unitInput + 273.15;
      } else if (fromUnit === 'F') {
        if (toUnit === 'C') result = ((unitInput - 32) * 5) / 9;
        if (toUnit === 'K') result = ((unitInput - 32) * 5) / 9 + 273.15;
      }
    }
    setUnitResult(Number(result.toFixed(4)));
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      
      {/* 1. Scientific Calculator */}
      {toolId === 'sci-calculator' && (
        <Card hoverEffect={false} className="border border-slate-200/50 dark:border-slate-800/50 p-6 bg-slate-100/40 dark:bg-slate-900/50 space-y-4">
          <div className="bg-slate-950 p-4 rounded-xl text-right font-mono min-h-20 flex flex-col justify-between">
            <p className="text-slate-500 text-xs truncate">{calcExpr || '0'}</p>
            <p className="text-white text-xl font-bold truncate">{calcResult || '0'}</p>
          </div>
          
          <div className="grid grid-cols-5 gap-2 text-xs font-bold">
            {['sin', 'cos', 'tan', 'log', 'ln'].map(key => (
              <button key={key} onClick={() => handleCalcClick(key + '(')} className="py-2.5 bg-slate-200/80 dark:bg-slate-800 rounded-lg hover:bg-slate-300 text-indigo-500">{key}</button>
            ))}
            {['C', '(', ')', '⌫', '/'].map(key => (
              <button key={key} onClick={() => handleCalcClick(key)} className="py-2.5 bg-slate-200/85 dark:bg-slate-850 rounded-lg hover:bg-slate-300 text-orange-500">{key}</button>
            ))}
            {['7', '8', '9', '*', '+'].map(key => (
              <button key={key} onClick={() => handleCalcClick(key)} className="py-2.5 bg-white dark:bg-slate-900 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200">{key}</button>
            ))}
            {['4', '5', '6', '-', '.'].map(key => (
              <button key={key} onClick={() => handleCalcClick(key)} className="py-2.5 bg-white dark:bg-slate-900 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200">{key}</button>
            ))}
            {['1', '2', '3', '0', '='].map(key => (
              <button
                key={key}
                onClick={() => handleCalcClick(key)}
                className={`py-2.5 rounded-lg text-xs font-bold ${key === '=' ? 'col-span-1 bg-gradient-to-r from-sky-500 to-indigo-500 text-white' : 'bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200'}`}
              >
                {key}
              </button>
            ))}
          </div>
        </Card>
      )}

      {/* 2. BMI Calculator */}
      {toolId === 'bmi-calc' && (
        <Card hoverEffect={false} className="border border-slate-200/50 dark:border-slate-800/50 p-6 bg-white/60 dark:bg-slate-900/60 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <Input label="Weight (kg)" type="number" value={weight} onChange={(e) => setWeight(Number(e.target.value))} />
            <Input label="Height (cm)" type="number" value={height} onChange={(e) => setHeight(Number(e.target.value))} />
          </div>
          <Button onClick={calculateBmi} className="w-full text-xs">Calculate BMI</Button>
          
          {bmiResult && (
            <div className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-1 ${bmiResult.color}`}>
              <p className="text-xs font-bold uppercase tracking-wider">BMI Score</p>
              <p className="text-3xl font-black">{bmiResult.score}</p>
              <p className="text-xs font-bold">{bmiResult.label}</p>
            </div>
          )}
        </Card>
      )}

      {/* 3. Age Calculator */}
      {toolId === 'age-calc' && (
        <Card hoverEffect={false} className="border border-slate-200/50 dark:border-slate-800/50 p-6 bg-white/60 dark:bg-slate-900/60 space-y-6">
          <Input label="Date of Birth" type="date" value={birthdate} onChange={(e) => setBirthdate(e.target.value)} />
          <Button onClick={calculateAge} className="w-full text-xs" disabled={!birthdate}>Calculate Age</Button>
          
          {ageResult && (
            <div className="grid grid-cols-3 gap-4 text-center">
              <Card hoverEffect={false} className="p-4 border border-slate-250/20 bg-slate-50 dark:bg-slate-950">
                <p className="text-xl font-bold text-indigo-500">{ageResult.years}</p>
                <p className="text-[10px] text-slate-400 uppercase font-semibold">Years</p>
              </Card>
              <Card hoverEffect={false} className="p-4 border border-slate-250/20 bg-slate-50 dark:bg-slate-950">
                <p className="text-xl font-bold text-indigo-500">{ageResult.months}</p>
                <p className="text-[10px] text-slate-400 uppercase font-semibold">Months</p>
              </Card>
              <Card hoverEffect={false} className="p-4 border border-slate-250/20 bg-slate-50 dark:bg-slate-950">
                <p className="text-xl font-bold text-indigo-500">{ageResult.days}</p>
                <p className="text-[10px] text-slate-400 uppercase font-semibold">Days</p>
              </Card>
            </div>
          )}
        </Card>
      )}

      {/* 4. Percentage Calculator */}
      {toolId === 'percent-calc' && (
        <Card hoverEffect={false} className="border border-slate-200/50 dark:border-slate-800/50 p-6 bg-white/60 dark:bg-slate-900/60 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <Input label="Percentage (%)" type="number" value={percentVal} onChange={(e) => setPercentVal(Number(e.target.value))} />
            <Input label="Of Number" type="number" value={percentOf} onChange={(e) => setPercentOf(Number(e.target.value))} />
          </div>
          <Button onClick={calculatePercent} className="w-full text-xs">Calculate Percentage</Button>
          {percentResult !== null && (
            <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-center font-bold">
              Result: <span className="text-indigo-500">{percentResult}</span>
            </div>
          )}
        </Card>
      )}

      {/* 5. EMI Calculator */}
      {toolId === 'emi-calc' && (
        <Card hoverEffect={false} className="border border-slate-200/50 dark:border-slate-800/50 p-6 bg-white/60 dark:bg-slate-900/60 space-y-6">
          <div className="space-y-4">
            <Input label="Loan Amount ($)" type="number" value={loanAmount} onChange={(e) => setLoanAmount(Number(e.target.value))} />
            <div className="grid grid-cols-2 gap-4">
              <Input label="Interest Rate (%)" type="number" step={0.1} value={interestRate} onChange={(e) => setInterestRate(Number(e.target.value))} />
              <Input label="Tenure (Years)" type="number" value={tenureYears} onChange={(e) => setTenureYears(Number(e.target.value))} />
            </div>
          </div>
          <Button onClick={calculateEmi} className="w-full text-xs">Calculate EMI</Button>
          
          {emiResult && (
            <div className="grid grid-cols-3 gap-4 text-center">
              <Card hoverEffect={false} className="p-4 border border-slate-250/20 bg-slate-50 dark:bg-slate-950">
                <p className="text-base font-bold text-indigo-500">${emiResult.emi}</p>
                <p className="text-[9px] text-slate-400 uppercase font-semibold">Monthly EMI</p>
              </Card>
              <Card hoverEffect={false} className="p-4 border border-slate-250/20 bg-slate-50 dark:bg-slate-950">
                <p className="text-base font-bold text-indigo-500">${emiResult.totalInterest}</p>
                <p className="text-[9px] text-slate-400 uppercase font-semibold">Total Interest</p>
              </Card>
              <Card hoverEffect={false} className="p-4 border border-slate-250/20 bg-slate-50 dark:bg-slate-950">
                <p className="text-base font-bold text-indigo-500">${emiResult.totalPayment}</p>
                <p className="text-[9px] text-slate-400 uppercase font-semibold">Total Payable</p>
              </Card>
            </div>
          )}
        </Card>
      )}

      {/* 6. GST/Tax Calculator */}
      {toolId === 'gst-calc' && (
        <Card hoverEffect={false} className="border border-slate-200/50 dark:border-slate-800/50 p-6 bg-white/60 dark:bg-slate-900/60 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <Input label="Amount ($)" type="number" value={gstAmount} onChange={(e) => setGstAmount(Number(e.target.value))} />
            <Input label="Tax Rate (%)" type="number" value={gstRate} onChange={(e) => setGstRate(Number(e.target.value))} />
          </div>
          <Button onClick={calculateGst} className="w-full text-xs">Calculate Tax</Button>
          {gstResult && (
            <div className="grid grid-cols-2 gap-4 text-center">
              <Card hoverEffect={false} className="p-3 border border-slate-250/20 bg-slate-50 dark:bg-slate-950 col-span-2">
                <p className="text-xl font-bold text-indigo-500">${gstResult.total}</p>
                <p className="text-[10px] text-slate-400 uppercase font-semibold">Total Amount (Gross)</p>
              </Card>
              <Card hoverEffect={false} className="p-3 border border-slate-250/20 bg-slate-50 dark:bg-slate-950">
                <p className="text-base font-bold text-slate-700 dark:text-slate-300">${gstResult.cgst}</p>
                <p className="text-[9px] text-slate-400 uppercase font-semibold">State Tax / CGST</p>
              </Card>
              <Card hoverEffect={false} className="p-3 border border-slate-250/20 bg-slate-50 dark:bg-slate-950">
                <p className="text-base font-bold text-slate-700 dark:text-slate-300">${gstResult.sgst}</p>
                <p className="text-[9px] text-slate-400 uppercase font-semibold">Central Tax / SGST</p>
              </Card>
            </div>
          )}
        </Card>
      )}

      {/* 7. Loan / Unit Converter */}
      {(toolId === 'unit-converter' || toolId === 'loan-calc') && (
        <Card hoverEffect={false} className="border border-slate-200/50 dark:border-slate-800/50 p-6 bg-white/60 dark:bg-slate-900/60 space-y-6">
          <div className="flex gap-2">
            {['length', 'weight', 'temp'].map((type) => (
              <button
                key={type}
                onClick={() => {
                  setUnitType(type as any);
                  setFromUnit(type === 'length' ? 'm' : type === 'weight' ? 'kg' : 'C');
                  setToUnit(type === 'length' ? 'km' : type === 'weight' ? 'g' : 'F');
                  setUnitResult(null);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize ${unitType === type ? 'bg-indigo-500 text-white' : 'bg-slate-100 dark:bg-slate-950 text-slate-650'}`}
              >
                {type}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input label="Value" type="number" value={unitInput} onChange={(e) => setUnitInput(Number(e.target.value))} />
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] uppercase font-bold text-slate-400 ml-1">From</label>
                <select
                  value={fromUnit}
                  onChange={(e) => setFromUnit(e.target.value)}
                  className="w-full px-3 py-2.5 mt-1.5 text-xs rounded-xl bg-slate-100 dark:bg-slate-950 text-slate-800 dark:text-slate-250 border border-transparent focus:outline-none"
                >
                  {unitType === 'length' && (
                    <>
                      <option value="m">Meter</option>
                      <option value="km">Kilometer</option>
                      <option value="cm">Centimeter</option>
                      <option value="inch">Inch</option>
                    </>
                  )}
                  {unitType === 'weight' && (
                    <>
                      <option value="kg">Kilogram</option>
                      <option value="g">Gram</option>
                      <option value="lb">Pound</option>
                    </>
                  )}
                  {unitType === 'temp' && (
                    <>
                      <option value="C">Celsius</option>
                      <option value="F">Fahrenheit</option>
                    </>
                  )}
                </select>
              </div>
              <div>
                <label className="text-[10px] uppercase font-bold text-slate-400 ml-1">To</label>
                <select
                  value={toUnit}
                  onChange={(e) => setToUnit(e.target.value)}
                  className="w-full px-3 py-2.5 mt-1.5 text-xs rounded-xl bg-slate-100 dark:bg-slate-950 text-slate-800 dark:text-slate-250 border border-transparent focus:outline-none"
                >
                  {unitType === 'length' && (
                    <>
                      <option value="m">Meter</option>
                      <option value="km">Kilometer</option>
                      <option value="cm">Centimeter</option>
                      <option value="inch">Inch</option>
                    </>
                  )}
                  {unitType === 'weight' && (
                    <>
                      <option value="kg">Kilogram</option>
                      <option value="g">Gram</option>
                      <option value="lb">Pound</option>
                    </>
                  )}
                  {unitType === 'temp' && (
                    <>
                      <option value="C">Celsius</option>
                      <option value="F">Fahrenheit</option>
                      <option value="K">Kelvin</option>
                    </>
                  )}
                </select>
              </div>
            </div>
          </div>
          <Button onClick={handleUnitConvert} className="w-full text-xs">Convert Value</Button>
          
          {unitResult !== null && (
            <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-center font-bold text-xs text-indigo-500">
              Result: {unitResult} {toUnit}
            </div>
          )}
        </Card>
      )}

    </div>
  );
};
export default CalcTools;
