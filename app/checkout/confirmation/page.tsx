"use client"

import { useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react"
import { useCart } from "@/context/cart-context"
import { useCheckout } from "@/context/checkout-context"

export default function ConfirmationPage() {
  const { clearCart } = useCart()
  const { resetCheckout } = useCheckout()

  // Generate a random order number
  const orderNumber = Math.floor(100000000 + Math.random() * 900000000)

  // Clear cart and checkout info after order is placed
  useEffect(() => {
    // Use a flag to ensure this only runs once
    const isFirstRender = true

    if (isFirstRender) {
      clearCart()
      resetCheckout()
    }

    // Empty dependency array ensures this effect runs only once
  }, [])

  return (
    <div className="max-w-2xl mx-auto text-center py-12">
      <CheckCircle className="h-16 w-16 text-primary mx-auto mb-6" />

      <h1 className="text-3xl font-bold mb-4">Thank You for Your Order!</h1>

      <p className="text-muted-foreground mb-8">
        Your order has been placed and is being processed. You will receive an email confirmation shortly.
      </p>

      <div className="bg-muted p-6 rounded-lg mb-8">
        <h2 className="text-xl font-bold mb-4">Order Summary</h2>
        <p className="text-lg mb-2">
          Order Number: <span className="font-semibold">{orderNumber}</span>
        </p>
        <p className="text-sm text-muted-foreground">A confirmation email has been sent to your email address.</p>
      </div>

      <div className="flex flex-col sm:flex-row justify-center gap-4">
        <Button asChild size="lg">
          <Link href="/">Return to Home</Link>
        </Button>
        <Button variant="outline" asChild size="lg">
          <Link href="/shop">Continue Shopping</Link>
        </Button>
      </div>
    </div>
  )
}
