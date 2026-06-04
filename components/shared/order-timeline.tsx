'use client'

import { cn } from '@/lib/utils'
import { Check, Circle } from 'lucide-react'
import { motion } from 'framer-motion'

interface TimelineStep {
  id: string
  label: string
  timestamp?: string
  actor?: string
  status: 'completed' | 'in_progress' | 'upcoming'
}

interface OrderTimelineProps {
  steps: TimelineStep[]
  className?: string
}

export function OrderTimeline({ steps, className }: OrderTimelineProps) {
  return (
    <div className={cn('relative', className)}>
      {steps.map((step, index) => (
        <motion.div
          key={step.id}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className="relative flex gap-4 pb-6 last:pb-0"
        >
          {/* Line connector */}
          {index !== steps.length - 1 && (
            <div
              className={cn(
                'absolute left-[11px] top-6 h-full w-0.5',
                step.status === 'completed' ? 'bg-green-500' : 'bg-border'
              )}
            />
          )}

          {/* Status indicator */}
          <div className="relative z-10 flex-shrink-0">
            {step.status === 'completed' && (
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-500 text-white">
                <Check className="h-3.5 w-3.5" />
              </div>
            )}
            {step.status === 'in_progress' && (
              <div className="relative flex h-6 w-6 items-center justify-center">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-40" />
                <span className="relative flex h-4 w-4 rounded-full bg-primary" />
              </div>
            )}
            {step.status === 'upcoming' && (
              <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-muted-foreground/30 bg-background">
                <Circle className="h-2 w-2 text-muted-foreground/50" />
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 pt-0.5">
            <p
              className={cn(
                'text-sm font-medium',
                step.status === 'completed' && 'text-green-600',
                step.status === 'in_progress' && 'text-primary',
                step.status === 'upcoming' && 'text-muted-foreground'
              )}
            >
              {step.label}
            </p>
            {step.timestamp && (
              <p className="mt-0.5 text-xs text-muted-foreground">
                {step.timestamp}
                {step.actor && <span className="ml-1">• {step.actor}</span>}
              </p>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  )
}
