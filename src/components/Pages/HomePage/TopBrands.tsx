"use client";

import { Card } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const brands = [
  {
    id: 1,
    src: "https://static.poder360.com.br/2021/10/apple-macbook.png",
    alt: "Conductor",
  },
  {
    id: 2,
    src: "https://static.poder360.com.br/2021/10/apple-macbook.png",
    alt: "Mosaic",
  },
  {
    id: 3,
    src: "https://static.poder360.com.br/2021/10/apple-macbook.png",
    alt: "Zencargo",
  },
  {
    id: 4,
    src: "https://static.poder360.com.br/2021/10/apple-macbook.png",
    alt: "Seedlegals",
  },
  {
    id: 5,
    src: "https://static.poder360.com.br/2021/10/apple-macbook.png",
    alt: "Coast",
  },
  {
    id: 6,
    src: "https://static.poder360.com.br/2021/10/apple-macbook.png",
    alt: "Global Payments",
  },
  {
    id: 7,
    src: "https://static.poder360.com.br/2021/10/apple-macbook.png",
    alt: "Skupos",
  },
  {
    id: 8,
    src: "https://static.poder360.com.br/2021/10/apple-macbook.png",
    alt: "LinkPool",
  },
];

const TopBrands = () => {
  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">Top Brands</h2>
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent>
            {brands.map((brand) => (
              <CarouselItem key={brand.id} className=" basis-1/2 md:basis-1/3 lg:basis-1/6">
                <Card className="p-4">
                  <img
                    src={brand.src}
                    alt={brand.alt}
                    className="w-full h-auto object-cover"
                  />
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100" />
          <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100" />
        </Carousel>
      </div>
    </section>
  );
};

export default TopBrands;