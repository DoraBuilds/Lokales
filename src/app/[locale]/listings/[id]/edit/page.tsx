import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { NavbarServer } from '@/components/layout/NavbarServer'
import { Footer } from '@/components/layout/Footer'
import { EditListingForm } from '@/components/listings/EditListingForm'

export default async function EditListingPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>
}) {
  const { locale, id } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect(`/${locale}/auth/login`)

  const { data: listing } = await supabase
    .from('listings')
    .select('*')
    .eq('id', id)
    .eq('lister_id', user.id)
    .single()

  if (!listing) notFound()

  return (
    <div className="flex flex-col min-h-screen bg-cream">
      <NavbarServer />

      <main className="flex-1 max-w-3xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <Link
            href={`/${locale}/listings/${id}`}
            className="flex items-center gap-2 text-sm text-ink-muted hover:text-ink transition-colors mb-4"
          >
            <ArrowLeft className="h-4 w-4" /> Back to listing
          </Link>
          <h1 className="text-2xl font-bold text-ink">Edit listing</h1>
          <p className="text-sm text-ink-muted mt-1">
            Update your space details. Shopping center information stays the same.
          </p>
        </div>

        <EditListingForm listing={listing} userId={user.id} locale={locale} />
      </main>

      <Footer />
    </div>
  )
}
