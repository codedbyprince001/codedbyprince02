import type { ReactNode } from 'react'
import { Reveal } from './Reveal'

interface SectionHeadingProps {
  index: string
  eyebrow: string
  children: ReactNode
  lead?: ReactNode
}

export function SectionHeading({ index, eyebrow, children, lead }: SectionHeadingProps) {
  return (
    <header className="mb-12 max-w-4xl sm:mb-16">
      <Reveal>
        <p className="eyebrow mb-5 flex items-center gap-3">
          <span className="text-bone">{index}</span>
          <span aria-hidden className="h-px w-10 bg-lime/60" />
          {eyebrow}
        </p>
      </Reveal>
      <Reveal delay={0.08}>
        <h2 className="display text-[clamp(2.6rem,8.5vw,6.2rem)] text-cream">{children}</h2>
      </Reveal>
      {lead && (
        <Reveal delay={0.16}>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-bone">{lead}</p>
        </Reveal>
      )}
    </header>
  )
}
