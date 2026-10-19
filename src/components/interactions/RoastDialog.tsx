import { useEffect, useRef } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { ArrowUpRight, Repeat, Share2, X } from 'lucide-react'
import { Button } from '../ui/Button'
import { siteConfig } from '../../config/site'
import { resolvedSiteUrl } from '../../config/links'
import { sharePayload } from '../../lib/share'
import { useToast } from '../../hooks/toastContext'

interface RoastDialogProps {
  open: boolean
  roast: string
  attempts: number
  onClose: () => void
  onRoastAgain: () => void
}

function chaseVerdict(attempts: number): string {
  if (attempts === 0) return 'Caught without a chase. Bold, efficient, still broke.'
  if (attempts < 4) return `Only ${attempts} escapes. You were gentle with it.`
  if (attempts < 10) return `${attempts} escapes. Your commitment is noted by the committee.`
  return `${attempts} escapes. This button has filed a harassment report.`
}

export function RoastDialog({ open, roast, attempts, onClose, onRoastAgain }: RoastDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const reduceMotion = useReducedMotion()
  const { notify } = useToast()

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
    document.documentElement.style.overflow = open ? 'hidden' : ''
    return () => {
      document.documentElement.style.overflow = ''
    }
  }, [open])

  const handleShare = async () => {
    const outcome = await sharePayload({
      title: 'I just got roasted by a developer',
      text: `"${roast}" — roasted by ${siteConfig.owner.name}'s begging website.`,
      url: resolvedSiteUrl(),
    })
    if (outcome === 'copied') notify('Roast copied to clipboard')
    if (outcome === 'failed') notify('Could not share. Copy the link manually.')
  }

  const words = roast.split(' ')

  return (
    <dialog
      ref={dialogRef}
      className="roast-dialog"
      aria-labelledby="roast-title"
      onClose={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <div
        className="flex h-full w-full items-center justify-center p-4"
        onClick={(event) => {
          if (event.target === event.currentTarget) onClose()
        }}
      >
        {open && (
          <motion.div
            key={roast}
            initial={reduceMotion ? false : { opacity: 0, scale: 0.86, rotate: -2, y: 40 }}
            animate={{ opacity: 1, scale: 1, rotate: 0, y: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 22 }}
            className="relative max-h-full w-full max-w-3xl overflow-y-auto bg-lime p-6 text-ink sm:p-12"
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Close roast"
              className="absolute right-3 top-3 flex h-11 w-11 items-center justify-center rounded-full border border-ink/30 transition-colors hover:bg-ink hover:text-lime"
            >
              <X size={20} />
            </button>

            <p className="font-mono text-xs font-medium uppercase tracking-[0.2em] text-ink/70">
              Official verdict · Case no. {String(attempts).padStart(3, '0')}
            </p>

            <h2
              id="roast-title"
              className="display mt-6 text-[clamp(2.2rem,7.5vw,4.6rem)] uppercase"
              aria-label={roast}
            >
              {words.map((word, index) => (
                <motion.span
                  key={`${roast}-${index}`}
                  aria-hidden
                  className="mr-[0.22em] inline-block"
                  initial={reduceMotion ? false : { opacity: 0, y: 30, rotate: 3 }}
                  animate={{ opacity: 1, y: 0, rotate: 0 }}
                  transition={{ delay: 0.15 + index * 0.045, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                >
                  {word}
                </motion.span>
              ))}
            </h2>

            <p className="mt-6 font-mono text-sm text-ink/75">{chaseVerdict(attempts)}</p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Button
                href={siteConfig.links.selar}
                external
                variant="cream"
                className="!bg-ink !text-lime hover:!bg-ink/85"
                icon={<ArrowUpRight size={18} />}
              >
                Fine, take my money
              </Button>
              <Button
                onClick={onRoastAgain}
                variant="outline"
                className="!border-ink/50 !text-ink hover:!border-ink hover:!bg-ink hover:!text-lime"
                icon={<Repeat size={18} />}
              >
                Roast me again
              </Button>
              <Button
                onClick={() => void handleShare()}
                variant="outline"
                className="!border-ink/50 !text-ink hover:!border-ink hover:!bg-ink hover:!text-lime"
                icon={<Share2 size={18} />}
              >
                Share
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </dialog>
  )
}
