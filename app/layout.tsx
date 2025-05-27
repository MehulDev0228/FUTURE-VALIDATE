import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Providers } from "@/components/providers"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "FutureValidate - AI-Powered Startup Idea Validator",
  description:
    "Validate your startup ideas with AI-powered analysis, market research, and expert insights. Get comprehensive validation reports in minutes.",
  keywords: "startup validation, AI analysis, market research, business ideas, entrepreneur tools",
  authors: [{ name: "FutureValidate Team" }],
  openGraph: {
    title: "FutureValidate - AI-Powered Startup Idea Validator",
    description: "Validate your startup ideas with AI-powered analysis, market research, and expert insights.",
    type: "website",
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  )
}
