import { NextRequest, NextResponse } from 'next/server'
import nile from '@/lib/nile'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'laundrykhalas-secret-key-2024'

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Missing or invalid authorization header' },
        { status: 401 }
      )
    }

    const token = authHeader.slice(7)
    let driverPayload: any
    try {
      driverPayload = jwt.verify(token, JWT_SECRET)
      if (driverPayload.type !== 'driver') {
        return NextResponse.json(
          { error: 'Invalid token type' },
          { status: 401 }
        )
      }
    } catch (err) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      )
    }

    // Fetch fresh driver data
    const result = await nile.db.query(
      `SELECT id, facility_id, tenant_id, name, phone, status, vehicle_type, vehicle_number, rating, total_deliveries
       FROM drivers WHERE id = $1`,
      [driverPayload.id]
    )

    const driver = result.rows[0]

    if (!driver) {
      return NextResponse.json(
        { error: 'Driver not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      driver: {
        id: driver.id,
        name: driver.name,
        phone: driver.phone,
        facility_id: driver.facility_id,
        vehicle_type: driver.vehicle_type,
        vehicle_number: driver.vehicle_number,
        rating: driver.rating,
        total_deliveries: driver.total_deliveries,
        status: driver.status,
      },
    })
  } catch (error: any) {
    console.error('[Driver Profile Error]:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
