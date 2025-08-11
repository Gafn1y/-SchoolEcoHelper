import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"
import jwt from "jsonwebtoken"

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader) {
      return NextResponse.json({ error: "No authorization header" }, { status: 401 })
    }

    const token = authHeader.replace("Bearer ", "")
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any

    if (decoded.role !== "teacher") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    // Get pending actions for students in teacher's classes
    const actions = await sql`
      SELECT 
        ua.*,
        u.name as student_name,
        c.name as class_name,
        ea.name as action_name,
        ea.description as action_description,
        ea.category
      FROM user_actions ua
      JOIN users u ON ua.user_id = u.id
      JOIN classes c ON u.class_id = c.id
      JOIN eco_actions ea ON ua.action_id = ea.id
      WHERE c.teacher_id = ${decoded.userId}
      AND ua.status = 'pending'
      ORDER BY ua.created_at DESC
    `

    return NextResponse.json({ actions })
  } catch (error) {
    console.error("Get teacher actions error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader) {
      return NextResponse.json({ error: "No authorization header" }, { status: 401 })
    }

    const token = authHeader.replace("Bearer ", "")
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any

    if (decoded.role !== "teacher") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const { actionId, status, feedback } = await request.json()

    if (!actionId || !status || !["approved", "rejected"].includes(status)) {
      return NextResponse.json({ error: "Invalid action ID or status" }, { status: 400 })
    }

    // Update action status
    const updatedAction = await sql`
      UPDATE user_actions 
      SET status = ${status}, 
          teacher_feedback = ${feedback || null},
          reviewed_at = NOW(),
          reviewed_by = ${decoded.userId}
      WHERE id = ${actionId}
      RETURNING *
    `

    if (updatedAction.length === 0) {
      return NextResponse.json({ error: "Action not found" }, { status: 404 })
    }

    // If approved, update user points
    if (status === "approved") {
      await sql`
        UPDATE users 
        SET points = points + (
          SELECT points FROM eco_actions WHERE id = ${updatedAction[0].action_id}
        )
        WHERE id = ${updatedAction[0].user_id}
      `
    }

    return NextResponse.json({ action: updatedAction[0] })
  } catch (error) {
    console.error("Update teacher action error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
