import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function TermsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <span className="text-xl font-bold">FarmConnect</span>
          </Link>
          <nav className="hidden md:flex gap-6">
            <Link href="/about" className="text-sm font-medium hover:underline underline-offset-4">
              About
            </Link>
            <Link href="/how-it-works" className="text-sm font-medium hover:underline underline-offset-4">
              How It Works
            </Link>
            <Link href="/contact" className="text-sm font-medium hover:underline underline-offset-4">
              Contact
            </Link>
          </nav>
          <div className="flex gap-4">
            <Link href="/login">
              <Button variant="outline">Log In</Button>
            </Link>
            <Link href="/signup">
              <Button>Sign Up</Button>
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="space-y-4">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Terms of Service</h1>
              <p className="text-muted-foreground">Last updated: April 5, 2024</p>
              
              <div className="space-y-6">
                <section className="space-y-4">
                  <h2 className="text-2xl font-bold">1. Acceptance of Terms</h2>
                  <p className="text-muted-foreground">
                    By accessing and using FarmConnect, you accept and agree to be bound by the terms and provision of this agreement.
                  </p>
                </section>

                <section className="space-y-4">
                  <h2 className="text-2xl font-bold">2. Description of Service</h2>
                  <p className="text-muted-foreground">
                    FarmConnect provides a platform connecting grocery stores with farmers to facilitate the exchange of food waste for livestock feed. The service includes listing, browsing, and communication features.
                  </p>
                </section>

                <section className="space-y-4">
                  <h2 className="text-2xl font-bold">3. User Responsibilities</h2>
                  <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    <li>Provide accurate and complete information when creating an account</li>
                    <li>Maintain the security of your account credentials</li>
                    <li>Comply with all applicable laws and regulations</li>
                    <li>Use the service in a responsible and ethical manner</li>
                  </ul>
                </section>

                <section className="space-y-4">
                  <h2 className="text-2xl font-bold">4. Privacy Policy</h2>
                  <p className="text-muted-foreground">
                    Your use of FarmConnect is also governed by our Privacy Policy. Please review our Privacy Policy, which also governs the site and informs users of our data collection practices.
                  </p>
                </section>

                <section className="space-y-4">
                  <h2 className="text-2xl font-bold">5. Limitation of Liability</h2>
                  <p className="text-muted-foreground">
                    FarmConnect shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use the service.
                  </p>
                </section>

                <section className="space-y-4">
                  <h2 className="text-2xl font-bold">6. Changes to Terms</h2>
                  <p className="text-muted-foreground">
                    We reserve the right to modify these terms at any time. We will notify users of any changes by posting the new Terms of Service on this page.
                  </p>
                </section>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t">
        <div className="container flex flex-col gap-4 py-10 md:flex-row md:gap-8 md:py-12">
          <div className="flex-1 space-y-4">
            <div className="text-xl font-bold">FarmConnect</div>
            <p className="text-sm text-muted-foreground">
              Connecting grocery stores with farmers to reduce food waste and support sustainable farming.
            </p>
          </div>
          <div className="flex flex-col gap-2 md:gap-4">
            <div className="font-semibold">Company</div>
            <nav className="flex flex-col gap-2">
              <Link href="/about" className="text-sm hover:underline underline-offset-4">
                About
              </Link>
              <Link href="/careers" className="text-sm hover:underline underline-offset-4">
                Careers
              </Link>
              <Link href="/contact" className="text-sm hover:underline underline-offset-4">
                Contact
              </Link>
            </nav>
          </div>
          <div className="flex flex-col gap-2 md:gap-4">
            <div className="font-semibold">Legal</div>
            <nav className="flex flex-col gap-2">
              <Link href="/terms" className="text-sm hover:underline underline-offset-4">
                Terms
              </Link>
              <Link href="/privacy" className="text-sm hover:underline underline-offset-4">
                Privacy
              </Link>
              <Link href="/cookies" className="text-sm hover:underline underline-offset-4">
                Cookies
              </Link>
            </nav>
          </div>
        </div>
        <div className="border-t">
          <div className="container flex h-16 items-center justify-between px-4 md:px-6">
            <div className="text-sm text-muted-foreground">© 2024 FarmConnect. All rights reserved.</div>
          </div>
        </div>
      </footer>
    </div>
  )
} 