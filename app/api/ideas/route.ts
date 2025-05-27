import { type NextRequest, NextResponse } from "next/server"
import { DatabaseService } from "@/lib/services/database-service"
import { handleDatabaseError } from "@/lib/database"

// Get user's ideas
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("user_id")

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 })
    }

    const ideas = await DatabaseService.getIdeasByUserId(userId)

    // Get validation reports for completed ideas
    const ideasWithReports = await Promise.all(
      ideas.map(async (idea) => {
        if (idea.status === "completed") {
          const report = await DatabaseService.getValidationReportByIdeaId(idea.id)
          return { ...idea, validation_report: report }
        }
        return idea
      }),
    )

    return NextResponse.json({ ideas: ideasWithReports })
  } catch (error) {
    console.error("Get ideas error:", error)
    const dbError = handleDatabaseError(error)
    return NextResponse.json(dbError, { status: 500 })
  }
}

// Create or update idea (draft)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { user_id, ...ideaData } = body

    if (!user_id) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 })
    }

    let idea
    if (ideaData.id) {
      // Update existing idea
      idea = await DatabaseService.updateIdea(ideaData.id, {
        ...ideaData,
        is_draft: true,
      })
    } else {
      // Create new idea
      idea = await DatabaseService.createIdea({
        user_id,
        ...ideaData,
        status: "draft",
        is_draft: true,
      })
    }

    // Log activity
    await DatabaseService.logActivity({
      user_id,
      entity_type: "idea",
      entity_id: idea.id,
      action: ideaData.id ? "idea_updated" : "idea_created",
      details: { title: idea.title, is_draft: true },
    })

    return NextResponse.json({ idea })
  } catch (error) {
    console.error("Create/update idea error:", error)
    const dbError = handleDatabaseError(error)
    return NextResponse.json(dbError, { status: 500 })
  }
}

// Delete idea
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const ideaId = searchParams.get("idea_id")
    const userId = searchParams.get("user_id")

    if (!ideaId || !userId) {
      return NextResponse.json({ error: "Missing parameters" }, { status: 400 })
    }

    const idea = await DatabaseService.getIdeaById(ideaId)
    if (!idea || idea.user_id !== userId) {
      return NextResponse.json({ error: "Idea not found" }, { status: 404 })
    }

    await DatabaseService.deleteIdea(ideaId)

    // Log activity
    await DatabaseService.logActivity({
      user_id: userId,
      entity_type: "idea",
      entity_id: ideaId,
      action: "idea_deleted",
      details: { title: idea.title },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Delete idea error:", error)
    const dbError = handleDatabaseError(error)
    return NextResponse.json(dbError, { status: 500 })
  }
}
