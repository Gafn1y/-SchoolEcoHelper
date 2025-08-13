import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const teacher_id = searchParams.get("teacher_id")
    const status = searchParams.get("status")
    const limit = searchParams.get("limit")

    if (!teacher_id) {
      return NextResponse.json({ error: "Teacher ID is required" }, { status: 400 })
    }

    // Get teacher's class
    const teacherResult = await sql`
      SELECT class_id FROM users WHERE id = ${teacher_id} AND role = 'teacher'
    `

    if (teacherResult.length === 0 || !teacherResult[0].class_id) {
      return NextResponse.json([])
    }

    const class_id = teacherResult[0].class_id

    // Build query based on status filter
    let query
    if (status === "pending") {
      query = sql`
        SELECT 
          ua.id,
          ua.user_id,
          ua.action_id,
          ua.points_earned,
          ua.description,
          ua.photo_url,
          ua.status,
          ua.created_at,
          u.name as student_name,
          ea.name as action_name,
          ea.icon as action_icon
        FROM user_actions ua
        JOIN users u ON ua.user_id = u.id
        JOIN eco_actions ea ON ua.action_id = ea.id
        WHERE u.class_id = ${class_id} AND ua.status = 'pending'
        ORDER BY ua.created_at DESC
      `
    } else if (status === "approved") {
      const limitValue = limit ? Number.parseInt(limit) : 10
      query = sql`
        SELECT 
          ua.id,
          ua.user_id,
          ua.action_id,
          ua.points_earned,
          ua.description,
          ua.photo_url,
          ua.status,
          ua.created_at,
          u.name as student_name,
          ea.name as action_name,
          ea.icon as action_icon
        FROM user_actions ua
        JOIN users u ON ua.user_id = u.id
        JOIN eco_actions ea ON ua.action_id = ea.id
        WHERE u.class_id = ${class_id} AND ua.status = 'approved'
        ORDER BY ua.created_at DESC
        LIMIT ${limitValue}
      `
    } else {
      // Get all actions for the class
      query = sql`
        SELECT 
          ua.id,
          ua.user_id,
          ua.action_id,
          ua.points_earned,
          ua.description,
          ua.photo_url,
          ua.status,
          ua.created_at,
          u.name as student_name,
          ea.name as action_name,
          ea.icon as action_icon
        FROM user_actions ua
        JOIN users u ON ua.user_id = u.id
        JOIN eco_actions ea ON ua.action_id = ea.id
        WHERE u.class_id = ${class_id}
        ORDER BY ua.created_at DESC
      `
    }

    const result = await query
    return NextResponse.json(result)
  } catch (error) {
    console.error("Error fetching teacher actions:", error)
    return NextResponse.json({ error: "Failed to fetch teacher actions" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { action_id, teacher_id, status } = body

    if (!action_id || !teacher_id || !status) {
      return NextResponse.json({ error: "Action ID, teacher ID, and status are required" }, { status: 400 })
    }

    if (!["approved", "rejected"].includes(status)) {
      return NextResponse.json({ error: "Status must be 'approved' or 'rejected'" }, { status: 400 })
    }

    // Verify teacher has permission to review this action
    const actionResult = await sql`
      SELECT ua.*, u.class_id, u.name as student_name
      FROM user_actions ua
      JOIN users u ON ua.user_id = u.id
      WHERE ua.id = ${action_id}
    `

    if (actionResult.length === 0) {
      return NextResponse.json({ error: "Action not found" }, { status: 404 })
    }

    const action = actionResult[0]

    // Check if teacher is assigned to this class
    const teacherResult = await sql`
      SELECT class_id FROM users WHERE id = ${teacher_id} AND role = 'teacher'
    `

    if (teacherResult.length === 0 || teacherResult[0].class_id !== action.class_id) {
      return NextResponse.json({ error: "Unauthorized to review this action" }, { status: 403 })
    }

    // Update action status
    const updateResult = await sql`
      UPDATE user_actions 
      SET status = ${status}, 
          reviewed_at = NOW(), 
          reviewed_by = ${teacher_id}
      WHERE id = ${action_id}
      RETURNING *
    `

    // If approved, add points to student
    if (status === "approved") {
      await sql`
        UPDATE users 
        SET points = points + ${action.points_earned},
            level = CASE 
              WHEN points + ${action.points_earned} >= 1000 THEN 10
              WHEN points + ${action.points_earned} >= 500 THEN 5
              WHEN points + ${action.points_earned} >= 100 THEN 2
              ELSE 1
            END
        WHERE id = ${action.user_id}
      `
    }

    return NextResponse.json(updateResult[0])
  } catch (error) {
    console.error("Error updating action status:", error)
    return NextResponse.json({ error: "Failed to update action status" }, { status: 500 })
  }
}
