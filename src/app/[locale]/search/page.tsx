import { createClient } from '@/lib/supabase/server'
import { NavbarServer } from '@/components/layout/NavbarServer'
import { Footer } from '@/components/layout/Footer'
import { ListingCard } from '@/components/listings/ListingCard'
import { SearchFilters } from '@/components/search/SearchFilters'
import { Suspense } from 'react'
import { SlidersHorizontal, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import type { Listing } from '@/types'

const SORT_MAP: Record<string, { column: string; ascending: boolean }> = {
  price_asc:  { column: 'price_monthly', ascending: true },
  price_desc: { column: 'price_monthly', ascending: false },
  size_asc:   { column: 'size_sqm',      ascending: true },
  size_desc:  { column: 'size_sqm',      ascending: false },
}

const TYPE_LABEL: Record<string, { en: string; es: string }> = {
  long_term: { en: 'Long-term', es: 'Largo plazo' },
  popup:     { en: 'Pop-up',    es: 'Pop-up' },
  marketing: { en: 'Marketing', es: 'Marketing' },
}

interface SuggestionGroup {
  labelEn: string
  labelEs: string
  href: string
  listings: Listing[]
}

const SELECT_COLS = '*, shopping_center:shopping_centers(id, name, city, address, province, postal_code, country, lat, lng, images, created_by, created_at)'

interface SearchPageProps {
  params: Promise<{ locale: string }>
  searchParams: Promise<{
    q?: string
    type?: string
    size_min?: string
    price_max?: string
    sort?: string
  }>
}

export default async function SearchPage({ params, searchParams }: SearchPageProps) {
  const { locale } = await params
  const { q, type, size_min, price_max, sort } = await searchParams

  const supabase = await createClient()

  // ── Step 1: resolve shopping center IDs for the text query ──────────────────
  let scIds: string[] | null = null
  if (q?.trim()) {
    const safeQ = q.replace(/[,():*\\]/g, '')
    const { data: matchingSCs } = await supabase
      .from('shopping_centers')
      .select('id')
      .or(`name.ilike.%${safeQ}%,city.ilike.%${safeQ}%,province.ilike.%${safeQ}%`)
    scIds = matchingSCs?.map((sc) => sc.id) ?? []
  }

  // ── Step 2: main query ───────────────────────────────────────────────────────
  const sortOpt = sort && SORT_MAP[sort] ? SORT_MAP[sort] : { column: 'created_at', ascending: false }

  let listings: Listing[] = []
  const noSCsFound = scIds !== null && scIds.length === 0

  if (!noSCsFound) {
    let query = supabase
      .from('listings')
      .select(SELECT_COLS)
      .eq('status', 'active')
      .order(sortOpt.column, { ascending: sortOpt.ascending })

    if (scIds && scIds.length > 0) query = query.in('shopping_center_id', scIds)
    if (type)     query = query.contains('rental_types', [type])
    if (size_min) { const n = parseInt(size_min); if (!isNaN(n)) query = query.gte('size_sqm', n) }
    if (price_max){ const n = parseInt(price_max); if (!isNaN(n)) query = query.lte('price_monthly', n) }

    const { data } = await query.limit(48)
    listings = (data ?? []) as unknown as Listing[]
  }

  // ── Step 3: suggestions when empty ──────────────────────────────────────────
  let suggestions: SuggestionGroup[] = []

  if (listings.length === 0 && (q || type)) {
    const suggestionQueries: Promise<SuggestionGroup | null>[] = []

    // Suggestion A: same type, any location (when both q and type were set)
    if (type && q) {
      suggestionQueries.push((async () => {
        const { data } = await supabase
          .from('listings').select(SELECT_COLS).eq('status', 'active')
          .contains('rental_types', [type]).order('created_at', { ascending: false }).limit(4)
        const items = (data ?? []) as unknown as Listing[]
        if (items.length === 0) return null
        const tLabel = TYPE_LABEL[type] ?? { en: type, es: type }
        return {
          labelEn: `${tLabel.en} spaces elsewhere in Spain`,
          labelEs: `Espacios de ${tLabel.es.toLowerCase()} en el resto de España`,
          href: `/${locale}/search?type=${type}`,
          listings: items,
        }
      })())
    }

    // Suggestion B: same location, any type (when scIds were found but type filtered out all results)
    if (q && scIds && scIds.length > 0 && type) {
      suggestionQueries.push((async () => {
        const { data } = await supabase
          .from('listings').select(SELECT_COLS).eq('status', 'active')
          .in('shopping_center_id', scIds).order('created_at', { ascending: false }).limit(4)
        const items = (data ?? []) as unknown as Listing[]
        if (items.length === 0) return null
        return {
          labelEn: `All spaces in ${q}`,
          labelEs: `Todos los espacios en ${q}`,
          href: `/${locale}/search?q=${encodeURIComponent(q)}`,
          listings: items,
        }
      })())
    }

    // Suggestion C: only size/price filters failed — show same type/location without those
    if (!type && !q) {
      suggestionQueries.push((async () => {
        const { data } = await supabase
          .from('listings').select(SELECT_COLS).eq('status', 'active')
          .order('created_at', { ascending: false }).limit(4)
        const items = (data ?? []) as unknown as Listing[]
        if (items.length === 0) return null
        return { labelEn: 'Recently added spaces', labelEs: 'Espacios añadidos recientemente', href: `/${locale}/search`, listings: items }
      })())
    }

    // Suggestion D: location not found at all — show anything active
    if (noSCsFound) {
      suggestionQueries.push((async () => {
        const { data } = await supabase
          .from('listings').select(SELECT_COLS).eq('status', 'active')
          .order('created_at', { ascending: false }).limit(4)
        const items = (data ?? []) as unknown as Listing[]
        if (items.length === 0) return null
        return { labelEn: 'Available spaces across Spain', labelEs: 'Espacios disponibles en toda España', href: `/${locale}/search`, listings: items }
      })())
    }

    const results = await Promise.all(suggestionQueries)
    suggestions = results.filter((s): s is SuggestionGroup => s !== null)
  }

  return (
    <SearchPageUI
      locale={locale}
      q={q}
      type={type}
      listings={listings}
      suggestions={suggestions}
    />
  )
}

// ── UI ────────────────────────────────────────────────────────────────────────

function SearchPageUI({
  locale,
  q,
  type,
  listings,
  suggestions,
}: {
  locale: string
  q?: string
  type?: string
  listings: Listing[]
  suggestions: SuggestionGroup[]
}) {
  const isEs = locale === 'es'
  const total = listings.length

  function resultLabel() {
    if (q && type) return isEs ? `Resultados para "${q}"` : `Results for "${q}"`
    if (q)   return isEs ? `Resultados para "${q}"` : `Results for "${q}"`
    if (type) {
      const t = TYPE_LABEL[type]
      return t ? (isEs ? t.es : t.en) : type
    }
    return isEs ? 'Todos los espacios' : 'All spaces'
  }

  return (
    <div className="flex flex-col min-h-screen bg-cream">
      <NavbarServer />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-ink">{resultLabel()}</h1>
          <p className="text-sm text-ink-muted mt-1">
            {total === 0
              ? (isEs ? 'Sin resultados' : 'No results found')
              : isEs
                ? `${total} espacio${total !== 1 ? 's' : ''} disponible${total !== 1 ? 's' : ''}`
                : `${total} space${total !== 1 ? 's' : ''} available`
            }
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">

          {/* Sidebar */}
          <aside className="w-full lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-3xl border border-warm-border p-6 sticky top-24">
              <div className="flex items-center gap-2 mb-6">
                <SlidersHorizontal className="h-4 w-4 text-forest" />
                <p className="text-sm font-semibold text-ink">{isEs ? 'Filtros' : 'Filters'}</p>
              </div>
              <Suspense fallback={null}>
                <SearchFilters locale={locale} />
              </Suspense>
            </div>
          </aside>

          {/* Results */}
          <div className="flex-1 min-w-0">
            {listings.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-5 gap-y-8">
                {listings.map((listing) => (
                  <ListingCard key={listing.id} listing={listing} />
                ))}
              </div>
            ) : (
              <div className="space-y-12">

                {/* Empty state message */}
                <div className="bg-white rounded-3xl border border-warm-border px-8 py-10">
                  <p className="text-base font-semibold text-ink mb-1">
                    {isEs ? 'No encontramos ningún espacio' : 'No spaces match your search'}
                  </p>
                  <p className="text-sm text-ink-muted mb-5">
                    {isEs
                      ? 'Prueba a ajustar los filtros o mira las sugerencias de abajo.'
                      : 'Try adjusting your filters, or take a look at the suggestions below.'}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {q && (
                      <Link href={`/${locale}/search?q=${encodeURIComponent(q)}`}
                        className="text-xs font-semibold px-3 py-1.5 rounded-full bg-stone text-ink hover:bg-warm-border transition-colors">
                        {isEs ? `Quitar filtro de tipo` : 'Remove type filter'}
                      </Link>
                    )}
                    {type && (
                      <Link href={q ? `/${locale}/search?q=${encodeURIComponent(q)}` : `/${locale}/search`}
                        className="text-xs font-semibold px-3 py-1.5 rounded-full bg-stone text-ink hover:bg-warm-border transition-colors">
                        {isEs ? 'Quitar tipo' : 'Remove type'}
                      </Link>
                    )}
                    <Link href={`/${locale}/search`}
                      className="text-xs font-semibold px-3 py-1.5 rounded-full bg-forest text-white hover:bg-forest-mid transition-colors">
                      {isEs ? 'Ver todo' : 'Clear all filters'}
                    </Link>
                  </div>
                </div>

                {/* Suggestion groups */}
                {suggestions.map((group) => (
                  <div key={group.href}>
                    <div className="flex items-center justify-between mb-5">
                      <h2 className="text-sm font-semibold uppercase tracking-widest text-ink-subtle">
                        {isEs ? group.labelEs : group.labelEn}
                      </h2>
                      <Link href={group.href}
                        className="flex items-center gap-1 text-sm font-semibold text-forest hover:underline">
                        {isEs ? 'Ver todos' : 'View all'} <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-5 gap-y-8">
                      {group.listings.map((listing) => (
                        <ListingCard key={listing.id} listing={listing} />
                      ))}
                    </div>
                  </div>
                ))}

              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
