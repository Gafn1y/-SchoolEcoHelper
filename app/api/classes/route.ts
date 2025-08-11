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

    // Get classes for the user's school
    const classes = await sql`
      SELECT c.*, u.name as teacher_name
      FROM classes c
      LEFT JOIN users u ON c.teacher_id = u.id
      WHERE c.school_id = ${decoded.schoolId}
      ORDER BY c.name
    `

    return NextResponse.json({ classes })
  } catch (error) {
    console.error("Get classes error:", error)
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

    // Only directors can create classes
    if (decoded.role !== "director") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const { name, teacherId } = await request.json()

    if (!name) {
      return NextResponse.json({ error: "Class name is required" }, { status: 400 })
    }

    // Create new class
    const newClass = await sql`
      INSERT INTO classes (name, school_id, teacher_id)
      VALUES (${name}, ${decoded.schoolId}, ${teacherId || null})
      RETURNING *
    `

    return NextResponse.json({ class: newClass[0] })
  } catch (error) {
    console.error("Create class error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
