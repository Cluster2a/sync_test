import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calculator, TrendingUp, Upload, DollarSign, Users, Trash2, Plus } from "lucide-react";

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
        const lines = text.trim().split('\n');
        
        if (lines.length < 2) {
          throw new Error("CSV must have at least a header and one data row");
        }
        
        const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
        const dataRow = lines[1].split(',').map(d => d.trim().replace(/"/g, ''));
        
        const data: any = {};
        headers.forEach((header, index) => {
          const value = dataRow[index];
          if (header === 'Date') {
            data[header] = value;
          } else {
            data[header] = parseFloat(value) || 0;
          }
        });
        
        // Validate required fields
        const required = ['Total Customers', 'Total Sales', 'Total Orders', 'Repeat Customers', 'Repeat Sales', 'Repeat Orders'];
        for (const field of required) {
          if (!(field in data)) {
            throw new Error(`Missing required field: ${field}`);
          }
        }
        
        resolve(data as YearDataRaw);
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
  const [uploadStatus, setUploadStatus] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<string[]>([]);

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>, year: string) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadStatus(prev => ({ ...prev, [year]: "uploading" }));
    setErrors([]);

    try {
      const data = await parseCSV(file);
      setRaws(prev => ({ ...prev, [year]: data }));
      setUploadStatus(prev => ({ ...prev, [year]: "success" }));
    } catch (err) {
      const errorMsg = `Error uploading ${year} data: ${err instanceof Error ? err.message : 'Unknown error'}`;
      setErrors(prev => [...prev, errorMsg]);
      setUploadStatus(prev => ({ ...prev, [year]: "error" }));
    }
  }

  function handleInputChange(year: string, field: keyof Omit<YearInputs, "year">, value: string) {
    const numValue = parseFloat(value) || 0;
    setYears(prev => prev.map(y => y.year === year ? { ...y, [field]: numValue } : y));
  }

  function addYear() {
    const year = new Date().getFullYear().toString();
    const yearExists = years.some(y => y.year === year);
    const newYear = yearExists ? `${year}-${years.length + 1}` : year;
    
    setYears(prev => [...prev, { 
      year: newYear, 
      grossMargin: 0.3, 
      adSpend: 0, 
      repeatLifespan: 2 
    }]);
  }

  function removeYear(year: string) {
    setYears(prev => prev.filter(y => y.year !== year));
    setRaws(prev => {
      const { [year]: removed, ...rest } = prev;
      return rest;
    });
    setUploadStatus(prev => {
      const { [year]: removed, ...rest } = prev;
      return rest;
    });
  }

  function calculate() {
    setErrors([]);
    const results: YearComputed[] = [];
    const missingData: string[] = [];
    
    for (const y of years) {
      const raw = raws[y.year];
      if (!raw) {
        missingData.push(y.year);
        continue;
      }
      results.push(computeMetrics(raw, y));
    }
    
    if (missingData.length > 0) {
      setErrors([`Missing CSV data for years: ${missingData.join(', ')}`]);
    }
    
    setComputed(results);
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-600';
      case 'error': return 'text-red-600';
      case 'uploading': return 'text-yellow-600';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <div className="min-h-screen gradient-hero p-6">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-premium mb-6 cursor-pointer">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </div>
          
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card className="gradient-card border-primary/20 shadow-premium">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5 text-primary" />
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
              
              <Button 
                onClick={addYear} 
                className="w-full gradient-primary shadow-glow transition-premium hover:scale-105"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Year
              </Button>

              {years.length > 0 && (
                <Button 
                  onClick={calculate} 
                  size="lg"
                  className="w-full bg-green-600 hover:bg-green-700 shadow-glow transition-premium hover:scale-105"
                >
                  <Calculator className="h-4 w-4 mr-2" />
                  Calculate LTV
                </Button>
              )}
            </CardContent>
          </Card>

          <div className="lg:col-span-2">
            <div className="space-y-6">
              {years.map((year, index) => (
                <Card key={year.year} className="gradient-card border-primary/20 shadow-premium">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Users className="h-5 w-5 text-primary" />
                        Year {year.year}
                      </div>
                      <Button
                        onClick={() => removeYear(year.year)}
                        variant="outline"
                        size="sm"
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <Upload className="h-4 w-4" />
                        Upload CSV Data
                      </Label>
                      <input 
                        type="file" 
                        accept=".csv" 
                        onChange={e => handleFileUpload(e, year.year)}
                        className="block w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                      />
                      {uploadStatus[year.year] && (
                        <p className={`text-xs ${getStatusColor(uploadStatus[year.year])}`}>
                          {uploadStatus[year.year] === 'success' && '✓ File uploaded successfully'}
                          {uploadStatus[year.year] === 'error' && '✗ Upload failed'}
                          {uploadStatus[year.year] === 'uploading' && 'Uploading...'}
                        </p>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label>Gross Margin %</Label>
                        <Input
                          type="number"
                          min={0}
                          max={1}
                          step={0.01}
                          value={year.grossMargin}
                          onChange={e => handleInputChange(year.year, 'grossMargin', e.target.value)}
                          className="bg-background/50 border-primary/20 focus:border-primary"
                          placeholder="0.30"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Advertising Spend</Label>
                        <Input
                          type="number"
                          min={0}
                          value={year.adSpend}
                          onChange={e => handleInputChange(year.year, 'adSpend', e.target.value)}
                          className="bg-background/50 border-primary/20 focus:border-primary"
                          placeholder="10000"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Repeat Lifespan (years)</Label>
                        <Input
                          type="number"
                          min={0}
                          step={0.1}
                          value={year.repeatLifespan}
                          onChange={e => handleInputChange(year.year, 'repeatLifespan', e.target.value)}
                          className="bg-background/50 border-primary/20 focus:border-primary"
                          placeholder="2.0"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {computed.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-center">LTV Analysis Results</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {computed.map(c => (
                <Card key={c.year} className="gradient-card border-primary/20 shadow-premium">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-primary" />
                      {c.year} Results
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="text-center p-3 rounded-lg bg-background/30">
                        <div className="text-lg font-bold text-primary">{formatCurrency(c.clvRev, currency)}</div>
                        <div className="text-xs text-muted-foreground">LTV Revenue</div>
                      </div>
                      <div className="text-center p-3 rounded-lg bg-background/30">
                        <div className="text-lg font-bold text-primary">{formatCurrency(c.clvProfit, currency)}</div>
                        <div className="text-xs text-muted-foreground">LTV Profit</div>
                      </div>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Repeat Rate:</span>
                        <span className="font-medium">{(c.repeatCustomerRate * 100).toFixed(1)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Contribution Profit:</span>
                        <span className="font-medium">{formatCurrency(c.contributionProfit, currency)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Profit Margin:</span>
                        <span className="font-medium">{(c.contributionProfitPct * 100).toFixed(1)}%</span>
                      </div>
                    </div>

                    <div className="text-center">
                      <Badge 
                        variant={c.clvProfit > 100 ? "default" : c.clvProfit > 50 ? "secondary" : "destructive"}
                        className="text-sm py-1 px-3"
                      >
                        {c.clvProfit > 100 ? "Strong LTV" : c.clvProfit > 50 ? "Good LTV" : "Needs Improvement"}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
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
                      <li>• Blended LTV across customer segments</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LifetimeValueApp;