"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export default function Contact() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <header className="border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-0 z-50">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <span className="text-xl font-bold text-green-600">FarmConnect</span>
          </Link>
          <nav className="hidden md:flex gap-6">
            <Link href="/about" className="text-sm font-medium hover:text-green-600 transition-colors">
              About
            </Link>
            <Link href="/how-it-works" className="text-sm font-medium hover:text-green-600 transition-colors">
              How It Works
            </Link>
            <Link href="/contact" className="text-sm font-medium text-green-600 transition-colors">
              Contact
            </Link>
          </nav>
          <div className="flex gap-4">
            <Link href="/login">
              <Button variant="outline" className="hover:text-green-600 hover:border-green-600">Log In</Button>
            </Link>
            <Link href="/signup">
              <Button className="bg-green-600 hover:bg-green-700">Sign Up</Button>
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-white to-green-50">
          <div className="container">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-green-800">
                  Contact Us
                </h1>
                <p className="max-w-[900px] text-slate-700 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Have questions? We're here to help. Send us a message and we'll respond as soon as possible.
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-white">
          <div className="container">
            <div className="mx-auto max-w-[600px] space-y-8">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold tracking-tighter text-green-800">Get in Touch</h2>
                  <p className="text-slate-700">
                    Fill out the form below and we'll get back to you within 24 hours.
                  </p>
                </div>
                <div className="space-y-4">
                  <div className="grid gap-2">
                    <label className="text-sm font-medium text-slate-700" htmlFor="name">
                      Name
                    </label>
                    <Input
                      id="name"
                      placeholder="Enter your name"
                      className="border-slate-200"
                    />
                  </div>
                  <div className="grid gap-2">
                    <label className="text-sm font-medium text-slate-700" htmlFor="email">
                      Email
                    </label>
                    <Input
                      id="email"
                      placeholder="Enter your email"
                      type="email"
                      className="border-slate-200"
                    />
                  </div>
                  <div className="grid gap-2">
                    <label className="text-sm font-medium text-slate-700" htmlFor="subject">
                      Subject
                    </label>
                    <Input
                      id="subject"
                      placeholder="Enter the subject"
                      className="border-slate-200"
                    />
                  </div>
                  <div className="grid gap-2">
                    <label className="text-sm font-medium text-slate-700" htmlFor="message">
                      Message
                    </label>
                    <Textarea
                      id="message"
                      placeholder="Enter your message"
                      className="min-h-[150px] border-slate-200"
                    />
                  </div>
                  <Button className="w-full bg-green-600 hover:bg-green-700">
                    Send Message
                  </Button>
                </div>
              </div>
              <div className="grid gap-4 text-center md:grid-cols-2">
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-green-800">Email Us</h3>
                  <p className="text-slate-700">
                    <a href="mailto:support@farmconnect.com" className="hover:text-green-600">
                      support@farmconnect.com
                    </a>
                  </p>
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-green-800">Call Us</h3>
                  <p className="text-slate-700">
                    <a href="tel:+1-555-123-4567" className="hover:text-green-600">
                      +1 (555) 123-4567
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t bg-white">
        <div className="container flex flex-col gap-4 py-10 md:flex-row md:gap-8 md:py-12">
          <div className="flex-1 space-y-4">
            <div className="text-xl font-bold text-green-600">FarmConnect</div>
            <p className="text-sm text-slate-600">
              Connecting grocery stores with farmers to reduce food waste and support sustainable farming.
            </p>
          </div>
          <div className="flex flex-col gap-2 md:gap-4">
            <div className="font-semibold text-green-800">Company</div>
            <nav className="flex flex-col gap-2">
              <Link href="/about" className="text-sm text-slate-600 hover:text-green-600">
                About
              </Link>
              <Link href="/how-it-works" className="text-sm text-slate-600 hover:text-green-600">
                How It Works
              </Link>
              <Link href="/contact" className="text-sm text-green-600">
                Contact
              </Link>
            </nav>
          </div>
          <div className="flex flex-col gap-2 md:gap-4">
            <div className="font-semibold text-green-800">Legal</div>
            <nav className="flex flex-col gap-2">
              <Link href="/terms" className="text-sm text-slate-600 hover:text-green-600">
                Terms
              </Link>
              <Link href="/privacy" className="text-sm text-slate-600 hover:text-green-600">
                Privacy
              </Link>
              <Link href="/cookies" className="text-sm text-slate-600 hover:text-green-600">
                Cookies
              </Link>
            </nav>
          </div>
        </div>
        <div className="border-t">
          <div className="container flex h-16 items-center justify-between">
            <div className="text-sm text-slate-600">© 2024 FarmConnect. All rights reserved.</div>
            <div className="flex gap-4">
              <Link href="#" className="text-slate-600 hover:text-green-600">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
                <span className="sr-only">Facebook</span>
              </Link>
              <Link href="#" className="text-slate-600 hover:text-green-600">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                </svg>
                <span className="sr-only">Twitter</span>
              </Link>
              <Link href="#" className="text-slate-600 hover:text-green-600">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
                </svg>
                <span className="sr-only">Instagram</span>
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
} 