import Image from "next/image";
import { Camera } from "lucide-react";
import { CityDetails } from "@/lib/types";

interface CityGalleryProps {
  city: CityDetails;
}

export default function CityGallery({ city }: CityGalleryProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="bg-purple-500/10 p-3 rounded-lg">
          <Camera className="h-6 w-6 text-purple-400" />
        </div>
        <h2 className="text-2xl font-bold text-white">갤러리</h2>
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {city.gallery_images.map((image, index) => (
          <div
            key={index}
            className="group relative aspect-video overflow-hidden rounded-xl border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300"
          >
            <Image
              src={image}
              alt={`${city.name_ko} 갤러리 이미지 ${index + 1}`}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-500"
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />

            {/* Overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {/* Image Number */}
            <div className="absolute bottom-4 right-4 bg-purple-500/80 backdrop-blur-sm text-white text-sm font-semibold px-3 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              {index + 1} / {city.gallery_images.length}
            </div>
          </div>
        ))}
      </div>

      {/* Info Text */}
      <p className="text-sm text-gray-400 text-center">
        {city.name_ko}의 다양한 모습을 확인해보세요
      </p>
    </div>
  );
}
