import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const { user_id, action_id, quantity, description, photo_url } = await request.json()
    
    // Get action details to calculate points
    const actions = await sql`
      SELECT * FROM eco_actions WHERE id = ${action_id}
    `
    
    if (actions.length === 0) {
      return NextResponse.json({ error: 'Action not found' }, { status: 404 })
    }
    
    const action = actions[0]
    const points_earned = action.points * quantity
    
    // Insert user action with pending status
    const result = await sql`
      INSERT INTO user_actions (user_id, action_id, quantity, points_earned, description, photo_url, status)
      VALUES (${user_id}, ${action_id}, ${quantity}, ${points_earned}, ${description || null}, ${photo_url || null}, 'pending')
      RETURNING *
    `
    
    return NextResponse.json(result[0])
  } catch (error) {
    console.error('Error creating user action:', error)
    return NextResponse.json({ error: 'Failed to create user action' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const user_id = searchParams.get('user_id')
    
    if (!user_id) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 })
    }
    
    const userActions = await sql`
      SELECT ua.*, ea.name as action_name, ea.icon, ea.unit
      FROM user_actions ua
      JOIN eco_actions ea ON ua.action_id = ea.id
      WHERE ua.user_id = ${user_id}
      ORDER BY ua.created_at DESC
    `
    
    return NextResponse.json(userActions)
  } catch (error) {
    console.error('Error fetching user actions:', error)
    return NextResponse.json({ error: 'Failed to fetch user actions' }, { status: 500 })
  }
}
