'use client'

import { useState } from 'react'
import type { Article } from '@/data/ai-act-articles'

const TABS = [
  { id: 'content', label: 'Volltext' },
  { id: 'simplified', label: 'Vereinfacht' },
  { id: 'technical', label: 'Technisch' },
  { id: 'legalNote', label: 'Juristisch' },
] as const

type TabId = (typeof TABS)[number]['id']

export default function ArticleReader({ article }: { article: Article }) {
  const [activeTab, setActiveTab] = useState<TabId>('content')
  const [read, setRead] = useState(false)

  const content: Record<TabId, string> = {
    content: article.content,
    simplified: article.simplified,
    technical: article.technical,
    legalNote: article.legalNote,
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Tab bar */}
      <div className="flex border-b border-gray-100 bg-gray-50">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-3 text-sm font-medium transition-colors flex-1 ${
              activeTab === tab.id
                ? 'bg-white text-indigo-600 border-b-2 border-indigo-600'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap">
          {content[activeTab]}
        </div>
      </div>

      {/* Read button */}
      <div className="px-6 pb-6 pt-2 border-t border-gray-50 flex justify-end">
        <button
          onClick={() => setRead(true)}
          disabled={read}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            read
              ? 'bg-green-50 text-green-700 cursor-default'
              : 'bg-indigo-600 text-white hover:bg-indigo-700'
          }`}
        >
          {read ? `Gelesen (+${article.learningPoints} Punkte)` : 'Als gelesen markieren'}
        </button>
      </div>
    </div>
  )
}
