'use client'

import { useState, useEffect, useRef } from 'react'
import { Share2, Copy, Check, Mail } from 'lucide-react'

export function ShareButton({ title, url }: { title: string; url: string }) {
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  function copyLink() {
    navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const whatsapp = `https://wa.me/?text=${encodeURIComponent(`${title}\n${url}`)}`
  const email    = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(url)}`
  const twitter  = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 text-sm font-medium text-ink hover:text-forest transition-colors px-3 py-1.5 rounded-full hover:bg-stone"
      >
        <Share2 className="h-4 w-4" /> Share
      </button>

      {open && (
        <div className="absolute right-0 top-10 bg-white border border-warm-border rounded-2xl shadow-xl p-2 w-56 z-30">
          <button onClick={copyLink}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-stone text-sm text-ink transition-colors text-left">
            {copied ? <Check className="h-4 w-4 text-forest" /> : <Copy className="h-4 w-4" />}
            {copied ? 'Copied!' : 'Copy link'}
          </button>
          <a href={email}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-stone text-sm text-ink transition-colors">
            <Mail className="h-4 w-4" /> Email
          </a>
          <a href={whatsapp} target="_blank" rel="noreferrer"
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-stone text-sm text-ink transition-colors">
            <span className="h-4 w-4 flex items-center justify-center text-base leading-none">💬</span> WhatsApp
          </a>
          <a href={twitter} target="_blank" rel="noreferrer"
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-stone text-sm text-ink transition-colors">
            <span className="h-4 w-4 flex items-center justify-center font-bold text-xs">𝕏</span> Twitter / X
          </a>
        </div>
      )}
    </div>
  )
}
