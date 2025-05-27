import { type NextRequest, NextResponse } from "next/server"
import { analyzeResearchWithDelphi } from "@/lib/gemini-ai"
import { DatabaseService } from "@/lib/services/database-service"
import { handleDatabaseError } from "@/lib/database"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { user_id, title, document_type, source_firm, document_content, document_url } = body

    if (!user_id || !title || !document_content) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Create analysis record
    const analysis = await DatabaseService.createDelphiAnalysis({
      user_id,
      title,
      document_type: document_type || "research_paper",
      source_firm,
      document_url,
      document_content,
      processing_status: "processing",
    })

    // Log activity
    await DatabaseService.logActivity({
      user_id,
      entity_type: "delphi",
      entity_id: analysis.id,
      action: "analysis_started",
      details: { title, document_type, source_firm },
    })

    // Start analysis in background
    try {
      const startTime = Date.now()

      const results = await analyzeResearchWithDelphi(document_content, document_type || "research_paper", source_firm)

      const processingTime = Date.now() - startTime

      // Update analysis with results
      const updatedAnalysis = await DatabaseService.updateDelphiAnalysis(analysis.id, {
        summary: results.executive_summary,
        emerging_trends: results.emerging_trends,
        startup_ideas: results.startup_ideas,
        market_calculations: results.market_calculations,
        swot_analysis: results.swot_analysis,
        market_risks: results.market_risks,
        startup_potential_score: results.startup_potential_score,
        strategic_recommendations: results.strategic_recommendations,
        processing_status: "completed",
      })

      // Log completion
      await DatabaseService.logActivity({
        user_id,
        entity_type: "delphi",
        entity_id: analysis.id,
        action: "analysis_completed",
        details: {
          title,
          startup_potential_score: results.startup_potential_score,
          processing_time: processingTime,
        },
      })

      return NextResponse.json({
        success: true,
        analysis: updatedAnalysis,
        results,
      })
    } catch (analysisError) {
      console.error("Delphi analysis error:", analysisError)

      // Update status to failed
      await DatabaseService.updateDelphiAnalysis(analysis.id, {
        processing_status: "failed",
      })

      return NextResponse.json(
        {
          error: "Analysis failed. Please try again.",
          analysis_id: analysis.id,
        },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("Delphi API error:", error)
    const dbError = handleDatabaseError(error)
    return NextResponse.json(dbError, { status: 500 })
  }
}

// Get user's Delphi analyses
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("user_id")

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 })
    }

    const analyses = await DatabaseService.getDelphiAnalysesByUserId(userId)

    return NextResponse.json({ analyses })
  } catch (error) {
    console.error("Get Delphi analyses error:", error)
    const dbError = handleDatabaseError(error)
    return NextResponse.json(dbError, { status: 500 })
  }
}
