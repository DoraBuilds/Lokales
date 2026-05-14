import { getTranslations } from 'next-intl/server'
import Link from 'next/link'
import { login } from '@/lib/auth-actions'

export default async function LoginPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ error?: string; next?: string }>
}) {
  const { locale } = await params
  const { error, next } = await searchParams
  const t = await getTranslations({ locale, namespace: 'auth.login' })

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <Link href={`/${locale}`} className="text-2xl font-bold text-forest tracking-tight">
            Lokales
          </Link>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-warm-border">
          <h1 className="text-2xl font-bold text-ink mb-1">{t('title')}</h1>
          <p className="text-sm text-ink-muted mb-7">{t('subtitle')}</p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-2xl px-4 py-3 mb-5">
              {decodeURIComponent(error)}
            </div>
          )}

          <form action={login} className="space-y-4">
            <input type="hidden" name="locale" value={locale} />
            {next && <input type="hidden" name="next" value={next} />}

            <div>
              <label className="block text-xs font-semibold text-ink-muted uppercase tracking-widest mb-1.5">
                {t('email')}
              </label>
              <input
                type="email"
                name="email"
                required
                autoComplete="email"
                className="w-full bg-cream border border-warm-border rounded-2xl px-4 py-3 text-sm text-ink placeholder:text-ink-subtle outline-none focus:border-forest transition-colors"
                placeholder="you@brand.com"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-ink-muted uppercase tracking-widest">
                  {t('password')}
                </label>
                <Link
                  href={`/${locale}/auth/forgot-password`}
                  className="text-xs text-ink-muted hover:text-forest transition-colors"
                >
                  {t('forgotPassword')}
                </Link>
              </div>
              <input
                type="password"
                name="password"
                required
                autoComplete="current-password"
                className="w-full bg-cream border border-warm-border rounded-2xl px-4 py-3 text-sm text-ink outline-none focus:border-forest transition-colors"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-forest hover:bg-forest-mid text-white font-semibold text-sm py-3.5 rounded-full transition-colors mt-2"
            >
              {t('submit')}
            </button>
          </form>
        </div>

        {/* Switch to signup */}
        <p className="text-center text-sm text-ink-muted mt-6">
          {t('noAccount')}{' '}
          <Link
            href={`/${locale}/auth/signup`}
            className="font-semibold text-forest hover:underline"
          >
            {t('signupLink')}
          </Link>
        </p>

      </div>
    </div>
  )
}
