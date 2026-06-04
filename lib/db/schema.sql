-- LaundryKhalas Database Schema for Nile

-- Admin Users table (platform-level, not tenant-specific)
CREATE TABLE IF NOT EXISTS admins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  role VARCHAR(50) DEFAULT 'super_admin',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default admin (password: Swat26118@)
-- Password hash for 'Swat26118@' using bcrypt
INSERT INTO admins (username, password_hash, email, role) 
VALUES ('Aziz', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X.qvhj3BpZO6H8O5S', 'admin@laundrykhalas.com', 'super_admin')
ON CONFLICT (username) DO NOTHING;

-- Facilities table (tenant-aware - each facility is a tenant)
CREATE TABLE IF NOT EXISTS facilities (
  tenant_id UUID NOT NULL,
  id UUID DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  username VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(50),
  logo_url TEXT,
  address TEXT,
  city VARCHAR(100),
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  service_radius_km DECIMAL(5, 2) DEFAULT 10.00,
  status VARCHAR(50) DEFAULT 'pending',
  rating DECIMAL(3, 2) DEFAULT 0.00,
  total_orders INT DEFAULT 0,
  services_offered JSONB DEFAULT '[]'::jsonb,
  operating_hours JSONB DEFAULT '{}'::jsonb,
  commission_rate DECIMAL(5, 2) DEFAULT 15.00,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (tenant_id, id),
  UNIQUE (tenant_id, username)
);

-- Drivers table (tenant-aware - belongs to facilities)
CREATE TABLE IF NOT EXISTS drivers (
  tenant_id UUID NOT NULL,
  id UUID DEFAULT gen_random_uuid(),
  facility_id UUID NOT NULL,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  email VARCHAR(255),
  vehicle_type VARCHAR(50),
  vehicle_number VARCHAR(50),
  license_number VARCHAR(100),
  status VARCHAR(50) DEFAULT 'offline',
  current_latitude DECIMAL(10, 8),
  current_longitude DECIMAL(11, 8),
  total_deliveries INT DEFAULT 0,
  rating DECIMAL(3, 2) DEFAULT 0.00,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (tenant_id, id),
  UNIQUE (tenant_id, phone)
);

-- Customers table (platform-level)
CREATE TABLE IF NOT EXISTS customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone VARCHAR(50) UNIQUE NOT NULL,
  password_hash VARCHAR(255),
  name VARCHAR(255),
  email VARCHAR(255),
  default_address TEXT,
  default_latitude DECIMAL(10, 8),
  default_longitude DECIMAL(11, 8),
  total_orders INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Orders table (platform-level with facility reference)
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number VARCHAR(50) UNIQUE NOT NULL,
  customer_id UUID REFERENCES customers(id),
  customer_phone VARCHAR(50) NOT NULL,
  customer_name VARCHAR(255),
  customer_address TEXT NOT NULL,
  customer_latitude DECIMAL(10, 8),
  customer_longitude DECIMAL(11, 8),
  facility_id UUID,
  driver_id UUID,
  status VARCHAR(50) DEFAULT 'pending',
  service_type VARCHAR(100),
  items JSONB DEFAULT '[]'::jsonb,
  special_instructions TEXT,
  pickup_date DATE,
  pickup_time_slot VARCHAR(50),
  delivery_date DATE,
  delivery_time_slot VARCHAR(50),
  subtotal DECIMAL(10, 2) DEFAULT 0.00,
  delivery_fee DECIMAL(10, 2) DEFAULT 0.00,
  discount DECIMAL(10, 2) DEFAULT 0.00,
  total DECIMAL(10, 2) DEFAULT 0.00,
  payment_method VARCHAR(50) DEFAULT 'cash',
  payment_status VARCHAR(50) DEFAULT 'pending',
  assigned_at TIMESTAMP,
  picked_up_at TIMESTAMP,
  processing_started_at TIMESTAMP,
  ready_at TIMESTAMP,
  out_for_delivery_at TIMESTAMP,
  delivered_at TIMESTAMP,
  cancelled_at TIMESTAMP,
  cancellation_reason TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Order notifications table (for real-time facility notifications)
CREATE TABLE IF NOT EXISTS order_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id),
  facility_id UUID NOT NULL,
  distance_km DECIMAL(5, 2),
  status VARCHAR(50) DEFAULT 'pending',
  notified_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  responded_at TIMESTAMP,
  response VARCHAR(50)
);

-- Markets/Regions table
CREATE TABLE IF NOT EXISTS markets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  country VARCHAR(100) NOT NULL,
  currency VARCHAR(10) DEFAULT 'SAR',
  timezone VARCHAR(50) DEFAULT 'Asia/Dubai',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Service types and pricing
CREATE TABLE IF NOT EXISTS service_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  market_id UUID REFERENCES markets(id),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  base_price DECIMAL(10, 2),
  price_per_item DECIMAL(10, 2),
  estimated_hours INT DEFAULT 24,
  icon VARCHAR(50),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_facility ON orders(facility_id);
CREATE INDEX IF NOT EXISTS idx_orders_customer_phone ON orders(customer_phone);
CREATE INDEX IF NOT EXISTS idx_facilities_location ON facilities(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_facilities_status ON facilities(tenant_id, status);
CREATE INDEX IF NOT EXISTS idx_drivers_facility ON drivers(tenant_id, facility_id);
CREATE INDEX IF NOT EXISTS idx_order_notifications_facility ON order_notifications(facility_id, status);
