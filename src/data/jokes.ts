export const roasts: string[] = [
  'You came here to donate and left looking for a donation.',
  'Your bank account and mine are in the same group chat.',
  'Two broke people. One data bundle.',
  'You chased a button across the screen with money you do not have.',
  'We should start a support group. I will bring the Indomie.',
  'Your last bank alert was a charge for having an account.',
  'That button has better cardio than your savings plan.',
  'You clicked like someone with fifty thousand in the account. We both know the truth.',
  'Welcome to the club. Membership is free because neither of us can pay dues.',
  'NEPA took the light, the bank took the rest, and here we are.',
  'Somewhere a landlord just felt a disturbance.',
  'You clicked it with confidence you do not have the balance to back up.',
]

export interface EvasionReaction {
  atAttempt: number
  hint: string
}

export const evasionReactions: EvasionReaction[] = [
  { atAttempt: 0, hint: 'Go on, click it.' },
  { atAttempt: 1, hint: 'It moved. Try again.' },
  { atAttempt: 3, hint: 'You are not going to give up, are you?' },
  { atAttempt: 5, hint: 'This button is faster than my internet.' },
  { atAttempt: 8, hint: 'It is getting tired. Same.' },
  { atAttempt: 12, hint: 'Almost there.' },
]

export const tapReactions: string[] = ['It jumped.', 'Again.', 'One more.']

export interface FinancialMood {
  id: string
  label: string
  statuses: string[]
}

export const financialMoods: FinancialMood[] = [
  {
    id: 'prayer',
    label: 'Spiritual',
    statuses: [
      'Financial status: currently accepting prayers and international transfers.',
      'Financial status: believing God for an alert before month end.',
      'Financial status: in the waiting season. Alert, please come.',
    ],
  },
  {
    id: 'noodles',
    label: 'Noodle era',
    statuses: [
      'Financial status: Indomie is a lifestyle now.',
      'Financial status: seasoning is my biggest asset.',
      'Financial status: one egg away from a luxury dinner.',
    ],
  },
  {
    id: 'dev',
    label: 'Developer',
    statuses: [
      'Financial status: app is live, wallet is down.',
      'Financial status: shipped to production, salary still in staging.',
      'Financial status: 200 OK everywhere except my account.',
    ],
  },
  {
    id: 'hopeful',
    label: 'Hopeful',
    statuses: [
      'Financial status: broke but building.',
      'Financial status: temporarily broke, permanently employable.',
      'Financial status: the plan is clear, the funds are not.',
    ],
  },
  {
    id: 'dangerous',
    label: 'Dangerous',
    statuses: [
      'Financial status: one transport fare increase away from a villain arc.',
      'Financial status: I read pricing pages for fun now.',
      'Financial status: my budget is a work of fiction.',
    ],
  },
]

export const reasonsToContribute: { title: string; body: string }[] = [
  {
    title: 'You liked the site',
    body: 'Enjoying it cost you nothing. Saying thanks costs a few naira.',
  },
  {
    title: 'You have been there',
    body: 'Job hunting, clients going quiet, "we will get back to you". You know the feeling.',
  },
  {
    title: 'You back people early',
    body: 'Small amounts from strangers still pay for real things like data, light and food.',
  },
]
