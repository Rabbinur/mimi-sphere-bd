"use client"

import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel"
import { ArrowRight, Clock } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"

import { useFeaturedProductQuery } from "@/components/Redux/RTK/productApi"
import Loader from "@/components/custom/Loader"
import ProductCard from "@/components/ui/ProductCard"
import TitleBadge from "@/components/ui/TitleBadge"
import type { TProduct } from "@/types"

const TopSellingSection = () => {
  const { data, isLoading } = useFeaturedProductQuery(undefined)
  const [timeLeft, setTimeLeft] = useState({
    hours: 24,
    minutes: 0,
    seconds: 0,
  })

  // Countdown timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 }
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 }
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 }
        }
        return prev
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  if (isLoading) {
    return <Loader />
  }

  const products: TProduct[] = data?.data || []

  // Format time with leading zeros
  const formatTime = (time: number) => time.toString().padStart(2, "0")

  return (
    <section className="container mx-auto py-8 px-4 sm:px-6">
      {/* Header with Flash Sale and Timer */}
      <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <TitleBadge title="Today's Special Offers" />


        <div className="flex flex-col sm:flex-row items-center gap-4">
          {/* Countdown Timer */}
          <div className="flex items-center gap-1 bg-gray-100 px-4 py-2 rounded-full">
            <Clock className="h-4 w-4 text-gray-500 mr-1" />
            <span className="text-sm font-medium">Ends in:</span>
            <div className="flex items-center gap-1">
              <span className="bg-gray-800 text-white px-2 py-1 rounded-md text-sm font-mono">
                {formatTime(timeLeft.hours)}
              </span>
              <span className="text-gray-800">:</span>
              <span className="bg-gray-800 text-white px-2 py-1 rounded-md text-sm font-mono">
                {formatTime(timeLeft.minutes)}
              </span>
              <span className="text-gray-800">:</span>
              <span className="bg-gray-800 text-white px-2 py-1 rounded-md text-sm font-mono">
                {formatTime(timeLeft.seconds)}
              </span>
            </div>
          </div>

          <Link
            href="/shop"
            className="flex items-center gap-1 text-primary hover:text-primary/80 font-medium transition-colors"
          >
            View All Deals
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-lg overflow-hidden border">
        {/* Product Carousel */}
        <div className="p-4">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {products.map((product) => (
                <CarouselItem
                  key={product._id}
                  className="pl-2 md:pl-4 basis-1/2 sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
                >
                  <ProductCard product={product} />
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      </div>
    </section>
  )
}

export default TopSellingSection
