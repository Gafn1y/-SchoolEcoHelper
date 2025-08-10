import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const user_id = searchParams.get("user_id")

    if (!user_id) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 })
    }

    // Get user information
    const user = await sql`
      SELECT id, name, email, role, school_id, class_id, grade, points, level
      FROM users 
      WHERE id = ${user_id}
    `

    if (user.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const userData = user[0]

    // Get school information with director details
    let schoolInfo = null
    if (userData.school_id) {
      const school = await sql`
        SELECT s.*, u.name as director_name, u.email as director_email
        FROM schools s
        LEFT JOIN users u ON s.director_id = u.id
        WHERE s.id = ${userData.school_id}
      `

      if (school.length > 0) {
        schoolInfo = {
          id: school[0].id,
          name: school[0].name,
          address: school[0].address,
          phone: school[0].phone,
          website: school[0].website,
          description: school[0].description,
          total_classes: school[0].total_classes,
          director_name: school[0].director_name,
          director_email: school[0].director_email,
          created_at: school[0].created_at,
        }
      }
    }

    // Get class information with teacher and students
    let classInfo = null
    if (userData.class_id) {
      const classData = await sql`
        SELECT c.*, u.name as teacher_name, u.email as teacher_email
        FROM classes c
        LEFT JOIN users u ON c.teacher_id = u.id
        WHERE c.id = ${userData.class_id}
      `

      if (classData.length > 0) {
        // Get students in this class (excluding teachers)
        const students = await sql`
          SELECT id, name, email, points, level
          FROM users 
          WHERE class_id = ${userData.class_id} AND role = 'student'
          ORDER BY points DESC, name
        `

        classInfo = {
          id: classData[0].id,
          name: classData[0].name,
          grade: classData[0].grade,
          student_count: classData[0].student_count,
          capacity: classData[0].capacity,
          teacher_name: classData[0].teacher_name,
          teacher_email: classData[0].teacher_email,
          students: students,
          created_at: classData[0].created_at,
        }
      }
    }

    // Get classmates (other students in the same class)
    let classmates = []
    if (userData.class_id && userData.role === "student") {
      classmates = await sql`
        SELECT id, name, email, points, level
        FROM users 
        WHERE class_id = ${userData.class_id} AND role = 'student' AND id != ${user_id}
        ORDER BY points DESC, name
        LIMIT 10
      `
    }

    return NextResponse.json({
      user: userData,
      school: schoolInfo,
      class: classInfo,
      classmates: classmates,
    })
  } catch (error) {
    console.error("Error fetching class info:", error)
    return NextResponse.json({ error: "Failed to fetch class information" }, { status: 500 })
  }
}
