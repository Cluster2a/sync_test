import React, { useState, useMemo } from 'react';
import { Link } from "react-router-dom";
import { Upload, TrendingUp, DollarSign, Target, Calendar, ChevronDown, ArrowLeft, LineChart as LucideLineChart } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer  } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import Papa from 'papaparse';

const MarketingDashboard = () => {
  const [channelData, setChannelData] = useState([]);
  const [goalsData, setGoalsData] = useState([]);
  const [timeView, setTimeView] = useState('daily');
  const [uploadStatus, setUploadStatus] = useState({ channel: false, goals: false });
  const [showHowTo, setShowHowTo] = useState(false);


  // Handle CSV file uploads
                  const handleFileUpload = (type, file) => {
                  Papa.parse(file, {
                    header: true,
                    dynamicTyping: true,
                    skipEmptyLines: true,
                    delimitersToGuess: [',', '\t', '|', ';'],
                    complete: (results) => {
                      if (type === 'channel') {
                        // Process channel performance data
                        const processedData = results.data.map((row: any) => {
                          const headers = Object.keys(row);
                          
                          return {
                            date: new Date(row.Date || row.date),
                            amazonRevenue: parseFloat(row['Amazon Revenue'] || row.amazonRevenue || row['Amazon'] || 0),
                            tiktokRevenue: parseFloat(row['TikTok Revenue'] || row.tiktokRevenue || row['TikTok'] || 0),
                            dtcRevenue: parseFloat(row['DTC Revenue'] || row.dtcRevenue || row['DTC'] || 0),
                            amazonSpend: parseFloat(row['Amazon Ads'] || row.amazonSpend || row['Amazon Spend'] || 0),
                            tiktokSpend: parseFloat(row['TikTok Ads'] || row.tiktokSpend || row['TikTok Spend'] || 0),
                            googleSpend: parseFloat(row['Google Ads'] || row.googleSpend || row['Google Spend'] || 0),
                            metaSpend: parseFloat(row['Meta Ads'] || row.metaSpend || row['Meta Spend'] || 0),
                          };
                        }).filter((row: any) => !isNaN(row.date.getTime()));
                        
                        setChannelData(processedData.sort((a: any, b: any) => a.date - b.date));
                        setUploadStatus(prev => ({ ...prev, channel: true }));
                      } else {
                        // Process goals data
                        const processedGoals = results.data.map((row: any) => ({
                          month: row.Month || row.month,
                          revenueGoal: parseFloat(row['Revenue Goal'] || row.revenueGoal || row['Revenue'] || 0),
                          marketingBudget: parseFloat(row['Marketing Budget'] || row.marketingBudget || row['Budget'] || 0),
                        })).filter((row: any) => row.month);
                        
                        setGoalsData(processedGoals);
                        setUploadStatus(prev => ({ ...prev, goals: true }));
                      }
                    },
                    error: (error) => {
                      console.error('CSV parsing error:', error);
                      alert(`Error parsing CSV: ${error.message}`);
                    }
                  });
                };
  // Aggregate data based on time view
  const aggregatedData = useMemo(() => {
    if (channelData.length === 0) return [];

    const getWeekNumber = (date: Date) => {
      const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
      const dayNum = d.getUTCDay() || 7;
      d.setUTCDate(d.getUTCDate() + 4 - dayNum);
      const yearStart = new Date(Date.UTC(d.getFullYear(), 0, 1));
      const weekNo = Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
      return `${d.getFullYear()}-W${weekNo.toString().padStart(2, '0')}`;
    };

    const getMonthKey = (date: Date) => {
      return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
    };

    if (timeView === 'daily') {
      return channelData.map(day => ({
        period: day.date.toISOString().split('T')[0],
        date: day.date,
        amazonRevenue: day.amazonRevenue,
        tiktokRevenue: day.tiktokRevenue,
        dtcRevenue: day.dtcRevenue,
        totalRevenue: day.amazonRevenue + day.tiktokRevenue + day.dtcRevenue,
        amazonSpend: day.amazonSpend,
        tiktokSpend: day.tiktokSpend,
        googleSpend: day.googleSpend,
        metaSpend: day.metaSpend,
        totalSpend: day.amazonSpend + day.tiktokSpend + day.googleSpend + day.metaSpend,
      }));
    }

    // Group by week or month
    const grouped = {};
    channelData.forEach(day => {
      const key = timeView === 'weekly' ? getWeekNumber(day.date) : getMonthKey(day.date);
      
      if (!grouped[key]) {
        grouped[key] = {
          period: key,
          amazonRevenue: 0,
          tiktokRevenue: 0,
          dtcRevenue: 0,
          amazonSpend: 0,
          tiktokSpend: 0,
          googleSpend: 0,
          metaSpend: 0,
          dates: []
        };
      }
      
      grouped[key].amazonRevenue += day.amazonRevenue;
      grouped[key].tiktokRevenue += day.tiktokRevenue;
      grouped[key].dtcRevenue += day.dtcRevenue;
      grouped[key].amazonSpend += day.amazonSpend;
      grouped[key].tiktokSpend += day.tiktokSpend;
      grouped[key].googleSpend += day.googleSpend;
      grouped[key].metaSpend += day.metaSpend;
      grouped[key].dates.push(day.date);
    });

    return Object.values(grouped).map((group: any) => ({
      ...group,
      totalRevenue: group.amazonRevenue + group.tiktokRevenue + group.dtcRevenue,
      totalSpend: group.amazonSpend + group.tiktokSpend + group.googleSpend + group.metaSpend,
      date: group.dates[0]
    })).sort((a: any, b: any) => a.period.localeCompare(b.period));
  }, [channelData, timeView]);

 // Calculate metrics with goals
const metricsWithGoals = useMemo(() => {
  if (aggregatedData.length === 0) return aggregatedData;

  return aggregatedData.map(row => {
    const monthKey = typeof row.date === 'string' 
      ? row.date.substring(0, 7) 
      : `${row.date.getFullYear()}-${(row.date.getMonth() + 1).toString().padStart(2, '0')}`;
    
    const goal = goalsData.find(g => g.month === monthKey);
    
    // Calculate prorated goals based on time view
    let proratedRevenueGoal = 0;
    let proratedMarketingBudget = 0;
    
    if (goal) {
      if (timeView === 'monthly') {
        // Full month - use original goals
        proratedRevenueGoal = goal.revenueGoal;
        proratedMarketingBudget = goal.marketingBudget;
      } else if (timeView === 'weekly') {
        // Weekly - divide monthly goal by ~4.33 weeks per month
        proratedRevenueGoal = goal.revenueGoal / 4.33;
        proratedMarketingBudget = goal.marketingBudget / 4.33;
      } else {
        // Daily - divide by days in that month
        const monthDate = new Date(monthKey + '-01');
        const daysInMonth = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0).getDate();
        proratedRevenueGoal = goal.revenueGoal / daysInMonth;
        proratedMarketingBudget = goal.marketingBudget / daysInMonth;
      }
    }
    
    return {
      ...row,
      mer: row.totalSpend > 0 ? row.totalRevenue / row.totalSpend : 0,
      tacos: row.totalRevenue > 0 ? (row.totalSpend / row.totalRevenue) * 100 : 0,
      revenueGoal: proratedRevenueGoal,
      marketingBudget: proratedMarketingBudget,
      revenueDelta: proratedRevenueGoal > 0 ? row.totalRevenue - proratedRevenueGoal : 0,
      spendDelta: proratedMarketingBudget > 0 ? row.totalSpend - proratedMarketingBudget : 0,
      revenueDeltaPercent: proratedRevenueGoal > 0 
        ? ((row.totalRevenue - proratedRevenueGoal) / proratedRevenueGoal) * 100 
        : 0,
      spendDeltaPercent: proratedMarketingBudget > 0 
        ? ((row.totalSpend - proratedMarketingBudget) / proratedMarketingBudget) * 100 
        : 0,
    };
  });
}, [aggregatedData, goalsData, timeView]);

  // Calculate overall summary metrics
  const summaryMetrics = useMemo(() => {
    if (metricsWithGoals.length === 0) {
      return {
        totalRevenue: 0,
        totalSpend: 0,
        avgMER: 0,
        avgTACOS: 0
      };
    }

    const totalRevenue = metricsWithGoals.reduce((sum, row) => sum + row.totalRevenue, 0);
    const totalSpend = metricsWithGoals.reduce((sum, row) => sum + row.totalSpend, 0);

    return {
      totalRevenue,
      totalSpend,
      avgMER: totalSpend > 0 ? totalRevenue / totalSpend : 0,
      avgTACOS: totalRevenue > 0 ? (totalSpend / totalRevenue) * 100 : 0
    };
  }, [metricsWithGoals]);
 

    // Runrate analysis for completed and current months
            const runrateAnalysis = useMemo(() => {
              if (channelData.length === 0 || goalsData.length === 0) return { completed: [], current: null };

              const now = new Date();
              
              const monthlyData = {};
              channelData.forEach(day => {
                const monthKey = `${day.date.getFullYear()}-${(day.date.getMonth() + 1).toString().padStart(2, '0')}`;
                
                // Skip days where ALL values are NaN/null/undefined (empty template rows)
                const hasAnyValue = ![
                  day.amazonRevenue, 
                  day.tiktokRevenue, 
                  day.dtcRevenue,
                  day.amazonSpend, 
                  day.tiktokSpend, 
                  day.googleSpend, 
                  day.metaSpend
                ].every(val => val === null || val === undefined || isNaN(val));
                
                if (!hasAnyValue) return; // Skip empty template rows
                
                if (!monthlyData[monthKey]) {
                  monthlyData[monthKey] = {
                    month: monthKey,
                    totalRevenue: 0,
                    totalSpend: 0,
                    dates: []
                  };
                }
                
                monthlyData[monthKey].totalRevenue += day.amazonRevenue + day.tiktokRevenue + day.dtcRevenue;
                monthlyData[monthKey].totalSpend += day.amazonSpend + day.tiktokSpend + day.googleSpend + day.metaSpend;
                monthlyData[monthKey].dates.push(day.date);
              });

              // Calculate unique days for each month
              Object.keys(monthlyData).forEach(monthKey => {
                const uniqueDates = new Set(
                  monthlyData[monthKey].dates.map(d => d.toISOString().split('T')[0])
                );
                monthlyData[monthKey].days = uniqueDates.size;
              });

              // Find the most recent month in the dataset
              const sortedMonths = Object.keys(monthlyData).sort();
              const mostRecentMonthKey = sortedMonths[sortedMonths.length - 1];
              const mostRecentMonthData = monthlyData[mostRecentMonthKey];
              
              // Check if the most recent month is incomplete
              const mostRecentMonthDate = new Date(mostRecentMonthKey + '-01');
              const daysInMostRecentMonth = new Date(
                mostRecentMonthDate.getFullYear(), 
                mostRecentMonthDate.getMonth() + 1, 
                0
              ).getDate();
              
              const isIncomplete = mostRecentMonthData.days < daysInMostRecentMonth;

              const completed = [];
              let current = null;

              Object.entries(monthlyData).forEach(([monthKey, data]: [string, any]) => {
                // Skip months with no data
                if (data.days === 0) return;
                
                // Skip future months
                const isFutureMonth = new Date(monthKey + '-01') > now;
                if (isFutureMonth) return;
                
                const goal = goalsData.find(g => g.month === monthKey);
                if (!goal) return;

                const isCurrentMonth = monthKey === mostRecentMonthKey && isIncomplete;
                const monthDate = new Date(monthKey + '-01');
                const daysInMonth = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0).getDate();

                if (isCurrentMonth) {
                  const avgDailyRevenue = data.totalRevenue / data.days;
                  const avgDailySpend = data.totalSpend / data.days;
                  
                  current = {
                    month: monthKey,
                    actualRevenue: data.totalRevenue,
                    actualSpend: data.totalSpend,
                    forecastedRevenue: avgDailyRevenue * daysInMonth,
                    forecastedSpend: avgDailySpend * daysInMonth,
                    revenueGoal: goal.revenueGoal,
                    marketingBudget: goal.marketingBudget,
                    daysTracked: data.days,
                    daysInMonth: daysInMonth,
                  };
                } else if (data.days >= 25) {
                  completed.push({
                    month: monthKey,
                    revenueGoal: goal.revenueGoal,
                    actualRevenue: data.totalRevenue,
                    revenueDelta: data.totalRevenue - goal.revenueGoal,
                    revenuePercent: ((data.totalRevenue - goal.revenueGoal) / goal.revenueGoal * 100),
                    marketingBudget: goal.marketingBudget,
                    actualSpend: data.totalSpend,
                    spendDelta: data.totalSpend - goal.marketingBudget,
                    spendPercent: ((data.totalSpend - goal.marketingBudget) / goal.marketingBudget * 100),
                  });
                }
              });

              return { completed: completed.sort((a, b) => a.month.localeCompare(b.month)), current };
            }, [channelData, goalsData]);
  // **Runrate analysis End


  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD', 
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatPercent = (value) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`;
  };

// Custom tooltip for charts
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="gradient-card border-primary/20 p-3 rounded shadow-premium">
        <p className="font-semibold text-foreground mb-2">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} style={{ color: entry.color }} className="text-sm">
            {entry.name}: {formatCurrency(entry.value)}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

return (
 <div className="min-h-screen gradient-hero p-6">
    <div className="max-w-7xl mx-auto">
      {/* Back Button */}
      <div className="mb-8">
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-premium mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>
      </div>
      
      {/* Header */}
<div className="mb-8">
  <div className="text-center">
    <div className="inline-flex items-center gap-2 mb-4">
      <div className="w-12 h-12 rounded-lg gradient-primary flex items-center justify-center">
        <LucideLineChart className="h-6 w-6 text-primary-foreground" />
      </div>
    </div>
    <h1 className="text-4xl font-bold mb-2">
      Multi-Channel Marketing Dashboard by SYNQ.
    </h1>
    <p className="text-muted-foreground">
      Track revenue, spend, and performance across all marketing channels. View your data on daily, weekly or monthly grain. Compare actuals vs goals. Check your monthly runrate to see an estimation where you'll land at the end of month.
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
            src="https://www.youtube.com/watch?v=S2reSZFNDGM"
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


  {/* File Upload Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="gradient-card border-primary/20 shadow-premium rounded-lg p-6">
          <div className="flex items-center mb-4">
            <Upload className="w-5 h-5 mr-2 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">Channel Performance Data</h2>
          </div>
          <p className="text-sm text-muted-foreground mb-3">
            Upload daily data with columns: Date, Amazon Revenue, TikTok Revenue, DTC Revenue, 
            Amazon Ads, TikTok Ads, Google Ads, Meta Ads
          </p>
          <input
            type="file"
            accept=".csv"
            onChange={(e) => e.target.files[0] && handleFileUpload('channel', e.target.files[0])}
            className="block w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer"
          />
          {uploadStatus.channel && (
            <p className="text-green-600 text-sm mt-2 flex items-center">
              <span className="mr-1">✓</span> 
              Data loaded successfully ({channelData.length} days)
            </p>
          )}
        </div>

        <div className="gradient-card border-primary/20 shadow-premium rounded-lg p-6">
          <div className="flex items-center mb-4">
            <Target className="w-5 h-5 mr-2 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">Monthly Goals</h2>
          </div>
          <p className="text-sm text-muted-foreground mb-3">
            Upload monthly goals with columns: Month (YYYY-MM), Revenue Goal, Marketing Budget (CSV Header must be month,revenue goal,marketing budget)
          </p>
          <input
            type="file"
            accept=".csv"
            onChange={(e) => e.target.files[0] && handleFileUpload('goals', e.target.files[0])}
            className="block w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer"
          />
          {uploadStatus.goals && (
            <p className="text-green-600 text-sm mt-2 flex items-center">
              <span className="mr-1">✓</span> 
              Goals loaded successfully ({goalsData.length} months)
            </p>
          )}
        </div>
      </div>

      {channelData.length > 0 && (
        <>
          

    {/* Key Metrics Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="gradient-card border-primary/20 shadow-premium rounded-lg p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-muted-foreground text-sm font-medium">Total Revenue</span>
                <DollarSign className="w-5 h-5 text-green-600" />
              </div>
              <p className="text-3xl font-bold text-foreground mb-1">
                {formatCurrency(summaryMetrics.totalRevenue)}
              </p>
              <p className="text-xs text-muted-foreground">
                Across all channels in {timeView} view
              </p>
            </div>

            <div className="gradient-card border-primary/20 shadow-premium rounded-lg p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-muted-foreground text-sm font-medium">Total Spend</span>
                <TrendingUp className="w-5 h-5 text-red-600" />
              </div>
              <p className="text-3xl font-bold text-foreground mb-1">
                {formatCurrency(summaryMetrics.totalSpend)}
              </p>
              <p className="text-xs text-muted-foreground">
                Marketing investment in {timeView} view
              </p>
            </div>

            <div className="gradient-card border-primary/20 shadow-premium rounded-lg p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-muted-foreground text-sm font-medium">MER</span>
                <TrendingUp className="w-5 h-5 text-primary" />
              </div>
              <p className="text-3xl font-bold text-foreground mb-1">
                {summaryMetrics.avgMER.toFixed(2)}x
              </p>
              <p className="text-xs text-muted-foreground">
                Marketing Efficiency Ratio
              </p>
            </div>

            <div className="gradient-card border-primary/20 shadow-premium rounded-lg p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-muted-foreground text-sm font-medium">TACOS</span>
                <Target className="w-5 h-5 text-primary" />
              </div>
              <p className="text-3xl font-bold text-foreground mb-1">
                {summaryMetrics.avgTACOS.toFixed(1)}%
              </p>
              <p className="text-xs text-muted-foreground">
                Total Ad Cost of Sale
              </p>
            </div>
          </div>

{/* Runrate Analysis Section */}
{runrateAnalysis.current && (
  <div className="gradient-card border-primary/20 shadow-premium rounded-lg p-6 mb-8">
    <h2 className="text-xl font-bold text-foreground mb-4">
      Current Month Runrate - {runrateAnalysis.current.month}
    </h2>
    
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div className="bg-background/50 rounded-lg p-4">
        <p className="text-xs text-muted-foreground mb-1">Actual Revenue (MTD)</p>
        <p className="text-2xl font-bold text-foreground">
          {formatCurrency(runrateAnalysis.current.actualRevenue)}
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          {runrateAnalysis.current.daysTracked} of {runrateAnalysis.current.daysInMonth} days
        </p>
      </div>
      
      <div className="bg-background/50 rounded-lg p-4">
        <p className="text-xs text-muted-foreground mb-1">Forecasted Revenue (EOM)</p>
        <p className="text-2xl font-bold text-foreground">
          {formatCurrency(runrateAnalysis.current.forecastedRevenue)}
        </p>
        <p className={`text-sm font-semibold mt-1 ${
          runrateAnalysis.current.forecastedRevenue >= runrateAnalysis.current.revenueGoal 
            ? 'text-green-600' : 'text-red-600'
        }`}>
          {formatPercent(
            ((runrateAnalysis.current.forecastedRevenue - runrateAnalysis.current.revenueGoal) / 
            runrateAnalysis.current.revenueGoal) * 100
          )} vs Goal
        </p>
      </div>
      
      <div className="bg-background/50 rounded-lg p-4">
        <p className="text-xs text-muted-foreground mb-1">Actual Spend (MTD)</p>
        <p className="text-2xl font-bold text-foreground">
          {formatCurrency(runrateAnalysis.current.actualSpend)}
        </p>
      </div>
      
      <div className="bg-background/50 rounded-lg p-4">
        <p className="text-xs text-muted-foreground mb-1">Forecasted Spend (EOM)</p>
        <p className="text-2xl font-bold text-foreground">
          {formatCurrency(runrateAnalysis.current.forecastedSpend)}
        </p>
        <p className={`text-sm font-semibold mt-1 ${
          runrateAnalysis.current.forecastedSpend <= runrateAnalysis.current.marketingBudget 
            ? 'text-green-600' : 'text-red-600'
        }`}>
          {formatPercent(
            ((runrateAnalysis.current.forecastedSpend - runrateAnalysis.current.marketingBudget) / 
            runrateAnalysis.current.marketingBudget) * 100
          )} vs Budget
        </p>
      </div>
    </div>
    
    <div className="bg-primary/5 rounded-lg p-4">
      <p className="text-sm text-muted-foreground">
        <strong>Runrate Projection:</strong> Based on {runrateAnalysis.current.daysTracked} days of data, 
        you're on track to {runrateAnalysis.current.forecastedRevenue >= runrateAnalysis.current.revenueGoal ? 'exceed' : 'miss'} your 
        revenue goal by {formatCurrency(Math.abs(runrateAnalysis.current.forecastedRevenue - runrateAnalysis.current.revenueGoal))}.
      </p>
    </div>
  </div>
)}

{/* Time View Selector */}
          <div className="gradient-card border-primary/20 shadow-premium rounded-lg p-4 mb-8">
            <div className="flex items-center gap-4 flex-wrap">
              <Calendar className="w-5 h-5 text-primary" />
              <span className="font-semibold text-foreground">View By:</span>
              <div className="flex gap-2">
                {['daily', 'weekly', 'monthly'].map(view => (
                  <button
                    key={view}
                    onClick={() => setTimeView(view)}
                    className={`px-4 py-2 rounded font-medium transition-premium ${
                      timeView === view
                        ? 'gradient-primary text-primary-foreground shadow-glow'
                        : 'bg-background/50 text-muted-foreground hover:bg-primary/10'
                    }`}
                  >
                    {view.charAt(0).toUpperCase() + view.slice(1)}
                  </button>
                ))}
              </div>
              <span className="text-sm text-muted-foreground ml-auto">
                Showing {metricsWithGoals.length} {timeView === 'daily' ? 'days' : timeView === 'weekly' ? 'weeks' : 'months'}
              </span>
            </div>
          </div>

{/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Revenue vs Goal Chart */}
            <div className="gradient-card border-primary/20 shadow-premium rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4 text-foreground">Revenue Performance</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={metricsWithGoals}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--primary) / 0.1)" />
                  <XAxis 
                    dataKey="period" 
                    fontSize={12} 
                    stroke="hsl(var(--muted-foreground))"
                    angle={timeView === 'daily' ? -45 : 0}
                    textAnchor={timeView === 'daily' ? 'end' : 'middle'}
                    height={timeView === 'daily' ? 60 : 30}
                  />
                  <YAxis 
                    fontSize={12} 
                    stroke="hsl(var(--muted-foreground))"
                    tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                  />
                  <Tooltip content={<CustomTooltip active={false} payload={[]} label="" />} />
                  <Legend wrapperStyle={{ fontSize: '14px' }} />
                  <Line 
                    type="monotone" 
                    dataKey="totalRevenue" 
                    stroke="#10b981" 
                    strokeWidth={3} 
                    name="Actual Revenue"
                    dot={{ fill: '#10b981', r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                  {goalsData.length > 0 && (
                    <Line 
                      type="monotone" 
                      dataKey="revenueGoal" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={2} 
                      strokeDasharray="5 5" 
                      name="Revenue Goal"
                      dot={false}
                    />
                  )}
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Spend vs Budget Chart */}
            <div className="gradient-card border-primary/20 shadow-premium rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4 text-foreground">Spend Performance</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={metricsWithGoals}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--primary) / 0.1)" />
                  <XAxis 
                    dataKey="period" 
                    fontSize={12} 
                    stroke="hsl(var(--muted-foreground))"
                    angle={timeView === 'daily' ? -45 : 0}
                    textAnchor={timeView === 'daily' ? 'end' : 'middle'}
                    height={timeView === 'daily' ? 60 : 30}
                  />
                  <YAxis 
                    fontSize={12} 
                    stroke="hsl(var(--muted-foreground))"
                    tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                  />
                  <Tooltip content={<CustomTooltip active={false} payload={[]} label="" />} />
                  <Legend wrapperStyle={{ fontSize: '14px' }} />
                  <Line 
                    type="monotone" 
                    dataKey="totalSpend" 
                    stroke="#ef4444" 
                    strokeWidth={3} 
                    name="Actual Spend"
                    dot={{ fill: '#ef4444', r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                  {goalsData.length > 0 && (
                    <Line 
                      type="monotone" 
                      dataKey="marketingBudget" 
                      stroke="#a855f7" 
                      strokeWidth={2} 
                      strokeDasharray="5 5" 
                      name="Budget"
                      dot={false}
                    />
                  )}
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Revenue Mix Chart */}
            <div className="gradient-card border-primary/20 shadow-premium rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4 text-foreground">Revenue Channel Mix</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={metricsWithGoals}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--primary) / 0.1)" />
                  <XAxis 
                    dataKey="period" 
                    fontSize={12} 
                    stroke="hsl(var(--muted-foreground))"
                    angle={timeView === 'daily' ? -45 : 0}
                    textAnchor={timeView === 'daily' ? 'end' : 'middle'}
                    height={timeView === 'daily' ? 60 : 30}
                  />
                  <YAxis 
                    fontSize={12} 
                    stroke="hsl(var(--muted-foreground))"
                    tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                  />
                  <Tooltip content={<CustomTooltip active={false} payload={[]} label="" />} cursor={{ fill: 'hsl(var(--primary) / 0.1)' }} />
                  <Legend wrapperStyle={{ fontSize: '14px' }} />

               <Bar dataKey="amazonRevenue" stackId="a" fill="#d78201ff" name="Amazon" />
<Bar dataKey="tiktokRevenue" stackId="a" fill="#6d399eff" name="TikTok" />
<Bar dataKey="dtcRevenue" stackId="a" fill="#0c825aff" name="DTC" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Spend Mix Chart */}
            <div className="gradient-card border-primary/20 shadow-premium rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4 text-foreground">Spend Channel Mix</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={metricsWithGoals}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--primary) / 0.1)" />
                  <XAxis 
                    dataKey="period" 
                    fontSize={12} 
                    stroke="hsl(var(--muted-foreground))"
                    angle={timeView === 'daily' ? -45 : 0}
                    textAnchor={timeView === 'daily' ? 'end' : 'middle'}
                    height={timeView === 'daily' ? 60 : 30}
                  />
                  <YAxis 
                    fontSize={12} 
                    stroke="hsl(var(--muted-foreground))"
                    tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                  />
                  <Tooltip content={<CustomTooltip active={false} payload={[]} label="" />} cursor={{ fill: 'hsl(var(--primary) / 0.1)' }} />
                  <Legend wrapperStyle={{ fontSize: '14px' }} />
                <Bar dataKey="amazonSpend" stackId="a" fill="#d78201ff" name="Amazon Ads" />
<Bar dataKey="tiktokSpend" stackId="a" fill="#6d399eff" name="TikTok Ads" />
<Bar dataKey="googleSpend" stackId="a" fill="#3B82F6" name="Google Ads" />
<Bar dataKey="metaSpend" stackId="a" fill="#0c825aff" name="Meta Ads" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Full Detailed Data Table */}
          <div className="gradient-card border-primary/20 shadow-premium rounded-lg overflow-hidden mb-8">
            <div className="p-6 border-b border-primary/20">
              <h2 className="text-xl font-bold text-foreground">Detailed Performance Data</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Complete breakdown of all channels and metrics
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-primary/20">
                <thead className="bg-background/50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase sticky left-0 bg-background/50">
                      Period
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase">
                      Amazon Rev
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase">
                      TikTok Rev
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase">
                      DTC Rev
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase font-bold">
                      Total Rev
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase">
                      Amazon Ads
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase">
                      TikTok Ads
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase">
                      Google Ads
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase">
                      Meta Ads
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase font-bold">
                      Total Spend
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase">
                      MER
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase">
                      TACOS
                    </th>
                    {goalsData.length > 0 && (
                      <>
                        <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase">
                          Rev Goal
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase">
                          Rev Δ %
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase">
                          Budget
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase">
                          Spend Δ %
                        </th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-primary/20">
                  {metricsWithGoals.map((row, idx) => (
                    <tr key={idx} className="hover:bg-primary/5 transition-colors">
                      <td className="px-4 py-3 text-sm font-medium text-foreground sticky left-0 bg-background/95">
                        {row.period}
                      </td>
                      <td className="px-4 py-3 text-sm text-right text-muted-foreground">
                        {formatCurrency(row.amazonRevenue)}
                      </td>
                      <td className="px-4 py-3 text-sm text-right text-muted-foreground">
                        {formatCurrency(row.tiktokRevenue)}
                      </td>
                      <td className="px-4 py-3 text-sm text-right text-muted-foreground">
                        {formatCurrency(row.dtcRevenue)}
                      </td>
                      <td className="px-4 py-3 text-sm text-right font-bold text-foreground bg-green-500/10">
                        {formatCurrency(row.totalRevenue)}
                      </td>
                      <td className="px-4 py-3 text-sm text-right text-muted-foreground">
                        {formatCurrency(row.amazonSpend)}
                      </td>
                      <td className="px-4 py-3 text-sm text-right text-muted-foreground">
                        {formatCurrency(row.tiktokSpend)}
                      </td>
                      <td className="px-4 py-3 text-sm text-right text-muted-foreground">
                        {formatCurrency(row.googleSpend)}
                      </td>
                      <td className="px-4 py-3 text-sm text-right text-muted-foreground">
                        {formatCurrency(row.metaSpend)}
                      </td>
                      <td className="px-4 py-3 text-sm text-right font-bold text-foreground bg-red-500/10">
                        {formatCurrency(row.totalSpend)}
                      </td>
                      <td className="px-4 py-3 text-sm text-right text-primary font-medium">
                        {row.mer.toFixed(2)}x
                      </td>
                      <td className="px-4 py-3 text-sm text-right text-primary font-medium">
                        {row.tacos.toFixed(1)}%
                      </td>
                      {goalsData.length > 0 && (
                        <>
                          <td className="px-4 py-3 text-sm text-right text-muted-foreground">
                            {row.revenueGoal > 0 ? formatCurrency(row.revenueGoal) : '-'}
                          </td>
                          <td className={`px-4 py-3 text-sm text-right font-semibold ${
                            row.revenueDelta >= 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {row.revenueGoal > 0 ? formatPercent(row.revenueDeltaPercent) : '-'}
                          </td>
                          <td className="px-4 py-3 text-sm text-right text-muted-foreground">
                            {row.marketingBudget > 0 ? formatCurrency(row.marketingBudget) : '-'}
                          </td>
                          <td className={`px-4 py-3 text-sm text-right font-semibold ${
                            row.spendDelta <= 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {row.marketingBudget > 0 ? formatPercent(row.spendDeltaPercent) : '-'}
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {channelData.length === 0 && (
        <div className="gradient-card border-primary/20 shadow-premium rounded-lg p-12 text-center">
          <Upload className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold text-foreground mb-2">
            Get Started
          </h3>
          <p className="text-muted-foreground">
            Upload your channel performance data and monthly goals to begin analyzing your marketing performance
          </p>
        </div>
      )}

      {/* How To Section with YouTube Video */}
      <section className="py-12">
        <div className="container mx-auto px-6">
          <Card className="gradient-card border-primary/20 shadow-premium max-w-5xl mx-auto">
            <CardHeader>
              <CardTitle className="text-2xl md:text-3xl text-center">
                How to Use the Multi-Channel Marketing Dashboard
              </CardTitle>
              <CardDescription className="text-center mt-2 text-base">
                Watch this video tutorial to learn how to upload your data and analyze your marketing performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="aspect-video w-full rounded-lg overflow-hidden bg-black/5">
                <iframe
                  width="100%"
                  height="100%"
                  src="https://www.youtube.com/embed/S2reSZFNDGM"
                  title="Multi-Channel Marketing Dashboard Tutorial"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="w-full h-full"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12 pb-20">
        <div className="container mx-auto px-6">
          <Card className="gradient-card border-primary/20 shadow-premium max-w-5xl mx-auto">
            <CardHeader>
              <CardTitle className="text-2xl md:text-3xl text-center">
                Frequently Asked Questions
              </CardTitle>
              <CardDescription className="text-center mt-2 text-base">
                Everything you need to know about the Multi-Channel Marketing Dashboard
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger className="text-left">
                    What is the Multi-Channel Marketing Dashboard?
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text-muted-foreground leading-relaxed">
                      The Multi-Channel Marketing Dashboard is a comprehensive analytics tool designed to help e-commerce businesses track and analyze their marketing performance across multiple channels in one unified view. It consolidates data from Amazon, TikTok, DTC stores, and various advertising platforms (Amazon Ads, TikTok Ads, Google Ads, Meta Ads) to give you a complete picture of your marketing ROI. Upload your daily performance data and monthly goals to visualize key metrics like revenue, spend, MER (Marketing Efficiency Ratio), and TACOS (Total Advertising Cost of Sale) with flexible daily, weekly, and monthly views.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-2">
                  <AccordionTrigger className="text-left">
                    What data do I need to upload?
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text-muted-foreground leading-relaxed mb-3">
                      You need to upload two CSV files to use the dashboard effectively:
                    </p>
                    <p className="text-muted-foreground leading-relaxed mb-2">
                      <strong>1. Channel Performance Data:</strong> A daily CSV file with columns for Date, Amazon Revenue, TikTok Revenue, DTC Revenue, Amazon Ads (spend), TikTok Ads, Google Ads, and Meta Ads. This file should contain your actual daily performance metrics from each channel.
                    </p>
                    <p className="text-muted-foreground leading-relaxed">
                      <strong>2. Monthly Goals (Optional):</strong> A CSV file with columns for Month, Revenue Goal, and Marketing Budget. This allows you to track your actual performance against your targets and see variance percentages in real-time.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-3">
                  <AccordionTrigger className="text-left">
                    What is MER and why does it matter?
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text-muted-foreground leading-relaxed mb-3">
                      MER (Marketing Efficiency Ratio) is a crucial metric that shows how much revenue you generate for every dollar spent on marketing. It's calculated as Total Revenue ÷ Total Marketing Spend. For example, an MER of 3.5x means you're generating $3.50 in revenue for every $1 spent on ads.
                    </p>
                    <p className="text-muted-foreground leading-relaxed">
                      Unlike ROAS (Return on Ad Spend), which only considers ad platform metrics, MER gives you a holistic view of all your marketing efforts across channels. A good MER varies by industry and business model, but generally, e-commerce brands should aim for 3x-5x or higher. Our dashboard calculates MER automatically and shows you trends over time, helping you identify which periods and channel mixes deliver the best efficiency.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-4">
                  <AccordionTrigger className="text-left">
                    What is TACOS and how is it different from ACOS?
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text-muted-foreground leading-relaxed mb-3">
                      TACOS (Total Advertising Cost of Sale) is calculated as Total Ad Spend ÷ Total Revenue × 100. It shows what percentage of your total revenue goes toward advertising costs. For example, a 20% TACOS means 20 cents of every dollar in revenue is spent on ads.
                    </p>
                    <p className="text-muted-foreground leading-relaxed">
                      While ACOS (Advertising Cost of Sale) only considers sales directly attributed to ads on a single platform like Amazon, TACOS looks at all revenue (including organic sales) compared to all ad spend across channels. This gives you a more accurate picture of your overall advertising efficiency. Lower TACOS is generally better, as it means you're spending less on ads relative to total revenue. Our dashboard tracks TACOS across all your channels, helping you maintain profitable advertising ratios.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-5">
                  <AccordionTrigger className="text-left">
                    How do the time views (Daily/Weekly/Monthly) work?
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text-muted-foreground leading-relaxed mb-3">
                      The dashboard offers three time aggregation views to help you analyze your data at different levels:
                    </p>
                    <p className="text-muted-foreground leading-relaxed mb-2">
                      <strong>Daily View:</strong> Shows your raw daily data exactly as uploaded, perfect for spotting day-to-day trends and anomalies.
                    </p>
                    <p className="text-muted-foreground leading-relaxed mb-2">
                      <strong>Weekly View:</strong> Aggregates data by week (starting Monday), smoothing out daily fluctuations to reveal weekly patterns and trends.
                    </p>
                    <p className="text-muted-foreground leading-relaxed">
                      <strong>Monthly View:</strong> Consolidates data by calendar month, ideal for comparing against monthly goals and tracking longer-term performance trends. This view also shows runrate projections based on current performance.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-6">
                  <AccordionTrigger className="text-left">
                    What is the runrate projection?
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text-muted-foreground leading-relaxed">
                      The runrate projection estimates your end-of-month performance based on your current daily average. For example, if you're 15 days into the month with $45,000 in revenue, your daily average is $3,000. If the month has 30 days, the runrate projects $90,000 total revenue ($3,000 × 30 days). This helps you forecast whether you'll hit your monthly goals based on current performance, allowing you to make mid-month adjustments to your marketing strategy if needed. The dashboard shows runrate projections for both revenue and spend in the monthly view.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-7">
                  <AccordionTrigger className="text-left">
                    Can I use this dashboard if I only sell on one channel?
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text-muted-foreground leading-relaxed">
                      Yes, absolutely! While the dashboard is designed to handle multi-channel data, it works perfectly well for single-channel businesses too. If you only sell on Amazon, for example, just enter your Amazon revenue and leave the other channel columns at zero (or omit them entirely). The same applies to ad spend - if you only run Amazon Ads, just include that data and leave the others blank. The dashboard will still calculate your MER, TACOS, and all other metrics accurately, and you'll benefit from the time-based views, goal tracking, and performance analysis features.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-8">
                  <AccordionTrigger className="text-left">
                    How do I interpret the Revenue vs Goal chart?
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text-muted-foreground leading-relaxed mb-3">
                      The Revenue vs Goal chart (visible when you upload monthly goals) shows your actual revenue performance compared to your targets. The bars represent your actual revenue by period, while the line shows your goal. This visual makes it instantly clear whether you're ahead or behind pace.
                    </p>
                    <p className="text-muted-foreground leading-relaxed">
                      In the detailed data table below the charts, you'll also see the exact percentage variance from goal. Green percentages indicate you're exceeding your goal, while red shows you're below target. Use this information to adjust your marketing spend and strategy mid-month or to better forecast future goals based on realistic performance patterns.
                    </p>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  </div>
);
};

export default MarketingDashboard;