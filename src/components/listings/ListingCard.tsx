'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useLocale } from 'next-intl'
import { MapPin, Heart, Maximize2 } from 'lucide-react'
import { useState } from 'react'
import { toggleSaveListing } from '@/lib/listing-actions'
import type { Listing } from '@/types'

interface ListingCardProps {
  listing: Listing
  isSaved?: boolean
  onSave?: (id: string) => void
}

const BADGE_STYLES: Record<string, string> = {
  long_term: 'bg-forest text-white',
  popup: 'bg-purple-brand text-white',
  marketing: 'bg-amber-brand text-white',
}

const TYPE_LABELS: Record<string, { en: string; es: string }> = {
  long_term: { en: 'Long-term', es: 'Largo plazo' },
  popup: { en: 'Pop-up', es: 'Pop-up' },
  marketing: { en: 'Marketing', es: 'Marketing' },
}

export function ListingCard({ listing, isSaved: initialSaved, onSave }: ListingCardProps) {
  const locale = useLocale() as 'en' | 'es'
  const [saved, setSaved] = useState(initialSaved ?? false)
  const [saving, setSaving] = useState(false)

  const primaryImage = listing.images?.[0]
  const primaryPrice = listing.price_monthly
    ? `€${listing.price_monthly.toLocaleString('es-ES')}${locale === 'es' ? '/mes' : '/mo'}`
    : listing.price_daily_popup
    ? `€${listing.price_daily_popup}${locale === 'es' ? '/día' : '/day'}`
    : listing.price_daily_marketing
    ? `€${listing.price_daily_marketing}${locale === 'es' ? '/día' : '/day'}`
    : null

  return (
    <Link href={`/${locale}/listings/${listing.id}`} className="group block">
      {/* Image container — full bleed, heavy radius */}
      <div className="relative aspect-[4/3] bg-stone rounded-3xl overflow-hidden mb-3">
        {primaryImage ? (
          <Image
            src={primaryImage}
            alt={listing.title}
            fill
            className="object-cover group-hover:scale-[1.03] transition-transform duration-500 ease-out"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-stone">
            <Maximize2 className="h-10 w-10 text-ink-subtle" />
          </div>
        )}

        {/* Rental type badges — floating top-left */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          {listing.rental_types.map((type) => (
            <span
              key={type}
              className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${BADGE_STYLES[type]}`}
            >
              {TYPE_LABELS[type][locale]}
            </span>
          ))}
        </div>

        {/* Save button — floating top-right */}
        <button
          onClick={async (e) => {
            e.preventDefault()
            if (onSave) {
              onSave(listing.id)
            } else {
              setSaving(true)
              const result = await toggleSaveListing(listing.id)
              setSaved(result.saved)
              setSaving(false)
            }
          }}
          disabled={saving}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm hover:bg-white transition-colors disabled:opacity-60"
        >
          <Heart
            className={`h-4 w-4 transition-colors ${
              saved ? 'fill-red-500 stroke-red-500' : 'stroke-ink-muted'
            }`}
          />
        </button>
      </div>

      {/* Card info — below image, no card border */}
      <div className="px-1">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="text-sm font-semibold text-ink line-clamp-1 leading-snug">
            {listing.title}
          </h3>
          {primaryPrice && (
            <span className="text-sm font-bold text-ink flex-shrink-0">{primaryPrice}</span>
          )}
        </div>

        {listing.shopping_center && (
          <div className="flex items-center gap-1 text-xs text-ink-muted">
            <MapPin className="h-3 w-3 flex-shrink-0" />
            <span className="truncate">
              {listing.shopping_center.name} · {listing.shopping_center.city}
            </span>
          </div>
        )}

        <p className="text-xs text-ink-subtle mt-1">{listing.size_sqm} m²</p>
      </div>
    </Link>
  )
}
