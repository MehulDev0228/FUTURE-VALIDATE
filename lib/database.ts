import { neon } from "@neondatabase/serverless"

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is not set")
}

export const sql = neon(process.env.DATABASE_URL)

// Test database connection
export async function testConnection() {
  try {
    const result = await sql`SELECT NOW() as current_time`
    console.log("Database connected successfully:", result[0].current_time)
    return true
  } catch (error) {
    console.error("Database connection failed:", error)
    return false
  }
}

// Helper function to handle database errors
export function handleDatabaseError(error: any) {
  console.error("Database error:", error)

  if (error.code === "23505") {
    return { error: "Record already exists" }
  }

  if (error.code === "23503") {
    return { error: "Referenced record not found" }
  }

  return { error: "Database operation failed" }
}
