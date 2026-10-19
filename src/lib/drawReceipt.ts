import { siteConfig } from '../config/site'
import { getCampaignState } from './campaign'
import { formatMoney } from './format'

export interface ReceiptInput {
  id: string
  oneLiner: string
  url: string
  issuedAt: Date
}

const WIDTH = 1080
const HEIGHT = 1500
const PAPER = '#f1e9d6'
const INK = '#0a0a09'
const LIME = '#c8ff2e'
const SERIF = '"Instrument Serif", "Times New Roman", serif'
const MONO = '"JetBrains Mono Variable", ui-monospace, monospace'
const SANS = '"Bricolage Grotesque Variable", system-ui, sans-serif'

async function ensureFonts() {
  if (!document.fonts) return
  await Promise.all([
    document.fonts.load(`64px ${SERIF}`),
    document.fonts.load(`italic 64px ${SERIF}`),
    document.fonts.load(`500 28px ${MONO}`),
    document.fonts.load(`700 28px ${SANS}`),
  ])
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = text.split(' ')
  const lines: string[] = []
  let line = ''
  for (const word of words) {
    const test = line ? `${line} ${word}` : word
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line)
      line = word
    } else {
      line = test
    }
  }
  if (line) lines.push(line)
  return lines
}

function barcodeBars(id: string): number[] {
  let state = 0
  for (const char of id) state = (state * 31 + char.charCodeAt(0)) % 100003
  const bars: number[] = []
  for (let i = 0; i < 46; i += 1) {
    state = (state * 1103515245 + 12345) % 2147483648
    bars.push(3 + (state % 4) * 3)
  }
  return bars
}

function drawZigzag(ctx: CanvasRenderingContext2D, y: number, direction: 1 | -1, left: number, right: number) {
  const step = 24
  ctx.beginPath()
  ctx.moveTo(left, y)
  for (let x = left, flip = false; x < right; x += step, flip = !flip) {
    ctx.lineTo(x + step / 2, y + (flip ? 0 : 14 * direction))
    ctx.lineTo(x + step, y)
  }
}

export async function drawReceipt(canvas: HTMLCanvasElement, input: ReceiptInput): Promise<void> {
  await ensureFonts()
  canvas.width = WIDTH
  canvas.height = HEIGHT
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Canvas 2D is not available')

  const { campaign } = siteConfig
  const state = getCampaignState()

  ctx.fillStyle = INK
  ctx.fillRect(0, 0, WIDTH, HEIGHT)

  const glow = ctx.createRadialGradient(WIDTH * 0.85, 120, 10, WIDTH * 0.85, 120, 700)
  glow.addColorStop(0, 'rgba(200,255,46,0.22)')
  glow.addColorStop(1, 'rgba(200,255,46,0)')
  ctx.fillStyle = glow
  ctx.fillRect(0, 0, WIDTH, HEIGHT)

  const left = 110
  const right = WIDTH - 110
  const top = 90
  const bottom = HEIGHT - 90

  ctx.save()
  ctx.shadowColor = 'rgba(0,0,0,0.6)'
  ctx.shadowBlur = 50
  ctx.shadowOffsetY = 24
  ctx.fillStyle = PAPER
  ctx.beginPath()
  ctx.moveTo(left, top)
  ctx.lineTo(right, top)
  ctx.lineTo(right, bottom)
  ctx.lineTo(left, bottom)
  ctx.closePath()
  ctx.fill()
  ctx.restore()

  ctx.fillStyle = INK
  drawZigzag(ctx, top, -1, left, right)
  ctx.lineTo(right, top - 30)
  ctx.lineTo(left, top - 30)
  ctx.closePath()
  ctx.fill()
  drawZigzag(ctx, bottom, 1, left, right)
  ctx.lineTo(right, bottom + 30)
  ctx.lineTo(left, bottom + 30)
  ctx.closePath()
  ctx.fill()

  const pad = 70
  const innerLeft = left + pad
  const innerRight = right - pad
  const innerWidth = innerRight - innerLeft
  let y = top + 110

  ctx.fillStyle = INK
  ctx.textBaseline = 'alphabetic'
  ctx.textAlign = 'left'
  ctx.font = `500 22px ${MONO}`
  ctx.fillText('BEGGING OPERATIONS · OFFICIAL RECEIPT', innerLeft, y)
  y += 20
  ctx.fillRect(innerLeft, y, innerWidth, 3)
  y += 100

  ctx.font = `76px ${SERIF}`
  const titleLines = wrapText(ctx, campaign.title.toUpperCase(), innerWidth)
  for (const line of titleLines) {
    ctx.fillText(line, innerLeft, y)
    y += 78
  }
  y += 14

  ctx.font = `italic 40px ${SERIF}`
  for (const line of wrapText(ctx, input.oneLiner, innerWidth)) {
    ctx.fillText(line, innerLeft, y)
    y += 48
  }
  y += 36

  ctx.font = `500 24px ${MONO}`
  const items: [string, string][] = [
    ['1 x Visit to a very good website', '0.00'],
    ['1 x Laugh', '0.00'],
    ['0 x Stable income', '0.00'],
    ['1 x Developer, hopeful', 'PRICELESS'],
  ]
  for (const [label, price] of items) {
    ctx.textAlign = 'left'
    ctx.fillText(label, innerLeft, y)
    ctx.textAlign = 'right'
    ctx.fillText(price, innerRight, y)
    y += 46
  }
  ctx.textAlign = 'left'
  ctx.setLineDash([10, 8])
  ctx.strokeStyle = INK
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(innerLeft, y - 16)
  ctx.lineTo(innerRight, y - 16)
  ctx.stroke()
  ctx.setLineDash([])
  y += 28

  ctx.font = `700 30px ${SANS}`
  ctx.fillText('TOTAL OWED BY YOU', innerLeft, y)
  ctx.textAlign = 'right'
  ctx.fillText('NOTHING. YET.', innerRight, y)
  ctx.textAlign = 'left'
  y += 90

  ctx.font = `500 22px ${MONO}`
  ctx.fillText('CAMPAIGN PROGRESS (VERIFIED, UPDATED BY HAND)', innerLeft, y)
  y += 34
  ctx.fillStyle = 'rgba(10,10,9,0.14)'
  ctx.fillRect(innerLeft, y, innerWidth, 34)
  ctx.fillStyle = INK
  ctx.fillRect(innerLeft, y, Math.max(innerWidth * state.ratio, state.ratio > 0 ? 6 : 0), 34)
  ctx.strokeStyle = INK
  ctx.setLineDash([])
  ctx.strokeRect(innerLeft, y, innerWidth, 34)
  y += 74
  ctx.font = `700 34px ${SANS}`
  ctx.fillText(`${formatMoney(state.raised, campaign.currency)} of ${formatMoney(state.goal, campaign.currency)}`, innerLeft, y)
  y += 90

  const barcodeTop = y
  const bars = barcodeBars(input.id)
  let barX = innerLeft
  for (const [index, barWidth] of bars.entries()) {
    if (index % 2 === 0) ctx.fillRect(barX, barcodeTop, barWidth, 90)
    barX += barWidth
  }
  ctx.font = `500 26px ${MONO}`
  ctx.textAlign = 'right'
  ctx.fillText(input.id, innerRight, barcodeTop + 40)
  ctx.font = `500 20px ${MONO}`
  ctx.fillText(input.issuedAt.toLocaleDateString('en-NG', { dateStyle: 'medium' }), innerRight, barcodeTop + 80)
  ctx.textAlign = 'left'
  y = barcodeTop + 150

  ctx.font = `700 34px ${SANS}`
  ctx.fillText(input.url.replace(/^https?:\/\//, ''), innerLeft, y)
  y += 48
  ctx.font = `500 20px ${MONO}`
  ctx.fillStyle = 'rgba(10,10,9,0.7)'
  ctx.fillText('THIS RECEIPT IS A JOKE. NO PAYMENT WAS MADE OR IMPLIED.', innerLeft, y)

  ctx.save()
  ctx.translate(Math.min(barX + 170, innerRight - 400), barcodeTop + 45)
  ctx.rotate(-0.12)
  ctx.strokeStyle = '#ff5a1f'
  ctx.fillStyle = '#ff5a1f'
  ctx.lineWidth = 5
  ctx.strokeRect(-135, -42, 270, 84)
  ctx.font = `700 22px ${SANS}`
  ctx.textAlign = 'center'
  ctx.fillText('NOT A DONATION', 0, -4)
  ctx.fillText('RECEIPT', 0, 22)
  ctx.restore()

  ctx.fillStyle = LIME
  ctx.fillRect(0, HEIGHT - 12, WIDTH, 12)
}

export function canvasToBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error('Could not encode PNG'))), 'image/png')
  })
}
