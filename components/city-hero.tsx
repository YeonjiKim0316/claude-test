import Image from "next/image";
import { MapPin } from "lucide-react";
import { CityWithDetails } from "@/lib/database.types";

interface CityHeroProps {
  city: CityWithDetails;
}

export default function CityHero({ city }: CityHeroProps) {
  return (
    <div className="relative h-[500px] w-full overflow-hidden">
      {/* Background Image */}
      <Image
        src={city.image_url}
        alt={city.name_ko}
        fill
        className="object-cover"
        priority
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent" />

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Badge */}
          {city.badge && (
            <div className="inline-block mb-4">
              <span
                className={`px-4 py-1.5 rounded-full text-sm font-bold shadow-lg ${
                  city.badge === "Popular"
                    ? "bg-gradient-to-r from-orange-500 to-pink-500 text-white"
                    : "bg-gradient-to-r from-green-500 to-emerald-500 text-white"
                }`}
              >
                {city.badge === "Popular" ? "인기" : "트렌딩"}
              </span>
            </div>
          )}

          {/* City Name */}
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
            {city.name_ko}
          </h1>

          {/* Region */}
          <div className="flex items-center gap-2 text-xl text-gray-300 mb-6">
            <MapPin className="h-6 w-6" />
            <span>{city.region}</span>
          </div>

          {/* Description */}
          <p className="text-lg text-gray-200 max-w-3xl leading-relaxed">
            {city.description}
          </p>
        </div>
      </div>
    </div>
  );
}
