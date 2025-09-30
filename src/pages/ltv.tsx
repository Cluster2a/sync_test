import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calculator, TrendingUp, Upload, DollarSign, Users, Trash2, ArrowUp, ArrowDown, Minus } from "lucide-react";
import { Link } from "react-router-dom";
import { ToolAccessGate } from "@/components/ToolAccessGate";

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
  // Raw CSV data
  totalCustomers: number;
  totalSales: number;
  totalOrders: number;
  newToBrandCustomers: number;
  newToBrandSales: number;
  newToBrandOrders: number;
  repeatCustomers: number;
  repeatSales: number;
  repeatOrders: number;
  repeatPurchaseRate: number;
  avgRepeatInterval: number;
  potentialNewCustomers: number;
  // Calculated metrics
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

function formatNumber(n: number): string {
  return new Intl.NumberFormat(undefined).format(Math.round(n));
}

function parseCSV(file: File): Promise<YearDataRaw[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const text = reader.result as string;
        const lines = text.trim().split('\n');
        
        if (lines.length < 2) {
          throw new Error("CSV must have at least a header and one data row");
        }
        
        const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
        const dataRows = lines.slice(1);
        
        console.log('Headers found:', headers); // Debug log
        
        const results: YearDataRaw[] = [];
        
        for (const row of dataRows) {
          const values = [];
          let current = '';
          let inQuotes = false;
          
          // Better CSV parsing that handles commas within quoted fields
          for (let i = 0; i < row.length; i++) {
            const char = row[i];
            if (char === '"') {
              inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
              values.push(current.trim());
              current = '';
            } else {
              current += char;
            }
          }
          values.push(current.trim()); // Don't forget the last value
          
          console.log('Values parsed:', values); // Debug log
          
          const data: any = {};
          
          headers.forEach((header, index) => {
            const value = values[index];
            if (header === 'Date') {
              data[header] = value;
            } else {
              // Remove any remaining quotes and parse as number
              const cleanValue = value?.replace(/"/g, '') || '0';
              data[header] = parseFloat(cleanValue) || 0;
            }
          });
          
          console.log('Parsed data object:', data); // Debug log
          
          // Validate required fields
          const required = ['Total Customers', 'Total Sales', 'Total Orders', 'Repeat Customers', 'Repeat Sales', 'Repeat Orders'];
          for (const field of required) {
            if (!(field in data)) {
              throw new Error(`Missing required field: ${field}. Found fields: ${Object.keys(data).join(', ')}`);
            }
          }
          
          results.push(data as YearDataRaw);
        }
        
        resolve(results);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = () => reject(new Error("File read error"));
    reader.readAsText(file);
  });
}

function extractYearFromDate(dateStr: string): string {
  // Extract year from dates like "December 31, 2023"
  const match = dateStr.match(/\d{4}/);
  return match ? match[0] : new Date().getFullYear().toString();
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
  const contributionProfitPct = totalSales ? contributionProfit / totalSales : 0;

  const repeatCustomerRate = totalCustomers ? repeatCustomers / totalCustomers : 0;

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
    // Raw CSV data
    totalCustomers,
    totalSales,
    totalOrders,
    newToBrandCustomers: raw["New to Brand Customers"] || 0,
    newToBrandSales: raw["New to Brand Customer Sales"] || 0,
    newToBrandOrders: raw["New to Brand Customer Orders"] || 0,
    repeatCustomers,
    repeatSales,
    repeatOrders,
    repeatPurchaseRate: raw["Repeat Purchase Rate"] || 0,
    avgRepeatInterval: raw["Average Repeat Purchase Interval"] || 0,
    potentialNewCustomers: raw["Potential New Customers"] || 0,
    // Calculated metrics
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

function calculateYoY(current: number, previous: number): { percentage: number; icon: JSX.Element; color: string } {
  if (previous === 0) return { percentage: 0, icon: <Minus className="h-3 w-3" />, color: "text-muted-foreground" };
  
  const percentage = ((current - previous) / previous) * 100;
  
  if (percentage > 0) {
    return { 
      percentage, 
      icon: <ArrowUp className="h-3 w-3" />, 
      color: "text-green-600" 
    };
  } else if (percentage < 0) {
    return { 
      percentage: Math.abs(percentage), 
      icon: <ArrowDown className="h-3 w-3" />, 
      color: "text-red-600" 
    };
  } else {
    return { 
      percentage: 0, 
      icon: <Minus className="h-3 w-3" />, 
      color: "text-muted-foreground" 
    };
  }
}

const LifetimeValueApp: React.FC = () => {
  const [currency, setCurrency] = useState<string>("USD");
  const [yearInputs, setYearInputs] = useState<YearInputs[]>([]);
  const [rawData, setRawData] = useState<YearDataRaw[]>([]);
  const [computed, setComputed] = useState<YearComputed[]>([]);
  const [uploadStatus, setUploadStatus] = useState<string>("");
  const [errors, setErrors] = useState<string[]>([]);

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadStatus("uploading");
    setErrors([]);

    try {
      const data = await parseCSV(file);
      setRawData(data);
      
      // Create year inputs based on the years found in the CSV
      const yearsFound = data.map(row => extractYearFromDate(row.Date));
      const uniqueYears = [...new Set(yearsFound)].sort();
      
      const newYearInputs = uniqueYears.map(year => ({
        year,
        grossMargin: 0.3,
        adSpend: 0,
        repeatLifespan: 2
      }));
      
      setYearInputs(newYearInputs);
      setUploadStatus("success");
    } catch (err) {
      const errorMsg = `Error uploading data: ${err instanceof Error ? err.message : 'Unknown error'}`;
      setErrors([errorMsg]);
      setUploadStatus("error");
    }
  }

  function handleInputChange(year: string, field: keyof Omit<YearInputs, "year">, value: string) {
    const numValue = parseFloat(value) || 0;
    setYearInputs(prev => prev.map(y => y.year === year ? { ...y, [field]: numValue } : y));
  }

  function calculate() {
    setErrors([]);
    const results: YearComputed[] = [];
    
    for (const yearInput of yearInputs) {
      const rawDataForYear = rawData.find(data => extractYearFromDate(data.Date) === yearInput.year);
      if (!rawDataForYear) continue;
      
      results.push(computeMetrics(rawDataForYear, yearInput));
    }
    
    // Sort by year
    results.sort((a, b) => a.year.localeCompare(b.year));
    setComputed(results);
  }

  function clearData() {
    setRawData([]);
    setYearInputs([]);
    setComputed([]);
    setUploadStatus("");
    setErrors([]);
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-600';
      case 'error': return 'text-red-600';
      case 'uploading': return 'text-yellow-600';
      default: return 'text-muted-foreground';
    }
  };

  // Metrics for table display
  const tableMetrics = [
    { key: 'clvRev', label: 'LTV Revenue', format: 'currency', category: 'key' },
    { key: 'clvProfit', label: 'LTV Profit', format: 'currency', category: 'key' },
    { key: 'totalCustomers', label: 'Total Customers', format: 'number', category: 'raw' },
    { key: 'totalSales', label: 'Total Sales', format: 'currency', category: 'raw' },
    { key: 'totalOrders', label: 'Total Orders', format: 'number', category: 'raw' },
    { key: 'repeatCustomers', label: 'Repeat Customers', format: 'number', category: 'raw' },
    { key: 'repeatSales', label: 'Repeat Sales', format: 'currency', category: 'raw' },
    { key: 'repeatOrders', label: 'Repeat Orders', format: 'number', category: 'raw' },
    { key: 'repeatCustomerRate', label: 'Repeat Customer Rate', format: 'percentage', category: 'calculated' },
    { key: 'contributionProfitPct', label: 'Contribution Profit %', format: 'percentage', category: 'calculated' },
    { key: 'contributionProfit', label: 'Contribution Profit', format: 'currency', category: 'calculated' },
  ];

  return (
    <ToolAccessGate toolName="LTV Calculator">
      <div className="min-h-screen gradient-hero p-6">
      <div className="container mx-auto max-w-7xl">
        <div className="mb-8">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-premium mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
          
          <div className="text-center">
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="w-12 h-12 rounded-lg gradient-primary flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-primary-foreground" />
              </div>
            </div>
            <h1 className="text-4xl font-bold mb-2">
              Customer Lifetime Value Calculator
            </h1>
            <p className="text-muted-foreground">
              Calculate LTV for your Amazon brand based on repeat vs one-time customers, 
              gross margins and advertising spend
            </p>
          </div>
        </div>

        {errors.length > 0 && (
          <Card className="mb-6 border-red-500/20">
            <CardContent className="p-4">
              <div className="text-red-600 space-y-1">
                {errors.map((error, index) => (
                  <p key={index} className="text-sm">{error}</p>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          <Card className="gradient-card border-primary/20 shadow-premium">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5 text-primary" />
                Setup
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Currency</Label>
                <select 
                  value={currency} 
                  onChange={e => setCurrency(e.target.value)} 
                  className="w-full p-2 rounded-md border border-primary/20 bg-background/50 focus:border-primary"
                >
                  {['USD','EUR','GBP','JPY','CAD','AUD'].map(c => 
                    <option key={c} value={c}>{c}</option>
                  )}
                </select>
              </div>
              
              <div className="space-y-2">
                <Label>Upload CSV Data</Label>
                <input 
                  type="file" 
                  accept=".csv" 
                  onChange={handleFileUpload}
                  className="block w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                />
                {uploadStatus && (
                <div className="space-y-2">
                  <p className={`text-xs ${getStatusColor(uploadStatus)}`}>
                    {uploadStatus === 'success' && `✓ ${rawData.length} year(s) of data uploaded`}
                    {uploadStatus === 'error' && '✗ Upload failed'}
                    {uploadStatus === 'uploading' && 'Uploading...'}
                  </p>
                  {uploadStatus === 'success' && rawData.length > 0 && (
                    <div className="text-xs text-muted-foreground bg-background/30 p-2 rounded">
                      <p className="font-semibold">Preview:</p>
                      <p>Date: {rawData[0].Date}</p>
                      <p>Total Customers: {rawData[0]["Total Customers"]}</p>
                      <p>Total Sales: {formatCurrency(rawData[0]["Total Sales"], currency)}</p>
                    </div>
                  )}
                </div>
              )}
              </div>

              {rawData.length > 0 && (
                <div className="space-y-2">
                  <Button 
                    onClick={calculate} 
                    size="lg"
                    className="w-full gradient-primary shadow-glow transition-premium hover:scale-105"
                  >
                    <Calculator className="h-4 w-4 mr-2" />
                    Calculate LTV
                  </Button>
                  
                  <Button 
                    onClick={clearData} 
                    variant="outline"
                    size="sm"
                    className="w-full text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Clear Data
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="lg:col-span-3">
            {yearInputs.length > 0 && (
              <Card className="gradient-card border-primary/20 shadow-premium">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    Year-by-Year Inputs
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-primary/20">
                          <th className="text-left p-4 font-semibold min-w-40">Input Parameter</th>
                          {yearInputs.map(yearInput => (
                            <th key={yearInput.year} className="text-center p-4 font-semibold min-w-32">
                              {yearInput.year}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-primary/10">
                          <td className="p-4 font-medium">Gross Margin %</td>
                          {yearInputs.map(yearInput => (
                            <td key={`${yearInput.year}-margin`} className="p-4">
                              <Input
                                type="number"
                                min={0}
                                max={1}
                                step={0.01}
                                value={yearInput.grossMargin}
                                onChange={e => handleInputChange(yearInput.year, 'grossMargin', e.target.value)}
                                className="bg-background/50 border-primary/20 focus:border-primary text-center"
                                placeholder="0.30"
                              />
                            </td>
                          ))}
                        </tr>
                        <tr className="border-b border-primary/10">
                          <td className="p-4 font-medium">Ad Spend</td>
                          {yearInputs.map(yearInput => (
                            <td key={`${yearInput.year}-spend`} className="p-4">
                              <Input
                                type="number"
                                min={0}
                                value={yearInput.adSpend}
                                onChange={e => handleInputChange(yearInput.year, 'adSpend', e.target.value)}
                                className="bg-background/50 border-primary/20 focus:border-primary text-center"
                                placeholder="10000"
                              />
                            </td>
                          ))}
                        </tr>
                        <tr>
                          <td className="p-4 font-medium">Repeat Lifespan (years)</td>
                          {yearInputs.map(yearInput => (
                            <td key={`${yearInput.year}-lifespan`} className="p-4">
                              <Input
                                type="number"
                                min={0}
                                step={0.1}
                                value={yearInput.repeatLifespan}
                                onChange={e => handleInputChange(yearInput.year, 'repeatLifespan', e.target.value)}
                                className="bg-background/50 border-primary/20 focus:border-primary text-center"
                                placeholder="2.0"
                              />
                            </td>
                          ))}
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {computed.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-center">LTV Analysis Results</h2>
            
            <Card className="gradient-card border-primary/20 shadow-premium">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-primary/20">
                        <th className="text-left p-4 font-semibold">Metric</th>
                        {computed.map(c => (
                          <th key={c.year} className="text-center p-4 font-semibold min-w-32">
                            {c.year}
                          </th>
                        ))}
                        {computed.length >= 2 && (
                          <th className="text-center p-4 font-semibold min-w-20">YoY %</th>
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {tableMetrics.map((metric, index) => {
                        const isKeyMetric = metric.category === 'key';
                        const latest = computed[computed.length - 1];
                        const previous = computed.length >= 2 ? computed[computed.length - 2] : null;
                        
                        let yoyData = null;
                        if (previous) {
                          const currentVal = latest[metric.key as keyof YearComputed] as number;
                          const previousVal = previous[metric.key as keyof YearComputed] as number;
                          yoyData = calculateYoY(currentVal, previousVal);
                        }
                        
                        return (
                          <tr 
                            key={metric.key} 
                            className={`border-b border-primary/10 ${isKeyMetric ? 'bg-primary/5' : ''}`}
                          >
                            <td className={`p-4 ${isKeyMetric ? 'font-semibold' : ''}`}>
                              {metric.label}
                            </td>
                            {computed.map(c => (
                              <td key={`${c.year}-${metric.key}`} className="text-center p-4">
                                {metric.format === 'currency' 
                                  ? formatCurrency(c[metric.key as keyof YearComputed] as number, currency)
                                  : metric.format === 'percentage'
                                  ? `${((c[metric.key as keyof YearComputed] as number) * 100).toFixed(1)}%`
                                  : formatNumber(c[metric.key as keyof YearComputed] as number)
                                }
                              </td>
                            ))}
                            {computed.length >= 2 && (
                              <td className="text-center p-4">
                                {yoyData && (
                                  <div className={`flex items-center justify-center gap-1 ${yoyData.color}`}>
                                    {yoyData.icon}
                                    <span className="text-sm font-medium">
                                      {yoyData.percentage.toFixed(1)}%
                                    </span>
                                  </div>
                                )}
                              </td>
                            )}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="mt-12">
          <Card className="gradient-card border-primary/20 shadow-premium">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4 text-center">About This Calculator</h3>
              <div className="text-sm text-muted-foreground space-y-3">
                <p>
                  This LTV calculator analyzes your customer data to determine the lifetime value of repeat 
                  vs one-time customers, taking into account your gross margins and advertising spend.
                </p>
                <div className="grid md:grid-cols-2 gap-6 mt-6">
                  <div>
                    <h4 className="font-semibold mb-2">Required CSV Columns:</h4>
                    <ul className="space-y-1 text-xs">
                      <li>• Date (e.g., "December 31, 2023")</li>
                      <li>• Total Customers</li>
                      <li>• Total Sales</li>
                      <li>• Total Orders</li>
                      <li>• Repeat Customers</li>
                      <li>• Repeat Sales</li>
                      <li>• Repeat Orders</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Key Metrics Calculated:</h4>
                    <ul className="space-y-1 text-xs">
                      <li>• Customer Lifetime Value (Revenue & Profit)</li>
                      <li>• Repeat Customer Rate</li>
                      <li>• Average Purchase Values</li>
                      <li>• Contribution Profit Margins</li>
                      <li>• Year-over-Year Growth Analysis</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
    </ToolAccessGate>
  );
};

export default LifetimeValueApp;