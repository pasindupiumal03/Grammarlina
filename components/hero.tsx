"use client";

import { ArrowRight, Sparkles, Shield, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";

export function Hero() {
  const router = useRouter();
  const scrollToBookDemo = () => {
    const el = document.getElementById("book-demo");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      router.push("/#book-demo");
    }
  };
  return (
    <section className="relative overflow-hidden pt-16 pb-24 sm:pt-20 sm:pb-32 px-4 sm:px-6 lg:px-8 bg-background">
      {/* Enhanced animated background blobs - hidden on mobile for performance */}
      <div className="absolute top-20 right-10 w-48 h-48 sm:w-72 sm:h-72 bg-gradient-to-r from-primary/20 via-primary/10 to-accent/5 rounded-full blur-3xl blob hidden sm:block" />
      <div
        className="absolute bottom-0 left-1/4 w-64 h-64 sm:w-96 sm:h-96 bg-gradient-to-r from-accent/20 via-accent/10 to-primary/5 rounded-full blur-3xl blob hidden sm:block"
        style={{ animationDelay: "2s" }}
      />
      <div
        className="absolute top-1/2 left-10 w-32 h-32 sm:w-64 sm:h-64 bg-gradient-to-r from-blue-500/10 via-purple-500/5 to-accent/10 rounded-full blur-3xl blob hidden sm:block"
        style={{ animationDelay: "4s" }}
      />

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]" />

      {/* Floating elements - hidden on mobile for performance */}
      <motion.div
        animate={{
          y: [0, -20, 0],
          rotate: [0, 5, 0],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-32 left-20 text-primary/20 hidden sm:block"
      >
        <Sparkles size={32} />
      </motion.div>

      <motion.div
        animate={{
          y: [0, 15, 0],
          rotate: [0, -5, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
        className="absolute top-48 right-32 text-accent/20 hidden sm:block"
      >
        <Shield size={28} />
      </motion.div>

      <motion.div
        animate={{
          y: [0, -10, 0],
          x: [0, 10, 0],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
        className="absolute bottom-32 right-20 text-primary/20 hidden sm:block"
      >
        <Zap size={24} />
      </motion.div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Enhanced Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, type: "spring", bounce: 0.4 }}
          className="flex justify-center mb-8"
        >
          <Badge
            variant="secondary"
            className="bg-gradient-to-r from-white via-blue-50 to-blue-100 text-primary border-blue-200 shadow-lg backdrop-blur-sm"
          >
            <motion.span
              className="w-2 h-2 bg-primary rounded-full mr-2 relative"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.7, 1, 0.7],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            <span
              className="bg-clip-text text-transparent font-medium"
              style={{
                background:
                  "linear-gradient(to right, #1e40af, #3b82f6, #60a5fa)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
              }}
            >
              New • Admin Extension now in live
            </span>
          </Badge>
        </motion.div>

        {/* Enhanced Headline */}
        <div className="text-center mb-8 sm:mb-12">
          <motion.h1
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
              duration: 0.8,
              delay: 0.1,
              type: "spring",
              bounce: 0.2,
            }}
            className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold font-sans text-balance leading-tight mb-4 sm:mb-6"
          >
            <span className="bg-gradient-to-r from-foreground via-foreground to-foreground/80 bg-clip-text text-transparent">
              Share App Sessions.
            </span>
            <br />
            <motion.span
              className="bg-gradient-to-r from-primary via-primary/90 to-accent bg-clip-text text-transparent"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              Securely. Effortlessly.
            </motion.span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.3, type: "spring" }}
            className="text-base sm:text-lg md:text-xl text-foreground/70 text-balance max-w-2xl mx-auto mb-6 sm:mb-8 leading-relaxed px-2"
          >
            <span className="bg-gradient-to-r from-foreground/80 via-foreground/70 to-foreground/60 bg-clip-text text-transparent">
              Session Share lets organizations grant temporary, moderated access
              to web apps without sharing passwords.
            </span>
          </motion.p>
        </div>

        {/* Enhanced CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{
            duration: 0.7,
            delay: 0.4,
            type: "spring",
            bounce: 0.3,
          }}
          className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center mb-12 sm:mb-16 px-4"
        >
          <motion.div
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <Button
              size="lg"
              className="gap-2 bg-gradient-to-r from-primary via-primary to-primary/90 hover:from-primary/90 hover:via-primary hover:to-primary shadow-xl shadow-primary/25 border-0 text-white font-semibold px-6 sm:px-8 py-4 sm:py-6 h-auto w-full sm:w-auto"
              onClick={scrollToBookDemo}
            >
              Book a demo
              <motion.div
                animate={{ x: [0, 4, 0] }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <ArrowRight size={18} />
              </motion.div>
            </Button>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <Button
              size="lg"
              variant="outline"
              onClick={() => router.push("/login")}
              className="border-2 border-primary/20 hover:border-primary/40 hover:bg-primary/5 backdrop-blur-sm font-semibold px-6 sm:px-8 py-4 sm:py-6 h-auto shadow-lg w-full sm:w-auto"
            >
              Try free
            </Button>
          </motion.div>
        </motion.div>

        {/* Enhanced Visual Mockup */}
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{
            duration: 0.8,
            delay: 0.6,
            type: "spring",
            bounce: 0.2,
          }}
          className="relative group"
        >
          {/* Glow effect behind the video container */}
          <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

          <div className="relative bg-gradient-to-br from-primary/8 via-primary/4 to-transparent rounded-2xl sm:rounded-3xl border border-border/50 p-4 sm:p-8 md:p-12 backdrop-blur-sm shadow-2xl mx-2 sm:mx-0">
            {/* Subtle inner glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-accent/5 rounded-3xl" />

            <div className="relative aspect-video bg-gradient-to-br from-foreground/8 via-foreground/4 to-transparent rounded-xl sm:rounded-2xl overflow-hidden border border-border/30 shadow-xl">
              <iframe
                className="w-full h-full"
                src="https://www.youtube.com/embed/UoP-b321y78?autoplay=1&mute=1&loop=1"
                title="Session Share Demo"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>

            {/* Decorative elements */}
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-primary/20 rounded-full blur-sm" />
            <div className="absolute -bottom-2 -left-2 w-8 h-8 bg-accent/20 rounded-full blur-sm" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
