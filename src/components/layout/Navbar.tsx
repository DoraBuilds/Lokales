'use client'

import Link from 'next/link'
import { useTranslations, useLocale } from 'next-intl'
import { usePathname, useRouter } from 'next/navigation'
import { Building2, Globe, Menu } from 'lucide-react'
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
    <header className="sticky top-0 z-50 w-full border-b border-zinc-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href={`/${locale}`} className="flex items-center gap-2 font-bold text-xl text-blue-600">
            <Building2 className="h-6 w-6" />
            <span>ShopSpace</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href={`/${locale}/search`}
              className="text-sm font-medium text-zinc-600 hover:text-zinc-900 transition-colors"
            >
              {t('search')}
            </Link>
            <Link
              href={`/${locale}/listings/new`}
              className="text-sm font-medium text-zinc-600 hover:text-zinc-900 transition-colors"
            >
              {t('listSpace')}
            </Link>
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {/* Language switcher */}
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button variant="ghost" size="sm" className="gap-2 text-zinc-600" />
                }
              >
                <Globe className="h-4 w-4" />
                <span className="uppercase text-xs font-semibold">{locale}</span>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => switchLocale('en')}>
                  English
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => switchLocale('es')}>
                  Español
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <Button variant="ghost" size="sm" className="gap-2" />
                  }
                >
                  <Avatar className="h-7 w-7">
                    <AvatarFallback className="text-xs bg-blue-100 text-blue-700">
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
                <LinkButton href={`/${locale}/auth/login`} variant="ghost" size="sm">
                  {t('login')}
                </LinkButton>
                <LinkButton href={`/${locale}/auth/signup`} size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                  {t('signup')}
                </LinkButton>
              </div>
            )}

            {/* Mobile menu */}
            <Sheet>
              <SheetTrigger
                render={
                  <Button variant="ghost" size="sm" className="md:hidden" />
                }
              >
                <Menu className="h-5 w-5" />
              </SheetTrigger>
              <SheetContent side="right" className="w-72">
                <div className="flex flex-col gap-4 mt-8">
                  <Link href={`/${locale}/search`} className="text-base font-medium py-2 border-b border-zinc-100">
                    {t('search')}
                  </Link>
                  <Link href={`/${locale}/listings/new`} className="text-base font-medium py-2 border-b border-zinc-100">
                    {t('listSpace')}
                  </Link>
                  {user ? (
                    <>
                      <Link href={`/${locale}/dashboard`} className="text-base font-medium py-2 border-b border-zinc-100">
                        {t('dashboard')}
                      </Link>
                      <Link href={`/${locale}/auth/logout`} className="text-base font-medium py-2 text-red-600">
                        {t('logout')}
                      </Link>
                    </>
                  ) : (
                    <div className="flex flex-col gap-3 mt-2">
                      <LinkButton href={`/${locale}/auth/login`} variant="outline">
                        {t('login')}
                      </LinkButton>
                      <LinkButton href={`/${locale}/auth/signup`} className="bg-blue-600 hover:bg-blue-700 text-white">
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
