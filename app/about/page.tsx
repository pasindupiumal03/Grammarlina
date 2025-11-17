"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Target, Heart, Lightbulb, Shield, Zap } from "lucide-react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export default function AboutUs() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="min-h-screen p-4 md:p-8 pt-24">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-12 text-center"
          >
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Users className="w-8 h-8 text-primary" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              About Grammarlina
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We're on a mission to make secure collaboration effortless for teams everywhere.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="border-border/50 shadow-xl backdrop-blur-sm bg-card/95 mb-12">
              <CardContent className="p-6 md:p-8">
                <div className="prose prose-sm md:prose-base max-w-none dark:prose-invert">
                  <section className="space-y-6">
                    <div>
                      <h2 className="text-2xl font-semibold text-foreground mb-4">Our Story</h2>
                      <p className="text-muted-foreground leading-relaxed text-lg">
                        Grammarlina was founded with a simple belief: teams shouldn't have to choose between security and productivity. 
                        We recognized that traditional methods of sharing access credentials were not only insecure but also created barriers 
                        to effective collaboration in today's fast-paced work environment.
                      </p>
                    </div>

                    <div>
                      <h2 className="text-2xl font-semibold text-foreground mb-4">Our Vision</h2>
                      <p className="text-muted-foreground leading-relaxed text-lg">
                        To create a world where secure, seamless collaboration is the standard, not the exception. We envision 
                        organizations where teams can work together efficiently without compromising on security or user experience.
                      </p>
                    </div>

                    <div>
                      <h2 className="text-2xl font-semibold text-foreground mb-4">Our Mission</h2>
                      <p className="text-muted-foreground leading-relaxed text-lg">
                        We build tools that enable organizations to share application access securely without sharing passwords, 
                        making collaboration effortless while maintaining the highest security standards.
                      </p>
                    </div>
                  </section>
                </div>
              </CardContent>
            </Card>

            {/* Values */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Card className="border-border/50 shadow-lg backdrop-blur-sm bg-card/95 h-full">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center mx-auto mb-4">
                      <Shield className="w-6 h-6 text-blue-500" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-3">Security First</h3>
                    <p className="text-muted-foreground">
                      We prioritize security in everything we build, ensuring your data and access remain protected.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <Card className="border-border/50 shadow-lg backdrop-blur-sm bg-card/95 h-full">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-4">
                      <Zap className="w-6 h-6 text-green-500" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-3">User Experience</h3>
                    <p className="text-muted-foreground">
                      We believe powerful tools should be simple to use, making sophisticated security accessible to everyone.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <Card className="border-border/50 shadow-lg backdrop-blur-sm bg-card/95 h-full">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center mx-auto mb-4">
                      <Users className="w-6 h-6 text-purple-500" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-3">Collaboration</h3>
                    <p className="text-muted-foreground">
                      We foster environments where teams can work together seamlessly, breaking down barriers to productivity.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Team Section */}
            <Card className="border-border/50 shadow-xl backdrop-blur-sm bg-card/95">
              <CardContent className="p-6 md:p-8">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-foreground mb-4">Why Choose Grammarlina?</h2>
                  <p className="text-muted-foreground text-lg">
                    We're building the future of secure team collaboration
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-1">
                        <Target className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground mb-2">Enterprise-Grade Security</h3>
                        <p className="text-muted-foreground text-sm">
                          Bank-level encryption and security protocols protect your organization's most sensitive data.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-1">
                        <Lightbulb className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground mb-2">Intuitive Design</h3>
                        <p className="text-muted-foreground text-sm">
                          Powerful features wrapped in an interface that your team will love to use every day.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-1">
                        <Heart className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground mb-2">Customer Focused</h3>
                        <p className="text-muted-foreground text-sm">
                          We listen to our users and continuously improve based on real-world feedback and needs.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-1">
                        <Shield className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground mb-2">Compliance Ready</h3>
                        <p className="text-muted-foreground text-sm">
                          Built with compliance in mind, meeting industry standards and regulatory requirements.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
