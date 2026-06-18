'use server'

import { createClient } from '@/lib/supabase/server'

export async function subscribeNewsletter(
  email: string,
  locale: string
): Promise<{ error?: string; success?: boolean; alreadySubscribed?: boolean }> {
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: 'Please enter a valid email address.' }
  }

  const supabase = await createClient()

  const { error } = await supabase
    .from('newsletter_subscribers')
    .insert({ email: email.toLowerCase().trim(), locale })

  if (error) {
    if (error.code === '23505') return { alreadySubscribed: true }
    return { error: 'Something went wrong. Please try again.' }
  }

  return { success: true }
}
