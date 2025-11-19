'use client'

import { Button } from '@/components/ui/button'
import { ArrowRight, CheckCircle } from 'lucide-react'

export function Hero() {
  return (
    <section className="relative py-16 sm:py-24 md:py-32 overflow-hidden">
      {/* Background gradient effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-background pointer-events-none" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="inline-block bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold">
                🎉 Save Up to 95%
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground leading-tight">
                Grammarly Premium.{' '}
                <span className="text-primary">Just $1.99/mo</span>
              </h1>
              <p className="text-lg sm:text-xl text-muted-foreground max-w-lg leading-relaxed">
                Get full access to Grammarly Premium at an unbeatable price. Perfect grammar, advanced writing insights, and AI-powered features for a fraction of the cost.
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                <span className="text-sm sm:text-base text-foreground">95% cheaper than official Grammarly</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                <span className="text-sm sm:text-base text-foreground">Instant access to all premium features</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                <span className="text-sm sm:text-base text-foreground">14-day free trial, no credit card needed</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button size="lg" className="text-base font-semibold" asChild>
                <a href="#pricing">
                  Start Your Free Trial <ArrowRight className="w-5 h-5 ml-2" />
                </a>
              </Button>
              <Button size="lg" variant="outline" className="text-base font-semibold" asChild>
                <a href="#how-it-works">How it Works</a>
              </Button>
            </div>

            <p className="text-sm text-muted-foreground">
              ✓ No credit card required • ✓ Cancel anytime • ✓ 14-day free trial
            </p>
          </div>

          <div className="relative">
            <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl p-8 border border-primary/20">
              <div className="space-y-6">
                <div className="text-center space-y-2">
                  <p className="text-sm font-semibold text-primary uppercase tracking-wide">LIMITED TIME</p>
                  <p className="text-4xl font-bold text-foreground">14 Days Free</p>
                  <p className="text-muted-foreground">Then just $1.99/month</p>
                </div>
                
                <div className="space-y-3 pt-6 border-t border-primary/20">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-foreground text-sm">Full Premium Access</p>
                      <p className="text-xs text-muted-foreground">All features included</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-foreground text-sm">Advanced AI Features</p>
                      <p className="text-xs text-muted-foreground">Latest technology</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-foreground text-sm">No Hidden Fees</p>
                      <p className="text-xs text-muted-foreground">Transparent pricing</p>
                    </div>
                  </div>
                </div>

                <Button className="w-full text-base font-semibold py-6" asChild>
                  <a href="#pricing">Claim Your Free Trial</a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
