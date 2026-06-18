import { StaticPage } from '@/components/layout/StaticPage'
import Link from 'next/link'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  return {
    title: locale === 'es' ? 'Política de cookies — Lokales' : 'Cookie policy — Lokales',
  }
}

export default async function CookiesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const isEs = locale === 'es'

  return (
    <StaticPage
      title={isEs ? 'Política de cookies' : 'Cookie policy'}
      subtitle={isEs ? 'Última actualización: mayo de 2026' : 'Last updated: May 2026'}
    >
      <div className="space-y-8 text-sm text-ink-muted leading-relaxed">
        {isEs ? (
          <>
            <section className="space-y-2">
              <h2 className="text-lg font-bold text-ink">¿Qué es una cookie?</h2>
              <p>Una cookie es un pequeño archivo de texto que un sitio web almacena en tu dispositivo cuando lo visitas. Se usa para que el sitio funcione correctamente, para recordar tus preferencias y para analizar cómo se usa el sitio.</p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-ink">Cookies que usamos</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-xs border-collapse">
                  <thead>
                    <tr className="bg-stone">
                      <th className="text-left px-3 py-2 rounded-tl-xl font-semibold text-ink">Cookie</th>
                      <th className="text-left px-3 py-2 font-semibold text-ink">Tipo</th>
                      <th className="text-left px-3 py-2 font-semibold text-ink">Finalidad</th>
                      <th className="text-left px-3 py-2 rounded-tr-xl font-semibold text-ink">Duración</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { name: 'sb-*', type: 'Esencial', purpose: 'Autenticación de sesión (Supabase)', duration: 'Sesión / 1 año' },
                      { name: 'lokales-locale', type: 'Funcional', purpose: 'Recordar tu idioma preferido', duration: '1 año' },
                    ].map((row) => (
                      <tr key={row.name} className="border-t border-warm-border">
                        <td className="px-3 py-2 font-mono">{row.name}</td>
                        <td className="px-3 py-2">{row.type}</td>
                        <td className="px-3 py-2">{row.purpose}</td>
                        <td className="px-3 py-2">{row.duration}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p>Actualmente <strong>no usamos cookies de publicidad ni de rastreo de terceros</strong>.</p>
            </section>

            <section className="space-y-2">
              <h2 className="text-lg font-bold text-ink">Cómo gestionar las cookies</h2>
              <p>Puedes configurar tu navegador para rechazar o eliminar cookies. Ten en cuenta que desactivar las cookies esenciales puede impedir el correcto funcionamiento del sitio (no podrás iniciar sesión, por ejemplo).</p>
              <p>Guías para los principales navegadores: <a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noreferrer" className="text-forest hover:underline">Chrome</a>, <a href="https://support.mozilla.org/kb/enhanced-tracking-protection-firefox" target="_blank" rel="noreferrer" className="text-forest hover:underline">Firefox</a>, <a href="https://support.apple.com/guide/safari/manage-cookies-sfri11471" target="_blank" rel="noreferrer" className="text-forest hover:underline">Safari</a>.</p>
            </section>

            <section className="space-y-2">
              <h2 className="text-lg font-bold text-ink">Más información</h2>
              <p>Para más información sobre cómo tratamos tus datos, consulta nuestra <Link href={`/${locale}/privacy`} className="text-forest hover:underline">política de privacidad</Link>. Para cualquier duda: <a href="mailto:privacidad@lokales.es" className="text-forest hover:underline">privacidad@lokales.es</a>.</p>
            </section>
          </>
        ) : (
          <>
            <section className="space-y-2">
              <h2 className="text-lg font-bold text-ink">What is a cookie?</h2>
              <p>A cookie is a small text file that a website stores on your device when you visit it. It is used to make the site work correctly, remember your preferences, and analyse how the site is used.</p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-ink">Cookies we use</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-xs border-collapse">
                  <thead>
                    <tr className="bg-stone">
                      <th className="text-left px-3 py-2 rounded-tl-xl font-semibold text-ink">Cookie</th>
                      <th className="text-left px-3 py-2 font-semibold text-ink">Type</th>
                      <th className="text-left px-3 py-2 font-semibold text-ink">Purpose</th>
                      <th className="text-left px-3 py-2 rounded-tr-xl font-semibold text-ink">Duration</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { name: 'sb-*', type: 'Essential', purpose: 'Session authentication (Supabase)', duration: 'Session / 1 year' },
                      { name: 'lokales-locale', type: 'Functional', purpose: 'Remember your language preference', duration: '1 year' },
                    ].map((row) => (
                      <tr key={row.name} className="border-t border-warm-border">
                        <td className="px-3 py-2 font-mono">{row.name}</td>
                        <td className="px-3 py-2">{row.type}</td>
                        <td className="px-3 py-2">{row.purpose}</td>
                        <td className="px-3 py-2">{row.duration}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p>We currently <strong>do not use advertising or third-party tracking cookies</strong>.</p>
            </section>

            <section className="space-y-2">
              <h2 className="text-lg font-bold text-ink">How to manage cookies</h2>
              <p>You can configure your browser to reject or delete cookies. Note that disabling essential cookies may prevent the site from working correctly (you will not be able to log in, for example).</p>
              <p>Guides for major browsers: <a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noreferrer" className="text-forest hover:underline">Chrome</a>, <a href="https://support.mozilla.org/kb/enhanced-tracking-protection-firefox" target="_blank" rel="noreferrer" className="text-forest hover:underline">Firefox</a>, <a href="https://support.apple.com/guide/safari/manage-cookies-sfri11471" target="_blank" rel="noreferrer" className="text-forest hover:underline">Safari</a>.</p>
            </section>

            <section className="space-y-2">
              <h2 className="text-lg font-bold text-ink">More information</h2>
              <p>For more information on how we handle your data, see our <Link href={`/${locale}/privacy`} className="text-forest hover:underline">privacy policy</Link>. For any questions: <a href="mailto:privacy@lokales.es" className="text-forest hover:underline">privacy@lokales.es</a>.</p>
            </section>
          </>
        )}
      </div>
    </StaticPage>
  )
}
