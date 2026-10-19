const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'

export function generateReceiptId(): string {
  const bytes = new Uint8Array(8)
  crypto.getRandomValues(bytes)
  const chars = Array.from(bytes, (b) => ALPHABET[b % ALPHABET.length]).join('')
  return `BEG-${chars.slice(0, 4)}-${chars.slice(4)}`
}

export const receiptOneLiners: string[] = [
  'Proof that I visited a developer with great code and a quiet account.',
  'One good website, one tired wallet.',
  'Itemised: 1 website, 0 alerts, unlimited optimism.',
  'Visited the most polite begging page on the internet.',
]
