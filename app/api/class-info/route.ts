import { sql } from "@/lib/db"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("user_id")

    if (!userId) {
      return NextResponse.json({ error: "Missing user_id parameter" }, { status: 400 })
    }

    // Fetch user information
    const userResult = await sql`
      SELECT id, name, email, role, school_id, class_id, grade, points, level
      FROM users
      WHERE id = ${userId}
    `

    if (userResult.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const user = userResult[0]

    let school = null
    if (user.school_id) {
      const schoolResult = await sql`
        SELECT id, name, address, phone, website, description, director_name, director_email, total_classes
        FROM schools
        WHERE id = ${user.school_id}
      `
      school = schoolResult.length > 0 ? schoolResult[0] : null
    }

    let classData = null
    if (user.class_id) {
      const classResult = await sql`
        SELECT id, name, grade, teacher_id, student_count
        FROM classes
        WHERE id = ${user.class_id}
      `
      classData = classResult.length > 0 ? classResult[0] : null
    }

    let teacher = null
    if (classData?.teacher_id) {
      const teacherResult = await sql`
        SELECT id, name, email FROM users WHERE id = ${classData.teacher_id}
      `
      teacher = teacherResult.length > 0 ? teacherResult[0] : null
    }

    let classmates = []
    if (user.class_id) {
      const classmatesResult = await sql`
        SELECT id, name, email, points, level, created_at
        FROM users
        WHERE class_id = ${user.class_id} AND id != ${userId} AND role = 'student'
        ORDER BY points DESC
      `
      classmates = classmatesResult
    }

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        school_id: user.school_id,
        class_id: user.class_id,
        grade: user.grade,
        points: user.points,
        level: user.level,
      },
      school: school,
      class: {
        id: classData?.id || null,
        name: classData?.name || null,
        grade: classData?.grade || null,
        student_count: classData?.student_count || 0,
        teacher_name: teacher?.name || null,
        teacher_email: teacher?.email || null,
      },
      classmates: classmates,
    })
  } catch (error) {
    console.error("Error fetching class info:", error)
    return NextResponse.json({ error: "Failed to fetch class information" }, { status: 500 })
  }
}
