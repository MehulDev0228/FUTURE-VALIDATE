import { type NextRequest, NextResponse } from "next/server"
import { DatabaseService } from "@/lib/services/database-service"
import { handleDatabaseError } from "@/lib/database"
import { neon } from "@neondatabase/serverless"
import { getServerSession } from "next-auth"

const sql = neon(process.env.DATABASE_URL!)

// Get user's teams
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("user_id")

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 })
    }

    const teams = await DatabaseService.getTeamsByUserId(userId)

    // Get team members for each team
    const teamsWithMembers = await Promise.all(
      teams.map(async (team) => {
        const members = await DatabaseService.getTeamMembers(team.id)
        return { ...team, members }
      }),
    )

    return NextResponse.json({ teams: teamsWithMembers })
  } catch (error) {
    console.error("Get teams error:", error)
    const dbError = handleDatabaseError(error)
    return NextResponse.json(dbError, { status: 500 })
  }
}

// Create team
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { action, team_code } = await request.json()

    // Get user
    const users = await sql`SELECT * FROM users WHERE email = ${session.user.email}`
    if (users.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }
    const user = users[0]

    if (action === "create") {
      // Generate unique team code
      const newTeamCode = `TEAM-${Math.random().toString(36).substring(2, 8).toUpperCase()}`

      // Create team
      const teamResult = await sql`
        INSERT INTO teams (name, team_code, owner_id, description)
        VALUES (${`${user.full_name || user.email.split("@")[0]}'s Team`}, ${newTeamCode}, ${user.id}, 'Collaborative startup validation team')
        RETURNING *
      `

      const team = teamResult[0]

      // Add owner as team member
      await sql`
        INSERT INTO team_members (team_id, user_id, role)
        VALUES (${team.id}, ${user.id}, 'owner')
      `

      // Update user's team code
      await sql`UPDATE users SET team_code = ${newTeamCode} WHERE id = ${user.id}`

      return NextResponse.json({ team, team_code: newTeamCode })
    }

    if (action === "join") {
      // Find team by code
      const teams = await sql`SELECT * FROM teams WHERE team_code = ${team_code}`
      if (teams.length === 0) {
        return NextResponse.json({ error: "Invalid team code" }, { status: 404 })
      }

      const team = teams[0]

      // Add user to team
      await sql`
        INSERT INTO team_members (team_id, user_id, role)
        VALUES (${team.id}, ${user.id}, 'member')
        ON CONFLICT (team_id, user_id) DO NOTHING
      `

      return NextResponse.json({ success: true, team })
    }

    if (action === "get_members") {
      // Get team members
      const members = await sql`
        SELECT tm.*, u.email, u.full_name, u.avatar_url
        FROM team_members tm
        JOIN users u ON tm.user_id = u.id
        JOIN teams t ON tm.team_id = t.id
        WHERE t.team_code = ${user.team_code || team_code}
        ORDER BY tm.joined_at ASC
      `

      return NextResponse.json({ members })
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  } catch (error) {
    console.error("Teams API error:", error)
    return NextResponse.json({ error: "Failed to process team request" }, { status: 500 })
  }
}
