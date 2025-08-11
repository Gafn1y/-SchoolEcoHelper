import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const { name, grade, school_id, capacity } = await request.json()

    const result = await sql`
      INSERT INTO classes (name, grade, school_id, student_count, capacity)
      VALUES (${name}, ${grade}, ${school_id}, 0, ${Number.parseInt(capacity) || 30})
      RETURNING *
    `

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Error creating class:", error)
    return NextResponse.json({ error: "Failed to create class" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const school_id = searchParams.get("school_id")

    if (!school_id) {
      return NextResponse.json({ error: "School ID required" }, { status: 400 })
    }

    const classes = await sql`
      SELECT c.*, u.name as teacher_name
      FROM classes c
      LEFT JOIN users u ON c.teacher_id = u.id
      WHERE c.school_id = ${school_id}
      ORDER BY c.grade, c.name
    `

    return NextResponse.json(classes)
  } catch (error) {
    console.error("Error fetching classes:", error)
    return NextResponse.json({ error: "Failed to fetch classes" }, { status: 500 })
  }
}
