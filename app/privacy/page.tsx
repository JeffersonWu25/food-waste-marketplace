import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function PrivacyPage() {
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
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Privacy Policy</h1>
              <p className="text-muted-foreground">Last updated: April 5, 2024</p>
              
              <div className="space-y-6">
                <section className="space-y-4">
                  <h2 className="text-2xl font-bold">1. Information We Collect</h2>
                  <p className="text-muted-foreground">
                    We collect information that you provide directly to us, including:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    <li>Account information (name, email, password)</li>
                    <li>Profile information (business type, location, preferences)</li>
                    <li>Communication data (messages, feedback)</li>
                    <li>Transaction information</li>
                  </ul>
                </section>

                <section className="space-y-4">
                  <h2 className="text-2xl font-bold">2. How We Use Your Information</h2>
                  <p className="text-muted-foreground">
                    We use the information we collect to:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    <li>Provide and maintain our services</li>
                    <li>Process your transactions</li>
                    <li>Send you important updates and notifications</li>
                    <li>Improve our services and user experience</li>
                    <li>Comply with legal obligations</li>
                  </ul>
                </section>

                <section className="space-y-4">
                  <h2 className="text-2xl font-bold">3. Information Sharing</h2>
                  <p className="text-muted-foreground">
                    We do not sell your personal information. We may share your information with:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    <li>Service providers who assist in our operations</li>
                    <li>Other users as necessary for the service (e.g., for transactions)</li>
                    <li>Law enforcement when required by law</li>
                  </ul>
                </section>

                <section className="space-y-4">
                  <h2 className="text-2xl font-bold">4. Data Security</h2>
                  <p className="text-muted-foreground">
                    We implement appropriate security measures to protect your personal information. However, no method of transmission over the internet is 100% secure.
                  </p>
                </section>

                <section className="space-y-4">
                  <h2 className="text-2xl font-bold">5. Your Rights</h2>
                  <p className="text-muted-foreground">
                    You have the right to:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    <li>Access your personal information</li>
                    <li>Correct inaccurate information</li>
                    <li>Request deletion of your information</li>
                    <li>Opt-out of marketing communications</li>
                  </ul>
                </section>

                <section className="space-y-4">
                  <h2 className="text-2xl font-bold">6. Contact Us</h2>
                  <p className="text-muted-foreground">
                    If you have any questions about this Privacy Policy, please contact us at privacy@farmconnect.com
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