import { NextRequest, NextResponse } from 'next/server'
import nile from '@/lib/nile'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'laundrykhalas-secret-key-2024'

export async function POST(request: NextRequest) {
  try {
    const { phone, password } = await request.json()

    if (!phone || !password) {
      return NextResponse.json(
        { error: 'Phone and password are required' },
        { status: 400 }
      )
    }

    // Normalize phone
    const normalizedPhone = phone.replace(/[\s-]/g, '')

    // Query driver by phone
    const result = await nile.db.query(
      `SELECT id, facility_id, tenant_id, name, phone, password_hash, status, vehicle_type, vehicle_number, rating, total_deliveries
       FROM drivers WHERE phone = $1 LIMIT 1`,
      [normalizedPhone]
    )

    const driver = result.rows[0]

    if (!driver) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, driver.password_hash)

    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        id: driver.id,
        facility_id: driver.facility_id,
        tenant_id: driver.tenant_id,
        name: driver.name,
        phone: driver.phone,
        type: 'driver'
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    )

    const driverData = {
      id: driver.id,
      name: driver.name,
      phone: driver.phone,
      facility_id: driver.facility_id,
      vehicle_type: driver.vehicle_type,
      vehicle_number: driver.vehicle_number,
      rating: driver.rating,
      total_deliveries: driver.total_deliveries,
      status: driver.status,
    }

    const response = NextResponse.json({
      success: true,
      token,
      driver: driverData,
    })

    response.cookies.set('driver_token', token, {
      httpOnly: false,
      secure: false,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    })

    return response
  } catch (error: any) {
    console.error('[Driver Login Error]:', error)
    return NextResponse.json(
      { error: error?.detail || error?.message || 'Login failed' },
      { status: 500 }
    )
  }
}
