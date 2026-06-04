'use client'

import { useState, useRef, useEffect, Suspense } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, MessageCircle, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

function VerifyContent() {
  const searchParams = useSearchParams()
  const phone = searchParams.get('phone') || ''
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [isLoading, setIsLoading] = useState(false)
  const [resendTimer, setResendTimer] = useState(60)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    inputRefs.current[0]?.focus()
  }, [])

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [resendTimer])

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return

    const newOtp = [...otp]
    newOtp[index] = value.slice(-1)
    setOtp(newOtp)

    // Auto-advance to next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }

    // Auto-submit when complete
    if (newOtp.every(digit => digit) && newOtp.join('').length === 6) {
      handleVerify(newOtp.join(''))
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    const newOtp = [...otp]
    for (let i = 0; i < pastedData.length; i++) {
      newOtp[i] = pastedData[i]
    }
    setOtp(newOtp)
    if (pastedData.length === 6) {
      handleVerify(pastedData)
    }
  }

  const handleVerify = async (code: string) => {
    setIsLoading(true)
    // Simulate verification
    await new Promise(resolve => setTimeout(resolve, 1500))
    window.location.href = '/'
  }

  const handleResend = async () => {
    setResendTimer(60)
    // Simulate resend
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-primary/5 to-accent/5">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[420px]"
      >
        <div className="bg-card rounded-2xl border border-border shadow-xl p-8">
          {/* Back Link */}
          <Link 
            href="/auth/login" 
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>

          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex h-14 w-14 rounded-full bg-green-100 items-center justify-center mb-4">
              <MessageCircle className="h-7 w-7 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">Check your WhatsApp</h1>
            <p className="text-sm text-muted-foreground mt-2">
              {"We've sent a 6-digit code to"}
              <br />
              <span className="font-medium text-foreground">+971 {phone}</span>
            </p>
          </div>

          {/* OTP Input */}
          <div className="flex justify-center gap-2 mb-6" onPaste={handlePaste}>
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => { inputRefs.current[index] = el }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-12 h-14 text-center text-xl font-bold rounded-xl border-2 border-border bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                disabled={isLoading}
              />
            ))}
          </div>

          {/* Resend */}
          <div className="text-center mb-6">
            {resendTimer > 0 ? (
              <p className="text-sm text-muted-foreground">
                Resend code in <span className="font-medium">{resendTimer}s</span>
              </p>
            ) : (
              <button
                onClick={handleResend}
                className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
              >
                <RefreshCw className="h-4 w-4" />
                Resend code
              </button>
            )}
          </div>

          {/* Verify Button */}
          <Button 
            size="lg" 
            className="w-full h-12"
            disabled={isLoading || otp.some(d => !d)}
            onClick={() => handleVerify(otp.join(''))}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                Verifying...
              </span>
            ) : (
              'Verify & Continue'
            )}
          </Button>

          {/* Help */}
          <p className="text-center text-xs text-muted-foreground mt-6">
            {"Didn't receive the code?"}{' '}
            <a href="https://wa.me/971501234567" className="text-primary hover:underline">
              Contact support
            </a>
          </p>
        </div>
      </motion.div>
    </div>
  )
}

export default function CustomerVerifyPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><span className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>}>
      <VerifyContent />
    </Suspense>
  )
}
