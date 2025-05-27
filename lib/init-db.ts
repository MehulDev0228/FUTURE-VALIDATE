import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function initializeDatabase() {
  try {
    console.log("🗄️ Initializing database...")

    // Create users table
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        full_name VARCHAR(255),
        avatar_url TEXT,
        provider VARCHAR(50) DEFAULT 'email',
        provider_id VARCHAR(255),
        subscription_tier VARCHAR(50) DEFAULT 'free',
        ideas_validated INTEGER DEFAULT 0,
        max_ideas_allowed INTEGER DEFAULT 10,
        team_code VARCHAR(20) UNIQUE,
        created_at TIMESTAMP DEFAULT NOW(),
        last_login TIMESTAMP DEFAULT NOW()
      )
    `

    // Create ideas table
    await sql`
      CREATE TABLE IF NOT EXISTS ideas (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        industry VARCHAR(100),
        target_market TEXT,
        revenue_model VARCHAR(100),
        key_features TEXT,
        problem_solving TEXT,
        competitive_advantage TEXT,
        market_size_estimate VARCHAR(100),
        timeline VARCHAR(100),
        status VARCHAR(50) DEFAULT 'draft',
        validation_progress INTEGER DEFAULT 0,
        is_draft BOOLEAN DEFAULT true,
        share_token VARCHAR(50) UNIQUE,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `

    // Create validation reports table
    await sql`
      CREATE TABLE IF NOT EXISTS validation_reports (
        id SERIAL PRIMARY KEY,
        idea_id INTEGER REFERENCES ideas(id) ON DELETE CASCADE,
        viability_score DECIMAL(3,1),
        tam_data JSONB,
        sam_data JSONB,
        som_data JSONB,
        swot_analysis JSONB,
        competitor_analysis JSONB,
        market_trends JSONB,
        usp TEXT,
        business_model TEXT,
        risks_recommendations JSONB,
        business_plan TEXT,
        ai_provider VARCHAR(50),
        processing_time INTEGER,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `

    // Create teams table
    await sql`
      CREATE TABLE IF NOT EXISTS teams (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        team_code VARCHAR(20) UNIQUE NOT NULL,
        owner_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        description TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `

    // Create team members table
    await sql`
      CREATE TABLE IF NOT EXISTS team_members (
        id SERIAL PRIMARY KEY,
        team_id INTEGER REFERENCES teams(id) ON DELETE CASCADE,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        role VARCHAR(50) DEFAULT 'member',
        joined_at TIMESTAMP DEFAULT NOW(),
        UNIQUE(team_id, user_id)
      )
    `

    // Create nexus research table
    await sql`
      CREATE TABLE IF NOT EXISTS nexus_research (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        source_firm VARCHAR(100),
        document_type VARCHAR(50),
        document_url TEXT,
        document_content TEXT,
        summary TEXT,
        emerging_trends JSONB,
        startup_ideas JSONB,
        market_calculations JSONB,
        strategic_recommendations JSONB,
        startup_potential_score INTEGER,
        processing_status VARCHAR(50) DEFAULT 'processing',
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `

    // Create waitlist table
    await sql`
      CREATE TABLE IF NOT EXISTS waitlist (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        source VARCHAR(100) DEFAULT 'website',
        created_at TIMESTAMP DEFAULT NOW()
      )
    `

    // Create activity logs table
    await sql`
      CREATE TABLE IF NOT EXISTS activity_logs (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        entity_type VARCHAR(50),
        entity_id VARCHAR(50),
        action VARCHAR(100),
        details JSONB,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `

    // Create indexes
    await sql`CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)`
    await sql`CREATE INDEX IF NOT EXISTS idx_ideas_user_id ON ideas(user_id)`
    await sql`CREATE INDEX IF NOT EXISTS idx_ideas_share_token ON ideas(share_token)`
    await sql`CREATE INDEX IF NOT EXISTS idx_validation_reports_idea_id ON validation_reports(idea_id)`

    console.log("✅ Database initialized successfully!")
    return true
  } catch (error) {
    console.error("❌ Database initialization failed:", error)
    return false
  }
}
