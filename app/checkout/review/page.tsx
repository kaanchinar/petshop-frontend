"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import CheckoutProgress from "@/components/checkout/checkout-progress"
import OrderSummary from "@/components/checkout/order-summary"
import { useCheckout } from "@/context/checkout-context"
import { useCart } from "@/context/cart-context"
import { CreditCard, MapPin, Wallet, Loader2 } from "lucide-react"
import { usePostApiOrders } from "@/lib/api/orders/orders"
import type { CreateOrderDto } from "@/lib/api/petPetAPI.schemas"

export default function ReviewPage() {
  const router = useRouter()
  const { shippingInfo, billingInfo, paymentInfo } = useCheckout()
  const { items } = useCart()
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const createOrderMutation = usePostApiOrders()

  // Ensure all required info is available
  if (!shippingInfo || !paymentInfo || items.length === 0) {
    router.push("/checkout")
    return null
  }

  const handlePlaceOrder = async () => {
    setIsSubmitting(true)
    
    try {
      // Create the order DTO
      const orderData: CreateOrderDto = {
        shippingAddress: `${shippingInfo.firstName} ${shippingInfo.lastName}\n${shippingInfo.address}\n${shippingInfo.city}, ${shippingInfo.state} ${shippingInfo.zipCode}\n${shippingInfo.country}`,
        notes: `Payment Method: ${paymentInfo.paymentMethod}${paymentInfo.paymentMethod === 'credit-card' ? ` (****${paymentInfo.cardNumber?.slice(-4)})` : ''}`
      }

      console.log('Creating order with data:', orderData)
      
      // Create the order
      const response = await createOrderMutation.mutateAsync({ data: orderData })
      
      console.log('Order created successfully:', response)
      
      // Store the real order ID for confirmation page
      sessionStorage.setItem('recentOrderId', response.data?.id?.toString() || '')
      
      // Navigate to confirmation
      router.push("/checkout/confirmation")
      
    } catch (error) {
      console.error('Failed to create order:', error)
      // TODO: Show error message to user
      alert('Failed to create order. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div>
      <CheckoutProgress currentStep="review" />

      <div className="grid md:grid-cols-3 gap-8 mt-8">
        <div className="md:col-span-2">
          <div className="bg-white rounded-lg border p-6 space-y-6">
            <h2 className="text-xl font-bold">Review Your Order</h2>

            {/* Shipping Information */}
            <div className="border-b pb-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold flex items-center">
                  <MapPin className="mr-2 h-4 w-4" />
                  Shipping Information
                </h3>
                <Button variant="ghost" size="sm" className="text-sm" onClick={() => router.push("/checkout/shipping")}>
                  Edit
                </Button>
              </div>
              <div className="text-sm">
                <p>
                  {shippingInfo.firstName} {shippingInfo.lastName}
                </p>
                <p>{shippingInfo.address}</p>
                <p>
                  {shippingInfo.city}, {shippingInfo.state} {shippingInfo.zipCode}
                </p>
                <p>{shippingInfo.country}</p>
                <p>
                  {shippingInfo.email} | {shippingInfo.phone}
                </p>
              </div>
            </div>

            {/* Billing Information */}
            {billingInfo && (
              <div className="border-b pb-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold flex items-center">
                    <MapPin className="mr-2 h-4 w-4" />
                    Billing Information
                  </h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-sm"
                    onClick={() => router.push("/checkout/billing")}
                  >
                    Edit
                  </Button>
                </div>
                <div className="text-sm">
                  <p>
                    {billingInfo.firstName} {billingInfo.lastName}
                  </p>
                  <p>{billingInfo.address}</p>
                  <p>
                    {billingInfo.city}, {billingInfo.state} {billingInfo.zipCode}
                  </p>
                  <p>{billingInfo.country}</p>
                </div>
              </div>
            )}

            {/* Payment Method */}
            <div className="border-b pb-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold flex items-center">
                  {paymentInfo.paymentMethod === "credit-card" ? (
                    <CreditCard className="mr-2 h-4 w-4" />
                  ) : (
                    <Wallet className="mr-2 h-4 w-4" />
                  )}
                  Payment Method
                </h3>
                <Button variant="ghost" size="sm" className="text-sm" onClick={() => router.push("/checkout/payment")}>
                  Edit
                </Button>
              </div>
              <div className="text-sm">
                {paymentInfo.paymentMethod === "credit-card" ? (
                  <p>Credit Card ending in {paymentInfo.cardNumber?.slice(-4) || "****"}</p>
                ) : (
                  <p>PayPal</p>
                )}
              </div>
            </div>

            {/* Order Items */}
            <div>
              <h3 className="font-semibold mb-2">Order Items</h3>
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
            </div>

            <div className="flex justify-between pt-4">
              <Button type="button" variant="outline" onClick={() => router.push("/checkout/payment")} disabled={isSubmitting}>
                Back
              </Button>
              <Button onClick={handlePlaceOrder} disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Order...
                  </>
                ) : (
                  'Place Order'
                )}
              </Button>
            </div>
          </div>
        </div>

        <div className="md:col-span-1">
          <OrderSummary showPlaceOrderButton={false} />
        </div>
      </div>
    </div>
  )
}
