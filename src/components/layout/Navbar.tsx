'use client'

import Link from 'next/link'
import { useTranslations, useLocale } from 'next-intl'
import { usePathname, useRouter } from 'next/navigation'
import { Globe, Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { LinkButton } from '@/components/ui/link-button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'

interface NavbarProps {
  user?: { name: string; email: string } | null
}

export function Navbar({ user }: NavbarProps) {
  const t = useTranslations('nav')
  const locale = useLocale()
  const pathname = usePathname()
  const router = useRouter()

  function switchLocale(newLocale: string) {
    const segments = pathname.split('/')
    segments[1] = newLocale
    router.push(segments.join('/'))
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-warm-border bg-cream/95 backdrop-blur supports-[backdrop-filter]:bg-cream/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">

          {/* Logo */}
          <Link href={`/${locale}`} className="flex items-center gap-2">
            <span className="text-xl font-bold tracking-tight text-forest">Lokales</span>
          </Link>

          {/* Desktop nav — intentionally empty; CTA is in the right cluster */}
          <nav className="hidden md:flex items-center" />

          {/* Right side */}
          <div className="flex items-center gap-3">

            {/* List a space CTA */}
            <LinkButton
              href={`/${locale}/listings/new`}
              className="hidden md:inline-flex bg-forest hover:bg-forest-mid text-white font-semibold rounded-full px-5 py-2 text-sm items-center gap-1.5"
            >
              {t('listSpace')}
            </LinkButton>

            {/* Language switcher */}
            <DropdownMenu>
              <DropdownMenuTrigger
                render={<Button variant="ghost" size="sm" className="gap-1.5 text-ink-muted font-medium" />}
              >
                <Globe className="h-3.5 w-3.5" />
                <span className="uppercase text-xs">{locale}</span>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => switchLocale('en')}>English</DropdownMenuItem>
                <DropdownMenuItem onClick={() => switchLocale('es')}>Español</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={<Button variant="ghost" size="sm" className="gap-2 pl-1" />}
                >
                  <Avatar className="h-7 w-7">
                    <AvatarFallback className="text-xs bg-forest-light text-forest font-semibold">
                      {user.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden md:block text-sm font-medium">{user.name}</span>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem>
                    <Link href={`/${locale}/dashboard`} className="w-full">{t('dashboard')}</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href={`/${locale}/dashboard?tab=saved`} className="w-full">{t('savedSpaces')}</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-red-600">
                    <Link href={`/${locale}/auth/logout`} className="w-full">{t('logout')}</Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <LinkButton href={`/${locale}/auth/login`} variant="ghost" size="sm" className="text-ink font-medium">
                  {t('login')}
                </LinkButton>
                <LinkButton
                  href={`/${locale}/auth/signup`}
                  size="sm"
                  className="bg-forest hover:bg-forest-mid text-white font-semibold rounded-full px-5"
                >
                  {t('signup')}
                </LinkButton>
              </div>
            )}

            {/* Mobile menu */}
            <Sheet>
              <SheetTrigger
                render={<Button variant="ghost" size="sm" className="md:hidden" />}
              >
                <Menu className="h-5 w-5" />
              </SheetTrigger>
              <SheetContent side="right" className="w-72 bg-cream">
                <div className="flex flex-col gap-1 mt-10 px-2">
                  <LinkButton
                    href={`/${locale}/listings/new`}
                    className="justify-center bg-forest hover:bg-forest-mid text-white rounded-full font-semibold py-3 text-sm mb-2"
                  >
                    {t('listSpace')}
                  </LinkButton>
                  {user ? (
                    <>
                      <Link href={`/${locale}/dashboard`} className="text-base font-medium py-3 px-3 rounded-xl hover:bg-stone transition-colors">
                        {t('dashboard')}
                      </Link>
                      <Link href={`/${locale}/auth/logout`} className="text-base font-medium py-3 px-3 rounded-xl text-red-600 hover:bg-red-50 transition-colors">
                        {t('logout')}
                      </Link>
                    </>
                  ) : (
                    <div className="flex flex-col gap-3 mt-4 pt-4 border-t border-warm-border">
                      <LinkButton href={`/${locale}/auth/login`} variant="outline" className="justify-center rounded-full">
                        {t('login')}
                      </LinkButton>
                      <LinkButton href={`/${locale}/auth/signup`} className="justify-center bg-forest hover:bg-forest-mid text-white rounded-full font-semibold">
                        {t('signup')}
                      </LinkButton>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}
