import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function POST(request: NextRequest) {
  try {
    const { email, name, image, provider } = await request.json()

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    // Check if user exists
    const existingUsers = await sql`
      SELECT * FROM users WHERE email = ${email}
    `

    if (existingUsers.length > 0) {
      // Update existing user
      const updatedUser = await sql`
        UPDATE users 
        SET 
          full_name = ${name || existingUsers[0].full_name},
          avatar_url = ${image || existingUsers[0].avatar_url},
          last_login = NOW()
        WHERE email = ${email}
        RETURNING *
      `
      return NextResponse.json({ user: updatedUser[0] })
    } else {
      // Create new user
      const newUser = await sql`
        INSERT INTO users (
          email, 
          full_name, 
          avatar_url, 
          subscription_tier, 
          ideas_validated, 
          max_ideas_allowed,
          created_at,
          last_login
        ) VALUES (
          ${email}, 
          ${name || email.split("@")[0]}, 
          ${image || ""}, 
          'free', 
          0, 
          10,
          NOW(),
          NOW()
        )
        RETURNING *
      `
      return NextResponse.json({ user: newUser[0] })
    }
  } catch (error) {
    console.error("User API error:", error)
    return NextResponse.json({ error: "Failed to create/update user" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get("email")

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    const users = await sql`
      SELECT * FROM users WHERE email = ${email}
    `

    if (users.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({ user: users[0] })
  } catch (error) {
    console.error("Get user error:", error)
    return NextResponse.json({ error: "Failed to get user" }, { status: 500 })
  }
}
