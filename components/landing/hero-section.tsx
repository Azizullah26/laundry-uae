'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronRight, Sparkles, Zap, Shield } from 'lucide-react'
import { motion } from 'framer-motion'

export function HeroSection() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return

      const rect = containerRef.current.getBoundingClientRect()
      const x = (e.clientX - rect.left - rect.width / 2) / 30
      const y = (e.clientY - rect.top - rect.height / 2) / 30

      setMousePosition({ x, y })

      // 3D effect on image
      if (imageRef.current) {
        imageRef.current.style.transform = `perspective(1000px) rotateX(${y}deg) rotateY(${x}deg) scale(1.02)`
      }
    }

    const handleMouseEnter = () => setIsHovering(true)
    const handleMouseLeave = () => {
      setIsHovering(false)
      setMousePosition({ x: 0, y: 0 })
      if (imageRef.current) {
        imageRef.current.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)'
      }
    }

    window.addEventListener('mousemove', handleMouseMove)
    containerRef.current?.addEventListener('mouseenter', handleMouseEnter)
    containerRef.current?.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      containerRef.current?.removeEventListener('mouseenter', handleMouseEnter)
      containerRef.current?.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [])

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: 'easeOut' }
    }
  }

  const floatingVariants = {
    animate: {
      y: [0, -20, 0],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: 'easeInOut'
      }
    }
  }

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900"
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-30">
        <motion.div
          animate={{
            y: [0, 50, 0],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-20 right-20 w-72 h-72 bg-cyan-500 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            y: [0, -50, 0],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 10, repeat: Infinity, delay: 1 }}
          className="absolute bottom-40 left-20 w-96 h-96 bg-blue-500 rounded-full blur-3xl"
        />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex items-center justify-between px-6 sm:px-12 lg:px-20 pt-20 pb-20">
        {/* Left content */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex-1 max-w-2xl"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 backdrop-blur-sm"
          >
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span className="text-sm font-medium text-cyan-300">AI-Powered Laundry Management</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-blue-100 to-cyan-300 bg-clip-text text-transparent leading-tight"
          >
            LaundryKhalas
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-lg sm:text-xl text-slate-300 mb-8 max-w-xl leading-relaxed"
          >
            Revolutionary laundry service platform connecting customers with premium facilities across the GCC. Real-time tracking, instant notifications, and exceptional service quality.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Link
              href="/auth/login"
              className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl group"
            >
              Place Order Now
              <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/#features"
              className="inline-flex items-center justify-center px-8 py-4 border-2 border-cyan-500/50 text-cyan-300 hover:bg-cyan-500/10 font-semibold rounded-lg transition-all duration-300"
            >
              Explore Features
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="flex gap-8 mt-12 text-sm"
          >
            {[
              { label: 'Active Facilities', value: '50+' },
              { label: 'Orders Completed', value: '10K+' },
              { label: 'Happy Customers', value: '12K+' }
            ].map((stat, i) => (
              <div key={i}>
                <div className="text-2xl font-bold text-cyan-400">{stat.value}</div>
                <div className="text-slate-400 text-xs mt-1">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Right side - Images with 3D effect */}
        <motion.div
          variants={floatingVariants}
          animate="animate"
          className="hidden lg:flex flex-1 items-center justify-center relative"
          style={{ perspective: '1000px' }}
        >
          <div
            ref={imageRef}
            className="relative w-full max-w-md h-auto transition-transform duration-100"
            style={{
              filter: 'drop-shadow(0 20px 60px rgba(0, 188, 212, 0.3))'
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="relative w-full h-auto rounded-2xl overflow-hidden"
            >
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-xSppw7LaaIzWGrtqwuu0c6nge9yGHr.png"
                alt="Premium Laundry Service"
                width={500}
                height={500}
                className="w-full h-auto object-cover"
                priority
              />
            </motion.div>

            {/* Floating accent images */}
            <motion.div
              animate={{ y: [0, -30, 0], rotate: [0, 5, 0] }}
              transition={{ duration: 5, repeat: Infinity }}
              className="absolute -top-10 -right-10 w-48 h-48 opacity-60"
            >
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-yCRFUFDQkFiBE3gSl23bZ39QfozwuS.png"
                alt="Colorful wash"
                width={300}
                height={300}
                className="w-full h-auto object-cover rounded-2xl"
              />
            </motion.div>

            <motion.div
              animate={{ y: [0, 30, 0], rotate: [0, -5, 0] }}
              transition={{ duration: 6, repeat: Infinity, delay: 0.5 }}
              className="absolute -bottom-10 -left-10 w-40 h-40 opacity-50"
            >
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-9stZQnoeeseIjzWIxL67xPbduUYKO9.png"
                alt="Fresh laundry"
                width={250}
                height={250}
                className="w-full h-auto object-cover rounded-2xl"
              />
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Feature pills */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        className="absolute bottom-20 left-1/2 -translate-x-1/2 flex gap-6 flex-wrap justify-center z-20"
      >
        {[
          { icon: Zap, label: 'Instant Pickup' },
          { icon: Shield, label: 'Secure Tracking' },
          { icon: Sparkles, label: 'Premium Quality' }
        ].map((feature, i) => (
          <div
            key={i}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/50 border border-cyan-500/20 backdrop-blur-sm hover:bg-slate-800/80 transition-colors cursor-pointer group"
          >
            <feature.icon className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
            <span className="text-sm text-slate-300">{feature.label}</span>
          </div>
        ))}
      </motion.div>
    </section>
  )
}
