import { Navbar } from '../components/layout/Navbar'
import { Footer } from '../components/layout/Footer'
import { Hero } from '../components/hero/Hero'
import { IntroSplash } from '../components/hero/IntroSplash'
import { PortfolioSection } from '../components/portfolio/PortfolioSection'
import { FundraisingSection } from '../components/fundraising/FundraisingSection'
import { ShareLab } from '../components/interactions/ShareLab'
import { ContactSection } from '../components/contact/ContactSection'
import { ToastProvider } from '../components/ui/ToastProvider'

export default function App() {
  return (
    <ToastProvider>
      <a
        href="#work"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[90] focus:bg-lime focus:px-4 focus:py-2 focus:text-ink"
      >
        Skip to content
      </a>
      <IntroSplash />
      <Navbar />
      <main>
        <Hero />
        <PortfolioSection />
        <FundraisingSection />
        <ShareLab />
        <ContactSection />
      </main>
      <Footer />
    </ToastProvider>
  )
}
