'use server'

import { createClient } from '@/lib/supabase/server'

export interface InquiryData {
  listingId: string
  senderName: string
  senderEmail: string
  senderPhone: string
  rentalType: string
  message: string
}

export async function createInquiry(data: InquiryData): Promise<{ error?: string; success?: boolean }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { error } = await supabase.from('inquiries').insert({
    listing_id:       data.listingId,
    sender_id:        user?.id ?? null,
    sender_name:      data.senderName,
    sender_email:     data.senderEmail,
    sender_phone:     data.senderPhone || null,
    rental_type:      data.rentalType,
    message:          data.message,
    desired_start_date: new Date().toISOString().split('T')[0],
    status:           'new',
  })

  if (error) return { error: error.message }
  return { success: true }
}
