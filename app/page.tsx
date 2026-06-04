'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Sparkles,
  ChevronDown,
  Building2,
  ShieldCheck,
  Star,
  ArrowRight,
  User,
} from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { HeroSection } from '@/components/landing/hero-section'
import { ServicesSection } from '@/components/landing/services-section'

export default function LandingPage() {
  const [portalOpen, setPortalOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setPortalOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div data-portal="customer" className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-50 bg-gradient-to-r from-background via-primary/5 to-background backdrop-blur border-b border-primary/20 shadow-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <motion.div 
              whileHover={{ scale: 1.05, rotate: 5 }}
              className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary via-accent to-primary flex items-center justify-center shadow-lg"
            >
              <span className="text-primary-foreground font-bold text-base">LK</span>
            </motion.div>
            <div>
              <div className="font-bold text-lg bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">LaundryKhalas</div>
              <div className="text-xs text-muted-foreground group-hover:text-primary/70 transition-colors">Premium Laundry Service</div>
            </div>
          </Link>

          <div className="relative" ref={dropdownRef}>
            <motion.button
              whileHover={{ scale: 1.02 }}
              onClick={() => setPortalOpen(!portalOpen)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-primary/10 to-accent/10 hover:from-primary/20 hover:to-accent/20 border border-primary/30 transition-all text-sm font-medium text-foreground"
            >
              Sign in
              <ChevronDown className={`h-4 w-4 transition-transform ${portalOpen ? 'rotate-180' : ''}`} />
            </motion.button>

            {portalOpen && (
              <motion.div
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute right-0 mt-3 w-72 bg-card border border-primary/20 rounded-2xl shadow-xl overflow-hidden z-50 backdrop-blur-sm"
              >
                <div className="p-3 border-b border-primary/10 bg-gradient-to-r from-primary/5 to-accent/5">
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Select Portal</h3>
                </div>
                <Link
                  href="/auth/login"
                  className="flex items-center gap-3 px-4 py-3 hover:bg-primary/10 transition-colors border-b border-primary/10 group"
                >
                  <div className="h-10 w-10 rounded-lg bg-primary/15 flex items-center justify-center group-hover:bg-primary/25 transition-colors">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-semibold">Customer Portal</div>
                    <div className="text-xs text-muted-foreground">Place &amp; track orders</div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </Link>
                <Link
                  href="/facility/auth/login"
                  className="flex items-center gap-3 px-4 py-3 hover:bg-emerald-500/10 transition-colors border-b border-primary/10 group"
                >
                  <div className="h-10 w-10 rounded-lg bg-emerald-500/15 flex items-center justify-center group-hover:bg-emerald-500/25 transition-colors">
                    <Building2 className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-semibold">Facility Portal</div>
                    <div className="text-xs text-muted-foreground">Manage your shop</div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-emerald-600 transition-colors" />
                </Link>
                <Link
                  href="/admin/auth/login"
                  className="flex items-center gap-3 px-4 py-3 hover:bg-indigo-500/10 transition-colors group"
                >
                  <div className="h-10 w-10 rounded-lg bg-indigo-500/15 flex items-center justify-center group-hover:bg-indigo-500/25 transition-colors">
                    <ShieldCheck className="h-5 w-5 text-indigo-600" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-semibold">Admin Portal</div>
                    <div className="text-xs text-muted-foreground">Control center</div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-indigo-600 transition-colors" />
                </Link>
              </motion.div>
            )}
          </div>
        </div>
      </header>

      <HeroSection />

      <ServicesSection />

      <section className="border-t border-border py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto bg-gradient-to-br from-primary to-accent rounded-3xl p-10 md:p-16 text-center relative overflow-hidden">
            <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground tracking-tight">
              Ready for fresh, clean laundry?
            </h2>
            <p className="mt-4 text-primary-foreground/90 text-lg">
              Sign in and place your first order in under a minute.
            </p>
            <Link href="/auth/login">
              <Button size="lg" variant="secondary" className="mt-8 h-14 px-10 text-base">
                Get Started
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Image Gallery Section */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-muted/30 to-background border-t border-primary/10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Our Premium Services Gallery</h2>
              <p className="mt-3 text-muted-foreground">See the quality and care we put into every laundry order</p>
            </motion.div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { src: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-xSppw7LaaIzWGrtqwuu0c6nge9yGHr.png', title: 'Fresh & Clean', desc: 'Sparkling clean wash' },
              { src: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-yCRFUFDQkFiBE3gSl23bZ39QfozwuS.png', title: 'Professional Ironing', desc: 'Premium finishing' },
              { src: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-RJ4DuntR6cjoysLHj2XF3A6A1R4i37.png', title: 'Fabric Care', desc: 'Gentle on fabrics' },
              { src: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-9stZQnoeeseIjzWIxL67xPbduUYKO9.png', title: 'Complete Solution', desc: 'Full laundry care' },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -8 }}
                className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20 p-1"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/0 to-accent/0 group-hover:from-primary/10 group-hover:to-accent/10 transition-all" />
                <div className="relative bg-background rounded-xl overflow-hidden h-64 md:h-72 flex flex-col">
                  <img 
                    src={item.src} 
                    alt={item.title}
                    className="w-full h-4/5 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="h-1/5 flex flex-col items-center justify-center px-4 bg-gradient-to-t from-muted/50 to-transparent">
                    <h3 className="font-semibold text-sm text-center">{item.title}</h3>
                    <p className="text-xs text-muted-foreground text-center">{item.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <footer className="relative border-t border-primary/20 bg-gradient-to-b from-background to-muted/50 py-16">
        {/* Background images showcase */}
        <div className="absolute inset-0 overflow-hidden opacity-[0.03] pointer-events-none">
          <div className="grid grid-cols-4 gap-4 p-8">
            {[
              'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-xSppw7LaaIzWGrtqwuu0c6nge9yGHr.png',
              'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-yCRFUFDQkFiBE3gSl23bZ39QfozwuS.png',
              'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-RJ4DuntR6cjoysLHj2XF3A6A1R4i37.png',
              'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-9stZQnoeeseIjzWIxL67xPbduUYKO9.png',
            ].map((src, i) => (
              <img key={i} src={src} alt="" className="w-full h-24 object-cover rounded-lg" />
            ))}
          </div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            {/* Brand */}
            <div className="col-span-md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-xs">LK</span>
                </div>
                <div>
                  <div className="font-bold text-sm bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">LaundryKhalas</div>
                  <div className="text-xs text-muted-foreground">Premium Laundry</div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">Fresh, clean clothes delivered to your doorstep. Premium laundry service in GCC.</p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold text-sm mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Home</Link></li>
                <li><Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Services</Link></li>
                <li><Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Pricing</Link></li>
                <li><Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">About</Link></li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="font-semibold text-sm mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Terms of Service</Link></li>
                <li><Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Privacy Policy</Link></li>
                <li><Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Cookie Policy</Link></li>
                <li><Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Contact Us</Link></li>
              </ul>
            </div>

            {/* Newsletter */}
            <div>
              <h4 className="font-semibold text-sm mb-4">Stay Updated</h4>
              <p className="text-sm text-muted-foreground mb-3">Subscribe to get offers and updates.</p>
              <div className="flex gap-2">
                <input 
                  type="email" 
                  placeholder="your@email.com" 
                  className="flex-1 px-3 py-2 rounded-lg bg-secondary border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
                <Button size="sm" className="px-3">Subscribe</Button>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent mb-8" />

          {/* Bottom Footer */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-sm text-muted-foreground">
              © 2026 LaundryKhalas. All rights reserved. | Made with ❤️ in GCC
            </div>
            <div className="flex items-center gap-4">
              <Link href="#" className="h-8 w-8 rounded-lg bg-secondary hover:bg-primary/20 flex items-center justify-center transition-colors" title="Facebook">
                <span className="text-xs font-bold">f</span>
              </Link>
              <Link href="#" className="h-8 w-8 rounded-lg bg-secondary hover:bg-primary/20 flex items-center justify-center transition-colors" title="Twitter">
                <span className="text-xs">𝕏</span>
              </Link>
              <Link href="#" className="h-8 w-8 rounded-lg bg-secondary hover:bg-primary/20 flex items-center justify-center transition-colors" title="Instagram">
                <span className="text-xs font-bold">📷</span>
              </Link>
              <Link href="#" className="h-8 w-8 rounded-lg bg-secondary hover:bg-primary/20 flex items-center justify-center transition-colors" title="LinkedIn">
                <span className="text-xs font-bold">in</span>
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
