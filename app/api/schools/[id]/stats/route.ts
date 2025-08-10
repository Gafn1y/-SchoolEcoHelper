import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const schoolId = parseInt(params.id)
    
    // Get students count
    const studentsCount = await sql`
      SELECT COUNT(*) as count FROM users 
      WHERE school_id = ${schoolId} AND role = 'student'
    `
    
    // Get teachers count
    const teachersCount = await sql`
      SELECT COUNT(*) as count FROM users 
      WHERE school_id = ${schoolId} AND role = 'teacher'
    `
    
    // Get classes count
    const classesCount = await sql`
      SELECT COUNT(*) as count FROM classes 
      WHERE school_id = ${schoolId}
    `
    
    // Get total points
    const totalPoints = await sql`
      SELECT COALESCE(SUM(points), 0) as total FROM users 
      WHERE school_id = ${schoolId} AND role = 'student'
    `
    
    return NextResponse.json({
      totalStudents: parseInt(studentsCount[0].count),
      totalTeachers: parseInt(teachersCount[0].count),
      totalClasses: parseInt(classesCount[0].count),
      totalPoints: parseInt(totalPoints[0].total)
    })
  } catch (error) {
    console.error('Error fetching school stats:', error)
    return NextResponse.json({ error: 'Failed to fetch school stats' }, { status: 500 })
  }
}
