"use client";

import Image from "next/image";
import { Minus, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart, type CartItem } from "@/context/cart-context";

interface CartItemProps {
  item: CartItem;
}

export default function CartItemComponent({ item }: CartItemProps) {
  const { updateQuantity, removeItem } = useCart();

  return (
    <div className="flex py-4 border-b">
      <div className="relative h-20 w-20 rounded-md overflow-hidden flex-shrink-0">
        <Image
          src={item.image || "/placeholder.svg"}
          alt={item.name}
          fill
          className="object-cover"
        />
      </div>

      <div className="ml-4 flex-grow">
        <div className="flex justify-between">
          <h3 className="text-sm font-medium line-clamp-1">{item.name}</h3>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={() => removeItem(item.id)}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Remove</span>
          </Button>
        </div>

        <p className="text-xs text-muted-foreground mt-1">{item.brand}</p>

        <div className="flex justify-between items-center mt-2">
          <div className="flex items-center border rounded-md">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-none"
              onClick={() => updateQuantity(item.id, item.quantity - 1)}
            >
              <Minus className="h-3 w-3" />
              <span className="sr-only">Decrease quantity</span>
            </Button>

            <span className="w-8 text-center text-sm">{item.quantity}</span>

            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-none"
              onClick={() => updateQuantity(item.id, item.quantity + 1)}
            >
              <Plus className="h-3 w-3" />
              <span className="sr-only">Increase quantity</span>
            </Button>
          </div>

          <div className="text-right">
            <p className="text-sm font-medium">
              ${(item.price * item.quantity).toFixed(2)}
            </p>
            {item.quantity > 1 && (
              <p className="text-xs text-muted-foreground">
                ${item.price.toFixed(2)} each
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

