import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })

export const metadata: Metadata = {
  title: "ComplAI – EU AI Act Compliance",
  description: "Die smarte Plattform für EU AI Act Compliance. Verstehen, analysieren, handeln – bevor der Countdown abläuft.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://complai.ai-workx.de"),
  openGraph: {
    title: "ComplAI – EU AI Act Compliance",
    description: "EU AI Act Compliance leicht gemacht. Deadline: 2. August 2026.",
    type: "website",
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" className={inter.variable}>
      <body className="min-h-screen bg-[#FAFAFA] text-[#1A1A2E] antialiased">
        {children}
      </body>
    </html>
  )
}
