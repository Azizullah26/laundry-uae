'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { 
  LayoutDashboard, Package, BarChart3, Truck, 
  DollarSign, Settings, LogOut, Menu, X, Bell
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AvatarCircle } from '@/components/shared/avatar-circle'

interface FacilityLayoutProps {
  children: React.ReactNode
}

export default function FacilityLayout({ children }: FacilityLayoutProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [authChecked, setAuthChecked] = useState(false)

  const navItems = [
    { href: '/facility/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/facility/orders', icon: Package, label: 'Orders' },
    { href: '/facility/performance', icon: BarChart3, label: 'Performance' },
    { href: '/facility/drivers', icon: Truck, label: 'Drivers' },
    { href: '/facility/earnings', icon: DollarSign, label: 'Earnings' },
    { href: '/facility/settings', icon: Settings, label: 'Settings' }
  ]

  useEffect(() => {
    const token = localStorage.getItem('facility_token')
    const facility = localStorage.getItem('facility')

    if (!token || !facility) {
      router.replace('/facility/auth/login')
    } else {
      setAuthChecked(true)
    }
  }, [pathname])

  async function handleLogout() {
    localStorage.removeItem('facility')
    localStorage.removeItem('facility_token')
    try {
      await fetch('/api/facility/auth/logout', { method: 'POST' })
    } finally {
      router.push('/facility/auth/login')
    }
  }

  if (!authChecked) {
    return (
      <div data-portal="facility" className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 rounded-full border-4 border-primary border-t-transparent animate-spin" />
          <p className="text-sm text-muted-foreground">Verifying access...</p>
        </div>
      </div>
    )
  }

  return (
    <div data-portal="facility" className="min-h-screen bg-background">
      {/* Mobile Header */}
      <header className="lg:hidden sticky top-0 z-50 bg-card border-b border-border">
        <div className="flex items-center justify-between h-14 px-4">
          <button onClick={() => setSidebarOpen(true)} className="p-2 -ml-2">
            <Menu className="h-5 w-5" />
          </button>
          <Link href="/facility/dashboard" className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-xs">LK</span>
            </div>
            <span className="font-semibold text-foreground">Partner Portal</span>
          </Link>
          <button className="p-2 -mr-2 relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-destructive" />
          </button>
        </div>
      </header>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden fixed inset-0 z-50 bg-black/50"
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="lg:hidden fixed left-0 top-0 bottom-0 z-50 w-[280px] bg-card border-r border-border"
            >
              <div className="flex items-center justify-between h-14 px-4 border-b border-border">
                <span className="font-semibold">Menu</span>
                <button onClick={() => setSidebarOpen(false)} className="p-2 -mr-2">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <nav className="p-4 space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon
                  const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={cn(
                        'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                        isActive
                          ? 'bg-primary/10 text-primary'
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                      )}
                    >
                      <Icon className="h-5 w-5" />
                      {item.label}
                    </Link>
                  )
                })}
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Layout */}
      <div className="hidden lg:flex">
        {/* Desktop Sidebar */}
        <aside className="fixed left-0 top-0 bottom-0 w-[240px] bg-card border-r border-border flex flex-col">
          <div className="h-16 px-4 flex items-center gap-3 border-b border-border">
            <div className="h-9 w-9 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold">LK</span>
            </div>
            <div>
              <p className="font-semibold text-sm">LaundryKhalas</p>
              <p className="text-xs text-muted-foreground">Partner Portal</p>
            </div>
          </div>

          <nav className="flex-1 p-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  )}
                >
                  <Icon className="h-5 w-5" />
                  {item.label}
                </Link>
              )
            })}
          </nav>

          <div className="p-3 border-t border-border">
            <div className="flex items-center gap-3 px-3 py-2">
              <AvatarCircle name="Al Barsha Express" size="sm" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">Al Barsha Express</p>
                <p className="text-xs text-muted-foreground">Elite Partner</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="mt-2 w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </aside>

        {/* Desktop Content */}
        <div className="flex-1 ml-[240px]">
          <header className="sticky top-0 z-40 h-16 bg-background/95 backdrop-blur border-b border-border">
            <div className="flex items-center justify-between h-full px-6">
              <h1 className="text-lg font-semibold">
                {navItems.find(item => pathname.startsWith(item.href))?.label || 'Dashboard'}
              </h1>
              <div className="flex items-center gap-4">
                <button className="relative p-2 rounded-lg hover:bg-muted transition-colors">
                  <Bell className="h-5 w-5" />
                  <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-destructive" />
                </button>
              </div>
            </div>
          </header>
          <main className="p-6">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              {children}
            </motion.div>
          </main>
        </div>
      </div>

      {/* Mobile Content */}
      <main className="lg:hidden p-4">
        <motion.div
          key={pathname}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {children}
        </motion.div>
      </main>
    </div>
  )
}
