'use client'; // यह Client Component है

import { useState } from 'react';

export default function EMICalculator() {
  const [amount, setAmount] = useState(500000);
  const [rate, setRate] = useState(8);
  const [tenure, setTenure] = useState(5);
  const [emi, setEmi] = useState<number | null>(null);
  const [totalPayment, setTotalPayment] = useState<number | null>(null);
  const [totalInterest, setTotalInterest] = useState<number | null>(null);

  const calculateEMI = () => {
    const principal = amount;
    const monthlyRate = rate / 12 / 100;
    const months = tenure * 12;

    if (monthlyRate === 0) {
      const emiValue = principal / months;
      setEmi(emiValue);
      setTotalPayment(principal);
      setTotalInterest(0);
      return;
    }

    const emiValue = principal * monthlyRate * Math.pow(1 + monthlyRate, months) / (Math.pow(1 + monthlyRate, months) - 1);
    const total = emiValue * months;
    const interest = total - principal;

    setEmi(emiValue);
    setTotalPayment(total);
    setTotalInterest(interest);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
            🧮 EMI Calculator (Monthly Installment)
          </h1>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Loan Amount (₹)</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="mt-1 block w-full border border-gray-300 rounded-md p-3"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Annual Interest Rate (%)</label>
              <input
                type="number"
                value={rate}
                onChange={(e) => setRate(Number(e.target.value))}
                className="mt-1 block w-full border border-gray-300 rounded-md p-3"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Tenure (Years)</label>
              <input
                type="number"
                value={tenure}
                onChange={(e) => setTenure(Number(e.target.value))}
                className="mt-1 block w-full border border-gray-300 rounded-md p-3"
              />
            </div>

            <button
              onClick={calculateEMI}
              className="w-full bg-blue-600 text-white py-3 rounded-md font-semibold hover:bg-blue-700 transition"
            >
              Calculate EMI
            </button>

            {emi !== null && (
              <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-lg font-semibold text-gray-800">
                  Monthly EMI: ₹{emi.toFixed(2)}
                </p>
                <p className="text-sm text-gray-600">
                  Total Payment: ₹{totalPayment?.toFixed(2)} | Total Interest: ₹{totalInterest?.toFixed(2)}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}