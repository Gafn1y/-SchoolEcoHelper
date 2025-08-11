import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const { name, email, subject, school_id, class_id, invited_by } = await request.json()

    // Generate unique invite code
    const invite_code = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)

    // Set expiration to 7 days from now
    const expires_at = new Date()
    expires_at.setDate(expires_at.getDate() + 7)

    const result = await sql`
      INSERT INTO teacher_invites (name, email, subject, school_id, class_id, invited_by, invite_code, expires_at)
      VALUES (${name}, ${email}, ${subject}, ${school_id}, ${class_id}, ${invited_by}, ${invite_code}, ${expires_at})
      RETURNING *
    `

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Error creating teacher invite:", error)
    return NextResponse.json({ error: "Failed to create teacher invite" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const school_id = searchParams.get("school_id")

    if (!school_id) {
      return NextResponse.json({ error: "School ID required" }, { status: 400 })
    }

    const invites = await sql`
      SELECT ti.*, c.name as class_name, u.name as invited_by_name
      FROM teacher_invites ti
      LEFT JOIN classes c ON ti.class_id = c.id
      LEFT JOIN users u ON ti.invited_by = u.id
      WHERE ti.school_id = ${school_id}
      ORDER BY ti.created_at DESC
    `

    return NextResponse.json(invites)
  } catch (error) {
    console.error("Error fetching teacher invites:", error)
    return NextResponse.json({ error: "Failed to fetch teacher invites" }, { status: 500 })
  }
}
