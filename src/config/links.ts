import { siteConfig } from './site'

export function isConfigured(value: string): boolean {
  return value.trim() !== '' && !value.includes('YOUR_')
}

export const selarConfigured = isConfigured(siteConfig.links.selar)

export function mailtoHref(subject: string): string | null {
  const { email } = siteConfig.links
  if (!isConfigured(email)) return null
  return `mailto:${email}?subject=${encodeURIComponent(subject)}`
}

export function resolvedSiteUrl(): string {
  if (isConfigured(siteConfig.siteUrl)) return siteConfig.siteUrl
  return typeof window === 'undefined' ? '' : window.location.origin
}
