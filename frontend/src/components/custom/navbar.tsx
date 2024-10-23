"use client"

import { useState } from "react"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"
import { useAuth } from "../context/auth.context"

export default function TopNavBar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const logout = useAuth().logout

  const navItems = [
    { name: "Dashboard", href: "#dashboard" },
    { name: "Courses", href: "#courses" },
    { name: "Students", href: "#students" },
    { name: "Faculty", href: "#faculty" },
    { name: "Schedule", href: "#schedule" },
    { name: "Reports", href: "#reports" },
  ]

  return (
    <nav className="bg-background border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <span className="text-2xl font-bold text-primary">CourseMind</span>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                {navItems.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="text-gray-500 hover:bg-accent hover:text-accent-foreground px-3 py-2 rounded-md text-sm font-medium"
                  >
                    {item.name}
                  </a>
                ))}
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6">
              <Button variant="ghost" onClick={logout}>
                Logout
              </Button>
            </div>
          </div>
          <div className="md:hidden">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" aria-hidden="true" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                  {navItems.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      className="text-gray-500 hover:bg-accent hover:text-accent-foreground block px-3 py-2 rounded-md text-base font-medium"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.name}
                    </a>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  )
}