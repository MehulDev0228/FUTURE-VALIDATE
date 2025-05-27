"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Search, Eye, Download, Users, Target, BarChart3, TrendingUp } from "lucide-react"

interface AdminIdea {
  id: string
  title: string
  description: string
  industry: string
  user_email: string
  user_name: string
  viability_score: number
  status: string
  created_at: string
  share_token: string
}

export default function AdminDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [ideas, setIdeas] = useState<AdminIdea[]>([])
  const [filteredIdeas, setFilteredIdeas] = useState<AdminIdea[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [stats, setStats] = useState({
    totalIdeas: 0,
    totalUsers: 0,
    avgScore: 0,
    completedValidations: 0,
  })
  const [loading, setLoading] = useState(true)

  // Check admin access
  useEffect(() => {
    if (status === "loading") return

    if (!session?.user?.email) {
      router.push("/auth")
      return
    }

    // Only allow specific admin emails
    const adminEmails = ["admin@futurevalidate.com", "your-email@gmail.com"] // Add your email here
    if (!adminEmails.includes(session.user.email)) {
      router.push("/dashboard")
      return
    }

    fetchAdminData()
  }, [session, status, router])

  const fetchAdminData = async () => {
    try {
      const response = await fetch("/api/admin/ideas")
      if (response.ok) {
        const data = await response.json()
        setIdeas(data.ideas)
        setFilteredIdeas(data.ideas)
        setStats(data.stats)
      }
    } catch (error) {
      console.error("Failed to fetch admin data:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const filtered = ideas.filter((idea) => {
      const matchesSearch =
        idea.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        idea.user_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        idea.industry.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesFilter = filterStatus === "all" || idea.status === filterStatus

      return matchesSearch && matchesFilter
    })
    setFilteredIdeas(filtered)
  }, [searchTerm, filterStatus, ideas])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      case "validating":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      case "failed":
        return "bg-red-500/20 text-red-400 border-red-500/30"
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30"
    }
  }

  const exportData = async () => {
    try {
      const response = await fetch("/api/admin/export")
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `futurevalidate-data-${new Date().toISOString().split("T")[0]}.csv`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      }
    } catch (error) {
      console.error("Export failed:", error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
          <p className="text-gray-400">Manage all validated ideas and user submissions</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/5 backdrop-blur-sm border-white/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm font-medium">Total Ideas</p>
                  <p className="text-2xl font-bold text-white">{stats.totalIdeas}</p>
                </div>
                <Target className="w-8 h-8 text-cyan-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/5 backdrop-blur-sm border-white/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm font-medium">Total Users</p>
                  <p className="text-2xl font-bold text-white">{stats.totalUsers}</p>
                </div>
                <Users className="w-8 h-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/5 backdrop-blur-sm border-white/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm font-medium">Avg Score</p>
                  <p className="text-2xl font-bold text-white">{stats.avgScore.toFixed(1)}</p>
                </div>
                <BarChart3 className="w-8 h-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/5 backdrop-blur-sm border-white/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm font-medium">Completed</p>
                  <p className="text-2xl font-bold text-white">{stats.completedValidations}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-orange-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search ideas, users, or industries..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white/5 border-white/20 text-white placeholder:text-gray-500"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 bg-white/5 border border-white/20 rounded-md text-white"
          >
            <option value="all">All Status</option>
            <option value="completed">Completed</option>
            <option value="validating">Validating</option>
            <option value="failed">Failed</option>
          </select>
          <Button onClick={exportData} className="bg-green-600 hover:bg-green-700">
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </div>

        {/* Ideas Table */}
        <Card className="bg-white/5 backdrop-blur-sm border-white/10">
          <CardHeader>
            <CardTitle className="text-white">All Ideas ({filteredIdeas.length})</CardTitle>
            <CardDescription className="text-gray-400">Complete list of all validated startup ideas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredIdeas.map((idea) => (
                <div
                  key={idea.id}
                  className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10"
                >
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-white font-semibold">{idea.title}</h3>
                      <Badge className={getStatusColor(idea.status)}>{idea.status}</Badge>
                      {idea.viability_score && (
                        <Badge variant="outline" className="border-cyan-500/30 text-cyan-400">
                          Score: {idea.viability_score}/10
                        </Badge>
                      )}
                    </div>
                    <p className="text-gray-400 text-sm mb-2 line-clamp-2">{idea.description}</p>
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <span>User: {idea.user_email}</span>
                      <span>Industry: {idea.industry}</span>
                      <span>Date: {new Date(idea.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    {idea.status === "completed" && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-cyan-400 hover:text-cyan-300"
                        onClick={() => window.open(`/share/${idea.share_token}`, "_blank")}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
