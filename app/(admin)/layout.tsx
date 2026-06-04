'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { 
  LayoutDashboard, Package, Truck, Building2, CreditCard,
  MessageSquare, Bot, DollarSign, Globe, LineChart, Settings,
  LogOut, ChevronDown, Search, Bell, Menu, BarChart3
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AvatarCircle } from '@/components/shared/avatar-circle'

interface AdminLayoutProps {
  children: React.ReactNode
}

const navGroups = [
  {
    label: 'Operations',
    items: [
      { href: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
      { href: '/admin/orders', icon: Package, label: 'Orders' },
      { href: '/admin/drivers', icon: Truck, label: 'Drivers' },
      { href: '/admin/facilities', icon: Building2, label: 'Facilities' }
    ]
  },
  {
    label: 'Finance',
    items: [
      { href: '/admin/payments', icon: CreditCard, label: 'Payments' }
    ]
  },
  {
    label: 'AI & Automation',
    items: [
      { href: '/admin/ai/conversations', icon: MessageSquare, label: 'Conversations' },
      { href: '/admin/ai/scripts', icon: Bot, label: 'AI Scripts' },
      { href: '/admin/ai/cost', icon: BarChart3, label: 'AI Cost Monitor' }
    ]
  },
  {
    label: 'Platform',
    items: [
      { href: '/admin/markets', icon: Globe, label: 'Markets' },
      { href: '/admin/pricing', icon: DollarSign, label: 'Pricing' },
      { href: '/admin/analytics', icon: LineChart, label: 'Analytics' },
      { href: '/admin/settings', icon: Settings, label: 'Settings' }
    ]
  }
]

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [selectedMarket, setSelectedMarket] = useState('Dubai')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [authChecked, setAuthChecked] = useState(false)

  const markets = ['All Markets', 'Dubai', 'Abu Dhabi', 'Sharjah']

  useEffect(() => {
    // Check for admin session cookie presence via a lightweight API probe
    fetch('/api/admin/auth/me')
      .then((r) => {
        if (!r.ok) router.replace('/admin/auth/login')
        else setAuthChecked(true)
      })
      .catch(() => router.replace('/admin/auth/login'))
  }, [pathname])

  async function handleLogout() {
    try {
      await fetch('/api/admin/auth/logout', { method: 'POST' })
    } finally {
      router.push('/admin/auth/login')
    }
  }

  if (!authChecked) {
    return (
      <div data-portal="admin" className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 rounded-full border-4 border-primary border-t-transparent animate-spin" />
          <p className="text-sm text-muted-foreground">Verifying access...</p>
        </div>
      </div>
    )
  }

  return (
    <div data-portal="admin" className="min-h-screen bg-background">
      {/* Mobile Header */}
      <header className="lg:hidden sticky top-0 z-50 bg-card border-b border-border">
        <div className="flex items-center justify-between h-14 px-4">
          <button onClick={() => setMobileMenuOpen(true)} className="p-2 -ml-2">
            <Menu className="h-5 w-5" />
          </button>
          <span className="font-semibold">Admin</span>
          <button className="p-2 -mr-2 relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-amber-500" />
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="lg:hidden fixed inset-0 z-50 bg-black/70"
            />
            <motion.aside
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="lg:hidden fixed left-0 top-0 bottom-0 z-50 w-[300px] bg-sidebar overflow-y-auto"
            >
              <div className="p-4">
                <div className="flex items-center gap-2 mb-6">
                  <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                    <span className="text-primary-foreground font-bold text-sm">LK</span>
                  </div>
                  <span className="font-bold text-sidebar-foreground">LaundryKhalas</span>
                </div>
                
                {navGroups.map((group) => (
                  <div key={group.label} className="mb-6">
                    <p className="text-xs font-semibold text-sidebar-foreground/50 uppercase tracking-wider mb-2 px-3">
                      {group.label}
                    </p>
                    <nav className="space-y-1">
                      {group.items.map((item) => {
                        const Icon = item.icon
                        const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setMobileMenuOpen(false)}
                            className={cn(
                              'flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors',
                              isActive
                                ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                                : 'text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent'
                            )}
                          >
                            <Icon className="h-4 w-4" />
                            {item.label}
                          </Link>
                        )
                      })}
                    </nav>
                  </div>
                ))}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Layout */}
      <div className="hidden lg:flex">
        {/* Sidebar */}
        <aside
          className={cn(
            'fixed left-0 top-0 bottom-0 bg-sidebar border-r border-sidebar-border flex flex-col transition-all duration-300',
            sidebarCollapsed ? 'w-[56px]' : 'w-[240px]'
          )}
        >
          {/* Logo */}
          <div className="h-16 px-3 flex items-center border-b border-sidebar-border">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
                <span className="text-primary-foreground font-bold text-sm">LK</span>
              </div>
              {!sidebarCollapsed && (
                <span className="font-bold text-sidebar-foreground">LaundryKhalas</span>
              )}
            </div>
          </div>

          {/* Market Selector */}
          {!sidebarCollapsed && (
            <div className="p-3 border-b border-sidebar-border">
              <div className="relative">
                <select
                  value={selectedMarket}
                  onChange={(e) => setSelectedMarket(e.target.value)}
                  className="w-full appearance-none bg-sidebar-accent text-sidebar-foreground text-sm px-3 py-2 pr-8 rounded-lg border border-sidebar-border focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {markets.map((market) => (
                    <option key={market} value={market}>{market}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-sidebar-foreground/50 pointer-events-none" />
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex-1 overflow-y-auto py-3">
            {navGroups.map((group) => (
              <div key={group.label} className="mb-4">
                {!sidebarCollapsed && (
                  <p className="text-[10px] font-semibold text-sidebar-foreground/40 uppercase tracking-wider mb-2 px-4">
                    {group.label}
                  </p>
                )}
                <nav className="px-2 space-y-0.5">
                  {group.items.map((item) => {
                    const Icon = item.icon
                    const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                          'flex items-center gap-3 px-2 py-2 rounded-lg text-sm transition-colors',
                          isActive
                            ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                            : 'text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent',
                          sidebarCollapsed && 'justify-center'
                        )}
                        title={sidebarCollapsed ? item.label : undefined}
                      >
                        <Icon className="h-4 w-4 flex-shrink-0" />
                        {!sidebarCollapsed && item.label}
                      </Link>
                    )
                  })}
                </nav>
              </div>
            ))}
          </div>

          {/* User */}
          <div className="p-3 border-t border-sidebar-border">
            {sidebarCollapsed ? (
              <AvatarCircle name="Admin User" size="sm" className="mx-auto" />
            ) : (
              <>
                <div className="flex items-center gap-3 px-2 py-2">
                  <AvatarCircle name="Admin User" size="sm" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-sidebar-foreground truncate">Admin</p>
                    <p className="text-xs text-sidebar-foreground/50">Super Admin</p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="mt-1 w-full flex items-center gap-3 px-2 py-2 rounded-lg text-sm text-sidebar-foreground/70 hover:text-destructive hover:bg-destructive/10 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </>
            )}
          </div>
        </aside>

        {/* Main Content */}
        <div className={cn(
          'flex-1 transition-all duration-300',
          sidebarCollapsed ? 'ml-[56px]' : 'ml-[240px]'
        )}>
          {/* Top Header */}
          <header className="sticky top-0 z-40 h-16 bg-background/95 backdrop-blur border-b border-border">
            <div className="flex items-center justify-between h-full px-6">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                  className="p-2 rounded-lg hover:bg-muted transition-colors"
                >
                  <Menu className="h-4 w-4" />
                </button>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search orders, drivers, facilities..."
                    className="w-[300px] bg-muted/50 border border-border rounded-lg py-2 pl-10 pr-4 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button className="relative p-2 rounded-lg hover:bg-muted transition-colors">
                  <Bell className="h-5 w-5" />
                  <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-amber-500" />
                </button>
                <AvatarCircle name="Admin User" size="sm" />
              </div>
            </div>
          </header>

          {/* Page Content */}
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
