"use client"

import type React from "react"
import { createContext, useContext, useState, useCallback, useEffect } from "react" // Added useEffect

interface ShippingInfo {
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  zipCode: string
  country: string
}

interface BillingInfo {
  firstName: string
  lastName: string
  address: string
  city: string
  state: string
  zipCode: string
  country: string
}

interface PaymentInfo {
  paymentMethod: "credit-card" | "paypal"
  cardNumber?: string
  cardName?: string
  expiryMonth?: string
  expiryYear?: string
  cvv?: string
}

interface CheckoutContextType {
  shippingInfo: ShippingInfo | null
  billingInfo: BillingInfo | null
  paymentInfo: PaymentInfo | null
  setShippingInfo: (info: ShippingInfo | null) => void // Allow null for clearing
  setBillingInfo: (info: BillingInfo | null) => void // Allow null for clearing
  setPaymentInfo: (info: PaymentInfo | null) => void // Allow null for clearing
  resetCheckout: () => void
}

const CheckoutContext = createContext<CheckoutContextType | undefined>(undefined)

const SHIPPING_INFO_KEY = "checkoutShippingInfo";
const BILLING_INFO_KEY = "checkoutBillingInfo";
const PAYMENT_INFO_KEY = "checkoutPaymentInfo";

// Helper to get item from localStorage
const getItemFromLocalStorage = <T,>(key: string): T | null => { // Added trailing comma for TSX compatibility
  if (typeof window === 'undefined') return null;
  const item = localStorage.getItem(key);
  try {
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error(`Error parsing ${key} from localStorage:`, error);
    localStorage.removeItem(key); // Clear corrupted item
    return null;
  }
};

// Helper to set item in localStorage
const setItemInLocalStorage = <T,>(key: string, value: T | null): void => { // Added trailing comma for TSX compatibility
  if (typeof window === 'undefined') return;
  if (value === null) {
    localStorage.removeItem(key);
  } else {
    localStorage.setItem(key, JSON.stringify(value));
  }
};

export function CheckoutProvider({ children }: { children: React.ReactNode }) {
  const [shippingInfo, setShippingInfoState] = useState<ShippingInfo | null>(() => getItemFromLocalStorage<ShippingInfo>(SHIPPING_INFO_KEY));
  const [billingInfo, setBillingInfoState] = useState<BillingInfo | null>(() => getItemFromLocalStorage<BillingInfo>(BILLING_INFO_KEY));
  const [paymentInfo, setPaymentInfoState] = useState<PaymentInfo | null>(() => getItemFromLocalStorage<PaymentInfo>(PAYMENT_INFO_KEY));

  const setShippingInfo = useCallback((info: ShippingInfo | null) => {
    setShippingInfoState(info);
    setItemInLocalStorage(SHIPPING_INFO_KEY, info);
  }, []);

  const setBillingInfo = useCallback((info: BillingInfo | null) => {
    setBillingInfoState(info);
    setItemInLocalStorage(BILLING_INFO_KEY, info);
  }, []);

  const setPaymentInfo = useCallback((info: PaymentInfo | null) => {
    setPaymentInfoState(info);
    setItemInLocalStorage(PAYMENT_INFO_KEY, info);
  }, []);

  const resetCheckout = useCallback(() => {
    setShippingInfo(null);
    setBillingInfo(null);
    setPaymentInfo(null);
  }, [setShippingInfo, setBillingInfo, setPaymentInfo]);

  return (
    <CheckoutContext.Provider
      value={{
        shippingInfo,
        billingInfo,
        paymentInfo,
        setShippingInfo,
        setBillingInfo,
        setPaymentInfo,
        resetCheckout,
      }}
    >
      {children}
    </CheckoutContext.Provider>
  )
}

export function useCheckout() {
  const context = useContext(CheckoutContext)
  if (context === undefined) {
    throw new Error("useCheckout must be used within a CheckoutProvider")
  }
  return context
}
