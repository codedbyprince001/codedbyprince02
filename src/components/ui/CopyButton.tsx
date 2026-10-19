import { Check, Copy } from 'lucide-react'
import { Button } from './Button'
import { useCopyFeedback } from '../../hooks/useCopyFeedback'

interface CopyButtonProps {
  text: string
  label: string
  copiedLabel?: string
  variant?: 'outline' | 'cream' | 'ghost'
  className?: string
}

export function CopyButton({
  text,
  label,
  copiedLabel = 'Copied',
  variant = 'outline',
  className,
}: CopyButtonProps) {
  const { state, copy } = useCopyFeedback()
  return (
    <Button
      variant={variant}
      className={className}
      onClick={() => void copy(text)}
      icon={state === 'copied' ? <Check size={18} /> : <Copy size={18} />}
      aria-live="polite"
    >
      {state === 'copied' ? copiedLabel : state === 'failed' ? 'Copy failed' : label}
    </Button>
  )
}
