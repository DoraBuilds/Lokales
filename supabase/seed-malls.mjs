/**
 * One-time import: reads the Spain shopping malls Excel and seeds
 * shopping_centers (Tab 1) + province_stats (Tab 2) via service role.
 *
 * Usage: node supabase/seed-malls.mjs
 */

import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'
import xlsx from 'xlsx'

const __dirname = dirname(fileURLToPath(import.meta.url))

// ── Read .env.local ──────────────────────────────────────────────────────────
const envPath = resolve(__dirname, '../.env.local')
const env = Object.fromEntries(
  readFileSync(envPath, 'utf8')
    .split('\n')
    .filter(l => l.includes('=') && !l.startsWith('#'))
    .map(l => l.split('=').map(s => s.trim()))
    .map(([k, ...v]) => [k, v.join('=')])
)

const SUPABASE_URL = env['NEXT_PUBLIC_SUPABASE_URL']
const SERVICE_ROLE_KEY = env['SUPABASE_SERVICE_ROLE_KEY']

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
})

const EXCEL_PATH = '/Users/doraangelov/Desktop/20260616 · First SC List (Draft) · LOKALES.xlsx'

// ── Parse Excel ──────────────────────────────────────────────────────────────
const wb = xlsx.readFile(EXCEL_PATH)
const tab1 = xlsx.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], { defval: null })
const tab2 = xlsx.utils.sheet_to_json(wb.Sheets[wb.SheetNames[1]], { defval: null })

// ── Tab 1 → shopping_centers ─────────────────────────────────────────────────
const malls = tab1.map(row => ({
  name:         row['Nombre del Centro Comercial'],
  city:         row['Ciudad'],
  province:     row['Comunidad Autónoma'],
  address:      row['Dirección / Zona'] ?? '',
  country:      'Spain',
  gla_sqm:      row['SBA (m²)'] ?? null,
  shops_count:  row['Nº Tiendas (aprox.)'] ?? null,
  owner:        row['Propietario / Gestor Principal'] ?? null,
  center_type:  row['Tipo'] ?? null,
  year_opened:  row['Año Apertura'] ?? null,
})).filter(m => m.name && m.city)

console.log(`\n→ Inserting ${malls.length} shopping centers…`)
const { error: mallsError, count } = await supabase
  .from('shopping_centers')
  .upsert(malls, { onConflict: 'name,city', count: 'exact' })

if (mallsError) {
  console.error('✗ shopping_centers error:', mallsError.message)
  console.error('  Details:', mallsError.details ?? mallsError.hint ?? '')
  process.exit(1)
}
console.log(`✓ shopping_centers: ${malls.length} rows upserted`)

// ── Tab 2 → province_stats ───────────────────────────────────────────────────
const stats = tab2.map(row => ({
  autonomous_community: row['Comunidad Autónoma'],
  centers_count:        row['Nº Centros (en lista)'] ?? null,
  total_sba_sqm:        row['SBA Total (m²)'] ?? null,
  total_shops_count:    row['Nº Tiendas aprox.'] ?? null,
})).filter(s => s.autonomous_community)

console.log(`\n→ Inserting ${stats.length} province stats…`)
const { error: statsError } = await supabase
  .from('province_stats')
  .upsert(stats, { onConflict: 'autonomous_community' })

if (statsError) {
  console.error('✗ province_stats error:', statsError.message)
  process.exit(1)
}
console.log(`✓ province_stats: ${stats.length} rows upserted`)

console.log('\n✅ Seed complete.\n')
