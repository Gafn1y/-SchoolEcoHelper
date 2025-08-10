import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const teacher_id = searchParams.get("teacher_id")

    if (!teacher_id) {
      return NextResponse.json({ error: "Teacher ID required" }, { status: 400 })
    }

    // Get teacher's class
    const teacher = await sql`
      SELECT class_id FROM users WHERE id = ${teacher_id} AND role = 'teacher'
    `

    if (teacher.length === 0 || !teacher[0].class_id) {
      return NextResponse.json({
        totalStudents: 0,
        pendingActions: 0,
        approvedActions: 0,
        totalPoints: 0,
      })
    }

    const class_id = teacher[0].class_id

    // Get students count
    const studentsCount = await sql`
      SELECT COUNT(*) as count FROM users 
      WHERE class_id = ${class_id} AND role = 'student'
    `

    // Get pending actions count
    const pendingCount = await sql`
      SELECT COUNT(*) as count FROM user_actions ua
      JOIN users u ON ua.user_id = u.id
      WHERE u.class_id = ${class_id} AND ua.status = 'pending'
    `

    // Get approved actions count
    const approvedCount = await sql`
      SELECT COUNT(*) as count FROM user_actions ua
      JOIN users u ON ua.user_id = u.id
      WHERE u.class_id = ${class_id} AND ua.status = 'approved'
    `

    // Get total points
    const totalPoints = await sql`
      SELECT COALESCE(SUM(points), 0) as total FROM users 
      WHERE class_id = ${class_id} AND role = 'student'
    `

    return NextResponse.json({
      totalStudents: Number.parseInt(studentsCount[0].count),
      pendingActions: Number.parseInt(pendingCount[0].count),
      approvedActions: Number.parseInt(approvedCount[0].count),
      totalPoints: Number.parseInt(totalPoints[0].total),
    })
  } catch (error) {
    console.error("Error fetching teacher stats:", error)
    return NextResponse.json({ error: "Failed to fetch teacher stats" }, { status: 500 })
  }
}
