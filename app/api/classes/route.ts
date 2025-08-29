import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const schoolId = searchParams.get("school_id")

    if (!schoolId) {
      return NextResponse.json({ error: "School ID is required" }, { status: 400 })
    }

    // Получаем классы с информацией об учителях и количестве учеников
    const classes = await sql`
      SELECT 
        c.id,
        c.name,
        c.grade,
        c.capacity,
        c.created_at,
        u.name as teacher_name,
        u.email as teacher_email,
        COUNT(s.id) as student_count
      FROM classes c
      LEFT JOIN users u ON c.teacher_id = u.id AND u.role = 'teacher'
      LEFT JOIN users s ON c.id = s.class_id AND s.role = 'student'
      WHERE c.school_id = ${schoolId}
      GROUP BY c.id, c.name, c.grade, c.capacity, c.created_at, u.name, u.email
      ORDER BY c.grade, c.name
    `

    // Преобразуем результат для фронтенда
    const formattedClasses = classes.map((cls) => ({
      id: cls.id,
      name: cls.name,
      grade: cls.grade,
      capacity: cls.capacity,
      created_at: cls.created_at,
      teacher: cls.teacher_name
        ? {
            name: cls.teacher_name,
            email: cls.teacher_email,
          }
        : null,
      student_count: Number(cls.student_count) || 0,
    }))

    return NextResponse.json(formattedClasses)
  } catch (error) {
    console.error("Error fetching classes:", error)
    return NextResponse.json({ error: "Failed to fetch classes" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, grade, capacity, school_id } = await request.json()

    if (!name || !grade || !school_id) {
      return NextResponse.json({ error: "Name, grade, and school_id are required" }, { status: 400 })
    }

    // Проверяем, существует ли уже класс с таким названием в школе
    const existingClass = await sql`
      SELECT id FROM classes 
      WHERE name = ${name} AND school_id = ${school_id}
    `

    if (existingClass.length > 0) {
      return NextResponse.json({ error: "Class with this name already exists in the school" }, { status: 400 })
    }

    const result = await sql`
      INSERT INTO classes (name, grade, capacity, school_id)
      VALUES (${name}, ${grade}, ${capacity || 30}, ${school_id})
      RETURNING *
    `

    return NextResponse.json(result[0], { status: 201 })
  } catch (error) {
    console.error("Error creating class:", error)
    return NextResponse.json({ error: "Failed to create class" }, { status: 500 })
  }
}
