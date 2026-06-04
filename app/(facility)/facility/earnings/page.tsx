'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { DollarSign, Calendar, Download, CreditCard, TrendingUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { MetricCard } from '@/components/shared/metric-card'
import { mockFacilities, mockOrders } from '@/lib/mock-data'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { cn } from '@/lib/utils'

type Period = 'today' | 'week' | 'month' | 'all'

export default function FacilityEarningsPage() {
  const facility = mockFacilities[0]
  const [period, setPeriod] = useState<Period>('month')

  const facilityOrders = mockOrders.filter(o => o.facilityId === facility.id && o.status === 'delivered')

  // Mock revenue data
  const revenueData = [
    { day: 'Mon', revenue: 420 },
    { day: 'Tue', revenue: 580 },
    { day: 'Wed', revenue: 490 },
    { day: 'Thu', revenue: 720 },
    { day: 'Fri', revenue: 890 },
    { day: 'Sat', revenue: 650 },
    { day: 'Sun', revenue: 380 }
  ]

  const transactions = [
    { date: 'May 18, 2024', orderId: 'LK-2819', gross: 105, platformFee: 21, net: 84 },
    { date: 'May 17, 2024', orderId: 'LK-2815', gross: 185, platformFee: 37, net: 148 },
    { date: 'May 17, 2024', orderId: 'LK-2810', gross: 90, platformFee: 18, net: 72 },
    { date: 'May 16, 2024', orderId: 'LK-2805', gross: 200, platformFee: 40, net: 160 },
    { date: 'May 16, 2024', orderId: 'LK-2798', gross: 75, platformFee: 15, net: 60 }
  ]

  const periods: { value: Period; label: string }[] = [
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'all', label: 'All Time' }
  ]

  return (
    <div className="space-y-6">
      {/* Period Selector */}
      <div className="flex gap-2">
        {periods.map((p) => (
          <button
            key={p.value}
            onClick={() => setPeriod(p.value)}
            className={cn(
              'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
              period === p.value
                ? 'bg-primary text-primary-foreground'
                : 'bg-card border border-border hover:border-primary/50'
            )}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Revenue"
          value="AED 8,450"
          trend={{ value: '12% vs last month', direction: 'up' }}
          icon={<DollarSign className="h-5 w-5" />}
        />
        <MetricCard
          title="Platform Fee"
          value="AED 1,690"
          subtitle="20% commission"
          icon={<CreditCard className="h-5 w-5" />}
        />
        <MetricCard
          title="Net Earnings"
          value="AED 6,760"
          trend={{ value: '8% vs last month', direction: 'up' }}
          icon={<TrendingUp className="h-5 w-5" />}
        />
        <MetricCard
          title="Orders Completed"
          value="42"
          subtitle="This month"
          icon={<Calendar className="h-5 w-5" />}
        />
      </div>

      {/* Payout Schedule */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 rounded-xl bg-gradient-to-r from-primary to-primary/80 text-white"
      >
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <p className="text-sm text-white/80">Next Payout</p>
            <p className="text-3xl font-bold">AED 2,840</p>
            <p className="text-sm text-white/80 mt-1">Scheduled for May 19 (T+1)</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm text-white/80">Bank Account</p>
              <p className="font-medium">Emirates NBD ••••4521</p>
            </div>
            <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center">
              <CreditCard className="h-5 w-5" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Revenue Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="p-6 rounded-xl bg-card border border-border"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-semibold">Revenue Overview</h2>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="day" tick={{ fontSize: 12 }} stroke="var(--muted-foreground)" />
              <YAxis tick={{ fontSize: 12 }} stroke="var(--muted-foreground)" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'var(--card)', 
                  border: '1px solid var(--border)',
                  borderRadius: '8px'
                }}
                formatter={(value: number) => [`AED ${value}`, 'Revenue']}
              />
              <Bar dataKey="revenue" fill="var(--primary)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Transaction History */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-card rounded-xl border border-border overflow-hidden"
      >
        <div className="px-6 py-4 border-b border-border flex items-center justify-between">
          <h2 className="font-semibold">Transaction History</h2>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Download Statement
          </Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground">Date</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground">Order ID</th>
                <th className="px-6 py-3 text-right text-sm font-medium text-muted-foreground">Gross</th>
                <th className="px-6 py-3 text-right text-sm font-medium text-muted-foreground">Platform Fee</th>
                <th className="px-6 py-3 text-right text-sm font-medium text-muted-foreground">Net</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {transactions.map((tx, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 text-sm">{tx.date}</td>
                  <td className="px-6 py-4 text-sm font-mono">#{tx.orderId}</td>
                  <td className="px-6 py-4 text-sm text-right font-mono">AED {tx.gross}</td>
                  <td className="px-6 py-4 text-sm text-right text-muted-foreground font-mono">-AED {tx.platformFee}</td>
                  <td className="px-6 py-4 text-sm text-right font-mono font-medium text-green-600">AED {tx.net}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-4 border-t border-border bg-muted/30">
          <p className="text-sm text-muted-foreground text-center">
            Current commission rate: <span className="font-medium text-foreground">{facility.commissionRate}% (Model 1)</span>
          </p>
        </div>
      </motion.div>
    </div>
  )
}
