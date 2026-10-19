import { Share2 } from 'lucide-react'
import { Button } from '../ui/Button'
import { CopyButton } from '../ui/CopyButton'
import { siteConfig } from '../../config/site'
import { resolvedSiteUrl } from '../../config/links'
import { sharePayload } from '../../lib/share'
import { useToast } from '../../hooks/toastContext'

interface ShareActionsProps {
  message?: string
}

const DEFAULT_MESSAGE =
  'A Nigerian developer built an absurdly good website to beg the internet for money. I regret nothing.'

export function ShareActions({ message = DEFAULT_MESSAGE }: ShareActionsProps) {
  const { notify } = useToast()
  const url = resolvedSiteUrl()

  const handleShare = async () => {
    const outcome = await sharePayload({
      title: siteConfig.campaign.title,
      text: message,
      url,
    })
    if (outcome === 'copied') notify('Message and link copied')
    if (outcome === 'failed') notify('Sharing failed. Copy the link instead.')
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
      <Button variant="cream" onClick={() => void handleShare()} icon={<Share2 size={18} />}>
        Share the suffering
      </Button>
      <CopyButton text={url} label="Copy link" copiedLabel="Link copied" />
    </div>
  )
}
