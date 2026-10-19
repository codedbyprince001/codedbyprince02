export function formatMoney(amount: number, currency: string): string {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function pick<T>(items: readonly T[], avoid?: T): T {
  if (items.length === 1) return items[0]
  let next = items[Math.floor(Math.random() * items.length)]
  while (next === avoid) next = items[Math.floor(Math.random() * items.length)]
  return next
}
