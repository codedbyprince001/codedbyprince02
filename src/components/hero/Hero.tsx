import { Suspense, lazy, useRef, useState } from 'react'
import { motion, useInView, useReducedMotion } from 'motion/react'
import { ArrowDown, BriefcaseBusiness, HandCoins } from 'lucide-react'
import { Button } from '../ui/Button'
import { Magnetic } from '../ui/Magnetic'
import { ErrorBoundary } from '../ui/ErrorBoundary'
import { EvasiveButton } from '../interactions/EvasiveButton'
import { RoastDialog } from '../interactions/RoastDialog'
import { HeroFallback } from './HeroFallback'
import { siteConfig } from '../../config/site'
import { roasts } from '../../data/jokes'
import { pick } from '../../lib/format'
import { hasWebGL } from '../../lib/webgl'
import { useCoarsePointer } from '../../hooks/useCoarsePointer'

const HeroScene = lazy(() => import('./HeroScene'))

const HEADLINE = ['I built the future.', 'The future has', 'not paid me.']
const ATTEMPT_LOG = [
  { task: 'Got hired', result: 'And did the job well.' },
  { task: 'Freelanced', result: 'Clients came back.' },
  { task: 'Built real software', result: 'It is live and it works.' },
  { task: 'My bank account', result: 'Has not heard the news.' },
]

export function Hero() {
  const reduceMotion = useReducedMotion() ?? false
  const coarse = useCoarsePointer()
  const sceneRef = useRef<HTMLDivElement>(null)
  const sceneVisible = useInView(sceneRef, { margin: '200px' })
  const [webglFailed, setWebglFailed] = useState(() => !hasWebGL())
  const [attempts, setAttempts] = useState(0)
  const [roastOpen, setRoastOpen] = useState(false)
  const [roast, setRoast] = useState(() => pick(roasts))

  const lineDelay = (index: number) => (reduceMotion ? 0 : 0.15 + index * 0.12)

  const openRoast = () => {
    setRoast((current) => pick(roasts, current))
    setRoastOpen(true)
  }

  return (
    <section id="top" className="relative isolate overflow-hidden" aria-labelledby="hero-title">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-40 top-0 -z-10 h-[40rem] w-[40rem] rounded-full bg-lime/[0.07] blur-[140px]"
      />

      <div className="mx-auto grid min-h-[100svh] max-w-[88rem] grid-cols-1 gap-x-8 px-5 pb-16 pt-24 sm:px-8 lg:grid-cols-[1.08fr_0.92fr] lg:items-center lg:pt-20">
        <div className="order-2 lg:order-1">
          <motion.p
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="eyebrow mb-6 flex items-center gap-3"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-lime opacity-70" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-lime" />
            </span>
            Digital begging operation · now accepting transfers
          </motion.p>

          <h1
            id="hero-title"
            className="display text-[clamp(2.3rem,10vw,5.6rem)] uppercase lg:text-[clamp(3rem,5.6vw,5.6rem)]"
            aria-label="I built the future. The future has not paid me."
          >
            {HEADLINE.map((line, index) => (
              <span key={line} className="block overflow-hidden pb-[0.06em]">
                <motion.span
                  className={index >= 1 ? 'block italic text-lime' : 'block'}
                  initial={reduceMotion ? false : { y: '110%' }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.9, delay: lineDelay(index) + 0.5, ease: [0.16, 1, 0.3, 1] }}
                >
                  {line}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.p
            initial={reduceMotion ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.35, duration: 0.8 }}
            className="mt-8 max-w-xl text-lg leading-relaxed text-bone"
          >
            I'm {siteConfig.owner.name}, a Nigerian software developer. I build websites, mobile
            apps, backend systems and AI-powered applications. Unfortunately, my bank account does
            not recognise any of this.{' '}
            <span className="text-cream">So I asked the internet for money.</span>
          </motion.p>

          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 0.8 }}
            className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap"
          >
            <Magnetic>
              <Button
                href={siteConfig.links.selar}
                external
                icon={<HandCoins size={19} />}
                className="w-full sm:w-auto"
              >
                Give me money
              </Button>
            </Magnetic>
            <Button
              href="#hire"
              variant="outline"
              icon={<BriefcaseBusiness size={19} />}
              className="w-full sm:w-auto"
            >
              Offer me a job
            </Button>
          </motion.div>

          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.65, duration: 0.8 }}
            className="mt-6 max-w-[34rem]"
          >
            <EvasiveButton
              attempts={attempts}
              onAttempt={() => setAttempts((n) => n + 1)}
              onCaught={openRoast}
            />
            {coarse && (
              <p className="mt-2 font-mono text-[0.68rem] uppercase tracking-widest text-bone/70">
                On a phone? Keep tapping.
              </p>
            )}
          </motion.div>
        </div>

        <div className="order-1 mb-6 lg:order-2 lg:mb-0">
          <div
            ref={sceneRef}
            className="relative mx-auto h-[min(46svh,24rem)] w-full max-w-[34rem] lg:h-[min(70svh,38rem)] lg:max-w-none"
          >
            {webglFailed ? (
              <HeroFallback />
            ) : (
              <ErrorBoundary fallback={<HeroFallback />} onError={() => setWebglFailed(true)}>
                <Suspense fallback={<HeroFallback />}>
                  <HeroScene
                    active={sceneVisible}
                    reducedMotion={reduceMotion}
                    finePointer={!coarse}
                    onContextLost={() => setWebglFailed(true)}
                  />
                </Suspense>
              </ErrorBoundary>
            )}

            <dl className="pointer-events-none absolute bottom-1 left-0 right-0 flex items-end justify-between px-1 font-mono text-[0.68rem] uppercase tracking-[0.18em] text-bone sm:text-xs">
              <div>
                <dt className="text-bone/60">Account balance</dt>
                <dd className="mt-1 text-base text-cream sm:text-lg">₦ 214.50</dd>
              </div>
              <div className="text-right">
                <dt className="text-bone/60">Status</dt>
                <dd className="mt-1 text-base text-lime sm:text-lg">Optimistic</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[88rem] px-5 pb-10 sm:px-8">
        <h2 className="eyebrow mb-4">Career status report</h2>
        <ul className="grid grid-cols-1 gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {ATTEMPT_LOG.map((entry, index) => (
            <motion.li
              key={entry.task}
              initial={reduceMotion ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08, duration: 0.6 }}
              className="bg-ink p-5"
            >
              <p className="font-mono text-xs text-bone/70">0{index + 1}</p>
              <p className="mt-3 font-sans text-lg font-semibold text-cream">{entry.task}</p>
              <p className="mt-1 text-sm text-bone">{entry.result}</p>
            </motion.li>
          ))}
        </ul>
        <a
          href="#work"
          className="mt-8 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-bone transition-colors hover:text-lime"
        >
          See my work <ArrowDown size={16} />
        </a>
      </div>

      <RoastDialog
        open={roastOpen}
        roast={roast}
        attempts={attempts}
        onClose={() => setRoastOpen(false)}
        onRoastAgain={() => setRoast((current) => pick(roasts, current))}
      />
    </section>
  )
}
