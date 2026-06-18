'use client'

/**
 * Adapted from Olia's PlacesAutocompleteInput.
 * Requires NEXT_PUBLIC_GOOGLE_MAPS_API_KEY in .env.local.
 * Degrades to a plain <input> when the key is absent.
 */

import { useState, useEffect, useRef, useCallback } from 'react'
import { MapPin, Loader2 } from 'lucide-react'

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

type ScriptStatus = 'unavailable' | 'idle' | 'loading' | 'ready' | 'error'
let _status: ScriptStatus = API_KEY ? 'idle' : 'unavailable'
const _listeners = new Set<() => void>()

function ensureScript() {
  if (_status !== 'idle') return
  if (document.getElementById('lokales-gmaps')) {
    _status = 'ready'; _listeners.forEach(fn => fn()); return
  }
  _status = 'loading'
  const s = document.createElement('script')
  s.id = 'lokales-gmaps'
  s.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}&libraries=places&loading=async`
  s.async = true
  s.onload  = () => { _status = 'ready'; _listeners.forEach(fn => fn()); _listeners.clear() }
  s.onerror = () => { _status = 'error'; _listeners.forEach(fn => fn()); _listeners.clear() }
  document.head.appendChild(s)
}

function useGoogleMapsReady(): boolean {
  const [ready, setReady] = useState(() => _status === 'ready')
  useEffect(() => {
    if (_status === 'ready')       { setReady(true); return }
    if (_status === 'unavailable') { return }
    const notify = () => setReady(_status === 'ready')
    _listeners.add(notify)
    ensureScript()
    return () => { _listeners.delete(notify) }
  }, [])
  return ready
}

export interface PlaceResult {
  address:    string
  city?:      string
  province?:  string
  postalCode?: string
  lat: number
  lng: number
}

interface Prediction {
  place_id: string
  description: string
  structured_formatting?: { main_text: string; secondary_text?: string }
}

interface Props {
  value: string
  onChange: (val: string) => void
  onPlaceSelect: (place: PlaceResult) => void
  className?: string
  placeholder?: string
}

export function PlacesAutocompleteInput({ value, onChange, onPlaceSelect, className, placeholder }: Props) {
  const ready = useGoogleMapsReady()
  const [predictions, setPredictions] = useState<Prediction[]>([])
  const [showDropdown, setShowDropdown] = useState(false)
  const [loading, setLoading] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const debounceRef   = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const svcRef        = useRef<any>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node))
        setShowDropdown(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const getService = useCallback(() => {
    const g = (window as any).google
    if (!ready || !g?.maps?.places) return null
    if (!svcRef.current) svcRef.current = new g.maps.places.AutocompleteService()
    return svcRef.current
  }, [ready])

  const fetchPredictions = useCallback((input: string) => {
    const svc = getService()
    if (!svc || input.trim().length < 3) { setPredictions([]); setShowDropdown(false); return }
    setLoading(true)
    svc.getPlacePredictions(
      { input: input.trim(), componentRestrictions: { country: 'es' } },
      (results: Prediction[] | null, status: string) => {
        setLoading(false)
        const OK = (window as any).google.maps.places.PlacesServiceStatus.OK
        if (status === OK && results?.length) { setPredictions(results); setShowDropdown(true) }
        else { setPredictions([]); setShowDropdown(false) }
      },
    )
  }, [getService])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value)
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => fetchPredictions(e.target.value), 320)
  }

  const selectPrediction = (p: Prediction) => {
    setShowDropdown(false)
    setPredictions([])
    onChange(p.description)

    const g = (window as any).google
    const div = document.createElement('div')
    const svc = new g.maps.places.PlacesService(div)
    svc.getDetails(
      { placeId: p.place_id, fields: ['geometry', 'formatted_address', 'address_components'] },
      (place: any, status: string) => {
        if (status !== g.maps.places.PlacesServiceStatus.OK || !place?.geometry) return
        const components: any[] = place.address_components ?? []
        const get = (type: string) =>
          components.find((c: any) => c.types.includes(type))?.long_name ?? ''

        onPlaceSelect({
          address:    place.formatted_address ?? p.description,
          city:       get('locality') || get('administrative_area_level_3'),
          province:   get('administrative_area_level_2').replace(' Province', '').replace(' provincia', ''),
          postalCode: get('postal_code'),
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        })
      },
    )
  }

  // Fallback: no API key
  if (!API_KEY) {
    return (
      <input type="text" value={value} onChange={e => onChange(e.target.value)}
        placeholder={placeholder} className={className} />
    )
  }

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        <input type="text" value={value} onChange={handleChange} autoComplete="off"
          onFocus={() => { if (predictions.length > 0) setShowDropdown(true) }}
          placeholder={placeholder} className={className} />
        {loading && (
          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-ink-subtle animate-spin" />
        )}
      </div>

      {showDropdown && predictions.length > 0 && (
        <div className="absolute z-50 left-0 right-0 mt-1 bg-white border border-warm-border rounded-2xl shadow-lg overflow-hidden">
          {predictions.slice(0, 5).map(p => (
            <button key={p.place_id} type="button" onClick={() => selectPrediction(p)}
              className="w-full flex items-start gap-2.5 px-4 py-3 text-left hover:bg-stone transition-colors"
            >
              <MapPin className="h-3.5 w-3.5 text-forest mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm text-ink leading-snug">
                  {p.structured_formatting?.main_text ?? p.description}
                </p>
                {p.structured_formatting?.secondary_text && (
                  <p className="text-xs text-ink-muted leading-snug">
                    {p.structured_formatting.secondary_text}
                  </p>
                )}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
