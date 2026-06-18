import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { NavbarServer } from '@/components/layout/NavbarServer'
import { Footer } from '@/components/layout/Footer'
import { LinkButton } from '@/components/ui/link-button'
import { DashboardListings } from '@/components/dashboard/DashboardListings'
import { DashboardInquiries } from '@/components/dashboard/DashboardInquiries'
import { DashboardSaved } from '@/components/dashboard/DashboardSaved'
import { Plus, LayoutGrid, MessageSquare, Heart } from 'lucide-react'

type Tab = 'listings' | 'inquiries' | 'saved'

export default async function DashboardPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ published?: string; tab?: string }>
}) {
  const { locale } = await params
  const { published, tab: tabParam } = await searchParams
  const tab = (tabParam as Tab) || 'listings'

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect(`/${locale}/auth/login`)

  const { data: profile } = await supabase
    .from('profiles')
    .select('name, company_name')
    .eq('id', user.id)
    .single()

  // Always fetch listing IDs (needed for inquiry count)
  const { data: listings } = await supabase
    .from('listings')
    .select('*, shopping_center:shopping_centers(name, city)')
    .eq('lister_id', user.id)
    .order('created_at', { ascending: false })

  const listingIds = (listings ?? []).map((l) => l.id)

  // Fetch inquiries only when needed
  let inquiries: object[] = []
  if (tab === 'inquiries' && listingIds.length > 0) {
    const { data } = await supabase
      .from('inquiries')
      .select('*, listing:listings(id, title)')
      .in('listing_id', listingIds)
      .order('created_at', { ascending: false })
    inquiries = data ?? []
  }

  // Fetch saved listings only when needed
  let saved: object[] = []
  if (tab === 'saved') {
    const { data } = await supabase
      .from('saved_listings')
      .select(`
        listing_id,
        listing:listings(
          id, title, images, rental_types,
          price_monthly, price_daily_popup, price_daily_marketing,
          popup_price_unit, marketing_price_unit, size_sqm,
          shopping_center:shopping_centers(name, city)
        )
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
    saved = data ?? []
  }

  // Inquiry count badge (always fetch for the tab)
  let inquiryCount = 0
  if (listingIds.length > 0) {
    const { count } = await supabase
      .from('inquiries')
      .select('id', { count: 'exact', head: true })
      .in('listing_id', listingIds)
    inquiryCount = count ?? 0
  }

  const isEs = locale === 'es'
  const firstName = profile?.name?.split(' ')[0] ?? ''

  const TABS = [
    { id: 'listings' as Tab, label: isEs ? 'Mis espacios' : 'My listings', icon: LayoutGrid },
    { id: 'inquiries' as Tab, label: isEs ? 'Consultas' : 'Inquiries', icon: MessageSquare, count: inquiryCount },
    { id: 'saved' as Tab, label: isEs ? 'Guardados' : 'Saved', icon: Heart },
  ]

  return (
    <div className="flex flex-col min-h-screen bg-cream">
      <NavbarServer />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">

        {/* Published banner */}
        {published === '1' && (
          <div className="mb-6 bg-forest text-white rounded-2xl px-6 py-4 flex items-center gap-3">
            <span className="text-xl">🎉</span>
            <div>
              <p className="font-semibold">{isEs ? '¡Espacio publicado!' : 'Listing published!'}</p>
              <p className="text-forest-light/90 text-sm">
                {isEs ? 'Tu espacio ya está visible para las marcas.' : 'Your space is now live and visible to brands.'}
              </p>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-ink-subtle mb-1">
              {isEs ? 'Bienvenida de vuelta' : 'Welcome back'}
            </p>
            <h1 className="text-3xl font-bold text-ink">
              {firstName ? `${isEs ? 'Hola' : 'Hey'}, ${firstName} 👋` : isEs ? 'Tu panel' : 'Your dashboard'}
            </h1>
          </div>
          <LinkButton
            href={`/${locale}/listings/new`}
            className="bg-forest hover:bg-forest-mid text-white font-semibold rounded-full px-5 py-2.5 text-sm inline-flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            {isEs ? 'Nuevo espacio' : 'New listing'}
          </LinkButton>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 bg-white rounded-2xl border border-warm-border p-1.5 mb-8 w-fit">
          {TABS.map(({ id, label, icon: Icon, count }) => (
            <Link
              key={id}
              href={`/${locale}/dashboard?tab=${id}`}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                tab === id
                  ? 'bg-forest text-white shadow-sm'
                  : 'text-ink-muted hover:text-ink hover:bg-stone'
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
              {count !== undefined && count > 0 && (
                <span className={`text-[11px] font-bold px-1.5 py-0.5 rounded-full ${
                  tab === id ? 'bg-white/20 text-white' : 'bg-forest-light text-forest'
                }`}>
                  {count}
                </span>
              )}
            </Link>
          ))}
        </div>

        {/* Tab content */}
        {tab === 'listings' && (
          <DashboardListings listings={listings ?? []} locale={locale} />
        )}
        {tab === 'inquiries' && (
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          <DashboardInquiries inquiries={inquiries as any} locale={locale} />
        )}
        {tab === 'saved' && (
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          <DashboardSaved saved={saved as any} locale={locale} />
        )}

      </main>

      <Footer />
    </div>
  )
}
