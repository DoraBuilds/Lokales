'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { Search, X, Building2 } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

const TYPE_OPTIONS = [
  { value: '',          label: 'All types',  labelEs: 'Todos' },
  { value: 'long_term', label: 'Long-term',  labelEs: 'Largo plazo' },
  { value: 'popup',     label: 'Pop-up',     labelEs: 'Pop-up' },
  { value: 'marketing', label: 'Marketing',  labelEs: 'Marketing' },
]

interface Suggestion { id: string; name: string; city: string }

export function SearchFilters({ locale }: { locale: string }) {
  const isEs = locale === 'es'
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [q, setQ] = useState(searchParams.get('q') ?? '')
  const [suggestions, setSuggestions]       = useState<Suggestion[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const searchContainerRef = useRef<HTMLDivElement>(null)
  const suggestDebounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node))
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
      .or(`name.ilike.%${safe}%,city.ilike.%${safe}%`)
      .order('name')
      .limit(6)
    if (data?.length) { setSuggestions(data); setShowSuggestions(true) }
    else { setSuggestions([]); setShowSuggestions(false) }
  }, [])

  const updateParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (value) {
        params.set(key, value)
      } else {
        params.delete(key)
      }
      router.push(`${pathname}?${params.toString()}`)
    },
    [pathname, router, searchParams]
  )

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    updateParam('q', q)
  }

  function clearAll() {
    setQ('')
    router.push(pathname)
  }

  const activeType = searchParams.get('type') ?? ''
  const hasFilters = !!(searchParams.get('q') || searchParams.get('type') || searchParams.get('size_min') || searchParams.get('price_max') || searchParams.get('sort'))

  return (
    <div className="space-y-6">

      {/* Text search with autocomplete */}
      <div ref={searchContainerRef} className="relative">
        <form onSubmit={handleSearch} className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-subtle pointer-events-none" />
          <input
            value={q}
            onChange={(e) => {
              setQ(e.target.value)
              clearTimeout(suggestDebounceRef.current)
              suggestDebounceRef.current = setTimeout(() => fetchSuggestions(e.target.value), 280)
            }}
            onFocus={() => { if (suggestions.length > 0) setShowSuggestions(true) }}
            placeholder={isEs ? 'Ciudad o centro comercial…' : 'City or shopping center…'}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-warm-border bg-white text-sm text-ink placeholder:text-ink-subtle focus:outline-none focus:ring-2 focus:ring-forest/10 focus:border-forest/50 transition-colors"
          />
          {q && (
            <button type="button" onClick={() => { setQ(''); updateParam('q', ''); setSuggestions([]); setShowSuggestions(false) }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-subtle hover:text-ink">
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </form>

        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute z-50 left-0 right-0 mt-1 bg-white border border-warm-border rounded-2xl shadow-lg overflow-hidden">
            {suggestions.map(s => (
              <button key={s.id} type="button"
                onClick={() => {
                  setQ(s.name)
                  setShowSuggestions(false)
                  updateParam('q', s.name)
                }}
                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-left hover:bg-stone transition-colors border-b border-warm-border/40 last:border-0">
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

      {/* Type filter */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-ink-subtle mb-3">
          {isEs ? 'Tipo de alquiler' : 'Rental type'}
        </p>
        <div className="flex flex-col gap-2">
          {TYPE_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => updateParam('type', opt.value)}
              className={`text-left px-3.5 py-2 rounded-xl text-sm font-medium transition-colors ${
                activeType === opt.value
                  ? 'bg-forest text-white'
                  : 'text-ink hover:bg-stone'
              }`}
            >
              {isEs ? opt.labelEs : opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Size filter */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-ink-subtle mb-3">
          {isEs ? 'Superficie mínima (m²)' : 'Min size (m²)'}
        </p>
        <select
          value={searchParams.get('size_min') ?? ''}
          onChange={(e) => updateParam('size_min', e.target.value)}
          className="w-full px-3.5 py-2.5 rounded-xl border border-warm-border bg-white text-sm text-ink focus:outline-none focus:ring-2 focus:ring-forest/10 focus:border-forest/50"
        >
          <option value="">{isEs ? 'Sin mínimo' : 'No minimum'}</option>
          <option value="20">20 m²</option>
          <option value="50">50 m²</option>
          <option value="100">100 m²</option>
          <option value="200">200 m²</option>
          <option value="500">500 m²</option>
        </select>
      </div>

      {/* Max price (monthly) */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-ink-subtle mb-3">
          {isEs ? 'Precio máximo (€/mes)' : 'Max price (€/mo)'}
        </p>
        <select
          value={searchParams.get('price_max') ?? ''}
          onChange={(e) => updateParam('price_max', e.target.value)}
          className="w-full px-3.5 py-2.5 rounded-xl border border-warm-border bg-white text-sm text-ink focus:outline-none focus:ring-2 focus:ring-forest/10 focus:border-forest/50"
        >
          <option value="">{isEs ? 'Sin máximo' : 'No maximum'}</option>
          <option value="1000">€1,000</option>
          <option value="2500">€2,500</option>
          <option value="5000">€5,000</option>
          <option value="10000">€10,000</option>
          <option value="25000">€25,000</option>
        </select>
      </div>

      {/* Sort */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-ink-subtle mb-3">
          {isEs ? 'Ordenar por' : 'Sort by'}
        </p>
        <select
          value={searchParams.get('sort') ?? ''}
          onChange={(e) => updateParam('sort', e.target.value)}
          className="w-full px-3.5 py-2.5 rounded-xl border border-warm-border bg-white text-sm text-ink focus:outline-none focus:ring-2 focus:ring-forest/10 focus:border-forest/50"
        >
          <option value="">{isEs ? 'Más recientes' : 'Newest first'}</option>
          <option value="price_asc">{isEs ? 'Precio: menor primero' : 'Price: low to high'}</option>
          <option value="price_desc">{isEs ? 'Precio: mayor primero' : 'Price: high to low'}</option>
          <option value="size_asc">{isEs ? 'Superficie: menor primero' : 'Size: small to large'}</option>
          <option value="size_desc">{isEs ? 'Superficie: mayor primero' : 'Size: large to small'}</option>
        </select>
      </div>

      {/* Clear all */}
      {hasFilters && (
        <button
          onClick={clearAll}
          className="w-full text-sm font-medium text-ink-muted hover:text-ink flex items-center justify-center gap-2 py-2 rounded-xl hover:bg-stone transition-colors"
        >
          <X className="h-3.5 w-3.5" />
          {isEs ? 'Borrar filtros' : 'Clear filters'}
        </button>
      )}
    </div>
  )
}
