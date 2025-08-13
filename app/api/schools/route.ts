import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const directorId = searchParams.get("director_id")

    if (!directorId) {
      return NextResponse.json({ error: "Director ID is required" }, { status: 400 })
    }

    const schools = await sql`
      SELECT 
        s.*,
        u.name as director_name,
        u.email as director_email
      FROM schools s
      LEFT JOIN users u ON s.director_id = u.id
      WHERE s.director_id = ${directorId}
      ORDER BY s.created_at DESC
    `

    return NextResponse.json(schools)
  } catch (error) {
    console.error("Error fetching schools:", error)
    return NextResponse.json({ error: "Failed to fetch schools" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, address, total_classes, director_id } = body

    if (!name || !director_id) {
      return NextResponse.json({ error: "Name and director_id are required" }, { status: 400 })
    }

    const result = await sql`
      INSERT INTO schools (name, address, total_classes, director_id)
      VALUES (${name}, ${address || ""}, ${total_classes || 0}, ${director_id})
      RETURNING *
    `

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Error creating school:", error)
    return NextResponse.json({ error: "Failed to create school" }, { status: 500 })
  }
}
