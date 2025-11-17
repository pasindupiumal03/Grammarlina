"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, Lock, Eye, Database, Cookie, Mail } from "lucide-react";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export default function PrivacyPolicy() {
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
              <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center">
                <Shield className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                  Privacy Policy
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
                  <p className="text-muted-foreground leading-relaxed text-lg">
                    At Grammarlina, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our Service.
                  </p>
                </section>

                <section className="space-y-4">
                  <h2 className="text-2xl font-semibold text-foreground flex items-center gap-2">
                    <Database className="w-5 h-5 text-blue-500" />
                    1. Information We Collect
                  </h2>
                  
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-2">
                        Personal Information
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        When you register for an account, we collect:
                      </p>
                      <ul className="space-y-1 text-muted-foreground ml-4 mt-2">
                        <li>• Name</li>
                        <li>• Email address</li>
                        <li>• Password (encrypted)</li>
                        <li>• Profile information</li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-2">
                        Organization Information
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        When you create or join an organization:
                      </p>
                      <ul className="space-y-1 text-muted-foreground ml-4 mt-2">
                        <li>• Organization name and details</li>
                        <li>• Member roles and permissions</li>
                        <li>• Session data and collaboration content</li>
                        <li>• User categories and assignments</li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-2">
                        Usage Information
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        We automatically collect certain information when you use the Service:
                      </p>
                      <ul className="space-y-1 text-muted-foreground ml-4 mt-2">
                        <li>• Log data (IP address, browser type, operating system)</li>
                        <li>• Device information</li>
                        <li>• Usage patterns and preferences</li>
                        <li>• Cookies and similar tracking technologies</li>
                      </ul>
                    </div>
                  </div>
                </section>

                <section className="space-y-4">
                  <h2 className="text-2xl font-semibold text-foreground flex items-center gap-2">
                    <Eye className="w-5 h-5 text-purple-500" />
                    2. How We Use Your Information
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    We use the information we collect for various purposes:
                  </p>
                  <div className="bg-muted/50 p-4 rounded-lg border border-border/50 space-y-2">
                    <div className="flex items-start gap-2">
                      <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-bold text-primary">✓</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        To provide, maintain, and improve our Service
                      </p>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-bold text-primary">✓</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        To process your transactions and manage your account
                      </p>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-bold text-primary">✓</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        To send you technical notices and support messages
                      </p>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-bold text-primary">✓</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        To respond to your comments and questions
                      </p>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-bold text-primary">✓</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        To detect, prevent, and address technical issues or fraud
                      </p>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-bold text-primary">✓</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        To analyze usage and improve user experience
                      </p>
                    </div>
                  </div>
                </section>

                <section className="space-y-4">
                  <h2 className="text-2xl font-semibold text-foreground flex items-center gap-2">
                    <Lock className="w-5 h-5 text-green-500" />
                    3. Data Security
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    We implement appropriate technical and organizational security measures to protect your personal information:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-green-500/5 p-4 rounded-lg border border-green-500/20">
                      <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                        <Lock className="w-4 h-4 text-green-500" />
                        Encryption
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        All data transmitted is encrypted using industry-standard SSL/TLS protocols
                      </p>
                    </div>
                    <div className="bg-blue-500/5 p-4 rounded-lg border border-blue-500/20">
                      <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                        <Shield className="w-4 h-4 text-blue-500" />
                        Secure Storage
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Your password is hashed and never stored in plain text
                      </p>
                    </div>
                    <div className="bg-purple-500/5 p-4 rounded-lg border border-purple-500/20">
                      <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                        <Database className="w-4 h-4 text-purple-500" />
                        Access Control
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Strict access controls limit who can view your data
                      </p>
                    </div>
                    <div className="bg-orange-500/5 p-4 rounded-lg border border-orange-500/20">
                      <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                        <Eye className="w-4 h-4 text-orange-500" />
                        Monitoring
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Regular security audits and monitoring for suspicious activity
                      </p>
                    </div>
                  </div>
                </section>

                <section className="space-y-4">
                  <h2 className="text-2xl font-semibold text-foreground flex items-center gap-2">
                    <Cookie className="w-5 h-5 text-amber-500" />
                    4. Cookies and Tracking
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    We use cookies and similar tracking technologies to enhance your experience:
                  </p>
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">Essential Cookies</h4>
                      <p className="text-sm text-muted-foreground">
                        Required for authentication and basic functionality. These cannot be disabled.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">Analytics Cookies</h4>
                      <p className="text-sm text-muted-foreground">
                        Help us understand how you use the Service to improve user experience.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">Preference Cookies</h4>
                      <p className="text-sm text-muted-foreground">
                        Remember your settings and preferences for future visits.
                      </p>
                    </div>
                  </div>
                </section>

                <section className="space-y-4">
                  <h2 className="text-2xl font-semibold text-foreground">
                    5. Data Sharing and Disclosure
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    We do not sell your personal information. We may share your information only in the following circumstances:
                  </p>
                  <ul className="space-y-2 text-muted-foreground ml-4">
                    <li>• <strong>With your organization:</strong> Members of organizations you join can see information you share within that organization</li>
                    <li>• <strong>Service providers:</strong> Third-party vendors who assist in operating our Service (subject to strict confidentiality agreements)</li>
                    <li>• <strong>Legal compliance:</strong> When required by law or to protect our rights</li>
                    <li>• <strong>Business transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
                  </ul>
                </section>

                <section className="space-y-4">
                  <h2 className="text-2xl font-semibold text-foreground">
                    6. Your Rights and Choices
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    You have certain rights regarding your personal information:
                  </p>
                  <div className="bg-blue-500/5 p-4 rounded-lg border border-blue-500/20 space-y-2">
                    <p className="text-sm">
                      <strong className="text-foreground">Access:</strong>
                      <span className="text-muted-foreground ml-2">
                        Request a copy of your personal data
                      </span>
                    </p>
                    <p className="text-sm">
                      <strong className="text-foreground">Correction:</strong>
                      <span className="text-muted-foreground ml-2">
                        Update or correct inaccurate information
                      </span>
                    </p>
                    <p className="text-sm">
                      <strong className="text-foreground">Deletion:</strong>
                      <span className="text-muted-foreground ml-2">
                        Request deletion of your account and data
                      </span>
                    </p>
                    <p className="text-sm">
                      <strong className="text-foreground">Export:</strong>
                      <span className="text-muted-foreground ml-2">
                        Download your data in a portable format
                      </span>
                    </p>
                    <p className="text-sm">
                      <strong className="text-foreground">Opt-out:</strong>
                      <span className="text-muted-foreground ml-2">
                        Unsubscribe from marketing communications
                      </span>
                    </p>
                  </div>
                </section>

                <section className="space-y-4">
                  <h2 className="text-2xl font-semibold text-foreground">
                    7. Data Retention
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    We retain your personal information for as long as necessary to provide the Service and fulfill the purposes outlined in this Privacy Policy. When you delete your account, we will delete or anonymize your personal information within 30 days, except where we are required to retain it for legal purposes.
                  </p>
                </section>

                <section className="space-y-4">
                  <h2 className="text-2xl font-semibold text-foreground">
                    8. Children's Privacy
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Our Service is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe your child has provided us with personal information, please contact us.
                  </p>
                </section>

                <section className="space-y-4">
                  <h2 className="text-2xl font-semibold text-foreground">
                    9. International Data Transfers
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Your information may be transferred to and maintained on servers located outside of your state, province, country, or other governmental jurisdiction. We ensure appropriate safeguards are in place for such transfers.
                  </p>
                </section>

                <section className="space-y-4">
                  <h2 className="text-2xl font-semibold text-foreground">
                    10. Changes to Privacy Policy
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new Privacy Policy on this page and updating the "Last updated" date. You are advised to review this Privacy Policy periodically for any changes.
                  </p>
                </section>

                <section className="space-y-4">
                  <h2 className="text-2xl font-semibold text-foreground flex items-center gap-2">
                    <Mail className="w-5 h-5 text-primary" />
                    11. Contact Us
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    If you have any questions about this Privacy Policy or our data practices, please contact us:
                  </p>
                  <div className="bg-muted/50 p-4 rounded-lg border border-border/50">
                    <p className="text-sm">
                      <strong>Email:</strong> privacy@sessionshare.com
                    </p>
                    <p className="text-sm mt-1">
                      <strong>Data Protection Officer:</strong> dpo@sessionshare.com
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
            <Link href="/terms">
              <Button variant="link" className="text-accent">
                View Terms of Service →
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

