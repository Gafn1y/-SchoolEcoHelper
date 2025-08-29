import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (id) {
      const schools = await sql`
        SELECT s.*, u.name as director_name 
        FROM schools s
        LEFT JOIN users u ON s.director_id = u.id
        WHERE s.id = ${id}
      `
      return NextResponse.json(schools)
    }

    const schools = await sql`
      SELECT s.*, u.name as director_name 
      FROM schools s
      LEFT JOIN users u ON s.director_id = u.id
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
    const { name, address, total_classes, director_id } = await request.json()

    console.log("Creating school with data:", { name, address, total_classes, director_id })

    // Validate required fields
    if (!name || !director_id) {
      return NextResponse.json({ error: "Name and director_id are required" }, { status: 400 })
    }

    // Check if director exists and is actually a director
    const director = await sql`
      SELECT id, role FROM users WHERE id = ${director_id} AND role = 'director'
    `

    if (director.length === 0) {
      return NextResponse.json({ error: "Director not found or invalid role" }, { status: 400 })
    }

    // Create the school
    const school = await sql`
      INSERT INTO schools (name, address, total_classes, director_id)
      VALUES (${name}, ${address || null}, ${total_classes || 0}, ${director_id})
      RETURNING *
    `

    console.log("School created:", school[0])

    // Update director's school_id
    const updatedDirector = await sql`
      UPDATE users 
      SET school_id = ${school[0].id}
      WHERE id = ${director_id}
      RETURNING *
    `

    console.log("Director updated with school_id:", updatedDirector[0])

    return NextResponse.json({
      school: school[0],
      director: updatedDirector[0],
    })
  } catch (error) {
    console.error("Error creating school:", error)
    return NextResponse.json({ error: "Failed to create school" }, { status: 500 })
  }
}
