import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useSpring } from 'motion/react'
import { Menu, X } from 'lucide-react'
import { Button } from '../ui/Button'
import { siteConfig } from '../../config/site'

const NAV_LINKS = [
  { href: '#work', label: 'Portfolio' },
  { href: '#money', label: 'Support' },
  { href: '#share', label: 'Share' },
  { href: '#hire', label: 'Hire me' },
]

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { scrollY, scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 28 })

  useMotionValueEvent(scrollY, 'change', (value) => setScrolled(value > 40))

  useEffect(() => {
    if (!menuOpen) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false)
    }
    document.addEventListener('keydown', onKey)
    document.documentElement.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.documentElement.style.overflow = ''
    }
  }, [menuOpen])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled || menuOpen ? 'bg-ink/85 backdrop-blur-md' : 'bg-transparent'
      }`}
    >
      <motion.div
        aria-hidden
        style={{ scaleX: progress }}
        className="absolute inset-x-0 top-0 h-[2px] origin-left bg-lime"
      />
      <nav
        aria-label="Primary"
        className="mx-auto flex h-16 max-w-[88rem] items-center justify-between px-5 sm:px-8"
      >
        <a href="#top" className="group flex items-baseline gap-2" onClick={() => setMenuOpen(false)}>
          <span className="display text-2xl text-cream">{siteConfig.owner.name}</span>
          <span className="font-mono text-[0.62rem] uppercase tracking-[0.2em] text-lime">
            / begging ops
          </span>
        </a>

        <ul className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="font-mono text-xs uppercase tracking-[0.16em] text-bone transition-colors hover:text-lime"
              >
                {link.label}
              </a>
            </li>
          ))}
          <li>
            <Button href={siteConfig.links.selar} external className="!min-h-10 !px-5 !py-2 !text-xs">
              Give
            </Button>
          </li>
        </ul>

        <button
          type="button"
          className="flex h-11 w-11 items-center justify-center rounded-full border border-cream/25 text-cream md:hidden"
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'calc(100dvh - 4rem)' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden bg-ink md:hidden"
          >
            <ul className="flex h-full flex-col justify-center gap-2 px-6 pb-16">
              {NAV_LINKS.map((link, index) => (
                <motion.li
                  key={link.href}
                  initial={{ opacity: 0, x: -24 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.08 + index * 0.06 }}
                >
                  <a
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className="display block py-2 text-[clamp(2.6rem,12vw,4rem)] uppercase text-cream active:text-lime"
                  >
                    {link.label}
                  </a>
                </motion.li>
              ))}
              <li className="mt-6">
                <Button
                  href={siteConfig.links.selar}
                  external
                  className="w-full"
                  onClick={() => setMenuOpen(false)}
                >
                  Give me money
                </Button>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
