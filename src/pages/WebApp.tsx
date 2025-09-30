import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calculator, TrendingUp, Target } from "lucide-react";
import { Link } from "react-router-dom";
import { ToolAccessGate } from "@/components/ToolAccessGate";

const WebApp = () => {
  const [acos, setAcos] = useState("");
  const [spend, setSpend] = useState("");
  const [revenue, setRevenue] = useState("");
  const [result, setResult] = useState<any>(null);

  const calculateROI = () => {
    const acosValue = parseFloat(acos);
    const spendValue = parseFloat(spend);
    const revenueValue = parseFloat(revenue);

    if (acosValue && spendValue && revenueValue) {
      const profit = revenueValue - spendValue;
      const roi = ((profit / spendValue) * 100);
      const efficiency = 100 - acosValue;
      
      setResult({
        profit: profit.toFixed(2),
        roi: roi.toFixed(2),
        efficiency: efficiency.toFixed(1),
        recommendation: roi > 100 ? "Excellent performance" : roi > 50 ? "Good performance" : "Needs optimization"
      });
    }
  };

  return (
    <ToolAccessGate toolName="ROI Calculator">
      <div className="min-h-screen gradient-hero p-6">
        <div className="container mx-auto max-w-4xl">
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
                  <Calculator className="h-6 w-6 text-primary-foreground" />
                </div>
              </div>
              <h1 className="text-4xl font-bold mb-2">
                Amazon PPC ROI Calculator
              </h1>
              <p className="text-muted-foreground">Calculate your advertising return on investment and optimize your campaigns</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="gradient-card border-primary/20 shadow-premium">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  Campaign Data Input
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="acos">ACoS (Advertising Cost of Sales) %</Label>
                  <Input
                    id="acos"
                    type="number"
                    value={acos}
                    onChange={(e) => setAcos(e.target.value)}
                    placeholder="e.g., 25"
                    className="bg-background/50 border-primary/20 focus:border-primary"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="spend">Ad Spend ($)</Label>
                  <Input
                    id="spend"
                    type="number"
                    value={spend}
                    onChange={(e) => setSpend(e.target.value)}
                    placeholder="e.g., 1000"
                    className="bg-background/50 border-primary/20 focus:border-primary"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="revenue">Revenue Generated ($)</Label>
                  <Input
                    id="revenue"
                    type="number"
                    value={revenue}
                    onChange={(e) => setRevenue(e.target.value)}
                    placeholder="e.g., 4000"
                    className="bg-background/50 border-primary/20 focus:border-primary"
                  />
                </div>

                <Button 
                  onClick={calculateROI} 
                  size="lg" 
                  className="w-full gradient-primary shadow-glow transition-premium hover:scale-105"
                >
                  Calculate ROI
                </Button>
              </CardContent>
            </Card>

            <Card className="gradient-card border-primary/20 shadow-premium">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Results & Insights
                </CardTitle>
              </CardHeader>
              <CardContent>
                {result ? (
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 rounded-lg bg-background/30">
                        <div className="text-2xl font-bold text-primary">${result.profit}</div>
                        <div className="text-sm text-muted-foreground">Profit</div>
                      </div>
                      <div className="text-center p-4 rounded-lg bg-background/30">
                        <div className="text-2xl font-bold text-primary">{result.roi}%</div>
                        <div className="text-sm text-muted-foreground">ROI</div>
                      </div>
                    </div>
                    
                    <div className="text-center p-4 rounded-lg bg-background/30">
                      <div className="text-xl font-bold text-primary">{result.efficiency}%</div>
                      <div className="text-sm text-muted-foreground">Campaign Efficiency</div>
                    </div>

                    <div className="text-center">
                      <Badge 
                        variant={result.roi > 100 ? "default" : result.roi > 50 ? "secondary" : "destructive"}
                        className="text-lg py-2 px-4"
                      >
                        {result.recommendation}
                      </Badge>
                    </div>

                    <div className="space-y-3 text-sm">
                      <h4 className="font-semibold">Optimization Tips:</h4>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                          <span>Target ACoS below 30% for better profitability</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                          <span>Focus on high-converting keywords</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                          <span>Optimize product listings for better conversion</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <Calculator className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Enter your campaign data to see detailed ROI analysis and optimization recommendations.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="mt-8 text-center">
            <Card className="gradient-card border-primary/20 shadow-premium">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Need More Advanced Analytics?</h3>
                <p className="text-muted-foreground mb-4">
                  This is just one fun tool with no real impact. Get access to advanced 
                  analytics, automation scripts, and custom solutions tailored to your business when you work with us. Or check out the other free tools, which we promise are actually helpful!
                </p>
                <Link to="/contact">
                  <Button className="gradient-primary shadow-glow transition-premium hover:scale-105">
                    Get in touch
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ToolAccessGate>
  );
};

export default WebApp;