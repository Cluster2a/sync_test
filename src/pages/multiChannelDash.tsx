import React, { useState, useMemo } from 'react';
import { Upload, TrendingUp, DollarSign, Target, Calendar } from 'lucide-react';
import Papa from 'papaparse';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const MarketingDashboard = () => {
  const [channelData, setChannelData] = useState([]);
  const [goalsData, setGoalsData] = useState([]);
  const [timeView, setTimeView] = useState('daily');
  const [uploadStatus, setUploadStatus] = useState({ channel: false, goals: false });

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
          const processedData = results.data.map(row => {
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
          }).filter(row => !isNaN(row.date.getTime()));
          
          setChannelData(processedData.sort((a, b) => a.date - b.date));
          setUploadStatus(prev => ({ ...prev, channel: true }));
        } else {
          // Process goals data
          const processedGoals = results.data.map(row => ({
            month: row.Month || row.month,
            revenueGoal: parseFloat(row['Revenue Goal'] || row.revenueGoal || row['Revenue'] || 0),
            marketingBudget: parseFloat(row['Marketing Budget'] || row.marketingBudget || row['Budget'] || 0),
          })).filter(row => row.month);
          
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

    const getWeekNumber = (date) => {
      const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
      const dayNum = d.getUTCDay() || 7;
      d.setUTCDate(d.getUTCDate() + 4 - dayNum);
      const yearStart = new Date(Date.UTC(d.getFullYear(), 0, 1));
      const weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
      return `${d.getFullYear()}-W${weekNo.toString().padStart(2, '0')}`;
    };

    const getMonthKey = (date) => {
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

    return Object.values(grouped).map(group => ({
      ...group,
      totalRevenue: group.amazonRevenue + group.tiktokRevenue + group.dtcRevenue,
      totalSpend: group.amazonSpend + group.tiktokSpend + group.googleSpend + group.metaSpend,
      date: group.dates[0]
    })).sort((a, b) => a.period.localeCompare(b.period));
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
    const currentMonthKey = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}`;
    
    const monthlyData = {};
    channelData.forEach(day => {
      const monthKey = `${day.date.getFullYear()}-${(day.date.getMonth() + 1).toString().padStart(2, '0')}`;
      
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = {
          month: monthKey,
          totalRevenue: 0,
          totalSpend: 0,
          days: 0,
          dates: []
        };
      }
      
      monthlyData[monthKey].totalRevenue += day.amazonRevenue + day.tiktokRevenue + day.dtcRevenue;
      monthlyData[monthKey].totalSpend += day.amazonSpend + day.tiktokSpend + day.googleSpend + day.metaSpend;
      monthlyData[monthKey].days += 1;
      monthlyData[monthKey].dates.push(day.date);
    });

    const completed = [];
    let current = null;

    Object.entries(monthlyData).forEach(([monthKey, data]) => {
      const goal = goalsData.find(g => g.month === monthKey);
      if (!goal) return;

      const isCurrentMonth = monthKey === currentMonthKey;
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
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Multi-Channel Marketing Dashboard by SYNQ.
        </h1>
        <p className="text-muted-foreground">
          Track revenue, spend, and performance across all marketing channels. View your data on daily, weekly or monthly grain. Compare actuals vs goals. Check your monthly runrate to see an estimation where you'll land at the end of month.
        </p>
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
                  <Tooltip content={<CustomTooltip />} />
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
                  <Tooltip content={<CustomTooltip />} />
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
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: 'hsl(var(--primary) / 0.1)' }} />
                  <Legend wrapperStyle={{ fontSize: '14px' }} />

               <Bar dataKey="amazonRevenue" stackId="a" fill="#FF9900" name="Amazon" />
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
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: 'hsl(var(--primary) / 0.1)' }} />
                  <Legend wrapperStyle={{ fontSize: '14px' }} />
                <Bar dataKey="amazonSpend" stackId="a" fill="#FF9900" name="Amazon Ads" />
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
    </div>
  </div>
);
};

export default MarketingDashboard;