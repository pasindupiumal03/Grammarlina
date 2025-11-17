"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Mail } from "lucide-react"

export function BookDemo() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    orgSize: "",
    message: "",
  })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Format the email body with all form data
    const subject = encodeURIComponent("Book a Demo Request")
    const body = encodeURIComponent(
      `Hello,

I would like to book a demo for Grammarlina.

Name: ${formData.name}
Email: ${formData.email}
Company: ${formData.company}
Organization Size: ${formData.orgSize}
${formData.message ? `Message: ${formData.message}` : ""}

Thank you!`
    )

    // Create mailto link
    const mailtoLink = `mailto:hello@sessionshare.app?subject=${subject}&body=${body}`

    // Open email client
    window.location.href = mailtoLink

    // Show success message and reset form
    setSubmitted(true)
    setFormData({ name: "", email: "", company: "", orgSize: "", message: "" })
    setTimeout(() => setSubmitted(false), 5000)
    setLoading(false)
  }

  return (
    <section id="book-demo" className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-foreground/2">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-10 sm:mb-12"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-sans text-foreground mb-4">Ready to get started?</h2>
          <p className="text-base sm:text-lg text-foreground/70 px-4">Book a demo with our team to see Grammarlina in action.</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true }}
        >
          <Card className="p-6 sm:p-8 md:p-12 mx-2 sm:mx-0">
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8"
              >
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 0.6 }}
                  className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4"
                >
                  <Mail className="w-6 h-6 text-primary" />
                </motion.div>
                <h3 className="text-xl font-sans font-semibold text-foreground mb-2">Thanks for reaching out!</h3>
                <p className="text-foreground/70">We'll be in touch shortly with more information.</p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-foreground mb-2">Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder:text-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-foreground mb-2">Work Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder:text-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50"
                      placeholder="you@company.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-foreground mb-2">Company</label>
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder:text-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50"
                      placeholder="Your company"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-foreground mb-2">Organization Size</label>
                    <select
                      name="orgSize"
                      value={formData.orgSize}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    >
                      <option value="">Select size</option>
                      <option value="1-10">1-10 people</option>
                      <option value="11-50">11-50 people</option>
                      <option value="51-200">51-200 people</option>
                      <option value="200+">200+ people</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-foreground mb-2">Message (optional)</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder:text-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                    placeholder="Tell us about your use case..."
                  />
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Sending..." : "Book a Demo"}
                </Button>
              </form>
            )}

            <div className="mt-8 pt-8 border-t border-border text-center">
              <p className="text-sm text-foreground/70 mb-2">Or email us directly:</p>
              <a href="mailto:hello@sessionshare.app" className="text-primary font-semibold hover:underline">
                hello@sessionshare.app
              </a>
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}
