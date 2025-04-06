"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import Image from "next/image"

export default function About() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <header className="border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-0 z-50">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <span className="text-xl font-bold text-green-600">FarmConnect</span>
          </Link>
          <nav className="hidden md:flex gap-6">
            <Link href="/about" className="text-sm font-medium text-green-600 transition-colors">
              About
            </Link>
            <Link href="/how-it-works" className="text-sm font-medium hover:text-green-600 transition-colors">
              How It Works
            </Link>
            <Link href="/contact" className="text-sm font-medium hover:text-green-600 transition-colors">
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
                  About FarmConnect
                </h1>
                <p className="max-w-[900px] text-slate-700 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  We're on a mission to reduce food waste and support sustainable farming practices.
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-white">
          <div className="container">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="space-y-4">
                <h2 className="text-2xl font-bold tracking-tighter sm:text-3xl text-green-800">Our Story</h2>
                <p className="text-slate-700 md:text-lg/relaxed">
                  FarmConnect was founded with a simple yet powerful idea: to create a sustainable solution for food waste
                  while supporting local farmers. We recognized that grocery stores were discarding significant amounts of
                  food that could be repurposed as livestock feed, creating an opportunity to build a bridge between these
                  two industries.
                </p>
                <p className="text-slate-700 md:text-lg/relaxed">
                  Today, we're proud to facilitate connections between grocery stores and farmers across the country,
                  helping reduce waste and create value for both parties.
                </p>
              </div>
              <div className="flex justify-center">
                <div className="relative w-full max-w-[600px] aspect-[4/3] rounded-xl overflow-hidden shadow-xl">
                  <Image
                    src="/produce-banner.jpg"
                    alt="Fresh produce and vegetables"
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-green-50">
          <div className="container">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-2xl font-bold tracking-tighter sm:text-3xl text-green-800">Our Impact</h2>
                <p className="max-w-[900px] text-slate-700 md:text-lg/relaxed">
                  Through our platform, we've helped achieve significant environmental and economic benefits.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-12">
              <div className="flex flex-col items-center justify-center space-y-4 text-center">
                <div className="text-4xl font-bold text-green-600">1000+</div>
                <p className="text-slate-700">Tons of Food Waste Reduced</p>
              </div>
              <div className="flex flex-col items-center justify-center space-y-4 text-center">
                <div className="text-4xl font-bold text-green-600">500+</div>
                <p className="text-slate-700">Active Partnerships</p>
              </div>
              <div className="flex flex-col items-center justify-center space-y-4 text-center">
                <div className="text-4xl font-bold text-green-600">50+</div>
                <p className="text-slate-700">Cities Served</p>
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
              <Link href="/about" className="text-sm text-green-600">
                About
              </Link>
              <Link href="/careers" className="text-sm text-slate-600 hover:text-green-600">
                Careers
              </Link>
              <Link href="/contact" className="text-sm text-slate-600 hover:text-green-600">
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