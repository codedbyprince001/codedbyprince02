import { useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { Download, Printer, Share2 } from 'lucide-react'
import { Button } from '../ui/Button'
import { resolvedSiteUrl } from '../../config/links'
import { siteConfig } from '../../config/site'
import { canvasToBlob, drawReceipt } from '../../lib/drawReceipt'
import { generateReceiptId, receiptOneLiners } from '../../lib/receipt'
import { pick } from '../../lib/format'
import { sharePayload } from '../../lib/share'
import { useToast } from '../../hooks/toastContext'

type Status = 'idle' | 'drawing' | 'ready' | 'error'

export function BeggingReceipt() {
  const reduceMotion = useReducedMotion()
  const { notify } = useToast()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [status, setStatus] = useState<Status>('idle')
  const [receiptId, setReceiptId] = useState<string | null>(null)
  const [lastLine, setLastLine] = useState<string | undefined>()

  useEffect(() => {
    if (status === 'ready') canvasRef.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
  }, [status, receiptId])

  const generate = async () => {
    const canvas = canvasRef.current
    if (!canvas) return
    setStatus('drawing')
    const id = generateReceiptId()
    const oneLiner = pick(receiptOneLiners, lastLine)
    setLastLine(oneLiner)
    try {
      await drawReceipt(canvas, { id, oneLiner, url: resolvedSiteUrl(), issuedAt: new Date() })
      setReceiptId(id)
      setStatus('ready')
    } catch {
      setStatus('error')
    }
  }

  const download = async () => {
    const canvas = canvasRef.current
    if (!canvas || !receiptId) return
    try {
      const blob = await canvasToBlob(canvas)
      const href = URL.createObjectURL(blob)
      const anchor = document.createElement('a')
      anchor.href = href
      anchor.download = `begging-receipt-${receiptId}.png`
      document.body.appendChild(anchor)
      anchor.click()
      anchor.remove()
      window.setTimeout(() => URL.revokeObjectURL(href), 2000)
    } catch {
      notify('Could not create the PNG')
    }
  }

  const share = async () => {
    const canvas = canvasRef.current
    if (!canvas || !receiptId) return
    try {
      const blob = await canvasToBlob(canvas)
      const file = new File([blob], `begging-receipt-${receiptId}.png`, { type: 'image/png' })
      const outcome = await sharePayload({
        title: 'My begging receipt',
        text: `I got a begging receipt from ${siteConfig.owner.name}. It is not a donation receipt. It is a flex.`,
        url: resolvedSiteUrl(),
        files: [file],
      })
      if (outcome === 'copied') notify('Message and link copied. Download the PNG to attach it.')
      if (outcome === 'failed') notify('Sharing failed. Download the PNG instead.')
    } catch {
      notify('Could not prepare the receipt for sharing')
    }
  }

  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
      <div>
        <p className="eyebrow">Receipt</p>
        <h3 className="display mt-3 text-4xl text-cream sm:text-6xl">Generate your begging receipt</h3>
        <p className="mt-5 max-w-md text-bone">
          A shareable card with its own receipt ID, made in your browser. It shows you visited, not that you donated.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <Button
            onClick={() => void generate()}
            icon={<Printer size={18} />}
            disabled={status === 'drawing'}
            aria-busy={status === 'drawing'}
          >
            {status === 'ready' ? 'Print another' : status === 'drawing' ? 'Printing...' : 'Generate my begging receipt'}
          </Button>
          {status === 'ready' && (
            <>
              <Button variant="cream" onClick={() => void download()} icon={<Download size={18} />}>
                Download PNG
              </Button>
              <Button variant="outline" onClick={() => void share()} icon={<Share2 size={18} />}>
                Share
              </Button>
            </>
          )}
        </div>
        {status === 'error' && (
          <p className="mt-4 text-ember" role="alert">
            Your browser could not draw the receipt. Try another browser.
          </p>
        )}
      </div>

      <div className="flex justify-center lg:justify-end">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          animate={{ rotate: status === 'ready' ? 1.2 : 0 }}
          transition={{ type: 'spring', stiffness: 160, damping: 18 }}
          className="relative w-full max-w-[26rem]"
        >
          <canvas
            ref={canvasRef}
            role="img"
            aria-label={receiptId ? `Begging receipt ${receiptId}` : 'Receipt preview appears here'}
            className={`aspect-[1080/1500] w-full bg-soot ${status === 'ready' ? 'shadow-[0_30px_80px_rgba(0,0,0,0.6)]' : 'opacity-40'}`}
          />
          {status !== 'ready' && (
            <p className="pointer-events-none absolute inset-0 flex items-center justify-center p-8 text-center font-mono text-xs uppercase tracking-widest text-bone">
              Your receipt prints here
            </p>
          )}
        </motion.div>
      </div>
    </div>
  )
}
