import { NextRequest } from 'next/server'
import OpenAI from 'openai'
import { AssessmentAnswers, AssessmentResult } from '@/lib/assessment-logic'

export const runtime = 'nodejs'

const SECTOR_LABELS: Record<string, string> = {
  hr: 'Personalwesen (HR)',
  gesundheit: 'Gesundheitswesen',
  bildung: 'Bildung',
  justiz: 'Justiz und Rechtspflege',
  kredit: 'Kredit und Finanzdienstleistungen',
  biometrie: 'Biometrische Identifikation',
  kritis: 'Kritische Infrastruktur',
  transport: 'Transport und Mobilität',
  sonstige: 'Sonstige Bereiche',
}

const RISK_LEVEL_CONTEXT: Record<string, string> = {
  VERBOTEN: 'Das System fällt unter die absoluten Verbote von Artikel 5 EU AI Act (in Kraft seit 2. Februar 2025). Maximale Bußgelder: 35 Mio. EUR oder 7% des weltweiten Jahresumsatzes.',
  HOCHRISIKO: 'Das System ist als Hochrisiko-KI nach Artikel 6 i.V.m. Anhang III EU AI Act einzustufen. Es gelten umfangreiche Pflichten aus den Artikeln 9-16.',
  BEGRENZTES_RISIKO: 'Das System unterliegt den Transparenzpflichten nach Artikel 50 EU AI Act (bindend seit August 2025).',
  MINIMAL: 'Das System weist minimale Risiken auf und unterliegt keinen spezifischen AI-Act-Pflichten.',
}

export async function POST(request: NextRequest) {
  const body = await request.json() as { answers: AssessmentAnswers; result: AssessmentResult }
  const { answers, result } = body

  const apiKey = process.env.OPENROUTER_API_KEY
  if (!apiKey) {
    return new Response('OpenRouter API key nicht konfiguriert', { status: 500 })
  }

  const client = new OpenAI({
    baseURL: 'https://openrouter.ai/api/v1',
    apiKey,
    defaultHeaders: {
      'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL ?? 'https://complai.ai-workx.de',
      'X-Title': 'ComplAI — EU AI Act Compliance',
    },
  })

  const sectorLabel = SECTOR_LABELS[answers.sector] ?? answers.sector
  const riskContext = RISK_LEVEL_CONTEXT[result.riskLevel] ?? ''
  const requirementsSummary = result.requirements
    .map(r => `- ${r.article}: ${r.title} (${r.met ? 'erfüllt' : 'nicht erfüllt'})`)
    .join('\n')

  const prompt = `Du bist ein spezialisierter EU AI Act Compliance-Experte. Erstelle eine präzise, strukturierte Rechtsanalyse auf Deutsch.

**KI-System:** ${answers.systemName}
**Einsatzbereich:** ${sectorLabel}
**Beschreibung:** ${answers.systemDescription}
**Verwendungsart:** ${answers.usageType}
**Einstufung:** ${result.riskLevel}
**Rechtliche Einordnung:** ${riskContext}
**Compliance-Stand (${result.requirements.filter(r => r.met).length}/${result.requirements.length} Anforderungen erfüllt):**
${requirementsSummary}

Erstelle eine Analyse mit folgenden Abschnitten in Markdown:
1. **Bewertung** — 2-3 Sätze zur rechtlichen Einordnung
2. **Top 3 Sofortige Maßnahmen** — konkrete, priorisierte Handlungsempfehlungen
3. **30-Tage Umsetzungsplan** — wochenweise Maßnahmen
4. **Potenzielle Fallstricke** — spezifisch für dieses System und diese Branche
5. **Rechtliche Unsicherheiten** — offene Punkte, delegierte Rechtsakte, Leitlinien

Sei konkret, praxisorientiert und zitiere relevante Artikel. Keine allgemeinen Phrasen.`

  const stream = await client.chat.completions.create({
    model: 'anthropic/claude-sonnet-4-6',
    messages: [{ role: 'user', content: prompt }],
    stream: true,
    max_tokens: 1500,
    temperature: 0.3,
  })

  const encoder = new TextEncoder()
  const readable = new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of stream) {
          const text = chunk.choices[0]?.delta?.content ?? ''
          if (text) {
            controller.enqueue(encoder.encode(text))
          }
        }
      } finally {
        controller.close()
      }
    },
    cancel() {
      stream.controller.abort()
    },
  })

  return new Response(readable, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Transfer-Encoding': 'chunked',
      'Cache-Control': 'no-cache',
    },
  })
}
