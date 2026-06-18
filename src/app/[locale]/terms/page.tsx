import { StaticPage } from '@/components/layout/StaticPage'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  return {
    title: locale === 'es' ? 'Términos de uso — Lokales' : 'Terms of use — Lokales',
  }
}

export default async function TermsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const isEs = locale === 'es'

  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <section className="space-y-3">
      <h2 className="text-lg font-bold text-ink">{title}</h2>
      <div className="text-sm text-ink-muted leading-relaxed space-y-2">{children}</div>
    </section>
  )

  return (
    <StaticPage
      title={isEs ? 'Términos de uso' : 'Terms of use'}
      subtitle={isEs ? 'Última actualización: mayo de 2026' : 'Last updated: May 2026'}
    >
      <div className="space-y-10">
        {isEs ? (
          <>
            <Section title="1. Descripción del servicio">
              <p>Lokales es una plataforma online de clasificados que permite a propietarios de espacios comerciales publicar anuncios y a marcas o negocios contactar con ellos directamente. Lokales actúa únicamente como intermediario tecnológico: no somos parte en ningún contrato de arrendamiento ni transacción entre usuarios.</p>
            </Section>

            <Section title="2. Aceptación de los términos">
              <p>Al usar Lokales, aceptas estos términos. Si no estás de acuerdo, no uses el servicio. Nos reservamos el derecho a modificarlos con previo aviso por email.</p>
            </Section>

            <Section title="3. Registro y cuenta">
              <p>Para publicar anuncios debes registrarte con datos verídicos. Eres responsable de mantener la confidencialidad de tu contraseña. Notifícanos inmediatamente si detectas un uso no autorizado de tu cuenta en <a href="mailto:hola@lokales.es" className="text-forest hover:underline">hola@lokales.es</a>.</p>
            </Section>

            <Section title="4. Publicación de anuncios">
              <ul className="list-disc list-inside space-y-1">
                <li>Los anuncios deben ser verídicos y referirse a espacios de los que el publicador tiene derecho de disposición.</li>
                <li>Queda prohibido publicar información falsa, engañosa o que infrinja derechos de terceros.</li>
                <li>Lokales puede eliminar anuncios que incumplan estas condiciones sin previo aviso.</li>
                <li>El publicador es responsable del contenido de su anuncio y de las negociaciones con los interesados.</li>
              </ul>
            </Section>

            <Section title="5. Consultas y transacciones">
              <p>Lokales facilita el primer contacto entre partes, pero no interviene en la negociación, redacción de contratos ni en la transacción económica. Cualquier acuerdo alcanzado es exclusivamente entre el propietario y el interesado. Lokales no garantiza que se llegue a un acuerdo ni que los espacios estén disponibles en el momento de la consulta.</p>
            </Section>

            <Section title="6. Conducta prohibida">
              <ul className="list-disc list-inside space-y-1">
                <li>Usar la plataforma para fines distintos a la búsqueda o publicación de espacios comerciales.</li>
                <li>Extraer datos de forma automatizada (scraping) sin permiso expreso.</li>
                <li>Crear cuentas falsas o suplantar identidades.</li>
                <li>Publicar contenido ilegal, difamatorio u obsceno.</li>
              </ul>
            </Section>

            <Section title="7. Propiedad intelectual">
              <p>Lokales y su logotipo son marca de la empresa. Las fotos y textos que publicas son de tu propiedad, pero nos concedes una licencia no exclusiva para mostrarlos en la plataforma mientras el anuncio esté activo.</p>
            </Section>

            <Section title="8. Limitación de responsabilidad">
              <p>Lokales no se responsabiliza de daños derivados del uso de la plataforma, de acuerdos entre usuarios, de la inexactitud de la información publicada por propietarios, ni de interrupciones del servicio. La plataforma se ofrece "tal cual", sin garantías de disponibilidad continua.</p>
            </Section>

            <Section title="9. Ley aplicable y jurisdicción">
              <p>Estos términos se rigen por la legislación española. Para cualquier controversia, las partes se someten a los juzgados y tribunales de Madrid, salvo que la ley aplicable establezca otro fuero.</p>
            </Section>

            <Section title="10. Contacto">
              <p>Para cualquier cuestión sobre estos términos: <a href="mailto:hola@lokales.es" className="text-forest hover:underline">hola@lokales.es</a>.</p>
            </Section>
          </>
        ) : (
          <>
            <Section title="1. Service description">
              <p>Lokales is an online classifieds platform that allows commercial space owners to publish listings and brands or businesses to contact them directly. Lokales acts solely as a technology intermediary: we are not a party to any lease agreement or transaction between users.</p>
            </Section>

            <Section title="2. Acceptance of terms">
              <p>By using Lokales, you accept these terms. If you disagree, do not use the service. We reserve the right to modify them with prior email notice.</p>
            </Section>

            <Section title="3. Registration and account">
              <p>To publish listings you must register with truthful information. You are responsible for maintaining the confidentiality of your password. Notify us immediately of any unauthorized use of your account at <a href="mailto:hello@lokales.es" className="text-forest hover:underline">hello@lokales.es</a>.</p>
            </Section>

            <Section title="4. Listing spaces">
              <ul className="list-disc list-inside space-y-1">
                <li>Listings must be truthful and refer to spaces the publisher has the right to let.</li>
                <li>It is prohibited to publish false, misleading, or third-party rights-infringing information.</li>
                <li>Lokales may remove listings that violate these conditions without prior notice.</li>
                <li>The publisher is responsible for their listing content and negotiations with interested parties.</li>
              </ul>
            </Section>

            <Section title="5. Inquiries and transactions">
              <p>Lokales facilitates initial contact between parties but does not intervene in negotiation, contract drafting, or the financial transaction. Any agreement reached is exclusively between the owner and the interested party. Lokales does not guarantee that an agreement will be reached or that spaces will be available at the time of inquiry.</p>
            </Section>

            <Section title="6. Prohibited conduct">
              <ul className="list-disc list-inside space-y-1">
                <li>Using the platform for purposes other than searching or listing commercial spaces.</li>
                <li>Extracting data automatically (scraping) without express permission.</li>
                <li>Creating fake accounts or impersonating others.</li>
                <li>Publishing illegal, defamatory, or obscene content.</li>
              </ul>
            </Section>

            <Section title="7. Intellectual property">
              <p>Lokales and its logo are trademarks of the company. Photos and text you publish remain your property, but you grant us a non-exclusive licence to display them on the platform while the listing is active.</p>
            </Section>

            <Section title="8. Limitation of liability">
              <p>Lokales is not responsible for damages arising from use of the platform, agreements between users, inaccuracy of information published by owners, or service interruptions. The platform is provided "as is", without guarantees of continuous availability.</p>
            </Section>

            <Section title="9. Governing law and jurisdiction">
              <p>These terms are governed by Spanish law. For any dispute, the parties submit to the courts of Madrid, unless applicable law provides otherwise.</p>
            </Section>

            <Section title="10. Contact">
              <p>For any questions about these terms: <a href="mailto:hello@lokales.es" className="text-forest hover:underline">hello@lokales.es</a>.</p>
            </Section>
          </>
        )}
      </div>
    </StaticPage>
  )
}
