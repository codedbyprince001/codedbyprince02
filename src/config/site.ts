export interface Milestone {
  amount: number
  title: string
  message: string
}

export interface SiteConfig {
  owner: {
    name: string
    handle: string
    role: string
    location: string
  }
  siteUrl: string
  portfolioUrl: string
  links: {
    selar: string
    email: string
    github: string
    linkedin: string
    cv: string
    x: string
  }
  campaign: {
    title: string
    purpose: string
    currency: string
    goal: number
    verifiedRaised: number
    lastVerifiedOn: string
    suggestedAmounts: { amount: number; caption: string }[]
    milestones: Milestone[]
  }
  skills: string[]
}

/** Empty values and values containing "YOUR_" are treated as not configured and hidden. */
export const siteConfig: SiteConfig = {
  owner: {
    name: 'Prince',
    handle: 'codedbyprince',
    role: 'Software Developer',
    location: 'Nigeria',
  },

  siteUrl: '',
  portfolioUrl: 'https://codedbyprince-psi.vercel.app/',

  links: {
    selar: 'https://selar.com/showlove/codedbyprince',
    email: '',
    github: '',
    linkedin: '',
    cv: '',
    x: '',
  },

  campaign: {
    title: 'Operation: Feed The Developer',
    purpose:
      'Rent, data, light and food, roughly in that order. Whatever is left goes back into building.',
    currency: 'NGN',
    goal: 1_000_000,
    verifiedRaised: 0,
    lastVerifiedOn: '',
    suggestedAmounts: [
      { amount: 1_000, caption: 'A plate of jollof. No chicken.' },
      { amount: 2_500, caption: 'A week of data.' },
      { amount: 5_000, caption: 'Fuel for the generator.' },
      { amount: 10_000, caption: 'A proper meal and a good night of sleep.' },
    ],
    milestones: [
      {
        amount: 5_000,
        title: 'Data Secured',
        message: 'Somebody believed in this. The data bundle lives another week.',
      },
      {
        amount: 100_000,
        title: 'Rent Is Nervous',
        message: 'This is no longer a joke. The landlord has been quietly informed.',
      },
      {
        amount: 300_000,
        title: 'Laptop Upgrade',
        message: 'The old laptop finally gets to rest. The fan thanks you.',
      },
      {
        amount: 1_000_000,
        title: 'The Internet Delivered',
        message: 'Goal reached. I am building something big and you are in the credits.',
      },
    ],
  },

  skills: [
    'React',
    'TypeScript',
    'Next.js',
    'Node.js',
    'Python',
    'Flutter',
    'REST & GraphQL APIs',
    'PostgreSQL',
    'AI integrations',
    'Tailwind CSS',
    'Git & CI',
    'Debugging at 2am',
  ],
}
