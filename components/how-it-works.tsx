"use client"

import { Download, Share2, Lock } from "lucide-react"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"

const steps = [
  {
    icon: Download,
    title: "Install the extension",
    description: "Add the Grammarlina browser extension to Chrome or Edge—it unlocks Grammarly Premium for your login.",
  },
  {
    icon: Share2,
    title: "Activate Your Tools",
    description: "Sign in with your Grammarly account and your $2.99 Premium seat activates instantly.",
  },
  {
    icon: Lock,
    title: "Enhance Your Content",
    description: "Write anywhere and enjoy the full Premium experience—rewrites, plagiarism checks, tone shifts—at the 90% discount.",
  },
]

export function HowItWorks() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
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
    <section id="how-it-works" className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-foreground/2">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12 sm:mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-sans text-foreground mb-4">How it Works</h2>
          <p className="text-base sm:text-lg text-foreground/70 max-w-2xl mx-auto px-4">Three quick steps and you&apos;re enjoying Grammarly Premium for $2.99/month.</p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-12 sm:mb-16"
        >
          {steps.map((step, index) => {
            const Icon = step.icon
            return (
              <motion.div key={index} variants={itemVariants} className="relative">
                {/* Connector line */}
                {index < steps.length - 1 && (
                  <motion.div
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    viewport={{ once: true }}
                    className="hidden md:block absolute top-20 left-full w-full h-0.5 bg-gradient-to-r from-primary/50 to-transparent origin-left"
                  />
                )}

                <Card className="p-6 sm:p-8 text-center hover:shadow-lg transition-shadow h-full w-full max-w-sm sm:max-w-none mx-auto">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6"
                  >
                    <Icon className="w-8 h-8 text-primary" />
                  </motion.div>
                  <div className="text-sm text-primary mb-2">Step {index + 1}</div>
                  <h3 className="font-sans font-semibold text-foreground mb-3 text-lg">{step.title}</h3>
                  <p className="text-sm text-foreground/70">{step.description}</p>
                </Card>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
