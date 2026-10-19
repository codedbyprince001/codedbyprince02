import { useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { Dices, Share2 } from 'lucide-react'
import { Button } from '../ui/Button'
import { CopyButton } from '../ui/CopyButton'
import { financialMoods } from '../../data/jokes'
import { resolvedSiteUrl } from '../../config/links'
import { pick } from '../../lib/format'
import { sharePayload } from '../../lib/share'
import { useToast } from '../../hooks/toastContext'
import { cn } from '../../lib/cn'

export function FinancialStatusGenerator() {
  const reduceMotion = useReducedMotion()
  const { notify } = useToast()
  const [moodId, setMoodId] = useState(financialMoods[0].id)
  const [status, setStatus] = useState<string | null>(null)

  const mood = financialMoods.find((entry) => entry.id === moodId) ?? financialMoods[0]

  const generate = (nextMood = mood) => {
    setStatus((current) => pick(nextMood.statuses, current ?? undefined))
  }

  const selectMood = (id: string) => {
    setMoodId(id)
    const next = financialMoods.find((entry) => entry.id === id)
    if (next) generate(next)
  }

  const share = async () => {
    if (!status) return
    const outcome = await sharePayload({
      title: 'My financial status',
      text: status,
      url: resolvedSiteUrl(),
    })
    if (outcome === 'copied') notify('Status and link copied')
    if (outcome === 'failed') notify('Could not share. Use the copy button.')
  }

  return (
    <div>
      <p className="eyebrow">Status</p>
      <h3 className="display mt-3 text-4xl text-cream sm:text-6xl">Financial status generator</h3>
      <p className="mt-5 max-w-md text-bone">Pick a mood and get a status you can paste anywhere.</p>

      <fieldset className="mt-8">
        <legend className="sr-only">Choose a financial mood</legend>
        <div className="flex flex-wrap gap-2">
          {financialMoods.map((entry) => {
            const active = entry.id === moodId && status !== null
            return (
              <label
                key={entry.id}
                className={cn(
                  'min-h-11 cursor-pointer border px-4 py-2.5 font-mono text-xs uppercase tracking-widest transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-lime',
                  active ? 'border-lime bg-lime text-ink' : 'border-line text-cream hover:border-cream/50',
                )}
              >
                <input
                  type="radio"
                  name="financial-mood"
                  className="sr-only"
                  checked={entry.id === moodId}
                  onChange={() => selectMood(entry.id)}
                />
                {entry.label}
              </label>
            )
          })}
        </div>
      </fieldset>

      <div className="mt-8 min-h-44 border border-line bg-coal p-6 sm:p-8" aria-live="polite">
        <AnimatePresence mode="wait">
          <motion.p
            key={status ?? 'empty'}
            initial={reduceMotion ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="display text-3xl text-cream sm:text-4xl"
          >
            {status ?? 'Pick a mood to see your status.'}
          </motion.p>
        </AnimatePresence>
      </div>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <Button onClick={() => generate()} icon={<Dices size={18} />}>
          {status ? 'Another one' : 'Generate'}
        </Button>
        {status && (
          <>
            <CopyButton text={status} label="Copy status" copiedLabel="Status copied" variant="cream" />
            <Button variant="outline" onClick={() => void share()} icon={<Share2 size={18} />}>
              Share
            </Button>
          </>
        )}
      </div>
    </div>
  )
}
