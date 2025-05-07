"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Edit, Trash2 } from "lucide-react"
import { getProductById } from "@/lib/products"
import { useProductAdmin } from "@/context/product-admin-context"
import DeleteProductDialog from "@/components/admin/delete-product-dialog"
import type { Product } from "@/lib/types"

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { deleteProduct } = useProductAdmin()
  const [product, setProduct] = useState<Product | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  useEffect(() => {
    const fetchedProduct = getProductById(params.id)
    if (fetchedProduct) {
      setProduct(fetchedProduct)
    } else {
      router.push("/admin/products")
    }
  }, [params.id, router])

  const handleDelete = () => {
    if (product) {
      deleteProduct(product.id)
      setDeleteDialogOpen(false)
      router.push("/admin/products")
    }
  }

  if (!product) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight ml-2">{product.name}</h1>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setDeleteDialogOpen(true)}>
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
          <Button onClick={() => router.push(`/admin/products/${product.id}/edit`)}>
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Product Image</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative aspect-square rounded-md overflow-hidden border">
              <Image src={product.image || "/placeholder.svg"} alt={product.name} fill className="object-cover" />
            </div>
            <div className="mt-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">ID:</span>
                <span className="text-sm text-muted-foreground">{product.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Category:</span>
                <Badge variant="outline" className="capitalize">
                  {product.category.replace("-", " ")}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Brand:</span>
                <span className="text-sm">{product.brand}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Status:</span>
                <Badge variant={product.inStock ? "default" : "destructive"}>
                  {product.inStock ? "In Stock" : "Out of Stock"}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Rating:</span>
                <span className="text-sm">
                  {product.rating} ({product.reviewCount} reviews)
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <Tabs defaultValue="details">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Product Information</CardTitle>
                <TabsList>
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="pricing">Pricing</TabsTrigger>
                  <TabsTrigger value="tags">Tags</TabsTrigger>
                </TabsList>
              </div>
            </CardHeader>
            <CardContent>
              <TabsContent value="details" className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium">Description</h3>
                  <p className="text-muted-foreground mt-1">{product.description}</p>
                </div>
                <div>
                  <h3 className="text-lg font-medium">Features</h3>
                  <ul className="list-disc list-inside mt-1 text-muted-foreground">
                    <li>Premium quality materials</li>
                    <li>Designed for pet comfort and safety</li>
                    <li>Easy to clean and maintain</li>
                    <li>Durable construction</li>
                  </ul>
                </div>
              </TabsContent>
              <TabsContent value="pricing" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-lg font-medium">Current Price</h3>
                    <p className="text-2xl font-bold mt-1">${product.price.toFixed(2)}</p>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium">Original Price</h3>
                    <p className="text-2xl font-bold mt-1 text-muted-foreground">${product.originalPrice.toFixed(2)}</p>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-medium">Discount</h3>
                  <p className="text-muted-foreground mt-1">
                    {product.discount > 0 ? (
                      <Badge variant="destructive">{product.discount}% OFF</Badge>
                    ) : (
                      "No discount applied"
                    )}
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-medium">Profit Margin</h3>
                  <div className="h-2 bg-muted rounded-full overflow-hidden mt-2">
                    <div className="h-full bg-primary" style={{ width: "35%" }} />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Estimated profit margin: 35%</p>
                </div>
              </TabsContent>
              <TabsContent value="tags" className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium">Product Tags</h3>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {product.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-medium">Related Categories</h3>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <Badge variant="outline">Pet Supplies</Badge>
                    <Badge variant="outline">Animal Care</Badge>
                    <Badge variant="outline" className="capitalize">
                      {product.category.replace("-", " ")}
                    </Badge>
                  </div>
                </div>
              </TabsContent>
            </CardContent>
          </Tabs>
        </Card>
      </div>

      <DeleteProductDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDelete}
        productName={product.name}
      />
    </div>
  )
}
