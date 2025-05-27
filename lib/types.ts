export interface User {
  id: string
  email: string
  full_name?: string
  avatar_url?: string
  provider: "email" | "google"
  provider_id?: string
  subscription_tier: "free" | "pro" | "enterprise"
  ideas_validated: number
  max_ideas_allowed: number
  created_at: string
  updated_at: string
}

export interface Idea {
  id: string
  user_id: string
  title: string
  description?: string
  industry?: string
  target_market?: string
  revenue_model?: string
  key_features?: string
  problem_solving?: string
  competitive_advantage?: string
  market_size_estimate?: string
  timeline?: string
  status: "draft" | "validating" | "completed" | "failed"
  is_draft: boolean
  validation_progress: number
  created_at: string
  updated_at: string
}

export interface ValidationReport {
  id: string
  idea_id: string
  viability_score: number
  tam_data: {
    total_market: number
    growth_rate: number
    year: number
    currency: string
  }
  sam_data: {
    serviceable_market: number
    penetration_rate: number
    target_segments: string[]
  }
  som_data: {
    obtainable_market: number
    realistic_capture: number
    timeframe: string
  }
  swot_analysis: {
    strengths: string[]
    weaknesses: string[]
    opportunities: string[]
    threats: string[]
  }
  competitor_analysis: {
    direct_competitors: Array<{
      name: string
      market_share: number
      strengths: string[]
    }>
    competitive_advantage: string
  }
  market_trends: Record<string, number>
  usp: string
  business_model: string
  risks_recommendations: {
    risks: string[]
    recommendations: string[]
  }
  business_plan: string
  ai_provider: string
  processing_time: number
  created_at: string
}

export interface Team {
  id: string
  name: string
  team_code: string
  owner_id: string
  description?: string
  created_at: string
}

export interface TeamMember {
  id: string
  team_id: string
  user_id: string
  role: "owner" | "admin" | "member"
  joined_at: string
  user?: User
}

export interface DelphiAnalysis {
  id: string
  user_id: string
  title: string
  document_type: "research_paper" | "consulting_report" | "market_study"
  source_firm?: string
  document_url?: string
  document_content?: string
  summary?: string
  emerging_trends?: any
  startup_ideas?: any
  market_calculations?: any
  swot_analysis?: any
  market_risks?: any
  startup_potential_score?: number
  strategic_recommendations?: any
  processing_status: "processing" | "completed" | "failed"
  created_at: string
  updated_at: string
}

export interface ActivityLog {
  id: string
  user_id: string
  entity_type: "idea" | "validation" | "team" | "delphi"
  entity_id: string
  action: string
  details: any
  created_at: string
}

export interface WaitlistEntry {
  id: string
  email: string
  source: string
  created_at: string
}
