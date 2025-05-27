import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "select_account", // Force account selection
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      try {
        if (account?.provider === "google") {
          // Create or update user in database
          await sql`
            INSERT INTO users (email, full_name, avatar_url, provider, provider_id, subscription_tier, ideas_validated, max_ideas_allowed)
            VALUES (${user.email}, ${user.name}, ${user.image}, 'google', ${account.providerAccountId}, 'free', 0, 10)
            ON CONFLICT (email) 
            DO UPDATE SET 
              full_name = EXCLUDED.full_name,
              avatar_url = EXCLUDED.avatar_url,
              last_login = NOW()
          `
        }
        return true
      } catch (error) {
        console.error("SignIn error:", error)
        return true // Allow sign in even if DB fails
      }
    },
    async session({ session, token }) {
      if (session.user?.email) {
        try {
          const users = await sql`
            SELECT * FROM users WHERE email = ${session.user.email}
          `
          if (users.length > 0) {
            session.user.id = users[0].id
            session.user.subscription_tier = users[0].subscription_tier
            session.user.ideas_validated = users[0].ideas_validated
            session.user.max_ideas_allowed = users[0].max_ideas_allowed
          }
        } catch (error) {
          console.error("Session error:", error)
        }
      }
      return session
    },
  },
  pages: {
    signIn: "/auth",
    error: "/auth",
  },
  secret: process.env.NEXTAUTH_SECRET,
})

export { handler as GET, handler as POST }
