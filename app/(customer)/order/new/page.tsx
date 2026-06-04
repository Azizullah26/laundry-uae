'use client'

import { useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ArrowLeft, ArrowRight, MapPin, Calendar, CreditCard, 
  Check, Minus, Plus, Clock, Zap, AlertCircle, Phone, User, Globe
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { serviceTypes, orderItems } from '@/lib/mock-data'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import toast from 'react-hot-toast'

type OrderItem = {
  id: string
  name: string
  quantity: number
  price: number
}

function NewOrderContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const initialService = searchParams.get('service') || 'wash-iron'
  const isExpress = searchParams.get('express') === 'true'

  const [step, setStep] = useState(1)
  const [selectedService, setSelectedService] = useState(initialService)
  const [items, setItems] = useState<OrderItem[]>([])
  const [notes, setNotes] = useState('')
  
  // Customer info (no login required)
  const [customerPhone, setCustomerPhone] = useState('')
  const [customerName, setCustomerName] = useState('')
  
  // Address
  const [address, setAddress] = useState('')
  const [addressDetails, setAddressDetails] = useState('')
  const [latitude, setLatitude] = useState<number | null>(null)
  const [longitude, setLongitude] = useState<number | null>(null)
  
  // Schedule
  const [pickupDate, setPickupDate] = useState<string>('')
  const [pickupSlot, setPickupSlot] = useState<string>('')
  const [expressService, setExpressService] = useState(isExpress)
  
  // Payment
  const [promoCode, setPromoCode] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('cash')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const serviceItems = orderItems[selectedService as keyof typeof orderItems] || []

  const updateItemQuantity = (itemId: string, delta: number) => {
    setItems(prev => {
      const existing = prev.find(i => i.id === itemId)
      if (existing) {
        const newQty = existing.quantity + delta
        if (newQty <= 0) {
          return prev.filter(i => i.id !== itemId)
        }
        return prev.map(i => i.id === itemId ? { ...i, quantity: newQty } : i)
      } else if (delta > 0) {
        const itemInfo = serviceItems.find(si => si.id === itemId)
        if (itemInfo) {
          return [...prev, { id: itemId, name: itemInfo.name, quantity: 1, price: itemInfo.price }]
        }
      }
      return prev
    })
  }

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const deliveryFee = 20
  const expressFee = expressService ? 30 : 0
  const total = subtotal + deliveryFee + expressFee

  const dates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() + i)
    return {
      value: date.toISOString().split('T')[0],
      label: i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
      available: i !== 0 || new Date().getHours() < 14
    }
  })

  const timeSlots = [
    { value: '08:00-11:00', label: '08:00 - 11:00', available: true },
    { value: '11:00-14:00', label: '11:00 - 14:00', available: true },
    { value: '14:00-17:00', label: '14:00 - 17:00', available: true },
    { value: '17:00-20:00', label: '17:00 - 20:00', available: pickupDate !== dates[0].value }
  ]

  // Get current location
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude)
          setLongitude(position.coords.longitude)
          toast.success('Location captured!')
        },
        (error) => {
          toast.error('Failed to get location')
        }
      )
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_phone: customerPhone,
          customer_name: customerName,
          customer_address: address + (addressDetails ? `, ${addressDetails}` : ''),
          customer_latitude: latitude,
          customer_longitude: longitude,
          service_type: selectedService,
          items: items,
          special_instructions: notes,
          pickup_date: pickupDate,
          pickup_time_slot: pickupSlot,
          delivery_date: new Date(new Date(pickupDate).getTime() + (expressService ? 8 : 24) * 60 * 60 * 1000).toISOString().split('T')[0],
          delivery_time_slot: pickupSlot,
          subtotal: subtotal,
          delivery_fee: deliveryFee,
          discount: 0,
          total: total,
          payment_method: paymentMethod,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create order')
      }

      toast.success('Order placed successfully!')
      router.push(`/order/${data.order_number}/track`)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to place order')
      setIsSubmitting(false)
    }
  }

  const canProceed = () => {
    switch (step) {
      case 1: return items.length > 0
      case 2: return customerPhone.length >= 10 && customerName.length >= 2 && address.length > 5
      case 3: return pickupDate && pickupSlot
      case 4: return paymentMethod
      default: return false
    }
  }

  return (
    <div className="min-h-screen pb-32">
      {/* Progress Bar */}
      <div className="sticky top-14 z-40 bg-background border-b border-border">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Step {step} of 4</span>
            <span className="text-sm text-muted-foreground">
              {step === 1 && 'Select Items'}
              {step === 2 && 'Your Details'}
              {step === 3 && 'Schedule'}
              {step === 4 && 'Review & Pay'}
            </span>
          </div>
          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-primary rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${(step / 4) * 100}%` }}
            />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <AnimatePresence mode="wait">
          {/* Step 1: Select Services */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              {/* Service Type Selector */}
              <div className="flex gap-2 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
                {serviceTypes.map((service) => (
                  <button
                    key={service.id}
                    onClick={() => {
                      setSelectedService(service.id)
                      setItems([])
                    }}
                    className={cn(
                      'flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium border transition-colors',
                      selectedService === service.id
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'bg-card border-border hover:border-primary/50'
                    )}
                  >
                    {service.icon} {service.name}
                  </button>
                ))}
              </div>

              {/* Items */}
              <div className="space-y-3 mt-4">
                {serviceItems.map((item) => {
                  const currentItem = items.find(i => i.id === item.id)
                  const quantity = currentItem?.quantity || 0
                  return (
                    <div 
                      key={item.id}
                      className="flex items-center justify-between p-4 bg-card rounded-xl border border-border"
                    >
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-muted-foreground">AED {item.price} each</p>
                      </div>
                      <div className="flex items-center gap-3">
                        {quantity > 0 && (
                          <span className="text-sm font-medium text-primary">
                            AED {item.price * quantity}
                          </span>
                        )}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateItemQuantity(item.id, -1)}
                            disabled={quantity === 0}
                            className="h-8 w-8 rounded-full border border-border flex items-center justify-center hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="w-6 text-center font-medium">{quantity}</span>
                          <button
                            onClick={() => updateItemQuantity(item.id, 1)}
                            className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Notes */}
              <div className="mt-6">
                <label className="text-sm font-medium">Special Instructions (optional)</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="E.g., starch shirts, handle with care..."
                  className="mt-1.5 w-full h-20 px-4 py-3 rounded-xl border border-border bg-background resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </motion.div>
          )}

          {/* Step 2: Customer Details & Address */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
                <p className="text-sm text-primary font-medium flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  No account needed - just enter your details
                </p>
              </div>

              {/* Customer Info */}
              <div className="space-y-4">
                <div>
                  <Label>Your Name *</Label>
                  <div className="relative mt-1.5">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Enter your full name"
                      className="pl-12 h-12"
                    />
                  </div>
                </div>

                <div>
                  <Label>Mobile Number *</Label>
                  <div className="relative mt-1.5">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      type="tel"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="+971 50 123 4567"
                      className="pl-12 h-12"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">We&apos;ll send order updates to this number</p>
                </div>
              </div>

              {/* Address */}
              <div className="pt-4 border-t border-border">
                <div className="flex items-center justify-between mb-2">
                  <Label>Pickup Address *</Label>
                  <Button type="button" variant="ghost" size="sm" onClick={getCurrentLocation}>
                    <Globe className="h-4 w-4 mr-1" />
                    Use Current Location
                  </Button>
                </div>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Building, Street, Area"
                    className="pl-12 h-12"
                  />
                </div>
              </div>

              {/* Map Preview Placeholder */}
              <div className="h-48 rounded-xl bg-muted flex items-center justify-center">
                {latitude && longitude ? (
                  <div className="text-center">
                    <MapPin className="h-8 w-8 text-primary mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Location captured</p>
                  </div>
                ) : (
                  <MapPin className="h-8 w-8 text-muted-foreground" />
                )}
              </div>

              {/* Service Zone Status */}
              {address.length > 5 && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-green-50 border border-green-200">
                  <Check className="h-5 w-5 text-green-600" />
                  <span className="text-sm text-green-700 font-medium">We deliver to this area</span>
                </div>
              )}

              <div>
                <Label>Apartment / Floor / Building</Label>
                <Input
                  value={addressDetails}
                  onChange={(e) => setAddressDetails(e.target.value)}
                  placeholder="E.g., Apartment 12B, 3rd Floor"
                  className="mt-1.5 h-12"
                />
              </div>
            </motion.div>
          )}

          {/* Step 3: Schedule */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              {/* Date Selection */}
              <div>
                <label className="text-sm font-medium">Pickup Date</label>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {dates.slice(0, 6).map((date) => (
                    <button
                      key={date.value}
                      onClick={() => date.available && setPickupDate(date.value)}
                      disabled={!date.available}
                      className={cn(
                        'p-3 rounded-xl border text-sm font-medium transition-colors',
                        pickupDate === date.value
                          ? 'bg-primary text-primary-foreground border-primary'
                          : date.available
                          ? 'bg-card border-border hover:border-primary/50'
                          : 'bg-muted border-border text-muted-foreground cursor-not-allowed line-through'
                      )}
                    >
                      {date.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Time Slots */}
              <div>
                <label className="text-sm font-medium">Pickup Time Slot</label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {timeSlots.map((slot) => (
                    <button
                      key={slot.value}
                      onClick={() => slot.available && setPickupSlot(slot.value)}
                      disabled={!slot.available}
                      className={cn(
                        'p-4 rounded-xl border text-sm font-medium transition-colors flex items-center justify-center gap-2',
                        pickupSlot === slot.value
                          ? 'bg-primary text-primary-foreground border-primary'
                          : slot.available
                          ? 'bg-card border-border hover:border-primary/50'
                          : 'bg-muted border-border text-muted-foreground cursor-not-allowed line-through'
                      )}
                    >
                      <Clock className="h-4 w-4" />
                      {slot.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Estimated Delivery */}
              {pickupDate && (
                <div className="p-4 rounded-xl bg-secondary">
                  <p className="text-sm text-muted-foreground">Estimated delivery</p>
                  <p className="font-semibold text-foreground">
                    {new Date(new Date(pickupDate).getTime() + (expressService ? 8 : 24) * 60 * 60 * 1000).toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>
                </div>
              )}

              {/* Express Option */}
              <div 
                onClick={() => setExpressService(!expressService)}
                className={cn(
                  'p-4 rounded-xl border-2 cursor-pointer transition-all',
                  expressService
                    ? 'border-amber-500 bg-amber-50'
                    : 'border-border hover:border-amber-300'
                )}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      'h-10 w-10 rounded-full flex items-center justify-center',
                      expressService ? 'bg-amber-500 text-white' : 'bg-muted'
                    )}>
                      <Zap className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-semibold">Express Service</p>
                      <p className="text-sm text-muted-foreground">Same-day delivery</p>
                    </div>
                  </div>
                  <span className="font-bold text-amber-600">+AED 30</span>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 4: Review & Pay */}
          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              {/* Customer Info */}
              <div className="p-4 rounded-xl bg-card border border-border space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{customerName}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{customerPhone}</span>
                </div>
              </div>

              {/* Order Summary */}
              <div className="p-4 rounded-xl bg-card border border-border space-y-4">
                <h3 className="font-semibold">Order Summary</h3>
                
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span>{item.name} x {item.quantity}</span>
                    <span>AED {item.price * item.quantity}</span>
                  </div>
                ))}

                <div className="pt-3 border-t border-border space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Pickup & Delivery</span>
                    <span>AED {deliveryFee}</span>
                  </div>
                  {expressService && (
                    <div className="flex justify-between text-sm">
                      <span className="text-amber-600">Express Service</span>
                      <span className="text-amber-600">AED {expressFee}</span>
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-border flex justify-between font-bold">
                  <span>Total</span>
                  <span className="text-primary">AED {total}</span>
                </div>
              </div>

              {/* Pickup Details */}
              <div className="p-4 rounded-xl bg-card border border-border space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{address}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>
                    {new Date(pickupDate).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}, {pickupSlot}
                  </span>
                </div>
              </div>

              {/* Promo Code */}
              <div className="flex gap-2">
                <Input
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  placeholder="Promo code"
                  className="h-12"
                />
                <Button variant="outline" className="h-12 px-6">Apply</Button>
              </div>

              {/* Payment Method */}
              <div className="space-y-2">
                <h3 className="font-semibold">Payment Method</h3>
                {[
                  { id: 'cash', label: 'Cash on Delivery', icon: () => <span className="text-lg">AED</span> },
                  { id: 'card', label: 'Card', icon: CreditCard },
                  { id: 'apple', label: 'Apple Pay', icon: () => <span className="text-lg"></span> },
                ].map((method) => (
                  <button
                    key={method.id}
                    onClick={() => setPaymentMethod(method.id)}
                    className={cn(
                      'w-full p-4 rounded-xl border flex items-center gap-3 transition-colors',
                      paymentMethod === method.id
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    )}
                  >
                    <div className={cn(
                      'h-5 w-5 rounded-full border-2 flex items-center justify-center',
                      paymentMethod === method.id ? 'border-primary' : 'border-muted-foreground'
                    )}>
                      {paymentMethod === method.id && (
                        <div className="h-2.5 w-2.5 rounded-full bg-primary" />
                      )}
                    </div>
                    <method.icon className="h-5 w-5" />
                    <span className="font-medium">{method.label}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Bar */}
      <div className="fixed bottom-16 left-0 right-0 bg-background border-t border-border p-4 safe-area-pb">
        <div className="container mx-auto flex items-center justify-between gap-4">
          {step > 1 ? (
            <Button
              variant="outline"
              onClick={() => setStep(step - 1)}
              className="flex-1"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          ) : (
            <Link href="/" className="flex-1">
              <Button variant="outline" className="w-full">
                Cancel
              </Button>
            </Link>
          )}
          
          <div className="flex-1 text-center">
            {step < 4 && subtotal > 0 && (
              <p className="text-sm">
                <span className="text-muted-foreground">Subtotal: </span>
                <span className="font-semibold">AED {subtotal}</span>
              </p>
            )}
          </div>

          {step < 4 ? (
            <Button
              onClick={() => setStep(step + 1)}
              disabled={!canProceed()}
              className="flex-1"
            >
              Continue
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  Processing...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Check className="h-4 w-4" />
                  Confirm & Pay AED {total}
                </span>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

export default function NewOrderPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><span className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>}>
      <NewOrderContent />
    </Suspense>
  )
}
