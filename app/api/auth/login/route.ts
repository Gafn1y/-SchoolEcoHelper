import { type NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { sql } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const { email, password, role } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    // Get user from database
    const users = await sql`
      SELECT u.*, s.name as school_name, c.name as class_name 
      FROM users u
      LEFT JOIN schools s ON u.school_id = s.id
      LEFT JOIN classes c ON u.class_id = c.id
      WHERE u.email = ${email}
    `

    if (users.length === 0) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    const user = users[0]

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password)
    if (!isValidPassword) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // Check role if provided
    if (role && user.role !== role) {
      return NextResponse.json({ error: "Invalid role for this user" }, { status: 403 })
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
        schoolId: user.school_id,
        classId: user.class_id,
      },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" },
    )

    // Return user data (excluding password)
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json({
      user: userWithoutPassword,
      token,
    })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
