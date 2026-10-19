import { ArrowUp } from 'lucide-react'
import { Marquee } from '../ui/Marquee'
import { Button } from '../ui/Button'
import { Reveal } from '../ui/Reveal'
import { siteConfig } from '../../config/site'
import { isConfigured } from '../../config/links'

const MARQUEE_ITEMS = [
  'Open to jobs',
  'Open to donations',
  'Not open to exposure',
  'Will code for rent',
]

export function Footer() {
  const { links, portfolioUrl, owner } = siteConfig
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-line">
      <Marquee items={MARQUEE_ITEMS} />
      <div className="mx-auto max-w-[88rem] px-5 pb-10 pt-24 sm:px-8 sm:pt-32">
        <Reveal>
          <p className="display max-w-5xl text-[clamp(2.4rem,7vw,5.6rem)] uppercase text-cream">
            If you made it this far, you're either interested in my code{' '}
            <span className="italic text-lime">or you're a very patient hater.</span>
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Button href={links.selar} external>
              Support the developer
            </Button>
            <Button href="#hire" variant="outline">
              Hire the developer
            </Button>
          </div>
        </Reveal>

        <div className="mt-20 flex flex-col gap-8 border-t border-line pt-8 sm:flex-row sm:items-end sm:justify-between">
          <nav aria-label="Footer">
            <ul className="flex flex-wrap gap-x-8 gap-y-3 font-mono text-xs uppercase tracking-widest text-bone">
              <li>
                <a className="hover:text-lime" href={portfolioUrl} target="_blank" rel="noopener noreferrer">
                  Portfolio
                </a>
              </li>
              <li>
                <a className="hover:text-lime" href="#hire">
                  Contact
                </a>
              </li>
              {isConfigured(links.github) && (
                <li>
                  <a className="hover:text-lime" href={links.github} target="_blank" rel="noopener noreferrer">
                    GitHub
                  </a>
                </li>
              )}
              {isConfigured(links.linkedin) && (
                <li>
                  <a className="hover:text-lime" href={links.linkedin} target="_blank" rel="noopener noreferrer">
                    LinkedIn
                  </a>
                </li>
              )}
              {isConfigured(links.x) && (
                <li>
                  <a className="hover:text-lime" href={links.x} target="_blank" rel="noopener noreferrer">
                    X
                  </a>
                </li>
              )}
              <li>
                <a className="hover:text-lime" href={links.selar} target="_blank" rel="noopener noreferrer">
                  Contribute
                </a>
              </li>
            </ul>
          </nav>
          <div className="flex items-end justify-between gap-6 sm:flex-col sm:items-end">
            <a
              href="#top"
              className="flex h-12 w-12 items-center justify-center rounded-full border border-cream/30 text-cream transition-colors hover:border-lime hover:text-lime"
              aria-label="Back to top"
            >
              <ArrowUp size={20} />
            </a>
            <p className="max-w-xs font-mono text-[0.68rem] uppercase leading-relaxed tracking-widest text-bone/70 sm:text-right">
              © {year} {owner.name}. Built with React, TypeScript and Three.js.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
