import { StaticPage } from '@/components/layout/StaticPage'
import Link from 'next/link'
import { ArrowRight, Calendar } from 'lucide-react'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  return {
    title: locale === 'es' ? 'Blog — Lokales' : 'Blog — Lokales',
    description: locale === 'es'
      ? 'Artículos sobre retail, centros comerciales y tendencias del mercado de espacios en España.'
      : 'Articles about retail, shopping centers, and space market trends in Spain.',
  }
}

const POSTS_EN = [
  {
    slug: 'pop-up-retail-spain-2026',
    date: 'May 2026',
    tag: 'Trends',
    title: 'Why pop-up retail is booming in Spanish shopping centers',
    excerpt: 'After years of post-pandemic adjustment, Spanish shopping centers are embracing temporary retail as a strategic tool — not just a gap-filler. Here is what is driving the shift and what it means for brands.',
  },
  {
    slug: 'how-to-choose-retail-space',
    date: 'April 2026',
    tag: 'Guide',
    title: 'How to choose the right retail space in a shopping center: 7 things to check',
    excerpt: 'Location within a center matters as much as the center itself. Footfall counts, floor level, façade width, proximity to anchor tenants — here is the checklist every brand should run before signing.',
  },
  {
    slug: 'marketing-spaces-shopping-centers',
    date: 'March 2026',
    tag: 'Marketing',
    title: 'Marketing activations inside shopping centers: formats, pricing, and what actually works',
    excerpt: 'Islands, stands, digital screens, sampling zones. Marketing spaces in shopping centers offer brands direct access to a captive audience. This guide breaks down the formats and how to make them work.',
  },
]

const POSTS_ES = [
  {
    slug: 'pop-up-retail-spain-2026',
    date: 'Mayo 2026',
    tag: 'Tendencias',
    title: 'Por qué el retail pop-up está en auge en los centros comerciales españoles',
    excerpt: 'Tras los años de ajuste post-pandemia, los centros comerciales en España están adoptando el retail temporal como una herramienta estratégica, no solo como solución de emergencia. Analizamos qué está impulsando el cambio y qué significa para las marcas.',
  },
  {
    slug: 'how-to-choose-retail-space',
    date: 'Abril 2026',
    tag: 'Guía',
    title: 'Cómo elegir el espacio comercial adecuado en un centro: 7 aspectos a verificar',
    excerpt: 'La ubicación dentro del centro importa tanto como el propio centro. Afluencia, planta, metros de fachada, proximidad a anclas — esta es la lista de control que toda marca debería revisar antes de firmar.',
  },
  {
    slug: 'marketing-spaces-shopping-centers',
    date: 'Marzo 2026',
    tag: 'Marketing',
    title: 'Activaciones de marketing en centros comerciales: formatos, precios y qué funciona de verdad',
    excerpt: 'Islas, stands, pantallas digitales, zonas de sampling. Los espacios de marketing en centros comerciales ofrecen a las marcas acceso directo a un público cautivo. Desglosamos los formatos y cómo sacarles partido.',
  },
]

export default async function BlogPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const isEs = locale === 'es'
  const posts = isEs ? POSTS_ES : POSTS_EN

  return (
    <StaticPage
      title="Blog"
      subtitle={isEs
        ? 'Perspectivas sobre retail, centros comerciales y el mercado de espacios en España.'
        : 'Insights on retail, shopping centers, and the space market in Spain.'}
    >
      <div className="space-y-6">
        {posts.map((post) => (
          <article key={post.slug} className="border border-warm-border rounded-3xl bg-white p-7 hover:border-forest/30 hover:shadow-sm transition-all group">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-forest-light text-forest">
                {post.tag}
              </span>
              <span className="flex items-center gap-1 text-xs text-ink-subtle">
                <Calendar className="h-3 w-3" /> {post.date}
              </span>
            </div>
            <h2 className="text-lg font-bold text-ink mb-2 group-hover:text-forest transition-colors">
              {post.title}
            </h2>
            <p className="text-sm text-ink-muted leading-relaxed mb-4">{post.excerpt}</p>
            <Link
              href={`/${locale}/blog/${post.slug}`}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-forest hover:underline"
            >
              {isEs ? 'Leer más' : 'Read more'} <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </article>
        ))}
      </div>
    </StaticPage>
  )
}
