'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useLocale, useTranslations } from 'next-intl'
import { MapPin, Maximize2, Heart } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import type { Listing } from '@/types'

interface ListingCardProps {
  listing: Listing
  isSaved?: boolean
  onSave?: (id: string) => void
}

const RENTAL_TYPE_COLORS: Record<string, string> = {
  long_term: 'bg-blue-100 text-blue-700',
  popup: 'bg-amber-100 text-amber-700',
  marketing: 'bg-emerald-100 text-emerald-700'
}

const RENTAL_TYPE_LABELS: Record<string, { en: string; es: string }> = {
  long_term: { en: 'Long-term', es: 'Largo plazo' },
  popup: { en: 'Pop-up', es: 'Pop-up' },
  marketing: { en: 'Marketing', es: 'Marketing' }
}

export function ListingCard({ listing, isSaved, onSave }: ListingCardProps) {
  const locale = useLocale()
  const t = useTranslations('common')

  const primaryImage = listing.images?.[0]
  const primaryPrice = listing.price_monthly
    ? `€${listing.price_monthly.toLocaleString()}${locale === 'es' ? '/mes' : '/mo'}`
    : listing.price_daily_popup
    ? `€${listing.price_daily_popup}${locale === 'es' ? '/día' : '/day'}`
    : listing.price_daily_marketing
    ? `€${listing.price_daily_marketing}${locale === 'es' ? '/día' : '/day'}`
    : null

  return (
    <Card className="overflow-hidden group cursor-pointer hover:shadow-lg transition-shadow duration-200 border-zinc-200">
      <Link href={`/${locale}/listings/${listing.id}`}>
        {/* Image */}
        <div className="relative aspect-[4/3] bg-zinc-100 overflow-hidden">
          {primaryImage ? (
            <Image
              src={primaryImage}
              alt={listing.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-zinc-200 flex items-center justify-center">
                <Maximize2 className="h-8 w-8 text-zinc-400" />
              </div>
            </div>
          )}

          {/* Save button */}
          {onSave && (
            <button
              onClick={(e) => {
                e.preventDefault()
                onSave(listing.id)
              }}
              className="absolute top-3 right-3 p-2 rounded-full bg-white/90 hover:bg-white shadow-sm transition-colors"
            >
              <Heart
                className={`h-4 w-4 ${isSaved ? 'fill-red-500 text-red-500' : 'text-zinc-600'}`}
              />
            </button>
          )}

          {/* Rental type badges */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-1">
            {listing.rental_types.map((type) => (
              <span
                key={type}
                className={`text-xs font-medium px-2 py-0.5 rounded-full ${RENTAL_TYPE_COLORS[type]}`}
              >
                {RENTAL_TYPE_LABELS[type][locale as 'en' | 'es']}
              </span>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Price */}
          {primaryPrice && (
            <p className="text-lg font-bold text-zinc-900 mb-1">{primaryPrice}</p>
          )}

          {/* Title */}
          <h3 className="text-sm font-medium text-zinc-900 line-clamp-2 mb-2 leading-snug">
            {listing.title}
          </h3>

          {/* Location */}
          {listing.shopping_center && (
            <div className="flex items-center gap-1 text-xs text-zinc-500 mb-2">
              <MapPin className="h-3 w-3 flex-shrink-0" />
              <span className="truncate">
                {listing.shopping_center.name} · {listing.shopping_center.city}
              </span>
            </div>
          )}

          {/* Size */}
          <p className="text-xs text-zinc-400">
            {listing.size_sqm} m²
          </p>
        </div>
      </Link>
    </Card>
  )
}
