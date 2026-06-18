import { StaticPage } from '@/components/layout/StaticPage'
import Link from 'next/link'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  return {
    title: locale === 'es' ? 'Preguntas frecuentes — Lokales' : 'FAQs — Lokales',
    description: locale === 'es'
      ? 'Todo lo que necesitas saber sobre cómo alquilar o publicar espacios comerciales en centros de España.'
      : 'Everything you need to know about renting or listing retail spaces in Spanish shopping centers.',
  }
}

function Accordion({ q, a }: { q: string; a: React.ReactNode }) {
  return (
    <div className="border-b border-warm-border py-5">
      <h3 className="font-semibold text-ink mb-2">{q}</h3>
      <div className="text-sm text-ink-muted leading-relaxed">{a}</div>
    </div>
  )
}

export default async function FaqPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const isEs = locale === 'es'

  return (
    <StaticPage
      title="FAQs"
      subtitle={isEs
        ? 'Respuestas a las preguntas más frecuentes sobre Lokales.'
        : 'Answers to the most common questions about Lokales.'}
    >
      <div className="space-y-12">

        {/* For brands */}
        <section>
          <h2 id="brands" className="text-lg font-bold text-ink mb-2">
            {isEs ? 'Para marcas y negocios' : 'For brands & businesses'}
          </h2>
          <div>
            <Accordion
              q={isEs ? '¿Cómo funciona Lokales?' : 'How does Lokales work?'}
              a={isEs
                ? 'Lokales es un marketplace donde los centros comerciales y propietarios publican sus espacios disponibles. Tú buscas por ciudad, tipo de alquiler y superficie, encuentras el espacio que encaja con tu proyecto y envías una consulta directamente al propietario. Sin intermediarios.'
                : 'Lokales is a marketplace where shopping centers and space owners list their available units. You search by city, rental type, and size, find the space that fits your project, and send an inquiry directly to the owner. No middlemen.'}
            />
            <Accordion
              q={isEs ? '¿Es gratis usar Lokales para buscar espacios?' : 'Is it free to search for spaces on Lokales?'}
              a={isEs
                ? 'Sí, completamente gratis. Crear una cuenta, buscar espacios y enviar consultas a propietarios no tiene ningún coste.'
                : 'Yes, completely free. Creating an account, browsing spaces, and sending inquiries to owners costs nothing.'}
            />
            <Accordion
              q={isEs ? '¿Cuál es la diferencia entre largo plazo, pop-up y marketing?' : 'What is the difference between long-term, pop-up, and marketing?'}
              a={
                <ul className="list-disc list-inside space-y-1">
                  {isEs ? (
                    <>
                      <li><strong>Largo plazo:</strong> contrato de arrendamiento estándar, normalmente mínimo 1 año. Ideal para tiendas permanentes.</li>
                      <li><strong>Pop-up:</strong> ocupación temporal, desde días hasta varios meses. Perfecto para probar un mercado, lanzar una colección o campaña estacional.</li>
                      <li><strong>Marketing:</strong> espacio para stand, isla o activación de marca en zonas de tránsito del centro. Sin necesidad de local cerrado.</li>
                    </>
                  ) : (
                    <>
                      <li><strong>Long-term:</strong> standard lease agreement, typically a minimum of 1 year. Ideal for permanent stores.</li>
                      <li><strong>Pop-up:</strong> temporary occupation, from days to several months. Perfect for testing a market, launching a collection, or a seasonal campaign.</li>
                      <li><strong>Marketing:</strong> space for a stand, island, or brand activation in high-traffic areas. No enclosed unit needed.</li>
                    </>
                  )}
                </ul>
              }
            />
            <Accordion
              q={isEs ? '¿Qué ocurre tras enviar una consulta?' : 'What happens after I send an inquiry?'}
              a={isEs
                ? 'El propietario recibe tu mensaje y tiene un objetivo de respuesta de 24 horas. Si hay interés mutuo, os ponéis en contacto directamente para visita, negociación y firma. Lokales no interviene en la transacción.'
                : 'The owner receives your message and has a 24-hour response target. If there is mutual interest, you connect directly for a visit, negotiation, and signing. Lokales does not intervene in the transaction.'}
            />
            <Accordion
              q={isEs ? '¿Puedo negociar el precio?' : 'Can I negotiate the price?'}
              a={isEs
                ? 'Sí. Los precios publicados son orientativos. La negociación se realiza directamente con el propietario. Para alquileres de largo plazo, es habitual que el precio sea negociable en función del plazo, el tipo de negocio y las condiciones del mercado local.'
                : 'Yes. Published prices are indicative. Negotiation happens directly with the owner. For long-term leases, it is common for the price to be negotiable depending on the term, type of business, and local market conditions.'}
            />
            <Accordion
              q={isEs ? '¿Cómo sé si un espacio sigue disponible?' : 'How do I know if a space is still available?'}
              a={isEs
                ? 'Los propietarios actualizan el estado de sus espacios. Si un espacio aparece como "activo", está disponible en el momento de la consulta. Sin embargo, te recomendamos enviar la consulta pronto si te interesa, ya que los mejores espacios se alquilan rápido.'
                : 'Owners update the status of their spaces. If a space appears as "active", it is available at the time of inquiry. However, we recommend sending your inquiry soon if interested, as the best spaces rent quickly.'}
            />
          </div>
        </section>

        {/* For owners */}
        <section>
          <h2 id="owners" className="text-lg font-bold text-ink mb-2">
            {isEs ? 'Para propietarios y centros comerciales' : 'For owners & shopping centers'}
          </h2>
          <div>
            <Accordion
              q={isEs ? '¿Es gratis publicar en Lokales?' : 'Is it free to list on Lokales?'}
              a={isEs
                ? 'Sí. Publicar espacios en Lokales es completamente gratuito durante el período de lanzamiento. Recibirás consultas directas en tu email sin ningún coste por transacción o comisión.'
                : 'Yes. Listing spaces on Lokales is completely free during our launch period. You will receive direct inquiries to your email with no transaction fees or commission.'}
            />
            <Accordion
              q={isEs ? '¿Qué tipo de espacios puedo publicar?' : 'What types of spaces can I list?'}
              a={isEs
                ? 'Cualquier espacio disponible dentro de un centro comercial: locales cerrados, islas o stands en zonas comunes, espacios en galerías comerciales, corners en grandes superficies, y espacios de almacenamiento o uso mixto.'
                : 'Any available space inside a shopping center: enclosed units, islands or stands in common areas, spaces in commercial galleries, corners in large stores, and storage or mixed-use spaces.'}
            />
            <Accordion
              q={isEs ? '¿Cómo gestiono las consultas que recibo?' : 'How do I manage the inquiries I receive?'}
              a={isEs
                ? 'Cada consulta llega directamente a tu email de registro. También puedes verlas desde tu panel en Lokales. Responde directamente al interesado para avanzar a la fase de visita y negociación.'
                : 'Each inquiry arrives directly to your registered email. You can also view them from your Lokales dashboard. Reply directly to the interested party to advance to the visit and negotiation phase.'}
            />
            <Accordion
              q={isEs ? '¿Puedo publicar varios espacios a la vez?' : 'Can I list multiple spaces at once?'}
              a={isEs
                ? 'Sí, sin límite. Puedes tener tantos anuncios activos como espacios disponibles tengas. Cada espacio tiene su propia página con fotos, descripción, datos del centro y precios.'
                : 'Yes, with no limit. You can have as many active listings as you have available spaces. Each space has its own page with photos, description, center data, and pricing.'}
            />
            <Accordion
              q={isEs ? '¿Cómo edito o desactivo un espacio?' : 'How do I edit or deactivate a space?'}
              a={isEs
                ? 'Desde tu panel, cada espacio tiene un botón de edición. Puedes actualizar fotos, precios, disponibilidad y descripción en cualquier momento. Si el espacio ya está alquilado, puedes marcarlo como inactivo para que no aparezca en búsquedas.'
                : 'From your dashboard, each space has an edit button. You can update photos, prices, availability, and description at any time. If the space is already rented, you can mark it as inactive so it no longer appears in searches.'}
            />
          </div>
        </section>

        {/* Contact CTA */}
        <section className="bg-stone rounded-2xl p-6 text-center">
          <p className="text-sm text-ink-muted mb-3">
            {isEs ? '¿No encuentras lo que buscas?' : "Can't find what you're looking for?"}
          </p>
          <Link href={`/${locale}/contact`}
            className="inline-flex items-center gap-2 bg-forest text-white font-semibold px-5 py-2.5 rounded-full text-sm hover:bg-forest-mid transition-colors">
            {isEs ? 'Contáctanos' : 'Contact us'}
          </Link>
        </section>

      </div>
    </StaticPage>
  )
}
