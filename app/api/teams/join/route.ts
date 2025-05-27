import { type NextRequest, NextResponse } from "next/server"
import { DatabaseService } from "@/lib/services/database-service"
import { handleDatabaseError } from "@/lib/database"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { user_id, team_code } = body

    if (!user_id || !team_code) {
      return NextResponse.json({ error: "User ID and team code required" }, { status: 400 })
    }

    // Find team by code
    const team = await DatabaseService.getTeamByCode(team_code.toUpperCase())
    if (!team) {
      return NextResponse.json({ error: "Invalid team code" }, { status: 404 })
    }

    // Add user to team
    const member = await DatabaseService.addTeamMember(team.id, user_id, "member")

    // Log activity
    await DatabaseService.logActivity({
      user_id,
      entity_type: "team",
      entity_id: team.id,
      action: "team_joined",
      details: { team_name: team.name, team_code: team.team_code },
    })

    return NextResponse.json({
      success: true,
      team,
      member,
    })
  } catch (error) {
    console.error("Join team error:", error)
    const dbError = handleDatabaseError(error)
    return NextResponse.json(dbError, { status: 500 })
  }
}
