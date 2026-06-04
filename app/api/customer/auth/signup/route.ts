import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { sql } from '@/lib/nile'

const JWT_SECRET = process.env.JWT_SECRET || 'laundrykhalas-dev-secret-2026'

export async function POST(req: NextRequest) {
  try {
    const { phone, password, name } = await req.json()

    if (!phone || !password) {
      return NextResponse.json({ error: 'Phone and password are required' }, { status: 400 })
    }

    const existing = await sql`
      SELECT id, password_hash FROM customers WHERE phone = ${phone} LIMIT 1
    `

    const passwordHash = await bcrypt.hash(password, 12)
    let customer

    if (existing && existing.length > 0) {
      if (existing[0].password_hash) {
        return NextResponse.json(
          { error: 'Account with this phone already exists. Please sign in.' },
          { status: 409 }
        )
      }
      const updated = await sql`
        UPDATE customers
        SET password_hash = ${passwordHash}, name = COALESCE(${name || null}, name), updated_at = NOW()
        WHERE phone = ${phone}
        RETURNING id, phone, name, email
      `
      customer = updated[0]
    } else {
      const inserted = await sql`
        INSERT INTO customers (phone, password_hash, name)
        VALUES (${phone}, ${passwordHash}, ${name || null})
        RETURNING id, phone, name, email
      `
      customer = inserted[0]
    }

    const token = jwt.sign(
      { id: customer.id, phone: customer.phone, role: 'customer' },
      JWT_SECRET,
      { expiresIn: '30d' }
    )

    const response = NextResponse.json({ success: true, token, customer })

    response.cookies.set('customer_token', token, {
      httpOnly: false,
      secure: false,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30,
      path: '/',
    })

    return response
  } catch (error: any) {
    console.error('[v0] Customer signup error:', {
      message: error?.message,
      code: error?.code,
      detail: error?.detail,
      stack: error?.stack?.split('\n').slice(0, 3).join(' | '),
    })
    return NextResponse.json(
      { error: error?.detail || error?.message || 'Signup failed' },
      { status: 500 }
    )
  }
}
