import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const { name, address, total_classes, director_id, phone, website, description } = await request.json()

    const result = await sql`
      INSERT INTO schools (name, address, total_classes, director_id, phone, website, description)
      VALUES (${name}, ${address || null}, ${total_classes}, ${director_id}, ${phone || null}, ${website || null}, ${description || null})
      RETURNING *
    `

    // Update director's school_id
    await sql`
      UPDATE users 
      SET school_id = ${result[0].id}
      WHERE id = ${director_id}
    `

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Error creating school:", error)
    return NextResponse.json({ error: "Failed to create school" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const directorId = searchParams.get("director_id")

    let query
    if (directorId) {
      query = sql`
        SELECT s.*, u.name as director_name, u.email as director_email
        FROM schools s
        LEFT JOIN users u ON s.director_id = u.id
        WHERE s.director_id = ${directorId}
        ORDER BY s.created_at DESC
      `
    } else {
      query = sql`
        SELECT s.*, u.name as director_name, u.email as director_email
        FROM schools s
        LEFT JOIN users u ON s.director_id = u.id
        ORDER BY s.name
      `
    }

    const schools = await query
    return NextResponse.json(schools)
  } catch (error) {
    console.error("Error fetching schools:", error)
    return NextResponse.json({ error: "Failed to fetch schools" }, { status: 500 })
  }
}
