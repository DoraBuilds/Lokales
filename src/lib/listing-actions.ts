'use server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export interface ListingFormData {
  // Shopping center
  scId?: string
  scName: string
  scCity: string
  scMicrolocation: string
  scProvince: string
  scPostalCode: string
  scAddress: string
  scLat: string
  scLng: string
  scPopulation: string
  scGlaSqm: string
  scFootfallAnnual: string
  // Space
  title: string
  description: string
  floorLevel: string
  sizeGlaSqm: string
  facadeMeters: string
  ceilingHeight: string
  amenities: string[]
  // Pricing
  rentalTypes: string[]
  pricePerSqm: string
  priceMonthly: string
  utilitiesMonthly: string
  longTermNotes: string
  popupPriceAmount: string
  popupPriceUnit: string
  marketingPriceAmount: string
  marketingPriceUnit: string
  availableFromImmediate: boolean
  availableFrom: string
  availableUntil: string
  // Photos
  imageUrls: string[]
  locale: string
}

function num(val: string): number | null {
  const n = parseFloat(val.replace(/,/g, ''))
  return isNaN(n) ? null : n
}

export async function createListing(
  data: ListingFormData
): Promise<{ error?: string; redirectTo?: string }> {
  try {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: 'Not authenticated — please log in and try again.' }

  // If a known SC was selected from the database, use it directly
  let scRecordId = data.scId || ''

  if (!scRecordId) {
    // Create a new shopping center via admin client (bypasses RLS)
    const admin = createAdminClient()
    const { data: sc, error: scError } = await admin
      .from('shopping_centers')
      .insert({
        name:            data.scName,
        city:            data.scCity,
        microlocation:   data.scMicrolocation || null,
        province:        data.scProvince,
        postal_code:     data.scPostalCode || null,
        address:         data.scAddress || '',
        lat:             num(data.scLat),
        lng:             num(data.scLng),
        population:      num(data.scPopulation),
        gla_sqm:         num(data.scGlaSqm),
        footfall_annual: num(data.scFootfallAnnual),
        created_by:      user.id,
      })
      .select('id')
      .single()

    if (scError) return { error: `Shopping center error: ${scError.message}` }
    scRecordId = sc.id
  }

  const availableFrom = data.availableFromImmediate
    ? new Date().toISOString().split('T')[0]
    : data.availableFrom || new Date().toISOString().split('T')[0]

  const { error: listingError } = await supabase
    .from('listings')
    .insert({
      shopping_center_id:      scRecordId,
      lister_id:               user.id,
      title:                   data.title,
      description:             data.description,
      size_sqm:                num(data.sizeGlaSqm) ?? 0,
      gla_sqm:                 num(data.sizeGlaSqm),
      floor_level:             data.floorLevel,
      facade_meters:           num(data.facadeMeters),
      ceiling_height:          num(data.ceilingHeight),
      rental_types:            data.rentalTypes,
      price_per_sqm:           num(data.pricePerSqm),
      price_monthly:           num(data.priceMonthly),
      utilities_monthly:       num(data.utilitiesMonthly),
      long_term_notes:         data.longTermNotes || null,
      price_daily_popup:       num(data.popupPriceAmount),
      popup_price_unit:        data.popupPriceUnit || null,
      price_daily_marketing:   num(data.marketingPriceAmount),
      marketing_price_unit:    data.marketingPriceUnit || null,
      common_expenses_per_sqm: null,
      available_from:          availableFrom,
      available_until:         data.availableUntil || null,
      amenities:               data.amenities,
      images:                  data.imageUrls,
      status:                  'active',
    })

  if (listingError) return { error: `Listing error: ${listingError.message}` }

  return { redirectTo: `/${data.locale}/dashboard?published=1` }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : JSON.stringify(err)
    console.error('[createListing] unexpected error:', msg)
    return { error: `Unexpected error: ${msg}` }
  }
}

export async function updateListing(
  listingId: string,
  data: Omit<ListingFormData, 'scName' | 'scCity' | 'scMicrolocation' | 'scProvince' | 'scPostalCode' | 'scAddress' | 'scLat' | 'scLng' | 'scPopulation' | 'scGlaSqm' | 'scFootfallAnnual'>
): Promise<{ error?: string; redirectTo?: string }> {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Not authenticated' }

    const availableFrom = data.availableFromImmediate
      ? new Date().toISOString().split('T')[0]
      : data.availableFrom || new Date().toISOString().split('T')[0]

    const { error } = await supabase
      .from('listings')
      .update({
        title:                   data.title,
        description:             data.description,
        size_sqm:                num(data.sizeGlaSqm) ?? 0,
        gla_sqm:                 num(data.sizeGlaSqm),
        floor_level:             data.floorLevel,
        facade_meters:           num(data.facadeMeters),
        ceiling_height:          num(data.ceilingHeight),
        rental_types:            data.rentalTypes,
        price_per_sqm:           num(data.pricePerSqm),
        price_monthly:           num(data.priceMonthly),
        utilities_monthly:       num(data.utilitiesMonthly),
        long_term_notes:         data.longTermNotes || null,
        price_daily_popup:       num(data.popupPriceAmount),
        popup_price_unit:        data.popupPriceUnit || null,
        price_daily_marketing:   num(data.marketingPriceAmount),
        marketing_price_unit:    data.marketingPriceUnit || null,
        available_from:          availableFrom,
        available_until:         data.availableUntil || null,
        amenities:               data.amenities,
        images:                  data.imageUrls,
      })
      .eq('id', listingId)
      .eq('lister_id', user.id)

    if (error) return { error: error.message }
    return { redirectTo: `/${data.locale}/listings/${listingId}` }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : JSON.stringify(err)
    return { error: `Unexpected error: ${msg}` }
  }
}

export async function setListingStatus(
  listingId: string,
  status: 'active' | 'paused'
): Promise<{ error?: string }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }
  const { error } = await supabase
    .from('listings')
    .update({ status })
    .eq('id', listingId)
    .eq('lister_id', user.id)
  return error ? { error: error.message } : {}
}

export async function toggleSaveListing(listingId: string): Promise<{ saved: boolean }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { saved: false }

  const { data: existing } = await supabase
    .from('saved_listings')
    .select('listing_id')
    .eq('user_id', user.id)
    .eq('listing_id', listingId)
    .single()

  if (existing) {
    await supabase.from('saved_listings').delete().eq('user_id', user.id).eq('listing_id', listingId)
    return { saved: false }
  } else {
    await supabase.from('saved_listings').insert({ user_id: user.id, listing_id: listingId })
    return { saved: true }
  }
}
