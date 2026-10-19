import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'

const STORAGE_KEY = 'begging-ops:intro-seen'
const BOOT_LINES = [
  'starting up',
  'loading portfolio ...... done',
  'locating wallet ........ not found',
  'optimism ............... high',
]
const LINE_INTERVAL_MS = 380
const TOTAL_MS = BOOT_LINES.length * LINE_INTERVAL_MS + 500

function alreadySeen(): boolean {
  try {
    return sessionStorage.getItem(STORAGE_KEY) === '1'
  } catch {
    return false
  }
}

export function IntroSplash() {
  const reduceMotion = useReducedMotion()
  const [visible, setVisible] = useState(() => !alreadySeen())
  const [lines, setLines] = useState(1)

  const dismiss = () => {
    setVisible(false)
    try {
      sessionStorage.setItem(STORAGE_KEY, '1')
    } catch {
      // storage can be unavailable in private modes; the intro just replays
    }
  }

  useEffect(() => {
    if (!visible || reduceMotion) return
    const ticker = window.setInterval(() => setLines((n) => Math.min(n + 1, BOOT_LINES.length)), LINE_INTERVAL_MS)
    const closer = window.setTimeout(() => {
      setVisible(false)
      try {
        sessionStorage.setItem(STORAGE_KEY, '1')
      } catch {
        // see dismiss()
      }
    }, TOTAL_MS)
    return () => {
      window.clearInterval(ticker)
      window.clearTimeout(closer)
    }
  }, [visible, reduceMotion])

  return (
    <AnimatePresence>
      {visible && !reduceMotion && (
        <motion.div
          key="intro"
          className="fixed inset-0 z-[80] flex flex-col justify-between bg-ink p-6 sm:p-10"
          exit={{ clipPath: 'inset(0 0 100% 0)' }}
          transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
          initial={{ clipPath: 'inset(0 0 0% 0)' }}
          animate={{ clipPath: 'inset(0 0 0% 0)' }}
          role="status"
          aria-label="Loading introduction"
        >
          <div className="flex justify-end">
            <button
              type="button"
              onClick={dismiss}
              className="font-mono text-xs uppercase tracking-[0.2em] text-bone underline decoration-lime/60 underline-offset-4 hover:text-lime"
            >
              Skip intro
            </button>
          </div>
          <ul className="font-mono text-sm leading-8 text-lime sm:text-base">
            {BOOT_LINES.slice(0, lines).map((line) => (
              <motion.li key={line} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
                <span className="text-bone">&gt; </span>
                {line}
              </motion.li>
            ))}
          </ul>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
