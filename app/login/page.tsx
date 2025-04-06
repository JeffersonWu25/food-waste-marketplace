"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { supabase } from "@/lib/supabase"
import { toast } from "sonner"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      console.log("Attempting to sign in with:", { email: email.trim() })

      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      })

      if (authError) {
        console.error("Auth error details:", {
          message: authError.message,
          status: authError.status,
          name: authError.name
        })
        toast.error(authError.message)
        setIsLoading(false)
        return
      }

      if (!authData.user) {
        console.error("No user data returned")
        toast.error("Failed to sign in")
        setIsLoading(false)
        return
      }

      // Check if user exists in Stores table
      const { data: storeData, error: storeError } = await supabase
        .from('Stores')
        .select('id')
        .eq('id', authData.user.id)
        .single()

      if (storeError && storeError.code !== 'PGRST116') { // PGRST116 is "no rows returned"
        console.error("Error checking store table:", storeError)
        toast.error("Error checking user type")
        setIsLoading(false)
        return
      }

      // If user is in Stores table, redirect to store dashboard
      if (storeData) {
        router.push('/dashboard/store')
        return
      }

      // Check if user exists in Farms table
      const { data: farmData, error: farmError } = await supabase
        .from('Farms')
        .select('id')
        .eq('id', authData.user.id)
        .single()

      if (farmError && farmError.code !== 'PGRST116') {
        console.error("Error checking farm table:", farmError)
        toast.error("Error checking user type")
        setIsLoading(false)
        return
      }

      // If user is in Farms table, redirect to farmer dashboard
      if (farmData) {
        router.push('/dashboard/farmer')
        return
      }

      // If user is not in either table, show error
      console.error("User not found in any table")
      toast.error("Invalid account type")
      setIsLoading(false)
    } catch (error) {
      console.error("Login error details:", error)
      if (error instanceof Error) {
        console.error("Error stack:", error.stack)
      }
      toast.error("An unexpected error occurred")
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex flex-1 flex-col justify-center items-center p-4 md:p-8">
        <Link href="/" className="mb-8 flex items-center gap-2 text-xl font-bold">
          FarmConnect
        </Link>
        <div className="mx-auto w-full max-w-md space-y-6">
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold">Welcome back</h1>
            <p className="text-muted-foreground">Enter your credentials to access your account</p>
          </div>
          <Tabs defaultValue="email" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="email">Email</TabsTrigger>
              <TabsTrigger value="phone">Phone</TabsTrigger>
            </TabsList>
            <TabsContent value="email">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                      Forgot password?
                    </Link>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Signing in..." : "Sign In"}
                </Button>
              </form>
            </TabsContent>
            <TabsContent value="phone">
              <form className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" type="tel" placeholder="(555) 555-5555" required />
                </div>
                <Button type="submit" className="w-full">
                  Send Code
                </Button>
              </form>
            </TabsContent>
          </Tabs>
          <div className="text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-primary hover:underline">
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

