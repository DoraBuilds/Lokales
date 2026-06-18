'use client'

import { useRouter } from 'next/navigation'
import { Search, MapPin, Building2 } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

interface Suggestion { id: string; name: string; city: string }

interface HeroSearchProps {
  locale: string
  searchButtonLabel: string
}

export function HeroSearch({ locale, searchButtonLabel }: HeroSearchProps) {
  const isEs = locale === 'es'
  const router = useRouter()

  const [q, setQ] = useState('')
  const [type, setType] = useState('')
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)

  const containerRef = useRef<HTMLDivElement>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node))
        setShowSuggestions(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const fetchSuggestions = useCallback(async (value: string) => {
    if (value.trim().length < 2) { setSuggestions([]); setShowSuggestions(false); return }
    const supabase = createClient()
    const safe = value.trim().replace(/[%_]/g, '\\$&')
    const { data } = await supabase
      .from('shopping_centers')
      .select('id, name, city')
      .or(`name.ilike.%${safe}%,city.ilike.%${safe}%,province.ilike.%${safe}%`)
      .order('name')
      .limit(6)
    if (data?.length) { setSuggestions(data); setShowSuggestions(true); setActiveIndex(-1) }
    else { setSuggestions([]); setShowSuggestions(false) }
  }, [])

  function navigate(query: string) {
    const params = new URLSearchParams()
    if (query) params.set('q', query)
    if (type)  params.set('type', type)
    router.push(`/${locale}/search?${params.toString()}`)
    setShowSuggestions(false)
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const selected = activeIndex >= 0 ? suggestions[activeIndex].name : q
    navigate(selected)
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (!showSuggestions || suggestions.length === 0) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIndex(i => Math.min(i + 1, suggestions.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIndex(i => Math.max(i - 1, -1))
    } else if (e.key === 'Escape') {
      setShowSuggestions(false)
      setActiveIndex(-1)
    }
  }

  return (
    <div ref={containerRef} className="relative max-w-2xl mx-auto">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col sm:flex-row items-stretch bg-white rounded-2xl sm:rounded-full shadow-xl border border-warm-border overflow-hidden"
      >
        {/* Location input */}
        <div className="flex-1 flex items-center gap-3 px-5 py-3.5 border-b sm:border-b-0 sm:border-r border-warm-border">
          <MapPin className="h-4 w-4 text-ink-subtle flex-shrink-0" />
          <div className="text-left min-w-0 w-full">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-ink-subtle">
              {isEs ? 'Ciudad o centro' : 'City or mall'}
            </p>
            <input
              value={q}
              onChange={(e) => {
                setQ(e.target.value)
                clearTimeout(debounceRef.current)
                debounceRef.current = setTimeout(() => fetchSuggestions(e.target.value), 280)
              }}
              onFocus={() => { if (suggestions.length > 0) setShowSuggestions(true) }}
              onKeyDown={handleKeyDown}
              placeholder={isEs ? 'Madrid, El Corte Inglés...' : 'Barcelona, La Maquinista...'}
              className="w-full text-sm text-ink bg-transparent outline-none placeholder:text-ink-subtle font-medium"
              autoComplete="off"
            />
          </div>
        </div>

        {/* Type select */}
        <div className="flex-shrink-0 flex items-center gap-3 px-5 py-3.5 border-b sm:border-b-0 sm:border-r border-warm-border">
          <div className="text-left">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-ink-subtle">
              {isEs ? 'Tipo' : 'Type'}
            </p>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="text-sm text-ink bg-transparent outline-none font-medium cursor-pointer appearance-none"
            >
              <option value="">{isEs ? 'Todos' : 'All types'}</option>
              <option value="long_term">{isEs ? 'Largo plazo' : 'Long-term'}</option>
              <option value="popup">Pop-up</option>
              <option value="marketing">{isEs ? 'Marketing' : 'Marketing'}</option>
            </select>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="flex items-center justify-center gap-2 bg-forest hover:bg-forest-mid text-white font-semibold text-sm px-8 py-4 transition-colors flex-shrink-0"
        >
          <Search className="h-4 w-4" />
          {searchButtonLabel}
        </button>
      </form>

      {/* Suggestions dropdown — sits outside the form so it isn't clipped by overflow-hidden */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-50 left-0 right-0 mt-2 bg-white border border-warm-border rounded-2xl shadow-lg overflow-hidden">
          {suggestions.map((s, i) => (
            <button
              key={s.id}
              type="button"
              onMouseEnter={() => setActiveIndex(i)}
              onClick={() => { setQ(s.name); navigate(s.name) }}
              className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-left transition-colors border-b border-warm-border/40 last:border-0 ${
                i === activeIndex ? 'bg-stone' : 'hover:bg-stone'
              }`}
            >
              <Building2 className="h-3.5 w-3.5 text-forest flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-ink leading-snug">{s.name}</p>
                <p className="text-xs text-ink-muted">{s.city}</p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
