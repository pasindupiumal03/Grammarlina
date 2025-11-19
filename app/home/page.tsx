"use client"

import { useEffect } from "react"
import { Navbar } from "@/components/navbar"
import { Hero } from "@/components/hero"
import { Features } from "@/components/features"
import { HowItWorks } from "@/components/how-it-works"
import { PricingPlans } from "@/components/pricing"
import { BookDemo } from "@/components/book-demo"
import { Footer } from "@/components/footer"

export default function Home() {
  useEffect(() => {
    // Handle hash navigation when the page loads
    const handleHashNavigation = () => {
      const hash = window.location.hash
      if (hash) {
        // Wait for the page to render and then scroll
        const scrollToElement = () => {
          const element = document.querySelector(hash)
          if (element) {
            element.scrollIntoView({ behavior: "smooth" })
          } else {
            // If element not found, try again after a short delay
            setTimeout(scrollToElement, 100)
          }
        }
        
        // Wait a bit for the page to render
        setTimeout(scrollToElement, 100)
      }
    }

    // Handle hash navigation on page load
    handleHashNavigation()

    // Handle hash navigation when hash changes (for programmatic navigation)
    const handleHashChange = () => {
      handleHashNavigation()
    }

    window.addEventListener("hashchange", handleHashChange)
    
    return () => {
      window.removeEventListener("hashchange", handleHashChange)
    }
  }, [])

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      <PricingPlans />
      <BookDemo />
      <Footer />
    </main>
  )
}
