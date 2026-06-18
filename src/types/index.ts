export type Locale = 'en' | 'es'

export type RentalType = 'long_term' | 'popup' | 'marketing'

export type ListingStatus = 'active' | 'paused' | 'rented'

export type FloorLevel = 'basement' | 'ground' | 'first' | 'second' | 'other'

export type Amenity =
  | 'parking'
  | 'loadingDock'
  | 'airConditioning'
  | 'heating'
  | 'electricity'
  | 'water'
  | 'wifi'
  | 'security'
  | 'cctv'
  | 'toilet'
  | 'storage'
  | 'elevator'

export interface User {
  id: string
  email: string
  name: string
  phone?: string
  avatar_url?: string
  company_name?: string
  created_at: string
}

export interface ShoppingCenter {
  id: string
  name: string
  address: string
  city: string
  microlocation?: string
  province: string
  postal_code?: string
  country: string
  lat?: number
  lng?: number
  description?: string
  website?: string
  images: string[]
  population?: number
  gla_sqm?: number
  footfall_annual?: number
  shops_count?: number
  center_type?: string
  year_opened?: number
  owner?: string
  created_by: string
  created_at: string
}

export interface Listing {
  id: string
  shopping_center_id: string
  shopping_center?: ShoppingCenter
  lister_id: string
  lister?: User
  title: string
  description: string
  size_sqm: number
  gla_sqm?: number
  floor_level: FloorLevel
  ceiling_height?: number
  facade_meters?: number
  frontage_width?: number
  windows_count?: number
  rental_types: RentalType[]
  price_per_sqm?: number
  price_monthly?: number
  utilities_monthly?: number
  long_term_notes?: string
  price_daily_popup?: number
  popup_price_unit?: 'hour' | 'day' | 'week'
  price_daily_marketing?: number
  marketing_price_unit?: 'day' | 'week' | 'month'
  common_expenses_per_sqm?: number
  min_days?: number
  max_days?: number
  available_from: string
  available_until?: string
  status: ListingStatus
  images: string[]
  amenities: Amenity[]
  created_at: string
  updated_at: string
}

export interface Inquiry {
  id: string
  listing_id: string
  listing?: Listing
  sender_id?: string
  sender_name: string
  sender_email: string
  sender_phone?: string
  message: string
  rental_type: RentalType
  desired_start_date: string
  desired_end_date?: string
  status: 'new' | 'read' | 'replied'
  created_at: string
}

export interface SavedListing {
  user_id: string
  listing_id: string
  listing?: Listing
  created_at: string
}

export interface SearchFilters {
  query?: string
  city?: string
  rentalType?: RentalType
  minSize?: number
  maxSize?: number
  maxPriceMonthly?: number
  availableFrom?: string
  sortBy?: 'newest' | 'price_asc' | 'price_desc' | 'size_desc'
}
