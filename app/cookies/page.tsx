import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function CookiesPage() {
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
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Cookie Policy</h1>
              <p className="text-muted-foreground">Last updated: April 5, 2024</p>
              
              <div className="space-y-6">
                <section className="space-y-4">
                  <h2 className="text-2xl font-bold">1. What Are Cookies</h2>
                  <p className="text-muted-foreground">
                    Cookies are small text files that are placed on your computer or mobile device when you visit our website. They help us provide you with a better experience and allow certain features to work properly.
                  </p>
                </section>

                <section className="space-y-4">
                  <h2 className="text-2xl font-bold">2. How We Use Cookies</h2>
                  <p className="text-muted-foreground">
                    We use cookies for the following purposes:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    <li>Essential cookies: Required for the website to function properly</li>
                    <li>Authentication cookies: To keep you logged in</li>
                    <li>Preference cookies: To remember your settings and preferences</li>
                    <li>Analytics cookies: To understand how visitors use our website</li>
                    <li>Marketing cookies: To deliver relevant advertisements</li>
                  </ul>
                </section>

                <section className="space-y-4">
                  <h2 className="text-2xl font-bold">3. Types of Cookies We Use</h2>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-xl font-semibold">Essential Cookies</h3>
                      <p className="text-muted-foreground">
                        These cookies are necessary for the website to function and cannot be switched off. They are usually only set in response to actions made by you.
                      </p>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold">Performance Cookies</h3>
                      <p className="text-muted-foreground">
                        These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously.
                      </p>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold">Functionality Cookies</h3>
                      <p className="text-muted-foreground">
                        These cookies enable the website to provide enhanced functionality and personalization.
                      </p>
                    </div>
                  </div>
                </section>

                <section className="space-y-4">
                  <h2 className="text-2xl font-bold">4. Managing Cookies</h2>
                  <p className="text-muted-foreground">
                    You can control and/or delete cookies as you wish. You can delete all cookies that are already on your computer and you can set most browsers to prevent them from being placed. If you do this, however, you may have to manually adjust some preferences every time you visit our site.
                  </p>
                </section>

                <section className="space-y-4">
                  <h2 className="text-2xl font-bold">5. Changes to This Policy</h2>
                  <p className="text-muted-foreground">
                    We may update this Cookie Policy from time to time. We will notify you of any changes by posting the new Cookie Policy on this page.
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