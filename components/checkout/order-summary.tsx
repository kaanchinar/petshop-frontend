"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useCart } from "@/context/cart-context"

interface OrderSummaryProps {
  showPlaceOrderButton?: boolean
}

export default function OrderSummary({ showPlaceOrderButton = false }: OrderSummaryProps) {
  const router = useRouter()
  const { items, subtotal } = useCart()

  // Calculate shipping cost (free over $50)
  const shippingCost = subtotal >= 50 ? 0 : 5.99

  // Calculate tax (8.25%)
  const taxRate = 0.0825
  const taxAmount = subtotal * taxRate

  // Calculate total
  const total = subtotal + shippingCost + taxAmount

  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Order Items */}
        <div className="space-y-2">
          {items.map((item) => (
            <div key={item.id} className="flex justify-between text-sm">
              <span>
                {item.quantity} x {item.name}
              </span>
              <span>${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
        </div>

        <div className="border-t pt-4 space-y-2">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Shipping</span>
            {shippingCost === 0 ? (
              <span className="text-green-600">Free</span>
            ) : (
              <span>${shippingCost.toFixed(2)}</span>
            )}
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Tax (8.25%)</span>
            <span>${taxAmount.toFixed(2)}</span>
          </div>
          <div className="border-t pt-2 flex justify-between font-medium text-lg">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
      </CardContent>
      {showPlaceOrderButton && (
        <CardFooter>
          <Button className="w-full" onClick={() => router.push("/checkout/review")}>
            Place Order
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}
