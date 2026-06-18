'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import { createListing, type ListingFormData } from '@/lib/listing-actions'
import { MallAutocomplete } from '@/components/listings/MallAutocomplete'
import { useRouter } from 'next/navigation'
import {
  Upload, X, ChevronRight, ChevronLeft, Check,
  Building2, Ruler, Tag, Camera, Star,
} from 'lucide-react'

// ── Constants ─────────────────────────────────────────────────────────────────

const STEPS = [
  { id: 1, label: 'Location', icon: Building2 },
  { id: 2, label: 'Space',    icon: Ruler },
  { id: 3, label: 'Pricing',  icon: Tag },
  { id: 4, label: 'Photos',   icon: Camera },
]

const FLOOR_OPTIONS = [
  { value: 'basement', label: 'Basement' },
  { value: 'ground',   label: 'Ground floor' },
  { value: 'first',    label: '1st floor' },
  { value: 'second',   label: '2nd floor' },
  { value: 'third',    label: '3rd floor' },
  { value: 'fourth',   label: '4th floor' },
  { value: 'fifth',    label: '5th floor' },
  { value: 'sixth',    label: '6th floor' },
  { value: 'seventh',  label: '7th floor' },
  { value: 'eighth',   label: '8th floor' },
  { value: 'ninth',    label: '9th floor' },
  { value: 'other',    label: 'Other' },
]

const AMENITY_OPTIONS = [
  { value: 'electricity',     label: 'Electricity' },
  { value: 'wifi',            label: 'Wi-Fi' },
  { value: 'airConditioning', label: 'A/C' },
  { value: 'heating',         label: 'Heating' },
  { value: 'water',           label: 'Water' },
  { value: 'parking',         label: 'Parking' },
  { value: 'loadingDock',     label: 'Loading dock' },
  { value: 'elevator',        label: 'Elevator' },
  { value: 'toilet',          label: 'Toilet' },
  { value: 'storage',         label: 'Storage' },
  { value: 'security',        label: 'Security' },
  { value: 'cctv',            label: 'CCTV' },
]

const RENTAL_TYPES = [
  {
    value: 'long_term', label: 'Long-term lease',
    active: 'bg-forest text-white border-forest',
    inactive: 'bg-white text-ink border-warm-border hover:border-forest/40',
    panelBorder: 'border-forest/20 bg-forest-light/30',
    headerColor: 'text-forest',
  },
  {
    value: 'popup', label: 'Pop-up / Event',
    active: 'bg-purple-brand text-white border-purple-brand',
    inactive: 'bg-white text-ink border-warm-border hover:border-purple-brand/40',
    panelBorder: 'border-purple-brand/20 bg-purple-soft/40',
    headerColor: 'text-purple-brand',
  },
  {
    value: 'marketing', label: 'Marketing placement',
    active: 'bg-amber-brand text-white border-amber-brand',
    inactive: 'bg-white text-ink border-warm-border hover:border-amber-brand/40',
    panelBorder: 'border-amber-brand/20 bg-amber-soft/40',
    headerColor: 'text-amber-brand',
  },
]

// ── Helpers ───────────────────────────────────────────────────────────────────

function inputCls(hasError = false) {
  return `w-full px-4 py-3 rounded-xl border ${
    hasError
      ? 'border-red-400 focus:ring-red-200'
      : 'border-warm-border focus:border-forest/50 focus:ring-forest/10'
  } bg-white text-ink placeholder:text-ink-subtle focus:outline-none focus:ring-2 transition-colors text-sm`
}

function Label({ children, optional }: { children: React.ReactNode; optional?: boolean }) {
  return (
    <label className="block text-sm font-medium text-ink mb-1.5">
      {children}
      {optional && <span className="ml-1.5 text-xs font-normal text-ink-subtle">(optional)</span>}
    </label>
  )
}

function Field({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-col">{children}</div>
}

// Formatted number input — shows commas, stores raw value
function NumericInput({
  value, onChange, placeholder, className, hasError, step,
}: {
  value: string
  onChange: (v: string) => void
  placeholder?: string
  className?: string
  hasError?: boolean
  step?: string
}) {
  const [display, setDisplay] = useState(value ? formatNum(value) : '')

  function formatNum(raw: string): string {
    const n = parseFloat(raw.replace(/,/g, ''))
    if (isNaN(n)) return raw
    return n.toLocaleString('en-US', { maximumFractionDigits: 2 })
  }

  return (
    <input
      type="text"
      inputMode={step && parseFloat(step) < 1 ? 'decimal' : 'numeric'}
      value={display}
      className={className ?? inputCls(hasError)}
      placeholder={placeholder}
      onChange={(e) => {
        const raw = e.target.value.replace(/[^0-9.]/g, '')
        setDisplay(e.target.value.replace(/[^0-9.,]/g, ''))
        onChange(raw)
      }}
      onBlur={() => { setDisplay(formatNum(value)) }}
      onFocus={() => { setDisplay(value) }}
    />
  )
}

// ── Form state ────────────────────────────────────────────────────────────────

interface PhotoPreview { file: File; previewUrl: string }

const EMPTY: Omit<ListingFormData, 'imageUrls' | 'locale'> = {
  scId: '', scName: '', scCity: '', scMicrolocation: '', scProvince: '', scPostalCode: '',
  scAddress: '', scLat: '', scLng: '',
  scPopulation: '', scGlaSqm: '', scFootfallAnnual: '',
  title: '', description: '', floorLevel: 'ground',
  sizeGlaSqm: '', facadeMeters: '', ceilingHeight: '', amenities: [],
  rentalTypes: [],
  pricePerSqm: '', priceMonthly: '', utilitiesMonthly: '', longTermNotes: '',
  popupPriceAmount: '', popupPriceUnit: 'day',
  marketingPriceAmount: '', marketingPriceUnit: 'day',
  availableFromImmediate: false,
  availableFrom: new Date().toISOString().split('T')[0],
  availableUntil: '',
}

// ── Component ─────────────────────────────────────────────────────────────────

export function NewListingForm({ userId, locale }: { userId: string; locale: string }) {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [form, setForm] = useState(EMPTY)
  const [photos, setPhotos] = useState<PhotoPreview[]>([])
  const [coverIndex, setCoverIndex] = useState(0)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  function set(field: string, value: unknown) {
    setForm((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => { const e = { ...prev }; delete e[field]; return e })
  }

  function toggleArray(field: 'amenities' | 'rentalTypes', value: string) {
    const arr = form[field] as string[]
    set(field, arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value])
  }

  // ── Validation ──────────────────────────────────────────────────────────────

  function validate(): boolean {
    const e: Record<string, string> = {}
    if (step === 1) {
      if (!form.scId)
        e.scName = locale === 'es'
          ? 'Selecciona tu centro de la lista o añádelo con "¿No encuentras tu centro?"'
          : 'Please select your mall from the list or add it via "Can\'t find your mall?"'
    }
    if (step === 2) {
      if (!form.title.trim())       e.title       = 'Required'
      if (!form.description.trim()) e.description = 'Required'
      if (!form.sizeGlaSqm)         e.sizeGlaSqm  = 'Required'
    }
    if (step === 3) {
      if (form.rentalTypes.length === 0)   e.rentalTypes = 'Select at least one'
      if (!form.availableFromImmediate && !form.availableFrom) e.availableFrom = 'Required'
      if (form.rentalTypes.includes('long_term') && !form.priceMonthly)
        e.priceMonthly = 'Required for long-term'
      if (form.rentalTypes.includes('popup') && !form.popupPriceAmount)
        e.popupPriceAmount = 'Required for pop-up'
      if (form.rentalTypes.includes('marketing') && !form.marketingPriceAmount)
        e.marketingPriceAmount = 'Required for marketing'
    }
    setErrors(e)
    return Object.keys(e).length === 0
  }

  // ── Photos ──────────────────────────────────────────────────────────────────

  function handleFiles(files: FileList | null) {
    if (!files) return
    const added = Array.from(files).map((file) => ({ file, previewUrl: URL.createObjectURL(file) }))
    setPhotos((prev) => [...prev, ...added])
  }

  function removePhoto(index: number) {
    setPhotos((prev) => {
      URL.revokeObjectURL(prev[index].previewUrl)
      const next = prev.filter((_, i) => i !== index)
      if (coverIndex >= next.length) setCoverIndex(Math.max(0, next.length - 1))
      return next
    })
  }

  function makeCover(index: number) {
    setPhotos((prev) => {
      const next = [...prev]
      const [picked] = next.splice(index, 1)
      next.unshift(picked)
      return next
    })
    setCoverIndex(0)
  }

  // ── Submit ──────────────────────────────────────────────────────────────────

  async function handleSubmit() {
    setSubmitting(true)
    setSubmitError(null)
    try {
      const supabase = createClient()
      const imageUrls: string[] = []

      for (const photo of photos) {
        const ext = photo.file.name.split('.').pop()
        const path = `${userId}/${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`
        const { error: uploadError } = await supabase.storage
          .from('listing-images')
          .upload(path, photo.file, { cacheControl: '3600' })
        if (uploadError) throw new Error(uploadError.message)
        const { data: { publicUrl } } = supabase.storage.from('listing-images').getPublicUrl(path)
        imageUrls.push(publicUrl)
      }

      const result = await createListing({ ...form, imageUrls, locale })
      if (result?.error) {
        setSubmitError(result.error)
        setSubmitting(false)
      } else if (result?.redirectTo) {
        router.push(result.redirectTo)
      }
    } catch (err: unknown) {
      setSubmitError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
      setSubmitting(false)
    }
  }

  // ── Render ──────────────────────────────────────────────────────────────────

  function handleClose() {
    const confirmed = window.confirm('Are you sure you want to leave? Your progress will be lost.')
    if (confirmed) router.push(`/${locale}/dashboard`)
  }

  return (
    <div className="max-w-2xl mx-auto">

      {/* Close button */}
      <div className="flex justify-end mb-4">
        <button type="button" onClick={handleClose}
          className="flex items-center gap-1.5 text-sm text-ink-muted hover:text-ink px-3 py-1.5 rounded-full hover:bg-stone transition-colors">
          <X className="h-4 w-4" /> Cancel
        </button>
      </div>

      {/* Progress stepper */}
      <div className="flex items-center mb-10">
        {STEPS.map((s, i) => {
          const done = step > s.id
          const active = step === s.id
          const Icon = s.icon
          return (
            <div key={s.id} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center gap-1">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all ${
                  done ? 'bg-forest border-forest' : active ? 'border-forest bg-white' : 'border-warm-border bg-white'
                }`}>
                  {done
                    ? <Check className="h-4 w-4 text-white" />
                    : <Icon className={`h-4 w-4 ${active ? 'text-forest' : 'text-ink-subtle'}`} />
                  }
                </div>
                <span className={`text-[11px] font-semibold hidden sm:block ${
                  active ? 'text-forest' : done ? 'text-ink-muted' : 'text-ink-subtle'
                }`}>{s.label}</span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`flex-1 h-0.5 mx-2 mb-4 rounded-full transition-all ${
                  step > s.id ? 'bg-forest' : 'bg-warm-border'
                }`} />
              )}
            </div>
          )
        })}
      </div>

      <div className="bg-white rounded-3xl border border-warm-border p-8">

        {/* ── STEP 1: Location ── */}
        {step === 1 && (
          <div className="space-y-5">
            <div className="mb-6">
              <p className="text-xs font-semibold uppercase tracking-widest text-ink-subtle mb-1">Step 1 of 4</p>
              <h2 className="text-xl font-bold text-ink">Shopping center details</h2>
              <p className="text-sm text-ink-muted mt-1">Tell us about the mall where the space is located.</p>
            </div>

            <Field>
              <Label>Shopping center</Label>
              <MallAutocomplete
                value={form.scName}
                scId={form.scId ?? ''}
                locale={locale}
                onChange={(name) => set('scName', name)}
                onMallSelect={(mall) => {
                  set('scId',      mall.id)
                  set('scName',    mall.name)
                  set('scCity',    mall.city)
                  set('scProvince', mall.province)
                  set('scAddress', mall.address)
                  if (mall.glaSqm) set('scGlaSqm', mall.glaSqm)
                }}
                hasError={!!errors.scName}
              />
              {errors.scName && <p className="text-xs text-red-500 mt-1">{errors.scName}</p>}
            </Field>

            <div className="grid grid-cols-2 gap-4">
              <Field>
                <Label>City</Label>
                <input className={inputCls(!!errors.scCity)} value={form.scCity}
                  onChange={(e) => set('scCity', e.target.value)} placeholder="Madrid" />
                {errors.scCity && <p className="text-xs text-red-500 mt-1">{errors.scCity}</p>}
              </Field>
              <Field>
                <Label optional>Area / District</Label>
                <input className={inputCls()} value={form.scMicrolocation}
                  onChange={(e) => set('scMicrolocation', e.target.value)} placeholder="e.g. Salamanca" />
              </Field>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Field>
                <Label>Province</Label>
                <input className={inputCls(!!errors.scProvince)} value={form.scProvince}
                  onChange={(e) => set('scProvince', e.target.value)} placeholder="Madrid" />
                {errors.scProvince && <p className="text-xs text-red-500 mt-1">{errors.scProvince}</p>}
              </Field>
              <Field>
                <Label optional>Postal code</Label>
                <input className={inputCls()} value={form.scPostalCode}
                  onChange={(e) => set('scPostalCode', e.target.value)} placeholder="28046" />
              </Field>
            </div>

            {/* Performance data */}
            <div className="pt-2 border-t border-warm-border">
              <p className="text-xs font-semibold uppercase tracking-widest text-ink-subtle mb-4">
                Performance data <span className="normal-case font-normal">(optional)</span>
              </p>
              <div className="grid grid-cols-3 gap-4">
                <Field>
                  <Label optional>Population</Label>
                  <NumericInput value={form.scPopulation} onChange={(v) => set('scPopulation', v)}
                    placeholder="2,300,000" />
                </Field>
                <Field>
                  <Label optional>Mall GLA (m²)</Label>
                  <NumericInput value={form.scGlaSqm} onChange={(v) => set('scGlaSqm', v)}
                    placeholder="85,000" />
                </Field>
                <Field>
                  <Label optional>Annual footfall</Label>
                  <NumericInput value={form.scFootfallAnnual} onChange={(v) => set('scFootfallAnnual', v)}
                    placeholder="12,000,000" />
                </Field>
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 2: Space ── */}
        {step === 2 && (
          <div className="space-y-5">
            <div className="mb-6">
              <p className="text-xs font-semibold uppercase tracking-widest text-ink-subtle mb-1">Step 2 of 4</p>
              <h2 className="text-xl font-bold text-ink">Your space</h2>
              <p className="text-sm text-ink-muted mt-1">Describe the specific unit you're listing.</p>
            </div>

            <Field>
              <Label>Listing title</Label>
              <input className={inputCls(!!errors.title)} value={form.title}
                onChange={(e) => set('title', e.target.value)}
                placeholder="e.g. Premium corner unit — ground floor" />
              {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title}</p>}
            </Field>

            <Field>
              <Label>Description</Label>
              <textarea className={`${inputCls(!!errors.description)} resize-none`} rows={4}
                value={form.description} onChange={(e) => set('description', e.target.value)}
                placeholder="Visibility, foot traffic, notable features…" />
              {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description}</p>}
            </Field>

            <div className="grid grid-cols-2 gap-4">
              <Field>
                <Label>Floor level</Label>
                <select className={inputCls()} value={form.floorLevel}
                  onChange={(e) => set('floorLevel', e.target.value)}>
                  {FLOOR_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </Field>
              <Field>
                <Label>GLA of unit (m²)</Label>
                <NumericInput value={form.sizeGlaSqm} onChange={(v) => set('sizeGlaSqm', v)}
                  placeholder="120" hasError={!!errors.sizeGlaSqm} />
                {errors.sizeGlaSqm && <p className="text-xs text-red-500 mt-1">{errors.sizeGlaSqm}</p>}
              </Field>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Field>
                <Label optional>Façade (linear m)</Label>
                <NumericInput value={form.facadeMeters} onChange={(v) => set('facadeMeters', v)}
                  placeholder="8.5" step="0.1" />
              </Field>
              <Field>
                <Label optional>Ceiling height (m)</Label>
                <NumericInput value={form.ceilingHeight} onChange={(v) => set('ceilingHeight', v)}
                  placeholder="3.2" step="0.1" />
              </Field>
            </div>

            <div>
              <Label optional>Amenities</Label>
              <div className="flex flex-wrap gap-2 mt-1">
                {AMENITY_OPTIONS.map((a) => (
                  <button key={a.value} type="button" onClick={() => toggleArray('amenities', a.value)}
                    className={`px-3.5 py-1.5 rounded-full border text-xs font-semibold transition-all ${
                      form.amenities.includes(a.value)
                        ? 'bg-forest text-white border-forest'
                        : 'bg-white text-ink-muted border-warm-border hover:border-forest/40 hover:text-ink'
                    }`}>
                    {a.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 3: Pricing ── */}
        {step === 3 && (
          <div className="space-y-3">
            <div className="mb-6">
              <p className="text-xs font-semibold uppercase tracking-widest text-ink-subtle mb-1">Step 3 of 4</p>
              <h2 className="text-xl font-bold text-ink">Pricing & availability</h2>
              <p className="text-sm text-ink-muted mt-1">Select rental types and set your prices. Panels open when you select a type.</p>
            </div>

            {errors.rentalTypes && (
              <p className="text-xs text-red-500">{errors.rentalTypes}</p>
            )}

            {/* Rental type toggles with inline panels */}
            {RENTAL_TYPES.map((rt) => {
              const isSelected = form.rentalTypes.includes(rt.value)
              return (
                <div key={rt.value}>
                  <button type="button" onClick={() => toggleArray('rentalTypes', rt.value)}
                    className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl border text-sm font-semibold transition-all text-left ${
                      isSelected ? rt.active : rt.inactive
                    } ${isSelected ? 'rounded-b-none border-b-0' : ''}`}
                  >
                    <div className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                      isSelected ? 'border-white bg-white/20' : 'border-current'
                    }`}>
                      {isSelected && <Check className="w-2.5 h-2.5" />}
                    </div>
                    {rt.label}
                  </button>

                  {/* Inline panel — only shown when selected */}
                  {isSelected && (
                    <div className={`rounded-2xl rounded-t-none border ${rt.panelBorder} px-5 py-4 space-y-4`}>

                      {rt.value === 'long_term' && (
                        <>
                          <Field>
                            <Label>Monthly rent (€)</Label>
                            <NumericInput value={form.priceMonthly} onChange={(v) => set('priceMonthly', v)}
                              placeholder="4,500" hasError={!!errors.priceMonthly} />
                            {errors.priceMonthly && <p className="text-xs text-red-500 mt-1">{errors.priceMonthly}</p>}
                          </Field>
                          <Field>
                            <Label optional>Utilities (€/month)</Label>
                            <NumericInput value={form.utilitiesMonthly} onChange={(v) => set('utilitiesMonthly', v)}
                              placeholder="350" />
                          </Field>
                          <Field>
                            <Label optional>Comment</Label>
                            <textarea
                              className={`${inputCls()} resize-none`} rows={2}
                              value={form.longTermNotes}
                              onChange={(e) => set('longTermNotes', e.target.value)}
                              placeholder="e.g. Price negotiable for 2+ year leases…"
                            />
                          </Field>
                        </>
                      )}

                      {rt.value === 'popup' && (
                        <div className="space-y-3">
                          <Field>
                            <Label>Price</Label>
                            <div className="flex gap-2">
                              <div className="flex-1">
                                <NumericInput value={form.popupPriceAmount}
                                  onChange={(v) => set('popupPriceAmount', v)}
                                  placeholder="650" hasError={!!errors.popupPriceAmount} />
                              </div>
                              <select
                                value={form.popupPriceUnit}
                                onChange={(e) => set('popupPriceUnit', e.target.value)}
                                className="px-3 py-3 rounded-xl border border-warm-border bg-white text-ink text-sm focus:outline-none focus:ring-2 focus:ring-forest/10 focus:border-forest/50"
                              >
                                <option value="hour">€ / hour</option>
                                <option value="day">€ / day</option>
                                <option value="week">€ / week</option>
                              </select>
                            </div>
                            {errors.popupPriceAmount && <p className="text-xs text-red-500 mt-1">{errors.popupPriceAmount}</p>}
                          </Field>
                        </div>
                      )}

                      {rt.value === 'marketing' && (
                        <div className="space-y-3">
                          <Field>
                            <Label>Price</Label>
                            <div className="flex gap-2">
                              <div className="flex-1">
                                <NumericInput value={form.marketingPriceAmount}
                                  onChange={(v) => set('marketingPriceAmount', v)}
                                  placeholder="180" hasError={!!errors.marketingPriceAmount} />
                              </div>
                              <select
                                value={form.marketingPriceUnit}
                                onChange={(e) => set('marketingPriceUnit', e.target.value)}
                                className="px-3 py-3 rounded-xl border border-warm-border bg-white text-ink text-sm focus:outline-none focus:ring-2 focus:ring-forest/10 focus:border-forest/50"
                              >
                                <option value="day">€ / day</option>
                                <option value="week">€ / week</option>
                                <option value="month">€ / month</option>
                              </select>
                            </div>
                            {errors.marketingPriceAmount && <p className="text-xs text-red-500 mt-1">{errors.marketingPriceAmount}</p>}
                          </Field>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )
            })}

            {/* Availability */}
            <div className="pt-4 border-t border-warm-border space-y-3">
              <p className="text-xs font-semibold uppercase tracking-widest text-ink-subtle">Availability</p>

              <div className="flex items-center gap-3">
                <button type="button"
                  onClick={() => set('availableFromImmediate', !form.availableFromImmediate)}
                  className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                    form.availableFromImmediate ? 'bg-forest border-forest' : 'border-warm-border'
                  }`}
                >
                  {form.availableFromImmediate && <Check className="w-3 h-3 text-white" />}
                </button>
                <span className="text-sm text-ink font-medium">Available immediately</span>
              </div>

              {!form.availableFromImmediate && (
                <Field>
                  <Label>Available from</Label>
                  <input type="date" className={inputCls(!!errors.availableFrom)}
                    value={form.availableFrom} onChange={(e) => set('availableFrom', e.target.value)} />
                  {errors.availableFrom && <p className="text-xs text-red-500 mt-1">{errors.availableFrom}</p>}
                </Field>
              )}

              <Field>
                <Label optional>Available until</Label>
                <input type="date" className={inputCls()}
                  value={form.availableUntil} onChange={(e) => set('availableUntil', e.target.value)}
                  min={form.availableFromImmediate
                    ? new Date().toISOString().split('T')[0]
                    : form.availableFrom
                  }
                />
              </Field>
            </div>
          </div>
        )}

        {/* ── STEP 4: Photos ── */}
        {step === 4 && (
          <div className="space-y-5">
            <div className="mb-6">
              <p className="text-xs font-semibold uppercase tracking-widest text-ink-subtle mb-1">Step 4 of 4</p>
              <h2 className="text-xl font-bold text-ink">Photos</h2>
              <p className="text-sm text-ink-muted mt-1">
                Add photos of the space. Click the <Star className="inline h-3.5 w-3.5 text-amber-500" /> on any photo to make it the cover.
              </p>
            </div>

            <button type="button" onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => { e.preventDefault(); handleFiles(e.dataTransfer.files) }}
              className="w-full border-2 border-dashed border-warm-border hover:border-forest/40 rounded-2xl p-10 flex flex-col items-center gap-3 transition-colors group"
            >
              <div className="w-12 h-12 rounded-2xl bg-forest-light flex items-center justify-center group-hover:scale-105 transition-transform">
                <Upload className="h-5 w-5 text-forest" />
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold text-ink">Click to upload or drag & drop</p>
                <p className="text-xs text-ink-muted mt-1">JPG, PNG or WebP — up to 10 MB each</p>
              </div>
            </button>
            <input ref={fileInputRef} type="file" multiple accept="image/*" className="hidden"
              onChange={(e) => handleFiles(e.target.files)} />

            {photos.length > 0 && (
              <div className="grid grid-cols-3 gap-3">
                {photos.map((photo, i) => (
                  <div key={i} className="relative aspect-square rounded-2xl overflow-hidden group">
                    <Image src={photo.previewUrl} alt="" fill className="object-cover" />

                    {/* Cover badge */}
                    {i === 0 && (
                      <div className="absolute bottom-2 left-2 bg-forest text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                        Cover
                      </div>
                    )}

                    {/* Action buttons */}
                    <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {i !== 0 && (
                        <button type="button" onClick={() => makeCover(i)}
                          title="Set as cover"
                          className="w-6 h-6 bg-amber-400 hover:bg-amber-500 rounded-full flex items-center justify-center shadow"
                        >
                          <Star className="h-3 w-3 text-white" />
                        </button>
                      )}
                      <button type="button" onClick={() => removePhoto(i)}
                        className="w-6 h-6 bg-ink/70 hover:bg-ink rounded-full flex items-center justify-center"
                      >
                        <X className="h-3.5 w-3.5 text-white" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Summary */}
            <div className="border-t border-warm-border pt-5">
              <p className="text-xs font-semibold uppercase tracking-widest text-ink-subtle mb-3">Review summary</p>
              <div className="space-y-1.5 text-sm">
                <p><span className="text-ink-muted">Mall:</span> {form.scName}, {form.scCity}</p>
                <p><span className="text-ink-muted">Space:</span> {form.title} · {form.sizeGlaSqm} m²</p>
                <p><span className="text-ink-muted">Types:</span> {form.rentalTypes.join(', ')}</p>
                {form.priceMonthly && <p><span className="text-ink-muted">Monthly rent:</span> €{Number(form.priceMonthly).toLocaleString('en-US')}</p>}
                {form.popupPriceAmount && <p><span className="text-ink-muted">Pop-up:</span> €{form.popupPriceAmount} / {form.popupPriceUnit}</p>}
                {form.marketingPriceAmount && <p><span className="text-ink-muted">Marketing:</span> €{form.marketingPriceAmount} / {form.marketingPriceUnit}</p>}
                <p><span className="text-ink-muted">Available:</span> {form.availableFromImmediate ? 'Immediately' : form.availableFrom}</p>
                {form.availableUntil && <p><span className="text-ink-muted">Until:</span> {form.availableUntil}</p>}
                <p><span className="text-ink-muted">Photos:</span> {photos.length}</p>
              </div>
            </div>

            {submitError && (
              <div className="rounded-xl bg-red-50 border-2 border-red-400 px-4 py-4 text-sm text-red-700 font-medium">
                ⚠️ {submitError}
              </div>
            )}
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-warm-border">
          {step > 1 ? (
            <button type="button" onClick={() => setStep((s) => s - 1)}
              className="flex items-center gap-2 text-sm font-medium text-ink-muted hover:text-ink px-4 py-2 rounded-full hover:bg-stone transition-colors"
            >
              <ChevronLeft className="h-4 w-4" /> Back
            </button>
          ) : <div />}

          {step < 4 ? (
            <button type="button" onClick={() => { if (validate()) setStep((s) => s + 1) }}
              className="flex items-center gap-2 bg-forest hover:bg-forest-mid text-white font-semibold text-sm px-6 py-2.5 rounded-full transition-colors"
            >
              Next <ChevronRight className="h-4 w-4" />
            </button>
          ) : (
            <button type="button" onClick={handleSubmit} disabled={submitting}
              className="flex items-center gap-2 bg-forest hover:bg-forest-mid disabled:opacity-60 text-white font-semibold text-sm px-8 py-2.5 rounded-full transition-colors"
            >
              {submitting ? 'Publishing…' : 'Publish listing'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
