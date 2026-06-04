import { NextRequest, NextResponse } from 'next/server'
import nile from '@/lib/nile'

// Get pending order notifications for a facility
export async function GET(request: NextRequest) {
  try {
    const facilityId = request.headers.get('x-facility-id')

    if (!facilityId) {
      return NextResponse.json(
        { error: 'Facility authentication required' },
        { status: 401 }
      )
    }

    const result = await nile.db.query(`
      SELECT 
        n.id as notification_id,
        n.distance_km,
        n.status as notification_status,
        n.notified_at,
        o.*
      FROM order_notifications n
      JOIN orders o ON n.order_id = o.id
      WHERE n.facility_id = $1 AND n.status = 'pending'
      ORDER BY n.notified_at DESC
    `, [facilityId])

    return NextResponse.json({ notifications: result.rows })
  } catch (error) {
    console.error('[Notifications GET Error]:', error)
    return NextResponse.json(
      { error: 'Failed to fetch notifications' },
      { status: 500 }
    )
  }
}

// Accept or reject an order notification
export async function POST(request: NextRequest) {
  try {
    const facilityId = request.headers.get('x-facility-id')
    const tenantId = request.headers.get('x-tenant-id')

    if (!facilityId || !tenantId) {
      return NextResponse.json(
        { error: 'Facility authentication required' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { notification_id, order_id, action } = body

    if (!notification_id || !order_id || !action) {
      return NextResponse.json(
        { error: 'notification_id, order_id, and action are required' },
        { status: 400 }
      )
    }

    if (action === 'accept') {
      // Check if order is still available
      const orderCheck = await nile.db.query(
        'SELECT status, facility_id FROM orders WHERE id = $1',
        [order_id]
      )

      if (orderCheck.rows[0]?.facility_id) {
        return NextResponse.json(
          { error: 'Order has already been accepted by another facility' },
          { status: 400 }
        )
      }

      // Accept the order
      await nile.db.query(`
        UPDATE orders 
        SET facility_id = $1, status = 'confirmed', assigned_at = NOW(), updated_at = NOW()
        WHERE id = $2
      `, [facilityId, order_id])

      // Update this notification
      await nile.db.query(`
        UPDATE order_notifications 
        SET status = 'accepted', response = 'accepted', responded_at = NOW()
        WHERE id = $1
      `, [notification_id])

      // Reject all other notifications for this order
      await nile.db.query(`
        UPDATE order_notifications 
        SET status = 'rejected', response = 'auto_rejected', responded_at = NOW()
        WHERE order_id = $1 AND id != $2 AND status = 'pending'
      `, [order_id, notification_id])

      return NextResponse.json({
        success: true,
        message: 'Order accepted successfully'
      })
    } else if (action === 'reject') {
      // Reject the notification
      await nile.db.query(`
        UPDATE order_notifications 
        SET status = 'rejected', response = 'rejected', responded_at = NOW()
        WHERE id = $1
      `, [notification_id])

      return NextResponse.json({
        success: true,
        message: 'Order rejected'
      })
    }

    return NextResponse.json(
      { error: 'Invalid action. Use "accept" or "reject"' },
      { status: 400 }
    )
  } catch (error) {
    console.error('[Notifications POST Error]:', error)
    return NextResponse.json(
      { error: 'Failed to process notification' },
      { status: 500 }
    )
  }
}
