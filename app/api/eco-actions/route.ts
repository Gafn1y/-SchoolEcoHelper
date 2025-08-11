import { NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET() {
  try {
    const actions = await sql`
      SELECT * FROM eco_actions ORDER BY category, name
    `
    return NextResponse.json(actions)
  } catch (error) {
    console.error("Error fetching eco actions:", error)
    return NextResponse.json({ error: "Failed to fetch eco actions" }, { status: 500 })
  }
}
