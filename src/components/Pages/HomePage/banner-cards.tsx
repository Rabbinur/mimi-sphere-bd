import Link from "next/link";
import Image from "next/image";

const bannerData = [
  {
    subtitle: "Latest Deal",
    title: "iPhone 15 Pro Max",
    image:
      "https://dazzle.sgp1.cdn.digitaloceanspaces.com/29738/iphone-16-pro-max-white-price-in-bangladesh.png",
    bgColor: "bg-[#E8F5E9]",
  },
  {
    subtitle: "Get 60% Off",
    title: "Instax Mini 11 Camera",
    image:
      "https://dazzle.sgp1.cdn.digitaloceanspaces.com/29738/iphone-16-pro-max-white-price-in-bangladesh.png",
    bgColor: "bg-[#FCE4EC]",
  },
  {
    subtitle: "Start From ৳3,000",
    title: "Airpod Headphone",
    image:
      "https://www.apple.com/v/iphone-16/d/images/overview/apple-intelligence/apple_intelligence_endframe__ewm1810mnb0i_xlarge.jpg",
    bgColor: "bg-[#FFDDC1]",
  },
];

const  BannerCards = () => {
  return (
    <div className="container mx-auto p-4 hidden md:block">
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {bannerData.map((banner, index) => (
          <div
            key={index}
            className={`${banner.bgColor} relative overflow-hidden rounded-2xl p-6 flex flex-col items-center`}
          >
            <div className="relative z-10 text-center">
              <p className="text-sm text-gray-600">{banner.subtitle}</p>
              <h3 className="mb-4 text-xl font-bold text-gray-900">
                {banner.title}
              </h3>
              <Link
                href="#"
                className="inline-flex items-center text-sm font-medium text-gray-900 hover:underline"
              >
                Shop Now
                <span className="ml-1">+</span>
              </Link>
            </div>
            <div className="mt-4">
              <Image
                src={banner.image || "/placeholder.svg"}
                alt={banner.title}
                width={160}
                height={160}
                className="w-24 h-24 sm:w-32 sm:h-32 object-contain"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
export default BannerCards