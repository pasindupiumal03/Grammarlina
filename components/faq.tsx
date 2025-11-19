'use client'

import { ChevronDown } from 'lucide-react'
import { useState } from 'react'

const faqs = [
  {
    question: 'Is this the official Grammarly?',
    answer: 'We offer group-buy access to Grammarly Premium at significantly discounted rates. You get full access to all Grammarly Premium features through our service.',
  },
  {
    question: 'How does the 14-day free trial work?',
    answer: 'Simply sign up and you\'ll get immediate access to all premium features for 14 days. No credit card required. After the trial, your chosen plan begins (either $1.99/month or $49 lifetime).',
  },
  {
    question: 'Can I cancel anytime?',
    answer: 'Yes! For monthly plans, you can cancel anytime. No questions asked, no hidden fees. For lifetime plans, it\'s a one-time purchase with permanent access.',
  },
  {
    question: 'How do I activate my premium access?',
    answer: 'After claiming your trial, we\'ll provide you with a simple activation link. Click it, sign in with your Grammarly account, and you\'ll have premium access instantly on all devices.',
  },
  {
    question: 'What features are included?',
    answer: 'Everything in Grammarly Premium: AI writing enhancements, plagiarism detection, tone detector, style guide, advanced analytics, and unlimited premium checks.',
  },
  {
    question: 'Is it safe to use?',
    answer: 'Absolutely. We partner directly with Grammarly to provide legitimate premium access. Your data is encrypted and protected with industry-standard security.',
  },
]

export function FAQ() {
  const [openIndex, setOpenIndex] = useState(0)

  return (
    <section id="faq" className="py-16 sm:py-24 md:py-32">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-muted-foreground">
            Everything you need to know about Grammarlina
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <div key={index} className="border border-border rounded-lg overflow-hidden hover:border-primary/50 transition-colors">
              <button
                onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
                className="w-full px-6 py-4 flex items-center justify-between bg-card hover:bg-card/80 transition-colors"
              >
                <h3 className="text-left font-semibold text-foreground text-sm sm:text-base">{faq.question}</h3>
                <ChevronDown 
                  className={`w-5 h-5 text-primary flex-shrink-0 ml-4 transition-transform ${
                    openIndex === index ? 'transform rotate-180' : ''
                  }`}
                />
              </button>
              
              {openIndex === index && (
                <div className="px-6 py-4 bg-background border-t border-border">
                  <p className="text-muted-foreground text-sm leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
