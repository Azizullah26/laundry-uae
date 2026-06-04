'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Home, Package, User, Clock, LogOut } from 'lucide-react'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'

interface CustomerLayoutProps {
  children: React.ReactNode
}

export default function CustomerLayout({ children }: CustomerLayoutProps) {
  const pathname = usePathname()
  const router = useRouter()
  const isAuthRoute = pathname?.startsWith('/auth')

  const navItems = [
    { href: '/dashboard', icon: Home, label: 'Home' },
    { href: '/order/new', icon: Package, label: 'Order' },
    { href: '/orders', icon: Clock, label: 'History' },
    { href: '/profile', icon: User, label: 'Profile' },
  ]

  async function handleLogout() {
    try {
      await fetch('/api/customer/auth/logout', { method: 'POST' })
    } finally {
      router.push('/auth/login')
    }
  }

  if (isAuthRoute) {
    return <div data-portal="customer">{children}</div>
  }

  return (
    <div data-portal="customer" className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">LK</span>
            </div>
            <span className="font-bold text-lg text-foreground">LaundryKhalas</span>
          </Link>
          <div className="flex items-center gap-3">
            <button className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors">
              EN
            </button>
            <span className="text-muted-foreground">|</span>
            <button className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors">
              عربي
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-destructive transition-colors ml-1"
              title="Sign out"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Sign out</span>
            </button>
          </div>
        </div>
      </header>

      <main className="pb-20">
        <motion.div
          key={pathname}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {children}
        </motion.div>
      </main>

      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border safe-area-pb">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-around h-16">
            {navItems.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== '/dashboard' && pathname?.startsWith(item.href))
              const Icon = item.icon

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex flex-col items-center gap-1 px-4 py-2 transition-colors',
                    isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  <Icon className="h-5 w-5" />
                  <span className="text-xs font-medium">{item.label}</span>
                </Link>
              )
            })}
          </div>
        </div>
      </nav>
    </div>
  )
}
