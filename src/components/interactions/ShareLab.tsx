import { SectionHeading } from '../ui/SectionHeading'
import { Reveal } from '../ui/Reveal'
import { BeggingReceipt } from './BeggingReceipt'
import { FinancialStatusGenerator } from './FinancialStatusGenerator'
import { ShareActions } from './ShareActions'

export function ShareLab() {
  return (
    <section id="share" className="mx-auto max-w-[88rem] px-5 py-24 sm:px-8 sm:py-36" aria-label="Share tools">
      <SectionHeading
        index="03"
        eyebrow="Spread the suffering"
        lead="Not ready to give? Make something to share instead."
      >
        Free to make. <span className="italic text-lime">Fun to post.</span>
      </SectionHeading>

      <Reveal>
        <BeggingReceipt />
      </Reveal>

      <div className="my-20 h-px bg-line sm:my-28" />

      <Reveal>
        <FinancialStatusGenerator />
      </Reveal>

      <div className="mt-20 border-t border-line pt-10 sm:mt-28">
        <Reveal>
          <p className="display max-w-2xl text-3xl text-cream sm:text-5xl">
            Know someone who would enjoy this?
          </p>
          <div className="mt-6">
            <ShareActions />
          </div>
        </Reveal>
      </div>
    </section>
  )
}
