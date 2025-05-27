export function checkEnvironmentVariables() {
  const required = ["GOOGLE_CLIENT_ID", "GOOGLE_CLIENT_SECRET", "NEXTAUTH_SECRET", "GEMINI_API_KEY", "DATABASE_URL"]

  const missing = required.filter((key) => !process.env[key])

  if (missing.length > 0) {
    console.warn("Missing environment variables:", missing)
    return false
  }

  return true
}
