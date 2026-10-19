# Begging Operations

A frontend-only comedy fundraising portfolio: React, TypeScript, Vite, Tailwind CSS 4, React Three Fiber, Motion. No backend, no database, no payment code. Payments happen on Selar.

## Prerequisites
Node.js 20.19+ (tested on 22) and npm.

## Run
```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # type-checks, then outputs ./dist
npm run preview    # serve the production build locally
npm run lint
```

## Everything you edit lives in three places
| What | File |
| --- | --- |
| Selar link, email, GitHub, LinkedIn, CV, site URL, goal, verified total, milestones, skills | `src/config/site.ts` |
| Supporters (with permission) | `src/data/supporters.ts` |
| Roasts, financial moods, reasons to contribute | `src/data/jokes.ts` |

Values that are empty or contain `YOUR_` are treated as "not configured". Unconfigured GitHub, LinkedIn, CV and email entries are hidden automatically. With no email set, "Offer me a job" opens your portfolio.

### Connect your Selar Show Love link
Set `links.selar` in `src/config/site.ts` (currently `https://selar.com/showlove/codedbyprince`). Every "give" button uses that one value and opens in a new tab. Selar enters the amount; the suggested-amount chips on this site only change a joke caption.

### Portfolio
The portfolio section links to `portfolioUrl` in `src/config/site.ts` and lists the `skills` array beside it. Edit those two values.

### Update the fundraising total
This site cannot see payments. Check your Selar dashboard, then edit `campaign.verifiedRaised` and `campaign.lastVerifiedOn` in `src/config/site.ts` and redeploy. The counter, progress bar, milestones and receipt all derive from that number. Milestones only unlock when the verified total reaches them.

### Add supporters
Add `{ name, message?, amountLabel? }` to `src/data/supporters.ts` only after verifying the payment and getting permission. An empty list shows an honest empty state.

## Deploy on Firebase Hosting
```bash
npm install -g firebase-tools
firebase login
firebase init hosting     # choose your project, keep "dist" as the public directory, answer No to single-page rewrites and No to overwriting files
npm run build
firebase deploy --only hosting
```
`firebase.json` is already included. After the first deploy, put your live URL in `siteUrl` in `src/config/site.ts` and redeploy so shared links and receipts show it. Vercel and Netlify also work with no extra configuration.

## Limitations
- Payments cannot be verified from a static site, so the total is manual.
- The 3D scene falls back to a CSS coin when WebGL is unavailable.
- Native sharing with files depends on the browser; otherwise the link/message is copied and the PNG can be downloaded.
