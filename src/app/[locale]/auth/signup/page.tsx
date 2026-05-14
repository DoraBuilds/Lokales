import { getTranslations } from 'next-intl/server'
import Link from 'next/link'
import { signup } from '@/lib/auth-actions'

export default async function SignupPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ error?: string }>
}) {
  const { locale } = await params
  const { error } = await searchParams
  const t = await getTranslations({ locale, namespace: 'auth.signup' })

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

          <form action={signup} className="space-y-4">
            <input type="hidden" name="locale" value={locale} />

            <div>
              <label className="block text-xs font-semibold text-ink-muted uppercase tracking-widest mb-1.5">
                {t('name')}
              </label>
              <input
                type="text"
                name="name"
                required
                autoComplete="name"
                className="w-full bg-cream border border-warm-border rounded-2xl px-4 py-3 text-sm text-ink placeholder:text-ink-subtle outline-none focus:border-forest transition-colors"
                placeholder="Ana García"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink-muted uppercase tracking-widest mb-1.5">
                {t('companyName')}
              </label>
              <input
                type="text"
                name="company_name"
                autoComplete="organization"
                className="w-full bg-cream border border-warm-border rounded-2xl px-4 py-3 text-sm text-ink placeholder:text-ink-subtle outline-none focus:border-forest transition-colors"
                placeholder="Mi Empresa S.L."
              />
            </div>

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
              <label className="block text-xs font-semibold text-ink-muted uppercase tracking-widest mb-1.5">
                {t('password')}
              </label>
              <input
                type="password"
                name="password"
                required
                autoComplete="new-password"
                minLength={8}
                className="w-full bg-cream border border-warm-border rounded-2xl px-4 py-3 text-sm text-ink placeholder:text-ink-subtle outline-none focus:border-forest transition-colors"
                placeholder="••••••••"
              />
              <p className="text-xs text-ink-subtle mt-1.5 pl-1">{t('passwordHint')}</p>
            </div>

            <button
              type="submit"
              className="w-full bg-forest hover:bg-forest-mid text-white font-semibold text-sm py-3.5 rounded-full transition-colors mt-2"
            >
              {t('submit')}
            </button>

            <p className="text-xs text-ink-subtle text-center pt-1">{t('terms')}</p>
          </form>
        </div>

        {/* Switch to login */}
        <p className="text-center text-sm text-ink-muted mt-6">
          {t('hasAccount')}{' '}
          <Link
            href={`/${locale}/auth/login`}
            className="font-semibold text-forest hover:underline"
          >
            {t('loginLink')}
          </Link>
        </p>

      </div>
    </div>
  )
}
