'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Building2, Clock, DollarSign, Bell, FileText, CreditCard, Save, Upload } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { mockFacilities } from '@/lib/mock-data'
import { cn } from '@/lib/utils'

type Tab = 'profile' | 'pricing' | 'availability' | 'notifications' | 'documents' | 'payment'

export default function FacilitySettingsPage() {
  const facility = mockFacilities[0]
  const [activeTab, setActiveTab] = useState<Tab>('profile')
  const [isSaving, setIsSaving] = useState(false)

  const tabs: { value: Tab; label: string; icon: React.ElementType }[] = [
    { value: 'profile', label: 'Profile', icon: Building2 },
    { value: 'pricing', label: 'Pricing', icon: DollarSign },
    { value: 'availability', label: 'Availability', icon: Clock },
    { value: 'notifications', label: 'Notifications', icon: Bell },
    { value: 'documents', label: 'Documents', icon: FileText },
    { value: 'payment', label: 'Payment', icon: CreditCard }
  ]

  const handleSave = async () => {
    setIsSaving(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsSaving(false)
  }

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 lg:mx-0 lg:px-0">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors',
              activeTab === tab.value
                ? 'bg-primary text-primary-foreground'
                : 'bg-card border border-border hover:border-primary/50'
            )}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card rounded-xl border border-border p-6"
      >
        {activeTab === 'profile' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold mb-4">Facility Profile</h2>
              <div className="grid gap-4 lg:grid-cols-2">
                <div>
                  <label className="text-sm font-medium">Facility Name</label>
                  <Input defaultValue={facility.name} className="mt-1.5" />
                </div>
                <div>
                  <label className="text-sm font-medium">Email</label>
                  <Input defaultValue={facility.email} className="mt-1.5" />
                </div>
                <div>
                  <label className="text-sm font-medium">Phone</label>
                  <Input defaultValue={facility.phone} className="mt-1.5" />
                </div>
                <div>
                  <label className="text-sm font-medium">Address</label>
                  <Input defaultValue={facility.address} className="mt-1.5" />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold mb-3">Facility Photos</h3>
              <div className="grid grid-cols-3 gap-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="aspect-video rounded-lg bg-muted flex items-center justify-center border-2 border-dashed border-border hover:border-primary/50 cursor-pointer transition-colors">
                    <Upload className="h-6 w-6 text-muted-foreground" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'pricing' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Pricing</h2>
              <p className="text-sm text-muted-foreground">All prices in AED</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium">Item</th>
                    <th className="px-4 py-3 text-right text-sm font-medium">Price</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {[
                    { item: 'Shirt (Wash & Iron)', price: 15 },
                    { item: 'Trouser', price: 20 },
                    { item: 'Dress', price: 25 },
                    { item: 'Suit (Dry Clean)', price: 80 },
                    { item: 'Bedding Set', price: 65 }
                  ].map((row) => (
                    <tr key={row.item}>
                      <td className="px-4 py-3 text-sm">{row.item}</td>
                      <td className="px-4 py-3 text-right">
                        <Input 
                          type="number" 
                          defaultValue={row.price} 
                          className="w-24 text-right ml-auto" 
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div>
              <label className="text-sm font-medium">Minimum Order Value</label>
              <Input type="number" defaultValue={50} className="mt-1.5 w-32" />
            </div>
          </div>
        )}

        {activeTab === 'availability' && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold">Operating Hours</h2>
            <div className="space-y-3">
              {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
                <div key={day} className="flex items-center gap-4">
                  <span className="w-24 text-sm font-medium">{day}</span>
                  <Input type="time" defaultValue="08:00" className="w-32" />
                  <span className="text-muted-foreground">to</span>
                  <Input type="time" defaultValue="20:00" className="w-32" />
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" defaultChecked className="rounded" />
                    Open
                  </label>
                </div>
              ))}
            </div>
            <div>
              <label className="text-sm font-medium">Maximum Daily Capacity</label>
              <Input type="number" defaultValue={50} className="mt-1.5 w-32" />
              <p className="text-xs text-muted-foreground mt-1">Orders per day</p>
            </div>
          </div>
        )}

        {activeTab === 'notifications' && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold">Notification Preferences</h2>
            <div className="space-y-4">
              {[
                { label: 'New order alerts', description: 'Get notified when a new order is assigned' },
                { label: 'SLA warnings', description: 'Alert when an order is approaching SLA breach' },
                { label: 'Payment notifications', description: 'Receive payout confirmations' },
                { label: 'Performance updates', description: 'Weekly PPI score updates' }
              ].map((item) => (
                <div key={item.label} className="flex items-start justify-between p-4 rounded-lg border border-border">
                  <div>
                    <p className="font-medium">{item.label}</p>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked className="sr-only peer" />
                    <div className="w-11 h-6 bg-muted rounded-full peer peer-checked:bg-primary after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full" />
                  </label>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'documents' && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold">Business Documents</h2>
            <div className="grid gap-4 lg:grid-cols-2">
              <div className="p-4 rounded-lg border border-border">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium">Trade License</h3>
                  <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700">Valid</span>
                </div>
                <p className="text-sm text-muted-foreground mb-3">Expires: Dec 31, 2024</p>
                <Button variant="outline" size="sm">
                  <Upload className="h-4 w-4 mr-2" />
                  Update
                </Button>
              </div>
              <div className="p-4 rounded-lg border border-border">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium">Insurance Certificate</h3>
                  <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700">Valid</span>
                </div>
                <p className="text-sm text-muted-foreground mb-3">Expires: Jun 30, 2025</p>
                <Button variant="outline" size="sm">
                  <Upload className="h-4 w-4 mr-2" />
                  Update
                </Button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'payment' && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold">Payment Settings</h2>
            <div className="grid gap-4 lg:grid-cols-2">
              <div>
                <label className="text-sm font-medium">Bank Name</label>
                <Input defaultValue="Emirates NBD" className="mt-1.5" />
              </div>
              <div>
                <label className="text-sm font-medium">Account Number</label>
                <Input defaultValue="••••••••4521" className="mt-1.5" />
              </div>
              <div>
                <label className="text-sm font-medium">IBAN</label>
                <Input defaultValue="AE••••••••••••••••4521" className="mt-1.5" />
              </div>
              <div>
                <label className="text-sm font-medium">Payout Frequency</label>
                <select className="mt-1.5 w-full h-10 rounded-lg border border-input bg-background px-3 text-sm">
                  <option>Daily (T+1)</option>
                  <option>Weekly</option>
                  <option>Bi-weekly</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </motion.div>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? (
            <span className="flex items-center gap-2">
              <span className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              Saving...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Save className="h-4 w-4" />
              Save Changes
            </span>
          )}
        </Button>
      </div>
    </div>
  )
}
