"use client"

import { useState } from "react"
import { Check } from "lucide-react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useRouter } from "next/navigation"

export function Pricing() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)
  const router = useRouter()

  const scrollToBookDemo = () => {
    const el = document.getElementById("book-demo")
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" })
    } else {
      router.push("/#book-demo")
    }
  }

  const handleCtaClick = (cta: string) => {
    if (cta === "Start free") {
      router.push("/login")
    } else if (cta === "Book a call") {
      scrollToBookDemo()
    }
  }

  const plans = [
    {
      name: "Free",
      price: "$0",
      description: "Perfect for getting started",
      features: ["1 organization", "Up to 5 active sessions", "Moderator controls", "Email support"],
      cta: "Start free",
      highlighted: false,
    },
    {
      name: "Pro / Team",
      price: "Talk to us",
      description: "For growing teams",
      features: [
        "Unlimited organizations",
        "Unlimited active sessions",
        "Advanced editor roles & audit logs",
        "SSO & SCIM (coming soon)",
        "Priority support",
      ],
      cta: "Book a call",
      highlighted: true,
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  }

  return (
    <section id="pricing" className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12 sm:mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-sans text-foreground mb-4">Simple, Transparent Pricing</h2>
          <p className="text-base sm:text-lg text-foreground/70 max-w-2xl mx-auto px-4">Choose the plan that works for you.</p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-3xl mx-auto mb-12 px-4"
        >
          {plans.map((plan, index) => (
            <motion.div key={index} variants={itemVariants}>
              <Card
                className={`p-6 sm:p-8 transition-all duration-300 ${
                  hoveredCard === index ? "shadow-xl scale-105" : "hover:shadow-lg"
                } ${plan.highlighted ? "border-primary/50 bg-primary/5" : ""} w-full max-w-sm sm:max-w-none mx-auto`}
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <h3 className="font-sans font-bold text-xl sm:text-2xl text-foreground mb-2">{plan.name}</h3>
                <p className="text-sm text-foreground/60 mb-4">{plan.description}</p>
                <div className="mb-6">
                  <span className="text-3xl sm:text-4xl font-bold text-foreground">{plan.price}</span>
                  {plan.price !== "Talk to us" && <span className="text-foreground/60 ml-2">/month</span>}
                </div>

                <Button 
                  className="w-full mb-8" 
                  variant={plan.highlighted ? "default" : "outline"}
                  onClick={() => handleCtaClick(plan.cta)}
                >
                  {plan.cta}
                </Button>

                <div className="space-y-4">
                  {plan.features.map((feature, featureIndex) => (
                    <motion.div
                      key={featureIndex}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: featureIndex * 0.1 }}
                      viewport={{ once: true }}
                      className="flex items-start gap-3"
                    >
                      <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-foreground/80">{feature}</span>
                    </motion.div>
                  ))}
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        <p className="text-center text-sm text-foreground/60">
          Need enterprise? <span className="text-primary font-semibold">Contact us</span>
        </p>
      </div>
    </section>
  )
}
