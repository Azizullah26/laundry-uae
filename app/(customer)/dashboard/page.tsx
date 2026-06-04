'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Plus, Package, Clock, CheckCircle2, MapPin, Phone, LogOut, Sparkles, ArrowRight, WashingMachine, Wind, Droplets } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import toast from 'react-hot-toast'

const recentOrders = [
  { id: 'LK-4821', service: 'Wash & Fold', status: 'Out for delivery', date: 'Today', total: 'SAR 75', color: 'text-blue-600 bg-blue-50' },
  { id: 'LK-4789', service: 'Dry Cleaning', status: 'Delivered', date: 'Yesterday', total: 'SAR 120', color: 'text-emerald-600 bg-emerald-50' },
  { id: 'LK-4756', service: 'Ironing', status: 'Delivered', date: '3 days ago', total: 'SAR 40', color: 'text-emerald-600 bg-emerald-50' },
]

export default function CustomerDashboard() {
  const router = useRouter()
  const [loggingOut, setLoggingOut] = useState(false)

  const handleLogout = async () => {
    setLoggingOut(true)
    try {
      await fetch('/api/customer/auth/logout', { method: 'POST' })
      toast.success('Signed out')
      router.push('/')
    } catch {
      toast.error('Logout failed')
    } finally {
      setLoggingOut(false)
    }
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">LK</span>
            </div>
            <span className="font-bold text-lg">LaundryKhalas</span>
          </Link>
          <Button variant="ghost" size="sm" onClick={handleLogout} disabled={loggingOut}>
            <LogOut className="h-4 w-4 mr-2" />
            Sign out
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-3xl">
        {/* Welcome */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Welcome back</h1>
          <p className="text-muted-foreground mt-1">What would you like to do today?</p>
        </motion.div>

        {/* Primary CTA */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-primary to-accent rounded-3xl p-8 text-primary-foreground shadow-lg mb-8 relative overflow-hidden"
        >
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10" />
          <div className="absolute -right-20 -bottom-20 h-60 w-60 rounded-full bg-white/5" />
          <div className="relative">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-xs font-medium mb-4">
              <Sparkles className="h-3.5 w-3.5" />
              First-time bonus
            </div>
            <h2 className="text-2xl font-bold mb-2">Place a new order</h2>
            <p className="text-primary-foreground/90 mb-6 max-w-md">
              Schedule a pickup and we&apos;ll deliver fresh laundry to your door within 24 hours.
            </p>
            <Link href="/order/new">
              <Button size="lg" variant="secondary" className="h-12 px-6">
                <Plus className="h-4 w-4 mr-2" />
                New Order
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Quick Services */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="mb-8">
          <h2 className="text-lg font-semibold mb-3">Quick services</h2>
          <div className="grid grid-cols-3 gap-3">
            {[
              { icon: WashingMachine, label: 'Wash & Fold' },
              { icon: Wind, label: 'Dry Clean' },
              { icon: Droplets, label: 'Ironing' },
            ].map((service) => (
              <Link
                key={service.label}
                href="/order/new"
                className="bg-card border border-border rounded-2xl p-4 hover:border-primary/40 transition-colors text-center"
              >
                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-2">
                  <service.icon className="h-5 w-5 text-primary" />
                </div>
                <div className="text-sm font-medium">{service.label}</div>
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="grid grid-cols-3 gap-3 mb-8">
          <div className="bg-card border border-border rounded-2xl p-4">
            <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
              <Package className="h-3.5 w-3.5" />
              Total orders
            </div>
            <div className="text-2xl font-bold">12</div>
          </div>
          <div className="bg-card border border-border rounded-2xl p-4">
            <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
              <Clock className="h-3.5 w-3.5" />
              In progress
            </div>
            <div className="text-2xl font-bold">1</div>
          </div>
          <div className="bg-card border border-border rounded-2xl p-4">
            <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Completed
            </div>
            <div className="text-2xl font-bold">11</div>
          </div>
        </motion.div>

        {/* Recent Orders */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold">Recent orders</h2>
            <Link href="/orders" className="text-sm text-primary hover:underline">
              View all
            </Link>
          </div>

          <div className="space-y-2">
            {recentOrders.map((order) => (
              <Link
                key={order.id}
                href={`/order/${order.id}/track`}
                className="flex items-center gap-4 bg-card border border-border rounded-2xl p-4 hover:border-primary/40 transition-colors"
              >
                <div className="h-11 w-11 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Package className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium">{order.service}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${order.color}`}>{order.status}</span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    {order.id} • {order.date}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">{order.total}</div>
                </div>
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Help banner */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 bg-secondary/50 border border-border rounded-2xl p-5 flex items-center gap-4"
        >
          <div className="h-11 w-11 rounded-xl bg-card flex items-center justify-center flex-shrink-0">
            <Phone className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1">
            <div className="font-medium">Need help?</div>
            <div className="text-sm text-muted-foreground">Our support team is here 24/7</div>
          </div>
          <Button variant="outline" size="sm">Contact</Button>
        </motion.div>
      </main>
    </div>
  )
}
