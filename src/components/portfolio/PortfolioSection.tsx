import { ArrowUpRight } from 'lucide-react'
import { SectionHeading } from '../ui/SectionHeading'
import { Reveal } from '../ui/Reveal'
import { siteConfig } from '../../config/site'

export function PortfolioSection() {
  const { portfolioUrl, skills } = siteConfig
  const label = portfolioUrl.replace(/^https?:\/\//, '').replace(/\/$/, '')

  return (
    <section id="work" className="mx-auto max-w-[88rem] px-5 py-24 sm:px-8 sm:py-36" aria-label="Portfolio">
      <SectionHeading
        index="01"
        eyebrow="The work"
        lead="Websites, mobile apps, backend systems and AI-powered applications. Every project, with live links, is on my portfolio."
      >
        See the work. <span className="italic text-lime">Then judge the bank.</span>
      </SectionHeading>

      <Reveal>
        <a
          href={portfolioUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center justify-between gap-6 border-y border-line py-8 transition-colors hover:border-lime sm:py-12"
        >
          <span className="min-w-0">
            <span className="eyebrow block">Open portfolio</span>
            <span className="display mt-3 block break-words text-[clamp(1.9rem,6vw,4.6rem)] text-cream transition-colors group-hover:text-lime">
              {label}
            </span>
          </span>
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-cream/30 text-cream transition-all duration-300 group-hover:rotate-45 group-hover:border-lime group-hover:bg-lime group-hover:text-ink sm:h-20 sm:w-20">
            <ArrowUpRight size={28} />
          </span>
        </a>
      </Reveal>

      <Reveal delay={0.1}>
        <ul className="mt-10 flex flex-wrap gap-2" aria-label="Technologies">
          {skills.map((skill) => (
            <li key={skill} className="border border-line px-4 py-2 font-mono text-sm text-bone">
              {skill}
            </li>
          ))}
        </ul>
      </Reveal>
    </section>
  )
}
