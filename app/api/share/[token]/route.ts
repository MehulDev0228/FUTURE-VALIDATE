import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: NextRequest, { params }: { params: { token: string } }) {
  try {
    const token = params.token

    // Get shared idea with validation report
    const result = await sql`
      SELECT 
        i.*,
        vr.viability_score,
        vr.tam_data,
        vr.sam_data,
        vr.som_data,
        vr.swot_analysis,
        vr.competitor_analysis,
        vr.market_trends,
        vr.usp,
        vr.business_model,
        vr.risks_recommendations,
        vr.business_plan,
        u.full_name as user_name
      FROM ideas i
      JOIN users u ON i.user_id = u.id
      LEFT JOIN validation_reports vr ON i.id = vr.idea_id
      WHERE i.share_token = ${token} AND i.status = 'completed'
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "Shared idea not found" }, { status: 404 })
    }

    const idea = result[0]

    // Parse JSON fields
    const processedIdea = {
      ...idea,
      tam_data: idea.tam_data ? JSON.parse(idea.tam_data) : null,
      sam_data: idea.sam_data ? JSON.parse(idea.sam_data) : null,
      som_data: idea.som_data ? JSON.parse(idea.som_data) : null,
      swot_analysis: idea.swot_analysis ? JSON.parse(idea.swot_analysis) : null,
      competitor_analysis: idea.competitor_analysis ? JSON.parse(idea.competitor_analysis) : null,
      market_trends: idea.market_trends ? JSON.parse(idea.market_trends) : null,
      risks_recommendations: idea.risks_recommendations ? JSON.parse(idea.risks_recommendations) : null,
    }

    return NextResponse.json({ idea: processedIdea })
  } catch (error) {
    console.error("Share API error:", error)
    return NextResponse.json({ error: "Failed to fetch shared idea" }, { status: 500 })
  }
}
