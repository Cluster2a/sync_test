import React, { useState } from "react";
import * as CSV from "csv";

interface YearDataRaw {
  Date: string;
  "Total Customers": number;
  "Total Sales": number;
  "Total Orders": number;
  "New to Brand Customers": number;
  "New to Brand Customer Sales": number;
  "New to Brand Customer Orders": number;
  "Repeat Customers": number;
  "Repeat Sales": number;
  "Repeat Orders": number;
  "Repeat Purchase Rate": number;
  "Average Repeat Purchase Interval": number;
  "Potential New Customers": number;
}

interface YearInputs {
  year: string;
  grossMargin: number;
  adSpend: number;
  repeatLifespan: number;
}

interface YearComputed {
  year: string;
  contributionProfit: number;
  contributionProfitPct: number;
  repeatCustomerRate: number;
  oneTimeCustomers: number;
  oneTimeSales: number;
  oneTimeOrders: number;
  oneTimeAvgPurchaseValue: number;
  oneTimeAvgPurchaseFrequency: number;
  oneTimeAvgCustomerValueRev: number;
  oneTimeAvgCustomerValueProfit: number;
  oneTimePctCustomerBase: number;
  repeatAvgPurchaseValue: number;
  repeatAvgPurchaseFrequency: number;
  repeatAvgCustomerValueRev: number;
  repeatAvgCustomerValueProfit: number;
  repeatCustomerLifespan: number;
  repeatCustomerLifetimeValueRev: number;
  repeatCustomerLifetimeValueProfit: number;
  repeatPctCustomerBase: number;
  clvRev: number;
  clvProfit: number;
}

function formatCurrency(n: number, currency: string): string {
  return new Intl.NumberFormat(undefined, { style: "currency", currency }).format(n);
}

function parseCSV(file: File): Promise<YearDataRaw> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const text = reader.result as string;
        const rows = XLSX.utils.sheet_to_json<YearDataRaw>(XLSX.read(text, { type: "string" }).Sheets.Sheet1);
        if (!rows.length) throw new Error("CSV is empty");
        resolve(rows[0]);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = () => reject(new Error("File read error"));
    reader.readAsText(file);
  });
}

function computeMetrics(raw: YearDataRaw, input: YearInputs): YearComputed {
  const totalCustomers = raw["Total Customers"];
  const totalSales = raw["Total Sales"];
  const totalOrders = raw["Total Orders"];
  const repeatCustomers = raw["Repeat Customers"];
  const repeatSales = raw["Repeat Sales"];
  const repeatOrders = raw["Repeat Orders"];

  const grossProfit = totalSales * input.grossMargin;
  const contributionProfit = grossProfit - input.adSpend;
  const contributionProfitPct = contributionProfit / totalSales;

  const repeatCustomerRate = repeatCustomers / totalCustomers;

  const oneTimeCustomers = totalCustomers - repeatCustomers;
  const oneTimeSales = totalSales - repeatSales;
  const oneTimeOrders = totalOrders - repeatOrders;

  const oneTimeAvgPurchaseValue = oneTimeOrders ? oneTimeSales / oneTimeOrders : 0;
  const oneTimeAvgPurchaseFrequency = oneTimeCustomers ? oneTimeOrders / oneTimeCustomers : 0;
  const oneTimeAvgCustomerValueRev = oneTimeAvgPurchaseValue * oneTimeAvgPurchaseFrequency;
  const oneTimeAvgCustomerValueProfit = oneTimeAvgCustomerValueRev * contributionProfitPct;
  const oneTimePctCustomerBase = 1 - repeatCustomerRate;

  const repeatAvgPurchaseValue = repeatOrders ? repeatSales / repeatOrders : 0;
  const repeatAvgPurchaseFrequency = repeatCustomers ? repeatOrders / repeatCustomers : 0;
  const repeatAvgCustomerValueRev = repeatAvgPurchaseValue * repeatAvgPurchaseFrequency;
  const repeatAvgCustomerValueProfit = repeatAvgCustomerValueRev * contributionProfitPct;
  const repeatCustomerLifetimeValueRev = input.repeatLifespan * repeatAvgCustomerValueRev;
  const repeatCustomerLifetimeValueProfit = input.repeatLifespan * repeatAvgCustomerValueProfit;
  const repeatPctCustomerBase = repeatCustomerRate;

  const clvRev = repeatCustomerLifetimeValueRev * repeatPctCustomerBase + oneTimeAvgCustomerValueRev * oneTimePctCustomerBase;
  const clvProfit = repeatCustomerLifetimeValueProfit * repeatPctCustomerBase + oneTimeAvgCustomerValueProfit * oneTimePctCustomerBase;

  return {
    year: input.year,
    contributionProfit,
    contributionProfitPct,
    repeatCustomerRate,
    oneTimeCustomers,
    oneTimeSales,
    oneTimeOrders,
    oneTimeAvgPurchaseValue,
    oneTimeAvgPurchaseFrequency,
    oneTimeAvgCustomerValueRev,
    oneTimeAvgCustomerValueProfit,
    oneTimePctCustomerBase,
    repeatAvgPurchaseValue,
    repeatAvgPurchaseFrequency,
    repeatAvgCustomerValueRev,
    repeatAvgCustomerValueProfit,
    repeatCustomerLifespan: input.repeatLifespan,
    repeatCustomerLifetimeValueRev,
    repeatCustomerLifetimeValueProfit,
    repeatPctCustomerBase,
    clvRev,
    clvProfit,
  };
}

const LifetimeValueApp: React.FC = () => {
  const [currency, setCurrency] = useState<string>("USD");
  const [years, setYears] = useState<YearInputs[]>([]);
  const [raws, setRaws] = useState<Record<string, YearDataRaw>>({});
  const [computed, setComputed] = useState<YearComputed[]>([]);

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>, year: string) {
    const file = e.target.files?.[0];
    if (!file) return;
    const data = await parseCSV(file);
    setRaws(prev => ({ ...prev, [year]: data }));
  }

  function handleInputChange(year: string, field: keyof Omit<YearInputs, "year">, value: number) {
    setYears(prev => prev.map(y => y.year === year ? { ...y, [field]: value } : y));
  }

  function addYear() {
    const y = prompt("Enter Year (e.g., 2023)");
    if (!y) return;
    setYears(prev => [...prev, { year: y, grossMargin: 0.3, adSpend: 0, repeatLifespan: 2 }]);
  }

  function calculate() {
    const results: YearComputed[] = [];
    for (const y of years) {
      const raw = raws[y.year];
      if (!raw) continue;
      results.push(computeMetrics(raw, y));
    }
    setComputed(results);
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold">Lifetime Value Calculation for Amazon Brands</h1>
        <p className="text-gray-700 text-sm leading-relaxed">
          Customer Lifetime Value (LTV) estimates the total revenue and profit a brand can expect
          from a customer throughout their relationship. This app compares yearly performance and
          calculates blended LTV based on repeat vs one-time customers, gross margin and advertising spend.
        </p>
      </header>

      <div className="flex items-center gap-4">
        <button className="px-4 py-2 bg-blue-600 text-white rounded" onClick={addYear}>Add Year</button>
        <select value={currency} onChange={e => setCurrency(e.target.value)} className="border p-2 rounded">
          {['USD','EUR','GBP','JPY'].map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <button className="px-4 py-2 bg-green-600 text-white rounded" onClick={calculate}>Calculate</button>
      </div>

      {years.map(y => (
        <div key={y.year} className="border rounded p-4 space-y-3">
          <h2 className="text-lg font-semibold">Year {y.year}</h2>
          <input type="file" accept=".csv" onChange={e => handleFileUpload(e, y.year)} />
          <div className="grid grid-cols-3 gap-4 mt-2">
            <label>Gross Margin %
              <input type="number" min={0} max={1} step={0.01} value={y.grossMargin}
                onChange={e => handleInputChange(y.year, 'grossMargin', parseFloat(e.target.value))} className="border p-1 w-full" />
            </label>
            <label>Advertising Spend
              <input type="number" value={y.adSpend}
                onChange={e => handleInputChange(y.year, 'adSpend', parseFloat(e.target.value))} className="border p-1 w-full" />
            </label>
            <label>Repeat Lifespan (years)
              <input type="number" step={0.1} value={y.repeatLifespan}
                onChange={e => handleInputChange(y.year, 'repeatLifespan', parseFloat(e.target.value))} className="border p-1 w-full" />
            </label>
          </div>
        </div>
      ))}

      {computed.length > 0 && (
        <div className="grid md:grid-cols-2 gap-6">
          {computed.map(c => (
            <div key={c.year} className="border rounded p-4">
              <h3 className="text-xl font-bold mb-2">{c.year}</h3>
              <ul className="text-sm space-y-1">
                <li>Contribution Profit: {formatCurrency(c.contributionProfit, currency)}</li>
                <li>Contribution Profit %: {(c.contributionProfitPct*100).toFixed(2)}%</li>
                <li>Repeat Customer Rate: {(c.repeatCustomerRate*100).toFixed(2)}%</li>
                <li>Customer Lifetime Value (Rev): {formatCurrency(c.clvRev, currency)}</li>
                <li>Customer Lifetime Value (Profit): {formatCurrency(c.clvProfit, currency)}</li>
              </ul>
            </div>
          ))}
        </div>
      )}

      <section className="mt-12 text-sm text-gray-700 space-y-2">
        <h2 className="text-lg font-semibold">Metric Definitions & Formulas</h2>
        <ul className="list-disc pl-6 space-y-1">
          <li><strong>Contribution Profit %</strong> = (Gross Profit − Advertising Spend) ÷ Total Sales</li>
          <li><strong>Repeat Customer Rate</strong> = Repeat Customers ÷ Total Customers</li>
          <li><strong>Total Customers (ex Repeat)</strong> = Total Customers − Repeat Customers</li>
          <li><strong>Total Sales (ex Repeat)</strong> = Total Sales − Repeat Sales</li>
          <li><strong>Total Orders (ex Repeat)</strong> = Total Orders − Repeat Orders</li>
          <li><strong>One Time Average Purchase Value</strong> = Total Sales (ex Repeat) ÷ Total Orders (ex Repeat)</li>
          <li><strong>One Time Average Purchase Frequency</strong> = Total Orders (ex Repeat) ÷ Total Customers (ex Repeat)</li>
          <li><strong>One Time Avg Customer Value (Rev)</strong> = Avg Purchase Value × Avg Purchase Frequency</li>
          <li><strong>One Time Avg Customer Value (Profit)</strong> = Avg Customer Value (Rev) × Contribution Profit %</li>
          <li><strong>One Time % of Customer Base</strong> = 1 − Repeat Customer Rate</li>
          <li><strong>Repeat Average Purchase Value</strong> = Repeat Sales ÷ Repeat Orders</li>
          <li><strong>Repeat Average Purchase Frequency</strong> = Repeat Orders ÷ Repeat Customers</li>
          <li><strong>Repeat Avg Customer Value (Rev)</strong> = Avg Purchase Value × Avg Purchase Frequency</li>
          <li><strong>Repeat Avg Customer Value (Profit)</strong> = Contribution Profit % × Repeat Avg Customer Value (Rev)</li>
          <li><strong>Repeat Customer Lifetime Value (Rev)</strong> = Repeat Avg Customer Value (Rev) × Repeat Customer Lifespan (years)</li>
          <li><strong>Repeat Customer Lifetime Value (Profit)</strong> = Repeat Avg Customer Value (Profit) × Repeat Customer Lifespan (years)</li>
          <li><strong>Repeat % of Customer Base</strong> = Repeat Customer Rate</li>
          <li><strong>Customer Lifetime Value (Rev)</strong> = Repeat CLV (Rev) × Repeat % Base + One Time Avg Customer Value (Rev) × One Time % Base</li>
          <li><strong>Customer Lifetime Value (Profit)</strong> = Repeat CLV (Profit) × Repeat % Base + One Time Avg Customer Value (Profit) × One Time % Base</li>
        </ul>
      </section>
    </div>
  );
};

export default LifetimeValueApp;
