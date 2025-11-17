"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Shield, Users, AlertCircle } from "lucide-react";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="min-h-screen p-4 md:p-8 pt-24">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <FileText className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                  Terms of Service
                </h1>
                <p className="text-muted-foreground mt-1">
                  Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              </div>
            </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="border-border/50 shadow-xl backdrop-blur-sm bg-card/95">
            <CardContent className="p-6 md:p-8 space-y-8">
              <div className="prose prose-sm md:prose-base max-w-none dark:prose-invert">
                <section className="space-y-4">
                  <h2 className="text-2xl font-semibold text-foreground flex items-center gap-2">
                    <Shield className="w-5 h-5 text-primary" />
                    1. Acceptance of Terms
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    By accessing and using Grammarlina ("the Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
                  </p>
                </section>

                <section className="space-y-4">
                  <h2 className="text-2xl font-semibold text-foreground flex items-center gap-2">
                    <Users className="w-5 h-5 text-primary" />
                    2. Use of Service
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Grammarlina provides a platform for collaborative session management and sharing. You agree to use the Service only for lawful purposes and in accordance with these Terms.
                  </p>
                  <div className="bg-muted/50 p-4 rounded-lg border border-border/50">
                    <p className="text-sm font-medium mb-2">You agree NOT to:</p>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>• Use the Service for any illegal or unauthorized purpose</li>
                      <li>• Violate any laws in your jurisdiction</li>
                      <li>• Infringe upon or violate our intellectual property rights</li>
                      <li>• Transmit any viruses, malware, or malicious code</li>
                      <li>• Attempt to gain unauthorized access to the Service</li>
                      <li>• Interfere with or disrupt the Service or servers</li>
                    </ul>
                  </div>
                </section>

                <section className="space-y-4">
                  <h2 className="text-2xl font-semibold text-foreground">
                    3. User Accounts
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to:
                  </p>
                  <ul className="space-y-2 text-muted-foreground ml-4">
                    <li>• Provide accurate and complete information during registration</li>
                    <li>• Update your information to keep it current</li>
                    <li>• Notify us immediately of any unauthorized use of your account</li>
                    <li>• Not share your account credentials with others</li>
                  </ul>
                </section>

                <section className="space-y-4">
                  <h2 className="text-2xl font-semibold text-foreground">
                    4. Organizations and Teams
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Grammarlina allows users to create and manage organizations. As an organization owner or admin, you are responsible for:
                  </p>
                  <ul className="space-y-2 text-muted-foreground ml-4">
                    <li>• Managing member access and permissions appropriately</li>
                    <li>• Ensuring compliance with these Terms by all organization members</li>
                    <li>• The content and data shared within your organization</li>
                  </ul>
                </section>

                <section className="space-y-4">
                  <h2 className="text-2xl font-semibold text-foreground">
                    5. Intellectual Property
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    The Service and its original content, features, and functionality are owned by Grammarlina and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    You retain all rights to the content you upload or share through the Service. By using the Service, you grant us a license to use, store, and display your content solely for the purpose of operating and providing the Service.
                  </p>
                </section>

                <section className="space-y-4">
                  <h2 className="text-2xl font-semibold text-foreground">
                    6. Data and Privacy
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Your privacy is important to us. Our Privacy Policy explains how we collect, use, and protect your personal information. By using the Service, you agree to our Privacy Policy.
                  </p>
                </section>

                <section className="space-y-4">
                  <h2 className="text-2xl font-semibold text-foreground">
                    7. Termination
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    We may terminate or suspend your account and access to the Service immediately, without prior notice or liability, for any reason, including breach of these Terms. Upon termination, your right to use the Service will cease immediately.
                  </p>
                </section>

                <section className="space-y-4">
                  <h2 className="text-2xl font-semibold text-foreground flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-yellow-500" />
                    8. Disclaimer of Warranties
                  </h2>
                  <div className="bg-yellow-500/10 p-4 rounded-lg border border-yellow-500/20">
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
                    </p>
                  </div>
                </section>

                <section className="space-y-4">
                  <h2 className="text-2xl font-semibold text-foreground">
                    9. Limitation of Liability
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    In no event shall Grammarlina, its directors, employees, or agents be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or relating to your use of the Service.
                  </p>
                </section>

                <section className="space-y-4">
                  <h2 className="text-2xl font-semibold text-foreground">
                    10. Changes to Terms
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    We reserve the right to modify or replace these Terms at any time. We will provide notice of any material changes by posting the new Terms on this page and updating the "Last updated" date.
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    Your continued use of the Service after any changes constitutes acceptance of the new Terms.
                  </p>
                </section>

                <section className="space-y-4">
                  <h2 className="text-2xl font-semibold text-foreground">
                    11. Contact Us
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    If you have any questions about these Terms, please contact us at:
                  </p>
                  <div className="bg-muted/50 p-4 rounded-lg border border-border/50">
                    <p className="text-sm">
                      <strong>Email:</strong> legal@sessionshare.com
                    </p>
                    <p className="text-sm mt-1">
                      <strong>Support:</strong> support@sessionshare.com
                    </p>
                  </div>
                </section>
              </div>
            </CardContent>
          </Card>

          <div className="mt-6 text-center">
            <Link href="/privacy">
              <Button variant="link" className="text-accent">
                View Privacy Policy →
              </Button>
            </Link>
          </div>
        </motion.div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

