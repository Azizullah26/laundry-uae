import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Generate order number
function generateOrderNumber(): string {
  const prefix = 'LK'
  const timestamp = Date.now().toString(36).toUpperCase()
  const random = Math.random().toString(36).substring(2, 5).toUpperCase()
  return `${prefix}-${timestamp}${random}`.slice(0, 12)
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      customer_phone,
      customer_name,
      customer_address,
      customer_latitude,
      customer_longitude,
      service_type,
      items,
      special_instructions,
      pickup_date,
      pickup_time_slot,
      delivery_date,
      delivery_time_slot,
      subtotal,
      delivery_fee,
      discount,
      total,
      payment_method,
    } = body

    if (!customer_phone || !customer_name || !customer_address) {
      return NextResponse.json(
        { error: 'Customer phone, name, and address are required' },
        { status: 400 }
      )
    }

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: 'At least one item is required' },
        { status: 400 }
      )
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Generate unique order number
    const order_number = generateOrderNumber()

    // Find nearest active facility based on location (for now, just get a random active one)
    const { data: facilities } = await supabase
      .from('facilities')
      .select('id')
      .eq('status', 'active')
      .limit(1)

    const facility_id = facilities?.[0]?.id || null

    // Create customer record or find existing
    let customer_id = null
    const { data: existingCustomer } = await supabase
      .from('customers')
      .select('id')
      .eq('phone', customer_phone)
      .single()

    if (existingCustomer) {
      customer_id = existingCustomer.id
      // Update customer name and address if changed
      await supabase
        .from('customers')
        .update({
          name: customer_name,
          default_address: customer_address,
          default_latitude: customer_latitude,
          default_longitude: customer_longitude,
        })
        .eq('id', customer_id)
    } else {
      // Create new customer
      const { data: newCustomer, error: customerError } = await supabase
        .from('customers')
        .insert({
          phone: customer_phone,
          name: customer_name,
          default_address: customer_address,
          default_latitude: customer_latitude,
          default_longitude: customer_longitude,
        })
        .select()
        .single()

      if (customerError) {
        console.error('Error creating customer:', customerError)
      } else {
        customer_id = newCustomer.id
      }
    }

    // Create order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        order_number,
        customer_id,
        facility_id,
        customer_phone,
        customer_name,
        customer_address,
        customer_latitude,
        customer_longitude,
        status: 'pending',
        service_type,
        items,
        special_instructions: special_instructions || null,
        pickup_date,
        pickup_time_slot,
        delivery_date,
        delivery_time_slot,
        subtotal,
        delivery_fee,
        express_fee: 0,
        discount: discount || 0,
        total,
        payment_method,
        payment_status: payment_method === 'cash' ? 'pending' : 'pending',
      })
      .select()
      .single()

    if (orderError) {
      console.error('Error creating order:', orderError)
      return NextResponse.json(
        { error: 'Failed to create order' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      order_id: order.id,
      order_number: order.order_number,
    })
  } catch (error) {
    console.error('Error creating order:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const phone = searchParams.get('phone')
    const order_number = searchParams.get('order_number')

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    let query = supabase.from('orders').select('*')

    if (phone) {
      query = query.eq('customer_phone', phone)
    }

    if (order_number) {
      query = query.eq('order_number', order_number)
    }

    const { data: orders, error } = await query.order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching orders:', error)
      return NextResponse.json(
        { error: 'Failed to fetch orders' },
        { status: 500 }
      )
    }

    return NextResponse.json({ orders })
  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
