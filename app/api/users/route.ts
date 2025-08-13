import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"
import bcrypt from "bcryptjs"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const role = searchParams.get("role")
    const id = searchParams.get("id")
    const teacher_id = searchParams.get("teacher_id")

    if (id) {
      // Get specific user by ID
      const result = await sql`
        SELECT 
          u.id, u.name, u.email, u.role, u.points, u.level, u.class_id, u.school_id,
          c.name as class_name,
          s.name as school_name
        FROM users u
        LEFT JOIN classes c ON u.class_id = c.id
        LEFT JOIN schools s ON u.school_id = s.id
        WHERE u.id = ${id}
      `

      if (result.length === 0) {
        return NextResponse.json({ error: "User not found" }, { status: 404 })
      }

      return NextResponse.json(result[0])
    }

    if (teacher_id) {
      // Get students for a specific teacher
      const teacherResult = await sql`
        SELECT class_id FROM users WHERE id = ${teacher_id} AND role = 'teacher'
      `

      if (teacherResult.length === 0) {
        return NextResponse.json([])
      }

      const class_id = teacherResult[0].class_id
      if (!class_id) {
        return NextResponse.json([])
      }

      const result = await sql`
        SELECT 
          u.id, u.name, u.email, u.role, u.points, u.level, u.class_id,
          c.name as class_name
        FROM users u
        LEFT JOIN classes c ON u.class_id = c.id
        WHERE u.class_id = ${class_id} AND u.role = 'student'
        ORDER BY u.name
      `

      return NextResponse.json(result)
    }

    if (role) {
      // Get users by role
      const result = await sql`
        SELECT 
          u.id, u.name, u.email, u.role, u.points, u.level, u.class_id, u.school_id,
          c.name as class_name,
          s.name as school_name
        FROM users u
        LEFT JOIN classes c ON u.class_id = c.id
        LEFT JOIN schools s ON u.school_id = s.id
        WHERE u.role = ${role}
        ORDER BY u.name
      `

      return NextResponse.json(result)
    }

    // Get all users
    const result = await sql`
      SELECT 
        u.id, u.name, u.email, u.role, u.points, u.level, u.class_id, u.school_id,
        c.name as class_name,
        s.name as school_name
      FROM users u
      LEFT JOIN classes c ON u.class_id = c.id
      LEFT JOIN schools s ON u.school_id = s.id
      ORDER BY u.name
    `

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error fetching users:", error)
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, password, role, class_id, school_id } = body

    // Validate required fields
    if (!name || !email || !password || !role) {
      return NextResponse.json({ error: "Name, email, password, and role are required" }, { status: 400 })
    }

    // Check if user already exists
    const existingUser = await sql`
      SELECT id FROM users WHERE email = ${email}
    `

    if (existingUser.length > 0) {
      return NextResponse.json({ error: "User with this email already exists" }, { status: 409 })
    }

    // Hash the password
    const password_hash = await bcrypt.hash(password, 10)

    // Create the user
    const result = await sql`
      INSERT INTO users (name, email, password_hash, role, class_id, school_id, points, level)
      VALUES (${name}, ${email}, ${password_hash}, ${role}, ${class_id || null}, ${school_id || null}, 0, 1)
      RETURNING id, name, email, role, class_id, school_id, points, level
    `

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Error creating user:", error)
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, name, email, role, class_id, school_id, points, level } = body

    if (!id) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    // Build update query dynamically based on provided fields
    const updates = []
    const values = []

    if (name !== undefined) {
      updates.push(`name = $${updates.length + 1}`)
      values.push(name)
    }
    if (email !== undefined) {
      updates.push(`email = $${updates.length + 1}`)
      values.push(email)
    }
    if (role !== undefined) {
      updates.push(`role = $${updates.length + 1}`)
      values.push(role)
    }
    if (class_id !== undefined) {
      updates.push(`class_id = $${updates.length + 1}`)
      values.push(class_id)
    }
    if (school_id !== undefined) {
      updates.push(`school_id = $${updates.length + 1}`)
      values.push(school_id)
    }
    if (points !== undefined) {
      updates.push(`points = $${updates.length + 1}`)
      values.push(points)
    }
    if (level !== undefined) {
      updates.push(`level = $${updates.length + 1}`)
      values.push(level)
    }

    if (updates.length === 0) {
      return NextResponse.json({ error: "No fields to update" }, { status: 400 })
    }

    // Use tagged template for the update
    const result = await sql`
      UPDATE users 
      SET ${sql(updates.join(", "))}
      WHERE id = ${id}
      RETURNING id, name, email, role, class_id, school_id, points, level
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Error updating user:", error)
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 })
  }
}
