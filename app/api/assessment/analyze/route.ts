import { NextRequest } from 'next/server'
import { AssessmentAnswers, AssessmentResult } from '@/lib/assessment-logic'

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  const body = await request.json() as { answers: AssessmentAnswers; result: AssessmentResult }
  const { answers, result } = body

  // Build a detailed analysis based on the assessment
  const analysisText = generateAnalysis(answers, result)

  // Stream the response
  const encoder = new TextEncoder()
  const stream = new ReadableStream({
    async start(controller) {
      const chunks = analysisText.split(' ')
      for (let i = 0; i < chunks.length; i++) {
        const word = chunks[i] + (i < chunks.length - 1 ? ' ' : '')
        controller.enqueue(encoder.encode(word))
        // Small delay to simulate streaming
        await new Promise(resolve => setTimeout(resolve, 30))
      }
      controller.close()
    }
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Transfer-Encoding': 'chunked',
      'Cache-Control': 'no-cache',
    }
  })
}

function generateAnalysis(answers: AssessmentAnswers, result: AssessmentResult): string {
  const sectorLabels: Record<string, string> = {
    hr: 'Personalwesen (HR)',
    gesundheit: 'Gesundheitswesen',
    bildung: 'Bildung',
    justiz: 'Justiz und Rechtspflege',
    kredit: 'Kredit und Finanzdienstleistungen',
    biometrie: 'Biometrische Identifikation',
    kritis: 'Kritische Infrastruktur',
    transport: 'Transport und Mobilität',
    sonstige: 'Sonstige Bereiche'
  }

  const sectorLabel = sectorLabels[answers.sector] || answers.sector

  if (result.riskLevel === 'VERBOTEN') {
    return `## KI-Rechtsanalyse: ${answers.systemName}

### Bewertung
Das System "${answers.systemName}" ist nach aktueller Rechtslage nicht rechtmäßig betreibbar. Die identifizierten Merkmale fallen unter die absoluten Verbote des Artikel 5 EU AI Act, die seit dem 2. Februar 2025 in Kraft sind.

### Sofortige Maßnahmen (Priorität 1)
1. **Sofortiger Betriebsstopp**: Das System darf nicht in Betrieb genommen oder muss umgehend abgeschaltet werden. Verstöße können mit Bußgeldern von bis zu 35 Mio. EUR oder 7% des weltweiten Jahresumsatzes geahndet werden.
2. **Rechtliche Beratung**: Konsultieren Sie unverzüglich spezialisierte KI-Rechtsexperten zur Risikoabschätzung und möglicher Neugestaltung des Systems.
3. **Dokumentation**: Dokumentieren Sie alle Entscheidungen zum System für mögliche Behördenanfragen.

### Potenzielle Neugestaltung
Falls das Ziel des Systems grundlegend legitim ist, prüfen Sie: Kann das System so umgestaltet werden, dass die verbotenen Merkmale entfernt werden? Eine Neukonzeption erfordert eine vollständige Neubeurteilung.

### Rechtliche Unsicherheiten
Die Auslegung einiger Verbotstatbestände – insbesondere bei "subliminaler Beeinflussung" – ist noch nicht durch Behördenentscheidungen konkretisiert. Die nationalen Aufsichtsbehörden werden bis Ende 2025 weitere Leitlinien herausgeben.`
  }

  if (result.riskLevel === 'HOCHRISIKO') {
    return `## KI-Rechtsanalyse: ${answers.systemName}

### Bewertung
Das KI-System "${answers.systemName}" im Bereich ${sectorLabel} ist als **Hochrisiko-KI-System** gemäß Artikel 6 i.V.m. Anhang III EU AI Act einzustufen. Dies ist die anspruchsvollste Compliance-Kategorie mit umfangreichen Pflichten.

### Top 3 Sofortige Maßnahmen
1. **Risikomanagementsystem einrichten (Art. 9)**: Beginnen Sie sofort mit dem Aufbau eines dokumentierten Risikomanagementsystems. Dies ist die Grundlage für alle weiteren Compliance-Maßnahmen und benötigt typischerweise 3-6 Monate.
2. **Technische Dokumentation starten (Art. 11)**: Erstellen Sie gemäß Anhang IV eine vollständige technische Dokumentation. Ohne diese ist eine Konformitätsbewertung nicht möglich.
3. **Datenverwaltungsprotokoll (Art. 10)**: Implementieren Sie Qualitätskriterien für alle verwendeten Datensätze und dokumentieren Sie die Herkunft und Qualität der Trainingsdaten.

### 30-Tage Umsetzungsplan
**Woche 1-2**: Projektteam für AI Act Compliance aufstellen; externen KI-Rechtsexperten beauftragen; Gap-Analyse durchführen.
**Woche 2-3**: Risikomanagementsystem-Vorlage entwickeln; Datendokumentation beginnen; technische Dokumentation strukturieren.
**Woche 3-4**: Erste Risikoanalyse durchführen; menschliche Aufsichtsmaßnahmen konzipieren; interne Schulungen planen.

### Potenzielle Fallstricke
- **Übergangsfristen nutzen**: Für bestehende Systeme gelten verlängerte Fristen bis August 2027 – aber nur wenn das System vor August 2026 bereits im Einsatz war.
- **Konformitätsbewertung**: Je nach Systemtyp ist entweder eine Eigenbewertung (Art. 43 Abs. 2) oder eine Drittpartei-Bewertung erforderlich.
- **EU-Datenbankregistrierung**: Hochrisiko-Systeme müssen in der EU-Datenbank registriert werden – dies ist nicht vergessen werden.

### Rechtliche Unsicherheiten
Die genaue Abgrenzung, welche Systeme im ${sectorLabel}-Bereich als "wesentliche Sicherheitskomponente" gelten, wird noch durch delegierte Rechtsakte der EU-Kommission konkretisiert. Erwarten Sie bis Q1 2026 weitere Leitlinien der europäischen KI-Behörde (AIDA).`
  }

  if (result.riskLevel === 'BEGRENZTES_RISIKO') {
    return `## KI-Rechtsanalyse: ${answers.systemName}

### Bewertung
Das KI-System "${answers.systemName}" unterliegt den **Transparenzpflichten** nach Artikel 50 EU AI Act. Diese sind deutlich weniger aufwendig als Hochrisiko-Anforderungen, aber seit August 2025 bindend.

### Top 3 Sofortige Maßnahmen
1. **Transparenzhinweise implementieren (Art. 50)**: Nutzer müssen klar und deutlich informiert werden, wenn sie mit einem KI-System interagieren. Für Chatbots gilt dies unmittelbar.
2. **Kennzeichnung KI-generierter Inhalte**: Bilder, Videos und Audios, die von KI generiert wurden, müssen als solche gekennzeichnet werden. Implementieren Sie entsprechende Wasserzeichen oder Metadaten.
3. **DSGVO-Kompatibilität prüfen**: Auch ohne spezifische Hochrisiko-Pflichten gelten weiterhin DSGVO-Anforderungen, die sorgfältig eingehalten werden müssen.

### 30-Tage Umsetzungsplan
**Woche 1**: Rechtliche Anforderungen nach Art. 50 dokumentieren; UI/UX-Änderungen für Transparenzhinweise planen.
**Woche 2**: Implementierung der Nutzhinweise; technische Lösung für Inhaltskennzeichnung auswählen.
**Woche 3-4**: Testing und Qualitätssicherung; interne Dokumentation der Compliance-Maßnahmen.

### Potenzielle Fallstricke
- **Deepfakes**: Besondere Vorsicht bei realistischen Personendarstellungen – hier gelten verschärfte Kennzeichnungspflichten.
- **Grenzfall Hochrisiko**: Prüfen Sie regelmäßig, ob Änderungen am System eine Neueinstufung erfordern.

### Rechtliche Unsicherheiten
Die technischen Standards für Wasserzeichen und Kennzeichnungen werden noch durch die europäische KI-Behörde festgelegt. Verfolgen Sie die Entwicklung unter https://digital-strategy.ec.europa.eu/en/policies/european-approach-artificial-intelligence`
  }

  return `## KI-Rechtsanalyse: ${answers.systemName}

### Bewertung
Das KI-System "${answers.systemName}" weist **minimale Risiken** auf und unterliegt keinen spezifischen Pflichten des EU AI Acts. Dennoch empfehlen wir proaktive Maßnahmen.

### Top 3 Sofortige Maßnahmen
1. **DSGVO-Compliance sicherstellen**: Auch ohne AI-Act-Pflichten gelten weiterhin Datenschutzvorschriften, die lückenlos eingehalten werden müssen.
2. **Freiwillige Verhaltenskodizes prüfen (Art. 69)**: Betrachten Sie den Beitritt zu freiwilligen Verhaltenskodizes als Vertrauenssignal gegenüber Kunden und Partnern.
3. **Monitoring der Rechtslage**: Das regulatorische Umfeld entwickelt sich – bleiben Sie informiert über mögliche Neueinstufungen Ihres Systems.

### 30-Tage Umsetzungsplan
**Woche 1-2**: Interne AI-Governance-Richtlinie entwickeln; DSGVO-Datenschutzfolgenabschätzung durchführen falls noch nicht erfolgt.
**Woche 3-4**: Team zu AI Act sensibilisieren; freiwillige Best Practices implementieren.

### Potenzielle Fallstricke
- **Zukünftige Kategorisierungen**: Der AI Act sieht regelmäßige Überprüfungen der Hochrisiko-Listen vor. Beobachten Sie delegierte Rechtsakte der Kommission.
- **Sektorale Regulierung**: Zusätzlich zum AI Act können sektorale Vorschriften (z.B. Medizinprodukte-Verordnung, Finanzmarktregulierung) relevant sein.

### Fazit
Nutzen Sie die Chance, KI-Governance als Wettbewerbsvorteil zu positionieren. Unternehmen mit robusten AI-Governance-Strukturen genießen zunehmendes Vertrauen bei Kunden und Investoren.`
}
