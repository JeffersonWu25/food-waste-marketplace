"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, ShoppingBag, Tag, Calendar, Settings, MessageSquare, User, BarChart3, Calculator } from "lucide-react"

export function StoreSidebar() {
  const pathname = usePathname()

  const isActive = (path: string) => {
    return pathname === path
  }

  return (
    <div className="hidden border-r bg-muted/40 lg:block w-64">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex-1 overflow-auto py-2">
          <nav className="grid items-start px-4 text-sm font-medium">
            <Link
              href="/dashboard/store"
              className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
                isActive("/dashboard/store")
                  ? "bg-muted text-primary"
                  : "text-muted-foreground hover:text-primary hover:bg-muted"
              }`}
            >
              <Home className="h-4 w-4" />
              Dashboard
            </Link>
            <Link
              href="/dashboard/store/inventory"
              className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
                isActive("/dashboard/store/inventory")
                  ? "bg-muted text-primary"
                  : "text-muted-foreground hover:text-primary hover:bg-muted"
              }`}
            >
              <ShoppingBag className="h-4 w-4" />
              Grocery Inventory
            </Link>
            <Link
              href="/dashboard/store/calculator"
              className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
                isActive("/dashboard/store/calculator")
                  ? "bg-muted text-primary"
                  : "text-muted-foreground hover:text-primary hover:bg-muted"
              }`}
            >
              <Calculator className="h-4 w-4" />
              Feed Calculator
            </Link>
            <Link
              href="/dashboard/store/listings"
              className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
                isActive("/dashboard/store/listings")
                  ? "bg-muted text-primary"
                  : "text-muted-foreground hover:text-primary hover:bg-muted"
              }`}
            >
              <Tag className="h-4 w-4" />
              My Listings
            </Link>
            <Link
              href="/dashboard/store/pickups"
              className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
                isActive("/dashboard/store/pickups")
                  ? "bg-muted text-primary"
                  : "text-muted-foreground hover:text-primary hover:bg-muted"
              }`}
            >
              <Calendar className="h-4 w-4" />
              Scheduled Pickups
            </Link>
            <Link
              href="/dashboard/store/messages"
              className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
                isActive("/dashboard/store/messages")
                  ? "bg-muted text-primary"
                  : "text-muted-foreground hover:text-primary hover:bg-muted"
              }`}
            >
              <MessageSquare className="h-4 w-4" />
              Messages
            </Link>
            <Link
              href="/dashboard/store/analytics"
              className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
                isActive("/dashboard/store/analytics")
                  ? "bg-muted text-primary"
                  : "text-muted-foreground hover:text-primary hover:bg-muted"
              }`}
            >
              <BarChart3 className="h-4 w-4" />
              Analytics
            </Link>
            <Link
              href="/dashboard/store/profile"
              className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
                isActive("/dashboard/store/profile")
                  ? "bg-muted text-primary"
                  : "text-muted-foreground hover:text-primary hover:bg-muted"
              }`}
            >
              <User className="h-4 w-4" />
              Profile
            </Link>
            <Link
              href="/dashboard/store/settings"
              className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
                isActive("/dashboard/store/settings")
                  ? "bg-muted text-primary"
                  : "text-muted-foreground hover:text-primary hover:bg-muted"
              }`}
            >
              <Settings className="h-4 w-4" />
              Settings
            </Link>
          </nav>
        </div>
      </div>
    </div>
  )
}

