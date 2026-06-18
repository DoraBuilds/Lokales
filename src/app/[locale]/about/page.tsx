import { StaticPage } from '@/components/layout/StaticPage'
import Link from 'next/link'
import { ArrowRight, Target, Handshake, TrendingUp } from 'lucide-react'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  return {
    title: locale === 'es'
      ? 'Quiénes somos — Lokales'
      : 'About us — Lokales',
    description: locale === 'es'
      ? 'Lokales es el marketplace que conecta marcas y negocios con espacios disponibles en centros comerciales de España.'
      : 'Lokales is the marketplace connecting brands with available retail spaces in Spanish shopping centers.',
  }
}

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const isEs = locale === 'es'

  return (
    <StaticPage
      title={isEs ? 'Quiénes somos' : 'About us'}
      subtitle={isEs
        ? 'Conectamos marcas con espacios comerciales en los mejores centros de España.'
        : 'Connecting brands with retail spaces in Spain\'s best shopping centers.'}
    >
      <div className="space-y-12">

        {/* Mission */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-ink">
            {isEs ? 'Nuestra misión' : 'Our mission'}
          </h2>
          <p className="text-ink-muted leading-relaxed">
            {isEs
              ? 'Cada año, miles de locales comerciales en centros de toda España permanecen vacíos mientras cientos de marcas buscan el espacio perfecto para crecer. Lokales existe para cerrar esa brecha: somos el marketplace donde propietarios de espacios y marcas se encuentran directamente, de forma rápida y transparente.'
              : 'Every year, thousands of retail spaces in shopping centers across Spain sit empty while hundreds of brands search for the perfect place to grow. Lokales exists to close that gap — we are the marketplace where space owners and brands connect directly, quickly, and transparently.'}
          </p>
          <p className="text-ink-muted leading-relaxed">
            {isEs
              ? 'Creemos que el retail físico sigue siendo poderoso — pero necesita herramientas del siglo XXI. Un local bien elegido puede transformar una marca. Y un centro comercial con todos sus espacios ocupados beneficia a todos: visitantes, comerciantes y la economía local.'
              : 'We believe physical retail is still powerful — but it needs 21st-century tools. The right space can transform a brand. And a shopping center with all its units occupied benefits everyone: visitors, tenants, and the local economy.'}
          </p>
        </section>

        {/* Three pillars */}
        <section>
          <h2 className="text-xl font-bold text-ink mb-6">
            {isEs ? 'Lo que hacemos diferente' : 'What we do differently'}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {[
              {
                icon: Target,
                title: isEs ? 'Especialización' : 'Specialisation',
                desc: isEs
                  ? 'Solo centros comerciales. No locales en calle, no naves industriales. Eso nos permite ofrecer datos únicos: footfall, GLA del centro, microlocalización.'
                  : 'Shopping centers only. No street-level shops, no warehouses. That lets us offer unique data: footfall, center GLA, micro-location.',
              },
              {
                icon: Handshake,
                title: isEs ? 'Contacto directo' : 'Direct contact',
                desc: isEs
                  ? 'Sin intermediarios. Las marcas contactan directamente con los propietarios. Menos fricción, respuestas más rápidas y negociación directa.'
                  : 'No middlemen. Brands contact space owners directly. Less friction, faster responses, and direct negotiation.',
              },
              {
                icon: TrendingUp,
                title: isEs ? 'Tres modelos' : 'Three models',
                desc: isEs
                  ? 'Largo plazo, pop-up y marketing. Porque no todas las marcas necesitan lo mismo, y un mismo espacio puede servir para múltiples propósitos.'
                  : 'Long-term, pop-up, and marketing. Because not every brand needs the same thing, and the same space can serve multiple purposes.',
              },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-stone rounded-2xl p-5">
                <div className="w-10 h-10 rounded-xl bg-forest-light flex items-center justify-center mb-3">
                  <Icon className="h-5 w-5 text-forest" />
                </div>
                <h3 className="font-semibold text-ink mb-2">{title}</h3>
                <p className="text-sm text-ink-muted leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Story */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-ink">
            {isEs ? 'Nuestra historia' : 'Our story'}
          </h2>
          <p className="text-ink-muted leading-relaxed">
            {isEs
              ? 'Lokales nació de una frustración real. Tras hablar con docenas de gestores de centros comerciales y directores de expansión de marcas, descubrimos algo sorprendente: en plena era digital, la búsqueda de espacios en centros seguía haciéndose por teléfono, correo electrónico y ferias del sector. Sin datos comparables. Sin transparencia en precios. Sin forma eficiente de encontrar lo que buscabas.'
              : 'Lokales was born out of a real frustration. After speaking with dozens of shopping center managers and brand expansion directors, we discovered something surprising: in the digital era, finding spaces in shopping centers still happened by phone, email, and trade fairs. No comparable data. No price transparency. No efficient way to find what you needed.'}
          </p>
          <p className="text-ink-muted leading-relaxed">
            {isEs
              ? 'Decidimos construir la herramienta que nadie había construido todavía: un marketplace verticalmente especializado en retail dentro de centros comerciales, con los datos que realmente importan para tomar la mejor decisión.'
              : 'We decided to build the tool nobody had built yet: a vertically-specialised marketplace for retail within shopping centers, with the data that truly matters to make the right decision.'}
          </p>
        </section>

        {/* For whom */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-ink">
            {isEs ? '¿Para quién es Lokales?' : 'Who is Lokales for?'}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="border border-warm-border rounded-2xl p-5 bg-white">
              <h3 className="font-semibold text-ink mb-2">
                {isEs ? 'Marcas y negocios' : 'Brands & businesses'}
              </h3>
              <p className="text-sm text-ink-muted leading-relaxed">
                {isEs
                  ? 'Tanto si buscas un espacio permanente para tu tienda como si quieres probar un mercado con un pop-up temporal, Lokales te da acceso a la oferta real de toda España con datos comparables.'
                  : 'Whether you\'re looking for a permanent store or want to test a market with a temporary pop-up, Lokales gives you access to Spain\'s real supply with comparable data.'}
              </p>
            </div>
            <div className="border border-warm-border rounded-2xl p-5 bg-white">
              <h3 className="font-semibold text-ink mb-2">
                {isEs ? 'Centros comerciales y propietarios' : 'Shopping centers & owners'}
              </h3>
              <p className="text-sm text-ink-muted leading-relaxed">
                {isEs
                  ? 'Publica tus espacios disponibles gratis, recibe consultas directas de marcas cualificadas y gestiona todo desde tu panel. Sin comisiones por transacción.'
                  : 'List your available spaces for free, receive direct inquiries from qualified brands, and manage everything from your dashboard. No transaction commissions.'}
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-forest rounded-3xl px-8 py-10 text-center">
          <h2 className="text-2xl font-bold text-white mb-3">
            {isEs ? '¿Listo para empezar?' : 'Ready to get started?'}
          </h2>
          <p className="text-forest-light/80 mb-6">
            {isEs
              ? 'Publica tu primer espacio o busca el tuyo hoy mismo.'
              : 'List your first space or find yours today.'}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href={`/${locale}/search`}
              className="inline-flex items-center gap-2 bg-white text-forest font-semibold px-6 py-3 rounded-full text-sm hover:bg-cream transition-colors">
              {isEs ? 'Buscar espacios' : 'Browse spaces'} <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href={`/${locale}/listings/new`}
              className="inline-flex items-center gap-2 border border-white/40 text-white font-semibold px-6 py-3 rounded-full text-sm hover:bg-white/10 transition-colors">
              {isEs ? 'Publicar mi espacio' : 'List my space'}
            </Link>
          </div>
        </section>

      </div>
    </StaticPage>
  )
}
