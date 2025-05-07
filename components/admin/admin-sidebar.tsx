"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from "lucide-react"

interface SidebarItem {
  title: string
  icon: React.ReactNode
  href: string
  submenu?: { title: string; href: string }[]
}

export default function AdminSidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  const sidebarItems: SidebarItem[] = [
    {
      title: "Dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
      href: "/admin",
    },
    {
      title: "Products",
      icon: <Package className="h-5 w-5" />,
      href: "/admin/products",
      submenu: [
        { title: "All Products", href: "/admin/products" },
        { title: "Add Product", href: "/admin/products/new" },
        { title: "Categories", href: "/admin/products/categories" },
      ],
    }
  ]

  return (
    <div className={cn("relative flex flex-col border-r bg-background h-screen", collapsed ? "w-16" : "w-64")}>
      <div className="flex h-14 items-center px-4 border-b">
        {!collapsed && (
          <Link href="/admin" className="flex items-center gap-2 font-semibold">
            <Package className="h-6 w-6" />
            <span>PetPals Admin</span>
          </Link>
        )}
        {collapsed && (
          <Link href="/admin" className="flex items-center mx-auto">
            <Package className="h-6 w-6" />
          </Link>
        )}
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="absolute -right-3 top-16 h-6 w-6 rounded-full border bg-background"
        onClick={() => setCollapsed(!collapsed)}
      >
        {collapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
        <span className="sr-only">Toggle Sidebar</span>
      </Button>
      <ScrollArea className="flex-1 py-4">
        <nav className="grid gap-1 px-2">
          {sidebarItems.map((item, index) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)

            return (
              <div key={index}>
                <Link href={item.href}>
                  <Button
                    variant={isActive ? "secondary" : "ghost"}
                    className={cn("w-full justify-start", collapsed ? "px-2" : "px-4")}
                  >
                    {item.icon}
                    {!collapsed && <span className="ml-2">{item.title}</span>}
                  </Button>
                </Link>

                {!collapsed && item.submenu && isActive && (
                  <div className="ml-6 mt-1 grid gap-1">
                    {item.submenu.map((subitem, subindex) => {
                      const isSubActive = pathname === subitem.href

                      return (
                        <Link key={subindex} href={subitem.href}>
                          <Button
                            variant={isSubActive ? "secondary" : "ghost"}
                            size="sm"
                            className="w-full justify-start"
                          >
                            {subitem.title}
                          </Button>
                        </Link>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </nav>
      </ScrollArea>
      <div className="border-t p-4">
        <Button variant="ghost" className={cn("w-full justify-start", collapsed ? "px-2" : "px-4")}>
          <LogOut className="h-5 w-5" />
          {!collapsed && <span className="ml-2">Logout</span>}
        </Button>
      </div>
    </div>
  )
}
