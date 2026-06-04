'use client'

import { motion } from 'framer-motion'
import { 
  User, MapPin, CreditCard, Bell, Globe, Gift, 
  HelpCircle, ChevronRight, LogOut, Package, Shirt
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AvatarCircle } from '@/components/shared/avatar-circle'
import Link from 'next/link'

export default function ProfilePage() {
  const user = {
    name: 'Sarah Ahmed',
    phone: '+971 50 123 4567',
    email: 'sarah.ahmed@email.com'
  }

  const stats = {
    orders: 18,
    items: 42,
    spent: 892
  }

  const menuItems = [
    { icon: MapPin, label: 'Saved Addresses', href: '/profile/addresses' },
    { icon: CreditCard, label: 'Payment Methods', href: '/profile/payment' },
    { icon: Bell, label: 'Notifications', href: '/profile/notifications' },
    { icon: Globe, label: 'Language', href: '/profile/language', value: 'English' },
    { icon: Gift, label: 'Refer a Friend', href: '/profile/referral', badge: 'AED 20' },
    { icon: HelpCircle, label: 'Help & Support', href: '/profile/help' }
  ]

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <AvatarCircle name={user.name} size="lg" className="mx-auto h-20 w-20 text-xl mb-4" />
        <h1 className="text-xl font-bold">{user.name}</h1>
        <p className="text-sm text-muted-foreground">{user.phone}</p>
        <Button variant="outline" size="sm" className="mt-3">
          Edit Profile
        </Button>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-3 gap-4 mb-8"
      >
        <div className="text-center p-4 rounded-xl bg-card border border-border">
          <Package className="h-5 w-5 mx-auto text-primary mb-2" />
          <p className="text-2xl font-bold">{stats.orders}</p>
          <p className="text-xs text-muted-foreground">Orders</p>
        </div>
        <div className="text-center p-4 rounded-xl bg-card border border-border">
          <Shirt className="h-5 w-5 mx-auto text-primary mb-2" />
          <p className="text-2xl font-bold">{stats.items}</p>
          <p className="text-xs text-muted-foreground">Items</p>
        </div>
        <div className="text-center p-4 rounded-xl bg-card border border-border">
          <span className="text-lg font-bold text-primary block mb-2">AED</span>
          <p className="text-2xl font-bold">{stats.spent}</p>
          <p className="text-xs text-muted-foreground">Spent</p>
        </div>
      </motion.div>

      {/* Menu Items */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-2"
      >
        {menuItems.map((item) => (
          <Link key={item.label} href={item.href}>
            <div className="flex items-center gap-4 p-4 bg-card rounded-xl border border-border hover:border-primary/50 transition-colors">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <item.icon className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="font-medium">{item.label}</p>
              </div>
              {item.value && (
                <span className="text-sm text-muted-foreground">{item.value}</span>
              )}
              {item.badge && (
                <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-xs font-medium">
                  {item.badge}
                </span>
              )}
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </div>
          </Link>
        ))}
      </motion.div>

      {/* Logout */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-8"
      >
        <Button variant="outline" className="w-full text-destructive hover:text-destructive hover:bg-destructive/10">
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </motion.div>

      {/* Version */}
      <p className="text-center text-xs text-muted-foreground mt-6">
        LaundryKhalas v1.0.0
      </p>
    </div>
  )
}
