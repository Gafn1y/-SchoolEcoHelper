import { type NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { sql } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, role, school_id, class_id, grade } = await request.json()

    // Check if user already exists
    const existingUsers = await sql`
      SELECT id FROM users WHERE email = ${email}
    `

    if (existingUsers.length > 0) {
      return NextResponse.json({ error: "User with this email already exists" }, { status: 400 })
    }

    // Hash password
    const password_hash = await bcrypt.hash(password, 12)

    // Create user
    const users = await sql`
      INSERT INTO users (name, email, password_hash, role, school_id, class_id, grade, points, level)
      VALUES (${name}, ${email}, ${password_hash}, ${role}, ${school_id || null}, ${class_id || null}, ${grade || null}, 0, 1)
      RETURNING id, name, email, role, school_id, class_id, grade, points, level, created_at
    `

    const user = users[0]

    // If user is a student and assigned to a class, update class student count
    if (role === "student" && class_id) {
      await sql`
        UPDATE classes 
        SET student_count = student_count + 1 
        WHERE id = ${class_id}
      `
    }

    // If user is a teacher and assigned to a class, update class teacher
    if (role === "teacher" && class_id) {
      await sql`
        UPDATE classes 
        SET teacher_id = ${user.id}
        WHERE id = ${class_id}
      `
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error("Error creating user:", error)
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const school_id = searchParams.get("school_id")
    const role = searchParams.get("role")

    let query = `
      SELECT u.*, s.name as school_name, c.name as class_name
      FROM users u 
      LEFT JOIN schools s ON u.school_id = s.id 
      LEFT JOIN classes c ON u.class_id = c.id
      WHERE 1=1
    `
    const params: any[] = []

    if (school_id) {
      query += ` AND u.school_id = $${params.length + 1}`
      params.push(school_id)
    }

    if (role) {
      query += ` AND u.role = $${params.length + 1}`
      params.push(role)
    }

    query += ` ORDER BY u.created_at DESC`

    const users = await sql(query, ...params)
    return NextResponse.json(users)
  } catch (error) {
    console.error("Error fetching users:", error)
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 })
  }
}
