import { useCallback, useEffect, useRef, useState } from 'react'
import type { PointerEvent as ReactPointerEvent, MouseEvent as ReactMouseEvent } from 'react'
import { animate, motion, useReducedMotion } from 'motion/react'
import { evasionReactions, tapReactions } from '../../data/jokes'
import { cn } from '../../lib/cn'

interface EvasiveButtonProps {
  attempts: number
  onAttempt: () => void
  onCaught: () => void
}

interface Offset {
  x: number
  y: number
  rotate: number
}

const DODGE_TRIGGER_DISTANCE = 96
const DODGE_COOLDOWN_MS = 260
const MAX_DODGES = 14
const TAP_HOPS_BEFORE_CATCH = 2
const CANDIDATE_POSITIONS = 14
const ORIGIN: Offset = { x: 0, y: 0, rotate: 0 }
const ARENA_PADDING = 14

function currentReaction(attempts: number): string {
  let hint = evasionReactions[0].hint
  for (const reaction of evasionReactions) {
    if (attempts >= reaction.atAttempt) hint = reaction.hint
  }
  return hint
}

export function EvasiveButton({ attempts, onAttempt, onCaught }: EvasiveButtonProps) {
  const reduceMotion = useReducedMotion()
  const arenaRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const slotRef = useRef<HTMLDivElement>(null)
  const lastDodge = useRef(0)
  const [offset, setOffset] = useState<Offset>(ORIGIN)
  const [tapHops, setTapHops] = useState(0)

  const exhausted = attempts >= MAX_DODGES

  useEffect(() => {
    const arena = arenaRef.current
    if (!arena) return
    const observer = new ResizeObserver(() => setOffset(ORIGIN))
    observer.observe(arena)
    return () => observer.disconnect()
  }, [])

  const hopAwayFrom = useCallback(
    (pointerX: number | null, pointerY: number | null) => {
      const arena = arenaRef.current
      const slot = slotRef.current
      if (!arena || !slot) return

      // offsetLeft/offsetTop and client sizes ignore transforms, so the bounds stay exact
      // even when the previous spring has not settled yet.
      const homeX = slot.offsetLeft
      const homeY = slot.offsetTop
      const width = slot.offsetWidth
      const height = slot.offsetHeight
      const minX = ARENA_PADDING - homeX
      const maxX = arena.clientWidth - ARENA_PADDING - width - homeX
      const minY = ARENA_PADDING - homeY
      const maxY = arena.clientHeight - ARENA_PADDING - height - homeY

      const arenaBox = arena.getBoundingClientRect()
      let best: Offset = ORIGIN
      let bestScore = -Infinity
      for (let i = 0; i < CANDIDATE_POSITIONS; i += 1) {
        const x = minX + Math.random() * Math.max(maxX - minX, 0)
        const y = minY + Math.random() * Math.max(maxY - minY, 0)
        const centerX = arenaBox.left + homeX + x + width / 2
        const centerY = arenaBox.top + homeY + y + height / 2
        const awayFromPointer =
          pointerX === null || pointerY === null
            ? 0
            : Math.hypot(centerX - pointerX, centerY - pointerY)
        const travelled = Math.hypot(x - offset.x, y - offset.y)
        const score = awayFromPointer + travelled * 0.6
        if (score > bestScore) {
          bestScore = score
          best = { x, y, rotate: (Math.random() - 0.5) * 8 }
        }
      }
      setOffset(best)
      if (buttonRef.current) {
        void animate(buttonRef.current, { scale: [1, 0.8, 1] }, { duration: 0.28 })
      }
    },
    [offset.x, offset.y],
  )

  const handleArenaPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== 'mouse' || reduceMotion || exhausted) return
    const button = buttonRef.current
    if (!button) return
    const now = performance.now()
    if (now - lastDodge.current < DODGE_COOLDOWN_MS) return

    const box = button.getBoundingClientRect()
    const nearestX = Math.max(box.left, Math.min(event.clientX, box.right))
    const nearestY = Math.max(box.top, Math.min(event.clientY, box.bottom))
    const distance = Math.hypot(event.clientX - nearestX, event.clientY - nearestY)
    if (distance > DODGE_TRIGGER_DISTANCE) return

    lastDodge.current = now
    onAttempt()
    hopAwayFrom(event.clientX, event.clientY)
  }

  const handleClick = (event: ReactMouseEvent<HTMLButtonElement>) => {
    const nativeType = (event.nativeEvent as PointerEvent).pointerType
    const isTouch = nativeType === 'touch' || nativeType === 'pen'
    if (isTouch && !reduceMotion && tapHops < TAP_HOPS_BEFORE_CATCH) {
      setTapHops((count) => count + 1)
      onAttempt()
      hopAwayFrom(null, null)
      return
    }
    onCaught()
  }

  const hint =
    tapHops > 0 && tapHops <= TAP_HOPS_BEFORE_CATCH && attempts === tapHops
      ? tapReactions[tapHops - 1]
      : tapHops >= TAP_HOPS_BEFORE_CATCH && attempts <= TAP_HOPS_BEFORE_CATCH
        ? tapReactions[2]
        : currentReaction(attempts)

  return (
    <div className="w-full">
      <div
        ref={arenaRef}
        onPointerMove={handleArenaPointerMove}
        className="relative h-[120px] w-full touch-manipulation overflow-hidden border border-dashed border-cream/25 sm:h-[132px]"
      >
        <span className="pointer-events-none absolute right-3 top-2 font-mono text-[0.62rem] uppercase tracking-[0.2em] text-bone/60">
          Containment zone
        </span>
        <motion.div
          ref={slotRef}
          initial={false}
          animate={{ x: offset.x, y: offset.y, rotate: offset.rotate }}
          transition={{
            x: { type: 'spring', stiffness: 520, damping: 32 },
            y: { type: 'spring', stiffness: 520, damping: 32 },
            rotate: { type: 'spring', stiffness: 300, damping: 18 },
          }}
          className="absolute left-3 top-1/2 -mt-6"
        >
          <button
            ref={buttonRef}
            type="button"
            onClick={handleClick}
            className={cn(
              'min-h-12 whitespace-nowrap rounded-full px-6 py-3 font-sans text-sm font-bold uppercase tracking-[0.08em] transition-colors sm:text-[0.92rem]',
              exhausted
                ? 'bg-lime text-ink shadow-[0_0_40px_rgba(200,255,46,0.35)]'
                : 'bg-ember text-ink hover:bg-[#ff7a45]',
            )}
          >
            {exhausted ? 'Fine. You win.' : "You're broke too?"}
          </button>
        </motion.div>
      </div>

      <div className="mt-3 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
        <p className="min-h-5 flex-1 font-mono text-xs leading-relaxed text-bone">{hint}</p>
        <p className="font-mono text-xs uppercase tracking-widest text-lime" aria-label={`Escape attempts: ${attempts}`}>
          Escapes: {String(attempts).padStart(2, '0')}
        </p>
      </div>

      {attempts >= 3 && !exhausted && (
        <button
          type="button"
          onClick={onCaught}
          className="mt-2 font-mono text-xs uppercase tracking-widest text-bone underline decoration-lime/60 underline-offset-4 transition-colors hover:text-lime"
        >
          Tired of chasing? Catch it the easy way
        </button>
      )}
    </div>
  )
}
