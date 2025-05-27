import { sql } from "@/lib/database"
import type { User, Idea, ValidationReport, Team, TeamMember, DelphiAnalysis, ActivityLog } from "@/lib/types"

export class DatabaseService {
  // User operations
  static async createUser(userData: Partial<User>): Promise<User> {
    const [user] = await sql`
      INSERT INTO users (email, full_name, avatar_url, provider, provider_id)
      VALUES (${userData.email}, ${userData.full_name}, ${userData.avatar_url}, ${userData.provider}, ${userData.provider_id})
      RETURNING *
    `
    return user as User
  }

  static async getUserByEmail(email: string): Promise<User | null> {
    const [user] = await sql`
      SELECT * FROM users WHERE email = ${email}
    `
    return (user as User) || null
  }

  static async getUserById(id: string): Promise<User | null> {
    const [user] = await sql`
      SELECT * FROM users WHERE id = ${id}
    `
    return (user as User) || null
  }

  static async updateUser(id: string, updates: Partial<User>): Promise<User> {
    const [user] = await sql`
      UPDATE users 
      SET ${sql(updates)}, updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `
    return user as User
  }

  // Idea operations
  static async createIdea(ideaData: Partial<Idea>): Promise<Idea> {
    const [idea] = await sql`
      INSERT INTO ideas (user_id, title, description, industry, target_market, revenue_model, key_features, problem_solving, competitive_advantage, market_size_estimate, timeline, status, is_draft)
      VALUES (${ideaData.user_id}, ${ideaData.title}, ${ideaData.description}, ${ideaData.industry}, ${ideaData.target_market}, ${ideaData.revenue_model}, ${ideaData.key_features}, ${ideaData.problem_solving}, ${ideaData.competitive_advantage}, ${ideaData.market_size_estimate}, ${ideaData.timeline}, ${ideaData.status || "draft"}, ${ideaData.is_draft !== false})
      RETURNING *
    `
    return idea as Idea
  }

  static async getIdeasByUserId(userId: string): Promise<Idea[]> {
    const ideas = await sql`
      SELECT * FROM ideas 
      WHERE user_id = ${userId}
      ORDER BY created_at DESC
    `
    return ideas as Idea[]
  }

  static async getIdeaById(id: string): Promise<Idea | null> {
    const [idea] = await sql`
      SELECT * FROM ideas WHERE id = ${id}
    `
    return (idea as Idea) || null
  }

  static async updateIdea(id: string, updates: Partial<Idea>): Promise<Idea> {
    const [idea] = await sql`
      UPDATE ideas 
      SET ${sql(updates)}, updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `
    return idea as Idea
  }

  static async deleteIdea(id: string): Promise<void> {
    await sql`DELETE FROM ideas WHERE id = ${id}`
  }

  // Validation report operations
  static async createValidationReport(reportData: Partial<ValidationReport>): Promise<ValidationReport> {
    const [report] = await sql`
      INSERT INTO validation_reports (idea_id, viability_score, tam_data, sam_data, som_data, swot_analysis, competitor_analysis, market_trends, usp, business_model, risks_recommendations, business_plan, ai_provider, processing_time)
      VALUES (${reportData.idea_id}, ${reportData.viability_score}, ${JSON.stringify(reportData.tam_data)}, ${JSON.stringify(reportData.sam_data)}, ${JSON.stringify(reportData.som_data)}, ${JSON.stringify(reportData.swot_analysis)}, ${JSON.stringify(reportData.competitor_analysis)}, ${JSON.stringify(reportData.market_trends)}, ${reportData.usp}, ${reportData.business_model}, ${JSON.stringify(reportData.risks_recommendations)}, ${reportData.business_plan}, ${reportData.ai_provider}, ${reportData.processing_time})
      RETURNING *
    `
    return report as ValidationReport
  }

  static async getValidationReportByIdeaId(ideaId: string): Promise<ValidationReport | null> {
    const [report] = await sql`
      SELECT * FROM validation_reports WHERE idea_id = ${ideaId}
    `
    return (report as ValidationReport) || null
  }

  // Team operations
  static async createTeam(teamData: Partial<Team>): Promise<Team> {
    const teamCode = Math.random().toString(36).substring(2, 8).toUpperCase()
    const [team] = await sql`
      INSERT INTO teams (name, team_code, owner_id, description)
      VALUES (${teamData.name}, ${teamCode}, ${teamData.owner_id}, ${teamData.description})
      RETURNING *
    `

    // Add owner as team member
    await sql`
      INSERT INTO team_members (team_id, user_id, role)
      VALUES (${team.id}, ${teamData.owner_id}, 'owner')
    `

    return team as Team
  }

  static async getTeamByCode(teamCode: string): Promise<Team | null> {
    const [team] = await sql`
      SELECT * FROM teams WHERE team_code = ${teamCode}
    `
    return (team as Team) || null
  }

  static async getTeamsByUserId(userId: string): Promise<Team[]> {
    const teams = await sql`
      SELECT t.* FROM teams t
      JOIN team_members tm ON t.id = tm.team_id
      WHERE tm.user_id = ${userId}
      ORDER BY t.created_at DESC
    `
    return teams as Team[]
  }

  static async addTeamMember(teamId: string, userId: string, role = "member"): Promise<TeamMember> {
    const [member] = await sql`
      INSERT INTO team_members (team_id, user_id, role)
      VALUES (${teamId}, ${userId}, ${role})
      ON CONFLICT (team_id, user_id) DO UPDATE SET role = ${role}
      RETURNING *
    `
    return member as TeamMember
  }

  static async getTeamMembers(teamId: string): Promise<TeamMember[]> {
    const members = await sql`
      SELECT tm.*, u.email, u.full_name, u.avatar_url
      FROM team_members tm
      JOIN users u ON tm.user_id = u.id
      WHERE tm.team_id = ${teamId}
      ORDER BY tm.joined_at ASC
    `
    return members as TeamMember[]
  }

  // Delphi analysis operations
  static async createDelphiAnalysis(analysisData: Partial<DelphiAnalysis>): Promise<DelphiAnalysis> {
    const [analysis] = await sql`
      INSERT INTO delphi_analyses (user_id, title, document_type, source_firm, document_url, document_content, processing_status)
      VALUES (${analysisData.user_id}, ${analysisData.title}, ${analysisData.document_type}, ${analysisData.source_firm}, ${analysisData.document_url}, ${analysisData.document_content}, 'processing')
      RETURNING *
    `
    return analysis as DelphiAnalysis
  }

  static async updateDelphiAnalysis(id: string, updates: Partial<DelphiAnalysis>): Promise<DelphiAnalysis> {
    const [analysis] = await sql`
      UPDATE delphi_analyses 
      SET ${sql(updates)}, updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `
    return analysis as DelphiAnalysis
  }

  static async getDelphiAnalysesByUserId(userId: string): Promise<DelphiAnalysis[]> {
    const analyses = await sql`
      SELECT * FROM delphi_analyses 
      WHERE user_id = ${userId}
      ORDER BY created_at DESC
    `
    return analyses as DelphiAnalysis[]
  }

  static async getDelphiAnalysisById(id: string): Promise<DelphiAnalysis | null> {
    const [analysis] = await sql`
      SELECT * FROM delphi_analyses WHERE id = ${id}
    `
    return (analysis as DelphiAnalysis) || null
  }

  // Activity logging
  static async logActivity(activityData: Partial<ActivityLog>): Promise<void> {
    await sql`
      INSERT INTO activity_logs (user_id, entity_type, entity_id, action, details)
      VALUES (${activityData.user_id}, ${activityData.entity_type}, ${activityData.entity_id}, ${activityData.action}, ${JSON.stringify(activityData.details)})
    `
  }

  static async getActivityLogs(userId: string, limit = 50): Promise<ActivityLog[]> {
    const logs = await sql`
      SELECT * FROM activity_logs 
      WHERE user_id = ${userId}
      ORDER BY created_at DESC
      LIMIT ${limit}
    `
    return logs as ActivityLog[]
  }

  // Waitlist operations
  static async addToWaitlist(email: string, source = "website"): Promise<void> {
    await sql`
      INSERT INTO waitlist (email, source)
      VALUES (${email}, ${source})
      ON CONFLICT (email) DO NOTHING
    `
  }
}
