'use client'

import { motion } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'
import { Truck, Sparkles, Clock, Shield, Zap } from 'lucide-react'

export function ServicesSection() {
  const containerRef = useRef(null)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return
      const rect = (containerRef.current as HTMLElement).getBoundingClientRect()
      setMousePos({
        x: (e.clientX - rect.left) / rect.width - 0.5,
        y: (e.clientY - rect.top) / rect.height - 0.5,
      })
    }

    const container = containerRef.current
    container?.addEventListener('mousemove', handleMouseMove)
    return () => container?.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const services = [
    {
      title: 'Wash & Fold',
      description: 'Professional washing with premium detergent',
      icon: Sparkles,
      image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-fgHSvsCzTR81R8vLwlevjL6FjypOgY.png',
      color: 'from-cyan-400 to-blue-500',
    },
    {
      title: 'Dry Cleaning',
      description: 'Specialized care for delicate fabrics',
      icon: Zap,
      image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-yavpndadfcYLzdU2jcisFpOlBjafNg.png',
      color: 'from-blue-400 to-cyan-500',
    },
    {
      title: 'Ironing & Finishing',
      description: 'Crisp and perfectly pressed clothes',
      icon: Truck,
      image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-43e7Fz5hRloXkvVRrpTRmg0bIwtZCK.png',
      color: 'from-blue-500 to-indigo-400',
    },
  ]

  return (
    <section ref={containerRef} className="relative overflow-hidden py-24 bg-gradient-to-b from-background via-background/50 to-background">
      {/* Animated background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-40 -left-40 w-80 h-80 bg-cyan-400/5 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, -80, 0],
            y: [0, -50, 0],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          className="absolute -bottom-40 -right-40 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl"
        />
      </div>

      <div className="container mx-auto px-4 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 text-blue-600 text-xs font-medium mb-4">
            <Sparkles className="h-3.5 w-3.5" />
            Our Services
          </div>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-balance mb-6">
            Premium laundry care for every fabric
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            From delicate silks to everyday wear, we handle every garment with expertise and precision
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {services.map((service, idx) => {
            const Icon = service.icon
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="group relative"
              >
                <div
                  className="relative h-96 rounded-2xl border border-border overflow-hidden bg-card shadow-lg transition-all duration-300"
                  style={{
                    transform: `perspective(1000px) rotateX(${mousePos.y * 5}deg) rotateY(${mousePos.x * 5}deg)`,
                    transformStyle: 'preserve-3d',
                  }}
                >
                  {/* Background blur effect */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />

                  {/* Image container with parallax */}
                  <motion.div
                    className="relative h-full overflow-hidden"
                    animate={{
                      y: mousePos.y * 10,
                      x: mousePos.x * 10,
                    }}
                    transition={{ type: 'spring', stiffness: 100, damping: 20 }}
                  >
                    <img
                      src={service.image}
                      alt={service.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
                  </motion.div>

                  {/* Content */}
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 p-6"
                    initial={{ y: 20, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: idx * 0.1 + 0.2 }}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`p-2.5 rounded-lg bg-gradient-to-br ${service.color} text-white`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <h3 className="text-xl font-semibold text-black">{service.title}</h3>
                    </div>
                    <p className="text-sm text-black">{service.description}</p>
                  </motion.div>

                  {/* Hover border effect */}
                  <div className="absolute inset-0 border border-transparent group-hover:border-blue-400/30 rounded-2xl transition-colors duration-300 pointer-events-none" />
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
