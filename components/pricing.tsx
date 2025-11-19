'use client'

import { Button } from '@/components/ui/button'
import { Check } from 'lucide-react'
import { useState } from 'react'

export function PricingPlans() {
  const [showTrialInfo, setShowTrialInfo] = useState(false)

  const handleStartTrial = () => {
    window.open('https://docs.google.com/forms/d/e/1FAIpQLSeVYKiRIa7wM1OUs48PQiot0et2dYJtGIVE92lD4oVKUb5nKw/viewform?usp=dialog', '_blank')
  }

  const plans = [
    {
      name: 'Monthly',
      price: '$1.99',
      period: '/month',
      description: 'Perfect for trying out premium features',
      features: [
        'Full Grammarly Premium access',
        'AI Writing Enhancements',
        'Tone Detector & Style Guide',
        'Plagiarism Detection',
        'Advanced Analytics',
        'All premium features included',
        '14-day free trial first',
        'Cancel anytime',
      ],
      cta: 'Start Free Trial',
      popular: false,
    },
    {
      name: 'Lifetime',
      price: '$49',
      period: 'one-time',
      description: 'Best value - permanent access',
      features: [
        'Lifetime Grammarly Premium access',
        'AI Writing Enhancements',
        'Tone Detector & Style Guide',
        'Plagiarism Detection',
        'Advanced Analytics',
        'All premium features included',
        '14-day free trial first',
        'No recurring charges ever',
      ],
      cta: 'Start Free Trial',
      popular: true,
    },
  ]

  return (
    <section id="pricing" className="py-16 sm:py-24 md:py-32 bg-card/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground">
            Simple, Transparent Pricing
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Choose the plan that works best for you. All plans include a 14-day free trial.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map((plan, index) => (
            <div key={index} className={`relative rounded-2xl border transition-all ${
              plan.popular 
                ? 'border-primary bg-background md:scale-105 shadow-2xl' 
                : 'border-border bg-background'
            } p-8`}>
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-semibold">
                    BEST VALUE
                  </span>
                </div>
              )}
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-bold text-foreground mb-2">{plan.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{plan.description}</p>
                  <div className="space-y-1">
                    <div className="flex items-baseline gap-2">
                      <span className="text-5xl font-bold text-foreground">{plan.price}</span>
                      <span className="text-muted-foreground">{plan.period}</span>
                    </div>
                    <p className="text-xs text-muted-foreground pt-2">Then continues at the same rate</p>
                  </div>
                </div>

                <Button 
                  className={`w-full text-base font-semibold py-6 ${
                    plan.popular ? '' : 'bg-muted text-foreground hover:bg-muted/80'
                  }`}
                  onClick={handleStartTrial}
                  variant={plan.popular ? 'default' : 'outline'}
                >
                  {plan.cta}
                </Button>

                <div className="border-t border-border pt-6">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-4">What's Included</p>
                  <ul className="space-y-3">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-primary/10 border border-primary/20 rounded-xl p-6 max-w-2xl mx-auto text-center">
          <p className="text-sm text-muted-foreground mb-2">🎉 Special Offer</p>
          <p className="text-lg font-semibold text-foreground mb-1">14-Day Free Trial</p>
          <p className="text-muted-foreground">
            All plans include a 14-day free trial. No credit card required. Cancel anytime.
          </p>
        </div>
      </div>
    </section>
  )
}
