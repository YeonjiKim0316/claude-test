import { Sparkles, CheckCircle, XCircle } from "lucide-react";
import { CityWithDetails } from "@/lib/database.types";

interface CityDescriptionProps {
  city: CityWithDetails;
}

export default function CityDescription({ city }: CityDescriptionProps) {
  return (
    <div className="space-y-8">
      {/* Highlights Section */}
      <div className="bg-slate-800/50 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-purple-500/10 p-3 rounded-lg">
            <Sparkles className="h-6 w-6 text-purple-400" />
          </div>
          <h2 className="text-2xl font-bold text-white">주요 특징</h2>
        </div>
        <ul className="space-y-3">
          {city.city_details?.highlights?.map((highlight, index) => (
            <li key={index} className="flex items-start gap-3 text-gray-300">
              <div className="mt-1 flex-shrink-0">
                <div className="h-2 w-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500" />
              </div>
              <span className="leading-relaxed">{highlight}</span>
            </li>
          )) || <li className="text-gray-400">정보가 없습니다.</li>}
        </ul>
      </div>

      {/* Pros and Cons Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pros */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-green-500/20 rounded-2xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-green-500/10 p-3 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-400" />
            </div>
            <h3 className="text-xl font-bold text-white">장점</h3>
          </div>
          <ul className="space-y-3">
            {city.city_details?.pros?.map((pro, index) => (
              <li key={index} className="flex items-start gap-3 text-gray-300">
                <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                <span className="leading-relaxed">{pro}</span>
              </li>
            )) || <li className="text-gray-400">정보가 없습니다.</li>}
          </ul>
        </div>

        {/* Cons */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-red-500/20 rounded-2xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-red-500/10 p-3 rounded-lg">
              <XCircle className="h-6 w-6 text-red-400" />
            </div>
            <h3 className="text-xl font-bold text-white">단점</h3>
          </div>
          <ul className="space-y-3">
            {city.city_details?.cons?.map((con, index) => (
              <li key={index} className="flex items-start gap-3 text-gray-300">
                <XCircle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
                <span className="leading-relaxed">{con}</span>
              </li>
            )) || <li className="text-gray-400">정보가 없습니다.</li>}
          </ul>
        </div>
      </div>
    </div>
  );
}
