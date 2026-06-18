'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { Building2, Search, Loader2, X, Check, MapPin, ChevronRight, AlertCircle } from 'lucide-react'
import {
  searchShoppingCenters,
  findMallOnGoogle,
  confirmAndAddMall,
  type MallGooglePreview,
  type MallSearchResult,
} from '@/lib/shopping-center-actions'

export interface MallSelectResult {
  id: string
  name: string
  city: string
  province: string
  address: string
  glaSqm: string
}

interface Props {
  value: string
  scId: string
  locale: string
  onChange: (name: string) => void
  onMallSelect: (result: MallSelectResult) => void
  hasError?: boolean
}

export function MallAutocomplete({ value, scId, locale, onChange, onMallSelect, hasError }: Props) {
  const isEs = locale === 'es'
  const [results, setResults]           = useState<MallSearchResult[]>([])
  const [showDropdown, setShowDropdown] = useState(false)
  const [loading, setLoading]           = useState(false)
  const [googleMode, setGoogleMode]     = useState(false)
  const [googleQuery, setGoogleQuery]   = useState('')
  const [googleLoading, setGoogleLoading] = useState(false)
  const [googlePreview, setGooglePreview] = useState<MallGooglePreview | null>(null)
  const [googleError, setGoogleError]   = useState<'not_found' | 'api_error' | null>(null)
  const [adding, setAdding]             = useState(false)

  const containerRef = useRef<HTMLDivElement>(null)
  const debounceRef  = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const isConfirmed  = !!scId

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowDropdown(false)
        setGoogleMode(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const runSearch = useCallback(async (q: string) => {
    if (q.trim().length < 2) { setResults([]); setShowDropdown(false); return }
    setLoading(true)
    const data = await searchShoppingCenters(q)
    setResults(data)
    setShowDropdown(true)
    setLoading(false)
  }, [])

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const q = e.target.value
    onChange(q)
    if (scId) onMallSelect({ id: '', name: q, city: '', province: '', address: '', glaSqm: '' })
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => runSearch(q), 280)
  }

  function selectDbMall(mall: MallSearchResult) {
    setShowDropdown(false)
    setGoogleMode(false)
    onChange(mall.name)
    onMallSelect({
      id:       mall.id,
      name:     mall.name,
      city:     mall.city,
      province: mall.province,
      address:  mall.address,
      glaSqm:   mall.gla_sqm != null ? String(mall.gla_sqm) : '',
    })
  }

  async function handleGoogleSearch() {
    if (!googleQuery.trim()) return
    setGoogleLoading(true)
    setGooglePreview(null)
    setGoogleError(null)
    const result = await findMallOnGoogle(googleQuery)
    setGoogleLoading(false)
    if (!result) { setGoogleError('not_found'); return }
    setGooglePreview(result)
  }

  async function handleConfirmGoogle() {
    if (!googlePreview) return
    setAdding(true)
    const { mall, error } = await confirmAndAddMall(googlePreview.placeId)
    setAdding(false)
    if (!mall || error) { setGoogleError('api_error'); return }
    setShowDropdown(false)
    setGoogleMode(false)
    setGooglePreview(null)
    onChange(mall.name)
    onMallSelect({
      id:       mall.id,
      name:     mall.name,
      city:     mall.city,
      province: mall.province,
      address:  mall.address,
      glaSqm:   mall.gla_sqm != null ? String(mall.gla_sqm) : '',
    })
  }

  function handleClear() {
    onChange('')
    onMallSelect({ id: '', name: '', city: '', province: '', address: '', glaSqm: '' })
    setResults([])
    setShowDropdown(false)
    setGoogleMode(false)
    setGooglePreview(null)
    setGoogleError(null)
  }

  const inputCls = `w-full pl-10 pr-9 py-3 rounded-xl border ${
    hasError
      ? 'border-red-400 focus:ring-red-200'
      : 'border-warm-border focus:border-forest/50 focus:ring-forest/10'
  } bg-white text-ink placeholder:text-ink-subtle focus:outline-none focus:ring-2 transition-colors text-sm`

  // ── Confirmed ──────────────────────────────────────────────────────────────
  if (isConfirmed) {
    return (
      <div className="flex items-center gap-3 px-4 py-3 bg-forest-light/40 border border-forest/20 rounded-xl">
        <div className="w-6 h-6 rounded-full bg-forest flex items-center justify-center flex-shrink-0">
          <Check className="h-3.5 w-3.5 text-white" />
        </div>
        <p className="flex-1 min-w-0 text-sm font-semibold text-ink truncate">{value}</p>
        <button type="button" onClick={handleClear}
          className="flex-shrink-0 text-xs text-ink-muted hover:text-ink font-medium px-2 py-1 rounded-lg hover:bg-white/60 transition-colors">
          {isEs ? 'Cambiar' : 'Change'}
        </button>
      </div>
    )
  }

  // ── Search ─────────────────────────────────────────────────────────────────
  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-subtle pointer-events-none" />
        <input
          type="text"
          value={value}
          onChange={handleInputChange}
          onFocus={() => { if (results.length > 0 || value.trim().length >= 2) setShowDropdown(true) }}
          placeholder={isEs ? 'Busca tu centro comercial…' : 'Search for your shopping center…'}
          className={inputCls}
          autoComplete="off"
        />
        {loading && (
          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-ink-subtle animate-spin" />
        )}
        {!loading && value && (
          <button type="button" onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-subtle hover:text-ink">
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {showDropdown && (
        <div className="absolute z-50 left-0 right-0 mt-1 bg-white border border-warm-border rounded-2xl shadow-lg overflow-hidden">

          {/* No results message */}
          {results.length === 0 && !googleMode && (
            <p className="px-4 py-3 text-sm text-ink-muted border-b border-warm-border/50">
              {isEs ? 'No encontramos este centro en nuestra lista.' : 'No malls found in our list.'}
            </p>
          )}

          {/* DB results */}
          {results.map(mall => (
            <button key={mall.id} type="button" onClick={() => selectDbMall(mall)}
              className="w-full flex items-start gap-3 px-4 py-3 text-left hover:bg-stone transition-colors border-b border-warm-border/40 last:border-0">
              <Building2 className="h-3.5 w-3.5 text-forest mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold text-ink leading-snug">{mall.name}</p>
                <p className="text-xs text-ink-muted leading-snug">{mall.city}, {mall.province}</p>
              </div>
            </button>
          ))}

          {/* Can't find? toggle */}
          {!googleMode && (
            <button type="button"
              onClick={() => { setGoogleMode(true); setGoogleQuery(value) }}
              className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-stone transition-colors">
              <span className="text-sm text-ink-muted">
                {isEs ? '¿No encuentras tu centro?' : "Can't find your mall?"}
              </span>
              <ChevronRight className="h-3.5 w-3.5 text-ink-subtle" />
            </button>
          )}

          {/* Google search inline expansion */}
          {googleMode && (
            <div className="px-4 py-3 bg-stone/60 border-t border-warm-border space-y-3">
              <p className="text-xs font-semibold text-ink-subtle">
                {isEs ? 'Buscar en Google Maps' : 'Search on Google Maps'}
              </p>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={googleQuery}
                  onChange={e => {
                    setGoogleQuery(e.target.value)
                    setGooglePreview(null)
                    setGoogleError(null)
                  }}
                  onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleGoogleSearch() } }}
                  placeholder={isEs ? 'Nombre del centro + ciudad…' : 'Mall name + city…'}
                  autoFocus
                  className="flex-1 px-3 py-2 rounded-xl border border-warm-border bg-white text-sm text-ink placeholder:text-ink-subtle focus:outline-none focus:ring-2 focus:ring-forest/10 focus:border-forest/50 transition-colors"
                />
                <button type="button" onClick={handleGoogleSearch}
                  disabled={googleLoading || !googleQuery.trim()}
                  className="px-3 py-2 bg-forest text-white text-sm font-semibold rounded-xl hover:bg-forest-mid disabled:opacity-50 transition-colors flex items-center justify-center">
                  {googleLoading
                    ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    : <Search className="h-3.5 w-3.5" />}
                </button>
              </div>

              {/* Result preview */}
              {googlePreview && (
                <div className="p-3 bg-white rounded-xl border border-forest/20 space-y-2.5">
                  <div className="flex items-start gap-2.5">
                    <MapPin className="h-3.5 w-3.5 text-forest mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-ink">{googlePreview.name}</p>
                      <p className="text-xs text-ink-muted">{googlePreview.address}</p>
                    </div>
                  </div>
                  <button type="button" onClick={handleConfirmGoogle} disabled={adding}
                    className="w-full text-xs font-semibold bg-forest text-white px-3 py-2 rounded-lg hover:bg-forest-mid disabled:opacity-50 transition-colors flex items-center justify-center gap-1.5">
                    {adding
                    ? <><Loader2 className="h-3 w-3 animate-spin" /> {isEs ? 'Añadiendo…' : 'Adding…'}</>
                    : <><Check className="h-3 w-3" /> {isEs ? 'Sí, este es mi centro' : 'Yes, this is my mall'}</>}
                  </button>
                </div>
              )}

              {/* Errors */}
              {googleError === 'not_found' && (
                <div className="flex items-start gap-2 p-3 bg-amber-50 rounded-xl border border-amber-200">
                  <AlertCircle className="h-3.5 w-3.5 text-amber-600 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-amber-800">
                    {isEs
                      ? <>No encontramos este centro en Google Maps. Escríbenos a{' '}<span className="font-semibold">hello@lokales.es</span> y lo añadimos manualmente.</>
                      : <>We couldn't find this mall on Google Maps. Please contact us at{' '}<span className="font-semibold">hello@lokales.es</span> and we'll add it manually.</>
                    }
                  </p>
                </div>
              )}
              {googleError === 'api_error' && (
                <div className="flex items-start gap-2 p-3 bg-red-50 rounded-xl border border-red-200">
                  <AlertCircle className="h-3.5 w-3.5 text-red-500 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-red-700">
                    {isEs ? 'Algo salió mal. Inténtalo de nuevo.' : 'Something went wrong. Please try again.'}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
