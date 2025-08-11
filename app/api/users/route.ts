import { type NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { sql } from "@/lib/db"
import { cookies } from "next/headers"

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, role, school_id, class_id, grade, invite_code } = await request.json()

    console.log("Creating user with data:", { name, email, role, school_id, class_id, grade, invite_code })

    // Check if user already exists
    const existingUser = await sql`
      SELECT id, name, email, role FROM users WHERE email = ${email}
    `

    if (existingUser.length > 0) {
      const user = existingUser[0]
      return NextResponse.json(
        {
          error: `Пользователь с email ${email} уже зарегистрирован как ${user.role === "director" ? "директор" : user.role === "teacher" ? "учитель" : "ученик"}. Используйте другой email или войдите в существующий аккаунт.`,
          existingUser: {
            name: user.name,
            email: user.email,
            role: user.role,
          },
        },
        { status: 400 },
      )
    }

    // If invite_code is present, force role to be teacher
    let finalRole = role
    if (invite_code) {
      finalRole = "teacher"
      console.log("Invite code present, setting role to teacher")
    }

    // Validate role
    if (!["student", "teacher", "director", "admin"].includes(finalRole)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 })
    }

    // Hash password
    const password_hash = await bcrypt.hash(password, 10)

    // Check if class_id column exists by trying to describe the table
    let hasClassIdColumn = true
    try {
      await sql`
        SELECT class_id FROM users LIMIT 0
      `
    } catch (error) {
      console.log("class_id column does not exist, will create user without it")
      hasClassIdColumn = false
    }

    // If teacher is selecting a class, check if class already has a teacher
    if (finalRole === "teacher" && class_id && hasClassIdColumn) {
      const existingTeacher = await sql`
        SELECT teacher_id FROM classes WHERE id = ${class_id}
      `

      if (existingTeacher.length > 0 && existingTeacher[0].teacher_id) {
        return NextResponse.json(
          {
            error: "Этот класс уже имеет классного руководителя",
          },
          { status: 400 },
        )
      }
    }

    let result

    if (hasClassIdColumn) {
      // Create user with class_id column
      result = await sql`
        INSERT INTO users (name, email, password_hash, role, school_id, class_id, grade, points, level)
        VALUES (
          ${name}, 
          ${email}, 
          ${password_hash}, 
          ${finalRole}, 
          ${school_id || null}, 
          ${class_id || null}, 
          ${grade || null}, 
          0, 
          1
        )
        RETURNING id, name, email, role, school_id, class_id, grade, points, level, created_at
      `
    } else {
      // Create user without class_id column (fallback for old schema)
      result = await sql`
        INSERT INTO users (name, email, password_hash, role, school_id, grade, points, level)
        VALUES (
          ${name}, 
          ${email}, 
          ${password_hash}, 
          ${finalRole}, 
          ${school_id || null}, 
          ${grade || null}, 
          0, 
          1
        )
        RETURNING id, name, email, role, school_id, grade, points, level, created_at
      `
    }

    const user = result[0]
    console.log("User created:", user)

    // If teacher and we have class_id, assign them as homeroom teacher
    if (finalRole === "teacher" && class_id && hasClassIdColumn) {
      try {
        console.log("Assigning teacher to class:", { teacher_id: user.id, class_id })

        // Update the class to set this teacher as homeroom teacher
        await sql`
          UPDATE classes 
          SET teacher_id = ${user.id}
          WHERE id = ${class_id}
        `

        console.log("Teacher assigned as homeroom teacher successfully")
      } catch (error) {
        console.error("Error assigning teacher to class:", error)
        // Don't fail the user creation if this fails, but log the error
      }
    }

    // If student and we have class_id, update class student count
    if (finalRole === "student" && class_id && hasClassIdColumn) {
      try {
        await sql`
          UPDATE classes 
          SET student_count = student_count + 1 
          WHERE id = ${class_id}
        `
        console.log("Updated class student count")
      } catch (error) {
        console.error("Error updating class student count:", error)
        // Don't fail the user creation if this fails
      }
    }

    // Get school name if applicable
    let schoolName = null
    if (school_id) {
      try {
        const school = await sql`SELECT name FROM schools WHERE id = ${school_id}`
        schoolName = school[0]?.name
      } catch (error) {
        console.error("Error fetching school name:", error)
      }
    }

    // Get class name if applicable
    let className = null
    if (class_id && hasClassIdColumn) {
      try {
        const classData = await sql`SELECT name FROM classes WHERE id = ${class_id}`
        className = classData[0]?.name
      } catch (error) {
        console.error("Error fetching class name:", error)
      }
    }

    // Set session cookie
    cookies().set("user", JSON.stringify(user), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    })

    return NextResponse.json({
      ...user,
      class_id: hasClassIdColumn ? user.class_id : null,
      school_name: schoolName,
      class_name: className,
    })
  } catch (error) {
    console.error("Error creating user:", error)

    // Check if it's a column doesn't exist error
    if (error.message && error.message.includes("column") && error.message.includes("does not exist")) {
      return NextResponse.json(
        {
          error: "Database schema needs to be updated. Please run the migration scripts.",
        },
        { status: 500 },
      )
    }

    return NextResponse.json({ error: "Failed to create user" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const schoolId = searchParams.get("school_id")
    const role = searchParams.get("role")

    const whereConditions = []
    const params = []

    if (schoolId) {
      whereConditions.push(`school_id = $${params.length + 1}`)
      params.push(schoolId)
    }

    if (role) {
      whereConditions.push(`role = $${params.length + 1}`)
      params.push(role)
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(" AND ")}` : ""
    const query = `
      SELECT id, name, email, role, school_id, class_id, points, level, is_homeroom_teacher, created_at
      FROM users 
      ${whereClause}
      ORDER BY created_at DESC
    `

    const users = params.length > 0 ? await sql.unsafe(query, params) : await sql.unsafe(query)

    return NextResponse.json(users)
  } catch (error) {
    console.error("Error fetching users:", error)
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { user_id, is_homeroom_teacher } = await request.json()

    console.log("Updating user homeroom status:", { user_id, is_homeroom_teacher })

    if (!user_id) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    const result = await sql`
      UPDATE users 
      SET is_homeroom_teacher = ${is_homeroom_teacher}
      WHERE id = ${user_id} AND role = 'teacher'
      RETURNING id, name, email, role, is_homeroom_teacher
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "Teacher not found" }, { status: 404 })
    }

    console.log("User updated:", result[0])

    return NextResponse.json({
      success: true,
      user: result[0],
    })
  } catch (error) {
    console.error("Error updating user:", error)
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 })
  }
}
