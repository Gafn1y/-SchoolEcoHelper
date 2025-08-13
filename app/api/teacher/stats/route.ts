import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const teacher_id = searchParams.get("teacher_id")

    if (!teacher_id) {
      return NextResponse.json({ error: "Teacher ID is required" }, { status: 400 })
    }

    // Get teacher's class
    const teacherResult = await sql`
      SELECT class_id, school_id FROM users WHERE id = ${teacher_id} AND role = 'teacher'
    `

    if (teacherResult.length === 0) {
      return NextResponse.json({
        total_students: 0,
        total_class_points: 0,
        pending_actions: 0,
        approved_actions: 0,
        average_student_points: 0,
      })
    }

    const { class_id, school_id } = teacherResult[0]

    if (!class_id) {
      return NextResponse.json({
        total_students: 0,
        total_class_points: 0,
        pending_actions: 0,
        approved_actions: 0,
        average_student_points: 0,
      })
    }

    // Get class statistics
    const studentsResult = await sql`
      SELECT 
        COUNT(*) as total_students,
        COALESCE(SUM(points), 0) as total_class_points,
        COALESCE(AVG(points), 0) as average_student_points
      FROM users 
      WHERE class_id = ${class_id} AND role = 'student'
    `

    const actionsResult = await sql`
      SELECT 
        COUNT(CASE WHEN ua.status = 'pending' THEN 1 END) as pending_actions,
        COUNT(CASE WHEN ua.status = 'approved' THEN 1 END) as approved_actions
      FROM user_actions ua
      JOIN users u ON ua.user_id = u.id
      WHERE u.class_id = ${class_id}
    `

    const studentStats = studentsResult[0] || { total_students: 0, total_class_points: 0, average_student_points: 0 }
    const actionStats = actionsResult[0] || { pending_actions: 0, approved_actions: 0 }

    const stats = {
      total_students: Number.parseInt(studentStats.total_students) || 0,
      total_class_points: Number.parseInt(studentStats.total_class_points) || 0,
      pending_actions: Number.parseInt(actionStats.pending_actions) || 0,
      approved_actions: Number.parseInt(actionStats.approved_actions) || 0,
      average_student_points: Math.round(Number.parseFloat(studentStats.average_student_points) || 0),
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error("Error fetching teacher stats:", error)
    return NextResponse.json({
      total_students: 0,
      total_class_points: 0,
      pending_actions: 0,
      approved_actions: 0,
      average_student_points: 0,
    })
  }
}
