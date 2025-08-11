import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'

// Check if challenges table exists
async function checkTableExists(): Promise<boolean> {
  try {
    await sql`SELECT 1 FROM challenges LIMIT 0`
    return true
  } catch (error) {
    console.log('challenges table does not exist')
    return false
  }
}

export async function POST(request: NextRequest) {
  try {
    const tableExists = await checkTableExists()
    
    if (!tableExists) {
      return NextResponse.json({ 
        error: 'Challenges feature is not available. Database needs to be updated.' 
      }, { status: 503 })
    }

    const { title, description, target_value, points_reward, duration, challenge_type, school_id, created_by } = await request.json()
    
    const startDate = new Date()
    const endDate = new Date()
    endDate.setDate(startDate.getDate() + parseInt(duration))
    
    const result = await sql`
      INSERT INTO challenges (title, description, target_value, points_reward, start_date, end_date, challenge_type, school_id, created_by)
      VALUES (${title}, ${description}, ${parseInt(target_value)}, ${parseInt(points_reward)}, ${startDate.toISOString()}, ${endDate.toISOString()}, ${challenge_type}, ${school_id}, ${created_by})
      RETURNING *
    `
    
    return NextResponse.json(result[0])
  } catch (error) {
    console.error('Error creating challenge:', error)
    return NextResponse.json({ error: 'Failed to create challenge' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const tableExists = await checkTableExists()
    
    if (!tableExists) {
      return NextResponse.json([])
    }

    const { searchParams } = new URL(request.url)
    const school_id = searchParams.get('school_id')
    
    if (school_id) {
      const challenges = await sql`
        SELECT * FROM challenges 
        WHERE school_id = ${school_id}
        ORDER BY created_at DESC
      `
      return NextResponse.json(challenges)
    } else {
      return NextResponse.json([])
    }
  } catch (error) {
    console.error('Error fetching challenges:', error)
    return NextResponse.json([])
  }
}
