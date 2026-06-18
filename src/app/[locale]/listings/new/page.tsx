import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { NavbarServer } from '@/components/layout/NavbarServer'
import { Footer } from '@/components/layout/Footer'
import { NewListingForm } from '@/components/listings/NewListingForm'

export default async function NewListingPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect(`/${locale}/auth/login?next=/${locale}/listings/new`)

  return (
    <div className="flex flex-col min-h-screen bg-cream">
      <NavbarServer />

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-ink-subtle mb-1">
            {locale === 'es' ? 'Nueva publicación' : 'New listing'}
          </p>
          <h1 className="text-3xl font-bold text-ink">
            {locale === 'es' ? 'Publica tu espacio' : 'List your space'}
          </h1>
        </div>

        <NewListingForm userId={user.id} locale={locale} />
      </main>

      <Footer />
    </div>
  )
}
