import { createClient } from '@/lib/supabase/server'
import { Navbar } from './Navbar'

export async function NavbarServer() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let profile: { name: string; email: string } | null = null

  if (user) {
    const { data } = await supabase
      .from('profiles')
      .select('name, email')
      .eq('id', user.id)
      .single()
    profile = data
  }

  return <Navbar user={profile} />
}
