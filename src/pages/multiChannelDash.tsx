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
      
      return {
        ...row,
        mer: row.totalSpend > 0 ? row.totalRevenue / row.totalSpend : 0,
        tacos: row.totalRevenue > 0 ? (row.totalSpend / row.totalRevenue) * 100 : 0,
        revenueGoal: goal?.revenueGoal || 0,
        marketingBudget: goal?.marketingBudget || 0,
        revenueDelta: goal ? row.totalRevenue - goal.revenueGoal : 0,
        spendDelta: goal ? row.totalSpend - goal.marketingBudget : 0,
        revenueDeltaPercent: goal && goal.revenueGoal > 0 
          ? ((row.totalRevenue - goal.revenueGoal) / goal.revenueGoal) * 100 
          : 0,
        spendDeltaPercent: goal && goal.marketingBudget > 0 
          ? ((row.totalSpend - goal.marketingBudget) / goal.marketingBudget) * 100 
          : 0,
      };
    });
  }, [aggregatedData, goalsData]);

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
        <div className="bg-white p-3 border border-gray-200 rounded shadow-lg">
          <p className="font-semibold text-gray-900 mb-2">{label}</p>
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
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Multi-Channel Marketing Dashboard
          </h1>
          <p className="text-gray-600">
            Track revenue, spend, and performance across all marketing channels. View your data on daily, weekly or monthly grain. Compare actuals vs goals. Check your monthly runrate to see an estimation where you'll land at the end of month.
          </p>
        </div>

        {/* File Upload Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center mb-4">
              <Upload className="w-5 h-5 mr-2 text-blue-600" />
              <h2 className="text-lg font-semibold">Channel Performance Data</h2>
            </div>
            <p className="text-sm text-gray-600 mb-3">
              Upload daily data with columns: Date, Amazon Revenue, TikTok Revenue, DTC Revenue, 
              Amazon Ads, TikTok Ads, Google Ads, Meta Ads
            </p>
            <input
              type="file"
              accept=".csv"
              onChange={(e) => e.target.files[0] && handleFileUpload('channel', e.target.files[0])}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
            />
            {uploadStatus.channel && (
              <p className="text-green-600 text-sm mt-2 flex items-center">
                <span className="mr-1">✓</span> 
                Data loaded successfully ({channelData.length} days)
              </p>
            )}
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center mb-4">
              <Target className="w-5 h-5 mr-2 text-purple-600" />
              <h2 className="text-lg font-semibold">Monthly Goals</h2>
            </div>
            <p className="text-sm text-gray-600 mb-3">
              Upload monthly goals with columns: Month (YYYY-MM), Revenue Goal, Marketing Budget
            </p>
            <input
              type="file"
              accept=".csv"
              onChange={(e) => e.target.files[0] && handleFileUpload('goals', e.target.files[0])}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100 cursor-pointer"
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
            <div className="bg-white rounded-lg shadow p-4 mb-8">
              <div className="flex items-center gap-4 flex-wrap">
                <Calendar className="w-5 h-5 text-gray-600" />
                <span className="font-semibold text-gray-700">View By:</span>
                <div className="flex gap-2">
                  {['daily', 'weekly', 'monthly'].map(view => (
                    <button
                      key={view}
                      onClick={() => setTimeView(view)}
                      className={`px-4 py-2 rounded font-medium transition-colors ${
                        timeView === view
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {view.charAt(0).toUpperCase() + view.slice(1)}
                    </button>
                  ))}
                </div>
                <span className="text-sm text-gray-500 ml-auto">
                  Showing {metricsWithGoals.length} {timeView === 'daily' ? 'days' : timeView === 'weekly' ? 'weeks' : 'months'}
                </span>
              </div>
            </div>

            {/* Key Metrics Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600 text-sm font-medium">Total Revenue</span>
                  <DollarSign className="w-5 h-5 text-green-600" />
                </div>
                <p className="text-3xl font-bold text-gray-900 mb-1">
                  {formatCurrency(summaryMetrics.totalRevenue)}
                </p>
                <p className="text-xs text-gray-500">
                  Across all channels in {timeView} view
                </p>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600 text-sm font-medium">Total Spend</span>
                  <TrendingUp className="w-5 h-5 text-red-600" />
                </div>
                <p className="text-3xl font-bold text-gray-900 mb-1">
                  {formatCurrency(summaryMetrics.totalSpend)}
                </p>
                <p className="text-xs text-gray-500">
                  Marketing investment in {timeView} view
                </p>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600 text-sm font-medium">MER</span>
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                </div>
                <p className="text-3xl font-bold text-gray-900 mb-1">
                  {summaryMetrics.avgMER.toFixed(2)}x
                </p>
                <p className="text-xs text-gray-500">
                  Marketing Efficiency Ratio
                </p>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600 text-sm font-medium">TACOS</span>
                  <Target className="w-5 h-5 text-purple-600" />
                </div>
                <p className="text-3xl font-bold text-gray-900 mb-1">
                  {summaryMetrics.avgTACOS.toFixed(1)}%
                </p>
                <p className="text-xs text-gray-500">
                  Total Ad Cost of Sale
                </p>
              </div>
            </div>

        {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Revenue vs Goal Chart */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-900">Revenue Performance</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={metricsWithGoals}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis 
                      dataKey="period" 
                      fontSize={12} 
                      stroke="#6b7280"
                      angle={timeView === 'daily' ? -45 : 0}
                      textAnchor={timeView === 'daily' ? 'end' : 'middle'}
                      height={timeView === 'daily' ? 60 : 30}
                    />
                    <YAxis 
                      fontSize={12} 
                      stroke="#6b7280"
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
                        stroke="#3b82f6" 
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
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-900">Spend Performance</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={metricsWithGoals}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis 
                      dataKey="period" 
                      fontSize={12} 
                      stroke="#6b7280"
                      angle={timeView === 'daily' ? -45 : 0}
                      textAnchor={timeView === 'daily' ? 'end' : 'middle'}
                      height={timeView === 'daily' ? 60 : 30}
                    />
                    <YAxis 
                      fontSize={12} 
                      stroke="#6b7280"
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
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-900">Revenue Channel Mix</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={metricsWithGoals}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis 
                      dataKey="period" 
                      fontSize={12} 
                      stroke="#6b7280"
                      angle={timeView === 'daily' ? -45 : 0}
                      textAnchor={timeView === 'daily' ? 'end' : 'middle'}
                      height={timeView === 'daily' ? 60 : 30}
                    />
                    <YAxis 
                      fontSize={12} 
                      stroke="#6b7280"
                      tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ fontSize: '14px' }} />
                    <Bar dataKey="amazonRevenue" stackId="a" fill="#ff9900" name="Amazon" />
                    <Bar dataKey="tiktokRevenue" stackId="a" fill="#000000" name="TikTok" />
                    <Bar dataKey="dtcRevenue" stackId="a" fill="#10b981" name="DTC" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Spend Mix Chart */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-900">Spend Channel Mix</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={metricsWithGoals}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis 
                      dataKey="period" 
                      fontSize={12} 
                      stroke="#6b7280"
                      angle={timeView === 'daily' ? -45 : 0}
                      textAnchor={timeView === 'daily' ? 'end' : 'middle'}
                      height={timeView === 'daily' ? 60 : 30}
                    />
                    <YAxis 
                      fontSize={12} 
                      stroke="#6b7280"
                      tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ fontSize: '14px' }} />
                    <Bar dataKey="amazonSpend" stackId="a" fill="#ff9900" name="Amazon Ads" />
                    <Bar dataKey="tiktokSpend" stackId="a" fill="#000000" name="TikTok Ads" />
                    <Bar dataKey="googleSpend" stackId="a" fill="#4285f4" name="Google Ads" />
                    <Bar dataKey="metaSpend" stackId="a" fill="#1877f2" name="Meta Ads" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

               {/* Runrate Analysis Section */}
            {goalsData.length > 0 && (
              <div className="bg-white rounded-lg shadow p-6 mb-8">
                <h2 className="text-xl font-bold mb-6 text-gray-900">Runrate Analysis</h2>
                
                {/* Current Month Forecast */}
                {runrateAnalysis.current && (
                  <div className="mb-8 p-6 bg-blue-50 rounded-lg border border-blue-200">
                    <h3 className="text-lg font-semibold mb-4 text-blue-900">
                      Current Month Forecast ({runrateAnalysis.current.month})
                    </h3>
                    <p className="text-sm text-blue-700 mb-4">
                      Based on {runrateAnalysis.current.daysTracked} days of data (out of {runrateAnalysis.current.daysInMonth} days)
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-white p-4 rounded-lg">
                        <h4 className="font-semibold text-gray-900 mb-3">Revenue Forecast</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Actual (MTD):</span>
                            <span className="font-semibold">{formatCurrency(runrateAnalysis.current.actualRevenue)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Forecasted (EOM):</span>
                            <span className="font-semibold text-blue-700">{formatCurrency(runrateAnalysis.current.forecastedRevenue)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Goal:</span>
                            <span className="font-semibold">{formatCurrency(runrateAnalysis.current.revenueGoal)}</span>
                          </div>
                          <div className="flex justify-between pt-2 border-t">
                            <span className="text-gray-600">Projected vs Goal:</span>
                            <span className={`font-semibold ${runrateAnalysis.current.forecastedRevenue >= runrateAnalysis.current.revenueGoal ? 'text-green-600' : 'text-red-600'}`}>
                              {formatCurrency(runrateAnalysis.current.forecastedRevenue - runrateAnalysis.current.revenueGoal)}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-white p-4 rounded-lg">
                        <h4 className="font-semibold text-gray-900 mb-3">Spend Forecast</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Actual (MTD):</span>
                            <span className="font-semibold">{formatCurrency(runrateAnalysis.current.actualSpend)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Forecasted (EOM):</span>
                            <span className="font-semibold text-blue-700">{formatCurrency(runrateAnalysis.current.forecastedSpend)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Budget:</span>
                            <span className="font-semibold">{formatCurrency(runrateAnalysis.current.marketingBudget)}</span>
                          </div>
                          <div className="flex justify-between pt-2 border-t">
                            <span className="text-gray-600">Projected vs Budget:</span>
                            <span className={`font-semibold ${runrateAnalysis.current.forecastedSpend <= runrateAnalysis.current.marketingBudget ? 'text-green-600' : 'text-red-600'}`}>
                              {formatCurrency(runrateAnalysis.current.forecastedSpend - runrateAnalysis.current.marketingBudget)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Completed Months */}
                {runrateAnalysis.completed.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-4 text-gray-900">Completed Months</h3>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Month</th>
                            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Revenue Goal</th>
                            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actual Revenue</th>
                            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Δ Revenue</th>
                            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Δ %</th>
                            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Budget</th>
                            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actual Spend</th>
                            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Δ Spend</th>
                            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Δ %</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {runrateAnalysis.completed.map(month => (
                            <tr key={month.month} className="hover:bg-gray-50">
                              <td className="px-4 py-3 text-sm font-medium text-gray-900">{month.month}</td>
                              <td className="px-4 py-3 text-sm text-right text-gray-600">{formatCurrency(month.revenueGoal)}</td>
                              <td className="px-4 py-3 text-sm text-right font-semibold">{formatCurrency(month.actualRevenue)}</td>
                              <td className={`px-4 py-3 text-sm text-right font-semibold ${month.revenueDelta >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {formatCurrency(month.revenueDelta)}
                              </td>
                              <td className={`px-4 py-3 text-sm text-right font-semibold ${month.revenuePercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {formatPercent(month.revenuePercent)}
                              </td>
                              <td className="px-4 py-3 text-sm text-right text-gray-600">{formatCurrency(month.marketingBudget)}</td>
                              <td className="px-4 py-3 text-sm text-right font-semibold">{formatCurrency(month.actualSpend)}</td>
                              <td className={`px-4 py-3 text-sm text-right font-semibold ${month.spendDelta <= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {formatCurrency(month.spendDelta)}
                              </td>
                              <td className={`px-4 py-3 text-sm text-right font-semibold ${month.spendPercent <= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {formatPercent(month.spendPercent)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Full Detailed Data Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="p-6 border-b">
                <h2 className="text-xl font-bold text-gray-900">Detailed Performance Data</h2>
                <p className="text-sm text-gray-600 mt-1">
                  Complete breakdown of all channels and metrics
                </p>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase sticky left-0 bg-gray-50">
                        Period
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                        Amazon Rev
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                        TikTok Rev
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                        DTC Rev
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase font-bold">
                        Total Rev
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                        Amazon Ads
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                        TikTok Ads
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                        Google Ads
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                        Meta Ads
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase font-bold">
                        Total Spend
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                        MER
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                        TACOS
                      </th>
                      {goalsData.length > 0 && (
                        <>
                          <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                            Rev Goal
                          </th>
                          <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                            Rev Δ %
                          </th>
                          <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                            Budget
                          </th>
                          <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                            Spend Δ %
                          </th>
                        </>
                      )}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {metricsWithGoals.map((row, idx) => (
                      <tr key={idx} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm font-medium text-gray-900 sticky left-0 bg-white">
                          {row.period}
                        </td>
                        <td className="px-4 py-3 text-sm text-right text-gray-700">
                          {formatCurrency(row.amazonRevenue)}
                        </td>
                        <td className="px-4 py-3 text-sm text-right text-gray-700">
                          {formatCurrency(row.tiktokRevenue)}
                        </td>
                        <td className="px-4 py-3 text-sm text-right text-gray-700">
                          {formatCurrency(row.dtcRevenue)}
                        </td>
                        <td className="px-4 py-3 text-sm text-right font-bold text-gray-900 bg-green-50">
                          {formatCurrency(row.totalRevenue)}
                        </td>
                        <td className="px-4 py-3 text-sm text-right text-gray-700">
                          {formatCurrency(row.amazonSpend)}
                        </td>
                        <td className="px-4 py-3 text-sm text-right text-gray-700">
                          {formatCurrency(row.tiktokSpend)}
                        </td>
                        <td className="px-4 py-3 text-sm text-right text-gray-700">
                          {formatCurrency(row.googleSpend)}
                        </td>
                        <td className="px-4 py-3 text-sm text-right text-gray-700">
                          {formatCurrency(row.metaSpend)}
                        </td>
                        <td className="px-4 py-3 text-sm text-right font-bold text-gray-900 bg-red-50">
                          {formatCurrency(row.totalSpend)}
                        </td>
                        <td className="px-4 py-3 text-sm text-right text-blue-600 font-medium">
                          {row.mer.toFixed(2)}x
                        </td>
                        <td className="px-4 py-3 text-sm text-right text-purple-600 font-medium">
                          {row.tacos.toFixed(1)}%
                        </td>
                        {goalsData.length > 0 && (
                          <>
                            <td className="px-4 py-3 text-sm text-right text-gray-600">
                              {row.revenueGoal > 0 ? formatCurrency(row.revenueGoal) : '-'}
                            </td>
                            <td className={`px-4 py-3 text-sm text-right font-semibold ${
                              row.revenueDelta >= 0 ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {row.revenueGoal > 0 ? formatPercent(row.revenueDeltaPercent) : '-'}
                            </td>
                            <td className="px-4 py-3 text-sm text-right text-gray-600">
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
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <Upload className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Get Started
            </h3>
            <p className="text-gray-600">
              Upload your channel performance data and monthly goals to begin analyzing your marketing performance
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MarketingDashboard;