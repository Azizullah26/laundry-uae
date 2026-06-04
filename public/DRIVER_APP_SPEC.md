# LaundryKhalas — Driver Mobile App
# Complete Developer Specification (Flutter)
# Based on live site: https://laundrydubai.vercel.app

---

## 1. Project Overview

| Item | Detail |
|---|---|
| App Name | LaundryKhalas Driver |
| Platform | Flutter (iOS + Android) |
| Framework | Flutter 3.22+ / Dart 3.4+ |
| Backend URL | https://laundrydubai.vercel.app |
| Backend Stack | Next.js 15 (App Router) |
| Database | Nile Postgres (ALL tables) |
| State Mgmt | flutter_riverpod ^2.5.1 |
| Navigation | go_router ^14.2.7 |
| Local DB | drift (SQLite) ^2.18.0 |

---

## 2. System Actors

| Actor | Platform | Login |
|---|---|---|
| Customer | Web (laundrydubai.vercel.app/auth/login) | Mobile number + password |
| **Driver** | **Flutter mobile app (this spec)** | Phone + password + JWT |
| Facility | Web (/facility/auth/login) | Username + password + JWT |
| Admin | Web (/admin/auth/login) | Username + password + JWT |

### Key ownership rule
Every driver belongs to exactly one facility via `drivers.facility_id`.
A facility can only see and manage its own drivers.
Orders are assigned to a facility — that facility's drivers receive the job.

---

## 3. Complete Order Flow

```
Customer places order at laundrydubai.vercel.app
        │
        ▼
  status = "pending"
  Backend auto-assigns to nearest active facility
  order_notifications row created for that facility
        │
        ▼
  Driver (of that facility) receives FCM push:
  "New Pickup Job — Sara Ahmed, Jumeirah 1"
        │
  Driver taps ACCEPT JOB
        │
        ▼
  status = "confirmed"
  ├── Customer FCM: "Your order is confirmed, driver is coming"
  └── Facility Dashboard: order moves to Confirmed column
        │
  Driver taps HEAD TO CUSTOMER
        │
        ▼
  status = "out_for_pickup"
  └── Customer FCM: "Driver is on the way to you"
        │
  Driver arrives, collects laundry
  Driver taps MARK PICKED UP
        │
        ▼
  status = "picked_up"
  ├── Customer FCM: "Your laundry has been picked up"
  └── Facility FCM: "Ahmed is heading to you with the laundry"
        │
  Driver arrives at facility, hands over laundry
  Driver taps DELIVERED TO FACILITY
        │
        ▼
  status = "in_transit"  (driver → facility leg complete)
  └── Facility FCM: "Laundry arrived, start processing"
        │
  Facility washes, irons, cleans
  Facility taps MARK READY on web dashboard
        │
        ▼
  status = "ready"
  ├── Driver FCM: "Order LK-XXXXX is ready, pick it up!"   ← DRIVER NOTIFIED
  └── Customer FCM: "Your laundry is clean and ready"
        │
  Driver goes to facility and picks up clean laundry
  Driver taps PICKED UP FROM FACILITY
        │
        ▼
  status = "out_for_delivery"
  └── Customer FCM: "Your clean laundry is on the way!"
        │
  Driver arrives at customer, hands over laundry
  Driver taps MARK DELIVERED
        │
        ▼
  status = "delivered"
  ├── Customer FCM: "Laundry delivered! Please rate your experience"
  └── Facility Dashboard: order marked complete
```

---

## 4. Order Status Reference

| Status | Set By | Meaning |
|---|---|---|
| `pending` | Customer (web) | Order placed, no driver yet |
| `confirmed` | **Driver** (accept) | Driver accepted the job |
| `out_for_pickup` | **Driver** | Heading to customer |
| `picked_up` | **Driver** | Collected from customer |
| `in_transit` | **Driver** | Heading to facility |
| `processing` | Facility (web) | Laundry being cleaned |
| `ready` | Facility (web) | Clean, ready for delivery |
| `out_for_delivery` | **Driver** | Heading to customer with clean laundry |
| `delivered` | **Driver** | Complete |
| `cancelled` | Admin / Facility | Cancelled |

---

## 5. Complete pubspec.yaml

```yaml
name: laundrykhalas_driver
description: LaundryKhalas Driver Application
publish_to: none
version: 1.0.0+1

environment:
  sdk: ">=3.4.0 <4.0.0"
  flutter: ">=3.22.0"

dependencies:
  flutter:
    sdk: flutter
  flutter_localizations:
    sdk: flutter

  # State & Navigation
  flutter_riverpod: ^2.5.1
  go_router: ^14.2.7

  # Network
  dio: ^5.4.3
  http: ^1.2.1

  # Local Database (offline mode)
  drift: ^2.18.0
  sqlite3_flutter_libs: ^0.5.24
  path_provider: ^2.1.3
  path: ^1.9.0

  # Auth & Storage
  flutter_secure_storage: ^9.0.0
  shared_preferences: ^2.3.2

  # Firebase / Push
  firebase_core: ^3.3.0
  firebase_messaging: ^15.1.0
  flutter_local_notifications: ^17.2.1

  # Maps & Location
  google_maps_flutter: ^2.6.1
  geolocator: ^12.0.0
  connectivity_plus: ^6.0.3

  # UI
  fl_chart: ^0.68.0
  cached_network_image: ^3.3.1
  shimmer: ^3.0.0
  intl: ^0.19.0
  image_picker: ^1.1.2

dev_dependencies:
  flutter_test:
    sdk: flutter
  flutter_lints: ^4.0.0
  drift_dev: ^2.18.0
  build_runner: ^2.4.11

flutter:
  uses-material-design: true
  assets:
    - assets/images/
    - assets/animations/
    - assets/icons/
```

---

## 6. Nile Database Schema (Full)

The entire platform uses **Nile Postgres**. Connection string for backend developers only:
```
postgres://019e3a17-609b-74a6-8700-29b3ba731396:97a594e5-1f7a-4849-9d03-cb8d7a05fe46@us-west-2.db.thenile.dev:5432/laundry_gcc
```

The Flutter app never connects to the database directly — it only calls the Next.js REST API.

### admins table
```sql
CREATE TABLE admins (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username      VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  email         VARCHAR(255),
  role          VARCHAR(50) DEFAULT 'super_admin',
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### facilities table (tenant-aware)
```sql
CREATE TABLE facilities (
  tenant_id         UUID NOT NULL,
  id                UUID DEFAULT gen_random_uuid(),
  name              VARCHAR(255) NOT NULL,
  username          VARCHAR(255) NOT NULL,
  password_hash     VARCHAR(255) NOT NULL,
  email             VARCHAR(255),
  phone             VARCHAR(50),
  logo_url          TEXT,
  address           TEXT,
  city              VARCHAR(100),
  latitude          DECIMAL(10,8),
  longitude         DECIMAL(11,8),
  service_radius_km DECIMAL(5,2) DEFAULT 10.00,
  status            VARCHAR(50) DEFAULT 'pending',  -- pending | active | suspended
  rating            DECIMAL(3,2) DEFAULT 0.00,
  total_orders      INT DEFAULT 0,
  services_offered  JSONB DEFAULT '[]',
  operating_hours   JSONB DEFAULT '{}',
  commission_rate   DECIMAL(5,2) DEFAULT 15.00,
  created_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (tenant_id, id),
  UNIQUE (tenant_id, username)
);
```

### drivers table (tenant-aware, belongs to facility)
```sql
CREATE TABLE drivers (
  tenant_id      UUID NOT NULL,
  id             UUID DEFAULT gen_random_uuid(),
  facility_id    UUID NOT NULL,              -- which facility owns this driver
  name           VARCHAR(255) NOT NULL,
  phone          VARCHAR(50) NOT NULL,
  email          VARCHAR(255),
  password_hash  VARCHAR(255),              -- ADD THIS: bcrypt hashed password for app login
  vehicle_type   VARCHAR(50),              -- motorcycle | car | van
  vehicle_number VARCHAR(50),
  license_number VARCHAR(100),
  status         VARCHAR(50) DEFAULT 'offline',  -- online | offline | busy
  current_latitude  DECIMAL(10,8),
  current_longitude DECIMAL(11,8),
  fcm_token      TEXT,                     -- ADD THIS: Firebase push token
  last_seen_at   TIMESTAMP,                -- ADD THIS
  total_deliveries INT DEFAULT 0,
  rating         DECIMAL(3,2) DEFAULT 0.00,
  is_active      BOOLEAN DEFAULT true,     -- ADD THIS
  settings       JSONB DEFAULT '{}',
  created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (tenant_id, id),
  UNIQUE (tenant_id, phone)
);
```

### customers table
```sql
CREATE TABLE customers (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone             VARCHAR(50) UNIQUE NOT NULL,
  password_hash     VARCHAR(255),
  name              VARCHAR(255),
  email             VARCHAR(255),
  default_address   TEXT,
  default_latitude  DECIMAL(10,8),
  default_longitude DECIMAL(11,8),
  total_orders      INT DEFAULT 0,
  created_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### orders table
```sql
CREATE TABLE orders (
  id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number         VARCHAR(50) UNIQUE NOT NULL,   -- format: LK-XXXXXXXX
  customer_id          UUID REFERENCES customers(id),
  customer_phone       VARCHAR(50) NOT NULL,
  customer_name        VARCHAR(255),
  customer_address     TEXT NOT NULL,
  customer_latitude    DECIMAL(10,8),
  customer_longitude   DECIMAL(11,8),
  facility_id          UUID,
  driver_id            UUID,                          -- ADD THIS: assigned driver
  status               VARCHAR(50) DEFAULT 'pending',
  service_type         VARCHAR(100),
  items                JSONB DEFAULT '[]',
  special_instructions TEXT,
  pickup_date          DATE,
  pickup_time_slot     VARCHAR(50),
  delivery_date        DATE,
  delivery_time_slot   VARCHAR(50),
  subtotal             DECIMAL(10,2) DEFAULT 0.00,
  delivery_fee         DECIMAL(10,2) DEFAULT 0.00,
  express_fee          DECIMAL(10,2) DEFAULT 0.00,
  discount             DECIMAL(10,2) DEFAULT 0.00,
  total                DECIMAL(10,2) DEFAULT 0.00,
  payment_method       VARCHAR(50) DEFAULT 'cash',
  payment_status       VARCHAR(50) DEFAULT 'pending',
  assigned_at          TIMESTAMP,
  out_for_pickup_at    TIMESTAMP,                     -- ADD THIS
  picked_up_at         TIMESTAMP,
  in_transit_at        TIMESTAMP,                     -- ADD THIS
  processing_started_at TIMESTAMP,
  ready_at             TIMESTAMP,
  out_for_delivery_at  TIMESTAMP,
  delivered_at         TIMESTAMP,
  cancelled_at         TIMESTAMP,
  cancellation_reason  TEXT,
  created_at           TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at           TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### order_notifications table
```sql
CREATE TABLE order_notifications (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id     UUID REFERENCES orders(id),
  facility_id  UUID NOT NULL,
  distance_km  DECIMAL(5,2),
  status       VARCHAR(50) DEFAULT 'pending',   -- pending | accepted | rejected
  notified_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  responded_at TIMESTAMP,
  response     VARCHAR(50)
);
```

### driver_notifications table (CREATE THIS — does not exist yet)
```sql
CREATE TABLE IF NOT EXISTS driver_notifications (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  driver_id  UUID NOT NULL,
  order_id   UUID REFERENCES orders(id),
  type       VARCHAR(50),   -- new_job | order_ready | order_cancelled | general
  title      TEXT,
  body       TEXT,
  is_read    BOOLEAN DEFAULT false,
  data       JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_driver_notifications_driver ON driver_notifications(driver_id, is_read);
```

### Required DB migrations (run these first)
```sql
-- Add missing columns to existing tables
ALTER TABLE drivers ADD COLUMN IF NOT EXISTS password_hash VARCHAR(255);
ALTER TABLE drivers ADD COLUMN IF NOT EXISTS fcm_token TEXT;
ALTER TABLE drivers ADD COLUMN IF NOT EXISTS last_seen_at TIMESTAMP;
ALTER TABLE drivers ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS driver_id UUID;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS out_for_pickup_at TIMESTAMP;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS in_transit_at TIMESTAMP;

-- Create driver_notifications table
CREATE TABLE IF NOT EXISTS driver_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  driver_id UUID NOT NULL,
  order_id UUID REFERENCES orders(id),
  type VARCHAR(50),
  title TEXT,
  body TEXT,
  is_read BOOLEAN DEFAULT false,
  data JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 7. API Endpoints (All on https://laundrydubai.vercel.app)

### Authentication headers required on all protected routes:
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
x-facility-id: <facility_uuid>    (where required)
x-tenant-id: <tenant_uuid>        (where required)
x-driver-id: <driver_uuid>        (where required)
```

---

### 7.1 Driver Login
**EXISTS: NO — must be built**
```
POST /api/driver/auth/login

Request body:
{
  "phone": "0501234567",
  "password": "Driver@2026"
}

Response 200:
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "driver": {
    "id": "uuid",
    "name": "Ahmed Al-Rashidi",
    "phone": "0501234567",
    "facility_id": "uuid",
    "tenant_id": "uuid",
    "facility_name": "Sparkle Laundry",
    "facility_address": "Al Barsha, Dubai",
    "facility_latitude": 25.1012,
    "facility_longitude": 55.1701,
    "vehicle_type": "motorcycle",
    "vehicle_number": "AB-1234",
    "status": "offline",
    "rating": 4.8,
    "total_deliveries": 142,
    "is_active": true
  }
}

Response 401: { "error": "Invalid credentials" }
Response 403: { "error": "Account is inactive. Contact your facility." }

Backend implementation:
  SELECT d.*, f.name as facility_name, f.address as facility_address,
         f.latitude as facility_latitude, f.longitude as facility_longitude,
         f.tenant_id
  FROM drivers d
  JOIN facilities f ON d.facility_id = f.id AND d.tenant_id = f.tenant_id
  WHERE d.phone = $1 AND d.is_active = true
  LIMIT 1
  -- then bcrypt.compare(password, d.password_hash)
  -- JWT payload: { id, facility_id, tenant_id, phone, name, type: 'driver' }
```

---

### 7.2 Driver Logout
**EXISTS: NO — must be built**
```
POST /api/driver/auth/logout
Headers: Authorization: Bearer <token>

Response 200: { "success": true }

Backend: SET status='offline', fcm_token=NULL WHERE id=driver_id
```

---

### 7.3 Get Driver Profile
**EXISTS: NO — must be built**
```
GET /api/driver/profile
Headers: Authorization: Bearer <token>
         x-driver-id: <driver_id>

Response 200:
{
  "driver": {
    "id": "uuid",
    "name": "Ahmed",
    "phone": "0501234567",
    "email": "ahmed@example.com",
    "vehicle_type": "motorcycle",
    "vehicle_number": "AB-1234",
    "status": "online",
    "rating": 4.8,
    "total_deliveries": 142,
    "facility_id": "uuid",
    "facility_name": "Sparkle Laundry"
  }
}
```

---

### 7.4 Register FCM Token
**EXISTS: NO — must be built**
```
POST /api/driver/fcm-token
Headers: Authorization: Bearer <token>

Request: { "fcm_token": "firebase-device-token-string" }
Response 200: { "success": true }

Backend: UPDATE drivers SET fcm_token=$1, updated_at=NOW() WHERE id=$2
```

---

### 7.5 Update Driver Status (Online / Offline)
**EXISTS: NO — must be built**
```
PATCH /api/driver/status
Headers: Authorization: Bearer <token>

Request: { "driver_id": "uuid", "status": "online" }
         status values: "online" | "offline" | "busy"

Response 200: { "success": true, "status": "online" }

Backend: UPDATE drivers SET status=$1, last_seen_at=NOW() WHERE id=$2
```

---

### 7.6 Update Driver Location
**EXISTS: NO — must be built**
```
POST /api/driver/location
Headers: Authorization: Bearer <token>

Request:
{
  "driver_id": "uuid",
  "latitude": 25.2048,
  "longitude": 55.2708,
  "heading": 180.0,
  "speed": 40.0,
  "accuracy": 5.0,
  "order_id": "uuid-or-null"
}

Response 200: { "success": true }

Backend:
  UPDATE drivers
  SET current_latitude=$1, current_longitude=$2, last_seen_at=NOW()
  WHERE id=$3

  -- Also insert into driver_location_history for facility map tracking:
  INSERT INTO driver_location_history(driver_id, order_id, lat, lng)
  VALUES ($3, $4, $1, $2)
```

---

### 7.7 Get Available Orders (Pending jobs for driver's facility)
**EXISTS: NO — must be built**
```
GET /api/driver/orders/available
Headers: Authorization: Bearer <token>
         x-facility-id: <facility_id>
         x-tenant-id: <tenant_id>

Response 200:
{
  "orders": [
    {
      "id": "uuid",
      "order_number": "LK-A1B2C3",
      "customer_name": "Sara Ahmed",
      "customer_phone": "0551234567",
      "customer_address": "Jumeirah 1, Villa 42, Dubai",
      "customer_latitude": 25.2048,
      "customer_longitude": 55.2708,
      "status": "pending",
      "service_type": "Wash & Fold",
      "items": [{"name": "Shirts", "qty": 5}, {"name": "Trousers", "qty": 3}],
      "special_instructions": "Handle with care",
      "pickup_date": "2026-05-25",
      "pickup_time_slot": "10:00 AM - 12:00 PM",
      "delivery_date": "2026-05-26",
      "delivery_time_slot": "02:00 PM - 04:00 PM",
      "subtotal": 75.00,
      "delivery_fee": 10.00,
      "total": 85.00,
      "payment_method": "cash",
      "created_at": "2026-05-23T10:30:00Z"
    }
  ]
}

Backend query:
  SELECT * FROM orders
  WHERE facility_id = $1
  AND status = 'pending'
  AND driver_id IS NULL
  ORDER BY created_at ASC
```

---

### 7.8 Get Driver's Active Orders
**EXISTS: NO — must be built**
```
GET /api/driver/orders/active
Headers: Authorization: Bearer <token>
         x-driver-id: <driver_id>

Response 200: { "orders": [...same shape as 7.7...] }

Backend query:
  SELECT * FROM orders
  WHERE driver_id = $1
  AND status IN ('confirmed','out_for_pickup','picked_up','in_transit','ready','out_for_delivery')
  ORDER BY updated_at DESC
```

---

### 7.9 Get Driver's Order History
**EXISTS: NO — must be built**
```
GET /api/driver/orders/history?page=1&limit=20
Headers: Authorization: Bearer <token>
         x-driver-id: <driver_id>

Response 200:
{
  "orders": [...],
  "total": 142,
  "page": 1,
  "limit": 20
}

Backend query:
  SELECT * FROM orders
  WHERE driver_id = $1 AND status = 'delivered'
  ORDER BY delivered_at DESC
  LIMIT $2 OFFSET $3
```

---

### 7.10 Accept an Order
**EXISTS: NO — must be built**
```
POST /api/driver/orders/accept
Headers: Authorization: Bearer <token>

Request:
{
  "order_id": "uuid",
  "driver_id": "uuid"
}

Response 200: { "success": true, "message": "Order accepted" }
Response 400: { "error": "Order already accepted by another driver" }

Backend:
  -- Check order is still pending
  SELECT driver_id FROM orders WHERE id=$1

  -- Assign driver atomically
  UPDATE orders
  SET driver_id=$2, status='confirmed', assigned_at=NOW(), updated_at=NOW()
  WHERE id=$1 AND driver_id IS NULL AND status='pending'

  -- Send FCM to customer: "Your order is confirmed"
  -- Update facility dashboard via Supabase realtime or polling
  -- Insert into driver_notifications for driver confirmation
```

---

### 7.11 Update Order Status (Core Driver Action)
**EXISTS: NO — must be built**
```
PATCH /api/driver/orders/:order_id/status
Headers: Authorization: Bearer <token>

Request:
{
  "status": "out_for_pickup",
  "driver_id": "uuid",
  "latitude": 25.2048,
  "longitude": 55.2708,
  "note": "optional note"
}

Allowed status transitions (only these are valid from driver):
  confirmed        → out_for_pickup
  out_for_pickup   → picked_up
  picked_up        → in_transit
  in_transit       → (nothing, facility takes over)
  ready            → out_for_delivery
  out_for_delivery → delivered

Response 200:
{
  "success": true,
  "order": {
    "id": "uuid",
    "status": "out_for_pickup",
    "updated_at": "2026-05-23T11:05:00Z"
  }
}

Response 400: { "error": "Invalid status transition" }

Side effects backend MUST handle per status:
  "out_for_pickup"   → Customer FCM: "Driver is on the way to pick up your laundry"
  "picked_up"        → Customer FCM: "Your laundry has been picked up"
                     → Facility FCM: "Driver has picked up order LK-XXXXX"
  "in_transit"       → Facility FCM: "Ahmed is heading to you with order LK-XXXXX"
  "out_for_delivery" → Customer FCM: "Your clean laundry is on the way!"
  "delivered"        → Customer FCM: "Laundry delivered! Rate your experience"
                     → Facility: order marked complete in dashboard
```

---

### 7.12 Get Driver Notifications
**EXISTS: NO — must be built**
```
GET /api/driver/notifications?page=1&limit=30
Headers: Authorization: Bearer <token>
         x-driver-id: <driver_id>

Response 200:
{
  "notifications": [
    {
      "id": "uuid",
      "type": "new_job",
      "title": "New Pickup Job",
      "body": "Sara Ahmed - Jumeirah 1 - Wash & Fold",
      "order_id": "uuid",
      "is_read": false,
      "data": { "order_number": "LK-A1B2C3" },
      "created_at": "2026-05-23T10:30:00Z"
    }
  ],
  "unread_count": 3
}
```

---

### 7.13 Mark Notification Read
**EXISTS: NO — must be built**
```
PATCH /api/driver/notifications/:id/read
Headers: Authorization: Bearer <token>
Response 200: { "success": true }

PATCH /api/driver/notifications/read-all
Headers: Authorization: Bearer <token>
         x-driver-id: <driver_id>
Response 200: { "success": true }
```

---

### 7.14 Get Driver Earnings
**EXISTS: NO — must be built**
```
GET /api/driver/earnings?period=week
Headers: Authorization: Bearer <token>
         x-driver-id: <driver_id>

period values: today | week | month

Response 200:
{
  "total": 840.00,
  "currency": "AED",
  "deliveries": 28,
  "average_per_delivery": 30.00,
  "breakdown": [
    { "date": "2026-05-23", "amount": 120.00, "deliveries": 4 },
    { "date": "2026-05-22", "amount": 90.00, "deliveries": 3 }
  ]
}

Backend: SUM of orders.total WHERE driver_id=$1 AND status='delivered'
         grouped by date in the requested period
```

---

## 8. Flutter Project Structure

```
lib/
├── main.dart                        # Firebase init, Riverpod ProviderScope, runApp
├── app.dart                         # MaterialApp.router + GoRouter
│
├── core/
│   ├── constants/
│   │   ├── api.dart                 # base URL + all endpoint paths
│   │   └── app.dart                 # app name, version, etc.
│   ├── network/
│   │   ├── dio_client.dart          # Dio with JWT interceptor + retry
│   │   ├── api_service.dart         # all API methods
│   │   └── connectivity.dart        # online/offline stream
│   ├── storage/
│   │   ├── secure_storage.dart      # JWT, driver JSON
│   │   └── database.dart            # Drift SQLite (offline)
│   ├── theme/
│   │   └── theme.dart               # colors, typography
│   ├── services/
│   │   ├── location_service.dart    # GPS tracking
│   │   ├── fcm_service.dart         # Firebase messaging
│   │   └── sync_service.dart        # offline sync queue flush
│   └── utils/
│       ├── date_formatter.dart
│       └── distance_utils.dart
│
├── features/
│   ├── auth/
│   │   ├── providers/auth_provider.dart
│   │   └── screens/login_screen.dart
│   ├── home/
│   │   ├── providers/jobs_provider.dart
│   │   ├── screens/home_screen.dart
│   │   └── widgets/
│   │       ├── job_card.dart
│   │       └── online_toggle.dart
│   ├── order/
│   │   ├── providers/order_provider.dart
│   │   ├── screens/
│   │   │   ├── order_detail_screen.dart
│   │   │   └── navigation_screen.dart
│   │   └── widgets/
│   │       ├── status_action_button.dart
│   │       └── customer_info_card.dart
│   ├── earnings/
│   │   ├── providers/earnings_provider.dart
│   │   └── screens/earnings_screen.dart
│   ├── notifications/
│   │   ├── providers/notification_provider.dart
│   │   └── screens/notifications_screen.dart
│   └── profile/
│       ├── providers/profile_provider.dart
│       └── screens/profile_screen.dart
│
├── shared/
│   ├── models/
│   │   ├── driver.dart
│   │   ├── order.dart
│   │   └── driver_notification.dart
│   └── widgets/
│       ├── lk_button.dart
│       ├── lk_text_field.dart
│       ├── status_badge.dart
│       └── offline_banner.dart
│
└── l10n/
    ├── app_en.arb
    └── app_ar.arb
```

---

## 9. Offline Mode — Drift SQLite Schema

```dart
// lib/core/storage/database.dart

import 'package:drift/drift.dart';
import 'package:drift/native.dart';
import 'package:path_provider/path_provider.dart';
import 'package:path/path.dart' as p;
import 'dart:io';

class LocalOrders extends Table {
  TextColumn get id => text()();
  TextColumn get orderNumber => text()();
  TextColumn get customerName => text()();
  TextColumn get customerPhone => text()();
  TextColumn get customerAddress => text()();
  RealColumn get customerLatitude => real().nullable()();
  RealColumn get customerLongitude => real().nullable()();
  TextColumn get facilityName => text()();
  TextColumn get facilityAddress => text()();
  RealColumn get facilityLatitude => real().nullable()();
  RealColumn get facilityLongitude => real().nullable()();
  TextColumn get status => text()();
  TextColumn get serviceType => text()();
  TextColumn get itemsJson => text()();
  TextColumn get pickupDate => text().nullable()();
  TextColumn get pickupTimeSlot => text().nullable()();
  TextColumn get deliveryDate => text().nullable()();
  TextColumn get deliveryTimeSlot => text().nullable()();
  RealColumn get total => real()();
  TextColumn get paymentMethod => text()();
  TextColumn get specialInstructions => text().nullable()();
  TextColumn get createdAt => text()();
  TextColumn get updatedAt => text()();
  BoolColumn get isSynced => boolean().withDefault(const Constant(true))();

  @override
  Set<Column> get primaryKey => {id};
}

class SyncQueue extends Table {
  IntColumn get id => integer().autoIncrement()();
  TextColumn get endpoint => text()();
  TextColumn get method => text()();
  TextColumn get bodyJson => text()();
  TextColumn get headersJson => text()();
  IntColumn get retryCount => integer().withDefault(const Constant(0))();
  BoolColumn get isSent => boolean().withDefault(const Constant(false))();
  TextColumn get createdAt => text()();
}

class CachedNotifications extends Table {
  TextColumn get id => text()();
  TextColumn get type => text()();
  TextColumn get title => text()();
  TextColumn get body => text()();
  TextColumn get orderId => text().nullable()();
  TextColumn get dataJson => text().nullable()();
  BoolColumn get isRead => boolean().withDefault(const Constant(false))();
  TextColumn get createdAt => text()();

  @override
  Set<Column> get primaryKey => {id};
}

@DriftDatabase(tables: [LocalOrders, SyncQueue, CachedNotifications])
class AppDatabase extends _$AppDatabase {
  AppDatabase() : super(_openConnection());

  @override
  int get schemaVersion => 1;

  static QueryExecutor _openConnection() {
    return LazyDatabase(() async {
      final dir = await getApplicationDocumentsDirectory();
      final file = File(p.join(dir.path, 'lk_driver.db'));
      return NativeDatabase.createInBackground(file);
    });
  }
}
```

### Offline Sync Rules

| Offline action | Queued endpoint | Optimistic UI |
|---|---|---|
| Accept job | `POST /api/driver/orders/accept` | Move to Active tab |
| Head to customer | `PATCH /api/driver/orders/:id/status` | Update status chip |
| Mark picked up | `PATCH /api/driver/orders/:id/status` | Update status chip |
| Deliver to facility | `PATCH /api/driver/orders/:id/status` | Update status chip |
| Pick up from facility | `PATCH /api/driver/orders/:id/status` | Update status chip |
| Mark delivered | `PATCH /api/driver/orders/:id/status` | Move to History |
| Location update | Buffer last position only | N/A |

On connectivity restored: flush queue FIFO order, retry failed items up to 3 times.

---

## 10. FCM Push Notification Payloads

Backend sends these to `drivers.fcm_token` using Firebase Admin SDK.

### New job available
```json
{
  "notification": {
    "title": "New Pickup Job",
    "body": "Sara Ahmed — Jumeirah 1, Dubai"
  },
  "data": {
    "type": "new_job",
    "order_id": "uuid",
    "order_number": "LK-A1B2C3",
    "customer_name": "Sara Ahmed",
    "customer_address": "Jumeirah 1, Villa 42, Dubai",
    "service_type": "Wash & Fold",
    "total": "85.00"
  }
}
```

### Order ready for pickup from facility
```json
{
  "notification": {
    "title": "Order Ready for Delivery",
    "body": "LK-A1B2C3 is clean and ready at Sparkle Laundry"
  },
  "data": {
    "type": "order_ready",
    "order_id": "uuid",
    "order_number": "LK-A1B2C3",
    "facility_name": "Sparkle Laundry",
    "facility_address": "Al Barsha, Dubai"
  }
}
```

### Order cancelled
```json
{
  "notification": {
    "title": "Order Cancelled",
    "body": "Order LK-A1B2C3 has been cancelled"
  },
  "data": {
    "type": "order_cancelled",
    "order_id": "uuid",
    "order_number": "LK-A1B2C3",
    "reason": "Customer cancelled"
  }
}
```

### Deep link behavior (in Flutter)
```dart
// In FCM message handler:
switch (message.data['type']) {
  case 'new_job':
    context.go('/orders/${message.data['order_id']}');
    break;
  case 'order_ready':
    context.go('/orders/${message.data['order_id']}');
    break;
  case 'order_cancelled':
    // Remove from active list, show snackbar
    ref.read(jobsProvider.notifier).removeOrder(message.data['order_id']);
    break;
}
```

---

## 11. Location Tracking

```dart
// lib/core/services/location_service.dart
// Start when driver goes Online, stop when Offline

class LocationService {
  Timer? _timer;

  Future<void> startTracking({
    required String driverId,
    required ApiService api,
    String? orderId,
  }) async {
    final permission = await Geolocator.requestPermission();
    if (permission == LocationPermission.denied) return;

    _timer = Timer.periodic(const Duration(seconds: 10), (_) async {
      final position = await Geolocator.getCurrentPosition(
        desiredAccuracy: LocationAccuracy.high,
      );
      try {
        await api.updateLocation(
          driverId: driverId,
          latitude: position.latitude,
          longitude: position.longitude,
          heading: position.heading,
          speed: position.speed,
          accuracy: position.accuracy,
          orderId: orderId,
        );
      } catch (e) {
        // Offline — will sync later
      }
    });
  }

  void stopTracking() {
    _timer?.cancel();
    _timer = null;
  }
}
```

**Android permissions (AndroidManifest.xml):**
```xml
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION"/>
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION"/>
<uses-permission android:name="android.permission.ACCESS_BACKGROUND_LOCATION"/>
<uses-permission android:name="android.permission.FOREGROUND_SERVICE"/>
<uses-permission android:name="android.permission.FOREGROUND_SERVICE_LOCATION"/>
<uses-permission android:name="android.permission.INTERNET"/>
<uses-permission android:name="android.permission.RECEIVE_BOOT_COMPLETED"/>
```

**iOS permissions (Info.plist):**
```xml
<key>NSLocationWhenInUseUsageDescription</key>
<string>LaundryKhalas needs your location to assign nearby delivery jobs</string>
<key>NSLocationAlwaysAndWhenInUseUsageDescription</key>
<string>LaundryKhalas tracks your location while on delivery so customers can see your ETA</string>
<key>UIBackgroundModes</key>
<array>
  <string>location</string>
  <string>fetch</string>
  <string>remote-notification</string>
</array>
```

---

## 12. App Theme (Matches Web App Colors)

```dart
// lib/core/theme/theme.dart

class LKTheme {
  // Primary — matches web app #10B981 (Emerald)
  static const primary     = Color(0xFF10B981);
  static const primaryDark = Color(0xFF059669);

  // Neutrals
  static const background  = Color(0xFFF9FAFB);
  static const surface     = Color(0xFFFFFFFF);
  static const textPrimary = Color(0xFF111827);
  static const textMuted   = Color(0xFF6B7280);
  static const border      = Color(0xFFE5E7EB);

  // Status colors (match web dashboard)
  static const statusPending      = Color(0xFFF59E0B);  // amber
  static const statusConfirmed    = Color(0xFF3B82F6);  // blue
  static const statusPickedUp     = Color(0xFF8B5CF6);  // purple
  static const statusProcessing   = Color(0xFFEC4899);  // pink
  static const statusReady        = Color(0xFF10B981);  // green
  static const statusDelivered    = Color(0xFF059669);  // dark green
  static const statusCancelled    = Color(0xFFEF4444);  // red
}
```

---

## 13. GoRouter Setup

```dart
// lib/app.dart

final router = GoRouter(
  initialLocation: '/login',
  redirect: (context, state) {
    final isAuth = /* check secure storage for token */;
    final onLogin = state.matchedLocation == '/login';
    if (!isAuth && !onLogin) return '/login';
    if (isAuth && onLogin) return '/home';
    return null;
  },
  routes: [
    GoRoute(path: '/login', builder: (_, __) => const LoginScreen()),
    ShellRoute(
      builder: (_, __, child) => MainScaffold(child: child),
      routes: [
        GoRoute(path: '/home', builder: (_, __) => const HomeScreen()),
        GoRoute(path: '/notifications', builder: (_, __) => const NotificationsScreen()),
        GoRoute(path: '/earnings', builder: (_, __) => const EarningsScreen()),
        GoRoute(path: '/profile', builder: (_, __) => const ProfileScreen()),
      ],
    ),
    GoRoute(
      path: '/orders/:id',
      builder: (_, state) => OrderDetailScreen(
        orderId: state.pathParameters['id']!,
      ),
    ),
    GoRoute(
      path: '/navigate/:id',
      builder: (_, state) => NavigationScreen(
        orderId: state.pathParameters['id']!,
      ),
    ),
  ],
);
```

---

## 14. Dio Client with JWT Interceptor

```dart
// lib/core/network/dio_client.dart

class DioClient {
  static Dio create() {
    final dio = Dio(BaseOptions(
      baseUrl: 'https://laundrydubai.vercel.app/api',
      connectTimeout: const Duration(seconds: 15),
      receiveTimeout: const Duration(seconds: 20),
      headers: {'Content-Type': 'application/json'},
    ));

    dio.interceptors.add(InterceptorsWrapper(
      onRequest: (options, handler) async {
        const storage = FlutterSecureStorage();
        final token      = await storage.read(key: 'driver_token');
        final driverId   = await storage.read(key: 'driver_id');
        final facilityId = await storage.read(key: 'facility_id');
        final tenantId   = await storage.read(key: 'tenant_id');

        if (token != null)      options.headers['Authorization'] = 'Bearer $token';
        if (driverId != null)   options.headers['x-driver-id'] = driverId;
        if (facilityId != null) options.headers['x-facility-id'] = facilityId;
        if (tenantId != null)   options.headers['x-tenant-id'] = tenantId;

        return handler.next(options);
      },
      onError: (error, handler) async {
        if (error.response?.statusCode == 401) {
          // Token expired — clear storage + go to login
          const storage = FlutterSecureStorage();
          await storage.deleteAll();
          // Navigate using global nav key
        }
        return handler.next(error);
      },
    ));

    return dio;
  }
}
```

---

## 15. Screen-by-Screen UX Spec

### Screen 1: Login (/login)
- Logo + "Driver Portal" label
- Phone field (numeric, UAE/GCC format)
- Password field (obscure, eye toggle)
- "Sign In" button (full width, primary green)
- No "Forgot password" — driver calls facility admin

Actions on submit:
1. Validate: phone not empty, password min 6 chars
2. POST /api/driver/auth/login
3. Save token + driver JSON to flutter_secure_storage
4. POST /api/driver/fcm-token with current FCM token
5. Navigate to /home

---

### Screen 2: Home (/home)
**Header:**
- Driver name + facility name
- Online/Offline toggle (PATCH /api/driver/status)
- Notification bell with unread badge

**Tabs:**
- Available Jobs — status=pending, driver_id=null, facility_id=mine
- My Active Jobs — status in (confirmed, out_for_pickup, picked_up, in_transit, out_for_delivery)
- Completed — status=delivered

**Job card:**
```
[LK-A1B2C3]                     [pending]
Sara Ahmed — Jumeirah 1, Dubai
Wash & Fold  •  AED 85  •  Cash
Pickup: Today 10AM–12PM
[VIEW DETAILS]    [NAVIGATE]
```

**Offline banner:** yellow bar at top when no internet

**Refresh:** pull-to-refresh + auto-poll every 30s when online

---

### Screen 3: Order Detail (/orders/:id)

**Customer card:**
- Name, phone (tap to call), address (tap to open Maps)
- Map thumbnail with customer pin

**Order info:**
- Order number, service type
- Items list (name + quantity)
- Special instructions
- Pickup / delivery dates and slots
- Subtotal / fee / total
- Payment method badge (Cash / Card)

**Action button (bottom of screen — changes per status):**

| Current Status | Button Text | Resulting Status |
|---|---|---|
| `pending` | Accept Job | `confirmed` |
| `confirmed` | Head to Customer | `out_for_pickup` |
| `out_for_pickup` | Mark as Picked Up | `picked_up` |
| `picked_up` | Deliver to Facility | `in_transit` |
| `in_transit` | Waiting for facility... (disabled) | — |
| `ready` | Pick Up from Facility | `out_for_delivery` |
| `out_for_delivery` | Mark as Delivered | `delivered` |
| `delivered` | Completed | — |

On each button tap:
1. Show confirmation bottom sheet
2. Call PATCH /api/driver/orders/:id/status
3. On success: update local state + show green snackbar
4. On offline: queue + optimistic update

---

### Screen 4: Navigation (/navigate/:id)
- Google Maps full screen
- Blue dot = driver current location
- Red pin = destination (customer for pickup, facility for drop-off)
- Polyline route overlay
- ETA card at top
- "Open in Google Maps" button
- "Call Customer" button (during pickup leg)

---

### Screen 5: Earnings (/earnings)
**Summary cards:** Total earned, Total deliveries, Average per job

**Period tabs:** Today | This Week | This Month

**Bar chart (fl_chart):** Daily earnings breakdown

**Order list:** Each completed order — customer name, service, amount, date

API: GET /api/driver/earnings?period=today|week|month

---

### Screen 6: Notifications (/notifications)
- List from local Drift DB (CachedNotifications table)
- Grouped: Today / Earlier
- Icons per type: new_job=truck, order_ready=package, cancelled=x
- Tap new_job or order_ready → navigate to /orders/:id
- Mark all read button

---

### Screen 7: Profile (/profile)
- Avatar (initials), name, phone, facility name
- Vehicle type + number
- Rating (stars) + total deliveries
- Online/Offline toggle
- Sign Out button

---

## 16. main.dart Bootstrap

```dart
void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Firebase.initializeApp();

  // Background FCM handler
  FirebaseMessaging.onBackgroundMessage(_firebaseMessagingBackgroundHandler);

  runApp(const ProviderScope(child: LKDriverApp()));
}

@pragma('vm:entry-point')
Future<void> _firebaseMessagingBackgroundHandler(RemoteMessage message) async {
  await Firebase.initializeApp();
  // Save notification to local Drift DB so it appears in Notifications screen
  final db = AppDatabase();
  await db.into(db.cachedNotifications).insertOnConflictUpdate(
    CachedNotificationsCompanion(
      id: Value(message.messageId ?? DateTime.now().toIso8601String()),
      type: Value(message.data['type'] ?? 'general'),
      title: Value(message.notification?.title ?? ''),
      body: Value(message.notification?.body ?? ''),
      orderId: Value(message.data['order_id']),
      dataJson: Value(jsonEncode(message.data)),
      createdAt: Value(DateTime.now().toIso8601String()),
    ),
  );
}
```

---

## 17. Test Credentials

### Facility web dashboard (to test how orders look on facility side)
- URL: https://laundrydubai.vercel.app/facility/auth/login
- Username: `sparkle_laundry`
- Password: `Sparkle@2026`

### Admin panel
- URL: https://laundrydubai.vercel.app/admin/auth/login
- Username: `Aziz`
- Password: `Swat26118@`

### Customer signup (to create test orders)
- URL: https://laundrydubai.vercel.app/auth/login
- Create account with any UAE mobile number + password

### Nile DB (backend developer only — DO NOT put in Flutter app)
```
postgres://019e3a17-609b-74a6-8700-29b3ba731396:97a594e5-1f7a-4849-9d03-cb8d7a05fe46@us-west-2.db.thenile.dev:5432/laundry_gcc
```

---

## 18. Backend Developer Checklist (Before Flutter Work Starts)

These must all be done before Flutter integration begins:

- [ ] Run all migration SQL from Section 6 on Nile Postgres
- [ ] Build POST /api/driver/auth/login (phone + password, returns JWT)
- [ ] Build POST /api/driver/auth/logout
- [ ] Build GET /api/driver/profile
- [ ] Build POST /api/driver/fcm-token
- [ ] Build PATCH /api/driver/status
- [ ] Build POST /api/driver/location
- [ ] Build GET /api/driver/orders/available
- [ ] Build GET /api/driver/orders/active
- [ ] Build GET /api/driver/orders/history
- [ ] Build POST /api/driver/orders/accept
- [ ] Build PATCH /api/driver/orders/:id/status (with all FCM side effects)
- [ ] Build GET /api/driver/notifications
- [ ] Build PATCH /api/driver/notifications/:id/read
- [ ] Build PATCH /api/driver/notifications/read-all
- [ ] Build GET /api/driver/earnings
- [ ] Set up Firebase Admin SDK on Next.js backend for sending FCM
- [ ] Set a password for the test driver in the `drivers` table
- [ ] Confirm all endpoints return correct JSON on https://laundrydubai.vercel.app

---

## 19. Flutter Developer Deliverables

- [ ] Flutter project with all packages in pubspec.yaml
- [ ] Firebase project configured (google-services.json + GoogleService-Info.plist)
- [ ] Login with JWT auth + secure storage
- [ ] Home screen with available + active + completed tabs
- [ ] Order detail with full status action button flow
- [ ] Navigation screen (Google Maps + route)
- [ ] Offline mode (Drift SQLite + sync queue)
- [ ] Background location tracking (10s interval while online)
- [ ] FCM push (foreground + background + killed state)
- [ ] Earnings screen with fl_chart bar chart
- [ ] Notifications screen (local Drift cache)
- [ ] Profile screen with online/offline toggle
- [ ] Arabic RTL support
- [ ] Offline banner widget
- [ ] Android APK + iOS IPA tested on real devices

---

*Spec version: 3.0 — Built from live site inspection of https://laundrydubai.vercel.app*
*Schema source: /lib/db/schema.sql in the Next.js project*
*Last updated: May 2026*
