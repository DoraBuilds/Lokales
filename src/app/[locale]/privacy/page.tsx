import { StaticPage } from '@/components/layout/StaticPage'
import Link from 'next/link'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  return {
    title: locale === 'es' ? 'Política de privacidad — Lokales' : 'Privacy policy — Lokales',
  }
}

export default async function PrivacyPage({ params }: { params: Promise<{ locale: string }> }) {
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
      title={isEs ? 'Política de privacidad' : 'Privacy policy'}
      subtitle={isEs ? 'Última actualización: mayo de 2026' : 'Last updated: May 2026'}
    >
      <div className="space-y-10">

        {isEs ? (
          <>
            <Section title="1. Responsable del tratamiento">
              <p>El responsable del tratamiento de tus datos personales es <strong>Lokales</strong> (en adelante, "nosotros", "la empresa"), con email de contacto <a href="mailto:privacidad@lokales.es" className="text-forest hover:underline">privacidad@lokales.es</a>.</p>
            </Section>

            <Section title="2. Qué datos recogemos">
              <p>Recogemos los siguientes datos personales:</p>
              <ul className="list-disc list-inside space-y-1">
                <li><strong>Datos de registro:</strong> nombre, dirección de email y contraseña (cifrada).</li>
                <li><strong>Datos de anuncios:</strong> información sobre tus espacios, incluidas fotos, precios y localización.</li>
                <li><strong>Datos de consultas:</strong> mensajes que envías a propietarios de espacios.</li>
                <li><strong>Newsletter:</strong> email si te suscribes a nuestro boletín.</li>
                <li><strong>Datos técnicos:</strong> dirección IP, navegador, cookies de sesión. Ver <Link href={`/${locale}/cookies`} className="text-forest hover:underline">política de cookies</Link>.</li>
              </ul>
            </Section>

            <Section title="3. Finalidad del tratamiento">
              <ul className="list-disc list-inside space-y-1">
                <li>Gestionar tu cuenta y acceso a la plataforma.</li>
                <li>Publicar y gestionar tus anuncios de espacios comerciales.</li>
                <li>Facilitar el contacto entre marcas y propietarios de espacios.</li>
                <li>Enviarte el boletín de novedades (si te has suscrito).</li>
                <li>Mejorar el servicio mediante análisis de uso agregado y anonimizado.</li>
                <li>Cumplir con obligaciones legales.</li>
              </ul>
            </Section>

            <Section title="4. Base legal">
              <p>El tratamiento se basa en: (a) la ejecución del contrato de servicio que aceptas al registrarte; (b) tu consentimiento explícito para la newsletter y cookies no esenciales; (c) el cumplimiento de obligaciones legales.</p>
            </Section>

            <Section title="5. Conservación de datos">
              <p>Conservamos tus datos mientras mantengas una cuenta activa en Lokales. Si eliminas tu cuenta, tus datos se borran en un plazo de 30 días, excepto los que debamos conservar por obligación legal (hasta 5 años para datos fiscales).</p>
            </Section>

            <Section title="6. Compartición de datos">
              <p>No vendemos tus datos personales a terceros. Solo los compartimos en los siguientes casos:</p>
              <ul className="list-disc list-inside space-y-1">
                <li><strong>Con propietarios de espacios:</strong> cuando envías una consulta, tus datos de contacto se comparten con el propietario del espacio.</li>
                <li><strong>Proveedores de servicio:</strong> Supabase (base de datos y autenticación), alojados en la UE.</li>
                <li><strong>Obligación legal:</strong> cuando lo exija la ley o una resolución judicial.</li>
              </ul>
            </Section>

            <Section title="7. Tus derechos (RGPD)">
              <p>Como residente de la UE, tienes derecho a: acceder a tus datos, rectificarlos, suprimirlos ("derecho al olvido"), limitar u oponerte al tratamiento, y a la portabilidad de datos. Ejerce estos derechos escribiendo a <a href="mailto:privacidad@lokales.es" className="text-forest hover:underline">privacidad@lokales.es</a>. También puedes presentar una reclamación ante la Agencia Española de Protección de Datos (AEPD).</p>
            </Section>

            <Section title="8. Transferencias internacionales">
              <p>Tus datos se almacenan en servidores dentro de la Unión Europea. No realizamos transferencias a terceros países sin las garantías adecuadas.</p>
            </Section>

            <Section title="9. Seguridad">
              <p>Utilizamos medidas técnicas y organizativas adecuadas para proteger tus datos: cifrado en tránsito (HTTPS), contraseñas almacenadas mediante hash seguro y acceso restringido a los datos por parte del personal.</p>
            </Section>

            <Section title="10. Cambios en esta política">
              <p>Podemos actualizar esta política. Si los cambios son significativos, te notificaremos por email. La fecha de "última actualización" en la cabecera refleja la versión vigente.</p>
            </Section>
          </>
        ) : (
          <>
            <Section title="1. Data controller">
              <p>The data controller for your personal data is <strong>Lokales</strong> (hereinafter "we", "us", "the company"), contact email: <a href="mailto:privacy@lokales.es" className="text-forest hover:underline">privacy@lokales.es</a>.</p>
            </Section>

            <Section title="2. What data we collect">
              <p>We collect the following personal data:</p>
              <ul className="list-disc list-inside space-y-1">
                <li><strong>Registration data:</strong> name, email address, and password (encrypted).</li>
                <li><strong>Listing data:</strong> information about your spaces, including photos, prices, and location.</li>
                <li><strong>Inquiry data:</strong> messages you send to space owners.</li>
                <li><strong>Newsletter:</strong> email address if you subscribe to our newsletter.</li>
                <li><strong>Technical data:</strong> IP address, browser, session cookies. See our <Link href={`/${locale}/cookies`} className="text-forest hover:underline">cookie policy</Link>.</li>
              </ul>
            </Section>

            <Section title="3. Purpose of processing">
              <ul className="list-disc list-inside space-y-1">
                <li>Managing your account and access to the platform.</li>
                <li>Publishing and managing your commercial space listings.</li>
                <li>Facilitating contact between brands and space owners.</li>
                <li>Sending you newsletter updates (if subscribed).</li>
                <li>Improving the service through aggregated, anonymised usage analysis.</li>
                <li>Complying with legal obligations.</li>
              </ul>
            </Section>

            <Section title="4. Legal basis">
              <p>Processing is based on: (a) performance of the service contract you accept upon registration; (b) your explicit consent for newsletter and non-essential cookies; (c) compliance with legal obligations.</p>
            </Section>

            <Section title="5. Data retention">
              <p>We retain your data as long as you maintain an active account on Lokales. If you delete your account, your data is deleted within 30 days, except data we must retain for legal obligations (up to 5 years for tax records).</p>
            </Section>

            <Section title="6. Data sharing">
              <p>We do not sell your personal data to third parties. We only share it in the following cases:</p>
              <ul className="list-disc list-inside space-y-1">
                <li><strong>With space owners:</strong> when you send an inquiry, your contact details are shared with the space owner.</li>
                <li><strong>Service providers:</strong> Supabase (database and authentication), hosted in the EU.</li>
                <li><strong>Legal obligation:</strong> when required by law or a court order.</li>
              </ul>
            </Section>

            <Section title="7. Your rights (GDPR)">
              <p>As an EU resident, you have the right to: access your data, rectify it, erase it ("right to be forgotten"), restrict or object to processing, and data portability. Exercise these rights by writing to <a href="mailto:privacy@lokales.es" className="text-forest hover:underline">privacy@lokales.es</a>. You may also lodge a complaint with the Spanish Data Protection Agency (AEPD).</p>
            </Section>

            <Section title="8. International transfers">
              <p>Your data is stored on servers within the European Union. We do not transfer data to third countries without appropriate safeguards.</p>
            </Section>

            <Section title="9. Security">
              <p>We use appropriate technical and organisational measures to protect your data: encryption in transit (HTTPS), passwords stored using secure hashing, and restricted staff access to data.</p>
            </Section>

            <Section title="10. Changes to this policy">
              <p>We may update this policy. If changes are significant, we will notify you by email. The "last updated" date in the header reflects the current version.</p>
            </Section>
          </>
        )}

      </div>
    </StaticPage>
  )
}
