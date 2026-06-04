'use client'

import { cn } from '@/lib/utils'
import { AlertTriangle, CheckCircle, Info, XCircle, X } from 'lucide-react'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

type AlertVariant = 'info' | 'success' | 'warning' | 'error'

interface AlertBannerProps {
  variant?: AlertVariant
  title?: string
  message: string
  dismissable?: boolean
  className?: string
  onDismiss?: () => void
}

const variantConfig: Record<AlertVariant, { icon: React.ElementType; className: string }> = {
  info: { icon: Info, className: 'bg-blue-50 border-blue-200 text-blue-800' },
  success: { icon: CheckCircle, className: 'bg-green-50 border-green-200 text-green-800' },
  warning: { icon: AlertTriangle, className: 'bg-amber-50 border-amber-200 text-amber-800' },
  error: { icon: XCircle, className: 'bg-red-50 border-red-200 text-red-800' }
}

export function AlertBanner({
  variant = 'info',
  title,
  message,
  dismissable = false,
  className,
  onDismiss
}: AlertBannerProps) {
  const [dismissed, setDismissed] = useState(false)
  const config = variantConfig[variant]
  const Icon = config.icon

  const handleDismiss = () => {
    setDismissed(true)
    onDismiss?.()
  }

  return (
    <AnimatePresence>
      {!dismissed && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className={cn(
            'flex items-start gap-3 rounded-lg border p-4',
            config.className,
            className
          )}
        >
          <Icon className="h-5 w-5 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            {title && <p className="font-semibold">{title}</p>}
            <p className="text-sm">{message}</p>
          </div>
          {dismissable && (
            <button
              onClick={handleDismiss}
              className="flex-shrink-0 rounded p-1 hover:bg-black/10 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
