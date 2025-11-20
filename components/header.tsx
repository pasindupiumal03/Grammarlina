'use client'

import { Button } from '@/components/ui/button'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, X } from 'lucide-react'
import { useState } from 'react'

export function Header() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur border-b border-border">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Image 
            src="/logo.svg" 
            alt="Grammarlina" 
            width={32} 
            height={32}
            className="w-8 h-8"
          />
          <span className="text-xl font-bold text-foreground hidden sm:inline">Grammarlina</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition">Features</a>
          <a href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition">How it Works</a>
          <a href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition">Pricing</a>
          <a href="#faq" className="text-sm text-muted-foreground hover:text-foreground transition">FAQ</a>
        </div>

        <div className="hidden md:flex items-center gap-3">
          <Button variant="outline" asChild>
            <a href="/login">Sign In</a>
          </Button>
          <Button asChild>
            <a href="https://docs.google.com/forms/d/e/1FAIpQLSeVYKiRIa7wM1OUs48PQiot0et2dYJtGIVE92lD4oVKUb5nKw/viewform?usp=dialog">Start Free Trial</a>
          </Button>
        </div>

        <button
          className="md:hidden"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {isOpen && (
        <div className="md:hidden border-t border-border">
          <div className="px-4 py-4 space-y-3">
            <a href="#features" className="block text-sm text-muted-foreground hover:text-foreground transition">Features</a>
            <a href="#how-it-works" className="block text-sm text-muted-foreground hover:text-foreground transition">How it Works</a>
            <a href="#pricing" className="block text-sm text-muted-foreground hover:text-foreground transition">Pricing</a>
            <a href="#faq" className="block text-sm text-muted-foreground hover:text-foreground transition">FAQ</a>
            <div className="flex gap-2 pt-3">
              <Button variant="outline" className="flex-1" asChild>
                <a href="/login">Sign In</a>
              </Button>
              <Button className="flex-1" asChild>
                <a href="#pricing">Free Trial</a>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
