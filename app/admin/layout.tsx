import type React from "react"
import type { Metadata } from "next"
import AdminSidebar from "@/components/admin/admin-sidebar"
import AdminHeader from "@/components/admin/admin-header"
import { AdminGuard } from "@/components/admin/admin-guard"
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
  return (
    <AdminGuard>
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
    </AdminGuard>
  )
}
