import Link from 'next/link'
import { Mail } from 'lucide-react'

export default async function CheckEmailPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ email?: string }>
}) {
  const { locale } = await params
  const { email } = await searchParams
  const isEs = locale === 'es'

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md text-center">

        <Link href={`/${locale}`} className="text-2xl font-bold text-forest tracking-tight block mb-10">
          Lokales
        </Link>

        <div className="bg-white rounded-3xl p-10 shadow-sm border border-warm-border">
          <div className="w-16 h-16 bg-forest-light rounded-full flex items-center justify-center mx-auto mb-6">
            <Mail className="h-8 w-8 text-forest" />
          </div>

          <h1 className="text-2xl font-bold text-ink mb-3">
            {isEs ? 'Revisa tu email' : 'Check your email'}
          </h1>

          <p className="text-sm text-ink-muted leading-relaxed mb-2">
            {isEs
              ? 'Te hemos enviado un enlace de confirmación a:'
              : "We've sent a confirmation link to:"}
          </p>

          {email && (
            <p className="font-semibold text-ink mb-6">{decodeURIComponent(email)}</p>
          )}

          <p className="text-sm text-ink-muted leading-relaxed">
            {isEs
              ? 'Haz clic en el enlace del email para activar tu cuenta y acceder.'
              : 'Click the link in the email to activate your account and sign in.'}
          </p>
        </div>

        <p className="text-sm text-ink-muted mt-6">
          {isEs ? '¿Ya tienes cuenta? ' : 'Already have an account? '}
          <Link href={`/${locale}/auth/login`} className="font-semibold text-forest hover:underline">
            {isEs ? 'Inicia sesión' : 'Log in'}
          </Link>
        </p>

      </div>
    </div>
  )
}
