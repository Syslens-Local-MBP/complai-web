# ComplAI — EU AI Act Compliance Platform

> **Status: Archiviert (Juni 2026)** — Proof of Concept, vollständig funktional.

Live unter: https://complai.ai-workx.de  
GitHub: https://github.com/Syslens-Local-MBP/complai-web

---

## Was ist ComplAI?

Feature-reiche Alternative zum offiziellen EU AI Act Explorer, gebaut als 24h-Proof-of-Concept. Zielgruppe: Juristen, Compliance-Beauftragte, KI-Entwickler und Einsteiger.

## Features

- **172 EU AI Act Artikel** — vollständiger Gesetzestext mit vereinfachten Erklärungen
- **Multi-Persona-Ansicht** — Legal, Business, Developer, Learner
- **KI-Risikoklassifizierung** — 6-Schritt-Wizard mit KI-Tiefenanalyse (OpenRouter/Claude)
- **Gamification** — 7 Level, 12 Badges, Streaks, 25-Fragen-Quiz
- **Volltextsuche** — Fuse.js clientseitig
- **Lernpfade** — 6 kuratierte Pfade
- **Glossar** — 33 Fachbegriffe mit Kategorien
- **Cloudflare Access OTP** — Zugang nur per E-Mail-OTP

## Tech-Stack

| Schicht | Technologie |
|---------|-------------|
| Framework | Next.js 16.2.9, Turbopack, App Router |
| Sprache | TypeScript (strict) |
| UI | shadcn/ui + Tailwind CSS |
| Auth | Supabase (Frankfurt) |
| KI-Analyse | OpenRouter → claude-sonnet-4-6 |
| E-Mail | Resend (noreply@syslens.app) |
| Hosting | Vercel Frankfurt (fra1) |
| DNS/Access | Cloudflare Zero Trust OTP |
| Suche | Fuse.js v7 |

## Infrastruktur

```
complai.ai-workx.de
  → Cloudflare Access OTP (info@ai-workx.de, lawrence.tjia@gmail.com)
  → Cloudflare DNS CNAME
  → Vercel (fra1, infosyslens-7649s-projects)
  → Next.js App
  → Supabase (souglqczzqmccvayzxqr.supabase.co, Frankfurt)
```

## Lokale Entwicklung

```bash
# ENV-Vars benötigt (siehe .env.example)
cp .env.example .env.local
# Werte eintragen: Supabase Anon Key, OpenRouter Key, Resend Key

npm install
npm run dev
```

## Vercel Deployment

```bash
vercel link --project complai-web
vercel --prod
```

## Supabase Schema

SQL in `supabase/schema.sql` ausführen (Supabase Studio → SQL Editor).

## Archiv-Hinweis

Dieses Projekt wurde als Proof-of-Concept in 24 Stunden entwickelt und anschließend archiviert.  
Die Cloudflare Access App (`complai.ai-workx.de`) ist deaktiviert — für ähnliche Produkte wiederverwendbar.

**Fehlende ENV-Vars für volle Funktion:**
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Supabase Dashboard → Project Settings → API
- `SUPABASE_SERVICE_ROLE_KEY` — gleiche Stelle
