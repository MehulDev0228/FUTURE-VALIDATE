"use client"

import { useState, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { useAuth } from "@/contexts/auth-context"
import { useRouter, useSearchParams } from "next/navigation"
import type { Idea } from "@/lib/types"
import { ArrowRight, ArrowLeft, Loader2, Sparkles, Target, Users, DollarSign, Save, AlertCircle } from "lucide-react"
import { useDebounce } from "@/hooks/use-debounce"

const steps = [
  {
    title: "Basic Information",
    description: "Tell us about your startup idea",
    icon: Sparkles,
  },
  {
    title: "Market & Audience",
    description: "Define your target market",
    icon: Users,
  },
  {
    title: "Business Model",
    description: "How will you make money?",
    icon: DollarSign,
  },
  {
    title: "Features & Vision",
    description: "What makes you unique?",
    icon: Target,
  },
]

export default function ValidateIdeaPage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [ideaId, setIdeaId] = useState<string | null>(null)
  const [validationProgress, setValidationProgress] = useState(0)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    industry: "",
    target_market: "",
    revenue_model: "",
    key_features: "",
    problem_solving: "",
    competitive_advantage: "",
    market_size_estimate: "",
    timeline: "",
  })

  const { user } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const draftId = searchParams.get("draft")

  // Debounced form data for auto-saving
  const debouncedFormData = useDebounce(formData, 2000)

  // Load draft if editing existing idea
  useEffect(() => {
    if (draftId) {
      loadDraft(draftId)
    }
  }, [draftId])

  // Auto-save functionality
  useEffect(() => {
    if (debouncedFormData.title && user) {
      saveDraft()
    }
  }, [debouncedFormData, user])

  // Check validation limits
  useEffect(() => {
    if (user && user.ideas_validated >= user.max_ideas_allowed && !draftId) {
      router.push("/dashboard?error=validation_limit_reached")
    }
  }, [user, draftId, router])

  const loadDraft = async (id: string) => {
    try {
      const response = await fetch(`/api/ideas/${id}`)
      if (response.ok) {
        const idea: Idea = await response.json()
        setFormData({
          title: idea.title,
          description: idea.description || "",
          industry: idea.industry || "",
          target_market: idea.target_market || "",
          revenue_model: idea.revenue_model || "",
          key_features: idea.key_features || "",
          problem_solving: idea.problem_solving || "",
          competitive_advantage: idea.competitive_advantage || "",
          market_size_estimate: idea.market_size_estimate || "",
          timeline: idea.timeline || "",
        })
        setIdeaId(id)
        setValidationProgress(idea.validation_progress)
      }
    } catch (error) {
      console.error("Failed to load draft:", error)
    }
  }

  const saveDraft = useCallback(async () => {
    if (!user || isSaving) return

    setIsSaving(true)
    try {
      const response = await fetch("/api/ideas", {
        method: ideaId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: ideaId,
          ...formData,
          is_draft: true,
          status: "draft",
        }),
      })

      if (response.ok) {
        const result = await response.json()
        if (!ideaId) {
          setIdeaId(result.id)
        }
        setLastSaved(new Date())
      }
    } catch (error) {
      console.error("Failed to save draft:", error)
    } finally {
      setIsSaving(false)
    }
  }, [formData, ideaId, user, isSaving])

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async () => {
    if (!user) return

    setIsSubmitting(true)

    try {
      // First save/update the idea
      const ideaResponse = await fetch("/api/ideas", {
        method: ideaId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: ideaId,
          ...formData,
          is_draft: false,
          status: "validating",
        }),
      })

      if (!ideaResponse.ok) {
        throw new Error("Failed to save idea")
      }

      const ideaResult = await ideaResponse.json()
      const finalIdeaId = ideaId || ideaResult.id

      // Start validation process
      const validationResponse = await fetch("/api/validate-idea", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idea_id: finalIdeaId,
          idea_data: formData,
        }),
      })

      if (!validationResponse.ok) {
        throw new Error("Failed to start validation")
      }

      // Redirect to results page with polling
      router.push(`/dashboard/validate/results?id=${finalIdeaId}`)
    } catch (error) {
      console.error("Validation error:", error)
      alert("Failed to validate idea. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-gray-300">
                Idea Title *
              </Label>
              <Input
                id="title"
                placeholder="e.g., AI-Powered Personal Finance Assistant"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                className="bg-white/5 border-white/20 text-white placeholder:text-gray-500 focus:border-cyan-500"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description" className="text-gray-300">
                Description *
              </Label>
              <Textarea
                id="description"
                placeholder="Describe your startup idea in detail. What problem does it solve? How does it work?"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                className="bg-white/5 border-white/20 text-white placeholder:text-gray-500 focus:border-cyan-500 min-h-[120px]"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="industry" className="text-gray-300">
                Industry *
              </Label>
              <Select onValueChange={(value) => handleInputChange("industry", value)} value={formData.industry}>
                <SelectTrigger className="bg-white/5 border-white/20 text-white focus:border-cyan-500">
                  <SelectValue placeholder="Select your industry" />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-gray-700">
                  <SelectItem value="fintech">FinTech</SelectItem>
                  <SelectItem value="healthtech">HealthTech</SelectItem>
                  <SelectItem value="edtech">EdTech</SelectItem>
                  <SelectItem value="ecommerce">E-commerce</SelectItem>
                  <SelectItem value="saas">SaaS</SelectItem>
                  <SelectItem value="marketplace">Marketplace</SelectItem>
                  <SelectItem value="social">Social Media</SelectItem>
                  <SelectItem value="gaming">Gaming</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )

      case 1:
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="target_market" className="text-gray-300">
                Target Market *
              </Label>
              <Textarea
                id="target_market"
                placeholder="Who are your ideal customers? Be specific about demographics, psychographics, and market segments."
                value={formData.target_market}
                onChange={(e) => handleInputChange("target_market", e.target.value)}
                className="bg-white/5 border-white/20 text-white placeholder:text-gray-500 focus:border-cyan-500 min-h-[100px]"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="market_size_estimate" className="text-gray-300">
                Market Size Estimate
              </Label>
              <Select
                onValueChange={(value) => handleInputChange("market_size_estimate", value)}
                value={formData.market_size_estimate}
              >
                <SelectTrigger className="bg-white/5 border-white/20 text-white focus:border-cyan-500">
                  <SelectValue placeholder="Estimated market size" />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-gray-700">
                  <SelectItem value="under-1m">Under $1M</SelectItem>
                  <SelectItem value="1m-10m">$1M - $10M</SelectItem>
                  <SelectItem value="10m-100m">$10M - $100M</SelectItem>
                  <SelectItem value="100m-1b">$100M - $1B</SelectItem>
                  <SelectItem value="over-1b">Over $1B</SelectItem>
                  <SelectItem value="unknown">Unknown</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="problem_solving" className="text-gray-300">
                Problem You're Solving *
              </Label>
              <Textarea
                id="problem_solving"
                placeholder="What specific problem does your idea solve? How painful is this problem for your target market?"
                value={formData.problem_solving}
                onChange={(e) => handleInputChange("problem_solving", e.target.value)}
                className="bg-white/5 border-white/20 text-white placeholder:text-gray-500 focus:border-cyan-500 min-h-[100px]"
                required
              />
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="revenue_model" className="text-gray-300">
                Revenue Model *
              </Label>
              <Select
                onValueChange={(value) => handleInputChange("revenue_model", value)}
                value={formData.revenue_model}
              >
                <SelectTrigger className="bg-white/5 border-white/20 text-white focus:border-cyan-500">
                  <SelectValue placeholder="How will you make money?" />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-gray-700">
                  <SelectItem value="subscription">Subscription (SaaS)</SelectItem>
                  <SelectItem value="freemium">Freemium</SelectItem>
                  <SelectItem value="marketplace">Marketplace Commission</SelectItem>
                  <SelectItem value="advertising">Advertising</SelectItem>
                  <SelectItem value="one-time">One-time Purchase</SelectItem>
                  <SelectItem value="licensing">Licensing</SelectItem>
                  <SelectItem value="transaction">Transaction Fees</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="timeline" className="text-gray-300">
                Development Timeline
              </Label>
              <Select onValueChange={(value) => handleInputChange("timeline", value)} value={formData.timeline}>
                <SelectTrigger className="bg-white/5 border-white/20 text-white focus:border-cyan-500">
                  <SelectValue placeholder="How long to build MVP?" />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-gray-700">
                  <SelectItem value="1-3months">1-3 months</SelectItem>
                  <SelectItem value="3-6months">3-6 months</SelectItem>
                  <SelectItem value="6-12months">6-12 months</SelectItem>
                  <SelectItem value="over-1year">Over 1 year</SelectItem>
                  <SelectItem value="unknown">Unknown</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="key_features" className="text-gray-300">
                Key Features *
              </Label>
              <Textarea
                id="key_features"
                placeholder="List the main features and functionalities of your product. What makes it unique?"
                value={formData.key_features}
                onChange={(e) => handleInputChange("key_features", e.target.value)}
                className="bg-white/5 border-white/20 text-white placeholder:text-gray-500 focus:border-cyan-500 min-h-[100px]"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="competitive_advantage" className="text-gray-300">
                Competitive Advantage *
              </Label>
              <Textarea
                id="competitive_advantage"
                placeholder="What gives you an edge over existing solutions? What's your unique value proposition?"
                value={formData.competitive_advantage}
                onChange={(e) => handleInputChange("competitive_advantage", e.target.value)}
                className="bg-white/5 border-white/20 text-white placeholder:text-gray-500 focus:border-cyan-500 min-h-[100px]"
                required
              />
            </div>
          </div>
        )

      default:
        return null
    }
  }

  const isStepValid = () => {
    switch (currentStep) {
      case 0:
        return formData.title && formData.description && formData.industry
      case 1:
        return formData.target_market && formData.problem_solving
      case 2:
        return formData.revenue_model
      case 3:
        return formData.key_features && formData.competitive_advantage
      default:
        return false
    }
  }

  return (
    <div className="min-h-screen bg-black">
      <DashboardSidebar />

      <main className="md:ml-64 p-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">
                  {draftId ? "Continue Validation" : "Validate Your Idea"}
                </h1>
                <p className="text-gray-400">
                  Our AI will analyze your startup concept and provide comprehensive insights
                </p>
              </div>
              <div className="flex items-center space-x-4">
                {lastSaved && (
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <Save className="w-4 h-4" />
                    <span>Saved {lastSaved.toLocaleTimeString()}</span>
                  </div>
                )}
                {isSaving && (
                  <div className="flex items-center space-x-2 text-sm text-cyan-400">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Saving...</span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Validation Limit Warning */}
          {user && user.ideas_validated >= user.max_ideas_allowed && !draftId && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center space-x-3"
            >
              <AlertCircle className="w-5 h-5 text-red-400" />
              <div>
                <p className="text-red-400 font-medium">Validation Limit Reached</p>
                <p className="text-red-300 text-sm">
                  You've used all {user.max_ideas_allowed} validations. Upgrade to continue validating ideas.
                </p>
              </div>
            </motion.div>
          )}

          {/* Progress Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between mb-4">
              {steps.map((step, index) => (
                <div key={index} className="flex items-center">
                  <div
                    className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300 ${
                      index <= currentStep
                        ? "bg-gradient-to-r from-cyan-500 to-blue-600 border-cyan-500 text-white"
                        : "border-gray-600 text-gray-400"
                    }`}
                  >
                    <step.icon className="w-5 h-5" />
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`w-16 h-0.5 mx-2 transition-all duration-300 ${
                        index < currentStep ? "bg-gradient-to-r from-cyan-500 to-blue-600" : "bg-gray-600"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="text-center">
              <h2 className="text-xl font-semibold text-white">{steps[currentStep].title}</h2>
              <p className="text-gray-400 text-sm">{steps[currentStep].description}</p>
            </div>
          </motion.div>

          {/* Form Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="bg-white/5 backdrop-blur-sm border-white/10">
              <CardHeader>
                <CardTitle className="text-white">
                  Step {currentStep + 1} of {steps.length}
                </CardTitle>
                <CardDescription className="text-gray-400">Fill out the information below to continue</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                {renderStepContent()}

                {/* Navigation Buttons */}
                <div className="flex justify-between mt-8">
                  <Button
                    variant="outline"
                    onClick={handlePrevious}
                    disabled={currentStep === 0}
                    className="border-gray-600 text-gray-400 hover:bg-gray-800"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Previous
                  </Button>

                  {currentStep === steps.length - 1 ? (
                    <Button
                      onClick={handleSubmit}
                      disabled={
                        !isStepValid() ||
                        isSubmitting ||
                        (user && user.ideas_validated >= user.max_ideas_allowed && !draftId)
                      }
                      className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white border-0"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Analyzing...
                        </>
                      ) : (
                        <>
                          Submit for Analysis
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </>
                      )}
                    </Button>
                  ) : (
                    <Button
                      onClick={handleNext}
                      disabled={!isStepValid()}
                      className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white border-0"
                    >
                      Next
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>
    </div>
  )
}
