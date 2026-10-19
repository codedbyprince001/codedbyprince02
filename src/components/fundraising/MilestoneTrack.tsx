import { Check } from 'lucide-react'
import { siteConfig } from '../../config/site'
import { getCampaignState } from '../../lib/campaign'
import { formatMoney } from '../../lib/format'
import { Reveal } from '../ui/Reveal'

export function MilestoneTrack() {
  const { currency, milestones } = siteConfig.campaign
  const { reached, next, raised } = getCampaignState()
  const latest = reached[reached.length - 1]

  return (
    <div>
      <Reveal>
        <div
          className="border border-lime/40 bg-lime/[0.06] p-6 sm:p-8"
          role="status"
          aria-live="polite"
        >
          {latest ? (
            <>
              <p className="eyebrow">Milestone unlocked · {latest.title}</p>
              <p className="display mt-3 text-3xl text-cream sm:text-5xl">{latest.message}</p>
            </>
          ) : (
            <>
              <p className="eyebrow">Milestones</p>
              <p className="display mt-3 text-3xl text-cream sm:text-5xl">
                The first milestone is {next ? formatMoney(next.amount, currency) : 'waiting'}. Someone has to start.
              </p>
            </>
          )}
          {next && latest && (
            <p className="mt-4 font-mono text-xs uppercase tracking-widest text-bone">
              Next: {next.title} at {formatMoney(next.amount, currency)} ({formatMoney(next.amount - raised, currency)} to go)
            </p>
          )}
        </div>
      </Reveal>

      <ol className="mt-8 grid grid-cols-1 gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
        {milestones.map((milestone) => {
          const done = raised >= milestone.amount
          return (
            <li key={milestone.title} className="bg-ink p-5">
              <div className="flex items-center justify-between font-mono text-xs uppercase tracking-widest">
                <span className={done ? 'text-lime' : 'text-bone'}>{formatMoney(milestone.amount, currency)}</span>
                {done && <Check size={16} className="text-lime" aria-label="Reached" />}
              </div>
              <p className={`mt-3 font-sans text-lg font-semibold ${done ? 'text-cream' : 'text-bone/70'}`}>
                {milestone.title}
              </p>
              <p className="mt-1 text-sm text-bone/70">{done ? 'Reached' : 'Locked'}</p>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
