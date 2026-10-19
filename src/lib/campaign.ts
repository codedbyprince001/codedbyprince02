import { siteConfig } from '../config/site'
import type { Milestone } from '../config/site'

export interface CampaignState {
  raised: number
  goal: number
  ratio: number
  reached: Milestone[]
  next: Milestone | null
}

export function getCampaignState(): CampaignState {
  const { verifiedRaised, goal, milestones } = siteConfig.campaign
  const sorted = [...milestones].sort((a, b) => a.amount - b.amount)
  const reached = sorted.filter((m) => verifiedRaised >= m.amount)
  const next = sorted.find((m) => verifiedRaised < m.amount) ?? null
  return {
    raised: verifiedRaised,
    goal,
    ratio: goal > 0 ? Math.min(verifiedRaised / goal, 1) : 0,
    reached,
    next,
  }
}
