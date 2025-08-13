import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const classId = params.id

    // Get class information
    const classResult = await sql`
      SELECT 
        c.*,
        s.name as school_name,
        s.address as school_address,
        u.name as teacher_name,
        u.email as teacher_email,
        COUNT(students.id) as student_count
      FROM classes c
      LEFT JOIN schools s ON c.school_id = s.id
      LEFT JOIN users u ON c.teacher_id = u.id
      LEFT JOIN users students ON c.id = students.class_id AND students.role = 'student'
      WHERE c.id = ${classId}
      GROUP BY c.id, s.name, s.address, u.name, u.email
    `

    if (classResult.length === 0) {
      return NextResponse.json({ error: "Class not found" }, { status: 404 })
    }

    // Get students in this class
    const studentsResult = await sql`
      SELECT 
        id,
        name,
        email,
        points,
        level,
        grade,
        created_at
      FROM users
      WHERE class_id = ${classId} AND role = 'student'
      ORDER BY points DESC, name ASC
    `

    // Get recent class activity
    const activityResult = await sql`
      SELECT 
        ua.id,
        ua.points_earned,
        ua.status,
        ua.created_at,
        u.name as student_name,
        ea.name as action_name,
        ea.icon as action_icon
      FROM user_actions ua
      JOIN users u ON ua.user_id = u.id
      JOIN eco_actions ea ON ua.action_id = ea.id
      WHERE u.class_id = ${classId}
      ORDER BY ua.created_at DESC
      LIMIT 10
    `

    // Calculate class statistics
    const statsResult = await sql`
      SELECT 
        COUNT(CASE WHEN role = 'student' THEN 1 END) as total_students,
        COALESCE(SUM(CASE WHEN role = 'student' THEN points ELSE 0 END), 0) as total_points,
        COALESCE(AVG(CASE WHEN role = 'student' THEN points ELSE NULL END), 0) as average_points
      FROM users
      WHERE class_id = ${classId}
    `

    const actionStatsResult = await sql`
      SELECT 
        COUNT(CASE WHEN ua.status = 'pending' THEN 1 END) as pending_actions,
        COUNT(CASE WHEN ua.status = 'approved' THEN 1 END) as approved_actions,
        COUNT(CASE WHEN ua.status = 'rejected' THEN 1 END) as rejected_actions
      FROM user_actions ua
      JOIN users u ON ua.user_id = u.id
      WHERE u.class_id = ${classId}
    `

    const classInfo = classResult[0]
    const stats = statsResult[0] || { total_students: 0, total_points: 0, average_points: 0 }
    const actionStats = actionStatsResult[0] || { pending_actions: 0, approved_actions: 0, rejected_actions: 0 }

    return NextResponse.json({
      class: {
        ...classInfo,
        student_count: Number.parseInt(stats.total_students) || 0,
      },
      students: studentsResult,
      activity: activityResult,
      stats: {
        total_students: Number.parseInt(stats.total_students) || 0,
        total_points: Number.parseInt(stats.total_points) || 0,
        average_points: Math.round(Number.parseFloat(stats.average_points) || 0),
        pending_actions: Number.parseInt(actionStats.pending_actions) || 0,
        approved_actions: Number.parseInt(actionStats.approved_actions) || 0,
        rejected_actions: Number.parseInt(actionStats.rejected_actions) || 0,
      },
    })
  } catch (error) {
    console.error("Error fetching class details:", error)
    return NextResponse.json({ error: "Failed to fetch class details" }, { status: 500 })
  }
}
