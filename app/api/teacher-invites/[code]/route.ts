import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET(request: NextRequest, { params }: { params: { code: string } }) {
  try {
    const { code } = params

    const invites = await sql`
      SELECT ti.*, s.name as school_name, c.name as class_name, u.name as invited_by_name
      FROM teacher_invites ti
      JOIN schools s ON ti.school_id = s.id
      LEFT JOIN classes c ON ti.class_id = c.id
      LEFT JOIN users u ON ti.invited_by = u.id
      WHERE ti.invite_code = ${code} AND ti.status = 'pending'
      AND (ti.expires_at IS NULL OR ti.expires_at > NOW())
    `

    if (invites.length === 0) {
      return NextResponse.json({ error: "Invalid or expired invite code" }, { status: 404 })
    }

    return NextResponse.json(invites[0])
  } catch (error) {
    console.error("Error fetching invite:", error)
    return NextResponse.json({ error: "Failed to fetch invite" }, { status: 500 })
  }
}

export async function POST(request: NextRequest, { params }: { params: { code: string } }) {
  try {
    const { code } = params
    const { name, email, password } = await request.json()

    // Get invite details
    const invites = await sql`
      SELECT * FROM teacher_invites 
      WHERE invite_code = ${code} AND status = 'pending'
      AND (expires_at IS NULL OR expires_at > NOW())
    `

    if (invites.length === 0) {
      return NextResponse.json({ error: "Invalid or expired invite code" }, { status: 404 })
    }

    const invite = invites[0]

    // Check if email already exists
    const existingUsers = await sql`
      SELECT id FROM users WHERE email = ${email}
    `

    if (existingUsers.length > 0) {
      return NextResponse.json({ error: "Email already registered" }, { status: 400 })
    }

    // Hash password
    const bcrypt = require("bcryptjs")
    const password_hash = await bcrypt.hash(password, 12)

    // Create teacher user
    const users = await sql`
      INSERT INTO users (name, email, password_hash, role, school_id, class_id)
      VALUES (${name}, ${email}, ${password_hash}, 'teacher', ${invite.school_id}, ${invite.class_id})
      RETURNING *
    `

    const user = users[0]

    // Update invite status
    await sql`
      UPDATE teacher_invites 
      SET status = 'accepted'
      WHERE id = ${invite.id}
    `

    // If there's a class assigned, update the class with teacher
    if (invite.class_id) {
      await sql`
        UPDATE classes 
        SET teacher_id = ${user.id}
        WHERE id = ${invite.class_id}
      `
    }

    // Remove password hash from response
    const { password_hash: _, ...userWithoutPassword } = user

    return NextResponse.json(userWithoutPassword)
  } catch (error) {
    console.error("Error accepting invite:", error)
    return NextResponse.json({ error: "Failed to accept invite" }, { status: 500 })
  }
}
