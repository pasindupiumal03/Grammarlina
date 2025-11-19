import { Header } from '@/components/header'
import { Hero } from '@/components/hero'
import { PricingPlans } from '@/components/pricing'
import { Features } from '@/components/features'
import { HowItWorks } from '@/components/how-it-works'
import { Testimonials } from '@/components/testimonials'
import { FAQ } from '@/components/faq'
import { Footer } from '@/components/footer'

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <Hero />
      <Features />
      <HowItWorks />
      <Testimonials />
      <PricingPlans />
      <FAQ />
      <Footer />
    </main>
  )
}