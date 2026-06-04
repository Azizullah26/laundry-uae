import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export async function POST(request: Request) {
  try {
    const facilityId = request.headers.get('x-facility-id')
    const tenantId = request.headers.get('x-tenant-id')

    if (!facilityId) {
      return NextResponse.json(
        { error: 'Facility ID required' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { name, phone, email, vehicle_type, vehicle_number, license_number } = body

    if (!name || !phone) {
      return NextResponse.json(
        { error: 'Name and phone are required' },
        { status: 400 }
      )
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Check if phone already exists
    const { data: existingDriver } = await supabase
      .from('drivers')
      .select('id')
      .eq('phone', phone)
      .single()

    if (existingDriver) {
      return NextResponse.json(
        { error: 'A driver with this phone number already exists' },
        { status: 400 }
      )
    }

    // Create driver
    const { data: driver, error } = await supabase
      .from('drivers')
      .insert({
        tenant_id: tenantId || null,
        facility_id: facilityId,
        name,
        phone,
        email: email || null,
        vehicle_type: vehicle_type || 'motorcycle',
        vehicle_number: vehicle_number || null,
        license_number: license_number || null,
        status: 'offline',
        rating: 5.0,
        total_deliveries: 0,
        is_active: true,
        settings: {
          notification_preferences: {
            new_jobs: true,
            job_updates: true,
          },
          max_concurrent_jobs: 3,
        },
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating driver:', error)
      return NextResponse.json(
        { error: 'Failed to create driver' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      driver: {
        id: driver.id,
        name: driver.name,
        phone: driver.phone,
      },
    })
  } catch (error) {
    console.error('Error creating driver:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: Request) {
  try {
    const facilityId = request.headers.get('x-facility-id')

    if (!facilityId) {
      return NextResponse.json(
        { error: 'Facility ID required' },
        { status: 401 }
      )
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const { data: drivers, error } = await supabase
      .from('drivers')
      .select('*')
      .eq('facility_id', facilityId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching drivers:', error)
      return NextResponse.json(
        { error: 'Failed to fetch drivers' },
        { status: 500 }
      )
    }

    return NextResponse.json({ drivers })
  } catch (error) {
    console.error('Error fetching drivers:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
