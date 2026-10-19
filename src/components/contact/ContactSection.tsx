import { ArrowUpRight, BriefcaseBusiness, FileDown, Mail, Globe } from 'lucide-react'
import { GithubIcon, LinkedinIcon } from '../ui/BrandIcons'
import type { ReactNode } from 'react'
import { SectionHeading } from '../ui/SectionHeading'
import { Reveal } from '../ui/Reveal'
import { Button } from '../ui/Button'
import { CopyButton } from '../ui/CopyButton'
import { siteConfig } from '../../config/site'
import { isConfigured, mailtoHref } from '../../config/links'

interface ContactLink {
  label: string
  href: string
  icon: ReactNode
  detail: string
}

export function ContactSection() {
  const { links, skills, portfolioUrl, owner } = siteConfig
  const jobMail = mailtoHref(`Job offer for ${owner.name}`)
  const emailConfigured = isConfigured(links.email)

  const contactLinks: ContactLink[] = [
    { label: 'Portfolio', href: portfolioUrl, icon: <Globe size={20} />, detail: portfolioUrl.replace(/^https?:\/\//, '') },
    ...(isConfigured(links.github)
      ? [{ label: 'GitHub', href: links.github, icon: <GithubIcon size={20} />, detail: links.github.replace(/^https?:\/\//, '') }]
      : []),
    ...(isConfigured(links.linkedin)
      ? [{ label: 'LinkedIn', href: links.linkedin, icon: <LinkedinIcon size={20} />, detail: links.linkedin.replace(/^https?:\/\//, '') }]
      : []),
    ...(isConfigured(links.cv)
      ? [{ label: 'Download CV', href: links.cv, icon: <FileDown size={20} />, detail: 'PDF' }]
      : []),
  ]

  return (
    <section id="hire" className="border-t border-line bg-coal" aria-label="Hire me">
      <div className="mx-auto max-w-[88rem] px-5 py-24 sm:px-8 sm:py-36">
        <SectionHeading
          index="04"
          eyebrow="The employment section"
          lead="I build interfaces, APIs, mobile apps and AI features, and I ship. If your team needs a developer who delivers and does not panic under pressure, let us talk."
        >
          Or, instead of donating, <span className="italic text-lime">change my life.</span>
        </SectionHeading>

        <div className="grid grid-cols-1 gap-14 lg:grid-cols-[1fr_1fr] lg:gap-24">
          <Reveal>
            <h3 className="eyebrow mb-5">What I bring</h3>
            <ul className="flex flex-wrap gap-2" aria-label="Skills">
              {skills.map((skill) => (
                <li key={skill} className="border border-line px-4 py-2 font-mono text-sm text-cream">
                  {skill}
                </li>
              ))}
            </ul>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Button
                href={jobMail ?? portfolioUrl}
                external={!jobMail}
                icon={<BriefcaseBusiness size={19} />}
              >
                Offer me a job
              </Button>
              {emailConfigured && (
                <CopyButton text={links.email} label="Copy email" copiedLabel="Email copied" />
              )}
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <h3 className="eyebrow mb-5">Find me</h3>
            <ul className="border-t border-line">
              {emailConfigured && (
                <li className="border-b border-line">
                  <a
                    href={`mailto:${links.email}`}
                    className="group flex min-w-0 items-center justify-between gap-4 py-5 text-cream transition-colors hover:text-lime"
                  >
                    <span className="flex shrink-0 items-center gap-4">
                      <Mail size={20} />
                      <span className="font-sans text-xl font-semibold">Email</span>
                    </span>
                    <span className="truncate font-mono text-xs text-bone group-hover:text-lime">{links.email}</span>
                  </a>
                </li>
              )}
              {contactLinks.map((link) => (
                <li key={link.label} className="border-b border-line">
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex min-w-0 items-center justify-between gap-4 py-5 text-cream transition-colors hover:text-lime"
                  >
                    <span className="flex shrink-0 items-center gap-4">
                      {link.icon}
                      <span className="font-sans text-xl font-semibold">{link.label}</span>
                    </span>
                    <span className="flex min-w-0 items-center gap-2">
                      <span className="truncate font-mono text-xs text-bone group-hover:text-lime">{link.detail}</span>
                      <ArrowUpRight size={18} className="shrink-0 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
