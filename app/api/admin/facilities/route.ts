import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      name,
      username,
      password,
      email,
      phone,
      address,
      city,
      latitude,
      longitude,
      service_radius_km,
      commission_rate,
      logo_url,
    } = body

    if (!name || !username || !password) {
      return NextResponse.json(
        { error: 'Name, username, and password are required' },
        { status: 400 }
      )
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Check if username already exists
    const { data: existingFacility } = await supabase
      .from('facilities')
      .select('id')
      .eq('username', username)
      .single()

    if (existingFacility) {
      return NextResponse.json(
        { error: 'Username already exists' },
        { status: 400 }
      )
    }

    // Hash password
    const password_hash = await bcrypt.hash(password, 12)

    // Create facility
    const { data: facility, error } = await supabase
      .from('facilities')
      .insert({
        name,
        username,
        password_hash,
        email: email || null,
        phone: phone || null,
        address: address || null,
        city: city || null,
        latitude: latitude || null,
        longitude: longitude || null,
        service_radius_km: service_radius_km || 10,
        commission_rate: commission_rate || 15,
        logo_url: logo_url || null,
        status: 'active',
        operating_hours: {
          monday: { open: '08:00', close: '20:00' },
          tuesday: { open: '08:00', close: '20:00' },
          wednesday: { open: '08:00', close: '20:00' },
          thursday: { open: '08:00', close: '20:00' },
          friday: { open: '08:00', close: '20:00' },
          saturday: { open: '09:00', close: '18:00' },
          sunday: { open: '10:00', close: '16:00' },
        },
        settings: {
          auto_accept_orders: false,
          max_daily_orders: 100,
          notification_preferences: {
            new_orders: true,
            order_updates: true,
            payments: true,
          },
        },
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating facility:', error)
      return NextResponse.json(
        { error: 'Failed to create facility' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      facility: {
        id: facility.id,
        name: facility.name,
        username: facility.username,
      },
    })
  } catch (error) {
    console.error('Error creating facility:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const { data: facilities, error } = await supabase
      .from('facilities')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching facilities:', error)
      return NextResponse.json(
        { error: 'Failed to fetch facilities' },
        { status: 500 }
      )
    }

    return NextResponse.json({ facilities })
  } catch (error) {
    console.error('Error fetching facilities:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
