import { createGroq } from "@ai-sdk/groq"
import { generateText, streamText } from "ai"

// Initialize Groq client
const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY,
})

// System prompts for different AI features
export const SYSTEM_PROMPTS = {
  tutor: `You are an AI tutor for Bermi Rocket, a youth empowerment platform focused on entrepreneurship and business education. You help young entrepreneurs learn:

- Business fundamentals and strategy
- AI basics and applications
- Product development and creation
- Financial literacy and management
- Marketing and customer acquisition
- Leadership and team building

Your personality:
- Encouraging and supportive
- Use space/rocket metaphors occasionally (mission, launch, orbit, etc.)
- Practical and actionable advice
- Age-appropriate for young adults (18-25)
- Focus on African and global entrepreneurship contexts

Keep responses concise but informative. Always ask follow-up questions to engage the learner.`,

  financial_coach: `You are PESA Coach, an AI financial advisor for young entrepreneurs in the Bermi Rocket platform. You provide:

- Budgeting and expense tracking guidance
- Savings strategies and goal setting
- Investment basics for beginners
- Business financial planning
- Mobile money and digital payment insights
- Financial literacy education

Focus on practical, actionable advice suitable for young entrepreneurs, especially in African markets. Use simple language and provide specific examples.`,

  business_advisor: `You are a business advisor AI for Bermi Rocket, helping young entrepreneurs with:

- Business plan development
- Market research and validation
- Product development strategies
- Scaling and growth tactics
- Team building and leadership
- Funding and investment guidance

Provide practical, actionable advice with real-world examples. Focus on lean startup methodologies and bootstrapping strategies suitable for young entrepreneurs.`,

  opportunity_matcher: `You are an opportunity matching AI for Bermi Rocket. You help users find relevant:

- Job opportunities matching their skills
- Internship programs
- Scholarships and grants
- Business competitions
- Networking events
- Learning opportunities

Analyze user profiles, skills, and interests to provide personalized recommendations. Be specific about requirements and application processes.`,
}

// Generate AI response for tutoring
export async function generateTutorResponse(
  message: string,
  conversationHistory: Array<{ role: "user" | "assistant"; content: string }> = [],
) {
  try {
    const { text } = await generateText({
      model: groq("llama-3.1-70b-versatile"),
      system: SYSTEM_PROMPTS.tutor,
      messages: [...conversationHistory, { role: "user", content: message }],
      maxTokens: 500,
      temperature: 0.7,
    })

    return text
  } catch (error) {
    console.error("Error generating tutor response:", error)
    return "I'm having trouble connecting to my knowledge base right now. Please try again in a moment, and I'll be ready to help you with your entrepreneurial journey!"
  }
}

// Stream AI response for real-time chat
export async function streamTutorResponse(
  message: string,
  conversationHistory: Array<{ role: "user" | "assistant"; content: string }> = [],
) {
  try {
    const result = await streamText({
      model: groq("llama-3.1-70b-versatile"),
      system: SYSTEM_PROMPTS.tutor,
      messages: [...conversationHistory, { role: "user", content: message }],
      maxTokens: 500,
      temperature: 0.7,
    })

    return result
  } catch (error) {
    console.error("Error streaming tutor response:", error)
    throw error
  }
}

// Generate financial insights
export async function generateFinancialInsights(userData: {
  expenses?: Array<{ amount: number; category: string; date: string }>
  goals?: Array<{ title: string; target_amount: number; current_amount: number }>
  income?: number
  currency?: string
}) {
  try {
    const context = `User financial data:
- Monthly expenses: ${userData.expenses?.length || 0} transactions
- Financial goals: ${userData.goals?.length || 0} active goals
- Currency: ${userData.currency || "USD"}
- Recent spending categories: ${
      userData.expenses
        ?.slice(0, 5)
        .map((e) => e.category)
        .join(", ") || "None"
    }
`

    const { text } = await generateText({
      model: groq("llama-3.1-70b-versatile"),
      system: SYSTEM_PROMPTS.financial_coach,
      prompt: `${context}

Provide 3-4 personalized financial insights and actionable recommendations for this young entrepreneur. Focus on practical advice for improving their financial health and achieving their goals.`,
      maxTokens: 400,
      temperature: 0.6,
    })

    return text
  } catch (error) {
    console.error("Error generating financial insights:", error)
    return "I'm analyzing your financial patterns to provide personalized insights. Please check back in a moment for your customized recommendations!"
  }
}

// Generate business plan assistance
export async function generateBusinessPlanSection(section: string, businessIdea: string, userContext?: string) {
  try {
    const { text } = await generateText({
      model: groq("llama-3.1-70b-versatile"),
      system: SYSTEM_PROMPTS.business_advisor,
      prompt: `Help create the "${section}" section of a business plan for this idea: "${businessIdea}"

${userContext ? `Additional context: ${userContext}` : ""}

Provide a detailed, practical section that a young entrepreneur can use. Include specific examples and actionable steps.`,
      maxTokens: 600,
      temperature: 0.7,
    })

    return text
  } catch (error) {
    console.error("Error generating business plan section:", error)
    return `I'm working on generating insights for your ${section} section. Please try again in a moment for detailed guidance on developing this part of your business plan.`
  }
}

// Match opportunities to user profile
export async function matchOpportunities(
  userProfile: {
    skills?: string[]
    interests?: string[]
    location?: string
    experience_level?: string
  },
  opportunities: Array<{ title: string; description: string; requirements: string[]; type: string }>,
) {
  try {
    const profileContext = `User Profile:
- Skills: ${userProfile.skills?.join(", ") || "Not specified"}
- Interests: ${userProfile.interests?.join(", ") || "Not specified"}
- Location: ${userProfile.location || "Not specified"}
- Experience Level: ${userProfile.experience_level || "Beginner"}
`

    const opportunitiesContext = opportunities
      .map((opp, index) => `${index + 1}. ${opp.title} (${opp.type}): ${opp.description.substring(0, 100)}...`)
      .join("\n")

    const { text } = await generateText({
      model: groq("llama-3.1-70b-versatile"),
      system: SYSTEM_PROMPTS.opportunity_matcher,
      prompt: `${profileContext}

Available Opportunities:
${opportunitiesContext}

Analyze the user's profile and rank the top 3-5 most relevant opportunities. Explain why each opportunity is a good match and provide specific advice on how to apply or prepare.`,
      maxTokens: 500,
      temperature: 0.6,
    })

    return text
  } catch (error) {
    console.error("Error matching opportunities:", error)
    return "I'm analyzing the best opportunities for your profile. Please check back in a moment for personalized recommendations!"
  }
}

// Generate learning path recommendations
export async function generateLearningPath(userGoals: string, currentSkills: string[], interests: string[]) {
  try {
    const { text } = await generateText({
      model: groq("llama-3.1-70b-versatile"),
      system: SYSTEM_PROMPTS.tutor,
      prompt: `Create a personalized learning path for a young entrepreneur with these details:

Goals: ${userGoals}
Current Skills: ${currentSkills.join(", ")}
Interests: ${interests.join(", ")}

Provide a structured 4-6 step learning path with:
1. Specific modules or topics to focus on
2. Estimated time commitment
3. Practical projects or exercises
4. Resources or next steps

Make it actionable and motivating for a young entrepreneur.`,
      maxTokens: 600,
      temperature: 0.7,
    })

    return text
  } catch (error) {
    console.error("Error generating learning path:", error)
    return "I'm crafting a personalized learning journey for you. Please try again in a moment for your customized roadmap to success!"
  }
}
