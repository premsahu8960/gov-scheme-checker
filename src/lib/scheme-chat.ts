import { schemes } from '@/data/schemes'
import type { ChatMessage, UserProfile } from '@/types'

function buildSchemeContext(locale: string) {
  return schemes.map((s) => ({
    id: s.id,
    name: locale === 'hi' ? s.nameHi : s.name,
    category: s.category,
    description: locale === 'hi' ? s.descriptionHi : s.description,
    benefits: locale === 'hi' ? s.benefitsHi : s.benefits,
    documents: locale === 'hi' ? s.documentsHi : s.documents,
    officialUrl: s.officialUrl,
    applyUrl: s.applyUrl,
    rules: s.rules,
  }))
}

function buildSystemPrompt(locale: string, profile?: UserProfile | null) {
  const schemeData = JSON.stringify(buildSchemeContext(locale), null, 2)
  const profileData = profile ? JSON.stringify(profile, null, 2) : 'Not provided'

  return `You are a helpful government scheme assistant for Indian citizens on scheme.gov.
Answer ONLY using the scheme data below.
If unsure, say you are not sure and share the official URL.
Never invent eligibility rules, amounts, or deadlines.
Respond in ${locale === 'hi' ? 'Hindi' : 'English'}.
Keep answers concise and practical.

User profile (if available):
${profileData}

Scheme data:
${schemeData}`
}

function getLocalReply(message: string, locale: string): string {
  const lower = message.toLowerCase()

  const matched = schemes.find(
    (s) =>
      lower.includes(s.slug.replace(/-/g, ' ')) ||
      lower.includes(s.name.toLowerCase()) ||
      lower.includes(s.id.replace(/-/g, ' ')),
  )

  if (matched) {
    const name = locale === 'hi' ? matched.nameHi : matched.name
    const docs = (locale === 'hi' ? matched.documentsHi : matched.documents).join(', ')
    return locale === 'hi'
      ? `${name}: ${matched.descriptionHi}\n\nदस्तावेज: ${docs}\n\nआवेदन: ${matched.applyUrl}\nआधिकारिक: ${matched.officialUrl}`
      : `${name}: ${matched.description}\n\nDocuments: ${docs}\n\nApply: ${matched.applyUrl}\nOfficial: ${matched.officialUrl}`
  }

  if (lower.includes('farmer') || lower.includes('kisan')) {
    const s = schemes.find((x) => x.id === 'pm-kisan')!
    return locale === 'hi'
      ? `किसानों के लिए ${s.nameHi} उपलब्ध है। आवेदन: ${s.applyUrl}`
      : `For farmers, check ${s.name}. Apply here: ${s.applyUrl}`
  }

  return locale === 'hi'
    ? 'कृपया योजना का नाम पूछें, या पात्रता जांच के लिए "Check Eligibility" पेज पर जाएं।'
    : 'Please ask about a specific scheme, or visit the Check Eligibility page for personalized results.'
}

export async function sendSchemeChatMessage(
  messages: ChatMessage[],
  locale: string,
  profile?: UserProfile | null,
): Promise<string> {
  const apiKey =
    import.meta.env.VITE_OPENROUTER_API_KEY ?? import.meta.env.VITE_GEMINI_API_KEY

  const lastUserMessage = [...messages].reverse().find((m) => m.role === 'user')
  if (!lastUserMessage) {
    return locale === 'hi' ? 'कृपया अपना प्रश्न लिखें।' : 'Please type your question.'
  }

  if (!apiKey) {
    return getLocalReply(lastUserMessage.content, locale)
  }

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'google/gemini-2.0-flash-001',
        messages: [
          { role: 'system', content: buildSystemPrompt(locale, profile) },
          ...messages.map((m) => ({ role: m.role, content: m.content })),
        ],
      }),
    })

    if (!response.ok) throw new Error('AI request failed')

    const data = (await response.json()) as {
      choices: { message: { content: string } }[]
    }

    return data.choices[0]?.message?.content ?? getLocalReply(lastUserMessage.content, locale)
  } catch {
    return getLocalReply(lastUserMessage.content, locale)
  }
}