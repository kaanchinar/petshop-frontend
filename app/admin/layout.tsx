import type React from "react"
import type { Metadata } from "next"
import { redirect } from "next/navigation"
import AdminSidebar from "@/components/admin/admin-sidebar"
import AdminHeader from "@/components/admin/admin-header"
import { ProductAdminProvider } from "@/context/product-admin-context"

export const metadata: Metadata = {
  title: "Admin Dashboard - PetPals Shop",
  description: "Manage your pet shop products and orders",
}

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  // In a real app, you would check for authentication here
  // For now, we'll just simulate it
  const isAuthenticated = true

  if (!isAuthenticated) {
    redirect("/sign-in")
  }

  return (
    <ProductAdminProvider>
      <div className="min-h-screen bg-muted/30">
        <div className="flex h-screen overflow-hidden">
          {/* Sidebar */}
          <AdminSidebar />

          {/* Main Content */}
          <div className="flex flex-col flex-1 overflow-hidden">
            <AdminHeader />
            <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
          </div>
        </div>
      </div>
    </ProductAdminProvider>
  )
}
