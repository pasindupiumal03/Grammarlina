import Link from 'next/link'
import Image from 'next/image'
import { Mail, Globe } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-card/50 border-t border-border py-12 sm:py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2 w-fit">
              <Image 
                src="/logo.svg" 
                alt="Grammarlina" 
                width={32} 
                height={32}
                className="w-8 h-8"
              />
              <span className="font-bold text-foreground">Grammarlina</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Affordable premium writing tools for everyone.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4">Product</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#features" className="text-muted-foreground hover:text-foreground transition">Features</a></li>
              <li><a href="#pricing" className="text-muted-foreground hover:text-foreground transition">Pricing</a></li>
              <li><a href="#how-it-works" className="text-muted-foreground hover:text-foreground transition">How It Works</a></li>
              <li><a href="#faq" className="text-muted-foreground hover:text-foreground transition">FAQ</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/about" className="text-muted-foreground hover:text-foreground transition">About</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition">Blog</a></li>
              <li><a href="/contact" className="text-muted-foreground hover:text-foreground transition">Contact</a></li>
              <li><a href="/privacy" className="text-muted-foreground hover:text-foreground transition">Privacy</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4">Contact</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary" />
                <a href="mailto:support@grammarlina.com" className="text-muted-foreground hover:text-foreground transition">
                  support@grammarlina.com
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-primary" />
                <a href="#" className="text-muted-foreground hover:text-foreground transition">
                  www.grammarlina.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-xs text-muted-foreground text-center sm:text-left">
              © 2025 Grammarlina. All rights reserved.
            </p>
            <div className="flex gap-6 text-xs">
              <a href="/privacy" className="text-muted-foreground hover:text-foreground transition">Privacy Policy</a>
              <a href="/terms" className="text-muted-foreground hover:text-foreground transition">Terms of Service</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
