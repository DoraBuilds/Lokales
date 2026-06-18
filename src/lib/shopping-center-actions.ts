'use server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export interface MallSearchResult {
  id: string
  name: string
  city: string
  province: string
  address: string
  gla_sqm: number | null
  shops_count: number | null
  center_type: string | null
  year_opened: number | null
}

export interface MallGooglePreview {
  placeId: string
  name: string
  address: string
  city: string
  province: string
  lat: number | null
  lng: number | null
}

export async function searchShoppingCenters(q: string): Promise<MallSearchResult[]> {
  if (q.trim().length < 2) return []
  const supabase = await createClient()
  const safe = q.trim().replace(/[%_]/g, '\\$&')
  const { data } = await supabase
    .from('shopping_centers')
    .select('id, name, city, province, address, gla_sqm, shops_count, center_type, year_opened')
    .or(`name.ilike.%${safe}%,city.ilike.%${safe}%`)
    .order('name')
    .limit(8)
  return (data ?? []) as MallSearchResult[]
}

export async function findMallOnGoogle(query: string): Promise<MallGooglePreview | null> {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
  if (!apiKey) return null

  const searchRes = await fetch(
    `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query + ' centro comercial España')}&key=${apiKey}&language=es&region=es`,
    { cache: 'no-store' },
  )
  const searchData = await searchRes.json()
  if (searchData.status !== 'OK' || !searchData.results?.length) return null

  const result = searchData.results[0]

  const detailsRes = await fetch(
    `https://maps.googleapis.com/maps/api/place/details/json?place_id=${result.place_id}&fields=address_components&key=${apiKey}&language=es`,
    { cache: 'no-store' },
  )
  const detailsData = await detailsRes.json()
  const components: { types: string[]; long_name: string }[] =
    detailsData.result?.address_components ?? []
  const get = (type: string) =>
    components.find(c => c.types.includes(type))?.long_name ?? ''

  return {
    placeId:  result.place_id,
    name:     result.name,
    address:  result.formatted_address ?? '',
    city:     get('locality') || get('administrative_area_level_3'),
    province: get('administrative_area_level_2')
      .replace(/ [Pp]rovince$/i, '')
      .replace(/ provincia$/i, ''),
    lat: result.geometry?.location?.lat ?? null,
    lng: result.geometry?.location?.lng ?? null,
  }
}

// Accepts only the Google place_id — all data is re-fetched server-side
// so the client cannot inject arbitrary content into the database.
export async function confirmAndAddMall(
  placeId: string,
): Promise<{ mall?: MallSearchResult; error?: string }> {
  // Auth gate — only logged-in users can add malls
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
  if (!apiKey) return { error: 'Google Maps not configured' }

  // Re-fetch all data from Google using the place_id (never trust client payload)
  const detailsRes = await fetch(
    `https://maps.googleapis.com/maps/api/place/details/json?place_id=${encodeURIComponent(placeId)}&fields=name,formatted_address,geometry,address_components&key=${apiKey}&language=es`,
    { cache: 'no-store' },
  )
  const detailsData = await detailsRes.json()
  if (detailsData.status !== 'OK' || !detailsData.result) return { error: 'not_found' }

  const result = detailsData.result
  const components: { types: string[]; long_name: string }[] = result.address_components ?? []
  const get = (type: string) =>
    components.find(c => c.types.includes(type))?.long_name ?? ''

  const name     = result.name as string
  const address  = (result.formatted_address ?? '') as string
  const city     = get('locality') || get('administrative_area_level_3')
  const province = get('administrative_area_level_2')
    .replace(/ [Pp]rovince$/i, '').replace(/ provincia$/i, '')
  const lat: number | null = result.geometry?.location?.lat ?? null
  const lng: number | null = result.geometry?.location?.lng ?? null

  const admin = createAdminClient()

  // Guard against race conditions — return existing row if already present
  if (name && city) {
    const { data: existing } = await admin
      .from('shopping_centers')
      .select('id, name, city, province, address, gla_sqm, shops_count, center_type, year_opened')
      .eq('name', name)
      .eq('city', city)
      .maybeSingle()
    if (existing) return { mall: existing as MallSearchResult }
  }

  const { data: sc, error } = await admin
    .from('shopping_centers')
    .insert({ name, city, province, address, lat, lng, country: 'Spain', created_by: user.id })
    .select('id, name, city, province, address, gla_sqm, shops_count, center_type, year_opened')
    .single()

  if (error) return { error: error.message }

  notifyAdmin(name, city, address).catch(() => {})

  return { mall: sc as MallSearchResult }
}

async function notifyAdmin(name: string, city: string, address: string) {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey || apiKey.startsWith('your_')) return

  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'Lokales <onboarding@resend.dev>',
      to:   'dora.angelov@gmail.com',
      subject: `⚠️ New mall added by a user: ${name}`,
      html: `
        <h2 style="font-family:sans-serif">New shopping center added</h2>
        <p style="font-family:sans-serif">A landlord added a mall that wasn't in your curated list:</p>
        <table style="font-family:sans-serif;border-collapse:collapse">
          <tr><td style="padding:4px 12px 4px 0;font-weight:600">Name</td><td>${name}</td></tr>
          <tr><td style="padding:4px 12px 4px 0;font-weight:600">City</td><td>${city}</td></tr>
          <tr><td style="padding:4px 12px 4px 0;font-weight:600">Address</td><td>${address}</td></tr>
        </table>
        <p style="font-family:sans-serif;margin-top:16px">Review it in your Supabase dashboard and clean up if needed.</p>
      `,
    }),
  })
}
