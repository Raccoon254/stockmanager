'use client'

import { useState, useEffect } from 'react'
import { useShop } from '@/contexts/ShopContext'
import { TrendingUp, TrendingDown, Minus, BarChart, Loader2 } from 'lucide-react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine
} from 'recharts'

export default function SalesTrendChart({ 
  title = "Sales Trend (Last 7 Days)",
  className = "",
  showTotal = true,
  height = 200 
}) {
  const { currentShop } = useShop()
  const [trendData, setTrendData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (currentShop) {
      fetchTrendData()
    }
  }, [currentShop])

  async function fetchTrendData() {
    try {
      setLoading(true)
      const response = await fetch(`/api/sales/trend?shopId=${currentShop.id}&days=7`)
      if (!response.ok) throw new Error('Failed to fetch trend data')
      
      const data = await response.json()
      setTrendData(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    })
  }

  const formatTooltipDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      month: 'short', 
      day: 'numeric' 
    })
  }

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-4 min-w-[200px]">
          <p className="text-gray-900 font-semibold mb-2 text-sm">
            {formatTooltipDate(label)}
          </p>
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-gray-600 text-sm">Sales Revenue:</span>
              <span className="text-blue-600 font-bold">
                KSH {payload[0].value.toLocaleString()}
              </span>
            </div>
            {payload[0].payload.count > 0 && (
              <div className="flex items-center justify-between">
                <span className="text-gray-600 text-sm">Transactions:</span>
                <span className="text-gray-900 font-medium">
                  {payload[0].payload.count}
                </span>
              </div>
            )}
            {payload[0].payload.count > 0 && (
              <div className="flex items-center justify-between">
                <span className="text-gray-600 text-sm">Avg per Sale:</span>
                <span className="text-gray-900 font-medium">
                  KSH {(payload[0].value / payload[0].payload.count).toLocaleString(undefined, {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0
                  })}
                </span>
              </div>
            )}
          </div>
        </div>
      )
    }
    return null
  }

  const formatNumber = (num) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(2)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(2)}K`
    return num.toLocaleString(undefined, {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    })
  }

  const calculateTrend = () => {
    if (!trendData?.dailyData || trendData.dailyData.length < 2) return { trend: 'neutral', percentage: 0 }
    
    const recent = trendData.dailyData.slice(-2)
    const [previous, current] = recent
    
    if (previous.total === 0 && current.total === 0) return { trend: 'neutral', percentage: 0 }
    if (previous.total === 0) return { trend: 'up', percentage: 100 }
    
    const percentage = ((current.total - previous.total) / previous.total) * 100
    
    if (percentage > 5) return { trend: 'up', percentage: Math.abs(percentage) }
    if (percentage < -5) return { trend: 'down', percentage: Math.abs(percentage) }
    return { trend: 'neutral', percentage: Math.abs(percentage) }
  }

  if (loading) {
    return (
      <div className={`bg-white/80 backdrop-blur-sm rounded-2xl shadow-md border border-white/20 p-6 ${className}`}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            <div className="animate-pulse mt-1">
              <div className="h-4 bg-gray-200 rounded w-32"></div>
            </div>
          </div>
          <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl">
            <BarChart className="h-5 w-5 text-white" />
          </div>
        </div>
        <div className="flex items-center justify-center" style={{ height: `${height}px` }}>
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-3" />
            <p className="text-gray-600 text-sm">Loading sales trend...</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4 mt-6 pt-4 border-t border-gray-100">
          {[1, 2, 3].map((i) => (
            <div key={i} className="text-center animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-16 mx-auto mb-1"></div>
              <div className="h-3 bg-gray-200 rounded w-20 mx-auto"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={`bg-white/80 backdrop-blur-sm rounded-2xl shadow-md border border-white/20 p-6 ${className}`}>
        <div className="flex items-center justify-center" style={{ height: `${height}px` }}>
          <div className="text-center">
            <BarChart className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-red-600 text-sm">Error loading trend data</p>
          </div>
        </div>
      </div>
    )
  }

  if (!trendData?.dailyData || trendData.dailyData.length === 0) {
    return (
      <div className={`bg-white/80 backdrop-blur-sm rounded-2xl shadow-md border border-white/20 p-6 ${className}`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        </div>
        <div className="flex items-center justify-center" style={{ height: `${height}px` }}>
          <div className="text-center">
            <BarChart className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-600 text-sm">No sales data available</p>
          </div>
        </div>
      </div>
    )
  }

  const trend = calculateTrend()

  const TrendIcon = trend.trend === 'up' ? TrendingUp : trend.trend === 'down' ? TrendingDown : Minus
  const trendColor = trend.trend === 'up' ? 'text-green-600' : trend.trend === 'down' ? 'text-red-600' : 'text-gray-600'

  return (
    <div className={`bg-white/80 backdrop-blur-sm rounded-2xl shadow-md border border-white/20 p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          {showTotal && (
            <div className="flex items-center space-x-3 mt-1">
              <span className="text-2xl font-bold text-gray-900">
                KSH {formatNumber(trendData.summary?.totalSales || 0)}
              </span>
              <div className={`flex items-center space-x-1 ${trendColor}`}>
                <TrendIcon className="h-4 w-4" />
                <span className="text-sm font-medium">
                  {trend.percentage.toFixed(1)}%
                </span>
              </div>
            </div>
          )}
        </div>
        <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl">
          <BarChart className="h-5 w-5 text-white" />
        </div>
      </div>

      {/* Chart */}
      <div style={{ height: `${height}px` }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={trendData.dailyData}
            margin={{
              top: 10,
              right: 30,
              left: 0,
              bottom: 20,
            }}
          >
            <defs>
              <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.05}/>
              </linearGradient>
            </defs>
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke="#e5e7eb" 
              strokeOpacity={0.5}
            />
            <XAxis 
              dataKey="date"
              tickFormatter={formatDate}
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#6b7280' }}
              dy={10}
            />
            <YAxis 
              tickFormatter={(value) => `${formatNumber(value)}`}
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#6b7280' }}
              width={60}
            />
            <Tooltip content={<CustomTooltip />} />
            {trendData.summary?.averageDaily > 0 && (
              <ReferenceLine 
                y={trendData.summary.averageDaily} 
                stroke="#f59e0b" 
                strokeDasharray="5 5"
                strokeOpacity={0.7}
                label={{ 
                  value: "Avg", 
                  position: "insideTopRight", 
                  fill: "#f59e0b",
                  fontSize: 11,
                  fontWeight: 600
                }}
              />
            )}
            <Area
              type="monotone"
              dataKey="total"
              stroke="#3b82f6"
              strokeWidth={3}
              fill="url(#salesGradient)"
              dot={{ 
                fill: '#3b82f6', 
                strokeWidth: 2, 
                stroke: '#ffffff', 
                r: 4,
                filter: 'drop-shadow(0px 2px 4px rgba(59, 130, 246, 0.2))'
              }}
              activeDot={{ 
                r: 7, 
                fill: '#3b82f6', 
                strokeWidth: 3, 
                stroke: '#ffffff',
                filter: 'drop-shadow(0px 4px 8px rgba(59, 130, 246, 0.3))'
              }}
              animationDuration={1500}
              animationEasing="ease-out"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-3 gap-4 mt-6 pt-4 border-t border-gray-100">
        <div className="text-center">
          <div className="text-lg font-semibold text-gray-900">
            {trendData.summary?.totalTransactions || 0}
          </div>
          <div className="text-xs text-gray-600">Total Sales</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold text-gray-900">
            KSH {formatNumber(trendData.summary?.averageDaily || 0)}
          </div>
          <div className="text-xs text-gray-600">Daily Average</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold text-gray-900">
            KSH {formatNumber(trendData.summary?.peakDay?.total || 0)}
          </div>
          <div className="text-xs text-gray-600">Peak Day</div>
        </div>
      </div>
    </div>
  )
}