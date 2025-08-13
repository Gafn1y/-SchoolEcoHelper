import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const user_id = searchParams.get("user_id")

    if (user_id) {
      // Get user's badges
      const userBadges = await sql`
        SELECT b.*, ub.earned_at
        FROM badges b
        JOIN user_badges ub ON b.id = ub.badge_id
        WHERE ub.user_id = ${user_id}
        ORDER BY ub.earned_at DESC
      `
      return NextResponse.json(userBadges)
    } else {
      // Get all available badges
      const badges = await sql`
        SELECT * FROM badges ORDER BY points_required ASC
      `
      return NextResponse.json(badges)
    }
  } catch (error) {
    console.error("Error fetching badges:", error)
    // Return sample badges as fallback
    return NextResponse.json([
      {
        id: 1,
        name: "Эко-новичок",
        description: "Выполнил первое эко-действие",
        icon: "🌱",
        points_required: 10,
      },
      {
        id: 2,
        name: "Сортировщик",
        description: "Правильно отсортировал 10 предметов",
        icon: "♻️",
        points_required: 50,
      },
      {
        id: 3,
        name: "Эко-воин",
        description: "Набрал 100 очков",
        icon: "🏆",
        points_required: 100,
      },
    ])
  }
}
