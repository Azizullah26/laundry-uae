// LaundryKhalas Mock Data

export type OrderStatus = 
  | 'pending' 
  | 'confirmed' 
  | 'assigned' 
  | 'collected' 
  | 'processing' 
  | 'ready' 
  | 'out_for_delivery' 
  | 'delivered' 
  | 'issue'
  | 'cancelled'

export type PPITier = 'Elite' | 'Strong' | 'Watchlist' | 'Risk' | 'Frozen'

export type FacilityModel = 'Model 1' | 'Model 2' | 'Model 3'

export interface OrderItem {
  name: string
  quantity: number
  price: number
}

export interface Order {
  id: string
  customerId: string
  customerName: string
  customerPhone: string
  customerArea: string
  items: OrderItem[]
  total: number
  status: OrderStatus
  serviceType: string
  driverId?: string
  facilityId: string
  facilityName: string
  pickupAddress: string
  deliveryAddress: string
  pickupTime: string
  estimatedDelivery: string
  createdAt: string
  updatedAt: string
  notes?: string
  isExpress: boolean
  market: string
  platformFee: number
  facilityEarnings: number
  driverEarnings?: number
}

export interface Facility {
  id: string
  name: string
  market: string
  model: FacilityModel
  ppiScore: number
  tier: PPITier
  ordersToday: number
  completedToday: number
  revenueToday: number
  address: string
  phone: string
  email: string
  status: 'active' | 'suspended' | 'frozen'
  cityRank: number
  totalFacilities: number
  commissionRate: number
  avgProcessingTime: number
  ppiBreakdown: {
    onTimeProcessing: number
    qualityScore: number
    protocolCompliance: number
    lowComplaints: number
    slaAdherence: number
  }
}

export interface Driver {
  id: string
  name: string
  phone: string
  email: string
  market: string
  score: number
  status: 'online' | 'offline' | 'on_delivery'
  activeJobs: number
  completedToday: number
  earningsToday: number
  lastActive: string
  avatar?: string
  vehicleType: string
  licensePlate: string
  location?: { lat: number; lng: number }
}

export interface AIConversation {
  id: string
  customerPhone: string
  market: string
  intent: 'new_order' | 'tracking' | 'complaint' | 'b2b' | 'general'
  status: 'auto_handled' | 'escalated' | 'open' | 'closed'
  messages: {
    id: string
    sender: 'customer' | 'ai' | 'human'
    humanName?: string
    content: string
    timestamp: string
  }[]
  createdAt: string
  resolvedAt?: string
}

export interface Market {
  id: string
  name: string
  country: string
  status: 'live' | 'setup' | 'coming_soon'
  facilitiesCount: number
  driversCount: number
  dailyOrdersAvg: number
  monthlyRevenue: number
  modelBreakdown: { m1: number; m2: number; m3: number }
}

// Mock Orders
export const mockOrders: Order[] = [
  {
    id: 'LK-2847',
    customerId: 'cust-001',
    customerName: 'Sarah Ahmed',
    customerPhone: '+971501234567',
    customerArea: 'Dubai Marina',
    items: [
      { name: 'Shirts', quantity: 4, price: 15 },
      { name: 'Trousers', quantity: 2, price: 20 }
    ],
    total: 105,
    status: 'processing',
    serviceType: 'Wash & Iron',
    driverId: 'drv-001',
    facilityId: 'fac-001',
    facilityName: 'Al Barsha Express',
    pickupAddress: 'Apartment 12B, Marina Gate 1, Dubai Marina',
    deliveryAddress: 'Apartment 12B, Marina Gate 1, Dubai Marina',
    pickupTime: '2024-05-18T09:00:00Z',
    estimatedDelivery: '2024-05-19T18:00:00Z',
    createdAt: '2024-05-18T08:30:00Z',
    updatedAt: '2024-05-18T10:15:00Z',
    isExpress: false,
    market: 'Dubai',
    platformFee: 21,
    facilityEarnings: 64,
    driverEarnings: 20
  },
  {
    id: 'LK-2831',
    customerId: 'cust-002',
    customerName: 'Mohammed Rashid',
    customerPhone: '+971509876543',
    customerArea: 'JBR',
    items: [
      { name: 'Suit (Dry Clean)', quantity: 2, price: 80 },
      { name: 'Dress', quantity: 1, price: 25 }
    ],
    total: 185,
    status: 'processing',
    serviceType: 'Dry Cleaning',
    driverId: 'drv-002',
    facilityId: 'fac-002',
    facilityName: 'Marina Laundry Hub',
    pickupAddress: 'Unit 45, JBR Walk, Sadaf Tower',
    deliveryAddress: 'Unit 45, JBR Walk, Sadaf Tower',
    pickupTime: '2024-05-18T10:00:00Z',
    estimatedDelivery: '2024-05-20T16:00:00Z',
    createdAt: '2024-05-18T09:15:00Z',
    updatedAt: '2024-05-18T11:30:00Z',
    isExpress: false,
    market: 'Dubai',
    platformFee: 37,
    facilityEarnings: 118,
    driverEarnings: 30
  },
  {
    id: 'LK-2819',
    customerId: 'cust-003',
    customerName: 'Fatima Al Mansouri',
    customerPhone: '+971555123456',
    customerArea: 'Downtown',
    items: [
      { name: 'Shirts', quantity: 5, price: 15 },
      { name: 'T-Shirts', quantity: 3, price: 10 }
    ],
    total: 105,
    status: 'delivered',
    serviceType: 'Wash & Iron',
    driverId: 'drv-003',
    facilityId: 'fac-005',
    facilityName: 'Deira Prestige',
    pickupAddress: 'Boulevard Point, Downtown Dubai',
    deliveryAddress: 'Boulevard Point, Downtown Dubai',
    pickupTime: '2024-05-17T14:00:00Z',
    estimatedDelivery: '2024-05-18T12:00:00Z',
    createdAt: '2024-05-17T13:00:00Z',
    updatedAt: '2024-05-18T11:45:00Z',
    isExpress: true,
    market: 'Dubai',
    platformFee: 21,
    facilityEarnings: 64,
    driverEarnings: 20
  },
  {
    id: 'LK-2863',
    customerId: 'cust-004',
    customerName: 'Ahmad Khalil',
    customerPhone: '+971507654321',
    customerArea: 'DIFC',
    items: [
      { name: 'Bedding Set', quantity: 2, price: 65 },
      { name: 'Duvet', quantity: 1, price: 70 }
    ],
    total: 200,
    status: 'out_for_delivery',
    serviceType: 'Bedding',
    driverId: 'drv-001',
    facilityId: 'fac-001',
    facilityName: 'Al Barsha Express',
    pickupAddress: 'Index Tower, DIFC',
    deliveryAddress: 'Index Tower, DIFC',
    pickupTime: '2024-05-17T08:00:00Z',
    estimatedDelivery: '2024-05-18T14:00:00Z',
    createdAt: '2024-05-17T07:30:00Z',
    updatedAt: '2024-05-18T13:30:00Z',
    isExpress: false,
    market: 'Dubai',
    platformFee: 40,
    facilityEarnings: 130,
    driverEarnings: 30
  },
  {
    id: 'LK-2858',
    customerId: 'cust-005',
    customerName: 'Layla Hassan',
    customerPhone: '+971521234567',
    customerArea: 'Business Bay',
    items: [
      { name: 'Sneakers', quantity: 2, price: 45 }
    ],
    total: 90,
    status: 'pending',
    serviceType: 'Sneaker Cleaning',
    facilityId: 'fac-002',
    facilityName: 'Marina Laundry Hub',
    pickupAddress: 'Executive Towers, Business Bay',
    deliveryAddress: 'Executive Towers, Business Bay',
    pickupTime: '2024-05-18T16:00:00Z',
    estimatedDelivery: '2024-05-20T18:00:00Z',
    createdAt: '2024-05-18T12:00:00Z',
    updatedAt: '2024-05-18T12:00:00Z',
    isExpress: false,
    market: 'Dubai',
    platformFee: 18,
    facilityEarnings: 52,
    driverEarnings: 20
  },
  {
    id: 'LK-2854',
    customerId: 'cust-006',
    customerName: 'Omar Farouk',
    customerPhone: '+971508765432',
    customerArea: 'Al Barsha',
    items: [
      { name: 'Shirts', quantity: 8, price: 15 },
      { name: 'Trousers', quantity: 4, price: 20 }
    ],
    total: 200,
    status: 'confirmed',
    serviceType: 'Wash & Iron',
    driverId: 'drv-004',
    facilityId: 'fac-001',
    facilityName: 'Al Barsha Express',
    pickupAddress: '12 Al Barsha Heights',
    deliveryAddress: '12 Al Barsha Heights',
    pickupTime: '2024-05-18T14:00:00Z',
    estimatedDelivery: '2024-05-19T16:00:00Z',
    createdAt: '2024-05-18T11:00:00Z',
    updatedAt: '2024-05-18T11:30:00Z',
    isExpress: false,
    market: 'Dubai',
    platformFee: 40,
    facilityEarnings: 130,
    driverEarnings: 30
  },
  {
    id: 'LK-2849',
    customerId: 'cust-007',
    customerName: 'Amira Nasser',
    customerPhone: '+971503456789',
    customerArea: 'Palm Jumeirah',
    items: [
      { name: 'Dress', quantity: 3, price: 25 },
      { name: 'Blouse', quantity: 2, price: 20 }
    ],
    total: 115,
    status: 'assigned',
    serviceType: 'Dry Cleaning',
    driverId: 'drv-002',
    facilityId: 'fac-003',
    facilityName: 'JBR Fresh',
    pickupAddress: 'Fairmont Residences, Palm Jumeirah',
    deliveryAddress: 'Fairmont Residences, Palm Jumeirah',
    pickupTime: '2024-05-18T11:00:00Z',
    estimatedDelivery: '2024-05-19T14:00:00Z',
    createdAt: '2024-05-18T09:45:00Z',
    updatedAt: '2024-05-18T10:00:00Z',
    isExpress: false,
    market: 'Dubai',
    platformFee: 23,
    facilityEarnings: 72,
    driverEarnings: 20
  },
  {
    id: 'LK-2843',
    customerId: 'cust-008',
    customerName: 'Khalid Al Mazroui',
    customerPhone: '+971509871234',
    customerArea: 'Jumeirah',
    items: [
      { name: 'Alterations', quantity: 1, price: 50 }
    ],
    total: 70,
    status: 'ready',
    serviceType: 'Alterations',
    driverId: 'drv-003',
    facilityId: 'fac-004',
    facilityName: 'Downtown Care',
    pickupAddress: 'Jumeirah Beach Road Villa 24',
    deliveryAddress: 'Jumeirah Beach Road Villa 24',
    pickupTime: '2024-05-17T10:00:00Z',
    estimatedDelivery: '2024-05-18T15:00:00Z',
    createdAt: '2024-05-17T09:00:00Z',
    updatedAt: '2024-05-18T12:00:00Z',
    isExpress: false,
    market: 'Dubai',
    platformFee: 14,
    facilityEarnings: 36,
    driverEarnings: 20
  },
  {
    id: 'LK-2838',
    customerId: 'cust-009',
    customerName: 'Zainab Ibrahim',
    customerPhone: '+971505551234',
    customerArea: 'Motor City',
    items: [
      { name: 'Handbag', quantity: 1, price: 85 }
    ],
    total: 105,
    status: 'collected',
    serviceType: 'Bag Cleaning',
    driverId: 'drv-004',
    facilityId: 'fac-005',
    facilityName: 'Deira Prestige',
    pickupAddress: 'Motor City Green Community',
    deliveryAddress: 'Motor City Green Community',
    pickupTime: '2024-05-17T16:00:00Z',
    estimatedDelivery: '2024-05-19T12:00:00Z',
    createdAt: '2024-05-17T15:00:00Z',
    updatedAt: '2024-05-17T17:00:00Z',
    isExpress: false,
    market: 'Dubai',
    platformFee: 21,
    facilityEarnings: 64,
    driverEarnings: 20
  },
  {
    id: 'LK-2835',
    customerId: 'cust-010',
    customerName: 'Youssef Salim',
    customerPhone: '+971504443210',
    customerArea: 'Abu Dhabi Corniche',
    items: [
      { name: 'Shirts', quantity: 6, price: 15 },
      { name: 'Trousers', quantity: 3, price: 20 }
    ],
    total: 150,
    status: 'processing',
    serviceType: 'Wash & Iron',
    driverId: 'drv-005',
    facilityId: 'fac-006',
    facilityName: 'Abu Dhabi Premium',
    pickupAddress: 'Corniche Tower, Abu Dhabi',
    deliveryAddress: 'Corniche Tower, Abu Dhabi',
    pickupTime: '2024-05-18T08:00:00Z',
    estimatedDelivery: '2024-05-19T14:00:00Z',
    createdAt: '2024-05-18T07:30:00Z',
    updatedAt: '2024-05-18T09:00:00Z',
    isExpress: false,
    market: 'Abu Dhabi',
    platformFee: 30,
    facilityEarnings: 100,
    driverEarnings: 20
  },
  {
    id: 'LK-2829',
    customerId: 'cust-011',
    customerName: 'Huda Al Shamsi',
    customerPhone: '+971506667890',
    customerArea: 'Sharjah Al Majaz',
    items: [
      { name: 'Bedding Set', quantity: 1, price: 55 },
      { name: 'Curtains', quantity: 2, price: 40 }
    ],
    total: 135,
    status: 'issue',
    serviceType: 'Bedding',
    driverId: 'drv-006',
    facilityId: 'fac-007',
    facilityName: 'Sharjah Clean',
    pickupAddress: 'Al Majaz Waterfront, Sharjah',
    deliveryAddress: 'Al Majaz Waterfront, Sharjah',
    pickupTime: '2024-05-17T09:00:00Z',
    estimatedDelivery: '2024-05-18T16:00:00Z',
    createdAt: '2024-05-17T08:00:00Z',
    updatedAt: '2024-05-18T10:00:00Z',
    notes: 'Customer reported stain not removed',
    isExpress: false,
    market: 'Sharjah',
    platformFee: 27,
    facilityEarnings: 88,
    driverEarnings: 20
  },
  {
    id: 'LK-2824',
    customerId: 'cust-012',
    customerName: 'Rania Mahmoud',
    customerPhone: '+971502223344',
    customerArea: 'Dubai Silicon Oasis',
    items: [
      { name: 'Shirts', quantity: 10, price: 15 }
    ],
    total: 170,
    status: 'cancelled',
    serviceType: 'Wash & Iron',
    facilityId: 'fac-001',
    facilityName: 'Al Barsha Express',
    pickupAddress: 'Silicon Heights, DSO',
    deliveryAddress: 'Silicon Heights, DSO',
    pickupTime: '2024-05-18T15:00:00Z',
    estimatedDelivery: '2024-05-19T18:00:00Z',
    createdAt: '2024-05-18T10:30:00Z',
    updatedAt: '2024-05-18T11:00:00Z',
    notes: 'Customer cancelled - changed plans',
    isExpress: false,
    market: 'Dubai',
    platformFee: 0,
    facilityEarnings: 0
  }
]

// Mock Facilities
export const mockFacilities: Facility[] = [
  {
    id: 'fac-001',
    name: 'Al Barsha Express',
    market: 'Dubai',
    model: 'Model 1',
    ppiScore: 91,
    tier: 'Elite',
    ordersToday: 23,
    completedToday: 18,
    revenueToday: 2840,
    address: '15 Al Barsha Industrial Area',
    phone: '+971 4 123 4567',
    email: 'albarsha@laundrykhalas.com',
    status: 'active',
    cityRank: 1,
    totalFacilities: 14,
    commissionRate: 20,
    avgProcessingTime: 2.1,
    ppiBreakdown: {
      onTimeProcessing: 24,
      qualityScore: 19,
      protocolCompliance: 14,
      lowComplaints: 10,
      slaAdherence: 24
    }
  },
  {
    id: 'fac-002',
    name: 'Marina Laundry Hub',
    market: 'Dubai',
    model: 'Model 2',
    ppiScore: 78,
    tier: 'Strong',
    ordersToday: 15,
    completedToday: 11,
    revenueToday: 1890,
    address: 'Marina Walk, Dubai Marina',
    phone: '+971 4 234 5678',
    email: 'marina@laundrykhalas.com',
    status: 'active',
    cityRank: 3,
    totalFacilities: 14,
    commissionRate: 15,
    avgProcessingTime: 2.8,
    ppiBreakdown: {
      onTimeProcessing: 18,
      qualityScore: 17,
      protocolCompliance: 13,
      lowComplaints: 8,
      slaAdherence: 22
    }
  },
  {
    id: 'fac-003',
    name: 'JBR Fresh',
    market: 'Dubai',
    model: 'Model 1',
    ppiScore: 56,
    tier: 'Watchlist',
    ordersToday: 8,
    completedToday: 5,
    revenueToday: 720,
    address: 'JBR Plaza, Jumeirah Beach Residence',
    phone: '+971 4 345 6789',
    email: 'jbr@laundrykhalas.com',
    status: 'active',
    cityRank: 9,
    totalFacilities: 14,
    commissionRate: 20,
    avgProcessingTime: 3.5,
    ppiBreakdown: {
      onTimeProcessing: 12,
      qualityScore: 12,
      protocolCompliance: 10,
      lowComplaints: 6,
      slaAdherence: 16
    }
  },
  {
    id: 'fac-004',
    name: 'Downtown Care',
    market: 'Dubai',
    model: 'Model 2',
    ppiScore: 42,
    tier: 'Risk',
    ordersToday: 4,
    completedToday: 2,
    revenueToday: 340,
    address: 'Downtown Dubai, Burj Khalifa District',
    phone: '+971 4 456 7890',
    email: 'downtown@laundrykhalas.com',
    status: 'active',
    cityRank: 12,
    totalFacilities: 14,
    commissionRate: 15,
    avgProcessingTime: 4.2,
    ppiBreakdown: {
      onTimeProcessing: 8,
      qualityScore: 10,
      protocolCompliance: 8,
      lowComplaints: 4,
      slaAdherence: 12
    }
  },
  {
    id: 'fac-005',
    name: 'Deira Prestige',
    market: 'Dubai',
    model: 'Model 3',
    ppiScore: 95,
    tier: 'Elite',
    ordersToday: 31,
    completedToday: 28,
    revenueToday: 4120,
    address: 'Deira City Centre Area',
    phone: '+971 4 567 8901',
    email: 'deira@laundrykhalas.com',
    status: 'active',
    cityRank: 2,
    totalFacilities: 14,
    commissionRate: 25,
    avgProcessingTime: 1.8,
    ppiBreakdown: {
      onTimeProcessing: 25,
      qualityScore: 20,
      protocolCompliance: 15,
      lowComplaints: 10,
      slaAdherence: 25
    }
  },
  {
    id: 'fac-006',
    name: 'Abu Dhabi Premium',
    market: 'Abu Dhabi',
    model: 'Model 1',
    ppiScore: 87,
    tier: 'Strong',
    ordersToday: 19,
    completedToday: 16,
    revenueToday: 2450,
    address: 'Al Reem Island, Abu Dhabi',
    phone: '+971 2 123 4567',
    email: 'abudhabi@laundrykhalas.com',
    status: 'active',
    cityRank: 1,
    totalFacilities: 8,
    commissionRate: 20,
    avgProcessingTime: 2.3,
    ppiBreakdown: {
      onTimeProcessing: 22,
      qualityScore: 18,
      protocolCompliance: 14,
      lowComplaints: 9,
      slaAdherence: 24
    }
  },
  {
    id: 'fac-007',
    name: 'Sharjah Clean',
    market: 'Sharjah',
    model: 'Model 1',
    ppiScore: 72,
    tier: 'Strong',
    ordersToday: 12,
    completedToday: 9,
    revenueToday: 980,
    address: 'Al Khan, Sharjah',
    phone: '+971 6 123 4567',
    email: 'sharjah@laundrykhalas.com',
    status: 'active',
    cityRank: 1,
    totalFacilities: 5,
    commissionRate: 20,
    avgProcessingTime: 2.9,
    ppiBreakdown: {
      onTimeProcessing: 16,
      qualityScore: 15,
      protocolCompliance: 12,
      lowComplaints: 7,
      slaAdherence: 22
    }
  }
]

// Mock Drivers
export const mockDrivers: Driver[] = [
  {
    id: 'drv-001',
    name: 'Omar Khalid',
    phone: '+971 50 111 2222',
    email: 'omar.k@laundrykhalas.com',
    market: 'Dubai',
    score: 94,
    status: 'on_delivery',
    activeJobs: 2,
    completedToday: 7,
    earningsToday: 245,
    lastActive: '2024-05-18T13:45:00Z',
    vehicleType: 'Van',
    licensePlate: 'Dubai A 12345',
    location: { lat: 25.0778, lng: 55.1313 }
  },
  {
    id: 'drv-002',
    name: 'Tariq Hassan',
    phone: '+971 50 222 3333',
    email: 'tariq.h@laundrykhalas.com',
    market: 'Dubai',
    score: 81,
    status: 'online',
    activeJobs: 1,
    completedToday: 5,
    earningsToday: 180,
    lastActive: '2024-05-18T13:50:00Z',
    vehicleType: 'Motorcycle',
    licensePlate: 'Dubai B 67890',
    location: { lat: 25.0657, lng: 55.1383 }
  },
  {
    id: 'drv-003',
    name: 'Bilal Ahmed',
    phone: '+971 50 333 4444',
    email: 'bilal.a@laundrykhalas.com',
    market: 'Abu Dhabi',
    score: 67,
    status: 'offline',
    activeJobs: 0,
    completedToday: 3,
    earningsToday: 95,
    lastActive: '2024-05-18T11:30:00Z',
    vehicleType: 'Van',
    licensePlate: 'Abu Dhabi 1 54321'
  },
  {
    id: 'drv-004',
    name: 'Faisal Al Rashid',
    phone: '+971 50 444 5555',
    email: 'faisal.r@laundrykhalas.com',
    market: 'Dubai',
    score: 88,
    status: 'on_delivery',
    activeJobs: 1,
    completedToday: 6,
    earningsToday: 210,
    lastActive: '2024-05-18T13:55:00Z',
    vehicleType: 'Van',
    licensePlate: 'Dubai C 11111',
    location: { lat: 25.1124, lng: 55.1390 }
  },
  {
    id: 'drv-005',
    name: 'Mohammed Zayed',
    phone: '+971 50 555 6666',
    email: 'mohammed.z@laundrykhalas.com',
    market: 'Abu Dhabi',
    score: 91,
    status: 'online',
    activeJobs: 1,
    completedToday: 8,
    earningsToday: 290,
    lastActive: '2024-05-18T13:58:00Z',
    vehicleType: 'Van',
    licensePlate: 'Abu Dhabi 2 22222',
    location: { lat: 24.4539, lng: 54.3773 }
  },
  {
    id: 'drv-006',
    name: 'Ali Hussain',
    phone: '+971 50 666 7777',
    email: 'ali.h@laundrykhalas.com',
    market: 'Sharjah',
    score: 76,
    status: 'online',
    activeJobs: 0,
    completedToday: 4,
    earningsToday: 140,
    lastActive: '2024-05-18T13:40:00Z',
    vehicleType: 'Motorcycle',
    licensePlate: 'Sharjah 1 33333',
    location: { lat: 25.3463, lng: 55.4209 }
  },
  {
    id: 'drv-007',
    name: 'Hassan Karim',
    phone: '+971 50 777 8888',
    email: 'hassan.k@laundrykhalas.com',
    market: 'Dubai',
    score: 85,
    status: 'online',
    activeJobs: 0,
    completedToday: 4,
    earningsToday: 155,
    lastActive: '2024-05-18T13:30:00Z',
    vehicleType: 'Van',
    licensePlate: 'Dubai D 44444',
    location: { lat: 25.0862, lng: 55.1482 }
  },
  {
    id: 'drv-008',
    name: 'Saeed Abdullah',
    phone: '+971 50 888 9999',
    email: 'saeed.a@laundrykhalas.com',
    market: 'Dubai',
    score: 72,
    status: 'offline',
    activeJobs: 0,
    completedToday: 2,
    earningsToday: 70,
    lastActive: '2024-05-18T10:15:00Z',
    vehicleType: 'Motorcycle',
    licensePlate: 'Dubai E 55555'
  }
]

// Mock AI Conversations
export const mockConversations: AIConversation[] = [
  {
    id: 'conv-001',
    customerPhone: '+971 50 123 ****',
    market: 'Dubai',
    intent: 'new_order',
    status: 'auto_handled',
    messages: [
      { id: 'msg-1', sender: 'customer', content: 'Hi, I want to get my shirts cleaned', timestamp: '2024-05-18T09:00:00Z' },
      { id: 'msg-2', sender: 'ai', content: 'Hello! I\'d be happy to help you with shirt cleaning. How many shirts would you like cleaned? Our wash & iron service is AED 15 per shirt.', timestamp: '2024-05-18T09:00:02Z' },
      { id: 'msg-3', sender: 'customer', content: '5 shirts please', timestamp: '2024-05-18T09:01:00Z' },
      { id: 'msg-4', sender: 'ai', content: 'Great! That will be AED 75 for 5 shirts. When would you like us to pick them up? We have slots available today and tomorrow.', timestamp: '2024-05-18T09:01:02Z' },
      { id: 'msg-5', sender: 'customer', content: 'Tomorrow morning works', timestamp: '2024-05-18T09:02:00Z' },
      { id: 'msg-6', sender: 'ai', content: 'Perfect! I have booked a pickup for tomorrow between 9:00-11:00 AM. Could you please confirm your address?', timestamp: '2024-05-18T09:02:02Z' }
    ],
    createdAt: '2024-05-18T09:00:00Z',
    resolvedAt: '2024-05-18T09:15:00Z'
  },
  {
    id: 'conv-002',
    customerPhone: '+971 50 987 ****',
    market: 'Dubai',
    intent: 'complaint',
    status: 'escalated',
    messages: [
      { id: 'msg-1', sender: 'customer', content: 'My clothes were not cleaned properly!', timestamp: '2024-05-18T10:00:00Z' },
      { id: 'msg-2', sender: 'ai', content: 'I\'m sorry to hear that you\'re not satisfied with the cleaning. Could you please provide your order number so I can look into this for you?', timestamp: '2024-05-18T10:00:02Z' },
      { id: 'msg-3', sender: 'customer', content: 'Order LK-2819. There are still stains on my white shirt!', timestamp: '2024-05-18T10:01:00Z' },
      { id: 'msg-4', sender: 'ai', content: 'I understand your frustration. Let me escalate this to our quality team who will contact you within the hour to resolve this. Is there anything else I can help with?', timestamp: '2024-05-18T10:01:02Z' },
      { id: 'msg-5', sender: 'human', humanName: 'Mariam (Support)', content: 'Hi, I\'m Mariam from the quality team. I sincerely apologize for this. We\'ll arrange a free re-clean and pickup today. Would 3 PM work for you?', timestamp: '2024-05-18T10:15:00Z' }
    ],
    createdAt: '2024-05-18T10:00:00Z'
  },
  {
    id: 'conv-003',
    customerPhone: '+971 55 512 ****',
    market: 'Dubai',
    intent: 'tracking',
    status: 'auto_handled',
    messages: [
      { id: 'msg-1', sender: 'customer', content: 'Where is my order?', timestamp: '2024-05-18T11:00:00Z' },
      { id: 'msg-2', sender: 'ai', content: 'Let me check that for you. Could you please share your order number or the phone number used for booking?', timestamp: '2024-05-18T11:00:02Z' },
      { id: 'msg-3', sender: 'customer', content: 'LK-2863', timestamp: '2024-05-18T11:01:00Z' },
      { id: 'msg-4', sender: 'ai', content: 'Your order #LK-2863 is currently out for delivery. Driver Omar is on the way and should arrive in approximately 15 minutes. You can track the delivery in real-time here: [tracking link]', timestamp: '2024-05-18T11:01:02Z' }
    ],
    createdAt: '2024-05-18T11:00:00Z',
    resolvedAt: '2024-05-18T11:05:00Z'
  },
  {
    id: 'conv-004',
    customerPhone: '+971 50 444 ****',
    market: 'Abu Dhabi',
    intent: 'b2b',
    status: 'open',
    messages: [
      { id: 'msg-1', sender: 'customer', content: 'Hi, I run a hotel and we need regular laundry service for linens', timestamp: '2024-05-18T12:00:00Z' },
      { id: 'msg-2', sender: 'ai', content: 'Thank you for your interest in our B2B services! We offer special corporate rates for hotels and businesses. Let me connect you with our B2B team who can provide a customized quote. Could you share your hotel name and estimated monthly volume?', timestamp: '2024-05-18T12:00:02Z' },
      { id: 'msg-3', sender: 'customer', content: 'Golden Sands Hotel, around 500 items per week', timestamp: '2024-05-18T12:02:00Z' }
    ],
    createdAt: '2024-05-18T12:00:00Z'
  },
  {
    id: 'conv-005',
    customerPhone: '+971 50 111 ****',
    market: 'Sharjah',
    intent: 'general',
    status: 'auto_handled',
    messages: [
      { id: 'msg-1', sender: 'customer', content: 'What are your prices?', timestamp: '2024-05-18T13:00:00Z' },
      { id: 'msg-2', sender: 'ai', content: 'Here are our standard prices in Sharjah:\n\n• Shirts (Wash & Iron): AED 12\n• Trousers: AED 18\n• Dress: AED 22\n• Suit (Dry Clean): AED 70\n• Bedding Set: AED 55\n\nWould you like to place an order?', timestamp: '2024-05-18T13:00:02Z' }
    ],
    createdAt: '2024-05-18T13:00:00Z',
    resolvedAt: '2024-05-18T13:02:00Z'
  },
  {
    id: 'conv-006',
    customerPhone: '+971 50 666 ****',
    market: 'Dubai',
    intent: 'new_order',
    status: 'open',
    messages: [
      { id: 'msg-1', sender: 'customer', content: 'Can you do same day delivery?', timestamp: '2024-05-18T14:00:00Z' },
      { id: 'msg-2', sender: 'ai', content: 'Yes! We offer Express service for same-day delivery. There\'s an additional AED 30 fee for express processing. Items picked up before 11 AM can be delivered by 7 PM the same day. Would you like to proceed with an express order?', timestamp: '2024-05-18T14:00:02Z' }
    ],
    createdAt: '2024-05-18T14:00:00Z'
  }
]

// Mock Markets
export const mockMarkets: Market[] = [
  {
    id: 'mkt-001',
    name: 'Dubai',
    country: 'UAE',
    status: 'live',
    facilitiesCount: 14,
    driversCount: 28,
    dailyOrdersAvg: 156,
    monthlyRevenue: 485000,
    modelBreakdown: { m1: 60, m2: 30, m3: 10 }
  },
  {
    id: 'mkt-002',
    name: 'Abu Dhabi',
    country: 'UAE',
    status: 'live',
    facilitiesCount: 8,
    driversCount: 15,
    dailyOrdersAvg: 82,
    monthlyRevenue: 245000,
    modelBreakdown: { m1: 70, m2: 25, m3: 5 }
  },
  {
    id: 'mkt-003',
    name: 'Sharjah',
    country: 'UAE',
    status: 'live',
    facilitiesCount: 5,
    driversCount: 10,
    dailyOrdersAvg: 45,
    monthlyRevenue: 125000,
    modelBreakdown: { m1: 80, m2: 20, m3: 0 }
  },
  {
    id: 'mkt-004',
    name: 'Riyadh',
    country: 'KSA',
    status: 'setup',
    facilitiesCount: 2,
    driversCount: 4,
    dailyOrdersAvg: 0,
    monthlyRevenue: 0,
    modelBreakdown: { m1: 100, m2: 0, m3: 0 }
  },
  {
    id: 'mkt-005',
    name: 'Doha',
    country: 'Qatar',
    status: 'coming_soon',
    facilitiesCount: 0,
    driversCount: 0,
    dailyOrdersAvg: 0,
    monthlyRevenue: 0,
    modelBreakdown: { m1: 0, m2: 0, m3: 0 }
  }
]

// Service Types with Pricing
export const serviceTypes = [
  { id: 'wash-iron', name: 'Wash & Iron', icon: '👕', description: 'Most popular', basePrice: 15 },
  { id: 'dry-clean', name: 'Dry Cleaning', icon: '👔', description: 'Premium care', basePrice: 40 },
  { id: 'bedding', name: 'Bedding', icon: '🛏', description: 'Duvet, sheets & more', basePrice: 55 },
  { id: 'sneakers', name: 'Sneaker Cleaning', icon: '👟', description: 'Restore them', basePrice: 45 },
  { id: 'alterations', name: 'Alterations', icon: '🪡', description: 'Tailoring & repairs', basePrice: 30 },
  { id: 'bags', name: 'Bag Cleaning', icon: '💼', description: 'Handbags & luggage', basePrice: 75 }
]

// Items for order creation
export const orderItems = {
  'wash-iron': [
    { id: 'shirt', name: 'Shirt', price: 15 },
    { id: 'trouser', name: 'Trouser', price: 20 },
    { id: 't-shirt', name: 'T-Shirt', price: 10 },
    { id: 'jeans', name: 'Jeans', price: 25 },
    { id: 'polo', name: 'Polo Shirt', price: 15 }
  ],
  'dry-clean': [
    { id: 'suit', name: 'Suit (2 piece)', price: 80 },
    { id: 'dress', name: 'Dress', price: 25 },
    { id: 'coat', name: 'Coat', price: 60 },
    { id: 'blazer', name: 'Blazer', price: 45 },
    { id: 'gown', name: 'Evening Gown', price: 55 }
  ],
  'bedding': [
    { id: 'bedding-set', name: 'Bedding Set', price: 65 },
    { id: 'duvet', name: 'Duvet', price: 70 },
    { id: 'sheets', name: 'Bed Sheets (pair)', price: 30 },
    { id: 'pillow', name: 'Pillow', price: 20 },
    { id: 'curtains', name: 'Curtains (pair)', price: 40 }
  ],
  'sneakers': [
    { id: 'sneakers-basic', name: 'Basic Clean', price: 45 },
    { id: 'sneakers-deep', name: 'Deep Clean', price: 65 },
    { id: 'sneakers-premium', name: 'Premium Restoration', price: 95 }
  ],
  'alterations': [
    { id: 'hem', name: 'Hem Adjustment', price: 30 },
    { id: 'waist', name: 'Waist Adjustment', price: 35 },
    { id: 'zipper', name: 'Zipper Replacement', price: 25 },
    { id: 'button', name: 'Button Replacement', price: 10 }
  ],
  'bags': [
    { id: 'handbag', name: 'Handbag', price: 85 },
    { id: 'backpack', name: 'Backpack', price: 65 },
    { id: 'luggage', name: 'Luggage', price: 120 }
  ]
}

// Dashboard metrics
export const dashboardMetrics = {
  liveOrders: 47,
  todayRevenue: 12450,
  activeDrivers: 23,
  driversOnDelivery: 8,
  aiAutoRate: 91.4,
  openIssues: 3,
  criticalIssues: 1
}

// Helper functions
export function getStatusColor(status: OrderStatus): string {
  const colors: Record<OrderStatus, string> = {
    pending: 'bg-gray-500',
    confirmed: 'bg-blue-500',
    assigned: 'bg-indigo-500',
    collected: 'bg-amber-500',
    processing: 'bg-amber-500',
    ready: 'bg-green-500',
    out_for_delivery: 'bg-green-500',
    delivered: 'bg-emerald-600',
    issue: 'bg-red-500',
    cancelled: 'bg-gray-400'
  }
  return colors[status]
}

export function getTierColor(tier: PPITier): string {
  const colors: Record<PPITier, string> = {
    Elite: 'bg-yellow-500 text-yellow-950',
    Strong: 'bg-green-500 text-white',
    Watchlist: 'bg-amber-500 text-amber-950',
    Risk: 'bg-orange-500 text-white',
    Frozen: 'bg-red-500 text-white'
  }
  return colors[tier]
}

export function formatCurrency(amount: number, currency = 'AED'): string {
  return `${currency} ${amount.toLocaleString()}`
}

export function formatPhoneNumber(phone: string): string {
  return phone.replace(/(\+971)(\d{2})(\d{3})(\d{4})/, '$1 $2 $3 $4')
}

export type TransactionType = 'order_payment' | 'payout' | 'refund'
export type TransactionStatus = 'completed' | 'pending' | 'failed'

export interface Transaction {
  id: string
  type: TransactionType
  status: TransactionStatus
  amount: number
  description: string
  date: string
}

export const mockTransactions: Transaction[] = [
  { id: 'TXN-100245', type: 'order_payment', status: 'completed', amount: 156.50, description: 'Order LK-3421 - Wash & Fold', date: '2026-05-18' },
  { id: 'TXN-100244', type: 'payout', status: 'pending', amount: 4250.00, description: 'Weekly payout to Sparkle Laundry', date: '2026-05-18' },
  { id: 'TXN-100243', type: 'order_payment', status: 'completed', amount: 89.00, description: 'Order LK-3420 - Dry Clean', date: '2026-05-17' },
  { id: 'TXN-100242', type: 'refund', status: 'completed', amount: 45.00, description: 'Refund for cancelled order LK-3398', date: '2026-05-17' },
  { id: 'TXN-100241', type: 'order_payment', status: 'completed', amount: 220.75, description: 'Order LK-3419 - Premium service', date: '2026-05-17' },
  { id: 'TXN-100240', type: 'payout', status: 'completed', amount: 3120.00, description: 'Weekly payout to Crystal Clean', date: '2026-05-16' },
  { id: 'TXN-100239', type: 'order_payment', status: 'pending', amount: 175.25, description: 'Order LK-3418 - Ironing service', date: '2026-05-16' },
  { id: 'TXN-100238', type: 'order_payment', status: 'failed', amount: 95.50, description: 'Order LK-3417 - Card declined', date: '2026-05-16' },
  { id: 'TXN-100237', type: 'order_payment', status: 'completed', amount: 312.00, description: 'Order LK-3416 - Bulk wash', date: '2026-05-15' },
  { id: 'TXN-100236', type: 'payout', status: 'completed', amount: 2890.50, description: 'Driver payout - May Week 2', date: '2026-05-15' },
  { id: 'TXN-100235', type: 'refund', status: 'pending', amount: 67.25, description: 'Partial refund for order LK-3411', date: '2026-05-15' },
  { id: 'TXN-100234', type: 'order_payment', status: 'completed', amount: 142.00, description: 'Order LK-3415 - Standard wash', date: '2026-05-14' },
]
