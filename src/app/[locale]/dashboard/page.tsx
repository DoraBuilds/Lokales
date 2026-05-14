import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { NavbarServer } from '@/components/layout/NavbarServer'
import { Footer } from '@/components/layout/Footer'
import { LinkButton } from '@/components/ui/link-button'
import { Plus } from 'lucide-react'

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect(`/${locale}/auth/login`)

  const { data: profile } = await supabase
    .from('profiles')
    .select('name, company_name')
    .eq('id', user.id)
    .single()

  const isEs = locale === 'es'
  const firstName = profile?.name?.split(' ')[0] ?? ''

  return (
    <div className="flex flex-col min-h-screen bg-cream">
      <NavbarServer />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-10">
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

        {/* Placeholder — listings will go here */}
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
      </main>

      <Footer />
    </div>
  )
}
