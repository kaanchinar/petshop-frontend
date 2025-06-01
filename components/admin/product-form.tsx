"use client"

import { useState } from "react"
import Image from "next/image"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { X, Plus, Upload } from "lucide-react"
import type { Product } from "@/lib/types"

const productSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
  price: z.coerce.number().positive({ message: "Price must be positive" }),
  originalPrice: z.coerce.number().positive({ message: "Original price must be positive" }),
  discount: z.coerce
    .number()
    .min(0, { message: "Discount cannot be negative" })
    .max(100, { message: "Discount cannot exceed 100%" }),
  category: z.string({ required_error: "Please select a category" }).min(1, { message: "Category is required"}), // Ensured non-empty
  brand: z.string().min(1, { message: "Brand is required" }),
  reviewCount: z.coerce.number().int().nonnegative({ message: "Review count cannot be negative" }),
  inStock: z.boolean(), // Removed .default(true)
  isNew: z.boolean(),   // Removed .default(false)
  image: z.string({ required_error: "Image URL is required" }).min(1, {message: "Image URL cannot be empty"}),
});

type ProductFormValues = z.infer<typeof productSchema>;

interface ProductFormProps {
  initialData?: Product
  onSubmit: (data: Omit<Product, "id">) => void
  onCancel?: () => void
  isSubmitting?: boolean; // Added isSubmitting prop
}

export default function ProductForm({ initialData, onSubmit, onCancel, isSubmitting }: ProductFormProps) {

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: initialData
      ? {
          ...initialData,
          image: initialData.image || "/placeholder.svg?height=300&width=300", 
        }
      : {
          name: "",
          description: "",
          price: 0,
          originalPrice: 0,
          discount: 0,
          category: "",
          brand: "",
          reviewCount: 0,
          inStock: true,
          isNew: false,
          image: "/placeholder.svg?height=300&width=300",
        },
  })

  const handleSubmit = (values: ProductFormValues) => {
    // Add rating and tags for compatibility with Product type
    const productData = {
      ...values,
      rating: 0, // New products start with 0 rating
      tags: [] // Empty tags array for new products
    };
    onSubmit(productData);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Premium Cat Food" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="High-quality food for your pet..." className="min-h-[120px]" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="cats">Cats</SelectItem>
                        <SelectItem value="dogs">Dogs</SelectItem>
                        <SelectItem value="other-animals">Other Animals</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="brand"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Brand</FormLabel>
                    <FormControl>
                      <Input placeholder="PetNutrition" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price ($)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="originalPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Original Price ($)</FormLabel> {/* Corrected: Closing tag */}
                    <FormControl>
                      <Input type="number" step="0.01" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="discount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Discount (%)</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" max="100" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="space-y-6">
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Image</FormLabel>
                  <FormControl>
                    <div className="space-y-4">
                      <div className="relative aspect-square max-w-[300px] rounded-md overflow-hidden border">
                        <Image
                          src={field.value || "/placeholder.svg?height=300&width=300"}
                          alt="Product preview"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <Input
                          type="text"
                          placeholder="Image URL"
                          value={field.value || ""}
                          onChange={field.onChange}
                        />
                        <Button type="button" variant="outline" size="icon">
                          <Upload className="h-4 w-4" />
                          <span className="sr-only">Upload</span>
                        </Button>
                      </div>
                    </div>
                  </FormControl>
                  <FormDescription>Enter an image URL or upload an image.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="reviewCount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Review Count</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="inStock"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>In Stock</FormLabel>
                      <FormDescription>This product is available for purchase</FormDescription>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isNew"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>New Product</FormLabel>
                      <FormDescription>Mark as a new product</FormDescription>
                    </div>
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>

        <Separator />

        <div className="flex justify-end gap-4">
          <Button 
            type="button" 
            variant="outline" 
            disabled={isSubmitting} 
            onClick={() => {
              if (onCancel) {
                onCancel();
              } else {
                form.reset(initialData || { 
                  name: "", 
                  description: "", 
                  price: 0, 
                  originalPrice: 0, 
                  discount: 0, 
                  category: "", 
                  brand: "", 
                  reviewCount: 0, 
                  inStock: true, 
                  isNew: false, 
                  image: "/placeholder.svg?height=300&width=300" 
                });
              }
            }}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (initialData ? 'Updating...' : 'Creating...') : (initialData ? "Update Product" : "Create Product")}
          </Button>
        </div>
      </form>
    </Form>
  )
}
