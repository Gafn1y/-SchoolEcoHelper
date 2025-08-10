import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: { code: string } }
) {
  try {
    const { code } = params
    
    const invites = await sql`
      SELECT ti.*, s.name as school_name, c.name as class_name, c.grade as class_grade
      FROM teacher_invites ti
      LEFT JOIN schools s ON ti.school_id = s.id
      LEFT JOIN classes c ON ti.class_id = c.id
      WHERE ti.invite_code = ${code} 
      AND ti.status = 'pending'
      AND ti.expires_at > NOW()
    `
    
    if (invites.length === 0) {
      return NextResponse.json({ error: 'Invalid or expired invite code' }, { status: 404 })
    }
    
    return NextResponse.json(invites[0])
  } catch (error) {
    console.error('Error fetching invite:', error)
    return NextResponse.json({ error: 'Failed to fetch invite' }, { status: 500 })
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { code: string } }
) {
  try {
    const { code } = params
    const { email, password } = await request.json()
    
    // Get invite details
    const invites = await sql`
      SELECT * FROM teacher_invites 
      WHERE invite_code = ${code} 
      AND status = 'pending'
      AND expires_at > NOW()
    `
    
    if (invites.length === 0) {
      return NextResponse.json({ error: 'Invalid or expired invite code' }, { status: 404 })
    }
    
    const invite = invites[0]
    
    // Check if email already exists
    const existingUser = await sql`
      SELECT id FROM users WHERE email = ${email}
    `
    
    if (existingUser.length > 0) {
      return NextResponse.json({ error: 'Email already exists' }, { status: 400 })
    }
    
    // Hash password
    const bcrypt = require('bcryptjs')
    const password_hash = await bcrypt.hash(password, 10)
    
    // Create teacher user with homeroom status
    const userResult = await sql`
      INSERT INTO users (name, email, password_hash, role, school_id, class_id, is_homeroom_teacher)
      VALUES (${invite.name}, ${email}, ${password_hash}, 'teacher', ${invite.school_id}, ${invite.class_id}, true)
      RETURNING id, name, email, role, school_id, class_id, is_homeroom_teacher
    `
    
    const user = userResult[0]
    
    // Update class with teacher
    await sql`
      UPDATE classes 
      SET teacher_id = ${user.id}
      WHERE id = ${invite.class_id}
    `
    
    // Mark invite as accepted
    await sql`
      UPDATE teacher_invites 
      SET status = 'accepted'
      WHERE id = ${invite.id}
    `
    
    // Get school and class info
    const schoolAndClass = await sql`
      SELECT s.name as school_name, c.name as class_name, c.grade as class_grade
      FROM schools s, classes c 
      WHERE s.id = ${invite.school_id} AND c.id = ${invite.class_id}
    `
    
    return NextResponse.json({
      ...user,
      school_name: schoolAndClass[0]?.school_name,
      class_name: schoolAndClass[0]?.class_name,
      class_grade: schoolAndClass[0]?.class_grade
    })
  } catch (error) {
    console.error('Error accepting invite:', error)
    return NextResponse.json({ error: 'Failed to accept invite' }, { status: 500 })
  }
}
