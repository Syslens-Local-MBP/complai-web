import { NextRequest } from 'next/server'
import { AssessmentAnswers, AssessmentResult, ComplianceRequirement } from '@/lib/assessment-logic'

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

const RISK_CONTEXT: Record<string, string> = {
  VERBOTEN: 'Fällt unter absolute Verbote (Art. 5 EU AI Act, seit 2. Feb. 2025). Max. Bußgeld: 35 Mio. EUR oder 7% Jahresumsatz.',
  HOCHRISIKO: 'Hochrisiko-KI nach Art. 6 i.V.m. Anhang III EU AI Act. Umfangreiche Pflichten nach Art. 9–16.',
  BEGRENZTES_RISIKO: 'Transparenzpflichten nach Art. 50 EU AI Act (seit Aug. 2025).',
  MINIMAL: 'Minimale Risiken, keine spezifischen AI-Act-Pflichten.',
}

export async function POST(request: NextRequest) {
  const body = await request.json() as { answers: AssessmentAnswers; result: AssessmentResult }
  const { answers, result } = body

  const apiKey = process.env.OPENROUTER_API_KEY
  if (!apiKey) {
    return new Response('API key nicht konfiguriert', { status: 500 })
  }

  const sectorLabel = SECTOR_LABELS[answers.sector] ?? answers.sector
  const riskContext = RISK_CONTEXT[result.riskLevel] ?? ''
  const requirementsSummary = result.requirements
    .map((r: ComplianceRequirement) => `- ${r.articleRef}: ${r.title} (${r.mandatory ? 'Pflicht' : 'Empfohlen'})`)
    .join('\n')

  const prompt = [
    'Du bist ein EU AI Act Compliance-Experte. Erstelle eine präzise Rechtsanalyse auf Deutsch.',
    '',
    `KI-System: ${answers.systemName}`,
    `Einsatzbereich: ${sectorLabel}`,
    `Beschreibung: ${answers.systemDescription}`,
    `Einstufung: ${result.riskLevel}`,
    `Rechtlich: ${riskContext}`,
    `Anforderungen (${result.requirements.length} relevant):`,
    requirementsSummary,
    '',
    'Erstelle Analyse mit diesen Abschnitten in Markdown:',
    '1. **Bewertung** — 2-3 Sätze zur rechtlichen Einordnung',
    '2. **Top 3 Sofortige Maßnahmen** — konkrete, priorisierte Empfehlungen',
    '3. **30-Tage Umsetzungsplan** — wochenweise Maßnahmen',
    '4. **Potenzielle Fallstricke** — spezifisch für dieses System',
    '5. **Rechtliche Unsicherheiten** — offene Punkte, delegierte Rechtsakte',
    '',
    'Sei konkret, praxisorientiert, zitiere Artikel. Keine allgemeinen Phrasen.',
  ].join('\n')

  const upstream = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL ?? 'https://complai.ai-workx.de',
      'X-Title': 'ComplAI',
    },
    body: JSON.stringify({
      model: 'anthropic/claude-sonnet-4-6',
      messages: [{ role: 'user', content: prompt }],
      stream: true,
      max_tokens: 1500,
      temperature: 0.3,
    }),
  })

  if (!upstream.ok || !upstream.body) {
    const err = await upstream.text().catch(() => upstream.statusText)
    return new Response(`OpenRouter Fehler: ${err}`, { status: 502 })
  }

  // SSE → reiner Text-Stream für den Client
  const encoder = new TextEncoder()
  const readable = new ReadableStream({
    async start(controller) {
      const reader = upstream.body!.getReader()
      const decoder = new TextDecoder()
      let buffer = ''
      try {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          buffer += decoder.decode(value, { stream: true })
          const lines = buffer.split('\n')
          buffer = lines.pop() ?? ''
          for (const line of lines) {
            if (!line.startsWith('data: ')) continue
            const data = line.slice(6).trim()
            if (data === '[DONE]') continue
            try {
              const json = JSON.parse(data) as { choices?: Array<{ delta?: { content?: string } }> }
              const text = json.choices?.[0]?.delta?.content
              if (text) controller.enqueue(encoder.encode(text))
            } catch {
              // ungültiges JSON überspringen
            }
          }
        }
      } finally {
        controller.close()
      }
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
