import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const teacher_id = searchParams.get('teacher_id')
    
    if (!teacher_id) {
      return NextResponse.json({ error: 'Teacher ID required' }, { status: 400 })
    }
    
    // Get teacher's class
    const teacher = await sql`
      SELECT class_id FROM users WHERE id = ${teacher_id} AND role = 'teacher'
    `
    
    if (teacher.length === 0 || !teacher[0].class_id) {
      return NextResponse.json([])
    }
    
    const class_id = teacher[0].class_id
    
    // Get pending actions from students in teacher's class
    const pendingActions = await sql`
      SELECT ua.*, ea.name as action_name, ea.icon, ea.unit, u.name as student_name
      FROM user_actions ua
      JOIN eco_actions ea ON ua.action_id = ea.id
      JOIN users u ON ua.user_id = u.id
      WHERE u.class_id = ${class_id} 
      AND u.role = 'student'
      AND ua.status = 'pending'
      ORDER BY ua.created_at DESC
    `
    
    return NextResponse.json(pendingActions)
  } catch (error) {
    console.error('Error fetching pending actions:', error)
    return NextResponse.json({ error: 'Failed to fetch pending actions' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { action_id, teacher_id, status } = await request.json()
    
    if (!action_id || !teacher_id || !status) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }
    
    if (!['approved', 'rejected'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
    }
    
    // Update action status
    const result = await sql`
      UPDATE user_actions 
      SET status = ${status}, reviewed_by = ${teacher_id}, reviewed_at = NOW()
      WHERE id = ${action_id}
      RETURNING *
    `
    
    if (result.length === 0) {
      return NextResponse.json({ error: 'Action not found' }, { status: 404 })
    }
    
    const updatedAction = result[0]
    
    // If approved, add points to student
    if (status === 'approved') {
      await sql`
        UPDATE users 
        SET points = points + ${updatedAction.points_earned},
            level = FLOOR((points + ${updatedAction.points_earned}) / 100) + 1
        WHERE id = ${updatedAction.user_id}
      `
    }
    
    return NextResponse.json(updatedAction)
  } catch (error) {
    console.error('Error reviewing action:', error)
    return NextResponse.json({ error: 'Failed to review action' }, { status: 500 })
  }
}
