import { motion, useReducedMotion } from 'motion/react'
import { AnimatedNumber } from '../ui/AnimatedNumber'
import { siteConfig } from '../../config/site'
import { getCampaignState } from '../../lib/campaign'
import { formatMoney } from '../../lib/format'

export function CampaignCounter() {
  const reduceMotion = useReducedMotion()
  const { currency, lastVerifiedOn } = siteConfig.campaign
  const { raised, goal, ratio } = getCampaignState()
  const percent = Math.round(ratio * 100)
  const money = (value: number) => formatMoney(value, currency)

  return (
    <div>
      <p className="eyebrow">Verified total</p>
      <p className="display mt-3 text-[clamp(3.4rem,10vw,6rem)] text-cream">
        <AnimatedNumber value={raised} format={money} />
      </p>
      <p className="mt-1 font-mono text-xs uppercase tracking-widest text-bone">
        of {money(goal)} goal · {percent}%
      </p>

      <div
        className="mt-6 h-3 w-full overflow-hidden bg-soot"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={goal}
        aria-valuenow={raised}
        aria-label="Verified fundraising progress"
      >
        {reduceMotion ? (
          <div className="h-full origin-left bg-lime" style={{ transform: `scaleX(${ratio})` }} />
        ) : (
          <motion.div
            className="h-full origin-left bg-lime"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: ratio }}
            viewport={{ once: true }}
            transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          />
        )}
      </div>

      <p className="mt-3 text-sm text-bone">
        {raised === 0
          ? 'Nothing yet. Be the first.'
          : lastVerifiedOn
            ? `Last updated ${lastVerifiedOn}.`
            : 'Updated by hand from my Selar dashboard.'}
      </p>
    </div>
  )
}
