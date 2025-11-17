"use client"

import { Shield, Zap, Lock, Users, BarChart3, Clock, Chrome, Fingerprint, UserPlus } from "lucide-react"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"

const features = [
  {
    icon: Zap,
    title: "AI Writing Enhancer",
    description: "The full Grammarly Premium tone, clarity, and correctness suggestions—no feature caps, even at $2.99.",
  },
  {
    icon: Shield,
    title: "Plagiarism Shield",
    description: "Run unlimited originality scans with the same AI Grammarly uses, included in your $2.99 plan.",
  },
  {
    icon: Lock,
    title: "Real-time Editing Tools",
    description: "Rewrite, refine, and optimize in-line across every site—premium buttons stay unlocked.",
  },
  {
    icon: Users,
    title: "Multi-Device Support",
    description: "Bring your discounted Premium seat to Chrome and Edge today (Firefox coming soon).",
  },
  {
    icon: Clock,
    title: "Secure & Private",
    description: "Own seat, no account sharing tricks—keep compliance happy while saving 90%.",
  },
  {
    icon: Chrome,
    title: "Effortless Updates",
    description: "Every Grammarly Premium update lands automatically without extra charges.",
  },
  {
    icon: Fingerprint,
    title: "SSO Friendly",
    description: "Keep your normal Grammarly login; we simply provision it at the lower monthly rate.",
  },
  {
    icon: UserPlus,
    title: "Unlimited Usage",
    description: "Use every premium check, prompt, and analysis as often as you need for one flat $2.99 fee.",
  },
]

export function Features() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
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
    <section id="features" className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12 sm:mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-sans text-foreground mb-4">Premium Features, Tiny Price</h2>
          <p className="text-base sm:text-lg text-foreground/70 max-w-2xl mx-auto px-4">
            Everything inside Grammarly Premium—rewrites, tone checks, plagiarism scanning—now bundled for $2.99/month.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12 sm:mb-16 justify-items-center"
        >
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <motion.div key={index} variants={itemVariants} className="w-full max-w-sm sm:max-w-none">
                <Card className="p-4 sm:p-6 hover:shadow-lg transition-shadow h-full w-full max-w-sm sm:max-w-none">
                  <motion.div whileHover={{ scale: 1.1 }} transition={{ type: "spring", stiffness: 400, damping: 10 }}>
                    <Icon className="w-8 h-8 text-primary mb-4" />
                  </motion.div>
                  <h3 className="font-sans font-semibold text-foreground mb-2">{feature.title}</h3>
                  <p className="text-sm text-foreground/70">{feature.description}</p>
                </Card>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Supported Apps Band */}
        {/* <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="bg-foreground/5 rounded-2xl border border-border p-6 sm:p-8 mx-2 sm:mx-0"
        >
          <p className="text-center text-sm text-foreground/60 mb-6">Supported apps</p>
          <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-6 text-foreground/50 px-4">
            <span className="text-sm font-semibold">ChatGPT</span>
            <span className="text-border">•</span>
            <span className="text-sm font-semibold">Netflix</span>
            <span className="text-border">•</span>
            <span className="text-sm font-semibold">Expo</span>
            <span className="text-border">•</span>
            <span className="text-sm font-semibold">Grok</span>
            <span className="text-border">•</span>
            <span className="text-sm font-semibold">Grammarly</span>
            <span className="text-border">•</span>
            <span className="text-sm font-semibold">+ more coming</span>
          </div>
        </motion.div> */}
      </div>
    </section>
  )
}
