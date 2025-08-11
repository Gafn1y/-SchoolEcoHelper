import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"
import jwt from "jsonwebtoken"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader) {
      return NextResponse.json({ error: "No authorization header" }, { status: 401 })
    }

    const token = authHeader.replace("Bearer ", "")
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any
    const schoolId = Number.parseInt(params.id)

    // Check if user has access to this school's stats
    if (decoded.schoolId !== schoolId && decoded.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    // Get school statistics
    const stats = await sql`
      SELECT 
        COUNT(DISTINCT u.id) as total_students,
        COUNT(DISTINCT c.id) as total_classes,
        COUNT(DISTINCT CASE WHEN u.role = 'teacher' THEN u.id END) as total_teachers,
        COALESCE(SUM(u.points), 0) as total_points,
        COUNT(DISTINCT ua.id) as total_actions
      FROM schools s
      LEFT JOIN users u ON s.id = u.school_id
      LEFT JOIN classes c ON s.id = c.school_id
      LEFT JOIN user_actions ua ON u.id = ua.user_id AND ua.status = 'approved'
      WHERE s.id = ${schoolId}
      GROUP BY s.id
    `

    // Get top students
    const topStudents = await sql`
      SELECT u.name, u.points, c.name as class_name
      FROM users u
      LEFT JOIN classes c ON u.class_id = c.id
      WHERE u.school_id = ${schoolId} AND u.role = 'student'
      ORDER BY u.points DESC
      LIMIT 10
    `

    // Get top classes
    const topClasses = await sql`
      SELECT 
        c.name,
        COUNT(u.id) as student_count,
        COALESCE(SUM(u.points), 0) as total_points,
        COALESCE(AVG(u.points), 0) as avg_points
      FROM classes c
      LEFT JOIN users u ON c.id = u.class_id AND u.role = 'student'
      WHERE c.school_id = ${schoolId}
      GROUP BY c.id, c.name
      ORDER BY total_points DESC
    `

    // Get recent actions
    const recentActions = await sql`
      SELECT 
        ua.created_at,
        u.name as student_name,
        c.name as class_name,
        ea.name as action_name,
        ea.points,
        ua.status
      FROM user_actions ua
      JOIN users u ON ua.user_id = u.id
      JOIN classes c ON u.class_id = c.id
      JOIN eco_actions ea ON ua.action_id = ea.id
      WHERE u.school_id = ${schoolId}
      ORDER BY ua.created_at DESC
      LIMIT 20
    `

    return NextResponse.json({
      stats: stats[0] || {
        total_students: 0,
        total_classes: 0,
        total_teachers: 0,
        total_points: 0,
        total_actions: 0,
      },
      topStudents,
      topClasses,
      recentActions,
    })
  } catch (error) {
    console.error("Get school stats error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
