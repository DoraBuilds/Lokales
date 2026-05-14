import { createServerClient } from '@supabase/ssr'
import createIntlMiddleware from 'next-intl/middleware'
import { NextResponse, type NextRequest } from 'next/server'
import { routing } from './i18n/routing'

const intlMiddleware = createIntlMiddleware(routing)
const PROTECTED = ['/dashboard', '/listings/new']

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const localeSegment = pathname.split('/')[1] ?? 'en'
  const bare = pathname.replace(/^\/(en|es)/, '') || '/'

  // Refresh Supabase session on every request (required by Supabase SSR)
  let response = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (toSet) => {
          toSet.forEach(({ name, value }) => request.cookies.set(name, value))
          response = NextResponse.next({ request })
          toSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  // Redirect unauthenticated users away from protected routes
  if (!user && PROTECTED.some((r) => bare.startsWith(r))) {
    return NextResponse.redirect(
      new URL(
        `/${localeSegment}/auth/login?next=${encodeURIComponent(pathname)}`,
        request.url
      )
    )
  }

  // Run intl routing and carry over any refreshed session cookies
  const intlResponse = intlMiddleware(request)
  response.cookies.getAll().forEach((c) =>
    intlResponse.cookies.set(c.name, c.value, c)
  )
  return intlResponse
}

export const config = {
  matcher: ['/((?!_next|_vercel|.*\\..*).*)', '/api/:path*'],
}
