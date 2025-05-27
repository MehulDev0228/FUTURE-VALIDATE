"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { useParams, useRouter } from "next/navigation"
import {
  ArrowLeft,
  Brain,
  TrendingUp,
  Target,
  Lightbulb,
  Download,
  Share,
  AlertTriangle,
  CheckCircle,
  DollarSign,
  Users,
  BarChart3,
  ExternalLink,
} from "lucide-react"

// Sample detailed analysis data
const sampleAnalysisDetails = {
  "1": {
    title: "The Future of Fintech: Digital Banking Revolution 2024",
    source_firm: "McKinsey & Company",
    document_type: "consulting_report",
    document_url: "https://www.mckinsey.com/industries/financial-services/our-insights/the-future-of-fintech",
    summary:
      "This comprehensive report analyzes the rapid transformation of the financial services industry, highlighting key trends in digital banking, neobank growth, and regulatory changes. The analysis reveals significant opportunities for startups in embedded finance, AI-powered financial services, and regulatory technology.",
    startup_potential_score: 87,
    emerging_trends: [
      "Open Banking APIs enabling third-party integrations",
      "AI-Powered Credit Scoring replacing traditional methods",
      "Embedded Finance integration in non-financial platforms",
      "Cryptocurrency and DeFi mainstream adoption",
      "Regulatory Technology (RegTech) automation",
    ],
    startup_ideas: [
      {
        title: "AI-powered personal finance assistant for Gen Z",
        description:
          "Mobile-first platform using AI to provide personalized financial advice, budgeting, and investment recommendations specifically designed for Gen Z users.",
        tam_estimate: 45000000000,
        viability_score: 8.5,
      },
      {
        title: "B2B embedded payment solutions for SMEs",
        description:
          "White-label payment infrastructure that SMEs can integrate into their platforms to offer financial services to their customers.",
        tam_estimate: 78000000000,
        viability_score: 9.2,
      },
      {
        title: "Regulatory compliance automation platform",
        description:
          "AI-driven platform that automates regulatory compliance for financial institutions, reducing costs and improving accuracy.",
        tam_estimate: 23000000000,
        viability_score: 7.8,
      },
    ],
    market_calculations: {
      total_addressable_market: 146000000000,
      serviceable_addressable_market: 43800000000,
      serviceable_obtainable_market: 2190000000,
      growth_rate: 18.5,
    },
    swot_analysis: {
      strengths: [
        "Growing digital adoption post-pandemic",
        "Regulatory support for innovation",
        "Large unbanked population globally",
        "Increasing venture capital investment",
      ],
      weaknesses: [
        "High regulatory compliance costs",
        "Intense competition from incumbents",
        "Customer acquisition challenges",
        "Technology infrastructure requirements",
      ],
      opportunities: [
        "Emerging markets expansion",
        "AI and machine learning integration",
        "Partnership with traditional banks",
        "Cross-border payment solutions",
      ],
      threats: [
        "Regulatory changes and restrictions",
        "Economic downturn impact",
        "Cybersecurity risks",
        "Big Tech competition",
      ],
    },
    market_risks: [
      "Regulatory uncertainty in key markets",
      "Economic recession reducing investment",
      "Increased competition from Big Tech",
      "Cybersecurity threats and data breaches",
    ],
    strategic_recommendations: [
      "Focus on regulatory compliance from day one",
      "Build strategic partnerships with traditional financial institutions",
      "Invest heavily in cybersecurity and data protection",
      "Target underserved market segments initially",
      "Develop AI capabilities for competitive advantage",
    ],
  },
}

export default function NexusResultsPage() {
  const params = useParams()
  const router = useRouter()
  const [analysis, setAnalysis] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const analysisId = params.id as string
    const analysisData = sampleAnalysisDetails[analysisId as keyof typeof sampleAnalysisDetails]

    if (analysisData) {
      setAnalysis(analysisData)
    }

    setTimeout(() => setIsLoading(false), 1000)
  }, [params.id])

  const handleExportPDF = async () => {
    try {
      const response = await fetch("/api/export/nexus-pdf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          analysis_id: params.id,
          analysis_data: analysis,
        }),
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `Nexus-Analysis-${analysis.title.replace(/[^a-zA-Z0-9]/g, "-")}.pdf`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      } else {
        alert("Failed to export PDF")
      }
    } catch (error) {
      console.error("Export error:", error)
      alert("Failed to export PDF")
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black">
        <DashboardSidebar />
        <main className="md:ml-64 p-6 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-white mb-2">Loading Analysis...</h2>
            <p className="text-gray-400">Retrieving research insights</p>
          </div>
        </main>
      </div>
    )
  }

  if (!analysis) {
    return (
      <div className="min-h-screen bg-black">
        <DashboardSidebar />
        <main className="md:ml-64 p-6 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-white mb-2">Analysis Not Found</h2>
            <p className="text-gray-400 mb-4">The requested analysis could not be found.</p>
            <Button
              onClick={() => router.push("/dashboard/nexus")}
              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white border-0"
            >
              Back to Nexus
            </Button>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black">
      <DashboardSidebar />

      <main className="md:ml-64 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-4 mb-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-400 hover:text-white"
                    onClick={() => router.push("/dashboard/nexus")}
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Nexus
                  </Button>
                  {analysis.document_url && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-purple-400 hover:text-purple-300"
                      onClick={() => window.open(analysis.document_url, "_blank")}
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      View Original Paper
                    </Button>
                  )}
                </div>
                <h1 className="text-3xl font-bold text-white mb-2 flex items-center">
                  <Brain className="w-8 h-8 mr-3 text-cyan-400" />
                  Research Analysis Results
                </h1>
                <p className="text-gray-400">{analysis.title}</p>
              </div>
              <div className="flex space-x-4">
                <Button variant="outline" className="border-gray-600 text-gray-400 hover:bg-gray-800">
                  <Share className="w-4 h-4 mr-2" />
                  Share
                </Button>
                <Button
                  onClick={handleExportPDF}
                  className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white border-0"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export PDF
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Startup Potential Score */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-8"
          >
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
                        strokeDasharray={`${analysis.startup_potential_score * 3.14} 314`}
                        className="transition-all duration-1000 ease-out"
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
                        <div className="text-3xl font-bold text-white">{analysis.startup_potential_score}</div>
                        <div className="text-sm text-gray-400">/ 100</div>
                      </div>
                    </div>
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">
                  {analysis.startup_potential_score >= 85
                    ? "Excellent"
                    : analysis.startup_potential_score >= 70
                      ? "High"
                      : "Moderate"}{" "}
                  Startup Potential
                </h2>
                <p className="text-gray-400 max-w-2xl mx-auto">
                  Based on market analysis, emerging trends, and opportunity assessment
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Market Analysis */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card className="bg-white/5 backdrop-blur-sm border-white/10 h-full">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <DollarSign className="w-5 h-5 mr-2 text-green-400" />
                    TAM Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-400 mb-2">
                      ${(analysis.market_calculations.total_addressable_market / 1000000000).toFixed(0)}B
                    </div>
                    <p className="text-gray-400 text-sm mb-4">Total Addressable Market</p>
                    <div className="flex items-center justify-center space-x-2">
                      <TrendingUp className="w-4 h-4 text-green-400" />
                      <span className="text-green-400 font-semibold">
                        {analysis.market_calculations.growth_rate}% CAGR
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Card className="bg-white/5 backdrop-blur-sm border-white/10 h-full">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Target className="w-5 h-5 mr-2 text-blue-400" />
                    SAM Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-400 mb-2">
                      ${(analysis.market_calculations.serviceable_addressable_market / 1000000000).toFixed(0)}B
                    </div>
                    <p className="text-gray-400 text-sm mb-4">Serviceable Addressable Market</p>
                    <div className="flex items-center justify-center space-x-2">
                      <Users className="w-4 h-4 text-blue-400" />
                      <span className="text-blue-400 font-semibold">30% of TAM</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Card className="bg-white/5 backdrop-blur-sm border-white/10 h-full">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <BarChart3 className="w-5 h-5 mr-2 text-purple-400" />
                    SOM Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-400 mb-2">
                      ${(analysis.market_calculations.serviceable_obtainable_market / 1000000000).toFixed(1)}B
                    </div>
                    <p className="text-gray-400 text-sm mb-4">Serviceable Obtainable Market</p>
                    <div className="flex items-center justify-center space-x-2">
                      <Target className="w-4 h-4 text-purple-400" />
                      <span className="text-purple-400 font-semibold">5% Realistic Capture</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Startup Ideas */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mb-8"
          >
            <Card className="bg-white/5 backdrop-blur-sm border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Lightbulb className="w-5 h-5 mr-2 text-yellow-400" />
                  Identified Startup Opportunities
                </CardTitle>
                <CardDescription className="text-gray-400">
                  High-potential startup ideas derived from research analysis
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {analysis.startup_ideas.map((idea: any, index: number) => (
                    <div key={index} className="p-4 bg-white/5 rounded-lg border border-white/10">
                      <h3 className="text-white font-semibold mb-2">{idea.title}</h3>
                      <p className="text-gray-400 text-sm mb-3">{idea.description}</p>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-500 text-xs">TAM Estimate:</span>
                          <span className="text-green-400 font-semibold text-sm">
                            ${(idea.tam_estimate / 1000000000).toFixed(0)}B
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-500 text-xs">Viability Score:</span>
                          <span className="text-cyan-400 font-semibold text-sm">{idea.viability_score}/10</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* SWOT Analysis */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mb-8"
          >
            <Card className="bg-white/5 backdrop-blur-sm border-white/10">
              <CardHeader>
                <CardTitle className="text-white">SWOT Analysis</CardTitle>
                <CardDescription className="text-gray-400">
                  Strategic analysis of the market opportunity
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Strengths */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-green-400 flex items-center">
                      <CheckCircle className="w-5 h-5 mr-2" />
                      Strengths
                    </h3>
                    <div className="space-y-2">
                      {analysis.swot_analysis.strengths.map((strength: string, index: number) => (
                        <div key={index} className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-green-400 rounded-full" />
                          <span className="text-gray-300 text-sm">{strength}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Weaknesses */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-red-400 flex items-center">
                      <AlertTriangle className="w-5 h-5 mr-2" />
                      Weaknesses
                    </h3>
                    <div className="space-y-2">
                      {analysis.swot_analysis.weaknesses.map((weakness: string, index: number) => (
                        <div key={index} className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-red-400 rounded-full" />
                          <span className="text-gray-300 text-sm">{weakness}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Opportunities */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-blue-400 flex items-center">
                      <Lightbulb className="w-5 h-5 mr-2" />
                      Opportunities
                    </h3>
                    <div className="space-y-2">
                      {analysis.swot_analysis.opportunities.map((opportunity: string, index: number) => (
                        <div key={index} className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-blue-400 rounded-full" />
                          <span className="text-gray-300 text-sm">{opportunity}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Threats */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-yellow-400 flex items-center">
                      <AlertTriangle className="w-5 h-5 mr-2" />
                      Threats
                    </h3>
                    <div className="space-y-2">
                      {analysis.swot_analysis.threats.map((threat: string, index: number) => (
                        <div key={index} className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-yellow-400 rounded-full" />
                          <span className="text-gray-300 text-sm">{threat}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Strategic Recommendations */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            <Card className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border-cyan-500/20">
              <CardHeader>
                <CardTitle className="text-white">Strategic Recommendations</CardTitle>
                <CardDescription className="text-gray-400">
                  Key recommendations for startup success in this market
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analysis.strategic_recommendations.map((recommendation: string, index: number) => (
                    <div key={index} className="flex items-start space-x-3 p-3 bg-white/5 rounded-lg">
                      <div className="w-6 h-6 bg-cyan-500 rounded-full flex items-center justify-center text-white text-sm font-bold mt-0.5">
                        {index + 1}
                      </div>
                      <p className="text-gray-300 text-sm leading-relaxed">{recommendation}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>
    </div>
  )
}
