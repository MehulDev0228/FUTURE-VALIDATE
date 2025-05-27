import { NextResponse } from "next/server"
import { initializeDatabase } from "@/lib/init-db"

export async function POST() {
  try {
    const success = await initializeDatabase()

    if (success) {
      return NextResponse.json({ message: "Database initialized successfully" })
    } else {
      return NextResponse.json({ error: "Database initialization failed" }, { status: 500 })
    }
  } catch (error) {
    console.error("Init API error:", error)
    return NextResponse.json({ error: "Failed to initialize database" }, { status: 500 })
  }
}
