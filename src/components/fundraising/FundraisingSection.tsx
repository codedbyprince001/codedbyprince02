import { useState } from 'react'
import { ArrowUpRight, ShieldCheck } from 'lucide-react'
import { SectionHeading } from '../ui/SectionHeading'
import { Reveal } from '../ui/Reveal'
import { Button } from '../ui/Button'
import { Magnetic } from '../ui/Magnetic'
import { CampaignCounter } from './CampaignCounter'
import { MilestoneTrack } from './MilestoneTrack'
import { SupporterWall } from './SupporterWall'
import { ShareActions } from '../interactions/ShareActions'
import { siteConfig } from '../../config/site'
import { reasonsToContribute } from '../../data/jokes'
import { supporters } from '../../data/supporters'
import { formatMoney } from '../../lib/format'
import { cn } from '../../lib/cn'

export function FundraisingSection() {
  const { campaign, links } = siteConfig
  const [selected, setSelected] = useState(campaign.suggestedAmounts[0]?.amount ?? 0)
  const selectedCaption = campaign.suggestedAmounts.find((entry) => entry.amount === selected)?.caption

  return (
    <section id="money" className="relative border-t border-line bg-coal" aria-label="Fundraising">
      <div className="mx-auto max-w-[88rem] px-5 py-24 sm:px-8 sm:py-36">
        <SectionHeading index="02" eyebrow="The money zone">
          The internet has money. <span className="italic text-lime">I have internet.</span>
        </SectionHeading>

        <div className="grid grid-cols-1 gap-14 lg:grid-cols-[1fr_0.95fr] lg:gap-20">
          <div className="space-y-6 text-lg leading-relaxed text-bone">
            <Reveal>
              <h3 className="display text-4xl text-cream sm:text-5xl">{campaign.title}</h3>
            </Reveal>
            <Reveal delay={0.05}>
              <p>
                I'm testing whether a developer with no huge audience can convince strangers around
                the world to support him with small contributions.
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <p>{campaign.purpose}</p>
            </Reveal>
            <Reveal delay={0.15}>
              <p className="text-cream">
                If you want to help, you can. If you don't, enjoy the website. That is also a valid
                contribution to my entertainment budget.
              </p>
            </Reveal>
            <Reveal delay={0.2}>
              <div className="flex gap-4 border-l-2 border-lime pl-5 text-base">
                <ShieldCheck className="mt-1 shrink-0 text-lime" size={22} aria-hidden />
                <p>
                  <strong className="text-cream">Transparency.</strong> Payments are processed by
                  Selar, not by this website, and I never see your card details. The total above is
                  updated by hand from my Selar dashboard, so it can lag behind. Clicking a button
                  here does not confirm a payment.
                </p>
              </div>
            </Reveal>
          </div>

          <Reveal y={40}>
            <div className="border border-lime/40 bg-ink p-6 sm:p-9 lg:sticky lg:top-24">
              <CampaignCounter />

              <fieldset className="mt-9">
                <legend className="eyebrow mb-3">Pick an amount, then choose it on Selar</legend>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {campaign.suggestedAmounts.map((entry) => {
                    const active = entry.amount === selected
                    return (
                      <label
                        key={entry.amount}
                        className={cn(
                          'flex min-h-12 cursor-pointer items-center justify-center border px-2 py-2 text-center font-mono text-sm transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-lime',
                          active
                            ? 'border-lime bg-lime text-ink'
                            : 'border-line text-cream hover:border-cream/50',
                        )}
                      >
                        <input
                          type="radio"
                          name="suggested-amount"
                          className="sr-only"
                          checked={active}
                          onChange={() => setSelected(entry.amount)}
                        />
                        {formatMoney(entry.amount, campaign.currency)}
                      </label>
                    )
                  })}
                </div>
                <p className="mt-3 min-h-12 text-sm text-bone" aria-live="polite">
                  {selectedCaption}
                </p>
              </fieldset>

              <Magnetic className="mt-2">
                <Button
                  href={links.selar}
                  external
                  className="w-full !py-4 text-base"
                  icon={<ArrowUpRight size={20} />}
                >
                  Support on Selar
                </Button>
              </Magnetic>
              <p className="mt-3 text-center font-mono text-[0.68rem] uppercase tracking-widest text-bone/70">
                Opens Selar in a new tab. Payment happens there.
              </p>

              <div className="mt-6 border-t border-line pt-6">
                <ShareActions />
              </div>
            </div>
          </Reveal>
        </div>

        <div className="mt-24 sm:mt-32">
          <MilestoneTrack />
        </div>

        <div className="mt-24 sm:mt-32">
          <Reveal>
            <h3 className="display max-w-3xl text-4xl text-cream sm:text-6xl">
              Why give? <span className="italic text-lime">Fair question.</span>
            </h3>
          </Reveal>
          <ol className="mt-10 grid grid-cols-1 gap-x-10 gap-y-8 md:grid-cols-3">
            {reasonsToContribute.map((reason, index) => (
              <li key={reason.title}>
                <Reveal delay={index * 0.08} className="border-t border-cream/30 pt-5">
                  <p className="font-mono text-xs text-lime">0{index + 1}</p>
                  <p className="mt-3 font-sans text-2xl font-semibold text-cream">{reason.title}</p>
                  <p className="mt-2 text-bone">{reason.body}</p>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>

        {supporters.length > 0 && (
          <div className="mt-24 sm:mt-32">
            <SupporterWall />
          </div>
        )}
      </div>
    </section>
  )
}
