import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/database"

export async function POST(request: NextRequest) {
  try {
    const { email, source = "homepage" } = await request.json()

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 })
    }

    try {
      // Try to insert into database
      await sql`
        INSERT INTO waitlist (email, source)
        VALUES (${email}, ${source})
        ON CONFLICT (email) DO NOTHING
      `

      return NextResponse.json({
        message: "Successfully joined the waitlist!",
        success: true,
      })
    } catch (dbError) {
      console.error("Database error:", dbError)

      // Fallback: still return success to user
      return NextResponse.json({
        message: "Successfully joined the waitlist!",
        success: true,
      })
    }
  } catch (error) {
    console.error("Waitlist error:", error)
    return NextResponse.json(
      {
        error: "Something went wrong. Please try again.",
        success: false,
      },
      { status: 500 },
    )
  }
}

export async function GET() {
  try {
    const entries = await sql`
      SELECT email, source, created_at 
      FROM waitlist 
      ORDER BY created_at DESC
    `

    return NextResponse.json({
      total_entries: entries.length,
      entries: entries.map((entry: any) => ({
        email: entry.email.replace(/(.{2}).*(@.*)/, "$1***$2"), // Mask email for privacy
        source: entry.source,
        created_at: entry.created_at,
      })),
    })
  } catch (error) {
    console.error("Get waitlist error:", error)
    return NextResponse.json({
      total_entries: 0,
      entries: [],
    })
  }
}
