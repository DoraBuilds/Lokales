'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Heart, MapPin } from 'lucide-react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toggleSaveListing } from '@/lib/listing-actions'

const BADGE_STYLES: Record<string, string> = {
  long_term: 'bg-forest text-white',
  popup:     'bg-purple-brand text-white',
  marketing: 'bg-amber-brand text-white',
}
const TYPE_LABELS: Record<string, string> = {
  long_term: 'Long-term', popup: 'Pop-up', marketing: 'Marketing',
}

interface SavedListing {
  listing_id: string
  listing: {
    id: string
    title: string
    images: string[]
    rental_types: string[]
    price_monthly?: number
    price_daily_popup?: number
    price_daily_marketing?: number
    popup_price_unit?: string
    marketing_price_unit?: string
    size_sqm: number
    shopping_center?: { name: string; city: string }
  }
}

function UnsaveButton({ listingId }: { listingId: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleUnsave(e: React.MouseEvent) {
    e.preventDefault()
    setLoading(true)
    await toggleSaveListing(listingId)
    router.refresh()
  }

  return (
    <button
      onClick={handleUnsave}
      disabled={loading}
      className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center shadow-sm hover:bg-white transition-colors disabled:opacity-60"
      title="Remove from saved"
    >
      <Heart className={`h-4 w-4 ${loading ? 'text-ink-subtle' : 'fill-rose-500 text-rose-500'}`} />
    </button>
  )
}

export function DashboardSaved({ saved, locale }: { saved: SavedListing[]; locale: string }) {
  const isEs = locale === 'es'

  if (saved.length === 0) {
    return (
      <div className="bg-white rounded-3xl border border-warm-border p-12 text-center">
        <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <Heart className="h-7 w-7 text-rose-400" />
        </div>
        <h2 className="text-xl font-bold text-ink mb-2">
          {isEs ? 'Sin espacios guardados' : 'No saved spaces'}
        </h2>
        <p className="text-sm text-ink-muted mb-6 max-w-sm mx-auto">
          {isEs
            ? 'Guarda espacios con el botón ♥ para encontrarlos aquí fácilmente.'
            : 'Save spaces using the ♥ button to find them here easily.'}
        </p>
        <Link href={`/${locale}/search`}
          className="inline-flex items-center gap-2 bg-forest hover:bg-forest-mid text-white font-semibold rounded-full px-6 py-2.5 text-sm transition-colors">
          {isEs ? 'Explorar espacios' : 'Browse spaces'}
        </Link>
      </div>
    )
  }

  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-widest text-ink-subtle mb-5">
        {isEs
          ? `${saved.length} espacio${saved.length !== 1 ? 's' : ''} guardado${saved.length !== 1 ? 's' : ''}`
          : `${saved.length} saved space${saved.length !== 1 ? 's' : ''}`}
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {saved.map(({ listing }) => {
          const image = listing.images?.[0]
          const price = listing.price_monthly
            ? `€${listing.price_monthly.toLocaleString('en-US')}/mo`
            : listing.price_daily_popup
            ? `€${listing.price_daily_popup}/${listing.popup_price_unit ?? 'day'}`
            : listing.price_daily_marketing
            ? `€${listing.price_daily_marketing}/${listing.marketing_price_unit ?? 'day'}`
            : null

          return (
            <Link key={listing.id} href={`/${locale}/listings/${listing.id}?from=dashboard`}
              className="bg-white rounded-3xl border border-warm-border overflow-hidden group hover:shadow-md transition-shadow">
              <div className="relative aspect-[4/3] bg-stone">
                {image
                  ? <Image src={image} alt={listing.title} fill className="object-cover group-hover:scale-[1.03] transition-transform duration-300" />
                  : <div className="absolute inset-0 flex items-center justify-center"><MapPin className="h-8 w-8 text-ink-subtle" /></div>
                }
                <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                  {listing.rental_types.map((type) => (
                    <span key={type} className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${BADGE_STYLES[type]}`}>
                      {TYPE_LABELS[type]}
                    </span>
                  ))}
                </div>
                <UnsaveButton listingId={listing.id} />
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h3 className="text-sm font-semibold text-ink line-clamp-1">{listing.title}</h3>
                  {price && <span className="text-sm font-bold text-ink flex-shrink-0">{price}</span>}
                </div>
                {listing.shopping_center && (
                  <div className="flex items-center gap-1 text-xs text-ink-muted">
                    <MapPin className="h-3 w-3 flex-shrink-0" />
                    <span className="truncate">{listing.shopping_center.name} · {listing.shopping_center.city}</span>
                  </div>
                )}
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
