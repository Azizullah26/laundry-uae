import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'laundrykhalas-secret-key-2024'

export async function GET() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('facility_token')
    
    if (!token?.value) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verify JWT token
    const decoded = jwt.verify(token.value, JWT_SECRET) as any
    
    return NextResponse.json({
      ok: true,
      facility: {
        id: decoded.id,
        name: decoded.name,
        username: decoded.username,
        type: decoded.type,
        tenantId: decoded.tenant_id
      }
    })
  } catch (error) {
    console.error('[Auth Me Error]:', error)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
}
