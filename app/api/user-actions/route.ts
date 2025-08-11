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

    // Get user actions
    const actions = await sql`
      SELECT 
        ua.*,
        ea.name as action_name,
        ea.description as action_description,
        ea.category,
        ea.points as action_points
      FROM user_actions ua
      JOIN eco_actions ea ON ua.action_id = ea.id
      WHERE ua.user_id = ${decoded.userId}
      ORDER BY ua.created_at DESC
    `

    return NextResponse.json({ actions })
  } catch (error) {
    console.error("Get user actions error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader) {
      return NextResponse.json({ error: "No authorization header" }, { status: 401 })
    }

    const token = authHeader.replace("Bearer ", "")
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any

    const { actionId, description, photoUrl } = await request.json()

    if (!actionId) {
      return NextResponse.json({ error: "Action ID is required" }, { status: 400 })
    }

    // Create new user action
    const newUserAction = await sql`
      INSERT INTO user_actions (user_id, action_id, description, photo_url)
      VALUES (${decoded.userId}, ${actionId}, ${description || null}, ${photoUrl || null})
      RETURNING *
    `

    return NextResponse.json({ action: newUserAction[0] })
  } catch (error) {
    console.error("Create user action error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
