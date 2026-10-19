import { useCallback, useEffect, useRef, useState } from 'react'
import { copyText } from '../lib/clipboard'

export type CopyState = 'idle' | 'copied' | 'failed'

export function useCopyFeedback(resetAfterMs = 1800) {
  const [state, setState] = useState<CopyState>('idle')
  const timer = useRef<number | undefined>(undefined)

  useEffect(() => () => window.clearTimeout(timer.current), [])

  const copy = useCallback(
    async (text: string) => {
      const ok = await copyText(text)
      setState(ok ? 'copied' : 'failed')
      window.clearTimeout(timer.current)
      timer.current = window.setTimeout(() => setState('idle'), resetAfterMs)
      return ok
    },
    [resetAfterMs],
  )

  return { state, copy }
}
