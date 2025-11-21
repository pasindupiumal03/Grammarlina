"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAppSelector } from '@/lib/store'
import { authSelector } from '@/lib/slices/auth-slice'
import { getMe } from '@/api/auth'
import { Header } from '@/components/header'
import { Hero } from '@/components/hero'
import { PricingPlans } from '@/components/pricing'
import { Features } from '@/components/features'
import { HowItWorks } from '@/components/how-it-works'
import { Testimonials } from '@/components/testimonials'
import { FAQ } from '@/components/faq'
import { Footer } from '@/components/footer'

export default function Home() {
  const router = useRouter()
  const authState = useAppSelector(authSelector)
  const [hasCheckedAuth, setHasCheckedAuth] = useState(false)

  useEffect(() => {
    const initializeRouting = async () => {
      try {
        if (authState._id) {
          router.push("/dashboard");
          return;
        }
        const response = await getMe();
        if (response.success) {
          router.push("/dashboard");
        } else {
          router.push("/home");
        }
      } catch (error) {
        console.log("Auth check failed, redirecting to home");
        router.push("/home");
      } finally {
        setHasCheckedAuth(true);
      }
    };
    if (!hasCheckedAuth) {
      initializeRouting();
    }
  }, [router, authState._id, hasCheckedAuth])
  if (!hasCheckedAuth) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

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