"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import type { ActivityLog } from "@/lib/types"
import {
  TrendingUp,
  DollarSign,
  Users,
  Target,
  Plus,
  BarChart3,
  Clock,
  CheckCircle,
  Search,
  Eye,
  Brain,
  Lightbulb,
  Rocket,
} from "lucide-react"
import Link from "next/link"

// Sample validated ideas with real data
const sampleIdeas = [
  {
    id: "1",
    title: "AI-Powered Personal Finance Assistant",
    description:
      "An intelligent financial advisor that uses machine learning to provide personalized investment recommendations and budget optimization for millennials and Gen Z users.",
    status: "completed",
    viability_score: 8.5,
    created_at: "2024-01-15",
    tam: 124000000000,
    market_growth: 12.5,
    industry: "FinTech",
    competitive_advantage: "Advanced AI personalization with behavioral insights",
    validation_progress: 100,
    is_draft: false,
  },
  {
    id: "2",
    title: "Sustainable Food Delivery Platform",
    description:
      "Zero-waste food delivery service connecting local restaurants with eco-conscious consumers using reusable packaging and carbon-neutral delivery methods.",
    status: "completed",
    viability_score: 7.2,
    created_at: "2024-01-20",
    tam: 45000000000,
    market_growth: 18.3,
    industry: "Food & Beverage",
    competitive_advantage: "First-mover in sustainable delivery with circular economy model",
    validation_progress: 100,
    is_draft: false,
  },
  {
    id: "3",
    title: "Remote Team Collaboration Tool",
    description:
      "Virtual workspace platform designed for distributed teams with AI-powered productivity insights and seamless integration with existing tools.",
    status: "completed",
    viability_score: 9.1,
    created_at: "2024-01-22",
    tam: 78000000000,
    market_growth: 15.7,
    industry: "SaaS",
    competitive_advantage: "AI-driven team analytics with predictive performance insights",
    validation_progress: 100,
    is_draft: false,
  },
  {
    id: "4",
    title: "AR-Enhanced Learning Platform",
    description:
      "Augmented reality educational platform for K-12 students making complex subjects interactive and engaging through immersive experiences.",
    status: "validating",
    viability_score: 8.8,
    created_at: "2024-01-18",
    tam: 89000000000,
    market_growth: 22.1,
    industry: "EdTech",
    competitive_advantage: "Proprietary AR curriculum with gamified learning paths",
    validation_progress: 75,
    is_draft: false,
  },
  {
    id: "5",
    title: "Smart Home Energy Optimizer",
    description:
      "IoT-based energy management system that automatically optimizes home energy consumption and integrates with renewable sources.",
    status: "draft",
    viability_score: 7.9,
    created_at: "2024-01-25",
    tam: 67000000000,
    market_growth: 19.4,
    industry: "CleanTech",
    competitive_advantage: "Machine learning algorithms for predictive energy optimization",
    validation_progress: 25,
    is_draft: true,
  },
]

export default function DashboardPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [ideas, setIdeas] = useState(sampleIdeas)
  const [activities, setActivities] = useState<ActivityLog[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth")
    }
  }, [user, loading, router])

  useEffect(() => {
    if (user) {
      // Simulate loading
      setTimeout(() => setIsLoading(false), 1000)
    }
  }, [user])

  const filteredIdeas = ideas.filter((idea) => {
    const matchesSearch =
      idea.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      idea.description?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === "all" || idea.status === filterStatus
    return matchesSearch && matchesFilter
  })

  // Updated stats with higher limits for testing
  const completedIdeas = ideas.filter((i) => i.status === "completed").length
  const maxIdeasAllowed = 10 // Increased from 3 to 10 for testing
  const remainingValidations = maxIdeasAllowed - completedIdeas

  const stats = [
    {
      title: "Ideas Validated",
      value: completedIdeas,
      change: `${remainingValidations} remaining`,
      icon: Target,
      color: "from-cyan-500 to-blue-600",
    },
    {
      title: "Average Score",
      value: ideas.length > 0 ? "8.3" : "0",
      change: "Based on completed validations",
      icon: BarChart3,
      color: "from-green-500 to-teal-600",
    },
    {
      title: "Total Ideas",
      value: ideas.length,
      change: `${ideas.filter((i) => i.status === "draft").length} drafts`,
      icon: DollarSign,
      color: "from-purple-500 to-pink-600",
    },
    {
      title: "Success Rate",
      value: ideas.length > 0 ? "87%" : "0%",
      change: "Ideas above 7/10",
      icon: TrendingUp,
      color: "from-orange-500 to-red-600",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      case "validating":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      case "draft":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30"
      case "failed":
        return "bg-red-500/20 text-red-400 border-red-500/30"
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-3 h-3 mr-1" />
      case "validating":
        return <Clock className="w-3 h-3 mr-1" />
      default:
        return null
    }
  }

  const handleViewReport = (idea: any) => {
    // Store sample data for results page
    localStorage.setItem(
      "sampleValidationResults",
      JSON.stringify({
        idea_title: idea.title,
        viability_score: idea.viability_score,
        tam_data: {
          total_market: idea.tam,
          growth_rate: idea.market_growth,
          year: 2024,
          currency: "USD",
        },
        sam_data: {
          serviceable_market: idea.tam * 0.3,
          penetration_rate: 8.5,
          target_segments: ["millennials", "professionals", "tech_enthusiasts"],
        },
        som_data: {
          obtainable_market: idea.tam * 0.05,
          realistic_capture: 0.5,
          timeframe: "5_years",
        },
        swot_analysis: {
          strengths: [
            "Innovative technology approach",
            "Strong market demand",
            "Experienced team",
            "Clear value proposition",
          ],
          weaknesses: [
            "High customer acquisition cost",
            "Regulatory compliance complexity",
            "Need for significant investment",
            "Limited brand recognition",
          ],
          opportunities: [
            "Growing market demand",
            "Technology advancement trends",
            "Partnership opportunities",
            "Global expansion potential",
          ],
          threats: [
            "Established competitor response",
            "Economic uncertainty impact",
            "Regulatory changes",
            "Technology disruption",
          ],
        },
        competitor_analysis: {
          direct_competitors: [
            {
              name: "Market Leader A",
              market_share: 15,
              strengths: ["Brand recognition", "Large user base", "Strong funding"],
            },
            {
              name: "Emerging Player B",
              market_share: 8,
              strengths: ["Innovation", "Agile development", "Niche focus"],
            },
            {
              name: "Enterprise Solution C",
              market_share: 12,
              strengths: ["Enterprise relationships", "Comprehensive features", "Reliability"],
            },
          ],
          competitive_advantage: idea.competitive_advantage,
        },
        market_trends: {
          "2024": idea.tam,
          "2025": idea.tam * 1.15,
          "2026": idea.tam * 1.32,
          "2027": idea.tam * 1.52,
          "2028": idea.tam * 1.75,
        },
        usp: `Revolutionary ${idea.industry.toLowerCase()} solution combining cutting-edge technology with superior user experience`,
        business_model: "Freemium SaaS model with tiered pricing, enterprise solutions, and strategic partnerships",
        risks_recommendations: {
          risks: [
            "Market competition intensity",
            "Customer acquisition challenges",
            "Technology development risks",
            "Regulatory compliance requirements",
          ],
          recommendations: [
            "Focus on unique value proposition",
            "Build strategic partnerships early",
            "Ensure regulatory compliance",
            "Develop multiple revenue streams",
          ],
        },
        business_plan: `This ${idea.industry} startup shows exceptional potential with a viability score of ${idea.viability_score}/10. The market opportunity is substantial with a TAM of $${(idea.tam / 1000000000).toFixed(0)}B and strong growth projections of ${idea.market_growth}% CAGR. Key success factors include ${idea.competitive_advantage.toLowerCase()} and effective execution of go-to-market strategy. Recommended next steps: secure initial funding, build MVP, and establish strategic partnerships.`,
      }),
    )
    router.push("/dashboard/validate/results")
  }

  // Check if user can validate more ideas
  const canValidateMore = completedIdeas < maxIdeasAllowed

  if (loading || isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-black">
      <DashboardSidebar />

      <main className="dashboard-main main-content">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="section-spacing">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <h1 className="text-3xl font-bold text-white mb-2">
                Welcome back, {user.full_name || user.email?.split("@")[0] || "there"}!
              </h1>
              <p className="text-gray-400">Here's an overview of your startup validation journey.</p>
            </motion.div>
          </div>

          {/* Validation Limit Warning */}
          {!canValidateMore && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="section-spacing">
              <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Target className="w-5 h-5 text-yellow-400" />
                  <div>
                    <p className="text-yellow-400 font-medium">Validation Limit Reached</p>
                    <p className="text-yellow-300 text-sm">
                      You've used all {maxIdeasAllowed} validations. Contact support to increase your limit.
                    </p>
                  </div>
                </div>
                <Button
                  onClick={() => setIdeas(ideas.slice(0, 2))} // Reset for testing
                  variant="outline"
                  size="sm"
                  className="border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/10"
                >
                  Reset for Testing
                </Button>
              </div>
            </motion.div>
          )}

          {/* Stats Grid */}
          <div className="section-spacing">
            <div className="card-grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="card-container"
                >
                  <Card className="bg-white/5 backdrop-blur-sm border-white/10 hover:border-cyan-500/30 transition-all duration-300 h-full">
                    <CardContent className="card-content-full">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="text-gray-400 text-sm font-medium">{stat.title}</p>
                          <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
                          <p className="text-xs text-gray-500 mt-1">{stat.change}</p>
                        </div>
                        <div
                          className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-lg flex items-center justify-center flex-shrink-0`}
                        >
                          <stat.icon className="w-6 h-6 text-white" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Search and Filter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="section-spacing"
          >
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search ideas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white/5 border-white/20 text-white placeholder:text-gray-500 focus:border-cyan-500"
                />
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 bg-white/5 border border-white/20 rounded-md text-white focus:border-cyan-500 focus:outline-none"
              >
                <option value="all">All Status</option>
                <option value="draft">Drafts</option>
                <option value="validating">Validating</option>
                <option value="completed">Completed</option>
                <option value="failed">Failed</option>
              </select>
            </div>
          </motion.div>

          {/* Ideas List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="section-spacing"
          >
            <Card className="bg-white/5 backdrop-blur-sm border-white/10">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-white">Your Ideas ({filteredIdeas.length})</CardTitle>
                  <CardDescription className="text-gray-400">Manage and track your startup validations</CardDescription>
                </div>
                <Link href="/dashboard/validate">
                  <Button
                    className={`border-0 ${
                      canValidateMore
                        ? "bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white"
                        : "bg-gray-600 text-gray-400 cursor-not-allowed"
                    }`}
                    disabled={!canValidateMore}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    New Validation
                  </Button>
                </Link>
              </CardHeader>
              <CardContent className="p-6">
                {filteredIdeas.length === 0 ? (
                  <div className="text-center py-12">
                    <Target className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">No ideas found</h3>
                    <p className="text-gray-400 mb-6">
                      {searchTerm || filterStatus !== "all"
                        ? "Try adjusting your search or filter criteria"
                        : "Start by validating your first startup idea"}
                    </p>
                    {!searchTerm && filterStatus === "all" && canValidateMore && (
                      <Link href="/dashboard/validate">
                        <Button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white border-0">
                          <Plus className="w-4 h-4 mr-2" />
                          Validate Your First Idea
                        </Button>
                      </Link>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredIdeas.map((idea, index) => (
                      <motion.div
                        key={idea.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                        className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10 hover:border-cyan-500/30 transition-all duration-300"
                      >
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-white font-semibold">{idea.title}</h3>
                            <Badge className={getStatusColor(idea.status)}>
                              {getStatusIcon(idea.status)}
                              {idea.status.charAt(0).toUpperCase() + idea.status.slice(1)}
                            </Badge>
                            {idea.is_draft && (
                              <Badge variant="outline" className="border-blue-500/30 text-blue-400">
                                Draft
                              </Badge>
                            )}
                          </div>
                          <p className="text-gray-400 text-sm mb-2 line-clamp-2">{idea.description}</p>
                          <div className="flex items-center space-x-4 text-xs text-gray-500">
                            <span>Industry: {idea.industry || "Not specified"}</span>
                            <span>Progress: {idea.validation_progress}%</span>
                            <span>{new Date(idea.created_at).toLocaleDateString()}</span>
                          </div>
                          {idea.status === "validating" && (
                            <div className="mt-2">
                              <div className="w-full bg-gray-700 rounded-full h-2">
                                <div
                                  className="bg-gradient-to-r from-cyan-500 to-blue-600 h-2 rounded-full transition-all duration-300"
                                  style={{ width: `${idea.validation_progress}%` }}
                                />
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="flex items-center space-x-2 ml-4">
                          {idea.status === "completed" && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-cyan-400 hover:text-cyan-300"
                              onClick={() => handleViewReport(idea)}
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              View Report
                            </Button>
                          )}
                          {idea.status === "draft" && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-blue-400 hover:text-blue-300"
                              onClick={() => router.push(`/dashboard/validate?draft=${idea.id}`)}
                            >
                              Continue
                            </Button>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Quick Actions - FIXED LAYOUT */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="section-spacing"
          >
            <h2 className="text-2xl font-bold text-white mb-6">Quick Actions</h2>
            <div className="card-grid grid-cols-1 md:grid-cols-3">
              <Link href="/dashboard/validate" className="card-container">
                <Card
                  className={`border-cyan-500/20 hover:border-cyan-500/40 transition-all duration-300 cursor-pointer h-full ${
                    canValidateMore
                      ? "bg-gradient-to-br from-cyan-500/10 to-blue-500/10"
                      : "bg-gradient-to-br from-gray-500/10 to-gray-600/10 opacity-50"
                  }`}
                >
                  <CardContent className="card-content-full text-center">
                    <Target
                      className={`w-16 h-16 mx-auto mb-6 ${canValidateMore ? "text-cyan-400" : "text-gray-500"}`}
                    />
                    <h3 className={`text-xl font-semibold mb-4 ${canValidateMore ? "text-white" : "text-gray-500"}`}>
                      Validate New Idea
                    </h3>
                    <p className={`text-sm leading-relaxed ${canValidateMore ? "text-gray-400" : "text-gray-600"}`}>
                      {canValidateMore
                        ? "Submit your next startup concept for comprehensive AI analysis and market validation"
                        : "Validation limit reached - upgrade to validate more ideas"}
                    </p>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/dashboard/collaborations" className="card-container">
                <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 cursor-pointer h-full">
                  <CardContent className="card-content-full text-center">
                    <Users className="w-16 h-16 text-purple-400 mx-auto mb-6" />
                    <h3 className="text-xl font-semibold text-white mb-4">Team Collaboration</h3>
                    <p className="text-sm text-gray-400 leading-relaxed">
                      Collaborate on startup ideas with your team members and get valuable feedback and insights from
                      your collaborators
                    </p>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/dashboard/nexus" className="card-container">
                <Card className="bg-gradient-to-br from-green-500/10 to-teal-500/10 border-green-500/20 hover:border-green-500/40 transition-all duration-300 cursor-pointer h-full">
                  <CardContent className="card-content-full text-center">
                    <Brain className="w-16 h-16 text-green-400 mx-auto mb-6" />
                    <h3 className="text-xl font-semibold text-white mb-4">Nexus Research</h3>
                    <p className="text-sm text-gray-400 leading-relaxed">
                      Analyze consulting reports and research papers for startup insights and emerging market
                      opportunities
                    </p>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </motion.div>

          {/* Performance Insights - FIXED LAYOUT */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.9 }}
            className="section-spacing"
          >
            <h2 className="text-2xl font-bold text-white mb-6">Performance Insights</h2>
            <div className="card-grid grid-cols-1 md:grid-cols-3">
              <Card className="bg-gradient-to-br from-red-500/10 to-orange-500/10 border-red-500/20 card-container">
                <CardContent className="card-content-full text-center">
                  <Rocket className="w-12 h-12 text-red-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">Top Performer</h3>
                  <p className="text-sm text-gray-400 mb-2">AI-Powered Finance Assistant (9.1/10)</p>
                  <p className="text-xs text-red-400">Highest viability score this month</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-blue-500/20 card-container">
                <CardContent className="card-content-full text-center">
                  <TrendingUp className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">Growth Trend</h3>
                  <p className="text-sm text-gray-400 mb-2">EdTech sector showing 22% CAGR</p>
                  <p className="text-xs text-blue-400">Fastest growing market segment</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border-yellow-500/20 card-container">
                <CardContent className="card-content-full text-center">
                  <Lightbulb className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">Recommendation</h3>
                  <p className="text-sm text-gray-400 mb-2">Focus on SaaS and FinTech opportunities</p>
                  <p className="text-xs text-yellow-400">Based on your validation history</p>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  )
}
