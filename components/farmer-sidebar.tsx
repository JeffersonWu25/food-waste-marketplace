"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Search, ShoppingCart, Calendar, Settings, MessageSquare, User, BarChart3, PiggyBank } from "lucide-react"

export function FarmerSidebar() {
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
              href="/dashboard/farmer"
              className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
                isActive("/dashboard/farmer")
                  ? "bg-muted text-primary"
                  : "text-muted-foreground hover:text-primary hover:bg-muted"
              }`}
            >
              <Home className="h-4 w-4" />
              Dashboard
            </Link>
            <Link
              href="/dashboard/farmer/search"
              className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
                isActive("/dashboard/farmer/search")
                  ? "bg-muted text-primary"
                  : "text-muted-foreground hover:text-primary hover:bg-muted"
              }`}
            >
              <Search className="h-4 w-4" />
              Search Listings
            </Link>
            <Link
              href="/dashboard/farmer/livestock"
              className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
                isActive("/dashboard/farmer/livestock")
                  ? "bg-muted text-primary"
                  : "text-muted-foreground hover:text-primary hover:bg-muted"
              }`}
            >
              <PiggyBank className="h-4 w-4" />
              Livestock Inventory
            </Link>
            <Link
              href="/dashboard/farmer/orders"
              className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
                isActive("/dashboard/farmer/orders")
                  ? "bg-muted text-primary"
                  : "text-muted-foreground hover:text-primary hover:bg-muted"
              }`}
            >
              <ShoppingCart className="h-4 w-4" />
              My Orders
            </Link>
            <Link
              href="/dashboard/farmer/pickups"
              className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
                isActive("/dashboard/farmer/pickups")
                  ? "bg-muted text-primary"
                  : "text-muted-foreground hover:text-primary hover:bg-muted"
              }`}
            >
              <Calendar className="h-4 w-4" />
              Scheduled Pickups
            </Link>
            <Link
              href="/dashboard/farmer/messages"
              className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
                isActive("/dashboard/farmer/messages")
                  ? "bg-muted text-primary"
                  : "text-muted-foreground hover:text-primary hover:bg-muted"
              }`}
            >
              <MessageSquare className="h-4 w-4" />
              Messages
            </Link>
            <Link
              href="/dashboard/farmer/analytics"
              className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
                isActive("/dashboard/farmer/analytics")
                  ? "bg-muted text-primary"
                  : "text-muted-foreground hover:text-primary hover:bg-muted"
              }`}
            >
              <BarChart3 className="h-4 w-4" />
              Analytics
            </Link>
            <Link
              href="/dashboard/farmer/profile"
              className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
                isActive("/dashboard/farmer/profile")
                  ? "bg-muted text-primary"
                  : "text-muted-foreground hover:text-primary hover:bg-muted"
              }`}
            >
              <User className="h-4 w-4" />
              Profile
            </Link>
            <Link
              href="/dashboard/farmer/settings"
              className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
                isActive("/dashboard/farmer/settings")
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

