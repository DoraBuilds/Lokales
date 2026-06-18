'use client'

import { useState } from 'react'
import { SlidersHorizontal, X } from 'lucide-react'
import { SearchFilters } from './SearchFilters'

export function FiltersMobileWrapper({ locale }: { locale: string }) {
  const [open, setOpen] = useState(false)
  const isEs = locale === 'es'

  return (
    <>
      {/* Mobile toggle — hidden on lg+ */}
      <button
        onClick={() => setOpen(o => !o)}
        className="lg:hidden w-full flex items-center justify-between text-sm font-semibold border border-warm-border rounded-2xl px-5 py-3 bg-white hover:border-forest/40 hover:text-forest transition-colors"
      >
        <span className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4" />
          {isEs ? 'Filtros' : 'Filters'}
        </span>
        {open ? <X className="h-4 w-4" /> : <span className="text-xs text-ink-subtle">{isEs ? 'Toca para abrir' : 'Tap to open'}</span>}
      </button>

      {/* Filter panel — toggled on mobile, always visible on lg+ */}
      <div className={`${open ? 'block' : 'hidden'} lg:block bg-white rounded-3xl border border-warm-border p-6 lg:sticky lg:top-24`}>
        <div className="hidden lg:flex items-center gap-2 mb-6">
          <SlidersHorizontal className="h-4 w-4 text-forest" />
          <p className="text-sm font-semibold text-ink">{isEs ? 'Filtros' : 'Filters'}</p>
        </div>
        <SearchFilters locale={locale} />
      </div>
    </>
  )
}
