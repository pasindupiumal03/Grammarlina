"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  const navLinks = [
    { href: "#features", label: "Features" },
    { href: "#how-it-works", label: "How it Works" },
    { href: "#pricing", label: "Pricing" },
    { href: "#download-extension", label: "Download Extension" },
  ]

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  const handleNavLinkClick = (href: string, e: React.MouseEvent) => {
    e.preventDefault()
    
    if (pathname === "/" || pathname === "/") {
      // If we're on the home page or root, just scroll to the section
      scrollToSection(href)
    } else {
      // If we're on another page, navigate to home first with the hash
      router.push(`/${href}`)
    }
    setIsOpen(false)
  }

  const handleBookDemoClick = () => {
    if (pathname === "/" || pathname === "/") {
      // If we're on the home page or root, just scroll to the section
      scrollToSection("#book-demo")
    } else {
      // If we're on another page, navigate to home first with the hash
      router.push("/#book-demo")
    }
    setIsOpen(false)
  }

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo.svg" alt="Grammarlina" width={32} height={32} />
            <span className="font-bold text-foreground hidden sm:inline">Grammarlina</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={(e) => handleNavLinkClick(link.href, e)}
                className="text-sm text-foreground/70 hover:text-foreground transition-colors"
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Desktop Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => router.push("/login")}>
              Sign in
            </Button>
            <Button size="sm" onClick={handleBookDemoClick}>Download Extension</Button>
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden p-3 -mr-3" onClick={() => setIsOpen(!isOpen)} aria-label="Toggle menu">
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden pb-4 pt-4 border-t border-border/50">
            <div className="space-y-2">
              {navLinks.map((link) => (
                <button
                  key={link.href}
                  onClick={(e) => handleNavLinkClick(link.href, e)}
                  className="block text-sm text-foreground/70 hover:text-foreground transition-colors py-3 px-2 w-full text-left rounded-md hover:bg-foreground/5"
                >
                  {link.label}
                </button>
              ))}
            </div>
            <div className="flex gap-3 pt-4">
              <Button variant="ghost" size="sm" className="flex-1 py-3" onClick={() => router.push("/login")}>
                Sign in
              </Button>
              <Button size="sm" className="flex-1 py-3" onClick={handleBookDemoClick}>
                Download Extension
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
