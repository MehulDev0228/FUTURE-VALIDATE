"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, DollarSign, Users, Target, Download, CheckCircle, Lightbulb, BarChart3 } from "lucide-react"

interface SharedIdea {
  id: string
  title: string
  description: string
  industry: string
  viability_score: number
  tam_data: any
  sam_data: any
  som_data: any
  swot_analysis: any
  competitor_analysis: any
  market_trends: any
  usp: string
  business_model: string
  risks_recommendations: any
  business_plan: string
  user_name: string
  created_at: string
}

export default function SharedIdeaPage() {
  const params = useParams()
  const [idea, setIdea] = useState<SharedIdea | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    if (params.token) {
      fetchSharedIdea(params.token as string)
    }
  }, [params.token])

  const fetchSharedIdea = async (token: string) => {
    try {
      const response = await fetch(`/api/share/${token}`)
      if (response.ok) {
        const data = await response.json()
        setIdea(data.idea)
      } else {
        setError("Shared idea not found or no longer available")
      }
    } catch (error) {
      setError("Failed to load shared idea")
    } finally {
      setLoading(false)
    }
  }

  const downloadPDF = async () => {
    if (!idea) return

    try {
      const response = await fetch("/api/export/pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idea_id: idea.id }),
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `${idea.title}-validation-report.pdf`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      }
    } catch (error) {
      console.error("Download failed:", error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (error || !idea) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Idea Not Found</h1>
          <p className="text-gray-400">{error}</p>
        </div>
      </div>
    )
  }

  const getScoreColor = (score: number) => {
    if (score >= 8) return "from-green-500 to-green-400"
    if (score >= 6) return "from-yellow-500 to-yellow-400"
    return "from-red-500 to-red-400"
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-white mb-2">Shared Validation Report</h1>
          <p className="text-gray-400">Powered by FutureValidate AI</p>
        </div>

        {/* Viability Score */}
        <div className="mb-8">
          <Card className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border-white/20">
            <CardContent className="p-8 text-center">
              <div className="flex items-center justify-center mb-6">
                <div className="relative w-32 h-32">
                  <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
                    <circle
                      cx="60"
                      cy="60"
                      r="50"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="none"
                      className="text-gray-700"
                    />
                    <circle
                      cx="60"
                      cy="60"
                      r="50"
                      stroke="url(#gradient)"
                      strokeWidth="8"
                      fill="none"
                      strokeLinecap="round"
                      strokeDasharray={`${idea.viability_score * 31.4} 314`}
                    />
                    <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#06b6d4" />
                        <stop offset="100%" stopColor="#3b82f6" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-white">{idea.viability_score}</div>
                      <div className="text-sm text-gray-400">/ 10</div>
                    </div>
                  </div>
                </div>
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">{idea.title}</h2>
              <p className="text-gray-400 mb-4">{idea.description}</p>
              <div className="flex items-center justify-center space-x-4">
                <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30">{idea.industry}</Badge>
                <Button onClick={downloadPDF} className="bg-green-600 hover:bg-green-700">
                  <Download className="w-4 h-4 mr-2" />
                  Download PDF
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Market Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white/5 backdrop-blur-sm border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <DollarSign className="w-5 h-5 mr-2 text-green-400" />
                TAM Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400 mb-2">
                  ${(idea.tam_data.total_market / 1000000000).toFixed(0)}B
                </div>
                <p className="text-gray-400 text-sm mb-4">Total Addressable Market</p>
                <div className="flex items-center justify-center space-x-2">
                  <TrendingUp className="w-4 h-4 text-green-400" />
                  <span className="text-green-400 font-semibold">{idea.tam_data.growth_rate}% CAGR</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/5 backdrop-blur-sm border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Target className="w-5 h-5 mr-2 text-blue-400" />
                SAM Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400 mb-2">
                  ${(idea.sam_data.serviceable_market / 1000000000).toFixed(0)}B
                </div>
                <p className="text-gray-400 text-sm mb-4">Serviceable Addressable Market</p>
                <div className="flex items-center justify-center space-x-2">
                  <Users className="w-4 h-4 text-blue-400" />
                  <span className="text-blue-400 font-semibold">{idea.sam_data.penetration_rate}% Penetration</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/5 backdrop-blur-sm border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <BarChart3 className="w-5 h-5 mr-2 text-purple-400" />
                SOM Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-400 mb-2">
                  ${(idea.som_data.obtainable_market / 1000000000).toFixed(1)}B
                </div>
                <p className="text-gray-400 text-sm mb-4">Serviceable Obtainable Market</p>
                <div className="flex items-center justify-center space-x-2">
                  <Target className="w-4 h-4 text-purple-400" />
                  <span className="text-purple-400 font-semibold">
                    {idea.som_data.realistic_capture}% Realistic Capture
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* SWOT Analysis */}
        <div className="mb-8">
          <Card className="bg-white/5 backdrop-blur-sm border-white/10">
            <CardHeader>
              <CardTitle className="text-white">SWOT Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-green-400 flex items-center">
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Strengths
                  </h3>
                  <div className="space-y-2">
                    {idea.swot_analysis.strengths.map((strength: string, index: number) => (
                      <div key={index} className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full" />
                        <span className="text-gray-300 text-sm">{strength}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-blue-400 flex items-center">
                    <Lightbulb className="w-5 h-5 mr-2" />
                    Opportunities
                  </h3>
                  <div className="space-y-2">
                    {idea.swot_analysis.opportunities.map((opportunity: string, index: number) => (
                      <div key={index} className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-blue-400 rounded-full" />
                        <span className="text-gray-300 text-sm">{opportunity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Business Plan */}
        <div className="mb-8">
          <Card className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border-cyan-500/20">
            <CardHeader>
              <CardTitle className="text-white">Executive Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 leading-relaxed">{idea.business_plan}</p>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="text-center py-8">
          <p className="text-gray-500 text-sm">
            This report was generated by FutureValidate AI on {new Date(idea.created_at).toLocaleDateString()}
          </p>
          <p className="text-gray-500 text-sm mt-2">
            Want to validate your own startup idea? Visit{" "}
            <a href="/" className="text-cyan-400 hover:text-cyan-300">
              FutureValidate.com
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
