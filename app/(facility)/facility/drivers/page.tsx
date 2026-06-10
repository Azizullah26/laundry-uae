'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Plus, Phone, Star, MoreVertical, Truck, AlertTriangle, Loader2, User, Car } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AvatarCircle } from '@/components/shared/avatar-circle'
import { mockDrivers } from '@/lib/mock-data'
import { cn } from '@/lib/utils'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import toast from 'react-hot-toast'

interface NewDriver {
  name: string
  phone: string
  password: string
  vehicle_type: string
  vehicle_number: string
}

export default function FacilityDriversPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [drivers, setDrivers] = useState(mockDrivers.filter(d => d.market === 'Dubai').slice(0, 4))
  const [newDriver, setNewDriver] = useState<NewDriver>({
    name: '',
    phone: '',
    password: '',
    vehicle_type: 'motorcycle',
    vehicle_number: '',
  })
  const [facilityToken, setFacilityToken] = useState<string | null>(null)

  // Get facility and token from localStorage
  const [facility, setFacility] = useState<{ id: string; tenant_id: string; name: string } | null>(null)
  
  useEffect(() => {
    const storedFacility = localStorage.getItem('facility')
    const storedToken = localStorage.getItem('facility_token')
    if (storedFacility) {
      setFacility(JSON.parse(storedFacility))
    }
    if (storedToken) {
      setFacilityToken(storedToken)
    }
  }, [])

  const handleCreateDriver = async () => {
    if (!newDriver.name || !newDriver.phone || !newDriver.password) {
      toast.error('Name, phone, and password are required')
      return
    }

    if (newDriver.password.length < 8) {
      toast.error('Password must be at least 8 characters')
      return
    }

    if (!facilityToken) {
      toast.error('Please login first')
      return
    }

    setIsCreating(true)

    try {
      const response = await fetch('/api/facility/drivers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${facilityToken}`,
        },
        body: JSON.stringify(newDriver),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create driver')
      }

      toast.success('Driver created successfully!')
      
      // Add to local list
      setDrivers(prev => [{
        id: data.driver.id,
        name: newDriver.name,
        phone: newDriver.phone,
        market: 'Dubai',
        status: 'offline',
        score: 0,
        activeJobs: 0,
        completedToday: 0,
        earningsToday: 0,
      }, ...prev])

      // Reset form
      setNewDriver({
        name: '',
        phone: '',
        password: '',
        vehicle_type: 'motorcycle',
        vehicle_number: '',
      })
      setIsCreateModalOpen(false)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to create driver')
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Drivers</h1>
          <p className="text-muted-foreground">Manage your facility&apos;s drivers</p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Driver
        </Button>
      </div>

      {/* Driver Cards */}
      <div className="grid gap-4 lg:grid-cols-2">
        {drivers.map((driver, index) => (
          <motion.div
            key={driver.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-4 rounded-xl bg-card border border-border"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <AvatarCircle name={driver.name} size="lg" />
                  <span className={cn(
                    'absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-card',
                    driver.status === 'online' && 'bg-green-500',
                    driver.status === 'on_delivery' && 'bg-amber-500',
                    driver.status === 'offline' && 'bg-gray-400'
                  )} />
                </div>
                <div>
                  <h3 className="font-semibold">{driver.name}</h3>
                  <p className="text-sm text-muted-foreground">{driver.phone}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={cn(
                      'text-xs px-2 py-0.5 rounded-full capitalize',
                      driver.status === 'online' && 'bg-green-100 text-green-700',
                      driver.status === 'on_delivery' && 'bg-amber-100 text-amber-700',
                      driver.status === 'offline' && 'bg-gray-100 text-gray-700'
                    )}>
                      {driver.status.replace('_', ' ')}
                    </span>
                    <div className="flex items-center gap-1 text-sm">
                      <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                      <span>{(driver.score / 20).toFixed(1)}</span>
                    </div>
                  </div>
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>View Details</DropdownMenuItem>
                  <DropdownMenuItem>Edit Driver</DropdownMenuItem>
                  <DropdownMenuItem className="text-red-600">Remove Driver</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-4 text-center">
              <div className="p-2 rounded-lg bg-muted/50">
                <p className="text-lg font-bold">{driver.activeJobs}</p>
                <p className="text-xs text-muted-foreground">Active</p>
              </div>
              <div className="p-2 rounded-lg bg-muted/50">
                <p className="text-lg font-bold">{driver.completedToday}</p>
                <p className="text-xs text-muted-foreground">Today</p>
              </div>
              <div className="p-2 rounded-lg bg-muted/50">
                <p className="text-lg font-bold">AED {driver.earningsToday}</p>
                <p className="text-xs text-muted-foreground">Earned</p>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-border flex gap-2">
              <Button variant="outline" size="sm" className="flex-1">
                <Phone className="h-4 w-4 mr-2" />
                Call
              </Button>
              <Button variant="outline" size="sm" className="flex-1">
                <Truck className="h-4 w-4 mr-2" />
                Assign Job
              </Button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {drivers.length === 0 && (
        <div className="p-12 rounded-xl bg-muted/50 border border-border text-center">
          <Truck className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No drivers yet</h3>
          <p className="text-muted-foreground mb-4">Add your first driver to start accepting deliveries</p>
          <Button onClick={() => setIsCreateModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Your First Driver
          </Button>
        </div>
      )}

      {/* Add Driver Instructions */}
      <div className="p-6 rounded-xl bg-muted/50 border border-border">
        <div className="flex items-start gap-4">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold">Onboard New Drivers</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Add driver details here to create their account. They&apos;ll receive an SMS with instructions to download the driver app.
            </p>
          </div>
        </div>
      </div>

      {/* Create Driver Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Driver</DialogTitle>
            <DialogDescription>
              Create a new driver account for your facility
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <Label>Driver Name *</Label>
              <div className="relative mt-1.5">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  value={newDriver.name}
                  onChange={(e) => setNewDriver({ ...newDriver, name: e.target.value })}
                  placeholder="Full name"
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <Label>Phone Number *</Label>
              <div className="relative mt-1.5">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  value={newDriver.phone}
                  onChange={(e) => setNewDriver({ ...newDriver, phone: e.target.value })}
                  placeholder="+971 50 123 4567"
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <Label>Password *</Label>
              <div className="relative mt-1.5">
                <Input
                  type="password"
                  value={newDriver.password}
                  onChange={(e) => setNewDriver({ ...newDriver, password: e.target.value })}
                  placeholder="Minimum 8 characters"
                  className="pl-3"
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">Share this password with the driver securely</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Vehicle Type</Label>
                <Select
                  value={newDriver.vehicle_type}
                  onValueChange={(v) => setNewDriver({ ...newDriver, vehicle_type: v })}
                >
                  <SelectTrigger className="mt-1.5">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="motorcycle">Motorcycle</SelectItem>
                    <SelectItem value="car">Car</SelectItem>
                    <SelectItem value="van">Van</SelectItem>
                    <SelectItem value="truck">Truck</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Vehicle Number</Label>
                <div className="relative mt-1.5">
                  <Car className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    value={newDriver.vehicle_number}
                    onChange={(e) => setNewDriver({ ...newDriver, vehicle_number: e.target.value })}
                    placeholder="ABC 1234"
                    className="pl-10"
                  />
                </div>
              </div>
            </div>


          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateDriver} disabled={isCreating}>
              {isCreating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Driver'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
