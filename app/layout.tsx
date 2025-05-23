import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { CartProvider } from "@/context/cart-context"
import { CheckoutProvider } from "@/context/checkout-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "PetPals Shop",
  description: "Your one-stop shop for all pet needs",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <CartProvider>
          <CheckoutProvider>
            <div className="flex flex-col min-h-screen">
              <Header />
              <main className="flex-grow">{children}</main>
              <Footer />
            </div>
          </CheckoutProvider>
        </CartProvider>
      </body>
    </html>
  )
}
