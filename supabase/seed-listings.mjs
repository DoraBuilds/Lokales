// Seed demo listings into the database.
// Usage: node supabase/seed-listings.mjs
// Requires .env.local with NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY

import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dir = dirname(fileURLToPath(import.meta.url))
const envPath = join(__dir, '../.env.local')
const env = Object.fromEntries(
  readFileSync(envPath, 'utf-8')
    .split('\n')
    .filter(l => l.trim() && !l.startsWith('#') && l.includes('='))
    .map(l => [l.split('=')[0].trim(), l.slice(l.indexOf('=') + 1).trim()])
)

const supabase = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
)

// ── 1. Get or create a demo lister profile ─────────────────────────────────

async function getListerId() {
  const { data: profiles } = await supabase
    .from('profiles').select('id').limit(1)
  if (profiles?.length) {
    console.log('Using existing profile:', profiles[0].id)
    return profiles[0].id
  }

  // Create a demo account
  const email = 'demo-lister@lokales.es'
  const { data: existing } = await supabase.auth.admin.listUsers()
  const found = existing?.users?.find(u => u.email === email)
  if (found) {
    // Ensure profile row exists
    await supabase.from('profiles').upsert({
      id: found.id, name: 'Demo Lister', email
    })
    return found.id
  }

  const { data: created, error } = await supabase.auth.admin.createUser({
    email,
    password: 'demo-lokales-2026',
    email_confirm: true,
    user_metadata: { name: 'Demo Lister' },
  })
  if (error) throw new Error(`Could not create demo user: ${error.message}`)

  await supabase.from('profiles').insert({
    id: created.user.id,
    name: 'Demo Lister',
    email,
  })
  console.log('Created demo lister:', created.user.id)
  return created.user.id
}

// ── 2. Resolve mall IDs by name ────────────────────────────────────────────

async function getMallIds(names) {
  const { data, error } = await supabase
    .from('shopping_centers')
    .select('id, name, city')
    .in('name', names)
  if (error) throw new Error(`Mall lookup failed: ${error.message}`)
  const map = {}
  for (const row of data ?? []) map[row.name] = { id: row.id, city: row.city }
  return map
}

// ── 3. Listing definitions ─────────────────────────────────────────────────

function listings(malls, listerId) {
  const today = new Date().toISOString().split('T')[0]

  const base = (mallName, overrides) => {
    const mall = malls[mallName]
    if (!mall) { console.warn(`⚠️  Mall not found: "${mallName}" — skipping`); return null }
    return {
      shopping_center_id: mall.id,
      lister_id: listerId,
      available_from: today,
      status: 'active',
      amenities: ['electricity', 'wifi'],
      images: [],
      floor_level: 'ground',
      ...overrides,
    }
  }

  return [
    // ── La Maquinista, Barcelona ──────────────────────────────────────────
    base('Westfield La Maquinista', {
      title: 'Local comercial — Planta baja, zona de entrada',
      description: 'Amplio local en la entrada principal con escaparate doble y altísima visibilidad. Ideal para moda, lifestyle o tecnología.',
      size_sqm: 145,
      floor_level: 'ground',
      rental_types: ['long_term'],
      price_monthly: 6800,
      price_per_sqm: 47,
      amenities: ['electricity', 'wifi', 'airConditioning', 'security', 'cctv'],
    }),
    base('Westfield La Maquinista', {
      title: 'Stand de marketing — Pasillo central',
      description: 'Ubicación estratégica en el pasillo central de mayor tráfico. Perfecto para activaciones de marca, degustaciones y lanzamientos.',
      size_sqm: 18,
      floor_level: 'ground',
      rental_types: ['marketing'],
      price_daily_marketing: 320,
      amenities: ['electricity', 'wifi'],
    }),
    base('Westfield La Maquinista', {
      title: 'Pop-up temporal — Zona moda, nivel 1',
      description: 'Espacio diáfano en la planta de moda, rodeado de marcas premium. Ideal para colecciones de temporada o marcas emergentes.',
      size_sqm: 55,
      floor_level: 'first',
      rental_types: ['popup'],
      price_daily_popup: 750,
      amenities: ['electricity', 'wifi', 'airConditioning'],
    }),

    // ── El Corte Inglés Castellana, Madrid ───────────────────────────────
    base('El Corte Inglés Castellana', {
      title: 'Galería premium — Acceso principal',
      description: 'Local de representación en la galería de lujo junto a la entrada principal. Clientela de alto poder adquisitivo, tráfico diario elevado.',
      size_sqm: 90,
      floor_level: 'ground',
      rental_types: ['long_term', 'popup'],
      price_monthly: 9500,
      price_daily_popup: 1200,
      price_per_sqm: 106,
      amenities: ['electricity', 'wifi', 'airConditioning', 'security', 'cctv', 'parking'],
    }),
    base('El Corte Inglés Castellana', {
      title: 'Isleta de marketing — Hall de acceso',
      description: 'Isleta central en el hall de acceso al centro, con flujo de miles de clientes diarios. Perfecta para sampling y activaciones digitales.',
      size_sqm: 12,
      floor_level: 'ground',
      rental_types: ['marketing'],
      price_daily_marketing: 480,
      amenities: ['electricity', 'wifi'],
    }),

    // ── Parquesur, Leganés (Madrid) ───────────────────────────────────────
    base('Westfield Parquesur', {
      title: 'Local en esquina — Nivel 1, zona ocio',
      description: 'Local de esquina con doble escaparate en la planta de ocio. Gran visibilidad y afluencia familiar durante los fines de semana.',
      size_sqm: 210,
      floor_level: 'first',
      rental_types: ['long_term'],
      price_monthly: 5200,
      price_per_sqm: 25,
      amenities: ['electricity', 'wifi', 'airConditioning', 'elevator', 'parking'],
    }),
    base('Westfield Parquesur', {
      title: 'Pop-up junto a sala de cine',
      description: 'Espacio pop-up adyacente a la sala de cine, uno de los puntos con mayor tráfico vespertino del centro. Ideal para entretenimiento y gaming.',
      size_sqm: 35,
      floor_level: 'first',
      rental_types: ['popup'],
      price_daily_popup: 580,
      amenities: ['electricity', 'wifi', 'airConditioning'],
    }),

    // ── Aqua Multiespacio, Valencia ───────────────────────────────────────
    base('Aqua Multiespacio', {
      title: 'Boutique frente al mar',
      description: 'Local de diseño con vistas al Mediterráneo, en el pasaje de marcas lifestyle. Ideal para moda, accesorios y decoración premium.',
      size_sqm: 72,
      floor_level: 'ground',
      rental_types: ['long_term', 'popup'],
      price_monthly: 4100,
      price_daily_popup: 680,
      price_per_sqm: 57,
      amenities: ['electricity', 'wifi', 'airConditioning', 'security'],
    }),
    base('Aqua Multiespacio', {
      title: 'Espacio exterior — Terraza sur',
      description: 'Zona exterior en la terraza sur con capacidad para estructuras temporales. Muy demandado en verano para marcas de bebidas, lifestyle y events.',
      size_sqm: 40,
      floor_level: 'ground',
      rental_types: ['popup', 'marketing'],
      price_daily_popup: 490,
      price_daily_marketing: 220,
      amenities: ['electricity'],
    }),

    // ── Gran Casa, Zaragoza ───────────────────────────────────────────────
    base('Puerto Venecia', {
      title: 'Local de tamaño mediano — Planta baja',
      description: 'Local bien proporcionado en la planta de acceso del mayor centro de Aragón. Tráfico familiar estable durante toda la semana y muy elevado los fines de semana.',
      size_sqm: 120,
      floor_level: 'ground',
      rental_types: ['long_term'],
      price_monthly: 3400,
      price_per_sqm: 28,
      amenities: ['electricity', 'wifi', 'airConditioning', 'parking'],
    }),

    // ── Glòries, Barcelona ────────────────────────────────────────────────
    base('Westfield Glòries', {
      title: 'Local premium — Planta street, zona diseño',
      description: 'Espacio moderno junto a la zona de diseño y arquitectura del centro, en pleno Eixample. Clientela urbana y de alto poder adquisitivo.',
      size_sqm: 88,
      floor_level: 'ground',
      rental_types: ['long_term', 'popup'],
      price_monthly: 7200,
      price_daily_popup: 900,
      price_per_sqm: 82,
      amenities: ['electricity', 'wifi', 'airConditioning', 'security', 'cctv'],
    }),

    // ── Nervión Plaza, Sevilla ────────────────────────────────────────────
    base('Nervión Plaza', {
      title: 'Stand central — Zona de restauración',
      description: 'Isleta en la zona de restauración del centro, con flujo constante a mediodía y tarde. Ideal para degustaciones y marcas de alimentación.',
      size_sqm: 15,
      floor_level: 'ground',
      rental_types: ['marketing'],
      price_daily_marketing: 195,
      amenities: ['electricity', 'wifi'],
    }),
  ].filter(Boolean)
}

// ── 4. Run ─────────────────────────────────────────────────────────────────

async function main() {
  console.log('🌱 Seeding demo listings…\n')

  const listerId = await getListerId()

  const mallNames = [
    'Westfield La Maquinista',
    'El Corte Inglés Castellana',
    'Westfield Parquesur',
    'Aqua Multiespacio',
    'Puerto Venecia',
    'Westfield Glòries',
    'Nervión Plaza',
  ]
  const malls = await getMallIds(mallNames)
  console.log('Malls found:', Object.keys(malls).join(', ') || 'none')

  const found = Object.keys(malls)
  const missing = mallNames.filter(n => !found.includes(n))
  if (missing.length) console.warn('⚠️  Malls NOT found in DB:', missing.join(', '))

  const rows = listings(malls, listerId)
  console.log(`\nInserting ${rows.length} listings…`)

  const { data, error } = await supabase
    .from('listings')
    .insert(rows)
    .select('id, title')

  if (error) {
    console.error('❌ Insert failed:', error.message)
    process.exit(1)
  }

  console.log(`\n✅ Inserted ${data.length} listings:`)
  data.forEach(l => console.log(' •', l.title))
}

main().catch(err => { console.error(err); process.exit(1) })
