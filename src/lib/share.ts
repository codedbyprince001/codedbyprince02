import { copyText } from './clipboard'

export interface SharePayload {
  title: string
  text: string
  url: string
  files?: File[]
}

export type ShareOutcome = 'shared' | 'copied' | 'cancelled' | 'failed'

export async function sharePayload(payload: SharePayload): Promise<ShareOutcome> {
  const { files, ...rest } = payload
  if (typeof navigator.share === 'function') {
    const data: ShareData =
      files && navigator.canShare?.({ files }) ? { ...rest, files } : rest
    try {
      await navigator.share(data)
      return 'shared'
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') return 'cancelled'
    }
  }
  const copied = await copyText(`${payload.text} ${payload.url}`.trim())
  return copied ? 'copied' : 'failed'
}
