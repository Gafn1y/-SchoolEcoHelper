import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const { teacher_id, class_id } = await request.json()

    if (!teacher_id || !class_id) {
      return NextResponse.json({ error: "Teacher ID and Class ID required" }, { status: 400 })
    }

    // Verify teacher exists and has teacher role
    const teacher = await sql`
      SELECT id, name, role, school_id FROM users 
      WHERE id = ${teacher_id} AND role = 'teacher'
    `

    if (teacher.length === 0) {
      return NextResponse.json({ error: "Teacher not found" }, { status: 404 })
    }

    // Verify class exists and belongs to same school
    const classInfo = await sql`
      SELECT id, name, school_id FROM classes 
      WHERE id = ${class_id} AND school_id = ${teacher[0].school_id}
    `

    if (classInfo.length === 0) {
      return NextResponse.json({ error: "Class not found or not in same school" }, { status: 404 })
    }

    // Update class with teacher assignment
    await sql`
      UPDATE classes 
      SET teacher_id = ${teacher_id}, updated_at = NOW()
      WHERE id = ${class_id}
    `

    // Update teacher's class assignment
    await sql`
      UPDATE users 
      SET class_id = ${class_id}, updated_at = NOW()
      WHERE id = ${teacher_id}
    `

    return NextResponse.json({
      message: "Teacher assigned successfully",
      teacher_name: teacher[0].name,
      class_name: classInfo[0].name,
    })
  } catch (error) {
    console.error("Error assigning teacher:", error)
    return NextResponse.json({ error: "Failed to assign teacher" }, { status: 500 })
  }
}
