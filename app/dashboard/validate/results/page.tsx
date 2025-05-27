"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import {
  TrendingUp,
  DollarSign,
  Users,
  Target,
  Download,
  Share,
  AlertTriangle,
  CheckCircle,
  Lightbulb,
  BarChart3,
  ArrowLeft,
} from "lucide-react"
import Link from "next/link"

export default function ValidationResultsPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [validationResults, setValidationResults] = useState<any>(null)

  useEffect(() => {
    // Load validation results from localStorage
    const results = localStorage.getItem("sampleValidationResults")
    if (results) {
      setValidationResults(JSON.parse(results))
    }

    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black">
        <DashboardSidebar />
        <main className="md:ml-64 p-6 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-white mb-2">Analyzing Your Idea...</h2>
            <p className="text-gray-400">Our AI agents are working hard to validate your concept</p>
            <div className="mt-4 space-y-2 text-sm text-gray-500">
              <p>🤖 Agent 1: Structuring your idea...</p>
              <p>🔍 Agent 2: Researching market data...</p>
              <p>⚔️ Agent 3: Analyzing competitors...</p>
              <p>📊 Agent 4: Creating business plan...</p>
              <p>🎯 Agent 5: Final assessment...</p>
            </div>
          </div>
        </main>
      </div>
    )
  }

  if (!validationResults) {
    return (
      <div className="min-h-screen bg-black">
        <DashboardSidebar />
        <main className="md:ml-64 p-6 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-white mb-2">No Results Found</h2>
            <p className="text-gray-400 mb-4">Please validate an idea first.</p>
            <Link href="/dashboard/validate">
              <Button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white border-0">
                Validate New Idea
              </Button>
            </Link>
          </div>
        </main>
      </div>
    )
  }

  const getScoreColor = (score: number) => {
    if (score >= 8) return "from-green-500 to-green-400"
    if (score >= 6) return "from-yellow-500 to-yellow-400"
    return "from-red-500 to-red-400"
  }

  const getScoreLabel = (score: number) => {
    if (score >= 8) return "Excellent"
    if (score >= 6) return "Good"
    if (score >= 4) return "Fair"
    return "Poor"
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
                  <Link href="/dashboard">
                    <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Back to Dashboard
                    </Button>
                  </Link>
                </div>
                <h1 className="text-3xl font-bold text-white mb-2">Validation Results</h1>
                <p className="text-gray-400">{validationResults.idea_title}</p>
              </div>
              <div className="flex space-x-4">
                <Button variant="outline" className="border-gray-600 text-gray-400 hover:bg-gray-800">
                  <Share className="w-4 h-4 mr-2" />
                  Share
                </Button>
                <Button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white border-0">
                  <Download className="w-4 h-4 mr-2" />
                  Export Report
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Viability Score */}
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
                        strokeDasharray={`${validationResults.viability_score * 31.4} 314`}
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
                        <div className="text-3xl font-bold text-white">{validationResults.viability_score}</div>
                        <div className="text-sm text-gray-400">/ 10</div>
                      </div>
                    </div>
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">
                  {getScoreLabel(validationResults.viability_score)} Viability
                </h2>
                <p className="text-gray-400 max-w-2xl mx-auto">
                  Your idea shows strong potential with solid market fundamentals and clear differentiation
                  opportunities.
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
                      ${(validationResults.tam_data.total_market / 1000000000).toFixed(0)}B
                    </div>
                    <p className="text-gray-400 text-sm mb-4">Total Addressable Market</p>
                    <div className="flex items-center justify-center space-x-2">
                      <TrendingUp className="w-4 h-4 text-green-400" />
                      <span className="text-green-400 font-semibold">
                        {validationResults.tam_data.growth_rate}% CAGR
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
                      ${(validationResults.sam_data.serviceable_market / 1000000000).toFixed(0)}B
                    </div>
                    <p className="text-gray-400 text-sm mb-4">Serviceable Addressable Market</p>
                    <div className="flex items-center justify-center space-x-2">
                      <Users className="w-4 h-4 text-blue-400" />
                      <span className="text-blue-400 font-semibold">
                        {validationResults.sam_data.penetration_rate}% Penetration
                      </span>
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
                      ${(validationResults.som_data.obtainable_market / 1000000000).toFixed(1)}B
                    </div>
                    <p className="text-gray-400 text-sm mb-4">Serviceable Obtainable Market</p>
                    <div className="flex items-center justify-center space-x-2">
                      <Target className="w-4 h-4 text-purple-400" />
                      <span className="text-purple-400 font-semibold">
                        {validationResults.som_data.realistic_capture}% Realistic Capture
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* SWOT Analysis */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mb-8"
          >
            <Card className="bg-white/5 backdrop-blur-sm border-white/10">
              <CardHeader>
                <CardTitle className="text-white">SWOT Analysis</CardTitle>
                <CardDescription className="text-gray-400">
                  Comprehensive analysis of your idea's strategic position
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
                      {validationResults.swot_analysis.strengths.map((strength, index) => (
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
                      {validationResults.swot_analysis.weaknesses.map((weakness, index) => (
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
                      {validationResults.swot_analysis.opportunities.map((opportunity, index) => (
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
                      {validationResults.swot_analysis.threats.map((threat, index) => (
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

          {/* Business Plan & Recommendations */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <Card className="bg-white/5 backdrop-blur-sm border-white/10 h-full">
                <CardHeader>
                  <CardTitle className="text-white">Business Model</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 leading-relaxed mb-4">{validationResults.business_model}</p>
                  <div className="space-y-2">
                    <h4 className="text-cyan-400 font-semibold">Unique Selling Proposition:</h4>
                    <p className="text-gray-300 text-sm">{validationResults.usp}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
            >
              <Card className="bg-white/5 backdrop-blur-sm border-white/10 h-full">
                <CardHeader>
                  <CardTitle className="text-white">Key Recommendations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-red-400 font-semibold mb-2">Risks to Consider:</h4>
                      <div className="space-y-1">
                        {validationResults.risks_recommendations.risks.slice(0, 2).map((risk, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <AlertTriangle className="w-3 h-3 text-red-400" />
                            <span className="text-gray-300 text-sm">{risk}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-green-400 font-semibold mb-2">Action Items:</h4>
                      <div className="space-y-1">
                        {validationResults.risks_recommendations.recommendations.slice(0, 2).map((rec, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <CheckCircle className="w-3 h-3 text-green-400" />
                            <span className="text-gray-300 text-sm">{rec}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Executive Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <Card className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border-cyan-500/20">
              <CardHeader>
                <CardTitle className="text-white">Executive Summary</CardTitle>
                <CardDescription className="text-gray-400">AI-generated business plan summary</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 leading-relaxed">{validationResults.business_plan}</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>
    </div>
  )
}
