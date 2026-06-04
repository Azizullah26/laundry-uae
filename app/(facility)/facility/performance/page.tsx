'use client'

import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, Target, Award, AlertTriangle, Lightbulb } from 'lucide-react'
import { MetricCard } from '@/components/shared/metric-card'
import { TierBadge } from '@/components/shared/status-badge'
import { mockFacilities } from '@/lib/mock-data'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'

export default function FacilityPerformancePage() {
  const facility = mockFacilities[0]

  // Mock PPI trend data
  const ppiTrend = [
    { date: 'May 1', score: 85 },
    { date: 'May 5', score: 87 },
    { date: 'May 10', score: 86 },
    { date: 'May 15', score: 89 },
    { date: 'May 18', score: 91 }
  ]

  const metrics = [
    { label: 'On-time Processing', thisMonth: facility.ppiBreakdown.onTimeProcessing, lastMonth: 20, target: 25 },
    { label: 'Quality Score', thisMonth: facility.ppiBreakdown.qualityScore, lastMonth: 17, target: 20 },
    { label: 'Protocol Compliance', thisMonth: facility.ppiBreakdown.protocolCompliance, lastMonth: 13, target: 15 },
    { label: 'Low Complaints', thisMonth: facility.ppiBreakdown.lowComplaints, lastMonth: 8, target: 10 },
    { label: 'SLA Adherence', thisMonth: facility.ppiBreakdown.slaAdherence, lastMonth: 22, target: 30 }
  ]

  const tips = [
    'Process orders within 2 hours of collection to improve on-time score',
    'Double-check items before marking ready to reduce quality issues',
    'Respond to customer queries within 5 minutes during business hours'
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Performance</h1>
          <p className="text-muted-foreground">Your PPI score and analytics</p>
        </div>
        <div className="flex items-center gap-3">
          <TierBadge tier={facility.tier} />
          <span className="text-sm text-muted-foreground">
            Rank #{facility.cityRank} of {facility.totalFacilities} in Dubai
          </span>
        </div>
      </div>

      {/* PPI Score Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 rounded-xl bg-card border border-border"
      >
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Score Display */}
          <div className="flex items-center gap-6">
            <div className="relative w-32 h-32 flex-shrink-0">
              <svg className="w-full h-full -rotate-90">
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="12"
                  className="text-muted/30"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="12"
                  strokeDasharray={`${(facility.ppiScore / 100) * 352} 352`}
                  className="text-primary"
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-bold">{facility.ppiScore}</span>
                <span className="text-xs text-muted-foreground">/100</span>
              </div>
            </div>
            <div>
              <h2 className="text-lg font-semibold mb-1">PPI Score</h2>
              <p className="text-sm text-muted-foreground mb-2">Partner Performance Index</p>
              <div className="flex items-center gap-2 text-green-600">
                <TrendingUp className="h-4 w-4" />
                <span className="text-sm font-medium">+6 points this month</span>
              </div>
            </div>
          </div>

          {/* Trend Chart */}
          <div className="flex-1 h-40">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={ppiTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="var(--muted-foreground)" />
                <YAxis domain={[70, 100]} tick={{ fontSize: 12 }} stroke="var(--muted-foreground)" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'var(--card)', 
                    border: '1px solid var(--border)',
                    borderRadius: '8px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="score" 
                  stroke="var(--primary)" 
                  strokeWidth={2}
                  dot={{ fill: 'var(--primary)' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </motion.div>

      {/* Metrics Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-card rounded-xl border border-border overflow-hidden"
      >
        <div className="px-6 py-4 border-b border-border">
          <h2 className="font-semibold">Component Breakdown</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground">Metric</th>
                <th className="px-6 py-3 text-center text-sm font-medium text-muted-foreground">This Month</th>
                <th className="px-6 py-3 text-center text-sm font-medium text-muted-foreground">Last Month</th>
                <th className="px-6 py-3 text-center text-sm font-medium text-muted-foreground">Target</th>
                <th className="px-6 py-3 text-center text-sm font-medium text-muted-foreground">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {metrics.map((metric) => {
                const change = metric.thisMonth - metric.lastMonth
                const isOnTarget = metric.thisMonth >= metric.target * 0.9
                return (
                  <tr key={metric.label}>
                    <td className="px-6 py-4 text-sm font-medium">{metric.label}</td>
                    <td className="px-6 py-4 text-center font-mono">{metric.thisMonth}</td>
                    <td className="px-6 py-4 text-center text-muted-foreground font-mono">{metric.lastMonth}</td>
                    <td className="px-6 py-4 text-center text-muted-foreground font-mono">{metric.target}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center gap-1 text-sm font-medium ${
                        change > 0 ? 'text-green-600' : change < 0 ? 'text-red-600' : 'text-muted-foreground'
                      }`}>
                        {change > 0 ? <TrendingUp className="h-3 w-3" /> : change < 0 ? <TrendingDown className="h-3 w-3" /> : null}
                        {change > 0 ? '+' : ''}{change}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Tips to Improve */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="p-6 rounded-xl bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20"
      >
        <div className="flex items-center gap-2 mb-4">
          <Lightbulb className="h-5 w-5 text-primary" />
          <h2 className="font-semibold">Tips to Improve Your Score</h2>
        </div>
        <ul className="space-y-2">
          {tips.map((tip, index) => (
            <li key={index} className="flex items-start gap-2 text-sm">
              <span className="text-primary font-bold">{index + 1}.</span>
              {tip}
            </li>
          ))}
        </ul>
      </motion.div>
    </div>
  )
}
