'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useLocale } from 'next-intl'
import { MapPin, ArrowRight } from 'lucide-react'
import type { ShoppingCenter } from '@/types'

const MALL_FALLBACKS = [
  '/Assets/michael-weidemann-oGhTfu1UrOY-unsplash.jpg',
  '/Assets/vitaly-gariev-F7lIMuWQF4c-unsplash.jpg',
  '/Assets/gigstore-C1BryewCOq0-unsplash.jpg',
]

function pickMallFallback(id: string): string {
  const sum = id.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)
  return MALL_FALLBACKS[sum % MALL_FALLBACKS.length]
}

interface MallCounts {
  total: number
  long_term: number
  popup: number
  marketing: number
}

interface MallCardProps {
  mall: ShoppingCenter
  counts: MallCounts
  href: string
}

const TYPE_CHIPS: { key: keyof Omit<MallCounts, 'total'>; en: string; es: string; cls: string }[] = [
  { key: 'long_term',  en: 'Long-term', es: 'Largo plazo', cls: 'bg-forest-light text-forest' },
  { key: 'popup',      en: 'Pop-up',    es: 'Pop-up',      cls: 'bg-purple-soft text-purple-brand' },
  { key: 'marketing',  en: 'Marketing', es: 'Marketing',   cls: 'bg-amber-soft text-amber-brand' },
]

export function MallCard({ mall, counts, href }: MallCardProps) {
  const locale = useLocale() as 'en' | 'es'
  const isEs = locale === 'es'

  const activeChips = TYPE_CHIPS.filter(c => counts[c.key] > 0)

  return (
    <Link href={href} className="group block bg-white rounded-3xl border border-warm-border hover:border-forest/30 hover:shadow-md transition-all overflow-hidden">

      {/* Top section — mall image */}
      <div className="relative h-40 bg-stone overflow-hidden">
        <Image
          src={mall.images?.[0] ?? pickMallFallback(mall.id)}
          alt={mall.name}
          fill
          className="object-cover group-hover:scale-[1.03] transition-transform duration-500 ease-out"
        />

        {/* Center type badge */}
        {mall.center_type && (
          <span className="absolute top-3 left-3 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-sm text-ink">
            {mall.center_type}
          </span>
        )}

        {/* Space count pill — top right */}
        <div className="absolute top-3 right-3 bg-forest text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
          {counts.total} {isEs
            ? counts.total === 1 ? 'espacio libre' : 'espacios libres'
            : counts.total === 1 ? 'space free' : 'spaces free'}
        </div>
      </div>

      {/* Bottom section */}
      <div className="p-5">
        <h3 className="text-base font-bold text-ink mb-1 leading-snug group-hover:text-forest transition-colors">
          {mall.name}
        </h3>

        <div className="flex items-center gap-1 text-xs text-ink-muted mb-4">
          <MapPin className="h-3 w-3 flex-shrink-0" />
          <span>{mall.city}{mall.province && mall.province !== mall.city ? `, ${mall.province}` : ''}</span>
          {mall.gla_sqm && (
            <span className="ml-2 text-ink-subtle">· {Number(mall.gla_sqm).toLocaleString('es-ES')} m² GLA</span>
          )}
        </div>

        {/* Type breakdown chips */}
        {activeChips.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {activeChips.map(chip => (
              <span key={chip.key} className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${chip.cls}`}>
                {counts[chip.key]} {isEs ? chip.es : chip.en}
              </span>
            ))}
          </div>
        )}

        {/* CTA */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-ink-muted">
            {isEs ? 'Ver disponibilidad' : 'View availability'}
          </span>
          <span className="flex items-center gap-1 text-sm font-semibold text-forest group-hover:gap-2 transition-all">
            {isEs ? 'Ver espacios' : 'View spaces'} <ArrowRight className="h-3.5 w-3.5" />
          </span>
        </div>
      </div>
    </Link>
  )
}
