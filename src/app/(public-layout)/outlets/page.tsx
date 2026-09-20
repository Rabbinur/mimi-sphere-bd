import { Metadata } from "next";
import { Info, MapPin, Phone, Clock, ExternalLink, Navigation } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Outlet Locations | Mimi Sphere",
  description: "Visit our outlet stores in Mirpur 1 and Uttara, Dhaka for exclusive styles and a premium shopping experience.",
};

interface Outlet {
  id: string;
  name: string;
  city: string;
  address: string;
  hotline: string;
  hours: string;
  mapQuery: string;
  googleMapsUrl: string;
}

const OUTLETS: Outlet[] = [
  {
    id: "mirpur-1",
    name: "Mirpur 1",
    city: "Dhaka",
    address: "Rupayan Latifa Shamsuddin Square (opposite of Sony Square), 1st Floor, Mirpur Section 1, Dhaka",
    hotline: "01332502911",
    hours: "10:00 AM - 10:00 PM (Open Every Day)",
    mapQuery: "Rupayan Latifa Shamsuddin Square Mirpur 1 Dhaka",
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Rupayan+Latifa+Shamsuddin+Square+Mirpur+1+Dhaka",
  },
  {
    id: "uttara",
    name: "Uttara",
    city: "Dhaka",
    address: "Level 3, Plot - 67 (Meena Bazar Building), Gausul Azam Avenue, Sector 14, Uttara, Dhaka 1230",
    hotline: "01332502910",
    hours: "10:00 AM - 10:00 PM (Open Every Day)",
    mapQuery: "Meena Bazar Gausul Azam Avenue Sector 14 Uttara Dhaka",
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Meena+Bazar+Gausul+Azam+Avenue+Sector+14+Uttara+Dhaka",
  },
];

export default function OutletsPage() {
  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      {/* 1. Hero Banner matching reference screenshot */}
      <div className="relative w-full h-56 sm:h-72 md:h-80 bg-slate-900 overflow-hidden flex items-center justify-center">
        {/* Background Retail Store Interior Image */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-40 scale-105 transition-transform duration-1000"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1600&auto=format&fit=crop')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/30" />

        <div className="relative z-10 text-center px-4">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-widest uppercase drop-shadow-md">
            OUTLET LOCATIONS
          </h1>
          <p className="text-xs sm:text-sm md:text-base text-slate-200 mt-2 font-medium tracking-wide">
            Experience our premium collection in person
          </p>
        </div>
      </div>

      {/* 2. Subheader Text */}
      <div className="container mx-auto px-4 max-w-5xl text-center pt-10 pb-6">
        <span className="inline-block bg-slate-200/80 text-slate-800 text-xs sm:text-sm font-extrabold px-4 py-1.5 rounded-md uppercase tracking-wider">
          Discover Our Fashion Outlets
        </span>
        <p className="text-xs sm:text-sm md:text-base text-slate-600 mt-3 max-w-xl mx-auto leading-relaxed">
          Visit our outlet for exclusive styles and a premium shopping experience. Find your look!
        </p>
      </div>

      {/* 3. Outlets Grid with Info and Google Maps */}
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-4">
          {OUTLETS.map((outlet) => (
            <div
              key={outlet.id}
              className="bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col justify-between"
            >
              {/* Outlet Info Header */}
              <div className="p-5 sm:p-6 space-y-3">
                {/* Title Badge */}
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-amber-500 text-white flex items-center justify-center shrink-0">
                    <Info className="w-4 h-4 fill-current" />
                  </div>
                  <h2 className="text-base sm:text-lg font-bold text-slate-900">
                    {outlet.name} ({outlet.city})
                  </h2>
                </div>

                {/* Address */}
                <div className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  <strong className="text-slate-900 font-bold">Address: </strong>
                  {outlet.address}
                </div>

                {/* Hotline */}
                <div className="text-xs sm:text-sm text-slate-700 flex items-center gap-1.5">
                  <strong className="text-slate-900 font-bold">Outlet Hotline: </strong>
                  <a
                    href={`tel:${outlet.hotline}`}
                    className="text-primary hover:underline font-semibold"
                  >
                    {outlet.hotline}
                  </a>
                </div>

                {/* Hours */}
                <div className="text-xs text-slate-500 flex items-center gap-1.5 pt-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>{outlet.hours}</span>
                </div>
              </div>

              {/* Google Maps Embed Frame */}
              <div className="relative w-full h-72 sm:h-80 bg-slate-100 border-t border-slate-100">
                <iframe
                  title={`Map location for ${outlet.name}`}
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(outlet.mapQuery)}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                  className="w-full h-full border-0"
                  loading="lazy"
                  allowFullScreen
                />
              </div>

              {/* Card Footer Actions */}
              <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                <a
                  href={`tel:${outlet.hotline}`}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-primary transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-primary" />
                  <span>Call Store</span>
                </a>

                <a
                  href={outlet.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:text-primary/80 transition-colors bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-2xs hover:shadow-xs"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Get Directions</span>
                  <ExternalLink className="w-3 h-3 ml-0.5 opacity-60" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
