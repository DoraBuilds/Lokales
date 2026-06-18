'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { MapPin, Plus, Eye, Pencil, PauseCircle, PlayCircle } from 'lucide-react'
import { LinkButton } from '@/components/ui/link-button'
import { setListingStatus } from '@/lib/listing-actions'

const BADGE_STYLES: Record<string, string> = {
  long_term: 'bg-forest text-white',
  popup:     'bg-purple-brand text-white',
  marketing: 'bg-amber-brand text-white',
}
const TYPE_LABELS: Record<string, string> = {
  long_term: 'Long-term',
  popup:     'Pop-up',
  marketing: 'Marketing',
}

interface Listing {
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
  status: string
  shopping_center?: { name: string; city: string }
}

function PauseButton({ listing, locale }: { listing: Listing; locale: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const isActive = listing.status === 'active'
  const isEs = locale === 'es'

  async function toggle() {
    setLoading(true)
    await setListingStatus(listing.id, isActive ? 'paused' : 'active')
    router.refresh()
    setLoading(false)
  }

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className="flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold border border-warm-border rounded-full py-1.5 transition-colors disabled:opacity-50
        text-ink-muted hover:border-amber-400/60 hover:text-amber-600"
    >
      {isActive
        ? <><PauseCircle className="h-3.5 w-3.5" /> {isEs ? 'Pausar' : 'Pause'}</>
        : <><PlayCircle className="h-3.5 w-3.5" /> {isEs ? 'Activar' : 'Activate'}</>
      }
    </button>
  )
}

export function DashboardListings({ listings, locale }: { listings: Listing[]; locale: string }) {
  const isEs = locale === 'es'

  if (listings.length === 0) {
    return (
      <div className="bg-white rounded-3xl border border-warm-border p-12 text-center">
        <div className="w-16 h-16 bg-forest-light rounded-full flex items-center justify-center mx-auto mb-4">
          <Plus className="h-7 w-7 text-forest" />
        </div>
        <h2 className="text-xl font-bold text-ink mb-2">
          {isEs ? 'Aún no tienes ningún espacio' : "You haven't listed any spaces yet"}
        </h2>
        <p className="text-sm text-ink-muted mb-6 max-w-sm mx-auto">
          {isEs
            ? 'Publica tu primer espacio y empieza a recibir consultas de marcas.'
            : 'List your first space and start receiving inquiries from brands.'}
        </p>
        <LinkButton
          href={`/${locale}/listings/new`}
          className="bg-forest hover:bg-forest-mid text-white font-semibold rounded-full px-6 py-2.5 text-sm"
        >
          {isEs ? 'Publicar mi primer espacio' : 'List my first space'}
        </LinkButton>
      </div>
    )
  }

  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-widest text-ink-subtle mb-5">
        {isEs
          ? `${listings.length} espacio${listings.length !== 1 ? 's' : ''}`
          : `${listings.length} listing${listings.length !== 1 ? 's' : ''}`}
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {listings.map((listing) => {
          const image = listing.images?.[0]
          const price = listing.price_monthly
            ? `€${listing.price_monthly.toLocaleString('en-US')}/mo`
            : listing.price_daily_popup
            ? `€${listing.price_daily_popup}/${listing.popup_price_unit ?? 'day'}`
            : listing.price_daily_marketing
            ? `€${listing.price_daily_marketing}/${listing.marketing_price_unit ?? 'day'}`
            : null

          return (
            <div key={listing.id} className={`bg-white rounded-3xl border overflow-hidden group transition-opacity ${
              listing.status === 'paused' ? 'border-warm-border opacity-70' : 'border-warm-border'
            }`}>
              <div className="relative aspect-[4/3] bg-stone">
                {image
                  ? <Image src={image} alt={listing.title} fill className="object-cover" />
                  : <div className="absolute inset-0 flex items-center justify-center"><MapPin className="h-8 w-8 text-ink-subtle" /></div>
                }
                <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                  {listing.rental_types.map((type) => (
                    <span key={type} className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${BADGE_STYLES[type]}`}>
                      {TYPE_LABELS[type]}
                    </span>
                  ))}
                </div>
                {listing.status === 'paused' && (
                  <div className="absolute inset-0 bg-ink/30 flex items-center justify-center">
                    <span className="bg-white text-ink text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5">
                      <PauseCircle className="h-3.5 w-3.5" />
                      {isEs ? 'Pausado' : 'Paused'}
                    </span>
                  </div>
                )}
              </div>

              <div className="p-4">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h3 className="text-sm font-semibold text-ink line-clamp-1">{listing.title}</h3>
                  {price && <span className="text-sm font-bold text-ink flex-shrink-0">{price}</span>}
                </div>
                {listing.shopping_center && (
                  <div className="flex items-center gap-1 text-xs text-ink-muted mb-3">
                    <MapPin className="h-3 w-3 flex-shrink-0" />
                    <span className="truncate">{listing.shopping_center.name} · {listing.shopping_center.city}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Link href={`/${locale}/listings/${listing.id}?from=dashboard`}
                    className="flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold text-ink-muted border border-warm-border rounded-full py-1.5 hover:border-forest/40 hover:text-forest transition-colors">
                    <Eye className="h-3.5 w-3.5" /> {isEs ? 'Ver' : 'View'}
                  </Link>
                  <Link href={`/${locale}/listings/${listing.id}/edit`}
                    className="flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold text-ink-muted border border-warm-border rounded-full py-1.5 hover:border-forest/40 hover:text-forest transition-colors">
                    <Pencil className="h-3.5 w-3.5" /> {isEs ? 'Editar' : 'Edit'}
                  </Link>
                  <PauseButton listing={listing} locale={locale} />
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
