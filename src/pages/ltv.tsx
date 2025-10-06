import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ArrowLeft, Calculator, TrendingUp, Upload, DollarSign, Users, Trash2, ArrowUp, ArrowDown, Minus, AlertTriangle, CheckCircle, AlertCircle,ChevronDown  } from "lucide-react";
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
  tacos: number;
  cac: number;
  adSpend: number;
  grossMargin: number;
}

interface Recommendation {
  type: 'success' | 'warning' | 'alert';
  title: string;
  description: string;
  actions: string[];
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
  const newToBrandCustomers = raw["New to Brand Customers"] || 0;  


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
  const tacos = totalSales > 0 ? (input.adSpend / totalSales) * 100 : 0;
  const cac = newToBrandCustomers > 0 ? input.adSpend / newToBrandCustomers : 0;
  
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
    tacos,
    cac,
    adSpend: input.adSpend,
    grossMargin: input.grossMargin
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

function generateRecommendations(latest: YearComputed): Recommendation[] {
  const recommendations: Recommendation[] = [];
  const lifetimeYears = latest.repeatCustomerLifespan;
  const cacPaybackRatio = latest.clvProfit > 0 ? latest.cac / latest.clvProfit : Infinity;
  const ltvCacRatio = latest.cac > 0 ? latest.clvProfit / latest.cac : Infinity;

  if (cacPaybackRatio < 0.3) {
    recommendations.push({
      type: 'success',
      title: 'Excellent Customer Acquisition Efficiency',
      description: `Your CAC of ${formatCurrency(latest.cac, 'USD')} pays back in approximately ${(cacPaybackRatio * lifetimeYears * 12).toFixed(1)} months (${(cacPaybackRatio * 100).toFixed(0)}% of your ${lifetimeYears}-year LTV Profit). This is highly profitable.`,
      actions: [
        'Consider scaling ad spend to acquire more customers at this profitable rate',
        'Test new marketing channels while maintaining current efficiency',
        'Document your winning strategies to replicate across products'
      ]
    });
  } else if (cacPaybackRatio >= 0.5 && cacPaybackRatio <= 1.0) {
    recommendations.push({
      type: 'warning',
      title: 'Long CAC Payback Period',
      description: `Your CAC of ${formatCurrency(latest.cac, 'USD')} represents ${(cacPaybackRatio * 100).toFixed(0)}% of your ${lifetimeYears}-year LTV Profit. You're near breakeven after ${lifetimeYears} years.`,
      actions: [
        'Improve retention programs to extend customer lifespan',
        'Reduce CAC through better ad targeting',
        'Increase average order value through bundling',
        'Consider implementing subscription models'
      ]
    });
  } else if (cacPaybackRatio > 1.0) {
    recommendations.push({
      type: 'alert',
      title: '⚠️ Unprofitable Customer Acquisition',
      description: `Your CAC of ${formatCurrency(latest.cac, 'USD')} exceeds your ${lifetimeYears}-year LTV Profit of ${formatCurrency(latest.clvProfit, 'USD')}. You're losing ${formatCurrency(latest.cac - latest.clvProfit, 'USD')} per customer.`,
      actions: [
        'IMMEDIATE: Reduce ad spend or pause unprofitable campaigns',
        'Improve ad targeting to lower acquisition costs',
        'Increase prices if market allows',
        'Focus on organic growth before scaling paid acquisition'
      ]
    });
  }

  const tacosThreshold = (latest.grossMargin * 100) - 15;
  if (latest.tacos > tacosThreshold) {
    recommendations.push({
      type: 'alert',
      title: 'TACoS Too High Relative to Margins',
      description: `Your TACoS of ${latest.tacos.toFixed(1)}% leaves only ${((latest.grossMargin * 100) - latest.tacos).toFixed(1)}% margin for operations and profit.`,
      actions: [
        'Reduce overall ad spend to improve profitability',
        'Improve organic ranking to decrease PPC dependency',
        'Optimize product listings to boost conversion rates',
        'Use negative keywords to eliminate wasted spend'
      ]
    });
  } else if (latest.tacos < 15 && ltvCacRatio > 4) {
    recommendations.push({
      type: 'success',
      title: 'Growth Opportunity Detected',
      description: `Your TACoS of ${latest.tacos.toFixed(1)}% is conservative and your LTV:CAC ratio of ${ltvCacRatio.toFixed(1)}:1 is strong. You may be under-investing in growth.`,
      actions: [
        'Consider increasing ad spend to capture more market share',
        'Test expansion into new keyword categories',
        'Your unit economics support aggressive growth'
      ]
    });
  }

  if (latest.tacos > 30 && ltvCacRatio > 4) {
    recommendations.push({
      type: 'warning',
      title: 'High TACoS Justified by Strong Retention',
      description: `Despite TACoS of ${latest.tacos.toFixed(1)}%, your strong LTV:CAC ratio of ${ltvCacRatio.toFixed(1)}:1 justifies the investment.`,
      actions: [
        'Continue current spend but monitor repeat rates closely',
        'Implement retention programs to maintain high LTV',
        'Track cohort behavior to validate LTV assumptions'
      ]
    });
  }

  if (ltvCacRatio < 3 && ltvCacRatio !== Infinity) {
    recommendations.push({
      type: 'alert',
      title: 'LTV:CAC Ratio Below Healthy Threshold',
      description: `Your LTV:CAC ratio of ${ltvCacRatio.toFixed(1)}:1 is below the recommended 3:1 minimum.`,
      actions: [
        'Target ratio: 3:1 or higher for sustainable growth',
        'Either reduce CAC or increase customer lifetime value',
        'Review and optimize underperforming campaigns'
      ]
    });
  }

  return recommendations;
}

const LifetimeValueApp: React.FC = () => {
  const [currency, setCurrency] = useState<string>("USD");
  const [yearInputs, setYearInputs] = useState<YearInputs[]>([]);
  const [rawData, setRawData] = useState<YearDataRaw[]>([]);
  const [computed, setComputed] = useState<YearComputed[]>([]);
  const [uploadStatus, setUploadStatus] = useState<string>("");
  const [errors, setErrors] = useState<string[]>([]);
  const [showHowTo, setShowHowTo] = useState(false);


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
    { key: 'tacos', label: 'TACoS %', format: 'tacos', category: 'key' },
    { key: 'cac', label: 'CAC (Customer Acquisition Cost)', format: 'currency', category: 'key' },
    { key: 'totalCustomers', label: 'Total Customers', format: 'number', category: 'raw' },
    { key: 'totalSales', label: 'Total Sales', format: 'currency', category: 'raw' },
    { key: 'totalOrders', label: 'Total Orders', format: 'number', category: 'raw' },
    { key: 'repeatCustomers', label: 'Repeat Customers', format: 'number', category: 'raw' },
    { key: 'newToBrandCustomers', label: 'New to Brand Customers', format: 'number', category: 'raw' },
    { key: 'repeatSales', label: 'Repeat Sales', format: 'currency', category: 'raw' },
    { key: 'repeatOrders', label: 'Repeat Orders', format: 'number', category: 'raw' },
    { key: 'repeatCustomerRate', label: 'Repeat Customer Rate', format: 'percentage', category: 'calculated' },
    { key: 'contributionProfitPct', label: 'Contribution Profit %', format: 'percentage', category: 'calculated' },
    { key: 'contributionProfit', label: 'Contribution Profit', format: 'currency', category: 'calculated' },
  ];
  const recommendations = computed.length > 0 ? generateRecommendations(computed[computed.length - 1]) : [];

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

{/* How to Use Section - Collapsible */}
<div className="mb-8">
  <Card className="gradient-card border-primary/20 shadow-premium">
    <CardHeader 
      className="cursor-pointer hover:bg-primary/5 transition-colors"
      onClick={() => setShowHowTo(!showHowTo)}
    >
      <CardTitle className="flex items-center justify-between">
        <span className="flex items-center gap-2">
          <span>How to Use This Tool</span>
        </span>
        <div className={`transition-transform duration-300 ${showHowTo ? 'rotate-180' : ''}`}>
          <ChevronDown className="h-5 w-5" />
        </div>
      </CardTitle>
    </CardHeader>
    {showHowTo && (
      <CardContent className="pt-0">
        <div className="aspect-video w-full rounded-lg overflow-hidden">
          <iframe
            width="100%"
            height="100%"
            src="https://www.youtube.com/embed/7UrQYvM3m_w"
            title="How to use Multi-Channel Marketing Dashboard"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
          ></iframe>
        </div>
      </CardContent>
    )}
  </Card>
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
                                  : metric.format === 'tacos'
                                  ? `${(c[metric.key as keyof YearComputed] as number).toFixed(1)}%`
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

      {/* Recommendations Section */}
        {recommendations.length > 0 && (
          <div className="space-y-4 mb-8">
            <h2 className="text-2xl font-bold text-center">Strategic Recommendations</h2>
            {recommendations.map((rec, idx) => (
              <Card key={idx} className={`gradient-card shadow-premium ${
                rec.type === 'success' ? 'border-green-500/20' :
                rec.type === 'warning' ? 'border-yellow-500/20' :
                'border-red-500/20'
              }`}>
                <CardContent className="p-6">
                  <div className="flex items-start gap-3 mb-3">
                    {rec.type === 'success' && <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />}
                    {rec.type === 'warning' && <AlertCircle className="h-6 w-6 text-yellow-600 flex-shrink-0 mt-1" />}
                    {rec.type === 'alert' && <AlertTriangle className="h-6 w-6 text-red-600 flex-shrink-0 mt-1" />}
                    <div>
                      <h3 className="text-lg font-semibold">{rec.title}</h3>
                      <p className="text-muted-foreground mt-2">{rec.description}</p>
                    </div>
                  </div>
                  <div className="ml-9">
                    <p className="font-semibold text-sm mb-2">Action Items:</p>
                    <ul className="space-y-1">
                      {rec.actions.map((action, i) => (
                        <li key={i} className="text-sm flex items-start gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                          <span>{action}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
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

        {/* SEO FAQ Section */}
        <div className="mt-16">
          <Card className="gradient-card border-primary/20 shadow-premium">
            <CardHeader>
              <CardTitle className="text-2xl md:text-3xl text-center">
                Frequently Asked Questions About Customer Lifetime Value
              </CardTitle>
              <p className="text-muted-foreground text-center mt-2">
                Everything you need to know about calculating and optimizing LTV for your e-commerce business
              </p>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger className="text-left">
                    What is Customer Lifetime Value (LTV)?
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text-muted-foreground leading-relaxed">
                      Customer Lifetime Value (LTV) is a metric that represents the total revenue or profit a business can expect from a single customer throughout their entire relationship. For e-commerce businesses, especially Amazon sellers, LTV is crucial because it helps you understand how much each customer is truly worth beyond their first purchase. Our LTV calculator helps you accurately measure this by analyzing repeat purchase behavior, average order values, and customer retention rates over multiple years. By understanding your LTV, you can make smarter decisions about how much to invest in customer acquisition and retention strategies.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-2">
                  <AccordionTrigger className="text-left">
                    Why is LTV important for e-commerce businesses?
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text-muted-foreground leading-relaxed">
                      LTV is one of the most important metrics for e-commerce profitability because it reveals the long-term value of your customer acquisition efforts. While many sellers focus solely on immediate sales, understanding LTV helps you see the bigger picture: a customer who makes repeat purchases over years is far more valuable than one-time buyers. This metric directly influences your marketing budget decisions, customer retention strategies, and overall business growth planning. Our calculator analyzes your historical data to show both revenue and profit-based LTV, helping you understand not just how much customers spend, but how much they actually contribute to your bottom line after accounting for costs and margins.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-3">
                  <AccordionTrigger className="text-left">
                    How do you calculate Customer Lifetime Value?
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text-muted-foreground leading-relaxed mb-3">
                      There are several methods to calculate LTV, but the most accurate approach for e-commerce uses historical cohort analysis. Our calculator uses this method, which tracks real customer behavior over time. The basic formula considers: (Average Purchase Value) × (Purchase Frequency) × (Customer Lifespan). However, for true accuracy, you need to factor in repeat purchase rates, customer retention curves, gross margins, and acquisition costs.
                    </p>
                    <p className="text-muted-foreground leading-relaxed">
                      Our tool simplifies this complex calculation by allowing you to upload your Amazon Business Reports or manually input data across multiple years. It automatically calculates both revenue-based LTV (total customer spending) and profit-based LTV (accounting for margins and ad spend), giving you a complete picture of customer value. The calculator also shows year-over-year trends, helping you identify whether your LTV is improving or declining over time.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-4">
                  <AccordionTrigger className="text-left">
                    What's the difference between LTV and CLV?
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text-muted-foreground leading-relaxed">
                      LTV (Lifetime Value) and CLV (Customer Lifetime Value) are actually the same metric—the terms are used interchangeably in the industry. Some businesses prefer "CLV" to emphasize the customer-centric focus, while others use "LTV" for brevity. Regardless of the acronym, both measure the total value a customer brings to your business over their entire relationship with your brand. Our calculator uses LTV terminology but provides the same comprehensive analysis that any CLV tool would offer, including repeat purchase behavior, customer retention metrics, and long-term profitability projections.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-5">
                  <AccordionTrigger className="text-left">
                    What is a good LTV for an Amazon seller?
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text-muted-foreground leading-relaxed mb-3">
                      A "good" LTV varies significantly by product category, price point, and business model, but a common benchmark is that your LTV should be at least 3 times your Customer Acquisition Cost (CAC). For Amazon sellers, average LTV can range from $50 for low-ticket consumables with high repeat rates to $500+ for premium or durable goods with loyal customers. The key isn't comparing your LTV to others, but understanding the ratio between your LTV and CAC (known as the LTV:CAC ratio).
                    </p>
                    <p className="text-muted-foreground leading-relaxed">
                      Our calculator helps you benchmark your performance by showing both revenue and profit-based LTV alongside your customer acquisition costs. If your LTV:CAC ratio is below 3:1, you may be spending too much on acquisition or not doing enough to retain customers. If it's above 5:1, you might be under-investing in growth opportunities. Use our tool to track this ratio over time and optimize your marketing spend accordingly.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-6">
                  <AccordionTrigger className="text-left">
                    How can I increase my customer lifetime value?
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text-muted-foreground leading-relaxed mb-3">
                      Increasing LTV requires a multi-faceted approach focusing on three key areas: increasing purchase frequency, raising average order values, and extending customer lifespan. For Amazon sellers, this might include implementing subscription models (Subscribe & Save), creating product bundles, launching complementary products, improving product quality to reduce returns, and building a brand presence outside of Amazon through email marketing and social media.
                    </p>
                    <p className="text-muted-foreground leading-relaxed">
                      Our LTV calculator helps you identify which levers to pull by showing you detailed metrics like repeat purchase rates, average order values, and customer retention patterns. By analyzing your data year-over-year, you can see which strategies are working and where there's room for improvement. For example, if your repeat purchase rate is low but your average order value is high, you might focus on post-purchase email campaigns to encourage repeat orders rather than trying to increase basket size.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-7">
                  <AccordionTrigger className="text-left">
                    What factors affect customer lifetime value?
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text-muted-foreground leading-relaxed mb-3">
                      Multiple factors influence LTV, including: product quality and customer satisfaction, pricing strategy and perceived value, purchase frequency and repeat rates, customer service excellence, brand loyalty and emotional connection, product category and consumability, competitive landscape, and your retention marketing efforts. For Amazon businesses specifically, factors like product reviews, fulfillment speed (FBA vs FBM), and pricing competitiveness play outsized roles.
                    </p>
                    <p className="text-muted-foreground leading-relaxed">
                      Our calculator helps you understand which factors are most impactful for your business by breaking down LTV into its component parts: new customer acquisition, repeat customer behavior, average order values, and profit margins. By tracking these metrics over multiple years, you can identify trends and understand which initiatives are actually moving the needle on customer value. This data-driven approach removes guesswork and helps you focus on the strategies that deliver the highest ROI.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-8">
                  <AccordionTrigger className="text-left">
                    How often should I calculate LTV?
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text-muted-foreground leading-relaxed">
                      For most e-commerce businesses, calculating LTV quarterly is ideal, with a more comprehensive annual analysis. Quarterly calculations help you spot trends early and make timely adjustments to your marketing and retention strategies, while annual reviews provide the longer time horizon needed to truly understand customer behavior patterns. However, if you're running major marketing campaigns, launching new products, or making significant changes to your business model, more frequent LTV analysis can be valuable. Our calculator makes it easy to analyze your LTV whenever you need to—simply upload your latest Amazon Business Reports or update your manual inputs to see current metrics. The tool stores your historical data, making it simple to track changes over time and understand whether your initiatives are improving customer value.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-9">
                  <AccordionTrigger className="text-left">
                    What's the relationship between LTV and customer acquisition cost (CAC)?
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text-muted-foreground leading-relaxed mb-3">
                      LTV and CAC are two sides of the same profitability equation. CAC measures how much you spend to acquire a new customer (including advertising, promotions, and marketing costs), while LTV measures how much revenue or profit that customer generates over their lifetime. The relationship between these metrics—expressed as the LTV:CAC ratio—is one of the most important indicators of business health and sustainability.
                    </p>
                    <p className="text-muted-foreground leading-relaxed">
                      A healthy e-commerce business typically aims for an LTV:CAC ratio of 3:1 or higher, meaning each customer generates at least three times what you spent to acquire them. Our calculator automatically computes this ratio when you input your ad spend data, helping you understand whether your customer acquisition is profitable in the long run. This is especially critical for Amazon sellers who face high advertising costs—knowing your true LTV helps you determine how aggressively you can bid on keywords while maintaining profitability.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-10">
                  <AccordionTrigger className="text-left">
                    How does LTV help with marketing budget decisions?
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text-muted-foreground leading-relaxed mb-3">
                      Understanding your LTV fundamentally changes how you approach marketing budgets. Instead of optimizing for immediate return on ad spend (ROAS), you can make decisions based on long-term customer value. For example, if you know your average customer has an LTV of $300, you might be willing to break even or even lose money on the first purchase if you're confident in your retention strategies. This opens up more aggressive growth opportunities that competitors focused only on immediate profitability might miss.
                    </p>
                    <p className="text-muted-foreground leading-relaxed">
                      Our LTV calculator provides the precise data you need to make these strategic decisions with confidence. By showing you both revenue and profit-based LTV, repeat purchase patterns, and the relationship between acquisition costs and customer value, you can set marketing budgets that maximize long-term profitability rather than short-term gains. The tool also helps you identify which customer segments have the highest LTV, allowing you to target your most valuable customers more effectively and allocate your marketing budget where it will generate the best returns.
                    </p>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
    </ToolAccessGate>
  );
};

export default LifetimeValueApp;