'use server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { redirect } from 'next/navigation'

export async function login(formData: FormData) {
  const email    = formData.get('email')    as string
  const password = formData.get('password') as string
  const locale   = (formData.get('locale')  as string) || 'en'
  const next     = (formData.get('next')    as string) || `/${locale}/dashboard`

  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    redirect(`/${locale}/auth/login?error=${encodeURIComponent(error.message)}`)
  }

  redirect(next)
}

export async function signup(formData: FormData) {
  const name        = formData.get('name')         as string
  const email       = formData.get('email')        as string
  const password    = formData.get('password')     as string
  const companyName = formData.get('company_name') as string
  const locale      = (formData.get('locale')      as string) || 'en'

  // Create user via admin client — already confirmed, no email sent
  const admin = createAdminClient()
  const { error: createError } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { name, company_name: companyName || null },
  })

  if (createError) {
    redirect(`/${locale}/auth/signup?error=${encodeURIComponent(createError.message)}`)
  }

  // Sign them in immediately
  const supabase = await createClient()
  const { error: loginError } = await supabase.auth.signInWithPassword({ email, password })

  if (loginError) {
    redirect(`/${locale}/auth/login?error=${encodeURIComponent(loginError.message)}`)
  }

  redirect(`/${locale}/dashboard`)
}
