import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function POST(request: NextRequest) {
  try {
    const { email, action } = await request.json()

    if (action === "signin") {
      // Create a simple session
      const user = {
        id: `user_${Date.now()}`,
        email,
        name: email.split("@")[0],
        subscription_tier: "free",
        ideas_validated: 0,
        max_ideas_allowed: 10,
      }

      // Set cookie
      cookies().set("futurevalidate_session", JSON.stringify(user), {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: "/",
      })

      return NextResponse.json({ success: true, user })
    }

    if (action === "signout") {
      cookies().delete("futurevalidate_session")
      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  } catch (error) {
    console.error("Auth error:", error)
    return NextResponse.json({ error: "Authentication failed" }, { status: 500 })
  }
}

export async function GET() {
  try {
    const sessionCookie = cookies().get("futurevalidate_session")

    if (sessionCookie) {
      const user = JSON.parse(sessionCookie.value)
      return NextResponse.json({ user })
    }

    return NextResponse.json({ user: null })
  } catch (error) {
    return NextResponse.json({ user: null })
  }
}
