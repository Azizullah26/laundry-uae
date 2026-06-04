'use client'

import { use } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Phone, Star, MapPin, Navigation, Package } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { OrderTimeline } from '@/components/shared/order-timeline'
import { AvatarCircle } from '@/components/shared/avatar-circle'
import { mockOrders, mockDrivers } from '@/lib/mock-data'
import Link from 'next/link'
import dynamic from 'next/dynamic'

// Dynamically import map to avoid SSR issues
const OrderMap = dynamic(() => import('@/components/customer/order-map'), { 
  ssr: false,
  loading: () => (
    <div className="h-full bg-muted animate-pulse flex items-center justify-center">
      <MapPin className="h-8 w-8 text-muted-foreground" />
    </div>
  )
})

interface TrackOrderPageProps {
  params: Promise<{ id: string }>
}

export default function TrackOrderPage({ params }: TrackOrderPageProps) {
  const { id } = use(params)
  const order = mockOrders.find(o => o.id === id) || mockOrders[0]
  const driver = order.driverId ? mockDrivers.find(d => d.id === order.driverId) : null

  const timelineSteps = [
    { id: '1', label: 'Order Confirmed', status: 'completed' as const, timestamp: 'May 18, 8:30 AM' },
    { id: '2', label: 'Driver Assigned', status: 'completed' as const, timestamp: 'May 18, 8:45 AM', actor: driver?.name },
    { id: '3', label: 'Driver En Route', status: order.status === 'assigned' ? 'in_progress' as const : 'completed' as const, timestamp: order.status === 'assigned' ? undefined : 'May 18, 9:00 AM' },
    { id: '4', label: 'Collected by Driver', status: ['collected', 'processing', 'ready', 'out_for_delivery', 'delivered'].includes(order.status) ? 'completed' as const : 'upcoming' as const },
    { id: '5', label: 'At Laundry Facility', status: ['processing', 'ready', 'out_for_delivery', 'delivered'].includes(order.status) ? 'completed' as const : order.status === 'collected' ? 'in_progress' as const : 'upcoming' as const },
    { id: '6', label: 'Being Processed', status: ['ready', 'out_for_delivery', 'delivered'].includes(order.status) ? 'completed' as const : order.status === 'processing' ? 'in_progress' as const : 'upcoming' as const },
    { id: '7', label: 'Ready for Delivery', status: ['out_for_delivery', 'delivered'].includes(order.status) ? 'completed' as const : order.status === 'ready' ? 'in_progress' as const : 'upcoming' as const },
    { id: '8', label: 'Out for Delivery', status: order.status === 'delivered' ? 'completed' as const : order.status === 'out_for_delivery' ? 'in_progress' as const : 'upcoming' as const },
    { id: '9', label: 'Delivered', status: order.status === 'delivered' ? 'completed' as const : 'upcoming' as const }
  ]

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="sticky top-14 z-40 bg-background border-b border-border">
        <div className="container mx-auto px-4 py-3 flex items-center gap-4">
          <Link href="/orders">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="font-semibold">Order #{order.id}</h1>
            <p className="text-xs text-muted-foreground">{order.serviceType}</p>
          </div>
        </div>
      </div>

      <div className="lg:flex lg:h-[calc(100vh-8rem)]">
        {/* Timeline - Left side on desktop */}
        <div className="lg:w-[400px] lg:border-r lg:overflow-y-auto">
          <div className="p-4 lg:p-6">
            {/* ETA Card */}
            {driver && ['assigned', 'out_for_delivery'].includes(order.status) && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 rounded-xl bg-gradient-to-r from-primary to-accent text-white"
              >
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center">
                    <Navigation className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm opacity-90">Estimated arrival</p>
                    <p className="text-2xl font-bold">8 minutes</p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Driver Card */}
            {driver && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="mb-6 p-4 rounded-xl bg-card border border-border"
              >
                <div className="flex items-center gap-4">
                  <AvatarCircle name={driver.name} size="lg" />
                  <div className="flex-1">
                    <p className="font-semibold">{driver.name}</p>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                      <span>{(driver.score / 20).toFixed(1)}</span>
                      <span>•</span>
                      <span>{driver.vehicleType}</span>
                    </div>
                  </div>
                  <a href={`tel:${driver.phone}`}>
                    <Button size="icon" variant="outline" className="rounded-full">
                      <Phone className="h-4 w-4" />
                    </Button>
                  </a>
                </div>
              </motion.div>
            )}

            {/* Timeline */}
            <div className="mb-6">
              <h2 className="font-semibold mb-4">Order Status</h2>
              <OrderTimeline steps={timelineSteps} />
            </div>

            {/* WhatsApp Notification Status */}
            <div className="p-3 rounded-lg bg-green-50 border border-green-200 flex items-center gap-2">
              <div className="h-5 w-5 rounded-full bg-green-500 flex items-center justify-center">
                <svg className="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
                </svg>
              </div>
              <span className="text-sm text-green-700">Updates sent to WhatsApp</span>
            </div>

            {/* Order Summary (Collapsible on mobile) */}
            <details className="mt-6 group">
              <summary className="flex items-center justify-between cursor-pointer">
                <h2 className="font-semibold">Order Details</h2>
                <Package className="h-4 w-4 text-muted-foreground group-open:rotate-180 transition-transform" />
              </summary>
              <div className="mt-4 p-4 rounded-xl bg-secondary space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Facility</span>
                  <span className="font-medium">{order.facilityName}</span>
                </div>
                {order.items.map((item, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{item.name} x {item.quantity}</span>
                    <span>AED {item.price * item.quantity}</span>
                  </div>
                ))}
                <div className="pt-2 border-t border-border flex justify-between font-semibold">
                  <span>Total</span>
                  <span className="text-primary">AED {order.total}</span>
                </div>
              </div>
            </details>
          </div>
        </div>

        {/* Map - Right side on desktop, below on mobile */}
        <div className="h-[300px] lg:h-auto lg:flex-1">
          <OrderMap 
            driverLocation={driver?.location}
            pickupLocation={{ lat: 25.0772, lng: 55.1305 }}
          />
        </div>
      </div>
    </div>
  )
}
