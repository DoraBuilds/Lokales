import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ locale: string }> }
) {
  const { locale } = await params
  const supabase = await createClient()
  await supabase.auth.signOut()
  return NextResponse.redirect(new URL(`/${locale}`, request.url))
}
