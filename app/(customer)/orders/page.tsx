'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Filter, RotateCcw, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { StatusBadge } from '@/components/shared/status-badge'
import { mockOrders } from '@/lib/mock-data'
import Link from 'next/link'
import { cn } from '@/lib/utils'

type FilterType = 'all' | 'active' | 'completed' | 'cancelled'

export default function OrdersPage() {
  const [filter, setFilter] = useState<FilterType>('all')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredOrders = mockOrders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.serviceType.toLowerCase().includes(searchQuery.toLowerCase())
    
    if (filter === 'all') return matchesSearch
    if (filter === 'active') return matchesSearch && ['pending', 'confirmed', 'assigned', 'collected', 'processing', 'ready', 'out_for_delivery'].includes(order.status)
    if (filter === 'completed') return matchesSearch && order.status === 'delivered'
    if (filter === 'cancelled') return matchesSearch && order.status === 'cancelled'
    return matchesSearch
  })

  const filters: { value: FilterType; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'active', label: 'Active' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' }
  ]

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">Order History</h1>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search orders..."
          className="w-full h-11 pl-10 pr-4 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2 -mx-4 px-4">
        {filters.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={cn(
              'px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors',
              filter === f.value
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="text-center py-12">
          <div className="h-16 w-16 rounded-full bg-muted mx-auto flex items-center justify-center mb-4">
            <Filter className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="font-semibold mb-1">No orders found</h3>
          <p className="text-sm text-muted-foreground">Try adjusting your search or filter</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredOrders.map((order, index) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Link href={order.status === 'delivered' || order.status === 'cancelled' ? '#' : `/order/${order.id}/track`}>
                <div className="p-4 bg-card rounded-xl border border-border hover:border-primary/50 transition-colors">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono font-semibold">#{order.id}</span>
                        <StatusBadge status={order.status} />
                      </div>
                      <p className="text-sm text-muted-foreground truncate">
                        {order.items.map(i => `${i.quantity}x ${i.name}`).join(', ')}
                      </p>
                      <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                        <span>{order.serviceType}</span>
                        <span>•</span>
                        <span>{new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="font-semibold">AED {order.total}</p>
                      {order.status !== 'delivered' && order.status !== 'cancelled' && (
                        <ChevronRight className="h-5 w-5 text-muted-foreground ml-auto mt-2" />
                      )}
                    </div>
                  </div>

                  {/* Reorder Button for completed orders */}
                  {order.status === 'delivered' && (
                    <div className="mt-3 pt-3 border-t border-border">
                      <Button variant="outline" size="sm" className="w-full">
                        <RotateCcw className="mr-2 h-4 w-4" />
                        Reorder
                      </Button>
                    </div>
                  )}
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
