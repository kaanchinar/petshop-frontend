"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import CheckoutProgress from "@/components/checkout/checkout-progress"
import OrderSummary from "@/components/checkout/order-summary"
import { useCheckout } from "@/context/checkout-context"
import { CreditCard, Wallet } from "lucide-react"

const paymentSchema = z
  .object({
    paymentMethod: z.enum(["credit-card", "paypal"]),
    cardNumber: z
      .string()
      .optional()
      .refine((val) => !val || val.replace(/\s/g, "").length === 16, { message: "Card number must be 16 digits" }),
    cardName: z
      .string()
      .optional()
      .refine((val) => !val || val.length >= 3, { message: "Cardholder name must be at least 3 characters" }),
    expiryMonth: z.string().optional(),
    expiryYear: z.string().optional(),
    cvv: z
      .string()
      .optional()
      .refine((val) => !val || (val.length >= 3 && val.length <= 4), { message: "CVV must be 3 or 4 digits" }),
  })
  .refine(
    (data) => {
      // If payment method is credit card, validate credit card fields
      if (data.paymentMethod === "credit-card") {
        return !!data.cardNumber && !!data.cardName && !!data.expiryMonth && !!data.expiryYear && !!data.cvv
      }
      return true
    },
    {
      message: "Please fill in all credit card details",
      path: ["paymentMethod"],
    },
  )

export default function PaymentPage() {
  const router = useRouter()
  const { paymentInfo, setPaymentInfo } = useCheckout()
  const [showCardFields, setShowCardFields] = useState(paymentInfo?.paymentMethod === "credit-card")

  const form = useForm<z.infer<typeof paymentSchema>>({
    resolver: zodResolver(paymentSchema),
    defaultValues: paymentInfo || {
      paymentMethod: "credit-card",
      cardNumber: "",
      cardName: "",
      expiryMonth: "",
      expiryYear: "",
      cvv: "",
    },
  })

  function onSubmit(values: z.infer<typeof paymentSchema>) {
    // Save payment info to context
    setPaymentInfo(values)

    // Navigate to next step
    router.push("/checkout/review")
  }

  return (
    <div>
      <CheckoutProgress currentStep="payment" />

      <div className="grid md:grid-cols-3 gap-8 mt-8">
        <div className="md:col-span-2">
          <div className="bg-white rounded-lg border p-6">
            <h2 className="text-xl font-bold mb-6">Payment Method</h2>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="paymentMethod"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Select Payment Method</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={(value) => {
                            field.onChange(value)
                            setShowCardFields(value === "credit-card")
                          }}
                          defaultValue={field.value}
                          className="flex flex-col space-y-3"
                        >
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="credit-card" />
                            </FormControl>
                            <FormLabel className="font-normal cursor-pointer flex items-center">
                              <CreditCard className="mr-2 h-5 w-5" />
                              Credit or Debit Card
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="paypal" />
                            </FormControl>
                            <FormLabel className="font-normal cursor-pointer flex items-center">
                              <Wallet className="mr-2 h-5 w-5" />
                              PayPal
                            </FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {showCardFields && (
                  <div className="space-y-4 border-t pt-4">
                    <FormField
                      control={form.control}
                      name="cardNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Card Number</FormLabel>
                          <FormControl>
                            <Input placeholder="1234 5678 9012 3456" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="cardName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Cardholder Name</FormLabel>
                          <FormControl>
                            <Input placeholder="John Doe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-3 gap-4">
                      <FormField
                        control={form.control}
                        name="expiryMonth"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Expiry Month</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="MM" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {Array.from({ length: 12 }, (_, i) => {
                                  const month = (i + 1).toString().padStart(2, "0")
                                  return (
                                    <SelectItem key={month} value={month}>
                                      {month}
                                    </SelectItem>
                                  )
                                })}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="expiryYear"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Expiry Year</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="YY" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {Array.from({ length: 10 }, (_, i) => {
                                  const year = (new Date().getFullYear() + i).toString().slice(-2)
                                  return (
                                    <SelectItem key={year} value={year}>
                                      {year}
                                    </SelectItem>
                                  )
                                })}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="cvv"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>CVV</FormLabel>
                            <FormControl>
                              <Input placeholder="123" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                )}

                <div className="flex justify-between">
                  <Button type="button" variant="outline" onClick={() => router.push("/checkout/billing")}>
                    Back
                  </Button>
                  <Button type="submit">Continue to Review</Button>
                </div>
              </form>
            </Form>
          </div>
        </div>

        <div className="md:col-span-1">
          <OrderSummary />
        </div>
      </div>
    </div>
  )
}
