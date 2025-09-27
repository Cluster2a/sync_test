import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Target, TrendingUp, Package, Zap, DollarSign, BarChart3, CheckCircle, AlertTriangle, ArrowDown, ArrowUp } from "lucide-react";
import { Link } from "react-router-dom";

interface FormData {
  grossMargin: number | null;
  ppcSalesPercent: number | null;
  inventoryLevel: string;
  strategy: string;
  currentAcos: number | null;
}

interface CalculationResult {
  targetAcos: number;
  baseCalculation: number;
  ppcModifier: number;
  inventoryModifier: number;
  strategyModifier: number;
  comparison: {
    difference: number;
    recommendation: string;
    status: 'good' | 'warning' | 'alert';
  };
}

const AcosTargetCalculator: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    grossMargin: null,
    ppcSalesPercent: null,
    inventoryLevel: '',
    strategy: '',
    currentAcos: null
  });
  const [result, setResult] = useState<CalculationResult | null>(null);

  const inventoryOptions = [
    { value: 'low', label: 'Low (< 30 days supply)', modifier: 0.5 },
    { value: 'medium', label: 'Medium (30-90 days)', modifier: 1 },
    { value: 'high', label: 'High (90-180 days)', modifier: 0.85 },
    { value: 'very-high', label: 'Very High (> 180 days)', modifier: 1 }
  ];

  const strategyOptions = [
    { value: 'ranking', label: 'Sell as much as possible at break-even (gain ranks)', modifier: 1.1 },
    { value: 'balanced', label: 'Balance velocity and profits', modifier: 1 },
    { value: 'profit', label: 'Focus on max profitability', modifier: 0.9 }
  ];

  const handleInputChange = (field: keyof FormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Auto-advance to next step when field is filled
    if (field === 'grossMargin' && value && currentStep === 1) {
      setTimeout(() => setCurrentStep(2), 300);
    } else if (field === 'ppcSalesPercent' && value && currentStep === 2) {
      setTimeout(() => setCurrentStep(3), 300);
    } else if (field === 'inventoryLevel' && value && currentStep === 3) {
      setTimeout(() => setCurrentStep(4), 300);
    } else if (field === 'strategy' && value && currentStep === 4) {
      setTimeout(() => setCurrentStep(5), 300);
    }
  };

  const calculateTarget = () => {
    if (!formData.grossMargin || !formData.ppcSalesPercent || !formData.inventoryLevel || 
        !formData.strategy || !formData.currentAcos) return;

    // Base calculation: 0.7 * gross margin
    const baseCalculation = 0.7 * (formData.grossMargin / 100);

    // PPC Sales modifier
    let ppcModifier = 1;
    if (formData.ppcSalesPercent > 60) {
      ppcModifier = 0.9; // Reduce target for high PPC dependency
    } else if (formData.ppcSalesPercent < 40) {
      ppcModifier = 1.1; // Increase target for low PPC dependency
    }

    // Inventory modifier
    const inventoryOption = inventoryOptions.find(opt => opt.value === formData.inventoryLevel);
    const inventoryModifier = inventoryOption?.modifier || 1;

    // Strategy modifier
    const strategyOption = strategyOptions.find(opt => opt.value === formData.strategy);
    const strategyModifier = strategyOption?.modifier || 1;

    // Final calculation
    const targetAcos = baseCalculation * ppcModifier * inventoryModifier * strategyModifier;

    // Comparison with current ACOS
    const difference = (formData.currentAcos / 100) - targetAcos;
    let recommendation = '';
    let status: 'good' | 'warning' | 'alert' = 'good';

    if (Math.abs(difference) < 0.02) {
      recommendation = 'Your current ACOS is very close to the optimal target!';
      status = 'good';
    } else if (difference > 0.05) {
      recommendation = 'Your ACOS is significantly higher than optimal. Consider optimizing your campaigns.';
      status = 'alert';
    } else if (difference > 0.02) {
      recommendation = 'Your ACOS could be optimized. Small improvements could boost profitability.';
      status = 'warning';
    } else if (difference < -0.02) {
      recommendation = 'Your ACOS is below target. You might be missing growth opportunities.';
      status = 'warning';
    } else {
      recommendation = 'Your current ACOS is well-optimized!';
      status = 'good';
    }

    setResult({
      targetAcos: targetAcos * 100,
      baseCalculation: baseCalculation * 100,
      ppcModifier,
      inventoryModifier,
      strategyModifier,
      comparison: {
        difference: difference * 100,
        recommendation,
        status
      }
    });
  };

  const resetCalculator = () => {
    setCurrentStep(1);
    setFormData({
      grossMargin: null,
      ppcSalesPercent: null,
      inventoryLevel: '',
      strategy: '',
      currentAcos: null
    });
    setResult(null);
  };

  return (
    <div className="min-h-screen gradient-hero p-6">
      <div className="container mx-auto max-w-4xl">
        <div className="mb-8">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-premium mb-6 cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
          
          <div className="text-center">
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="w-12 h-12 rounded-lg gradient-primary flex items-center justify-center">
                <Target className="h-6 w-6 text-primary-foreground" />
              </div>
            </div>
            <h1 className="text-4xl font-bold mb-2">
              ACOS Target Calculator
            </h1>
            <p className="text-muted-foreground">
              Calculate your optimal ACOS target based on ASIN-specific factors and business goals
            </p>
          </div>
        </div>

        {!result ? (
          <Card className="gradient-card border-primary/20 shadow-premium max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="text-center">
                To calculate your ASIN level ACOS target, we need a few informations
              </CardTitle>
              <div className="text-center text-sm text-muted-foreground">
                Step {currentStep} of 5
              </div>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* Step 1: Gross Margin */}
              <div className={`space-y-4 transition-all duration-500 ${currentStep >= 1 ? 'opacity-100' : 'opacity-50'}`}>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-sm font-bold text-primary-foreground">
                    1
                  </div>
                  <Label className="text-lg font-semibold">What's the average Gross Margin % over the past 30 days?</Label>
                </div>
                <div className="ml-11">
                  <Input
                    type="number"
                    min={0}
                    max={100}
                    step={0.1}
                    value={formData.grossMargin || ''}
                    onChange={(e) => handleInputChange('grossMargin', parseFloat(e.target.value) || 0)}
                    placeholder="e.g., 35"
                    className="bg-background/50 border-primary/20 focus:border-primary"
                    disabled={currentStep !== 1}
                  />
                  <div className="text-xs text-muted-foreground mt-1">Enter percentage (e.g., 35 for 35%)</div>
                </div>
              </div>

              {/* Step 2: PPC Sales Split */}
              {currentStep >= 2 && (
                <div className="space-y-4 animate-in slide-in-from-bottom-4 duration-500">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-sm font-bold text-primary-foreground">
                      2
                    </div>
                    <Label className="text-lg font-semibold">What's the average split between organic and PPC sales over the past 30 days?</Label>
                  </div>
                  <div className="ml-11">
                    <Input
                      type="number"
                      min={0}
                      max={100}
                      step={1}
                      value={formData.ppcSalesPercent || ''}
                      onChange={(e) => handleInputChange('ppcSalesPercent', parseFloat(e.target.value) || 0)}
                      placeholder="e.g., 65"
                      className="bg-background/50 border-primary/20 focus:border-primary"
                      disabled={currentStep !== 2}
                    />
                    <div className="text-xs text-muted-foreground mt-1">Enter percent of PPC sales (e.g., 65 for 65%)</div>
                  </div>
                </div>
              )}

              {/* Step 3: Inventory Level */}
              {currentStep >= 3 && (
                <div className="space-y-4 animate-in slide-in-from-bottom-4 duration-500">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-sm font-bold text-primary-foreground">
                      3
                    </div>
                    <Label className="text-lg font-semibold">How is your inventory situation?</Label>
                  </div>
                  <div className="ml-11">
                    <Select value={formData.inventoryLevel} onValueChange={(value) => handleInputChange('inventoryLevel', value)}>
                      <SelectTrigger className="bg-background/50 border-primary/20 focus:border-primary">
                        <SelectValue placeholder="Select inventory level" />
                      </SelectTrigger>
                      <SelectContent>
                        {inventoryOptions.map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              {/* Step 4: Strategy */}
              {currentStep >= 4 && (
                <div className="space-y-4 animate-in slide-in-from-bottom-4 duration-500">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-sm font-bold text-primary-foreground">
                      4
                    </div>
                    <Label className="text-lg font-semibold">What's your goal with this ASIN?</Label>
                  </div>
                  <div className="ml-11">
                    <Select value={formData.strategy} onValueChange={(value) => handleInputChange('strategy', value)}>
                      <SelectTrigger className="bg-background/50 border-primary/20 focus:border-primary">
                        <SelectValue placeholder="Select your strategy" />
                      </SelectTrigger>
                      <SelectContent>
                        {strategyOptions.map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              {/* Step 5: Current ACOS */}
              {currentStep >= 5 && (
                <div className="space-y-4 animate-in slide-in-from-bottom-4 duration-500">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-sm font-bold text-primary-foreground">
                      5
                    </div>
                    <Label className="text-lg font-semibold">What's the current 30-day ACOS for this ASIN?</Label>
                  </div>
                  <div className="ml-11">
                    <Input
                      type="number"
                      min={0}
                      max={200}
                      step={0.1}
                      value={formData.currentAcos || ''}
                      onChange={(e) => handleInputChange('currentAcos', parseFloat(e.target.value) || 0)}
                      placeholder="e.g., 28.5"
                      className="bg-background/50 border-primary/20 focus:border-primary"
                    />
                    <div className="text-xs text-muted-foreground mt-1">Enter current ACOS percentage</div>
                  </div>
                </div>
              )}

              {/* Calculate Button */}
              {currentStep === 5 && formData.currentAcos && (
                <div className="text-center pt-4 animate-in fade-in duration-500">
                  <Button 
                    onClick={calculateTarget}
                    size="lg"
                    className="gradient-primary shadow-glow transition-premium hover:scale-105"
                  >
                    <Target className="h-4 w-4 mr-2" />
                    Calculate Target ACOS
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-8">
            {/* Results Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="gradient-card border-primary/20 shadow-premium text-center">
                <CardContent className="p-6">
                  <Target className="h-12 w-12 mx-auto mb-4 text-primary" />
                  <div className="text-3xl font-bold text-primary">{result.targetAcos.toFixed(1)}%</div>
                  <div className="text-sm text-muted-foreground">Target ACOS</div>
                </CardContent>
              </Card>
              
              <Card className="gradient-card border-primary/20 shadow-premium text-center">
                <CardContent className="p-6">
                  <BarChart3 className="h-12 w-12 mx-auto mb-4 text-primary" />
                  <div className="text-3xl font-bold text-primary">{formData.currentAcos}%</div>
                  <div className="text-sm text-muted-foreground">Current ACOS</div>
                </CardContent>
              </Card>
              
              <Card className="gradient-card border-primary/20 shadow-premium text-center">
                <CardContent className="p-6">
                  {result.comparison.status === 'good' && <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-600" />}
                  {result.comparison.status === 'warning' && <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-yellow-600" />}
                  {result.comparison.status === 'alert' && <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-red-600" />}
                  <div className="flex items-center justify-center gap-1">
                    {result.comparison.difference > 0 ? (
                      <ArrowUp className="h-4 w-4 text-red-600" />
                    ) : result.comparison.difference < 0 ? (
                      <ArrowDown className="h-4 w-4 text-green-600" />
                    ) : null}
                    <div className="text-3xl font-bold text-primary">
                      {Math.abs(result.comparison.difference).toFixed(1)}%
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {result.comparison.difference > 0 ? 'Above' : result.comparison.difference < 0 ? 'Below' : 'At'} Target
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Calculation Breakdown */}
            <Card className="gradient-card border-primary/20 shadow-premium">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Calculation Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 rounded-lg bg-background/30">
                    <span className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4" />
                      Base Calculation (70% of Gross Margin)
                    </span>
                    <Badge variant="outline">{result.baseCalculation.toFixed(1)}%</Badge>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 rounded-lg bg-background/30">
                    <span className="flex items-center gap-2">
                      <Zap className="h-4 w-4" />
                      PPC Sales Modifier
                    </span>
                    <Badge variant="outline">×{result.ppcModifier.toFixed(2)}</Badge>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 rounded-lg bg-background/30">
                    <span className="flex items-center gap-2">
                      <Package className="h-4 w-4" />
                      Inventory Level Modifier
                    </span>
                    <Badge variant="outline">×{result.inventoryModifier.toFixed(2)}</Badge>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 rounded-lg bg-background/30">
                    <span className="flex items-center gap-2">
                      <Target className="h-4 w-4" />
                      Strategy Modifier
                    </span>
                    <Badge variant="outline">×{result.strategyModifier.toFixed(2)}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recommendation */}
            <Card className={`gradient-card shadow-premium ${
              result.comparison.status === 'good' ? 'border-green-500/20' : 
              result.comparison.status === 'warning' ? 'border-yellow-500/20' : 'border-red-500/20'
            }`}>
              <CardContent className="p-6">
                <div className="text-center space-y-4">
                  <div className={`text-lg font-semibold ${
                    result.comparison.status === 'good' ? 'text-green-600' : 
                    result.comparison.status === 'warning' ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {result.comparison.recommendation}
                  </div>
                  
                  <div className="text-sm text-muted-foreground max-w-2xl mx-auto">
                    See, calculating an ACOS target can have multiple important factors and we haven't even 
                    spoken about organic ranks and competitors. To understand your ideal target ACOS and 
                    develop a comprehensive PPC strategy, talk with us.
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="text-center space-y-4">
              <Button 
                onClick={resetCalculator}
                variant="outline"
                size="lg"
                className="mr-4"
              >
                Calculate Another ASIN
              </Button>
              
              <div>
                <Button className="gradient-primary shadow-glow transition-premium hover:scale-105">
                  Get Professional ACOS Strategy
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AcosTargetCalculator;