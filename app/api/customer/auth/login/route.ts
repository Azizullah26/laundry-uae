import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { sql } from '@/lib/nile'

const JWT_SECRET = process.env.JWT_SECRET || 'laundrykhalas-dev-secret-2026'

export async function POST(req: NextRequest) {
  try {
    const { phone, password } = await req.json()

    if (!phone || !password) {
      return NextResponse.json({ error: 'Phone and password are required' }, { status: 400 })
    }

    const result = await sql`
      SELECT id, phone, password_hash, name, email, default_address
      FROM customers
      WHERE phone = ${phone}
      LIMIT 1
    `

    if (!result || result.length === 0) {
      return NextResponse.json({ error: 'Invalid phone or password' }, { status: 401 })
    }

    const customer = result[0]

    if (!customer.password_hash) {
      return NextResponse.json({ error: 'Please sign up to create an account' }, { status: 401 })
    }

    const valid = await bcrypt.compare(password, customer.password_hash)
    if (!valid) {
      return NextResponse.json({ error: 'Invalid phone or password' }, { status: 401 })
    }

    const token = jwt.sign(
      { id: customer.id, phone: customer.phone, role: 'customer' },
      JWT_SECRET,
      { expiresIn: '30d' }
    )

    const customerData = {
      id: customer.id,
      phone: customer.phone,
      name: customer.name,
      email: customer.email,
    }

    const response = NextResponse.json({
      success: true,
      token,
      customer: customerData,
    })

    response.cookies.set('customer_token', token, {
      httpOnly: false,
      secure: false,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30,
      path: '/',
    })

    return response
  } catch (error: any) {
    console.error('[v0] Customer login error:', {
      message: error?.message,
      code: error?.code,
      detail: error?.detail,
    })
    return NextResponse.json({ error: error?.detail || error?.message || 'Login failed' }, { status: 500 })
  }
}
