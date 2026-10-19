export interface Supporter {
  name: string
  message?: string
  amountLabel?: string
}

/**
 * Only add people who have given you explicit permission to be listed.
 * This site cannot verify payments, so this list is maintained by hand.
 */
export const supporters: Supporter[] = []
