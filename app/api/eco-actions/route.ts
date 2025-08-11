import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET() {
  try {
    const actions = await sql`
      SELECT * FROM eco_actions 
      ORDER BY category, name
    `

    return NextResponse.json({ actions })
  } catch (error) {
    console.error("Get eco actions error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, description, points, category } = await request.json()

    if (!name || !description || !points || !category) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    const newAction = await sql`
      INSERT INTO eco_actions (name, description, points, category)
      VALUES (${name}, ${description}, ${points}, ${category})
      RETURNING *
    `

    return NextResponse.json({ action: newAction[0] })
  } catch (error) {
    console.error("Create eco action error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
