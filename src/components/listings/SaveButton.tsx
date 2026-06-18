'use client'

import { useState } from 'react'
import { Heart } from 'lucide-react'
import { toggleSaveListing } from '@/lib/listing-actions'

export function SaveButton({
  listingId,
  initialSaved,
}: {
  listingId: string
  initialSaved: boolean
}) {
  const [saved, setSaved] = useState(initialSaved)
  const [loading, setLoading] = useState(false)

  async function handleToggle() {
    setLoading(true)
    const result = await toggleSaveListing(listingId)
    setSaved(result.saved)
    setLoading(false)
  }

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={`flex items-center gap-1.5 text-sm font-medium transition-colors px-3 py-1.5 rounded-full ${
        saved
          ? 'text-rose-500 hover:text-rose-600 hover:bg-rose-50'
          : 'text-ink hover:text-rose-500 hover:bg-rose-50'
      }`}
    >
      <Heart className={`h-4 w-4 transition-all ${saved ? 'fill-rose-500 text-rose-500' : ''}`} />
      {saved ? 'Saved' : 'Save'}
    </button>
  )
}
