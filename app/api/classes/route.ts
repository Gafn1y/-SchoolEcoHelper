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
      SELECT 
        c.id,
        c.name,
        c.grade,
        c.school_id,
        c.teacher_id,
        c.capacity,
        c.student_count,
        c.created_at,
        t.name as teacher_name,
        t.email as teacher_email,
        COUNT(s.id) as actual_student_count
      FROM classes c
      LEFT JOIN users t ON c.teacher_id = t.id AND t.role = 'teacher'
      LEFT JOIN users s ON c.id = s.class_id AND s.role = 'student'
      WHERE c.school_id = ${school_id}
      GROUP BY c.id, c.name, c.grade, c.school_id, c.teacher_id, c.capacity, c.student_count, c.created_at, t.name, t.email
      ORDER BY c.grade, c.name
    `

    // Convert student_count to number for each class
    const formattedClasses = classes.map((cls) => ({
      ...cls,
      student_count: Number.parseInt(cls.actual_student_count) || 0,
    }))

    return NextResponse.json(formattedClasses)
  } catch (error) {
    console.error("Error fetching classes:", error)
    return NextResponse.json({ error: "Failed to fetch classes" }, { status: 500 })
  }
}
