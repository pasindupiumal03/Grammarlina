import { Github, Linkedin, Twitter } from "lucide-react"
import Image from "next/image"

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-border bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Image src="/logo.png" alt="Grammarlina" width={32} height={32} />
              <span className="font-mono font-bold text-foreground">Grammarlina</span>
            </div>
            <p className="text-sm text-foreground/60">Secure app session sharing for teams.</p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-mono font-semibold text-foreground mb-4">Product</h4>
            <ul className="space-y-2">
              <li>
                <a href="#features" className="text-sm text-foreground/60 hover:text-foreground transition-colors">
                  Features
                </a>
              </li>
              <li>
                <a href="#pricing" className="text-sm text-foreground/60 hover:text-foreground transition-colors">
                  Pricing
                </a>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-mono font-semibold text-foreground mb-4">Company</h4>
            <ul className="space-y-2">
              <li>
                <a href="/about" className="text-sm text-foreground/60 hover:text-foreground transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="/contact" className="text-sm text-foreground/60 hover:text-foreground transition-colors">
                  Contact Us
                </a>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-mono font-semibold text-foreground mb-4">Follow</h4>
            <div className="flex gap-4">
              <a href="#" className="text-foreground/60 hover:text-foreground transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-foreground/60 hover:text-foreground transition-colors">
                <Github size={20} />
              </a>
              <a href="#" className="text-foreground/60 hover:text-foreground transition-colors">
                <Linkedin size={20} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-border pt-6 sm:pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-center sm:text-left">
          <p className="text-sm text-foreground/60">© {currentYear} Grammarlina. All rights reserved.</p>
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
            <a href="/privacy" className="text-sm text-foreground/60 hover:text-foreground transition-colors py-1">
              Privacy Policy
            </a>
            <a href="/terms" className="text-sm text-foreground/60 hover:text-foreground transition-colors py-1">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
