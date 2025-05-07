"use client"

import { usePathname } from "next/navigation"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

type CheckoutStep = "shipping" | "billing" | "payment" | "review" | "confirmation"

interface CheckoutProgressProps {
  currentStep: CheckoutStep
}

export default function CheckoutProgress({ currentStep }: CheckoutProgressProps) {
  const pathname = usePathname()

  const steps = [
    { id: "shipping", name: "Shipping" },
    { id: "billing", name: "Billing", optional: true },
    { id: "payment", name: "Payment" },
    { id: "review", name: "Review" },
  ]

  // Determine if billing step should be shown
  // If we're past shipping and didn't go to billing, skip it
  const showBillingStep =
    currentStep === "billing" ||
    pathname.includes("/billing") ||
    steps.findIndex((step) => step.id === currentStep) < steps.findIndex((step) => step.id === "billing")

  const filteredSteps = steps.filter((step) => step.id !== "billing" || showBillingStep)

  const getStepStatus = (stepId: string) => {
    const currentStepIndex = steps.findIndex((step) => step.id === currentStep)
    const stepIndex = steps.findIndex((step) => step.id === stepId)

    if (stepIndex < currentStepIndex) {
      return "complete"
    } else if (stepIndex === currentStepIndex) {
      return "current"
    } else {
      return "upcoming"
    }
  }

  return (
    <nav aria-label="Progress">
      <ol className="flex items-center">
        {filteredSteps.map((step, stepIdx) => (
          <li
            key={step.id}
            className={cn(
              "relative flex items-center",
              stepIdx !== filteredSteps.length - 1 ? "w-full" : "",
              stepIdx !== 0 ? "ml-6" : "",
            )}
          >
            {getStepStatus(step.id) === "complete" ? (
              <div className="group flex items-center">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary">
                  <Check className="h-5 w-5 text-primary-foreground" aria-hidden="true" />
                  <span className="sr-only">{step.name}</span>
                </span>
                <span className="ml-3 text-sm font-medium text-foreground">{step.name}</span>
              </div>
            ) : getStepStatus(step.id) === "current" ? (
              <div className="flex items-center" aria-current="step">
                <span
                  className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-primary"
                  aria-hidden="true"
                >
                  <span className="text-primary font-medium">{stepIdx + 1}</span>
                </span>
                <span className="ml-3 text-sm font-medium text-primary">{step.name}</span>
              </div>
            ) : (
              <div className="group flex items-center">
                <span
                  className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-muted-foreground/30"
                  aria-hidden="true"
                >
                  <span className="text-muted-foreground">{stepIdx + 1}</span>
                </span>
                <span className="ml-3 text-sm font-medium text-muted-foreground">{step.name}</span>
              </div>
            )}

            {stepIdx !== filteredSteps.length - 1 && (
              <div className="absolute right-0 top-4 hidden w-full md:flex">
                <div
                  className={cn(
                    "h-0.5 w-full",
                    getStepStatus(step.id) === "complete" ? "bg-primary" : "bg-muted-foreground/30",
                  )}
                />
              </div>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
