"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { useCart } from "@/context/cart-context"

export default function CheckoutRedirect() {
  const router = useRouter()
  const { items } = useCart()

  useEffect(() => {
    // If cart is empty, redirect to cart page
    if (items.length === 0) {
      router.push("/cart")
    } else {
      // Otherwise, redirect to the first step of checkout
      router.push("/checkout/shipping")
    }
  }, [items, router])

  return (
    <div className="flex justify-center items-center py-12">
      <div className="animate-pulse">Loading checkout...</div>
    </div>
  )
}
