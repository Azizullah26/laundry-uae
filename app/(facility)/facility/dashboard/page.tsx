'use client'

import { motion } from 'framer-motion'
import { Package, DollarSign, Star, Clock, AlertTriangle, CheckCircle, ArrowRight } from 'lucide-react'
import { MetricCard } from '@/components/shared/metric-card'
import { StatusBadge, TierBadge } from '@/components/shared/status-badge'
import { mockOrders, mockFacilities } from '@/lib/mock-data'
import Link from 'next/link'
import { cn } from '@/lib/utils'

export default function FacilityDashboardPage() {
  const facility = mockFacilities[0] // Al Barsha Express
  const facilityOrders = mockOrders.filter(o => o.facilityId === facility.id)
  
  const incomingOrders = facilityOrders.filter(o => ['pending', 'confirmed', 'assigned', 'collected'].includes(o.status))
  const processingOrders = facilityOrders.filter(o => o.status === 'processing')
  const readyOrders = facilityOrders.filter(o => o.status === 'ready')
  const issueOrders = facilityOrders.filter(o => o.status === 'issue')

  const alerts = [
    { type: 'warning', message: 'Order #LK-2831 — SLA breach in 23 minutes' },
    { type: 'info', message: 'New order assigned: #LK-2863 — pickup in 45 min' },
    { type: 'success', message: 'Payout of AED 890 processed successfully' },
    { type: 'info', message: 'Your PPI updated: 91 (+2 points)' }
  ]

  return (
    <div className="space-y-6">
      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Today's Orders"
          value={facility.ordersToday}
          subtitle={`${facility.completedToday} completed`}
          icon={<Package className="h-5 w-5" />}
        />
        <MetricCard
          title="Today's Revenue"
          value={`AED ${facility.revenueToday.toLocaleString()}`}
          trend={{ value: '15% vs yesterday', direction: 'up' }}
          icon={<DollarSign className="h-5 w-5" />}
        />
        <MetricCard
          title="PPI Score"
          value={facility.ppiScore}
          subtitle={facility.tier}
          icon={<Star className="h-5 w-5" />}
        />
        <MetricCard
          title="Avg Processing"
          value={`${facility.avgProcessingTime}h`}
          subtitle="Target: < 3h"
          icon={<Clock className="h-5 w-5" />}
        />
      </div>

      {/* PPI Score Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 rounded-xl bg-card border border-border"
      >
        <div className="flex flex-col lg:flex-row lg:items-center gap-6">
          {/* Circular Gauge */}
          <div className="relative w-32 h-32 mx-auto lg:mx-0 flex-shrink-0">
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
              <span className="text-3xl font-bold">{facility.ppiScore}</span>
              <span className="text-xs text-muted-foreground">/100</span>
            </div>
          </div>

          <div className="flex-1 text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start gap-2 mb-2">
              <TierBadge tier={facility.tier} />
            </div>
            <p className="text-sm text-muted-foreground">
              City Rank: #{facility.cityRank} of {facility.totalFacilities} facilities in Dubai
            </p>

            {/* PPI Breakdown */}
            <div className="mt-4 space-y-2">
              {[
                { label: 'On-time Processing', value: facility.ppiBreakdown.onTimeProcessing, max: 25 },
                { label: 'Quality Score', value: facility.ppiBreakdown.qualityScore, max: 20 },
                { label: 'Protocol Compliance', value: facility.ppiBreakdown.protocolCompliance, max: 15 },
                { label: 'Low Complaints', value: facility.ppiBreakdown.lowComplaints, max: 10 },
                { label: 'SLA Adherence', value: facility.ppiBreakdown.slaAdherence, max: 30 }
              ].map((metric) => (
                <div key={metric.label} className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground w-32 text-right">{metric.label}</span>
                  <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary rounded-full"
                      style={{ width: `${(metric.value / metric.max) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs font-mono w-12">{metric.value}/{metric.max}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Active Orders Kanban */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Active Orders</h2>
          <Link href="/facility/orders" className="text-sm text-primary hover:underline flex items-center gap-1">
            View All <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Incoming */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-blue-500" />
              <span className="font-medium text-sm">Incoming</span>
              <span className="text-xs text-muted-foreground">({incomingOrders.length})</span>
            </div>
            {incomingOrders.slice(0, 2).map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>

          {/* Processing */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-amber-500" />
              <span className="font-medium text-sm">Processing</span>
              <span className="text-xs text-muted-foreground">({processingOrders.length})</span>
            </div>
            {processingOrders.slice(0, 2).map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>

          {/* Ready */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-green-500" />
              <span className="font-medium text-sm">Ready</span>
              <span className="text-xs text-muted-foreground">({readyOrders.length})</span>
            </div>
            {readyOrders.slice(0, 2).map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>

          {/* Issues */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-red-500" />
              <span className="font-medium text-sm">Issues</span>
              <span className="text-xs text-muted-foreground">({issueOrders.length})</span>
            </div>
            {issueOrders.slice(0, 2).map((order) => (
              <OrderCard key={order.id} order={order} isIssue />
            ))}
          </div>
        </div>
      </div>

      {/* Alerts Panel */}
      <div className="lg:hidden space-y-2">
        <h2 className="text-lg font-semibold">Alerts</h2>
        {alerts.map((alert, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={cn(
              'p-3 rounded-lg text-sm flex items-start gap-2',
              alert.type === 'warning' && 'bg-amber-50 text-amber-800 border border-amber-200',
              alert.type === 'success' && 'bg-green-50 text-green-800 border border-green-200',
              alert.type === 'info' && 'bg-blue-50 text-blue-800 border border-blue-200'
            )}
          >
            {alert.type === 'warning' && <AlertTriangle className="h-4 w-4 flex-shrink-0 mt-0.5" />}
            {alert.type === 'success' && <CheckCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />}
            {alert.type === 'info' && <Package className="h-4 w-4 flex-shrink-0 mt-0.5" />}
            {alert.message}
          </motion.div>
        ))}
      </div>
    </div>
  )
}

function OrderCard({ order, isIssue }: { order: typeof mockOrders[0]; isIssue?: boolean }) {
  const elapsedMinutes = Math.floor((Date.now() - new Date(order.updatedAt).getTime()) / 60000)
  
  return (
    <Link href={`/facility/orders/${order.id}`}>
      <div className={cn(
        'p-3 rounded-lg bg-card border transition-colors hover:border-primary/50',
        isIssue ? 'border-red-300 animate-sla-shake' : 'border-border'
      )}>
        <div className="flex items-center justify-between mb-2">
          <span className="font-mono text-sm font-medium">#{order.id}</span>
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {elapsedMinutes}m
          </span>
        </div>
        <p className="text-xs text-muted-foreground truncate">
          {order.items.map(i => `${i.quantity} ${i.name}`).join(', ')}
        </p>
        <StatusBadge status={order.status} className="mt-2" />
      </div>
    </Link>
  )
}
