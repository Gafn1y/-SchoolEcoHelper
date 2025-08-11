import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const {
      title,
      description,
      target_value,
      points_reward,
      start_date,
      end_date,
      challenge_type,
      school_id,
      created_by,
    } = await request.json()

    const result = await sql`
      INSERT INTO challenges (title, description, target_value, points_reward, start_date, end_date, challenge_type, school_id, created_by)
      VALUES (${title}, ${description}, ${target_value}, ${points_reward}, ${start_date}, ${end_date}, ${challenge_type}, ${school_id}, ${created_by})
      RETURNING *
    `

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Error creating challenge:", error)
    return NextResponse.json({ error: "Failed to create challenge" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const school_id = searchParams.get("school_id")

    if (!school_id) {
      return NextResponse.json({ error: "School ID required" }, { status: 400 })
    }

    const challenges = await sql`
      SELECT c.*, u.name as creator_name
      FROM challenges c
      LEFT JOIN users u ON c.created_by = u.id
      WHERE c.school_id = ${school_id}
      ORDER BY c.created_at DESC
    `

    return NextResponse.json(challenges)
  } catch (error) {
    console.error("Error fetching challenges:", error)
    return NextResponse.json({ error: "Failed to fetch challenges" }, { status: 500 })
  }
}
