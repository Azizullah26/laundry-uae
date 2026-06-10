import { NextRequest, NextResponse } from 'next/server'
import nile from '@/lib/nile'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { v4 as uuidv4 } from 'uuid'

const JWT_SECRET = process.env.JWT_SECRET || 'laundrykhalas-secret-key-2024'

export async function POST(request: NextRequest) {
  try {
    // Verify Bearer token from facility
    const authHeader = request.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Missing or invalid authorization header' },
        { status: 401 }
      )
    }

    const token = authHeader.slice(7)
    let facilityPayload: any
    try {
      facilityPayload = jwt.verify(token, JWT_SECRET)
      if (facilityPayload.type !== 'facility') {
        return NextResponse.json(
          { error: 'Only facilities can create drivers' },
          { status: 403 }
        )
      }
    } catch (err) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { name, phone, password, vehicle_type, vehicle_number } = body

    if (!name || !phone || !password) {
      return NextResponse.json(
        { error: 'Name, phone, and password (min 8 chars) are required' },
        { status: 400 }
      )
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters' },
        { status: 400 }
      )
    }

    // Normalize phone (remove spaces/dashes)
    const normalizedPhone = phone.replace(/[\s-]/g, '')

    // Check if driver already exists
    const existing = await nile.db.query(
      'SELECT id FROM drivers WHERE phone = $1',
      [normalizedPhone]
    )

    if (existing.rows.length > 0) {
      return NextResponse.json(
        { error: 'A driver with this phone already exists' },
        { status: 400 }
      )
    }

    // Hash password with cost >= 10
    const passwordHash = await bcrypt.hash(password, 12)
    const driverId = uuidv4()

    // Create driver
    await nile.db.query(
      `INSERT INTO drivers 
        (id, facility_id, tenant_id, name, phone, password_hash, vehicle_type, vehicle_number, status, rating, total_deliveries)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
      [
        driverId,
        facilityPayload.id,
        facilityPayload.tenant_id || null,
        name,
        normalizedPhone,
        passwordHash,
        vehicle_type || 'motorcycle',
        vehicle_number || null,
        'offline',
        5.0,
        0
      ]
    )

    return NextResponse.json({
      success: true,
      driver: {
        id: driverId,
        name,
        phone: normalizedPhone,
      },
    })
  } catch (error: any) {
    console.error('[Driver Creation Error]:', error)
    return NextResponse.json(
      { error: error?.detail || error?.message || 'Failed to create driver' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    // Verify Bearer token from facility
    const authHeader = request.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Missing or invalid authorization header' },
        { status: 401 }
      )
    }

    const token = authHeader.slice(7)
    let facilityPayload: any
    try {
      facilityPayload = jwt.verify(token, JWT_SECRET)
      if (facilityPayload.type !== 'facility') {
        return NextResponse.json(
          { error: 'Only facilities can list drivers' },
          { status: 403 }
        )
      }
    } catch (err) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      )
    }

    // Fetch drivers for this facility
    const result = await nile.db.query(
      `SELECT id, name, phone, status, vehicle_type, vehicle_number, rating, total_deliveries, is_online
       FROM drivers WHERE facility_id = $1
       ORDER BY name ASC`,
      [facilityPayload.id]
    )

    return NextResponse.json({
      drivers: result.rows.map((d: any) => ({
        id: d.id,
        name: d.name,
        phone: d.phone,
        status: d.status,
        vehicle_type: d.vehicle_type,
        vehicle_number: d.vehicle_number,
        rating: d.rating,
        total_deliveries: d.total_deliveries,
        is_online: d.is_online,
        active_orders: 0, // TODO: count from orders table
      })),
    })
  } catch (error: any) {
    console.error('[Fetch Drivers Error]:', error)
    return NextResponse.json(
      { error: error?.detail || error?.message || 'Failed to fetch drivers' },
      { status: 500 }
    )
  }
}
