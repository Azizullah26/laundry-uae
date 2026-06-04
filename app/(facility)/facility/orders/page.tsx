'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Filter, Clock, ArrowUpDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { StatusBadge } from '@/components/shared/status-badge'
import { mockOrders, mockFacilities, type OrderStatus } from '@/lib/mock-data'
import Link from 'next/link'
import { cn } from '@/lib/utils'

type FilterType = 'all' | 'incoming' | 'processing' | 'ready' | 'completed' | 'issues'

export default function FacilityOrdersPage() {
  const facility = mockFacilities[0]
  const [filter, setFilter] = useState<FilterType>('all')
  const [searchQuery, setSearchQuery] = useState('')

  const facilityOrders = mockOrders.filter(o => o.facilityId === facility.id)

  const filteredOrders = facilityOrders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerArea.toLowerCase().includes(searchQuery.toLowerCase())
    
    if (filter === 'all') return matchesSearch
    if (filter === 'incoming') return matchesSearch && ['pending', 'confirmed', 'assigned', 'collected'].includes(order.status)
    if (filter === 'processing') return matchesSearch && order.status === 'processing'
    if (filter === 'ready') return matchesSearch && order.status === 'ready'
    if (filter === 'completed') return matchesSearch && order.status === 'delivered'
    if (filter === 'issues') return matchesSearch && order.status === 'issue'
    return matchesSearch
  })

  const filters: { value: FilterType; label: string; count: number }[] = [
    { value: 'all', label: 'All', count: facilityOrders.length },
    { value: 'incoming', label: 'Incoming', count: facilityOrders.filter(o => ['pending', 'confirmed', 'assigned', 'collected'].includes(o.status)).length },
    { value: 'processing', label: 'Processing', count: facilityOrders.filter(o => o.status === 'processing').length },
    { value: 'ready', label: 'Ready', count: facilityOrders.filter(o => o.status === 'ready').length },
    { value: 'completed', label: 'Completed', count: facilityOrders.filter(o => o.status === 'delivered').length },
    { value: 'issues', label: 'Issues', count: facilityOrders.filter(o => o.status === 'issue').length }
  ]

  const handleStatusUpdate = (orderId: string, newStatus: OrderStatus) => {
    // In a real app, this would call an API
    console.log(`Updating order ${orderId} to ${newStatus}`)
  }

  return (
    <div className="space-y-6">
      {/* Search & Filters */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by order ID or area..."
            className="w-full h-10 pl-10 pr-4 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary text-sm"
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 lg:mx-0 lg:px-0">
        {filters.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={cn(
              'px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors flex items-center gap-2',
              filter === f.value
                ? 'bg-primary text-primary-foreground'
                : 'bg-card border border-border hover:border-primary/50'
            )}
          >
            {f.label}
            <span className={cn(
              'px-1.5 py-0.5 rounded text-xs',
              filter === f.value ? 'bg-white/20' : 'bg-muted'
            )}>
              {f.count}
            </span>
          </button>
        ))}
      </div>

      {/* Orders Table */}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        {/* Table Header */}
        <div className="hidden lg:grid grid-cols-7 gap-4 px-4 py-3 bg-muted/50 text-sm font-medium text-muted-foreground">
          <div className="flex items-center gap-1">Order ID <ArrowUpDown className="h-3 w-3" /></div>
          <div>Customer Area</div>
          <div>Items</div>
          <div>Service</div>
          <div className="flex items-center gap-1">Received <ArrowUpDown className="h-3 w-3" /></div>
          <div>Status</div>
          <div>Actions</div>
        </div>

        {/* Table Body */}
        <div className="divide-y divide-border">
          {filteredOrders.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              No orders found
            </div>
          ) : (
            filteredOrders.map((order, index) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.03 }}
                className="p-4"
              >
                {/* Mobile View */}
                <div className="lg:hidden space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-semibold">#{order.id}</span>
                      <StatusBadge status={order.status} />
                    </div>
                    <span className="text-sm text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {new Date(order.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <div className="text-sm">
                    <p className="text-muted-foreground">{order.customerArea}</p>
                    <p className="truncate">{order.items.map(i => `${i.quantity}x ${i.name}`).join(', ')}</p>
                  </div>
                  <div className="flex gap-2">
                    {order.status === 'collected' && (
                      <Button size="sm" onClick={() => handleStatusUpdate(order.id, 'processing')}>
                        Mark Processing
                      </Button>
                    )}
                    {order.status === 'processing' && (
                      <Button size="sm" onClick={() => handleStatusUpdate(order.id, 'ready')}>
                        Mark Ready
                      </Button>
                    )}
                    <Button size="sm" variant="outline" asChild>
                      <Link href={`/facility/orders/${order.id}`}>View</Link>
                    </Button>
                  </div>
                </div>

                {/* Desktop View */}
                <div className="hidden lg:grid grid-cols-7 gap-4 items-center">
                  <Link href={`/facility/orders/${order.id}`} className="font-mono font-medium hover:text-primary">
                    #{order.id}
                  </Link>
                  <div className="text-sm">{order.customerArea}</div>
                  <div className="text-sm truncate">
                    {order.items.map(i => `${i.quantity}x ${i.name}`).join(', ')}
                  </div>
                  <div className="text-sm">{order.serviceType}</div>
                  <div className="text-sm text-muted-foreground">
                    {new Date(order.createdAt).toLocaleString('en-US', { 
                      month: 'short', 
                      day: 'numeric',
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </div>
                  <div>
                    <StatusBadge status={order.status} showPulse />
                  </div>
                  <div className="flex gap-2">
                    {order.status === 'collected' && (
                      <Button size="sm" onClick={() => handleStatusUpdate(order.id, 'processing')}>
                        Processing
                      </Button>
                    )}
                    {order.status === 'processing' && (
                      <Button size="sm" onClick={() => handleStatusUpdate(order.id, 'ready')}>
                        Ready
                      </Button>
                    )}
                    {!['collected', 'processing'].includes(order.status) && (
                      <Button size="sm" variant="outline" asChild>
                        <Link href={`/facility/orders/${order.id}`}>View</Link>
                      </Button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
