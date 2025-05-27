import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { prompt, agent } = await request.json()

    // Check if OpenRouter API key is available (optional enhancement)
    const openrouterApiKey = process.env.OPENROUTER_API_KEY

    if (openrouterApiKey && openrouterApiKey !== "your-openrouter-api-key-here") {
      // Use OpenRouter API for access to multiple models
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${openrouterApiKey}`,
          "HTTP-Referer": "http://localhost:3000",
          "X-Title": "FutureValidate MVP",
        },
        body: JSON.stringify({
          model: "google/gemini-pro", // Use Gemini through OpenRouter
          messages: [
            {
              role: "system",
              content: "You are an expert startup analyst. Always respond with valid JSON format.",
            },
            {
              role: "user",
              content: prompt,
            },
          ],
          temperature: 0.7,
          max_tokens: 2000,
        }),
      })

      if (!response.ok) {
        throw new Error(`OpenRouter API error: ${response.statusText}`)
      }

      const data = await response.json()
      const content = data.choices[0]?.message?.content

      try {
        // Try to parse as JSON
        return NextResponse.json(JSON.parse(content))
      } catch {
        // If not valid JSON, return structured response based on agent type
        return NextResponse.json(getStructuredResponse(agent, content))
      }
    }

    // Fallback to mock responses (Gemini is handled in separate file)
    return NextResponse.json(getMockResponse(agent))
  } catch (error) {
    console.error("API error:", error)
    // Return mock response on error
    return NextResponse.json(getMockResponse(request.body?.agent || "summarizer"))
  }
}

function getMockResponse(agent: string) {
  switch (agent) {
    case "summarizer":
      return {
        core_problem: "Solving personal finance management and investment guidance",
        target_customer: "Millennials and Gen Z professionals aged 22-40",
        value_proposition: "AI-powered personalized financial insights and recommendations",
        key_differentiators: [
          "Machine learning algorithms",
          "Real-time insights",
          "Behavioral analysis",
          "Automated recommendations",
        ],
        market_category: "FinTech",
      }

    case "market_researcher":
      return {
        tam: {
          total_market: 124000000000,
          growth_rate: 12.5,
          year: 2024,
          currency: "USD",
        },
        sam: {
          serviceable_market: 45000000000,
          penetration_rate: 8.2,
          target_segments: ["millennials", "gen_z", "young_professionals"],
        },
        market_trends: {
          "2024": 124000000000,
          "2025": 139500000000,
          "2026": 156975000000,
          "2027": 176535000000,
          "2028": 198601250000,
        },
      }

    case "competitor_analyst":
      return {
        competitors: [
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
        competitive_advantage: "AI-powered personalization and behavioral insights",
        swot: {
          strengths: [
            "Advanced AI technology",
            "Personalization capabilities",
            "Real-time insights",
            "User-friendly interface",
          ],
          weaknesses: [
            "High customer acquisition cost",
            "Regulatory compliance complexity",
            "Need for significant investment",
            "Unproven market traction",
          ],
          opportunities: [
            "Growing fintech market",
            "Increasing financial literacy awareness",
            "Mobile-first generation",
            "Open banking regulations",
          ],
          threats: [
            "Established competitors",
            "Economic uncertainty",
            "Regulatory changes",
            "Changing consumer preferences",
          ],
        },
      }

    case "business_strategist":
      return {
        business_model:
          "Freemium SaaS model with premium AI features, white-label solutions for banks, and commission-based investment recommendations",
        revenue_streams: [
          "Monthly subscriptions ($9.99-$49.99)",
          "Premium AI features",
          "White-label licensing",
          "Investment commission (0.5-1%)",
        ],
        usp: "First AI-powered personal finance assistant that adapts to individual spending patterns and provides real-time behavioral insights",
        gtm_strategy:
          "Direct-to-consumer digital marketing, content-driven growth, and strategic partnerships with financial institutions",
        monetization: "Freemium model with 5-10% conversion rate to paid plans",
      }

    case "risk_assessor":
      return {
        viability_score: 8.5,
        risks: [
          "Regulatory changes in financial services",
          "Data privacy and security concerns",
          "Market saturation with existing solutions",
          "High customer acquisition costs",
        ],
        recommendations: [
          "Invest heavily in data security and compliance",
          "Build strategic partnerships with financial institutions",
          "Focus on superior AI differentiation",
          "Implement viral growth mechanisms",
        ],
        executive_summary:
          "This startup idea shows strong potential in a rapidly growing market. The AI-powered approach provides clear differentiation from existing solutions. Key success factors include robust data security, regulatory compliance, and superior AI personalization.",
      }

    default:
      return { error: "Unknown agent type" }
  }
}

function getStructuredResponse(agent: string, content: string) {
  // Convert unstructured content to structured response based on agent type
  return {
    raw_response: content,
    agent_type: agent,
    processed: true,
  }
}
