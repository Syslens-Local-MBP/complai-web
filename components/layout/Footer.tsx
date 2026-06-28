import Link from 'next/link'
import { Shield } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t bg-white mt-auto">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 font-bold text-xl mb-3">
              <Shield className="h-5 w-5 text-[#003399]" />
              <span className="text-[#003399]">Compl</span><span className="text-[#FFCC00] -ml-1">AI</span>
            </div>
            <p className="text-sm text-gray-500 max-w-xs">
              Die smarte Plattform für EU AI Act Compliance. DSGVO-konform, gehostet in Frankfurt.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-sm mb-3">Produkt</h3>
            <ul className="space-y-2 text-sm text-gray-500">
              <li><Link href="/articles" className="hover:text-[#003399]">Artikel-Reader</Link></li>
              <li><Link href="/assessment" className="hover:text-[#003399]">Risiko-Assessment</Link></li>
              <li><Link href="/glossar" className="hover:text-[#003399]">Glossar</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-sm mb-3">Rechtliches</h3>
            <ul className="space-y-2 text-sm text-gray-500">
              <li><Link href="/datenschutz" className="hover:text-[#003399]">Datenschutz</Link></li>
              <li><Link href="/impressum" className="hover:text-[#003399]">Impressum</Link></li>
              <li><Link href="/agb" className="hover:text-[#003399]">AGB</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-gray-400">
          <p>© {new Date().getFullYear()} ComplAI. Alle Rechte vorbehalten.</p>
          <p>Gehostet in Frankfurt, EU · DSGVO-konform</p>
        </div>
      </div>
    </footer>
  )
}
