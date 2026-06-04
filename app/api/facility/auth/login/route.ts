import { NextRequest, NextResponse } from 'next/server'
import nile from '@/lib/nile'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'laundrykhalas-secret-key-2024'

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      )
    }

    console.log('[Facility Login] Attempting login for:', username)

    // Query facility user — search across all tenants by username
    let result
    try {
      result = await nile.db.query(
        'SELECT * FROM facilities WHERE username = $1 LIMIT 1',
        [username]
      )
    } catch (queryError) {
      console.error('[Facility Login] Query failed:', queryError)
      return NextResponse.json(
        { error: 'Database connection failed. Please try again.' },
        { status: 503 }
      )
    }

    const facility = result.rows[0]

    if (!facility) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Check if facility is active
    if (facility.status !== 'active') {
      return NextResponse.json(
        { error: 'Your account is not active. Please contact admin.' },
        { status: 403 }
      )
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, facility.password_hash)

    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        id: facility.id,
        tenant_id: facility.tenant_id,
        name: facility.name,
        username: facility.username,
        type: 'facility'
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    )

    const facilityData = {
      id: facility.id,
      tenant_id: facility.tenant_id,
      name: facility.name,
      username: facility.username,
      email: facility.email,
      phone: facility.phone,
      logo_url: facility.logo_url,
      address: facility.address,
      city: facility.city,
      status: facility.status
    }

    // Return token in response body so client can store it in localStorage
    const response = NextResponse.json({
      success: true,
      token,
      facility: facilityData,
    })

    // Also set cookie as backup
    response.cookies.set('facility_token', token, {
      httpOnly: false,
      secure: false,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    })

    return response
  } catch (error) {
    console.error('[Facility Login Error]:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
