"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { Upload, Brain, Lightbulb, Download, Eye, Clock, CheckCircle, AlertCircle, ExternalLink } from "lucide-react"

// Sample research papers data
const sampleResearchPapers = [
  {
    id: "1",
    title: "The Future of Fintech: Digital Banking Revolution 2024",
    source_firm: "McKinsey & Company",
    document_type: "consulting_report",
    document_url: "https://www.mckinsey.com/industries/financial-services/our-insights/the-future-of-fintech",
    summary:
      "Comprehensive analysis of digital banking trends, neobank growth, and regulatory changes shaping the financial services industry.",
    startup_potential_score: 87,
    emerging_trends: ["Open Banking APIs", "AI-Powered Credit Scoring", "Embedded Finance", "Crypto Integration"],
    startup_ideas: [
      "AI-powered personal finance assistant for Gen Z",
      "B2B embedded payment solutions for SMEs",
      "Regulatory compliance automation platform",
    ],
    processing_status: "completed",
    created_at: "2024-01-15T10:30:00Z",
  },
  {
    id: "2",
    title: "Healthcare Technology Disruption: Post-Pandemic Opportunities",
    source_firm: "Boston Consulting Group",
    document_type: "research_paper",
    document_url: "https://www.bcg.com/publications/2024/healthcare-technology-disruption-opportunities",
    summary:
      "Analysis of healthcare digitization acceleration, telemedicine adoption, and emerging health tech opportunities.",
    startup_potential_score: 92,
    emerging_trends: ["Remote Patient Monitoring", "AI Diagnostics", "Mental Health Apps", "Personalized Medicine"],
    startup_ideas: [
      "AI-powered mental health screening platform",
      "Remote chronic disease management system",
      "Personalized nutrition and wellness app",
    ],
    processing_status: "completed",
    created_at: "2024-01-20T14:15:00Z",
  },
  {
    id: "3",
    title: "Sustainable Technology Investment Landscape 2024",
    source_firm: "Bain & Company",
    document_type: "market_study",
    document_url: "https://www.bain.com/insights/sustainable-technology-investment-landscape-2024/",
    summary:
      "Deep dive into cleantech investments, carbon credit markets, and sustainable technology adoption across industries.",
    startup_potential_score: 78,
    emerging_trends: ["Carbon Capture Technology", "Green Hydrogen", "Circular Economy Platforms", "ESG Analytics"],
    startup_ideas: [
      "Carbon footprint tracking for SMEs",
      "Circular economy marketplace platform",
      "Green supply chain optimization tool",
    ],
    processing_status: "completed",
    created_at: "2024-01-25T09:45:00Z",
  },
]

export default function NexusPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [analyses, setAnalyses] = useState(sampleResearchPapers)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadForm, setUploadForm] = useState({
    title: "",
    document_type: "research_paper",
    source_firm: "",
    document_url: "", // Add this field
    document_content: "",
  })

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth")
    }
  }, [user, loading, router])

  const handleUpload = async () => {
    if (!uploadForm.title || !uploadForm.document_content) {
      alert("Please fill in all required fields")
      return
    }

    setIsUploading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 3000))

      const newAnalysis = {
        id: Date.now().toString(),
        ...uploadForm,
        summary: "AI-generated summary of the uploaded document...",
        startup_potential_score: Math.floor(Math.random() * 30) + 70,
        emerging_trends: ["AI Innovation", "Market Disruption", "Digital Transformation"],
        startup_ideas: [
          "AI-powered solution based on research insights",
          "Market gap opportunity identified",
          "Technology innovation platform",
        ],
        processing_status: "completed",
        created_at: new Date().toISOString(),
      }

      setAnalyses([newAnalysis, ...analyses])
      setUploadForm({
        title: "",
        document_type: "research_paper",
        source_firm: "",
        document_url: "",
        document_content: "",
      })

      alert("Document analyzed successfully!")
    } catch (error) {
      alert("Failed to analyze document")
    } finally {
      setIsUploading(false)
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 85) return "text-green-400"
    if (score >= 70) return "text-yellow-400"
    return "text-red-400"
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-400" />
      case "processing":
        return <Clock className="w-4 h-4 text-yellow-400" />
      case "failed":
        return <AlertCircle className="w-4 h-4 text-red-400" />
      default:
        return <Clock className="w-4 h-4 text-gray-400" />
    }
  }

  if (loading) {
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
                <h1 className="text-3xl font-bold text-white mb-2 flex items-center">
                  <Brain className="w-8 h-8 mr-3 text-cyan-400" />
                  Nexus Research Analyzer
                </h1>
                <p className="text-gray-400">
                  AI-powered analysis of research papers and consulting reports for startup insights
                </p>
              </div>
            </div>
          </motion.div>

          {/* Upload Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-8"
          >
            <Card className="bg-white/5 backdrop-blur-sm border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Upload className="w-5 h-5 mr-2 text-cyan-400" />
                  Upload Research Document
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Upload research papers, consulting reports, or market studies for AI analysis
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Document Title *</label>
                    <Input
                      placeholder="e.g., Future of AI in Healthcare 2024"
                      value={uploadForm.title}
                      onChange={(e) => setUploadForm({ ...uploadForm, title: e.target.value })}
                      className="bg-white/5 border-white/20 text-white placeholder:text-gray-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Source Firm</label>
                    <Input
                      placeholder="e.g., McKinsey & Company"
                      value={uploadForm.source_firm}
                      onChange={(e) => setUploadForm({ ...uploadForm, source_firm: e.target.value })}
                      className="bg-white/5 border-white/20 text-white placeholder:text-gray-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Document URL (Optional)</label>
                  <Input
                    placeholder="https://example.com/research-paper.pdf"
                    value={uploadForm.document_url}
                    onChange={(e) => setUploadForm({ ...uploadForm, document_url: e.target.value })}
                    className="bg-white/5 border-white/20 text-white placeholder:text-gray-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Document Type</label>
                  <select
                    value={uploadForm.document_type}
                    onChange={(e) => setUploadForm({ ...uploadForm, document_type: e.target.value })}
                    className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-md text-white focus:border-cyan-500 focus:outline-none"
                  >
                    <option value="research_paper">Research Paper</option>
                    <option value="consulting_report">Consulting Report</option>
                    <option value="market_study">Market Study</option>
                    <option value="industry_analysis">Industry Analysis</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Document Content *</label>
                  <Textarea
                    placeholder="Paste the document content here or key findings..."
                    value={uploadForm.document_content}
                    onChange={(e) => setUploadForm({ ...uploadForm, document_content: e.target.value })}
                    className="bg-white/5 border-white/20 text-white placeholder:text-gray-500 min-h-[120px]"
                  />
                </div>
                <Button
                  onClick={handleUpload}
                  disabled={isUploading || !uploadForm.title || !uploadForm.document_content}
                  className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white border-0"
                >
                  {isUploading ? (
                    <>
                      <Clock className="w-4 h-4 mr-2 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Brain className="w-4 h-4 mr-2" />
                      Analyze Document
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Recent Analyses */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="bg-white/5 backdrop-blur-sm border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Recent Research Analyses</CardTitle>
                <CardDescription className="text-gray-400">Latest research papers analyzed by Nexus AI</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analyses.map((analysis, index) => (
                    <motion.div
                      key={analysis.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      className="p-4 bg-white/5 rounded-lg border border-white/10 hover:border-cyan-500/30 transition-all duration-300"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-white font-semibold">{analysis.title}</h3>
                            <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                              {analysis.source_firm}
                            </Badge>
                            <div className="flex items-center space-x-1">
                              {getStatusIcon(analysis.processing_status)}
                              <span className="text-sm text-gray-400 capitalize">{analysis.processing_status}</span>
                            </div>
                          </div>

                          <p className="text-gray-400 text-sm mb-3 line-clamp-2">{analysis.summary}</p>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                            <div>
                              <h4 className="text-cyan-400 font-medium text-sm mb-2">Emerging Trends</h4>
                              <div className="flex flex-wrap gap-1">
                                {analysis.emerging_trends.slice(0, 3).map((trend, i) => (
                                  <Badge key={i} variant="outline" className="text-xs border-cyan-500/30 text-cyan-400">
                                    {trend}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            <div>
                              <h4 className="text-green-400 font-medium text-sm mb-2">Startup Ideas</h4>
                              <div className="space-y-1">
                                {analysis.startup_ideas.slice(0, 2).map((idea, i) => (
                                  <div key={i} className="flex items-center space-x-2">
                                    <Lightbulb className="w-3 h-3 text-green-400" />
                                    <span className="text-gray-300 text-xs">{idea}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4 text-xs text-gray-500">
                              <span>Type: {analysis.document_type.replace("_", " ")}</span>
                              <span className={`font-semibold ${getScoreColor(analysis.startup_potential_score)}`}>
                                Potential Score: {analysis.startup_potential_score}/100
                              </span>
                              <span>{new Date(analysis.created_at).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2 ml-4">
                          {analysis.document_url && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-purple-400 hover:text-purple-300"
                              onClick={() => window.open(analysis.document_url, "_blank")}
                            >
                              <ExternalLink className="w-4 h-4 mr-1" />
                              Source
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-cyan-400 hover:text-cyan-300"
                            onClick={() => router.push(`/dashboard/nexus/results/${analysis.id}`)}
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            View Analysis
                          </Button>
                          <Button variant="ghost" size="sm" className="text-green-400 hover:text-green-300">
                            <Download className="w-4 h-4 mr-1" />
                            Export
                          </Button>
                        </div>
                      </div>
                    </motion.div>
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
