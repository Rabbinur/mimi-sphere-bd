"use client"

import { useState } from "react"
import { ArrowLeft, Heart, Search, ShoppingBag, ShoppingCart, Trash2 } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import UserHeader from "@/components/custom/UserHeader"

export default function WishlistPage() {
  const [wishlistItems, setWishlistItems] = useState([
    {
      id: 1,
      name: "Wireless Noise Cancelling Headphones",
      image: "https://assets.ajio.com/medias/sys_master/root/20240417/geQf/661ff89805ac7d77bb1463f8/-473Wx593H-467258681-black-MODEL.jpg",
      price: "৳24,500",
      originalPrice: "৳29,999",
      discount: "20%",
      inStock: true,
    },
    {
      id: 2,
      name: "Smart Fitness Watch",
      image: "https://assets.ajio.com/medias/sys_master/root/20240417/geQf/661ff89805ac7d77bb1463f8/-473Wx593H-467258681-black-MODEL.jpg",
      price: "৳10,999",
      originalPrice: "৳14,500",
      discount: "25%",
      inStock: true,
    },
    {
      id: 3,
      name: "Portable Bluetooth Speaker",
      image: "https://assets.ajio.com/medias/sys_master/root/20240417/geQf/661ff89805ac7d77bb1463f8/-473Wx593H-467258681-black-MODEL.jpg",
      price: "৳7,500",
      originalPrice: "৳9,999",
      discount: "25%",
      inStock: false,
    },
    {
      id: 4,
      name: "Wireless Charging Pad",
      image: "https://assets.ajio.com/medias/sys_master/root/20240417/geQf/661ff89805ac7d77bb1463f8/-473Wx593H-467258681-black-MODEL.jpg",
      price: "৳3,600",
      originalPrice: "৳4,800",
      discount: "25%",
      inStock: true,
    },
  ])

  const removeFromWishlist = (id: any) => {
    setWishlistItems(wishlistItems.filter((item) => item.id !== id))
  }

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-purple-50 to-blue-50">
      {/* Mobile Header */}
      <UserHeader
        title="Wishlist"
        isFilterOpen={false}
        setIsFilterOpen={() => { }}
        showSearch={false}
      />
      {/* Main Content */}
      <main className="flex-1 px-4 py-6 container mx-auto md:py-8">
        {/* Search Bar - Mobile Only */}
        <div className="mb-4 md:hidden">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Search wishlist..." className="pl-8" />
          </div>
        </div>

        {/* Wishlist Items */}
        <div className="space-y-4">
          {wishlistItems.length === 0 ? (
            <Card className="bg-white">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <div className="rounded-full bg-pink-100 p-3">
                  <Heart className="h-6 w-6 text-pink-500" />
                </div>
                <h3 className="mt-4 text-lg font-medium">Your wishlist is empty</h3>
                <p className="mt-1 text-center text-sm text-muted-foreground">
                  Save items you love to your wishlist and they'll appear here.
                </p>
                <Button className="mt-4 bg-gradient-to-r from-primary/80 to-primary hover:from-primary/80 hover:to-primary">
                  Start Shopping
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {wishlistItems.map((item) => (
                <Card key={item.id} className="overflow-hidden bg-white shadow-md transition-all hover:shadow-lg">
                  <CardContent className="p-0">
                    <div className="relative">
                      <Image
                        src={item.image || "https://assets.ajio.com/medias/sys_master/root/20240417/geQf/661ff89805ac7d77bb1463f8/-473Wx593H-467258681-black-MODEL.jpg"}
                        alt={item.name}
                        width={300}
                        height={300}
                        className="h-48 w-full object-cover"
                      />
                      {item.discount && (
                        <Badge className="absolute left-2 top-2 bg-gradient-to-r from-pink-500 to-rose-500">
                          {item.discount} OFF
                        </Badge>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-2 rounded-full bg-white/80 hover:bg-white"
                        onClick={() => removeFromWishlist(item.id)}
                      >
                        <Trash2 className="h-4 w-4 text-rose-500" />
                      </Button>
                    </div>
                    <div className="p-4">
                      <h3 className="line-clamp-2 text-sm font-medium">{item.name}</h3>
                      <div className="mt-2 flex items-center gap-2">
                        <p className="text-base font-bold">{item.price}</p>
                        {item.originalPrice && (
                          <p className="text-sm text-muted-foreground line-through">{item.originalPrice}</p>
                        )}
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {item.inStock ? (
                          <span className="text-green-600">In Stock</span>
                        ) : (
                          <span className="text-red-500">Out of Stock</span>
                        )}
                      </p>
                      <Button
                        className="mt-3 w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                        disabled={!item.inStock}
                      >
                        <ShoppingBag className="mr-2 h-4 w-4" />
                        Add to Cart
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

