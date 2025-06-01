"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ShoppingCart, Menu, X, Search, User, Package, Star } from "lucide-react"
import { cn } from "@/lib/utils"
import { useCart } from "@/context/cart-context"
import { useAuth } from "@/context/auth-context"
import CartDrawer from "@/components/cart/cart-drawer"
import { Input } from "@/components/ui/input" // Added for search

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false) // State for mobile search
  const pathname = usePathname()
  const { itemCount, setIsOpen: setCartOpen } = useCart() // Renamed setIsOpen to avoid conflict
  const { user, isAuthenticated, logout } = useAuth()

  const routes = [
    { name: "Home", path: "/" },
    { name: "Shop", path: "/shop" },
    { name: "About", path: "/about" },
    // { name: "Contact", path: "#" }, // Example: Can be added back if needed
    // { name: "Blog", path: "#" },
  ]

  const isActive = (path: string) => {
    if (path === "/") {
      return pathname === path
    }
    // For /shop, make it active for /shop/* as well
    return pathname.startsWith(path)
  }

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)
  const closeMenu = () => setIsMenuOpen(false)
  const toggleSearch = () => setIsSearchOpen(!isSearchOpen)

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center">
            {/* Logo */}
            <Link href="/" className="mr-6 flex items-center space-x-2" onClick={closeMenu}>
              {/* <PawPrint className="h-6 w-6 text-primary" /> Replace with your actual logo if you have one */}
              <span className="text-2xl font-bold">PetPals</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex flex-1 items-center space-x-6">
              {routes.map((route) => (
                <Link
                  key={route.path}
                  href={route.path}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-primary",
                    isActive(route.path) ? "text-primary" : "text-muted-foreground",
                  )}
                >
                  {route.name}
                </Link>
              ))}
            </nav>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center space-x-2">
              {/* Desktop Search - can be a button opening a modal or a small input */}
              <div className="relative hidden lg:block">
                <Input
                  type="search"
                  placeholder="Search products..."
                  className="h-9 w-full rounded-md pl-8 md:w-[200px] lg:w-[250px]"
                />
                <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              </div>
               <Button variant="ghost" size="icon" className="lg:hidden" onClick={toggleSearch}>
                <Search className="h-5 w-5" />
                <span className="sr-only">Search</span>
              </Button>
              
              {/* User Account Button/Dropdown */}
              {isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <User className="h-5 w-5" />
                      <span className="sr-only">Account menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>
                      My Account
                      {user?.email && (
                        <div className="text-xs text-muted-foreground font-normal">
                          {user.email}
                        </div>
                      )}
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/profile">Profile</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/orders">My Orders</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/profile/reviews">My Reviews</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={logout}>
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button variant="ghost" size="icon" asChild>
                  <Link href="/sign-in">
                    <User className="h-5 w-5" />
                    <span className="sr-only">Sign In</span>
                  </Link>
                </Button>
              )}
              <Button variant="ghost" size="icon" onClick={() => setCartOpen(true)} className="relative">
                <ShoppingCart className="h-5 w-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
                <span className="sr-only">Cart</span>
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <div className="ml-auto flex items-center md:hidden">
              <Button variant="ghost" size="icon" onClick={toggleSearch} className="mr-2">
                <Search className="h-5 w-5" />
                <span className="sr-only">Search</span>
              </Button>
              <Button variant="ghost" size="icon" onClick={() => setCartOpen(true)} className="relative mr-2">
                <ShoppingCart className="h-5 w-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
                <span className="sr-only">Cart</span>
              </Button>
              <Button variant="ghost" size="icon" onClick={toggleMenu}>
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                <span className="sr-only">Toggle menu</span>
              </Button>
            </div>
          </div>
          {/* Mobile Search Bar */}
          {isSearchOpen && (
            <div className="md:hidden py-2 border-t">
              <div className="container mx-auto px-4">
                <div className="relative">
                  <Input
                    type="search"
                    placeholder="Search products..."
                    className="h-10 w-full rounded-md pl-10"
                  />
                  <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Mobile Menu Panel */}
        {isMenuOpen && (
          <div className="md:hidden border-t bg-background">
            <div className="container mx-auto px-4 py-4 space-y-2">
              <nav className="flex flex-col space-y-2">
                {routes.map((route) => (
                  <Link
                    key={route.path}
                    href={route.path}
                    className={cn(
                      "block rounded-md px-3 py-2 text-base font-medium hover:bg-accent hover:text-accent-foreground",
                      isActive(route.path) ? "bg-accent text-accent-foreground" : "text-muted-foreground",
                    )}
                    onClick={closeMenu}
                  >
                    {route.name}
                  </Link>
                ))}
              </nav>
              <div className="border-t pt-4 mt-4 space-y-2">
                {isAuthenticated ? (
                  <>
                    <div className="px-3 py-2">
                      <p className="text-sm font-medium">
                        {user?.firstName || user?.email}
                      </p>
                      {user?.email && (
                        <p className="text-xs text-muted-foreground">
                          {user.email}
                        </p>
                      )}
                    </div>
                    <Link
                      href="/profile"
                      className={cn(
                        "flex items-center rounded-md px-3 py-2 text-base font-medium hover:bg-accent hover:text-accent-foreground text-muted-foreground"
                      )}
                      onClick={closeMenu}
                    >
                      <User className="mr-2 h-5 w-5" />
                      Profile
                    </Link>
                    <Link
                      href="/orders"
                      className={cn(
                        "flex items-center rounded-md px-3 py-2 text-base font-medium hover:bg-accent hover:text-accent-foreground text-muted-foreground"
                      )}
                      onClick={closeMenu}
                    >
                      <Package className="mr-2 h-5 w-5" />
                      My Orders
                    </Link>
                    <Link
                      href="/profile/reviews"
                      className={cn(
                        "flex items-center rounded-md px-3 py-2 text-base font-medium hover:bg-accent hover:text-accent-foreground text-muted-foreground"
                      )}
                      onClick={closeMenu}
                    >
                      <Star className="mr-2 h-5 w-5" />
                      My Reviews
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        closeMenu();
                      }}
                      className={cn(
                        "flex items-center rounded-md px-3 py-2 text-base font-medium hover:bg-accent hover:text-accent-foreground text-muted-foreground w-full text-left"
                      )}
                    >
                      <User className="mr-2 h-5 w-5" />
                      Sign Out
                    </button>
                  </>
                ) : (
                  <Link
                    href="/sign-in"
                    className={cn(
                      "flex items-center rounded-md px-3 py-2 text-base font-medium hover:bg-accent hover:text-accent-foreground text-muted-foreground"
                    )}
                    onClick={closeMenu}
                  >
                    <User className="mr-2 h-5 w-5" />
                    Sign In
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </header>

      <CartDrawer />
    </>
  )
}
