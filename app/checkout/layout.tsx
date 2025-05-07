import type React from "react"
import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export const metadata: Metadata = {
  title: "Checkout - PetPals Shop",
  description: "Complete your purchase",
}

export default function CheckoutLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Link href="/cart" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Cart
        </Link>
      </div>

      <div className="flex justify-center mb-8">
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-2xl font-bold">PetPals</span>
        </Link>
      </div>

      {children}
    </div>
  )
}
