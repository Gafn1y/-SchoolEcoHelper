import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { status, reviewed_by } = await request.json()
    const actionId = params.id

    if (!status) {
      return NextResponse.json({ error: "Status is required" }, { status: 400 })
    }

    // Update the action status
    const result = await sql`
      UPDATE user_actions 
      SET status = ${status}, reviewed_by = ${reviewed_by || null}, reviewed_at = NOW()
      WHERE id = ${actionId}
      RETURNING *
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "Action not found" }, { status: 404 })
    }

    const action = result[0]

    // If approved, update user points
    if (status === "approved") {
      await sql`
        UPDATE users 
        SET points = points + ${action.points_earned}
        WHERE id = ${action.user_id}
      `
    }

    return NextResponse.json({ success: true, action })
  } catch (error) {
    console.error("Error updating action:", error)
    return NextResponse.json({ error: "Failed to update action" }, { status: 500 })
  }
}
