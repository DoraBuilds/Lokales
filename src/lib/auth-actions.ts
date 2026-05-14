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

  const supabase = await createClient()
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { name, company_name: companyName || null } },
  })

  if (error) {
    redirect(`/${locale}/auth/signup?error=${encodeURIComponent(error.message)}`)
  }

  // If Supabase requires email confirmation, auto-confirm via admin client
  // so users never need to check their inbox
  if (!data.session && data.user) {
    const admin = createAdminClient()
    await admin.auth.admin.updateUserById(data.user.id, { email_confirm: true })

    // Now sign them in directly
    const { error: loginError } = await supabase.auth.signInWithPassword({ email, password })
    if (loginError) {
      redirect(`/${locale}/auth/login?error=${encodeURIComponent(loginError.message)}`)
    }
  }

  redirect(`/${locale}/dashboard`)
}
