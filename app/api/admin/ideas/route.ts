import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import { getServerSession } from "next-auth"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check admin access
    const adminEmails = ["admin@futurevalidate.com", "manas.arora0209@gmail.com", "your-email@gmail.com"] // Add your email
    if (!adminEmails.includes(session.user.email)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Get all ideas with user info and validation scores
    const ideas = await sql`
      SELECT 
        i.id,
        i.title,
        i.description,
        i.industry,
        i.status,
        i.share_token,
        i.created_at,
        u.email as user_email,
        u.full_name as user_name,
        vr.viability_score
      FROM ideas i
      JOIN users u ON i.user_id = u.id
      LEFT JOIN validation_reports vr ON i.id = vr.idea_id
      ORDER BY i.created_at DESC
    `

    // Get stats
    const statsResult = await sql`
      SELECT 
        COUNT(DISTINCT i.id) as total_ideas,
        COUNT(DISTINCT u.id) as total_users,
        AVG(vr.viability_score) as avg_score,
        COUNT(CASE WHEN i.status = 'completed' THEN 1 END) as completed_validations
      FROM ideas i
      JOIN users u ON i.user_id = u.id
      LEFT JOIN validation_reports vr ON i.id = vr.idea_id
    `

    const stats = {
      totalIdeas: Number(statsResult[0].total_ideas),
      totalUsers: Number(statsResult[0].total_users),
      avgScore: Number(statsResult[0].avg_score) || 0,
      completedValidations: Number(statsResult[0].completed_validations),
    }

    return NextResponse.json({ ideas, stats })
  } catch (error) {
    console.error("Admin API error:", error)
    return NextResponse.json({ error: "Failed to fetch admin data" }, { status: 500 })
  }
}
