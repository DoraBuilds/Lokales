import { NavbarServer } from '@/components/layout/NavbarServer'
import { Footer } from '@/components/layout/Footer'

export function StaticPage({
  title,
  subtitle,
  children,
}: {
  title: string
  subtitle?: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col min-h-screen bg-cream">
      <NavbarServer />
      <main className="flex-1">
        <div className="bg-forest py-14 px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl font-extrabold text-white">{title}</h1>
            {subtitle && <p className="text-forest-light/80 mt-2 text-base">{subtitle}</p>}
          </div>
        </div>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="prose-lokales">{children}</div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
