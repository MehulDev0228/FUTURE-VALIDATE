"use client"

import type React from "react"
import { createContext, useContext } from "react"
import { useSession, signIn, signOut } from "next-auth/react"

interface User {
  id: string
  email: string
  name?: string
  image?: string
  full_name?: string
  avatar_url?: string
  subscription_tier: string
  ideas_validated: number
  max_ideas_allowed: number
  user_metadata?: {
    full_name?: string
  }
}

interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error?: string }>
  signUp: (email: string, password: string, fullName: string) => Promise<{ error?: string }>
  signOut: () => Promise<void>
  signInWithGoogle: () => Promise<{ error?: string }>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()

  const user: User | null = session?.user
    ? {
        id: session.user.id || "",
        email: session.user.email || "",
        name: session.user.name || "",
        image: session.user.image || "",
        full_name: session.user.name || "",
        subscription_tier: (session.user as any).subscription_tier || "free",
        ideas_validated: (session.user as any).ideas_validated || 0,
        max_ideas_allowed: (session.user as any).max_ideas_allowed || 10,
        user_metadata: {
          full_name: session.user.name || "",
        },
      }
    : null

  const handleSignIn = async (email: string, password: string) => {
    // For demo, redirect to Google OAuth
    return await handleSignInWithGoogle()
  }

  const handleSignUp = async (email: string, password: string, fullName: string) => {
    // For demo, redirect to Google OAuth
    return await handleSignInWithGoogle()
  }

  const handleSignOut = async () => {
    await signOut({ redirect: false })
  }

  const handleSignInWithGoogle = async () => {
    try {
      const result = await signIn("google", { redirect: false })
      if (result?.error) {
        return { error: result.error }
      }
      return { error: undefined }
    } catch (error) {
      console.error("Google sign in error:", error)
      return { error: "Google sign in failed" }
    }
  }

  const refreshUser = async () => {
    // Session will auto-refresh
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading: status === "loading",
        signIn: handleSignIn,
        signUp: handleSignUp,
        signOut: handleSignOut,
        signInWithGoogle: handleSignInWithGoogle,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
