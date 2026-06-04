'use client'

import { cn } from '@/lib/utils'
import type { OrderStatus, PPITier } from '@/lib/mock-data'

interface StatusBadgeProps {
  status: OrderStatus
  className?: string
  showPulse?: boolean
}

const statusConfig: Record<OrderStatus, { label: string; className: string }> = {
  pending: { label: 'Pending', className: 'bg-gray-100 text-gray-700 border-gray-300' },
  confirmed: { label: 'Confirmed', className: 'bg-blue-100 text-blue-700 border-blue-300' },
  assigned: { label: 'Assigned', className: 'bg-indigo-100 text-indigo-700 border-indigo-300' },
  collected: { label: 'Collected', className: 'bg-amber-100 text-amber-700 border-amber-300' },
  processing: { label: 'Processing', className: 'bg-amber-100 text-amber-700 border-amber-300' },
  ready: { label: 'Ready', className: 'bg-green-100 text-green-700 border-green-300' },
  out_for_delivery: { label: 'Out for Delivery', className: 'bg-green-100 text-green-700 border-green-300' },
  delivered: { label: 'Delivered', className: 'bg-emerald-100 text-emerald-700 border-emerald-300' },
  issue: { label: 'Issue', className: 'bg-red-100 text-red-700 border-red-300' },
  cancelled: { label: 'Cancelled', className: 'bg-gray-100 text-gray-500 border-gray-300' }
}

export function StatusBadge({ status, className, showPulse }: StatusBadgeProps) {
  const config = statusConfig[status]
  const isPulsing = showPulse && ['processing', 'out_for_delivery'].includes(status)

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border',
        config.className,
        isPulsing && 'animate-status-pulse',
        className
      )}
    >
      {isPulsing && (
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-current opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-current" />
        </span>
      )}
      {config.label}
    </span>
  )
}

interface TierBadgeProps {
  tier: PPITier
  className?: string
}

const tierConfig: Record<PPITier, { className: string }> = {
  Elite: { className: 'bg-yellow-500 text-yellow-950' },
  Strong: { className: 'bg-green-500 text-white' },
  Watchlist: { className: 'bg-amber-500 text-amber-950' },
  Risk: { className: 'bg-orange-500 text-white' },
  Frozen: { className: 'bg-red-500 text-white' }
}

export function TierBadge({ tier, className }: TierBadgeProps) {
  const config = tierConfig[tier]

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wide',
        config.className,
        className
      )}
    >
      {tier}
    </span>
  )
}
