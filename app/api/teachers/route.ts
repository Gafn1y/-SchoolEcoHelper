import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const school_id = searchParams.get("school_id")

    if (!school_id) {
      return NextResponse.json({ error: "School ID required" }, { status: 400 })
    }

    const teachers = await sql`
      SELECT 
        u.id,
        u.name,
        u.email,
        u.created_at,
        u.points,
        u.level,
        u.is_homeroom_teacher,
        c.name as class_name,
        c.grade as class_grade,
        c.student_count
      FROM users u
      LEFT JOIN classes c ON u.class_id = c.id
      WHERE u.school_id = ${school_id} 
      AND u.role = 'teacher'
      ORDER BY u.created_at DESC
    `

    return NextResponse.json(teachers)
  } catch (error) {
    console.error("Error fetching teachers:", error)
    return NextResponse.json({ error: "Failed to fetch teachers" }, { status: 500 })
  }
}
